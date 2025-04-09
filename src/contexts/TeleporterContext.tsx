
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'sonner';
import { useWallet } from './WalletContext';

// Mock NFT interface
export interface NFT {
  id: string;
  tokenId: number;
  name: string;
  image: string;
  description: string;
  metadata: Record<string, any>;
  owner: string;
  network: 'ethereum' | 'polygon';
}

// Teleportation status type
export type TeleportStatus = 'idle' | 'burning' | 'generating_proof' | 'waiting_confirmation' | 'completed' | 'failed';

// Teleportation record interface
export interface TeleportRecord {
  id: string;
  nft: NFT;
  fromAddress: string;
  toAddress: string;
  timestamp: number;
  status: TeleportStatus;
  txHash?: string;
  proof?: string;
  error?: string;
}

// Context interface
interface TeleporterContextType {
  nfts: {
    ethereum: NFT[];
    polygon: NFT[];
  };
  teleportRecords: TeleportRecord[];
  loadingNFTs: boolean;
  fetchNFTs: (network: 'ethereum' | 'polygon') => Promise<void>;
  teleportNFT: (nft: NFT) => Promise<void>;
  claimNFT: (record: TeleportRecord) => Promise<void>;
  currentTeleport: TeleportRecord | null;
}

// Create context with default values
const TeleporterContext = createContext<TeleporterContextType>({
  nfts: {
    ethereum: [],
    polygon: []
  },
  teleportRecords: [],
  loadingNFTs: false,
  fetchNFTs: async () => {},
  teleportNFT: async () => {},
  claimNFT: async () => {},
  currentTeleport: null
});

// Hook to use the teleporter context
export const useTeleporter = () => useContext(TeleporterContext);

// Provider component
export const TeleporterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { wallet } = useWallet();
  
  const [nfts, setNFTs] = useState<{
    ethereum: NFT[];
    polygon: NFT[];
  }>({
    ethereum: [],
    polygon: []
  });
  
  const [teleportRecords, setTeleportRecords] = useState<TeleportRecord[]>([]);
  const [loadingNFTs, setLoadingNFTs] = useState<boolean>(false);
  const [currentTeleport, setCurrentTeleport] = useState<TeleportRecord | null>(null);

  // Mock NFT data (for demo purposes)
  const mockNFTs: Record<string, NFT[]> = {
    ethereum: [
      {
        id: 'eth-1',
        tokenId: 1,
        name: 'Cosmic Explorer #1',
        image: 'https://via.placeholder.com/300/627EEA/FFFFFF?text=NFT+1',
        description: 'A pioneering voyager exploring the Ethereum galaxy',
        metadata: {
          attributes: [
            { trait_type: 'Background', value: 'Deep Space' },
            { trait_type: 'Species', value: 'Etherean' },
            { trait_type: 'Rarity', value: 'Rare' }
          ]
        },
        owner: '0x123...abc',
        network: 'ethereum'
      },
      {
        id: 'eth-2',
        tokenId: 2,
        name: 'Nebula Navigator #42',
        image: 'https://via.placeholder.com/300/627EEA/FFFFFF?text=NFT+2',
        description: 'Traversing the digital cosmos with an ethereal glow',
        metadata: {
          attributes: [
            { trait_type: 'Background', value: 'Nebula' },
            { trait_type: 'Species', value: 'Navigator' },
            { trait_type: 'Rarity', value: 'Epic' }
          ]
        },
        owner: '0x123...abc',
        network: 'ethereum'
      },
      {
        id: 'eth-3',
        tokenId: 3,
        name: 'Celestial Voyager #7',
        image: 'https://via.placeholder.com/300/627EEA/FFFFFF?text=NFT+3',
        description: 'An interstellar entity born from the Ethereum blockchain',
        metadata: {
          attributes: [
            { trait_type: 'Background', value: 'Starfield' },
            { trait_type: 'Species', value: 'Celestial' },
            { trait_type: 'Rarity', value: 'Legendary' }
          ]
        },
        owner: '0x123...abc',
        network: 'ethereum'
      }
    ],
    polygon: []
  };

  // Fetch NFTs for a specific network
  const fetchNFTs = async (network: 'ethereum' | 'polygon') => {
    if (!wallet[network].connected) {
      toast.error(`Please connect to ${network} first`);
      return;
    }

    setLoadingNFTs(true);
    
    try {
      // In a real app, we would fetch from the blockchain
      // For demo, we'll use mock data with a timeout to simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setNFTs(prev => ({
        ...prev,
        [network]: mockNFTs[network]
      }));
      
      toast.success(`NFTs loaded from ${network}`);
    } catch (error) {
      console.error('Error fetching NFTs:', error);
      toast.error(`Failed to fetch NFTs from ${network}`);
    } finally {
      setLoadingNFTs(false);
    }
  };

  // Teleport an NFT from Ethereum to Polygon
  const teleportNFT = async (nft: NFT) => {
    if (!wallet.ethereum.connected) {
      toast.error('Please connect to Ethereum first');
      return;
    }

    // Create a new teleport record
    const teleportId = `teleport-${Date.now()}`;
    const newRecord: TeleportRecord = {
      id: teleportId,
      nft,
      fromAddress: wallet.ethereum.address || '',
      toAddress: wallet.ethereum.address || '', // Same address on Polygon
      timestamp: Date.now(),
      status: 'burning'
    };
    
    setTeleportRecords(prev => [...prev, newRecord]);
    setCurrentTeleport(newRecord);
    
    // Simulate the teleport process
    try {
      // Step 1: Burn NFT on Ethereum
      toast.info('Burning NFT on Ethereum...');
      await simulateTransaction();
      
      // Update record status
      updateTeleportStatus(teleportId, 'generating_proof', { 
        txHash: `0x${Math.random().toString(16).substring(2, 10)}` 
      });
      
      // Step 2: Generate proof
      toast.info('Generating Merkle proof...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Update record status
      updateTeleportStatus(teleportId, 'waiting_confirmation', { 
        proof: `0x${Math.random().toString(16).substring(2, 50)}` 
      });
      
      // Step 3: Ready for claiming
      toast.success('NFT ready to claim on Polygon!');
      
      // Remove from Ethereum NFTs
      setNFTs(prev => ({
        ...prev,
        ethereum: prev.ethereum.filter(item => item.id !== nft.id)
      }));
      
    } catch (error) {
      console.error('Error teleporting NFT:', error);
      toast.error('Failed to teleport NFT');
      
      // Update record status
      updateTeleportStatus(teleportId, 'failed', { 
        error: 'Transaction failed' 
      });
    }
  };

  // Claim an NFT on Polygon
  const claimNFT = async (record: TeleportRecord) => {
    if (!wallet.polygon.connected) {
      toast.error('Please connect to Polygon first');
      return;
    }

    if (record.status !== 'waiting_confirmation') {
      toast.error('This NFT is not ready to be claimed');
      return;
    }

    // Update record
    updateTeleportStatus(record.id, 'waiting_confirmation');
    
    try {
      // Simulate claiming transaction
      toast.info('Claiming NFT on Polygon...');
      await simulateTransaction();
      
      // Update record status
      updateTeleportStatus(record.id, 'completed', { 
        txHash: `0x${Math.random().toString(16).substring(2, 10)}` 
      });
      
      // Update NFTs in the state
      const claimedNFT: NFT = {
        ...record.nft,
        id: `poly-${record.nft.tokenId}`,
        network: 'polygon',
        owner: wallet.polygon.address || ''
      };
      
      setNFTs(prev => ({
        ...prev,
        polygon: [...prev.polygon, claimedNFT]
      }));
      
      toast.success('NFT successfully claimed on Polygon!');
    } catch (error) {
      console.error('Error claiming NFT:', error);
      toast.error('Failed to claim NFT');
      
      // Update record status
      updateTeleportStatus(record.id, 'failed', { 
        error: 'Claim transaction failed' 
      });
    }
  };

  // Helper function to update teleport status
  const updateTeleportStatus = (id: string, status: TeleportStatus, additionalData: Record<string, any> = {}) => {
    setTeleportRecords(prev => 
      prev.map(record => 
        record.id === id 
          ? { ...record, status, ...additionalData } 
          : record
      )
    );
    
    // Update current teleport if it's the same
    setCurrentTeleport(current => 
      current?.id === id 
        ? { ...current, status, ...additionalData } 
        : current
    );
  };

  // Helper function to simulate a transaction
  const simulateTransaction = async () => {
    return new Promise<void>((resolve, reject) => {
      // 90% chance of success
      const success = Math.random() < 0.9;
      
      setTimeout(() => {
        if (success) {
          resolve();
        } else {
          reject(new Error('Transaction failed'));
        }
      }, 2000);
    });
  };

  return (
    <TeleporterContext.Provider value={{
      nfts,
      teleportRecords,
      loadingNFTs,
      fetchNFTs,
      teleportNFT,
      claimNFT,
      currentTeleport
    }}>
      {children}
    </TeleporterContext.Provider>
  );
};
