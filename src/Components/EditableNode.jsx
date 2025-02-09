import React, { useState } from 'react';

export default function EditableNode({ id, data, isConnectable }) {
    const [label, setLabel] = useState(data.label || '');

    const handleInputChange = (e) => {
        setLabel(e.target.value);
        data.onChange(id, e.target.value);
    };

    return (
        <div style={{ padding: 10, border: '1px solid black', borderRadius: 5 }}>
            <input
                value={label}
                onChange={handleInputChange}
                style={{ width: '100%' }}
            />
        </div>
    );
}
