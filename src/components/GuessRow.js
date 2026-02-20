import React from 'react';
import { ArrowUp, ArrowDown, Check } from 'lucide-react';

const GuessRow = ({ guess, target }) => {
  if (!target) return null;

  const getStyle = (val1, val2) => val1 === val2 ? 'box-correct' : 'box-wrong';

  const getNumberStyle = (gNum, tNum) => {
    if (gNum === tNum) return { s: 'box-correct', i: <Check size={10} strokeWidth={4}/> };
    return { s: 'box-wrong', i: gNum < tNum ? <ArrowUp size={10} strokeWidth={4} /> : <ArrowDown size={10} strokeWidth={4} /> };
  };

  const getColorStyle = (gCol, tCol) => {
    const matches = gCol.filter(c => tCol.includes(c)).length;
    if (matches === tCol.length && gCol.length === tCol.length) return 'box-correct';
    return matches > 0 ? 'box-partial' : 'box-wrong';
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2">
      <div className="text-[11px] font-[900] text-[#396145] ml-1 mb-1 uppercase italic tracking-tight">
        {guess.nombre}
      </div>
      
      <div className="grid grid-cols-6 gap-1 items-center">
        {/* PAÍS */}
        <div className={`stat-box flip-card ${getStyle(guess.pais, target.pais)}`}>
          <span className="text-[8px] font-black uppercase leading-[1.1] px-0.5">
            {guess.pais}
          </span>
        </div>

        {/* FEDERACIÓN */}
        <div className={`stat-box flip-card ${getStyle(guess.federacion, target.federacion)}`}>
          <span className="text-[9px] font-black uppercase">
            {guess.federacion}
          </span>
        </div>

        {/* CATEGORÍA */}
        <div className={`stat-box flip-card ${getStyle(guess.categoria, target.categoria)}`}>
          <span className="text-base font-[900] leading-none">
            {guess.categoria}
          </span>
        </div>

        {/* COLORES */}
        <div className={`stat-box flip-card ${getColorStyle(guess.colores, target.colores)}`}>
            <div className="flex flex-wrap justify-center gap-x-0.5 gap-y-0 text-[7px] font-black leading-[1.1] uppercase px-0.5">
                {guess.colores.map((c, i) => (
                  <span key={i}>{c}</span>
                ))}
            </div>
        </div>

        {/* PALMARÉS */}
        <div className={`stat-box flip-card ${getNumberStyle(guess.palmares, target.palmares).s}`}>
          <div className="flex items-center gap-0.5">
            <span className="text-sm font-black">{guess.palmares}</span>
            {getNumberStyle(guess.palmares, target.palmares).i}
          </div>
        </div>

        {/* FUNDACIÓN */}
        <div className={`stat-box flip-card ${getNumberStyle(guess.fundacion, target.fundacion).s}`}>
          <div className="flex flex-col items-center justify-center">
            <span className="text-[9px] font-black leading-none">{guess.fundacion}</span>
            <div className="mt-0.5">
              {getNumberStyle(guess.fundacion, target.fundacion).i}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuessRow;
