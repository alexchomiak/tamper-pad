import React, { useEffect, useState } from 'react';
import { useMacros } from './MacroContext';
import { AddMacroModal } from './AddMacroModal';

export const MacroPrompt: React.FC = () => {
  const { macros } = useMacros();
  const [visible, setVisible] = useState(false);
  const [input, setInput] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Toggle prompt visibility on CTRL + .
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === '.') {
        e.preventDefault();
        setVisible(prev => !prev);
        setShowModal(false); // ensure modal is closed when prompt toggled
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // Run macro
  const runMacro = (name: string) => {
    const macro = macros.find(m => m.name === name);
    if (!macro) return alert(`Macro "${name}" not found.`);
    try {
      new Function(macro.code)();
    } catch (err) {
      alert(`Error: ${err}`);
    }
    setInput('');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <>
      {showModal && <AddMacroModal onClose={() => setShowModal(false)} />}
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}>
        <input
          autoFocus
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') runMacro(input.trim());
            if (e.key === 'Escape') setVisible(false);
          }}
          placeholder="Type a macro..."
          style={{
            padding: '14px 16px',
            fontSize: '18px',
            width: '400px',
            borderRadius: '12px',
            border: '1px solid #888',
            boxShadow: '0 0 8px rgba(0,0,0,0.1)',
          }}
        />
        <button
          onClick={() => setShowModal(true)}
          title="Add Macro"
          style={{
            width: '48px',
            height: '48px',
            fontSize: '24px',
            borderRadius: '50%',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
          }}
        >
          +
        </button>
      </div>
    </>
  );
};
