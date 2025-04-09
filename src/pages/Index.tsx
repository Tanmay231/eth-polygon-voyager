
import React, { useEffect } from 'react';
import { useWallet, WalletProvider } from '@/contexts/WalletContext';
import { TeleporterProvider, useTeleporter } from '@/contexts/TeleporterContext';
import NetworkConnector from '@/components/NetworkConnector';
import NFTCard from '@/components/NFTCard';
import TeleportStatus from '@/components/TeleportStatus';
import ProofVisualizer from '@/components/ProofVisualizer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const NFTTeleporterApp = () => {
  const { fetchNFTs, nfts, teleportNFT, loadingNFTs, teleportRecords, currentTeleport } = useTeleporter();
  
  // Check if there's an active teleport
  const hasActiveTeleport = teleportRecords.some(
    record => ['burning', 'generating_proof', 'waiting_confirmation'].includes(record.status)
  );
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <header className="mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
          <span className="text-teleport">NFT</span> Teleporter
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Seamlessly teleport your NFTs from Ethereum to Polygon using custom Merkle proofs
        </p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <NetworkConnector 
          network="ethereum" 
          onFetchNFTs={() => fetchNFTs('ethereum')}
          loading={loadingNFTs}
        />
        <NetworkConnector 
          network="polygon" 
          onFetchNFTs={() => fetchNFTs('polygon')}
          loading={loadingNFTs}
        />
      </div>
      
      {currentTeleport && (
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <TeleportStatus />
          </div>
          <div className="flex items-center justify-center">
            <ProofVisualizer 
              proof={currentTeleport.proof} 
              active={currentTeleport.status === 'waiting_confirmation' || currentTeleport.status === 'generating_proof'}
            />
          </div>
        </div>
      )}
      
      <Tabs defaultValue="ethereum" className="mb-8">
        <TabsList className="grid w-full grid-cols-2 bg-black/50 backdrop-blur-sm">
          <TabsTrigger value="ethereum" className="data-[state=active]:bg-ethereum data-[state=active]:text-white">
            Ethereum NFTs
          </TabsTrigger>
          <TabsTrigger value="polygon" className="data-[state=active]:bg-polygon data-[state=active]:text-white">
            Polygon NFTs
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="ethereum" className="mt-6">
          {nfts.ethereum.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {nfts.ethereum.map(nft => (
                <NFTCard 
                  key={nft.id} 
                  nft={nft} 
                  onTeleport={teleportNFT}
                  disabled={hasActiveTeleport}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-black/30 backdrop-blur-sm rounded-lg border border-gray-800">
              <p className="text-gray-400">
                No Ethereum NFTs found. Connect to Ethereum and click "Refresh NFTs" to see your NFTs.
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="polygon" className="mt-6">
          {nfts.polygon.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {nfts.polygon.map(nft => (
                <NFTCard key={nft.id} nft={nft} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-black/30 backdrop-blur-sm rounded-lg border border-gray-800">
              <p className="text-gray-400">
                No Polygon NFTs found. Teleport an NFT from Ethereum to see it here.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <div className="mt-12 mb-8 bg-black/30 backdrop-blur-sm rounded-lg border border-gray-800 p-6">
        <h2 className="text-xl font-bold text-white mb-4">How NFT Teleportation Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-black/50 p-4 rounded-lg">
            <div className="text-teleport font-bold mb-2">Step 1: Burn on Ethereum</div>
            <p className="text-gray-400 text-sm">
              The NFT is burned on Ethereum and a teleport event is emitted with token metadata and owner information.
            </p>
          </div>
          <div className="bg-black/50 p-4 rounded-lg">
            <div className="text-teleport font-bold mb-2">Step 2: Generate Proof</div>
            <p className="text-gray-400 text-sm">
              A Merkle proof is generated to cryptographically verify the burn event occurred on Ethereum.
            </p>
          </div>
          <div className="bg-black/50 p-4 rounded-lg">
            <div className="text-teleport font-bold mb-2">Step 3: Mint on Polygon</div>
            <p className="text-gray-400 text-sm">
              The proof is used to mint an identical NFT on Polygon, preserving all metadata and ownership.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <div className="min-h-screen bg-space bg-space-gradient">
      <WalletProvider>
        <TeleporterProvider>
          <NFTTeleporterApp />
        </TeleporterProvider>
      </WalletProvider>
    </div>
  );
};

export default Index;
