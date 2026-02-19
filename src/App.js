import React, { useState, useEffect } from 'react';
import { teams } from './data/teams';
import GuessRow from './components/GuessRow';
import Autocomplete from './components/Autocomplete';
import { Trophy, History, Home, Share2 } from 'lucide-react';

export default function App() {
  const [view, setView] = useState("game");
  const [target, setTarget] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [status, setStatus] = useState("playing");
  const [stats, setStats] = useState({ streak: 0, history: [] });

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const index = Math.abs(today.split('-').join('') % teams.length);
    setTarget(teams[index]);

    const s = JSON.parse(localStorage.getItem('fg_stats')) || { streak: 0, history: [] };
    setStats(s);

    const saved = JSON.parse(localStorage.getItem('fg_current'));
    if (saved?.date === today) { setGuesses(saved.guesses); setStatus(saved.status); }
  }, []);

  const onGuess = (team) => {
    if (guesses.some(g => g.id === team.id)) return;
    const newGuesses = [...guesses, team];
    setGuesses(newGuesses);
    
    let newStatus = "playing";
    if (team.id === target.id) newStatus = "won";
    else if (newGuesses.length >= 7) newStatus = "lost";
    
    if (newStatus !== "playing") {
      const newStats = { 
        streak: newStatus === "won" ? stats.streak + 1 : 0,
        history: [...stats.history, { team: target.nombre, result: newStatus, date: new Date().toLocaleDateString() }]
      };
      setStats(newStats);
      localStorage.setItem('fg_stats', JSON.stringify(newStats));
    }
    setStatus(newStatus);
    localStorage.setItem('fg_current', JSON.stringify({ date: new Date().toISOString().slice(0,10), guesses: newGuesses, status: newStatus }));
  };

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col p-4">
      <header className="flex justify-between items-center py-6 border-b border-slate-800 mb-6">
        <h1 className="text-2xl font-black italic">FUTBOL<span className="text-emerald-500">GUESS</span></h1>
        <div className="text-emerald-500 font-bold flex items-center gap-1"><Trophy size={18}/> {stats.streak}</div>
      </header>

      {view === "game" ? (
        <main className="flex-grow">
          <Autocomplete suggestions={teams} onSelect={onGuess} disabled={status !== "playing"} />
          <div className="mt-8">
            {guesses.map((g, i) => <GuessRow key={i} guess={g} target={target} />).reverse()}
          </div>
          {status !== "playing" && (
            <div className="bg-slate-900 p-6 rounded-2xl text-center mt-4 border border-emerald-500/30">
              <p className="text-slate-400 text-sm">EL EQUIPO ERA</p>
              <h2 className="text-2xl font-bold mb-4 uppercase tracking-tighter">{target.nombre}</h2>
              <button className="w-full bg-emerald-600 p-3 rounded-xl font-bold flex justify-center items-center gap-2"><Share2 size={18}/> COMPARTIR</button>
            </div>
          )}
        </main>
      ) : (
        <div className="flex-grow space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2"><History/> Tu Historial</h2>
          {stats.history.map((h, i) => (
            <div key={i} className="p-4 bg-slate-900 rounded-xl flex justify-between">
              <span>{h.team}</span><span className={h.result === 'won' ? 'text-emerald-500' : 'text-red-500 uppercase text-xs font-bold'}>{h.result}</span>
            </div>
          )).reverse()}
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-slate-950 border-t border-slate-900 flex justify-around items-center">
        <button onClick={() => setView("game")} className={view === 'game' ? 'text-emerald-500' : 'text-slate-500'}><Home/></button>
        <button onClick={() => setView("history")} className={view === 'history' ? 'text-emerald-500' : 'text-slate-500'}><History/></button>
      </nav>
    </div>
  );
}
