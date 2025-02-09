import PropTypes from 'prop-types';

const CursorsOverlay = ({ cursors, currentUserId }) => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {Object.entries(cursors).map(([userId, cursor]) => {
        if (userId === currentUserId) return null;
        
        return (
          <div
            key={userId}
            className="absolute flex flex-col items-start"
            style={{
              left: cursor.position.x,
              top: cursor.position.y,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              style={{ fill: cursor.userColor }}
            >
              <path d="M5,2 L19,12 L12,13 L11,19 L5,2" />
            </svg>
            <span
              className="px-2 py-1 rounded text-xs text-white"
              style={{ backgroundColor: cursor.userColor }}
            >
              {cursor.userName}
            </span>
          </div>
        );
      })}
    </div>
  );
};

CursorsOverlay.propTypes = {
  cursors: PropTypes.objectOf(PropTypes.shape({
    position: PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
    }).isRequired,
    userName: PropTypes.string.isRequired,
    userColor: PropTypes.string.isRequired,
  })).isRequired,
  currentUserId: PropTypes.string.isRequired,
};

export default CursorsOverlay;