
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

// Define the network types and states
export type Network = 'ethereum' | 'polygon';

export interface WalletState {
  ethereum: {
    address: string | null;
    connected: boolean;
    chainId: string | null;
  };
  polygon: {
    address: string | null;
    connected: boolean;
    chainId: string | null;
  };
}

// Context interface
interface WalletContextType {
  wallet: WalletState;
  connectWallet: (network: Network) => Promise<void>;
  disconnectWallet: (network: Network) => void;
  switchNetwork: (network: Network) => Promise<void>;
  isWalletInstalled: boolean;
}

// Create context with default values
const WalletContext = createContext<WalletContextType>({
  wallet: {
    ethereum: { address: null, connected: false, chainId: null },
    polygon: { address: null, connected: false, chainId: null }
  },
  connectWallet: async () => {},
  disconnectWallet: () => {},
  switchNetwork: async () => {},
  isWalletInstalled: false
});

// Hook to use the wallet context
export const useWallet = () => useContext(WalletContext);

// Provider component
export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wallet, setWallet] = useState<WalletState>({
    ethereum: { address: null, connected: false, chainId: null },
    polygon: { address: null, connected: false, chainId: null }
  });
  const [isWalletInstalled, setIsWalletInstalled] = useState<boolean>(false);

  // Network configuration
  const NETWORK_CONFIG = {
    ethereum: {
      chainId: '0x1', // Mainnet
      rpcUrls: ['https://mainnet.infura.io/v3/your-api-key'],
      chainName: 'Ethereum Mainnet',
      nativeCurrency: {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18
      },
      blockExplorerUrls: ['https://etherscan.io']
    },
    polygon: {
      chainId: '0x89', // Polygon Mainnet
      rpcUrls: ['https://polygon-rpc.com'],
      chainName: 'Polygon Mainnet',
      nativeCurrency: {
        name: 'MATIC',
        symbol: 'MATIC',
        decimals: 18
      },
      blockExplorerUrls: ['https://polygonscan.com']
    }
  };

  // Check if wallet is installed
  useEffect(() => {
    const checkWalletInstalled = () => {
      if (typeof window.ethereum !== 'undefined') {
        setIsWalletInstalled(true);
      } else {
        setIsWalletInstalled(false);
      }
    };

    checkWalletInstalled();
    
    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', () => {
        checkWalletInstalled();
        // Refresh state when accounts change
        if (wallet.ethereum.connected) {
          connectWallet('ethereum').catch(console.error);
        }
        if (wallet.polygon.connected) {
          connectWallet('polygon').catch(console.error);
        }
      });

      // Listen for chain changes
      window.ethereum.on('chainChanged', () => {
        // Refresh state when chain changes
        if (wallet.ethereum.connected) {
          connectWallet('ethereum').catch(console.error);
        }
        if (wallet.polygon.connected) {
          connectWallet('polygon').catch(console.error);
        }
      });
    }

    return () => {
      // Clean up event listeners
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, [wallet.ethereum.connected, wallet.polygon.connected]);

  // Connect wallet to a specific network
  const connectWallet = async (network: Network) => {
    if (!window.ethereum) {
      toast.error('MetaMask is not installed!');
      return;
    }

    try {
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      
      // Check if we're on the correct network
      const targetChainId = NETWORK_CONFIG[network].chainId;
      if (chainId !== targetChainId) {
        try {
          // Try to switch to the correct network
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: targetChainId }],
          });
        } catch (switchError: any) {
          // If the network is not added to MetaMask, add it
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [NETWORK_CONFIG[network]],
              });
            } catch (addError) {
              console.error('Error adding network:', addError);
              toast.error(`Failed to add ${network} network`);
              return;
            }
          } else {
            console.error('Error switching network:', switchError);
            toast.error(`Failed to switch to ${network} network`);
            return;
          }
        }
        
        // Get updated chain ID
        const updatedChainId = await window.ethereum.request({ method: 'eth_chainId' });
        
        setWallet(prev => ({
          ...prev,
          [network]: {
            address: accounts[0],
            connected: true,
            chainId: updatedChainId
          }
        }));
      } else {
        // We're already on the correct network
        setWallet(prev => ({
          ...prev,
          [network]: {
            address: accounts[0],
            connected: true,
            chainId
          }
        }));
      }
      
      toast.success(`Connected to ${network.charAt(0).toUpperCase() + network.slice(1)}`);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error('Failed to connect wallet');
    }
  };

  // Disconnect wallet from a specific network
  const disconnectWallet = (network: Network) => {
    setWallet(prev => ({
      ...prev,
      [network]: { address: null, connected: false, chainId: null }
    }));
    toast.info(`Disconnected from ${network.charAt(0).toUpperCase() + network.slice(1)}`);
  };

  // Switch between networks
  const switchNetwork = async (network: Network) => {
    if (!window.ethereum) {
      toast.error('MetaMask is not installed!');
      return;
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: NETWORK_CONFIG[network].chainId }],
      });
      
      toast.success(`Switched to ${network.charAt(0).toUpperCase() + network.slice(1)}`);
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [NETWORK_CONFIG[network]],
          });
          toast.success(`Added and switched to ${network.charAt(0).toUpperCase() + network.slice(1)}`);
        } catch (addError) {
          console.error('Error adding network:', addError);
          toast.error(`Failed to add ${network} network`);
        }
      } else {
        console.error('Error switching network:', switchError);
        toast.error(`Failed to switch to ${network} network`);
      }
    }
  };

  return (
    <WalletContext.Provider value={{ 
      wallet, 
      connectWallet, 
      disconnectWallet, 
      switchNetwork,
      isWalletInstalled
    }}>
      {children}
    </WalletContext.Provider>
  );
};

// Add TypeScript global interface for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}
