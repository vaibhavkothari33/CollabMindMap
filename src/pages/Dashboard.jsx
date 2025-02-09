import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";
import PropTypes from "prop-types";

const socket = io("http://localhost:4000");

export default function Dashboard() {
  const { isAuthenticated, user } = useAuth0();
  const [roomId, setRoomId] = useState("");
  const [liveUsers, setLiveUsers] = useState(0);

  useEffect(() => {
    if (roomId) {
      // Join the room
      socket.emit("join-room", roomId);

      // Listen for live user updates
      socket.on("live-users", (count) => {
        setLiveUsers(count);
      });

      // Cleanup on unmount
      return () => {
        socket.off("live-users");
        socket.emit("leave-room", roomId);
      };
    }
  }, [roomId]);

  if (!isAuthenticated) {
    return <p>Please log in to access the dashboard.</p>;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Navbar */}
      <nav className="bg-blue-500 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            MindMap Collab
          </Link>
          <div>
            <span className="mr-4">Welcome, {user.name}!</span>
            <Link to="/" className="bg-red-500 text-white px-4 py-2 rounded">
              Log Out
            </Link>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="flex-grow p-4">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

        {/* Room Join Section */}
        {!roomId ? (
          <div className="flex flex-col items-center space-y-4">
            <input
              type="text"
              placeholder="Enter Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="border p-2 rounded bg-gray-800 text-white"
            />
            <button
              onClick={() => setRoomId(roomId)}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Join Room
            </button>
          </div>
        ) : (
          <div>
            <p className="text-lg mb-4">
              Live Users in Room: <strong>{liveUsers}</strong>
            </p>
            <Link
              to={`/mindmap/${roomId}`}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Go to MindMap
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

// PropTypes validation
Dashboard.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }),
};