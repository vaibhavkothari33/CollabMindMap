import { memo } from 'react';
import { Handle, Position } from 'react-flow-renderer';
import PropTypes from 'prop-types';

const CustomNode = ({ data }) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-gray-300">
      <Handle type="target" position={Position.Top} className="w-2 h-2" />
      <div className="flex flex-col">
        <div className="text-sm font-medium text-gray-900">{data.label}</div>
        {data.createdBy && (
          <div className="text-xs text-gray-500">Created by: {data.createdBy}</div>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </div>
  );
};

CustomNode.propTypes = {
  data: PropTypes.shape({
    label: PropTypes.string.isRequired,
    createdBy: PropTypes.string,
  }).isRequired,
};

export default memo(CustomNode);