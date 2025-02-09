import { memo, useState } from 'react';
import { Handle, Position } from 'react-flow-renderer';
import PropTypes from 'prop-types';

const CustomNode = ({ data }) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingLabel, setIsEditingLabel] = useState(false);

  const handleDoubleClick = (field, setEditing) => (e) => {
    e.stopPropagation();
    setEditing(true);
  };

  const handleBlur = (field, setEditing) => (e) => {
    setEditing(false);
    if (data.onChange) {
      data.onChange({
        ...data, // Ensure existing data is preserved
        [field]: e.target.value // Update the specific field
      });
    }
  };
  

  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-gray-300">
      <Handle type="target" position={Position.Top} className="w-2 h-2" />
      <div className="flex flex-col gap-1">
        {isEditingTitle ? (
          <input
            type="text"
            defaultValue={data.title || 'Title'}
            onBlur={handleBlur('title', setIsEditingTitle)}
            className="text-sm font-bold border rounded px-1"
            autoFocus
          />
        ) : (
          <div
            className="text-sm font-bold text-gray-900 cursor-text"
            onDoubleClick={handleDoubleClick('title', setIsEditingTitle)}
          >
            {data.title || 'Title'}
          </div>
        )}
        
        {isEditingLabel ? (
          <input
            type="text"
            defaultValue={data.label}
            onBlur={handleBlur('label', setIsEditingLabel)}
            className="text-sm font-medium border rounded px-1"
            autoFocus
          />
        ) : (
          <div
            className="text-sm font-medium text-gray-900 cursor-text"
            onDoubleClick={handleDoubleClick('label', setIsEditingLabel)}
          >
            {data.label}
          </div>
        )}
        
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
    title: PropTypes.string,
    label: PropTypes.string.isRequired,
    createdBy: PropTypes.string,
    onChange: PropTypes.func,
  }).isRequired,
};

export default memo(CustomNode);