import React, { createContext, useContext, useState, useEffect } from 'react';

type Macro = { name: string; code: string };

const MACRO_KEY = 'macros';

const loadMacros = (): Macro[] => {
  try {
    const raw = GM_getValue(MACRO_KEY, '[]');
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      //@ts-ignore
      return Object.entries(parsed).map(([name, code]) => ({ name, code: String(code) }));
    }
    return parsed;
  } catch {
    return [];
  }
};

const saveMacros = (macros: Macro[]) => {
  GM_setValue(MACRO_KEY, JSON.stringify(macros));
};


const MacroContext = createContext<{
  macros: Macro[];
  addMacro: (macro: Macro) => void;
  deleteMacro: (name: string) => void;
}>(null!);

export const useMacros = () => useContext(MacroContext);

export const MacroProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [macros, setMacros] = useState<Macro[]>(loadMacros());

  const addMacro = (macro: Macro) => {
    const updated = [...macros.filter(m => m.name !== macro.name), macro];
    setMacros(updated);
    saveMacros(updated);
  };

  const deleteMacro = (name: string) => {
    const updated = macros.filter(m => m.name !== name);
    setMacros(updated);
    saveMacros(updated);
  };

  return (
    <MacroContext.Provider value={{ macros, addMacro, deleteMacro }}>
      {children}
    </MacroContext.Provider>
  );
};
