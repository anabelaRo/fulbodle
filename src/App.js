import React, { useState, useEffect } from 'react';
import { teams } from './data/teams';
import GuessRow from './components/GuessRow';
import Autocomplete from './components/Autocomplete';
import { Trophy, History, Home, Share2, Info, X } from 'lucide-react';

const LOSING_MESSAGES = [
  "La próxima pedí el VAR, capaz te dan por válida la respuesta.",
  "El Fulbodle te da revancha todos los días.",
  "Era por abajo Palacio...",
  "Pasó el Pipita y dijo que pifiaste banda.",
  "¡No lo cante, no lo grite, no se abrace!"
];

export default function App() {
  const [view, setView] = useState("game");
  const [targetTeam, setTargetTeam] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [gameStatus, setGameStatus] = useState("playing");
  const [stats, setStats] = useState({ streak: 0, history: [] });
  const [showRules, setShowRules] = useState(false);
  const [loseMessage, setLoseMessage] = useState("");

  const uiColor = "bg-[#4a5c4e]"; // Verde ceniza para UI

  useEffect(() => {
    const today = new Date();
    const dateKey = today.toISOString().slice(0, 10);
    const seed = today.getFullYear() * 1000 + (today.getMonth() + 1) * 100 + today.getDate();
    const index = seed % teams.length;
    setTargetTeam(teams[index]);

    const savedStats = JSON.parse(localStorage.getItem('fg_stats')) || { streak: 0, history: [] };
    setStats(savedStats);

    const savedGame = JSON.parse(localStorage.getItem('fg_current_game'));
    if (savedGame && savedGame.date === dateKey) {
      setGuesses(savedGame.guesses);
      setGameStatus(savedGame.status);
      if (savedGame.status === "lost") {
        setLoseMessage(savedGame.msg || LOSING_MESSAGES[0]);
      }
    }
  }, []);

  const handleGuess = (team) => {
    if (gameStatus !== "playing" || guesses.some(g => g.id === team.id)) return;
    const newGuesses = [...guesses, team];
    setGuesses(newGuesses);

    let newStatus = "playing";
    let selectedMsg = "";

    if (team.id === targetTeam.id) {
      newStatus = "won";
    } else if (newGuesses.length >= 5) {
      newStatus = "lost";
      selectedMsg = LOSING_MESSAGES[Math.floor(Math.random() * LOSING_MESSAGES.length)];
      setLoseMessage(selectedMsg);
    }

    if (newStatus !== "playing") {
      const newStats = {
        streak: newStatus === "won" ? stats.streak + 1 : 0,
        history: [...stats.history, { team: targetTeam.nombre, result: newStatus, date: new Date().toLocaleDateString() }]
      };
      setStats(newStats);
      localStorage.setItem('fg_stats', JSON.stringify(newStats));
    }

    setGameStatus(newStatus);
    localStorage.setItem('fg_current_game', JSON.stringify({
      date: new Date().toISOString().slice(0, 10),
      guesses: newGuesses,
      status: newStatus,
      msg: selectedMsg
    }));
  };

  const shareResult = () => {
    const emojiGrid = guesses.map(guess => {
      const pais = guess.pais === targetTeam.pais ? "🟩" : "⬛";
      const fed = guess.federacion === targetTeam.federacion ? "🟩" : "⬛";
      const cat = guess.categoria === targetTeam.categoria ? "🟩" : "⬛";
      const matches = guess.colores.filter(c => targetTeam.colores.includes(c)).length;
      let col = (matches === targetTeam.colores.length && guess.colores.length === targetTeam.colores.length) ? "🟩" : (matches > 0 ? "🟨" : "⬛");
      const palm = guess.palmares === targetTeam.palmares ? "🟩" : "⬛";
      const fund = guess.fundacion === targetTeam.fundacion ? "🟩" : "⬛";
      return `${pais}${fed}${cat}${col}${palm}${fund}`;
    }).join('\n');
    const shareText = `Fulbodle ⚽\nIntento: ${gameStatus === 'won' ? guesses.length : 'X'}/5\n${emojiGrid}\n${window.location.href}`;
    if (navigator.share) navigator.share({ title: 'Fulbodle', text: shareText }).catch(() => {});
    else { navigator.clipboard.writeText(shareText); alert("¡Copiado al portapapeles! 📋"); }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col p-4 pb-32">
      <header className="flex justify-between items-center py-6 px-2 text-white">
        <h1 className="text-3xl font-[900] tracking-tighter italic uppercase leading-none cursor-pointer"
            onClick={() => { localStorage.clear(); window.location.reload(); }}>
          FULBO<span className="text-black/30 font-[900]">DLE</span>
        </h1>
        <div className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-full font-bold">
          <Trophy size={18} className="text-amber-400" />
          <span>{stats.streak}</span>
        </div>
      </header>

      <main className="main-container flex-grow p-6">
        {view === "game" ? (
          <>
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4 px-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Elegí tu equipo:</span>
                <button onClick={() => setShowRules(true)} className="text-slate-400 hover:text-slate-900"><Info size={16}/></button>
              </div>
              <Autocomplete suggestions={teams} onSelect={handleGuess} disabled={gameStatus !== "playing"} uiColor={uiColor} />
            </div>

            {/* ENCABEZADOS DE COLUMNAS */}
            {guesses.length > 0 && (
              <div className="grid grid-cols-6 gap-1 mb-2 px-1">
                {['País', 'Conf.', 'Cat.', 'Color', 'Ligas', 'Año'].map((h) => (
                  <div key={h} className="text-[8px] font-black text-slate-400 text-center uppercase tracking-tighter">
                    {h}
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-6">
              {guesses.map((g) => <GuessRow key={g.id} guess={g} target={targetTeam} />).reverse()}
            </div>

            {gameStatus !== "playing" && (
              <div className={`mt-8 p-6 ${uiColor} rounded-[2rem] text-center border-b-4 border-black/20 animate-in zoom-in`}>
                <p className="text-white/80 text-sm font-bold italic mb-4 px-2">
                  {gameStatus === "won" ? "¡Impresionante! Directo al ángulo." : loseMessage}
                </p>
                <p className="text-white/50 text-[10px] font-black uppercase tracking-widest mb-1">El equipo era</p>
                <h2 className="text-3xl font-black mb-6 uppercase italic text-white">{targetTeam?.nombre}</h2>
                <button onClick={shareResult} className="w-full py-4 bg-white text-[#396145] rounded-2xl font-black flex justify-center items-center gap-2 shadow-lg active:scale-95 transition-all">
                  <Share2 size={20} /> COMPARTIR RESULTADO
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-black italic uppercase text-slate-900">Historial</h2>
            {stats.history.map((h, i) => (
              <div key={i} className="p-4 bg-slate-50 rounded-2xl flex justify-between border border-slate-100 items-center">
                <span className="font-bold text-sm uppercase">{h.team}</span>
                <span className={`text-[10px] font-black px-3 py-1 rounded-full ${h.result === 'won' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  {h.result === 'won' ? 'GANADO' : 'PERDIDO'}
                </span>
              </div>
            )).reverse()}
          </div>
        )}
      </main>

      {showRules && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-[2.5rem] max-w-sm w-full relative">
            <button onClick={() => setShowRules(false)} className="absolute top-6 right-6 text-slate-300 hover:text-slate-900"><X size={24}/></button>
            <h3 className="text-2xl font-black mb-6 uppercase italic">Aclaraciones</h3>
            <div className="space-y-4 text-slate-600 text-sm font-medium">
              <p>🏆 <b className="text-black">Ligas:</b> Solo Primera División Profesional.</p>
              <p>📅 <b className="text-black">Fundación:</b> Año de registro oficial.</p>
              <p>🎨 <b className="text-black">Colores:</b> Identidad visual principal.</p>
            </div>
            <button onClick={() => setShowRules(false)} className={`w-full mt-8 ${uiColor} text-white py-4 rounded-2xl font-black`}>ENTENDIDO</button>
          </div>
        </div>
      )}

      <nav className={`fixed bottom-6 left-1/2 -translate-x-1/2 w-[200px] h-14 ${uiColor} rounded-full flex justify-around items-center shadow-2xl px-4 border-b-4 border-black/20`}>
        <button onClick={() => setView("game")} className={view === 'game' ? 'text-white scale-110' : 'text-white/40'}><Home size={24}/></button>
        <button onClick={() => setView("history")} className={view === 'history' ? 'text-white scale-110' : 'text-white/40'}><History size={24}/></button>
      </nav>
    </div>
  );
}
