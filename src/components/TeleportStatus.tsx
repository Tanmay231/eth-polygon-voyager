
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TeleportRecord, useTeleporter } from '@/contexts/TeleporterContext';
import { useWallet } from '@/contexts/WalletContext';
import { ArrowRight, CheckCircle, Clock, XCircle, Loader } from 'lucide-react';

const TeleportStatus: React.FC = () => {
  const { teleportRecords, claimNFT } = useTeleporter();
  const { wallet } = useWallet();
  
  // Get the most recent teleport record
  const latestRecord = teleportRecords.length > 0 
    ? teleportRecords[teleportRecords.length - 1] 
    : null;
  
  if (!latestRecord) {
    return null;
  }
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'burning':
        return <Loader className="h-5 w-5 text-yellow-500 animate-spin" />;
      case 'generating_proof':
        return <Loader className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'waiting_confirmation':
        return <Clock className="h-5 w-5 text-teleport" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };
  
  const getStatusText = (record: TeleportRecord) => {
    switch (record.status) {
      case 'burning':
        return 'Burning NFT on Ethereum...';
      case 'generating_proof':
        return 'Generating Merkle proof...';
      case 'waiting_confirmation':
        return 'Ready to claim on Polygon';
      case 'completed':
        return 'Successfully teleported to Polygon';
      case 'failed':
        return `Failed: ${record.error || 'Unknown error'}`;
      default:
        return 'Unknown status';
    }
  };
  
  const canClaim = latestRecord.status === 'waiting_confirmation' && wallet.polygon.connected;
  
  return (
    <Card className="p-4 space-y-4 bg-black/40 backdrop-blur-sm border-gray-700">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg text-white">Teleport Status</h3>
        <div className="flex items-center space-x-2">
          {getStatusIcon(latestRecord.status)}
          <span className={`text-sm ${
            latestRecord.status === 'failed' ? 'text-red-400' : 
            latestRecord.status === 'completed' ? 'text-green-400' : 
            'text-gray-300'
          }`}>
            {getStatusText(latestRecord)}
          </span>
        </div>
      </div>
      
      <div className="flex items-center space-x-2 pt-2">
        <div className="flex-1 bg-ethereum/70 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-300">From Ethereum</p>
          <p className="font-medium text-white truncate">{latestRecord.nft.name}</p>
        </div>
        
        <ArrowRight className="w-6 h-6 text-teleport" />
        
        <div className="flex-1 bg-polygon/70 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-300">To Polygon</p>
          <p className="font-medium text-white truncate">{latestRecord.nft.name}</p>
        </div>
      </div>
      
      {latestRecord.txHash && (
        <div className="text-xs text-gray-400 text-center">
          TX: {latestRecord.txHash}
        </div>
      )}
      
      {canClaim && (
        <Button 
          onClick={() => claimNFT(latestRecord)}
          className="w-full bg-polygon hover:bg-polygon-dark"
        >
          Claim on Polygon
        </Button>
      )}
      
      {!canClaim && latestRecord.status === 'waiting_confirmation' && (
        <div className="text-xs text-yellow-400 text-center">
          Please connect to Polygon network to claim your NFT
        </div>
      )}
    </Card>
  );
};

export default TeleportStatus;
