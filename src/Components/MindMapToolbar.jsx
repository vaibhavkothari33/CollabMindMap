import PropTypes from 'prop-types';

const MindMapToolbar = ({ onAddNode, onDownload, onNavigateDashboard, userCount }) => {
  return (
    <div className="absolute top-4 left-4 z-10 flex items-center space-x-4">
      <button
        onClick={onAddNode}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
      >
        Add Node
      </button>
      <button
        onClick={onDownload}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
      >
        Download
      </button>
      <button
        onClick={onNavigateDashboard}
        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
      >
        Dashboard
      </button>
      <div className="text-white">
        Users Online: {userCount}
      </div>
    </div>
  );
};

MindMapToolbar.propTypes = {
  onAddNode: PropTypes.func.isRequired,
  onDownload: PropTypes.func.isRequired,
  onNavigateDashboard: PropTypes.func.isRequired,
  userCount: PropTypes.number.isRequired,
};

export default MindMapToolbar;