import React, { useState } from 'react';

export default function Autocomplete({ suggestions, onSelect, disabled }) {
  const [query, setQuery] = useState("");
  const [list, setList] = useState([]);

  const handleInput = (e) => {
    setQuery(e.target.value);
    setList(e.target.value.length > 1 ? suggestions.filter(s => s.nombre.toLowerCase().includes(e.target.value.toLowerCase())).slice(0,5) : []);
  };

  return (
    <div className="relative w-full">
      <input className="w-full p-4 rounded-xl bg-slate-900 border border-slate-700 focus:border-emerald-500 outline-none transition-all"
        placeholder="Adivina el equipo..." value={query} onChange={handleInput} disabled={disabled} />
      {list.length > 0 && (
        <div className="absolute w-full mt-2 bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-2xl z-50">
          {list.map(t => (
            <div key={t.id} onClick={() => { onSelect(t); setQuery(""); setList([]); }} 
              className="p-4 hover:bg-slate-800 cursor-pointer border-b border-slate-800 last:border-0">
              {t.nombre} <span className="text-xs text-slate-500 italic">({t.pais})</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
