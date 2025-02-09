import PropTypes from 'prop-types';

const CursorsOverlay = ({ cursors, currentUserId }) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-50">
      {Object.entries(cursors).map(([userId, cursor]) => {
        if (userId === currentUserId) return null;
        
        return (
          <div
            key={userId}
            className="absolute flex flex-col rounded-full items-start"
            style={{
              left: cursor.position.x,
              top: cursor.position.y,
              transform: 'translate(-50%, -50%)',
              transition: 'all 0.1s ease-out',
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 36 36"
              style={{
                fill: cursor.userColor,
                filter: 'drop-shadow(0 1px 2px rgb(0 0 0 / 0.2))',
              }}
            >
              <path d="M0,0 L24,0 L12,36 L0,0" />
            </svg>
            <span
              className="px-2 py-1 rounded text-xs text-white whitespace-nowrap mt-1"
              style={{
                backgroundColor: cursor.userColor,
                filter: 'drop-shadow(0 1px 2px rgb(0 0 0 / 0.2))',
              }}
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