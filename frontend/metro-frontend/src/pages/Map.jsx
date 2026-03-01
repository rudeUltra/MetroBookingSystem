import React, { useEffect, useState, useCallback } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  applyEdgeChanges, 
  applyNodeChanges 
} from 'reactflow';
import 'reactflow/dist/style.css';

// GenZ Line Colors
const LINE_COLORS = {
  1: '#0072bc', // Blue Line
  2: '#00a651', // Green Line
  6: '#f58220', // Orange Line
};

const MetroMap = ({data}) => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  useEffect(() => {
    // 1. Create Nodes
    const initialNodes = Object.entries(data.stations).map(([id, name], index) => ({
      id: id.toString(),
          data: { label: name },
          // Simple positioning logic to spread them out
          position: { x: (index % 3) * 250, y: Math.floor(index / 3) * 150 },
          style: { 
            background: '#fff', 
            color: '#333', 
            borderRadius: '8px', 
            border: '2px solid #222',
            fontWeight: 'bold',
            width: 150
          },
        }));

        // 2. Create Edges from Adjacency List
        const initialEdges = [];
        const seen = new Set();

        Object.entries(data.graph).forEach(([sourceId, neighbors]) => {
          neighbors.forEach((neighbor) => {
            const edgeId = [sourceId, neighbor.to].sort().join('-');
            if (!seen.has(edgeId)) {
              initialEdges.push({
                id: `e${edgeId}`,
                source: sourceId.toString(),
                target: neighbor.to.toString(),
                label: `${neighbor.weight}km`,
                animated: true, // Cool "moving" line effect
                style: { 
                  stroke: LINE_COLORS[neighbor.lineId] || '#999', 
                  strokeWidth: 5 
                },
                labelStyle: { fill: '#888', fontWeight: 700 },
              });
              seen.add(edgeId);
            }
          });
        });

        setNodes(initialNodes);
        setEdges(initialEdges);
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', background: '#fafafa' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      >
        <Background color="#aaa" gap={20} />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default MetroMap;