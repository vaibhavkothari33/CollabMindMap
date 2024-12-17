import React, { useCallback, useEffect } from 'react';
import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001'); // socket server

const initialNodes = [
    { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
    { id: '2', position: { x: -200, y: 100 }, data: { label: '2' } },
    { id: '3', position: { x: 200, y: 100 }, data: { label: 'Vaibhav' } },
];
const initialEdges = [
    { id: 'e1-2', source: '1', target: '2', animated: false },
    { id: 'e1-3', source: '1', target: '3', animated: true }

];

export default function MindMap() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    //socket setup
    useEffect(() => {
        socket.on('initial_data', (data) => {
            setNodes(data.nodes);
            setEdges(data.edges);
        });

        socket.on('nodes_updated', (updatedNodes) => {
            setNodes(updatedNodes);
        });

        socket.on('edges_updated', (updatedEdges) => {
            setEdges(updatedEdges);
        });
        return () => {
            socket.off('inital_data');
            socket.off('nodes_updated');
            socket.off('edges_updated');
        };
    }, []);

    const handleNodeChange = useCallback((changes) => {
        onNodesChange(changes);
        socket.emit('update_nodes', changes);
    }, [onNodesChange]);

    const handleEdgeChange = useCallback((changes) => {
        onEdgesChange(changes);
        socket.emit('update_edges', changes);
    }, [onEdgesChange]);

    const onConnect = useCallback(
        (params) => {
            setEdges((eds) => {
                const newEdges = addEdge(params, eds);
                socket.emit('update_edges', newEdges);
                return newEdges;
            });
        },
        [setEdges]
    );

    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
            >
                <Controls />
                <MiniMap />
                <Background variant="plane" gap={12} size={1} />    {/* dots */}
            </ReactFlow>
        </div>
    );
}