import { useState } from "react";
import PropTypes from "prop-types";

const RoomJoin = ({ onJoin }) => {
  const [roomId, setRoomId] = useState("");

  const handleJoin = () => {
    if (roomId.trim()) {
      onJoin(roomId);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <input
        type="text"
        placeholder="Enter Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      <button
        onClick={handleJoin}
        disabled={!roomId.trim()}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed transition-colors"
      >
        Join Room
      </button>
    </div>
  );
};

RoomJoin.propTypes = {
  onJoin: PropTypes.func.isRequired
};

// Remove defaultProps since onJoin is required

export default RoomJoin;