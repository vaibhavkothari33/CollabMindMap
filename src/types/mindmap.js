// types/mindmap.js
import PropTypes from 'prop-types';

export const NodeType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  position: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }).isRequired,
  data: PropTypes.shape({
    label: PropTypes.string.isRequired,
    createdBy: PropTypes.string,
    onLabelChange: PropTypes.func,
  }).isRequired,
});

export const EdgeType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  source: PropTypes.string.isRequired,
  target: PropTypes.string.isRequired,
  type: PropTypes.string,
  markerEnd: PropTypes.object,
  animated: PropTypes.bool,
});

export const CursorType = PropTypes.shape({
  position: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }).isRequired,
  userName: PropTypes.string.isRequired,
  userColor: PropTypes.string.isRequired,
});