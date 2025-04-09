
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NFT } from '@/contexts/TeleporterContext';

interface NFTCardProps {
  nft: NFT;
  onTeleport?: (nft: NFT) => void;
  disabled?: boolean;
}

const NFTCard: React.FC<NFTCardProps> = ({ nft, onTeleport, disabled = false }) => {
  return (
    <Card className="overflow-hidden bg-black/40 backdrop-blur-sm border-gray-700 card-glow">
      <div className="relative">
        <img 
          src={nft.image} 
          alt={nft.name} 
          className="w-full h-48 object-cover"
        />
        <Badge 
          className={`absolute top-2 right-2 ${
            nft.network === 'ethereum' 
              ? 'network-badge-ethereum' 
              : 'network-badge-polygon'
          }`}
        >
          {nft.network === 'ethereum' ? 'Ethereum' : 'Polygon'}
        </Badge>
      </div>
      
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-lg text-white">{nft.name}</CardTitle>
        <CardDescription className="text-gray-400">
          Token ID: {nft.tokenId}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-gray-300 line-clamp-2">{nft.description}</p>
        
        <div className="mt-2 space-y-1">
          {nft.metadata?.attributes?.slice(0, 3).map((attr: any, i: number) => (
            <div key={i} className="flex justify-between text-xs">
              <span className="text-gray-400">{attr.trait_type}:</span>
              <span className="text-gray-200">{attr.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 bg-black/20">
        {nft.network === 'ethereum' && onTeleport && (
          <Button 
            onClick={() => onTeleport(nft)} 
            className="w-full bg-teleport hover:bg-teleport-dark text-black font-semibold"
            disabled={disabled}
          >
            Teleport to Polygon
          </Button>
        )}
        {nft.network === 'polygon' && (
          <Button 
            variant="outline" 
            className="w-full border-teleport text-teleport hover:bg-teleport/10"
            disabled
          >
            On Polygon Network
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default NFTCard;
