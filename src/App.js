import React, { useState, useEffect } from 'react';
import { teams } from './data/teams';
import GuessRow from './components/GuessRow';
import Autocomplete from './components/Autocomplete';
import { Trophy, History, Home, Share2, Info, X, Coffee } from 'lucide-react';
import { Analytics } from '@vercel/analytics/react';

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
  const [seed, setSeed] = useState(0);

  const uiColor = "bg-[#4a5c4e]"; 

  useEffect(() => {
    const today = new Date();
    const dateKey = today.toISOString().slice(0, 10);
    const currentSeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    setSeed(currentSeed);
    
    const index = currentSeed % teams.length;
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
    // Usamos ⬜ para representar gris/vacío en el compartido
    const emojiGrid = guesses.map(guess => {
      const pais = guess.pais === targetTeam.pais ? "🟩" : "⬜";
      const fed = guess.federacion === targetTeam.federacion ? "🟩" : "⬜";
      const cat = guess.categoria === targetTeam.categoria ? "🟩" : "⬜";
      const matches = guess.colores.filter(c => targetTeam.colores.includes(c)).length;
      let col = (matches === targetTeam.colores.length && guess.colores.length === targetTeam.colores.length) ? "🟩" : (matches > 0 ? "🟨" : "⬜");
      const palm = guess.palmares === targetTeam.palmares ? "🟩" : "⬜";
      const fund = guess.fundacion === targetTeam.fundacion ? "🟩" : "⬜";
      return `${pais}${fed}${cat}${col}${palm}${fund}`;
    }).join('\n');

    const mensajeResultado = gameStatus === 'won' 
      ? `¡GOLAZO! Adiviné en ${guesses.length}/5 intentos ⚽` 
      : `FINAL DEL PARTIDO. No pude adivinar hoy ❌`;

    const shareText = `Fulbodle #${seed}\n${mensajeResultado}\n\n${emojiGrid}\n\nhttps://fulbodle.vercel.app/`;

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile && navigator.share) {
      navigator.share({ title: 'Fulbodle', text: shareText }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      alert("¡Resultado copiado al portapapeles! 📋");
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col p-4 pb-32">
      <Analytics />
     <header className="flex flex-col py-6 px-2 text-white">
      <div className="flex justify-between items-center w-full">
        <h1 className="text-3xl font-[900] tracking-tighter italic uppercase leading-none cursor-pointer"
            onClick={() => window.location.reload()}>
          FULBO<span className="text-black/30 font-[900]">DLE</span>
        </h1>
        <div className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-full font-bold">
          <Trophy size={18} className="text-amber-400" />
          <span>{stats.streak}</span>
        </div>
      </div>
      
      {/* TU LEYENDA PERSONALIZADA */}
      <p className="text-[11px] mt-2 font-medium text-white/60 italic leading-tight">
        Un equipo secreto cada día, cinco intentos. <span className="text-white font-bold not-italic">¿Podes sacarlo?</span>
      </p>
    </header>

      <main className="main-container flex-grow p-6">
        {view === "game" ? (
          <>
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4 px-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Adiviná el equipo:</span>
                <button onClick={() => setShowRules(true)} className="text-slate-400 hover:text-slate-900 transition-colors">
                  <Info size={20}/>
                </button>
              </div>
              <Autocomplete suggestions={teams} onSelect={handleGuess} disabled={gameStatus !== "playing"} uiColor={uiColor} />
            </div>

            {guesses.length > 0 && (
              <div className="grid grid-cols-6 gap-1 mb-2 px-1">
                {['País', 'Conf.', 'Cat.', 'Color', 'Ligas', 'Año'].map((h) => (
                  <div key={h} className="text-[8px] font-black text-slate-400 text-center uppercase tracking-tighter">{h}</div>
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
            {stats.history.length === 0 ? (
              <p className="text-slate-400 text-sm italic">Aún no jugaste ningún partido.</p>
            ) : (
              stats.history.map((h, i) => (
                <div key={i} className="p-4 bg-slate-50 rounded-2xl flex justify-between border border-slate-100 items-center">
                  <span className="font-bold text-sm uppercase">{h.team}</span>
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full ${h.result === 'won' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {h.result === 'won' ? 'GANADO' : 'PERDIDO'}
                  </span>
                </div>
              )).reverse()
            )}
         
          </div>
        )}
      </main>

      {showRules && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-[2.5rem] max-w-sm w-full relative overflow-y-auto max-h-[90vh]">
            <button onClick={() => setShowRules(false)} className="absolute top-6 right-6 text-slate-300 hover:text-slate-900">
              <X size={24}/>
            </button>
            
            <h3 className="text-2xl font-black mb-4 uppercase italic">¿Cómo jugar?</h3>
            <p className="text-sm text-slate-600 mb-6">Adiviná el club en <span className="text-black font-bold">5 intentos</span>. Los colores indican tu proximidad:</p>
            
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 min-w-[40px] bg-green-600 rounded-xl flex items-center justify-center text-white font-bold text-xs text-center">🟩</div>
                <div className="text-sm"><p className="font-bold text-black leading-none text-xs">Acierto total</p><p className="text-slate-500 text-[10px]">El dato coincide perfectamente.</p></div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 min-w-[40px] bg-yellow-500 rounded-xl flex items-center justify-center text-white font-bold text-xs text-center">🟨</div>
                <div className="text-sm"><p className="font-bold text-black leading-none text-xs">Acierto parcial</p><p className="text-slate-500 text-[10px]">Coincidencia en algunos colores.</p></div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 min-w-[40px] bg-slate-300 rounded-xl flex items-center justify-center text-white font-bold text-xs text-center">⬜</div>
                <div className="text-sm"><p className="font-bold text-black leading-none text-xs">Sin coincidencias</p><p className="text-slate-500 text-[10px]">El dato es completamente distinto.</p></div>
              </div>
            </div>

            <div className="h-[1px] bg-slate-100 w-full mb-6"></div>

            <h3 className="text-xs font-black mb-4 uppercase tracking-widest text-slate-400">Aclaraciones</h3>
            <div className="space-y-3 text-sm text-slate-600">
              <p>🏆 <b className="text-black">Ligas:</b> Solo Primera División Profesional. Las flechas indican si el club ganó + (↑) o - (↓)</p>
              <p>📅 <b className="text-black">Fundación:</b> Las flechas indican si el club es más viejo (↑) o nuevo (↓).</p>
              <p>🎨 <b className="text-black">Colores:</b> Se comparan los colores de identidad principal.</p>
            </div>

            <button onClick={() => setShowRules(false)} className={`w-full mt-8 ${uiColor} text-white py-4 rounded-2xl font-black uppercase italic shadow-lg active:scale-95 transition-all`}>¡Entendido!</button>
          </div>
        </div>
      )}

      <nav className={`fixed bottom-6 left-1/2 -translate-x-1/2 w-[240px] h-14 ${uiColor} rounded-full flex justify-around items-center shadow-2xl px-4 border-b-4 border-black/20 z-40`}>
        <button onClick={() => setView("game")} className={`${view === 'game' ? 'text-white scale-110' : 'text-white/40'} transition-all`}><Home size={24}/></button>
        <button onClick={() => setView("history")} className={`${view === 'history' ? 'text-white scale-110' : 'text-white/40'} transition-all`}><History size={24}/></button>
        <a href="https://cafecito.app/anabelaro" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-all hover:scale-110 active:scale-95" title="Invitame un Cafecito"><Coffee size={24} /></a>
      </nav>
    </div>
  );
}
