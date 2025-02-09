// import { useEffect, useCallback, useState, useRef } from 'react';
// import ReactFlow, {Controls,Background,addEdge,useNodesState,useEdgesState,MarkerType} from 'react-flow-renderer';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useAuth0 } from '@auth0/auth0-react';
// import { io } from 'socket.io-client';

// import PropTypes from 'prop-types';
// import CustomNode from './CustomNode';
// import MindMapToolbar from './MindMapToolbar';
// import CursorsOverlay from './CursorsOverlay';
// // import { isValidRoomId } from '../utils/roomUtils';
// import { NodeType, EdgeType } from '../types/mindmap';

// const socket = io("http://localhost:4000");

// // Custom cursor colors for different users
// const CURSOR_COLORS = [
//   "#FF5733", "#33FF57", "#3357FF", "#FF33F5",
//   "#33FFF5", "#F5FF33", "#FF3333", "#33FF33"
// ];

// const MindMap = () => {
//   const { roomId } = useParams();
//   const { user} = useAuth0();
//   const navigate = useNavigate();
//   const [nodes, setNodes, onNodesChange] = useNodesState([]);
//   const [edges, setEdges, onEdgesChange] = useEdgesState([]);
//   const [cursors, setCursors] = useState({});
//   const [userCount, setUserCount] = useState(0);
//   const reactFlowWrapper = useRef(null);
//   const [reactFlowInstance, setReactFlowInstance] = useState(null);
//   const [selectedNode, setSelectedNode] = useState(null);

//     const nodeTypes = {
//     custom: CustomNode,
//   };

//     const downloadMindMap = useCallback(() => {
//     if (!reactFlowInstance) return;
    
//     const flow = reactFlowInstance.toObject();
//     const dataStr = JSON.stringify(flow);
//     const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
//     const exportFileDefaultName = `mindmap-${roomId}.json`;
//     const linkElement = document.createElement('a');
//     linkElement.setAttribute('href', dataUri);
//     linkElement.setAttribute('download', exportFileDefaultName);
//     linkElement.click();
//   }, [reactFlowInstance, roomId]);

//   useEffect(() => {
//       //   if (!isValidRoomId(roomId)) {
//       // navigate('/dashboard');
//       // return;
//     // }
//     if (!user) return;

//     const userColor = CURSOR_COLORS[Math.floor(Math.random() * CURSOR_COLORS.length)];

//     socket.emit("join-room", { 
//       roomId, 
//       userId: user.sub, 
//       userName: user.name,
//       userColor 
//     });

//     socket.on("room-state", ({ nodes: roomNodes, edges: roomEdges }) => {
//       setNodes(roomNodes || []);
//       setEdges(roomEdges || []);
//     });

//     socket.on("node-added", (newNode) => {
//       setNodes((nds) => [...nds, newNode]);
//     });

//     socket.on("node-updated", (updatedNode) => {
//       setNodes((nds) =>
//         nds.map((node) => (node.id === updatedNode.id ? updatedNode : node))
//       );
//     });

//     socket.on("edge-added", (newEdge) => {
//       setEdges((eds) => addEdge({ ...newEdge, markerEnd: { type: MarkerType.Arrow } }, eds));
//     });

//     socket.on("cursor-moved", ({ userId, position, userName, userColor }) => {
//       setCursors(prev => ({
//         ...prev,
//         [userId]: { position, userName, userColor }
//       }));
//     });
//     socket.on("user-count-updated", (count) => {
//       setUserCount(count);
//       console.log(count);
      
//     });

//         socket.on("user-disconnected", ({ userId }) => {
//       setCursors(prev => {
//         const newCursors = { ...prev };
//         delete newCursors[userId];
//         return newCursors;
//       });
//     });

//     const handleMouseMove = (event) => {
//       if (!reactFlowWrapper.current) return;
      
//       const bounds = reactFlowWrapper.current.getBoundingClientRect();
//       const position = {
//         x: event.clientX - bounds.left,
//         y: event.clientY - bounds.top,
//       };
      
//       socket.emit("cursor-move", {
//         roomId,
//         userId: user.sub,
//         position,
//         userName: user.name,
//         userColor
//       });
//     };

//     document.addEventListener("mousemove", handleMouseMove);

//     return () => {
//       socket.emit("leave-room", { roomId, userId: user.sub });
//       document.removeEventListener("mousemove", handleMouseMove);
//       socket.off("room-state");
//       socket.off("node-added");
//       socket.off("node-updated");
//       socket.off("edge-added");
//       socket.off("cursor-moved");

//       // socket.off("user-count-updated");
//       // socket.off("user-disconnected");
      
//     };
//   }, [roomId, user, navigate, setNodes, setEdges]);

//   const onConnect = useCallback((params) => {
//     const newEdge = {
//       ...params,
//       markerEnd: { type: MarkerType.Arrow },
//       animated: true,
//     };
//     socket.emit("add-edge", { roomId, edge: newEdge });
//     setEdges((eds) => addEdge(newEdge, eds));
//   }, [roomId, setEdges]);

//   const onNodeDragStop = useCallback((event, node) => {
//     socket.emit("update-node", { roomId, node });
//   }, [roomId]);

//   const addNode = useCallback(() => {
//     const position = reactFlowInstance?.project({
//       x: Math.random() * 500,
//       y: Math.random() * 500,
//     }) || { x: 0, y: 0 };

//     const newNode = {
//       id: `node-${Date.now()}`,
//       position,
//       data: {
//         label: 'New Node',
//         createdBy: user?.name,
//       },
//       style: {
//         background: '#1a192b',
//         color: '#fff',
//         border: '1px solid #fff',
//         borderRadius: '3px',
//         padding: '10px',
//       },
//     };
//     socket.emit("add-node", { roomId, node: newNode });
//     setNodes((nds) => [...nds, newNode]);
//   }, [reactFlowInstance, user, roomId, setNodes]);

//   // const onNodeDoubleClick = useCallback((event, node) => {
//   //   setSelectedNode(node);
//   // }, []);

//   const onNodeDoubleClick = useCallback((event, node) => {
//     setSelectedNode(node);
//     const newLabel = prompt('Enter new label:', node.data.label);
//     if (newLabel !== null && newLabel !== node.data.label) {
//       const updatedNode = {
//         ...node,
//         data: { ...node.data, label: newLabel }
//       };
//       socket.emit("update-node", { roomId, node: updatedNode });
//       setNodes((nds) =>
//         nds.map((n) => (n.id === node.id ? updatedNode : n))
//       );
//     }
//     setSelectedNode(null);
//   }, [roomId, setNodes]);



//   const updateNodeLabel = useCallback((nodeId, newLabel) => {
//     const updatedNodes = nodes.map(node => {
//       if (node.id === nodeId) {
//         const updatedNode = {
//           ...node,
//           data: { ...node.data, label: newLabel }
//         };
//         socket.emit("update-node", { roomId, node: updatedNode });
//         return updatedNode;
//       }
//       return node;
//     });
//     setNodes(updatedNodes);
//   }, [nodes, roomId, setNodes]);

//     return (
//     <div className="h-screen bg-gray-900" ref={reactFlowWrapper}>
//       <MindMapToolbar
//         onAddNode={addNode}
//         onDownload={downloadMindMap}
//         onNavigateDashboard={() => navigate('/dashboard')}
//         userCount={userCount}
//       />

//       {user && (
//         <CursorsOverlay
//           cursors={cursors}
//           currentUserId={user.sub}
//         />
//       )}

//       <ReactFlow
//         nodes={nodes}
//         edges={edges}
//         onNodesChange={onNodesChange}
//         onEdgesChange={onEdgesChange}
//         onConnect={onConnect}
//         onNodeDragStop={onNodeDragStop}
//         onNodeDoubleClick={onNodeDoubleClick}
//         updateNodeLabel={updateNodeLabel}
//         onInit={setReactFlowInstance}
//         nodeTypes={nodeTypes}
//         className="bg-gray-900"
//         nodesDraggable={true}
//         nodesConnectable={true}
//         snapToGrid={true}
//         snapGrid={[15, 15]}
//         defaultEdgeOptions={{
//           type: 'smoothstep',
//           markerEnd: { type: MarkerType.Arrow },
//           style: { stroke: '#fff' }
//         }}
//       >
//         <Background color="#4a5568" gap={16} />
//         <Controls className="bg-gray-800 text-white" />
//       </ReactFlow>
//     </div>
//   );
// };

// MindMap.propTypes = {
//   nodes: PropTypes.arrayOf(NodeType),
//   edges: PropTypes.arrayOf(EdgeType),
//   onNodesChange: PropTypes.func,
//   onEdgesChange: PropTypes.func,
//   onConnect: PropTypes.func,
// };

// export default MindMap;

//   return (
//     <div className="h-screen bg-gray-900" ref={reactFlowWrapper}>
//       {/* Toolbar */}
//       <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-50">
//         <div className="flex gap-2">
//           <button
//             onClick={addNode}
//             className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
//           >
//             Add Node
//           </button>
//         </div>
//       </div>

//       {/* Node Editor Modal */}
//       {selectedNode && (
//         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 p-4 rounded-lg z-50">
//           <input
//             type="text"
//             value={selectedNode.data.label}
//             onChange={(e) => updateNodeLabel(selectedNode.id, e.target.value)}
//             className="bg-gray-700 text-white p-2 rounded"
//             autoFocus
//           />
//           <button
//             onClick={() => setSelectedNode(null)}
//             className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
//           >
//             Save
//           </button>
//         </div>
//       )}

//       {/* Cursor indicators */}
//       {Object.entries(cursors).map(([userId, { position, userName, userColor }]) => (
//         userId !== user?.sub && (
//           <div
//             key={userId}
//             className="absolute pointer-events-none z-50 flex items-center"
//             style={{
//               left: position.x,
//               top: position.y,
//               transform: 'translate(-50%, -50%)'
//             }}
//           >
//             <div
//               className="w-3 h-3 rounded-full"
//               style={{ backgroundColor: userColor }}
//             />
//             <span
//               className="ml-2 px-2 py-1 rounded text-xs text-white"
//               style={{ backgroundColor: userColor }}
//             >
//               {userName}
//             </span>
//           </div>
//         )
//       ))}

//       <ReactFlow
//         nodes={nodes}
//         edges={edges}
//         onNodesChange={onNodesChange}
//         onEdgesChange={onEdgesChange}
//         onConnect={onConnect}
//         onNodeDragStop={onNodeDragStop}
//         onNodeDoubleClick={onNodeDoubleClick}
//         onInit={setReactFlowInstance}
//         className="bg-gray-900"
//         nodesDraggable={true}
//         nodesConnectable={true}
//         snapToGrid={true}
//         snapGrid={[15, 15]}
//         defaultEdgeOptions={{
//           type: 'smoothstep',
//           markerEnd: { type: MarkerType.Arrow },
//           style: { stroke: '#fff' }
//         }}
//       >
//         <Background color="#4a5568" gap={16} />
//         <Controls className="bg-gray-800 text-white" />
//       </ReactFlow>
//     </div>
//   );
// };

// export default MindMap;



import { useEffect, useCallback, useState, useRef } from 'react';
import ReactFlow, {Controls,Background,addEdge,useNodesState,useEdgesState,MarkerType} from 'react-flow-renderer';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { io } from 'socket.io-client';
import PropTypes from 'prop-types';
import CustomNode from './CustomNode';
import MindMapToolbar from './MindMapToolbar';
import CursorsOverlay from './CursorsOverlay';
// import { isValidRoomId } from '../utils/roomUtils';
import { NodeType, EdgeType } from '../types/mindmap';

const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:4000");

const CURSOR_COLORS = [
  "#FF5733", "#33FF57", "#3357FF", "#FF33F5",
  "#33FFF5", "#F5FF33", "#FF3333", "#33FF33"
];

const MindMap = () => {
  const { roomId } = useParams();
  const { user, isLoading, isAuthenticated } = useAuth0();
  const navigate = useNavigate();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [cursors, setCursors] = useState({});
  const [userCount, setUserCount] = useState(0);
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);

  const nodeTypes = {
    custom: CustomNode,
  };

  const downloadMindMap = useCallback(() => {
    if (!reactFlowInstance) return;
    
    const flow = reactFlowInstance.toObject();
    const dataStr = JSON.stringify(flow);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `mindmap-${roomId}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, [reactFlowInstance, roomId]);

  useEffect(() => {
   

    if (!user) return;

    const userColor = CURSOR_COLORS[Math.floor(Math.random() * CURSOR_COLORS.length)];

    socket.emit("join-room", {
      roomId,
      userId: user.sub,
      userName: user.name,
      userColor
    });

    socket.on("room-state", ({ nodes: roomNodes, edges: roomEdges, userCount: count }) => {
      setNodes(roomNodes || []);
      setEdges(roomEdges || []);
      setUserCount(count);
    });

    socket.on("node-added", (newNode) => {
      setNodes((nds) => [...nds, newNode]);
    });

    socket.on("node-updated", (updatedNode) => {
      setNodes((nds) =>
        nds.map((node) => (node.id === updatedNode.id ? updatedNode : node))
      );
    });

    socket.on("edge-added", (newEdge) => {
      setEdges((eds) => addEdge({ ...newEdge, markerEnd: { type: MarkerType.Arrow } }, eds));
    });

    socket.on("cursor-moved", ({ userId, position, userName, userColor }) => {
      setCursors(prev => ({
        ...prev,
        [userId]: { position, userName, userColor }
      }));
    });

    socket.on("user-count-updated", (count) => {
      setUserCount(count);
    });

    socket.on("user-disconnected", ({ userId }) => {
      setCursors(prev => {
        const newCursors = { ...prev };
        delete newCursors[userId];
        return newCursors;
      });
    });

    const handleMouseMove = (event) => {
      if (!reactFlowWrapper.current) return;

      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = {
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      };

      socket.emit("cursor-move", {
        roomId,
        userId: user.sub,
        position,
        userName: user.name,
        userColor
      });
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      socket.emit("leave-room", { roomId, userId: user.sub });
      document.removeEventListener("mousemove", handleMouseMove);
      socket.off("room-state");
      socket.off("node-added");
      socket.off("node-updated");
      socket.off("edge-added");
      socket.off("cursor-moved");
      socket.off("user-count-updated");
      socket.off("user-disconnected");
    };
  }, [roomId, user, navigate, setNodes, setEdges]);

  const onConnect = useCallback((params) => {
    const newEdge = {
      ...params,
      markerEnd: { type: MarkerType.Arrow },
      animated: true,
    };
    socket.emit("add-edge", { roomId, edge: newEdge });
    setEdges((eds) => addEdge(newEdge, eds));
  }, [roomId, setEdges]);

  const onNodeDragStop = useCallback((event, node) => {
    socket.emit("update-node", { roomId, node });
  }, [roomId]);

  const addNode = useCallback(() => {
    const position = reactFlowInstance?.project({
      x: Math.random() * 500,
      y: Math.random() * 500,
    }) || { x: 0, y: 0 };

    const newNode = {
      id: `node-${Date.now()}`,
      type: 'custom',
      position,
      data: {
        label: 'New Node',
        createdBy: user?.name,
      }
    };
    socket.emit("add-node", { roomId, node: newNode });
    setNodes((nds) => [...nds, newNode]);
  }, [reactFlowInstance, user, roomId, setNodes]);

  const onNodeDoubleClick = useCallback((event, node) => {
    setSelectedNode(node);
    const newLabel = prompt('Enter new label:', node.data.label);
    if (newLabel !== null && newLabel !== node.data.label) {
      const updatedNode = {
        ...node,
        data: { ...node.data, label: newLabel }
      };
      socket.emit("update-node", { roomId, node: updatedNode });
      setNodes((nds) =>
        nds.map((n) => (n.id === node.id ? updatedNode : n))
      );
    }
    setSelectedNode(null);
  }, [roomId, setNodes]);

  if (isLoading || !isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-900" ref={reactFlowWrapper}>
      <MindMapToolbar
        onAddNode={addNode}
        onDownload={downloadMindMap}
        onNavigateDashboard={() => navigate('/dashboard')}
        userCount={userCount}
      />

      {user && (
        <CursorsOverlay
          cursors={cursors}
          currentUserId={user.sub}
        />
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        onNodeDoubleClick={onNodeDoubleClick}
        onInit={setReactFlowInstance}
        nodeTypes={nodeTypes}
        className="bg-gray-900"
        nodesDraggable={true}
        nodesConnectable={true}
        snapToGrid={true}
        snapGrid={[15, 15]}
        defaultEdgeOptions={{
          type: 'smoothstep',
          markerEnd: { type: MarkerType.Arrow },
          style: { stroke: '#fff' }
        }}
      >
        <Background color="#4a5568" gap={16} />
        <Controls className="bg-gray-800 text-white" />
      </ReactFlow>
    </div>
  );
};

MindMap.propTypes = {
  nodes: PropTypes.arrayOf(NodeType),
  edges: PropTypes.arrayOf(EdgeType),
  onNodesChange: PropTypes.func,
  onEdgesChange: PropTypes.func,
  onConnect: PropTypes.func,
};

export default MindMap;