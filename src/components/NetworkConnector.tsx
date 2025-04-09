
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useWallet, Network } from '@/contexts/WalletContext';
import { Loader } from 'lucide-react';

interface NetworkConnectorProps {
  network: Network;
  onFetchNFTs?: () => Promise<void>;
  loading?: boolean;
}

const NetworkConnector: React.FC<NetworkConnectorProps> = ({ 
  network, 
  onFetchNFTs,
  loading = false
}) => {
  const { wallet, connectWallet, disconnectWallet, isWalletInstalled } = useWallet();
  
  const networkInfo = {
    ethereum: {
      name: 'Ethereum',
      buttonColor: 'bg-ethereum hover:bg-ethereum-dark',
      iconColor: 'text-ethereum'
    },
    polygon: {
      name: 'Polygon',
      buttonColor: 'bg-polygon hover:bg-polygon-dark',
      iconColor: 'text-polygon'
    }
  };
  
  const info = networkInfo[network];
  const isConnected = wallet[network].connected;
  
  const handleConnect = async () => {
    if (!isWalletInstalled) {
      window.open('https://metamask.io/download/', '_blank');
      return;
    }
    
    if (isConnected) {
      disconnectWallet(network);
    } else {
      await connectWallet(network);
      if (onFetchNFTs) {
        await onFetchNFTs();
      }
    }
  };
  
  const handleFetchNFTs = async () => {
    if (onFetchNFTs) {
      await onFetchNFTs();
    }
  };
  
  return (
    <Card className="p-4 flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0 md:space-x-4 bg-black/40 backdrop-blur-sm border-gray-700">
      <div className="flex items-center space-x-3">
        <div className={`w-10 h-10 rounded-full ${network === 'ethereum' ? 'bg-ethereum' : 'bg-polygon'} flex items-center justify-center`}>
          {network === 'ethereum' ? (
            <svg width="20" height="20" viewBox="0 0 784.37 1277.39" xmlns="http://www.w3.org/2000/svg">
              <path fill="#fff" d="m392.07 0-8.57 29.11v844.63l8.57 8.55 392.06-231.75z"/>
              <path fill="#fff" d="m392.07 0-392.07 650.54 392.07 231.75v-882.29z"/>
              <path fill="#fff" d="m392.07 956.52-4.83 5.89v302.33l4.83 14.1 392.3-552.08z"/>
              <path fill="#fff" d="m392.07 1278.84v-322.32l-392.07-229.76z"/>
              <path fill="#e3e3e3" d="m392.07 882.29 392.06-231.75-392.06-178.21z"/>
              <path fill="#e3e3e3" d="m0 650.54 392.07 231.75v-409.96z"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 38.4 33.5" xmlns="http://www.w3.org/2000/svg">
              <path fill="#fff" d="M29,10.2c-0.7-0.4-1.6-0.4-2.4,0L21,13.5l-3.8,2.1l-5.5,3.3c-0.7,0.4-1.6,0.4-2.4,0L5,16.3
                c-0.7-0.4-1.2-1.2-1.2-2.1v-5c0-0.8,0.4-1.6,1.2-2.1l4.3-2.5c0.7-0.4,1.6-0.4,2.4,0L16,7.2c0.7,0.4,1.2,1.2,1.2,2.1v3.3l3.8-2.2V7
                c0-0.8-0.4-1.6-1.2-2.1l-8-4.7c-0.7-0.4-1.6-0.4-2.4,0L1.2,5C0.4,5.4,0,6.2,0,7v9.4c0,0.8,0.4,1.6,1.2,2.1l8.1,4.7
                c0.7,0.4,1.6,0.4,2.4,0l5.5-3.2l3.8-2.2l5.5-3.2c0.7-0.4,1.6-0.4,2.4,0l4.3,2.5c0.7,0.4,1.2,1.2,1.2,2.1v5c0,0.8-0.4,1.6-1.2,2.1
                L29,28.8c-0.7,0.4-1.6,0.4-2.4,0l-4.3-2.5c-0.7-0.4-1.2-1.2-1.2-2.1V21l-3.8,2.2v3.3c0,0.8,0.4,1.6,1.2,2.1l8.1,4.7
                c0.7,0.4,1.6,0.4,2.4,0l8.1-4.7c0.7-0.4,1.2-1.2,1.2-2.1V17c0-0.8-0.4-1.6-1.2-2.1L29,10.2z"/>
            </svg>
          )}
        </div>
        <div>
          <h3 className="font-bold text-white">{info.name}</h3>
          <p className="text-xs text-gray-400">
            {isConnected ? 
              `Connected: ${wallet[network].address?.slice(0, 6)}...${wallet[network].address?.slice(-4)}` : 
              'Not connected'}
          </p>
        </div>
      </div>
      
      <div className="flex space-x-2 w-full md:w-auto">
        {isConnected && onFetchNFTs && (
          <Button 
            variant="outline" 
            className="border-gray-600 hover:bg-gray-800 flex-1 md:flex-auto"
            onClick={handleFetchNFTs}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Loading
              </>
            ) : (
              'Refresh NFTs'
            )}
          </Button>
        )}
        
        <Button 
          onClick={handleConnect}
          className={`${isConnected ? 'bg-gray-700 hover:bg-gray-800' : info.buttonColor} flex-1 md:flex-auto`}
        >
          {isWalletInstalled ? 
            (isConnected ? 'Disconnect' : `Connect to ${info.name}`) : 
            'Install MetaMask'}
        </Button>
      </div>
    </Card>
  );
};

export default NetworkConnector;
