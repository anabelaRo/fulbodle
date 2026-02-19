import React from 'react';
import { ArrowUp, ArrowDown, Check } from 'lucide-react';

const GuessRow = ({ guess, target }) => {
  const getStyle = (val1, val2) => val1 === val2 ? 'bg-emerald-600 border-emerald-500' : 'bg-slate-800 border-slate-700';
  
  const getNumberStyle = (gNum, tNum) => {
    if (gNum === tNum) return { s: 'bg-emerald-600 border-emerald-500', i: <Check size={10}/> };
    return { s: 'bg-slate-800 border-slate-700', i: gNum < tNum ? <ArrowUp size={10}/> : <ArrowDown size={10}/> };
  };

  const getColorStyle = (gCol, tCol) => {
    const matches = gCol.filter(c => tCol.includes(c)).length;
    if (matches === tCol.length && gCol.length === tCol.length) return 'bg-emerald-600 border-emerald-500';
    return matches > 0 ? 'bg-amber-500 border-amber-400' : 'bg-slate-800 border-slate-700';
  };

  return (
    <div className="mb-4">
      <div className="text-[10px] font-bold text-slate-400 ml-1 mb-1 uppercase">{guess.nombre}</div>
      <div className="grid grid-cols-6 gap-1">
        <div className={`stat-box flip-card text-[9px] ${getStyle(guess.pais, target.pais)}`}>{guess.pais}</div>
        <div className={`stat-box flip-card text-[9px] ${getStyle(guess.federacion, target.federacion)}`}>{guess.federacion}</div>
        <div className={`stat-box flip-card text-lg font-black ${getStyle(guess.categoria, target.categoria)}`}>{guess.categoria}</div>
        <div className={`stat-box flip-card ${getColorStyle(guess.colores, target.colores)}`}>
          <div className="flex flex-wrap justify-center gap-0.5 px-1 uppercase text-[7px]">{guess.colores.join(' ')}</div>
        </div>
        <div className={`stat-box flip-card ${getNumberStyle(guess.palmares, target.palmares).s}`}>
          <span className="text-xs font-bold">{guess.palmares}</span>{getNumberStyle(guess.palmares, target.palmares).i}
        </div>
        <div className={`stat-box flip-card ${getNumberStyle(guess.fundacion, target.fundacion).s}`}>
          <span className="text-[9px] font-bold">{guess.fundacion}</span>{getNumberStyle(guess.fundacion, target.fundacion).i}
        </div>
      </div>
    </div>
  );
};
export default GuessRow;
