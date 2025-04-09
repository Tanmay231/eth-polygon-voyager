
import React, { useEffect, useRef } from 'react';
import { Card } from "@/components/ui/card";

interface ProofVisualizerProps {
  proof?: string;
  active?: boolean;
}

const ProofVisualizer: React.FC<ProofVisualizerProps> = ({ 
  proof = '0x0000000000000000000000000000000000000000000000000000000000000000', 
  active = false 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Use the proof to generate a visualization
    const proofData = proof.replace('0x', '');
    const dataPoints = [];
    
    // Convert hex proof to data points for visualization
    for (let i = 0; i < proofData.length; i += 2) {
      if (i + 2 <= proofData.length) {
        const value = parseInt(proofData.substring(i, i + 2), 16);
        dataPoints.push(value);
      }
    }
    
    // Draw merkle tree
    const drawTree = () => {
      if (!ctx) return;
      
      const width = canvas.width;
      const height = canvas.height;
      const levels = 4;
      const nodeSize = 6;
      
      // Draw connections first
      ctx.strokeStyle = active ? 'rgba(0, 246, 255, 0.3)' : 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      
      for (let level = 0; level < levels - 1; level++) {
        const nodesInLevel = Math.pow(2, level);
        const nodesInNextLevel = Math.pow(2, level + 1);
        const levelY = (height * (level + 1)) / (levels + 1);
        const nextLevelY = (height * (level + 2)) / (levels + 1);
        
        for (let node = 0; node < nodesInLevel; node++) {
          const nodeX = ((width) * (node + 0.5)) / nodesInLevel;
          
          for (let child = 0; child < 2; child++) {
            const childNode = node * 2 + child;
            const childX = ((width) * (childNode + 0.5)) / nodesInNextLevel;
            
            ctx.beginPath();
            ctx.moveTo(nodeX, levelY);
            ctx.lineTo(childX, nextLevelY);
            ctx.stroke();
          }
        }
      }
      
      // Draw nodes
      for (let level = 0; level < levels; level++) {
        const nodesInLevel = Math.pow(2, level);
        const levelY = (height * (level + 1)) / (levels + 1);
        
        for (let node = 0; node < nodesInLevel; node++) {
          const nodeX = ((width) * (node + 0.5)) / nodesInLevel;
          const dataIndex = (level * 8 + node) % dataPoints.length;
          const value = dataPoints[dataIndex];
          
          // Gradient based on value
          const hue = (value * 1.4) % 360;
          ctx.fillStyle = active 
            ? `hsla(${hue}, 100%, 70%, 0.8)` 
            : `hsla(${hue}, 30%, 50%, 0.5)`;
            
          ctx.beginPath();
          ctx.arc(nodeX, levelY, nodeSize, 0, Math.PI * 2);
          ctx.fill();
          
          // Glow effect for active proofs
          if (active) {
            ctx.shadowBlur = 10;
            ctx.shadowColor = `hsla(${hue}, 100%, 70%, 0.8)`;
            ctx.beginPath();
            ctx.arc(nodeX, levelY, nodeSize, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      }
    };
    
    // Initial draw
    drawTree();
    
    // Animation for active proofs
    let animationFrame: number;
    
    if (active) {
      let time = 0;
      const animate = () => {
        time += 0.01;
        
        // Subtle animation effect
        const pulse = Math.sin(time) * 0.2 + 0.8;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = pulse;
        drawTree();
        ctx.globalAlpha = 1;
        
        animationFrame = requestAnimationFrame(animate);
      };
      
      animate();
    }
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [proof, active]);
  
  return (
    <Card className="overflow-hidden p-0 bg-transparent border-0">
      <canvas 
        ref={canvasRef} 
        width={300} 
        height={150}
        className="w-full h-auto"
      />
      {active && (
        <div className="text-center text-xs text-teleport mt-1">
          Merkle Proof Verification Active
        </div>
      )}
    </Card>
  );
};

export default ProofVisualizer;
