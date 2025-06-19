import React, { useState } from 'react';
import { useMacros } from './MacroContext';

export const AddMacroModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { addMacro } = useMacros();
  const [name, setName] = useState('');
  const [code, setCode] = useState('');

  const handleSubmit = () => {
    if (!name || !code) return alert('Both fields required');
    addMacro({ name, code });
    setName('');
    setCode('');
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 10001,
      display: 'flex', justifyContent: 'center', alignItems: 'center'
    }}>
      <div style={{
        backgroundColor: '#fff', padding: 20, borderRadius: 12, width: 400,
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
      }}>
        <h3>Add Macro</h3>
        <input
          placeholder="Macro name"
          value={name}
          onChange={e => setName(e.target.value)}
          style={{ width: '100%', marginBottom: 10, padding: 10, borderRadius: 8 }}
        />
        <textarea
          placeholder="JavaScript code"
          value={code}
          onChange={e => setCode(e.target.value)}
          rows={5}
          style={{ width: '100%', padding: 10, borderRadius: 8 }}
        />
        <div style={{ marginTop: 10, display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button onClick={handleSubmit}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};


