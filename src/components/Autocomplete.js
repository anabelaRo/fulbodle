import React, { useState } from 'react';
import { Search } from 'lucide-react';

const Autocomplete = ({ suggestions, onSelect, disabled, uiColor }) => {
  const [filtered, setFiltered] = useState([]);
  const [input, setInput] = useState("");
  const [show, setShow] = useState(false);

  const onChange = (e) => {
    const value = e.target.value;
    setInput(value);
    if (value.length > 1) {
      const filteredSuggestions = suggestions.filter(
        suggestion => suggestion.nombre.toLowerCase().includes(value.toLowerCase())
      );
      setFiltered(filteredSuggestions);
      setShow(true);
    } else {
      setShow(false);
    }
  };

  const onClick = (suggestion) => {
    onSelect(suggestion);
    setInput("");
    setShow(false);
  };

  return (
    <div className="relative w-full">
      <div className="relative flex items-center">
        <Search className="absolute left-4 text-white/50" size={18} />
        <input
          type="text"
          className={`w-full py-4 pl-12 pr-4 ${uiColor} text-white placeholder:text-white/40 rounded-2xl border-b-4 border-black/20 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all font-bold disabled:opacity-50`}
          placeholder="Escribe el nombre de un club..."
          onChange={onChange}
          value={input}
          disabled={disabled}
        />
      </div>

      {show && input && (
        <ul className={`absolute z-[60] w-full mt-2 ${uiColor} border-2 border-white/10 rounded-2xl shadow-2xl max-h-60 overflow-y-auto`}>
          {filtered.length > 0 ? (
            filtered.map((suggestion, index) => (
              <li
                key={index}
                className="px-6 py-4 hover:bg-white/10 cursor-pointer text-white font-bold border-b border-white/5 last:border-0 flex justify-between items-center"
                onClick={() => onClick(suggestion)}
              >
                <span>{suggestion.nombre}</span>
                <span className="text-[10px] opacity-40 uppercase">{suggestion.pais}</span>
              </li>
            ))
          ) : (
            <li className="px-6 py-4 text-white/50 italic text-sm font-medium">No se encontraron equipos...</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default Autocomplete;
