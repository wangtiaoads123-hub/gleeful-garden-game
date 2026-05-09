import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, useCallback } from "react";

export const Route = createFileRoute("/")({
  component: SnakeGame,
  head: () => ({
    meta: [
      { title: "Neon Snake — 霓虹贪吃蛇" },
      { name: "description", content: "A cyberpunk-style snake game in your browser." },
    ],
  }),
});

const COLS = 24;
const ROWS = 24;
const CELL = 22;
const SPEED = 110;

type Point = { x: number; y: number };
type Dir = "UP" | "DOWN" | "LEFT" | "RIGHT";

const DIRS: Record<Dir, Point> = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};
const OPP: Record<Dir, Dir> = { UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT" };

type LangCode = "en" | "zh" | "ja" | "ko" | "de" | "it" | "fr" | "es" | "id" | "pl";

type Strings = {
  title: string; hint: string; score: string; best: string;
  ready: string; over: string; start: string; again: string;
};

const LANGS: { code: LangCode; label: string }[] = [
  { code: "en", label: "English" },
  { code: "zh", label: "中文" },
  { code: "ja", label: "日本語" },
  { code: "ko", label: "한국어" },
  { code: "de", label: "Deutsch" },
  { code: "it", label: "Italiano" },
  { code: "fr", label: "Français" },
  { code: "es", label: "Español" },
  { code: "id", label: "Bahasa" },
  { code: "pl", label: "Polski" },
];

const I18N: Record<LangCode, Strings> = {
  en: { title: "NEON SNAKE", hint: "Arrows / WASD to move · Space to pause / restart", score: "Score", best: "Best", ready: "Ready to play?", over: "Game Over", start: "Start", again: "Play Again" },
  zh: { title: "霓虹贪吃蛇", hint: "方向键 / WASD 控制 · 空格 暂停 / 重开", score: "得分", best: "最高", ready: "准备好了吗？", over: "游戏结束", start: "开始游戏", again: "再来一局" },
  ja: { title: "ネオン・スネーク", hint: "矢印 / WASD で移動 · スペースで一時停止 / 再開", score: "スコア", best: "最高", ready: "準備はいい？", over: "ゲームオーバー", start: "スタート", again: "もう一度" },
  ko: { title: "네온 스네이크", hint: "화살표 / WASD 이동 · 스페이스 일시정지 / 재시작", score: "점수", best: "최고", ready: "준비됐나요?", over: "게임 오버", start: "시작", again: "다시 하기" },
  de: { title: "NEON SCHLANGE", hint: "Pfeile / WASD zum Bewegen · Leertaste Pause / Neustart", score: "Punkte", best: "Bestwert", ready: "Bereit zu spielen?", over: "Spiel vorbei", start: "Starten", again: "Nochmal" },
  it: { title: "SERPENTE NEON", hint: "Frecce / WASD per muoverti · Spazio pausa / ricomincia", score: "Punteggio", best: "Record", ready: "Pronto a giocare?", over: "Game Over", start: "Inizia", again: "Rigioca" },
  fr: { title: "SERPENT NÉON", hint: "Flèches / WASD pour bouger · Espace pause / recommencer", score: "Score", best: "Record", ready: "Prêt à jouer ?", over: "Partie terminée", start: "Démarrer", again: "Rejouer" },
  es: { title: "SERPIENTE NEÓN", hint: "Flechas / WASD para mover · Espacio pausa / reiniciar", score: "Puntos", best: "Récord", ready: "¿Listo para jugar?", over: "Fin del juego", start: "Empezar", again: "Jugar de nuevo" },
  id: { title: "ULAR NEON", hint: "Panah / WASD untuk bergerak · Spasi jeda / mulai ulang", score: "Skor", best: "Terbaik", ready: "Siap bermain?", over: "Permainan Selesai", start: "Mulai", again: "Main Lagi" },
  pl: { title: "NEONOWY WĄŻ", hint: "Strzałki / WASD ruch · Spacja pauza / restart", score: "Wynik", best: "Rekord", ready: "Gotowy do gry?", over: "Koniec gry", start: "Start", again: "Zagraj ponownie" },
};

function detectLang(): LangCode {
  if (typeof window === "undefined") return "en";
  const saved = localStorage.getItem("snake_lang") as LangCode | null;
  if (saved && I18N[saved]) return saved;
  const n = (navigator.language || "en").toLowerCase();
  const map: [string, LangCode][] = [
    ["zh", "zh"], ["ja", "ja"], ["ko", "ko"], ["de", "de"], ["it", "it"],
    ["fr", "fr"], ["es", "es"], ["id", "id"], ["pl", "pl"], ["en", "en"],
  ];
  for (const [p, c] of map) if (n.startsWith(p)) return c;
  return "en";
}

function randFood(snake: Point[]): Point {
  while (true) {
    const p = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
    if (!snake.some((s) => s.x === p.x && s.y === p.y)) return p;
  }
}

function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [lang, setLang] = useState<LangCode>("en");
  const t = I18N[lang];

  const [snake, setSnake] = useState<Point[]>([{ x: 12, y: 12 }, { x: 11, y: 12 }, { x: 10, y: 12 }]);
  const [dir, setDir] = useState<Dir>("RIGHT");
  const [pendingDir, setPendingDir] = useState<Dir>("RIGHT");
  const [food, setFood] = useState<Point>({ x: 16, y: 12 });
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [running, setRunning] = useState(false);
  const [over, setOver] = useState(false);

  useEffect(() => {
    setLang(detectLang());
    const b = typeof window !== "undefined" ? Number(localStorage.getItem("snake_best") || 0) : 0;
    setBest(b);
  }, []);

  const changeLang = (c: LangCode) => {
    setLang(c);
    if (typeof window !== "undefined") localStorage.setItem("snake_lang", c);
  };

  const reset = useCallback(() => {
    const s = [{ x: 12, y: 12 }, { x: 11, y: 12 }, { x: 10, y: 12 }];
    setSnake(s);
    setDir("RIGHT");
    setPendingDir("RIGHT");
    setFood(randFood(s));
    setScore(0);
    setOver(false);
    setRunning(true);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      let nd: Dir | null = null;
      if (k === "arrowup" || k === "w") nd = "UP";
      else if (k === "arrowdown" || k === "s") nd = "DOWN";
      else if (k === "arrowleft" || k === "a") nd = "LEFT";
      else if (k === "arrowright" || k === "d") nd = "RIGHT";
      else if (k === " ") {
        e.preventDefault();
        if (over) reset();
        else setRunning((r) => !r);
        return;
      }
      if (nd) {
        e.preventDefault();
        if (nd !== OPP[dir]) setPendingDir(nd);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dir, over, reset]);

  useEffect(() => {
    if (!running || over) return;
    const id = setInterval(() => {
      setSnake((prev) => {
        const d = pendingDir;
        setDir(d);
        const head = prev[0];
        const nh = { x: head.x + DIRS[d].x, y: head.y + DIRS[d].y };
        if (nh.x < 0 || nh.x >= COLS || nh.y < 0 || nh.y >= ROWS) {
          setOver(true); setRunning(false); return prev;
        }
        if (prev.some((s, i) => i !== prev.length - 1 && s.x === nh.x && s.y === nh.y)) {
          setOver(true); setRunning(false); return prev;
        }
        const ate = nh.x === food.x && nh.y === food.y;
        const next = [nh, ...prev];
        if (!ate) next.pop();
        else {
          setScore((s) => {
            const ns = s + 10;
            setBest((b) => {
              const nb = Math.max(b, ns);
              if (typeof window !== "undefined") localStorage.setItem("snake_best", String(nb));
              return nb;
            });
            return ns;
          });
          setFood(randFood(next));
        }
        return next;
      });
    }, SPEED);
    return () => clearInterval(id);
  }, [running, over, pendingDir, food]);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const W = COLS * CELL;
    const H = ROWS * CELL;

    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, "#0a0420");
    bg.addColorStop(1, "#150a35");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = "rgba(255,255,255,0.04)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= COLS; i++) {
      ctx.beginPath(); ctx.moveTo(i * CELL, 0); ctx.lineTo(i * CELL, H); ctx.stroke();
    }
    for (let j = 0; j <= ROWS; j++) {
      ctx.beginPath(); ctx.moveTo(0, j * CELL); ctx.lineTo(W, j * CELL); ctx.stroke();
    }

    const fx = food.x * CELL + CELL / 2;
    const fy = food.y * CELL + CELL / 2;
    ctx.shadowColor = "#ff2e88";
    ctx.shadowBlur = 18;
    ctx.fillStyle = "#ff2e88";
    ctx.beginPath();
    ctx.arc(fx, fy, CELL / 2 - 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    snake.forEach((s, i) => {
      const isHead = i === 0;
      ctx.shadowColor = isHead ? "#00ffd1" : "#22d3ee";
      ctx.shadowBlur = isHead ? 20 : 10;
      ctx.fillStyle = isHead ? "#00ffd1" : `hsl(${180 + i * 4}, 90%, ${60 - Math.min(i, 20)}%)`;
      const pad = isHead ? 1 : 2;
      ctx.fillRect(s.x * CELL + pad, s.y * CELL + pad, CELL - pad * 2, CELL - pad * 2);
    });
    ctx.shadowBlur = 0;
  }, [snake, food]);

  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    const tt = e.touches[0];
    touchStart.current = { x: tt.clientX, y: tt.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const tt = e.changedTouches[0];
    const dx = tt.clientX - touchStart.current.x;
    const dy = tt.clientY - touchStart.current.y;
    if (Math.abs(dx) < 20 && Math.abs(dy) < 20) return;
    let nd: Dir;
    if (Math.abs(dx) > Math.abs(dy)) nd = dx > 0 ? "RIGHT" : "LEFT";
    else nd = dy > 0 ? "DOWN" : "UP";
    if (nd !== OPP[dir]) setPendingDir(nd);
    touchStart.current = null;
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center px-4 py-6"
      style={{ background: "radial-gradient(ellipse at top, #1a0a3a 0%, #05010f 60%)" }}>

      <div className="w-full max-w-2xl flex justify-end mb-4">
        <select
          value={lang}
          onChange={(e) => changeLang(e.target.value as LangCode)}
          className="bg-white/5 border border-cyan-400/30 text-white/90 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-400"
          aria-label="Language"
        >
          {LANGS.map((l) => (
            <option key={l.code} value={l.code} className="bg-[#0a0420]">{l.label}</option>
          ))}
        </select>
      </div>

      <div className="mb-6 text-center">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight"
          style={{
            background: "linear-gradient(90deg,#00ffd1,#ff2e88)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 0 24px rgba(0,255,209,0.35))",
          }}>
          {t.title}
        </h1>
        <p className="mt-2 text-sm text-white/60">{t.hint}</p>
      </div>

      <div className="flex gap-4 mb-4 text-white/90 font-mono">
        <div className="px-4 py-2 rounded-lg border border-cyan-400/30 bg-cyan-400/5">
          {t.score} <span className="text-cyan-300 font-bold ml-1">{score}</span>
        </div>
        <div className="px-4 py-2 rounded-lg border border-pink-400/30 bg-pink-400/5">
          {t.best} <span className="text-pink-300 font-bold ml-1">{best}</span>
        </div>
      </div>

      <div className="relative rounded-2xl p-3"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(0,255,209,0.25)",
          boxShadow: "0 0 60px rgba(0,255,209,0.15), inset 0 0 30px rgba(255,46,136,0.08)",
        }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <canvas
          ref={canvasRef}
          width={COLS * CELL}
          height={ROWS * CELL}
          className="block rounded-lg max-w-full h-auto"
        />
        {(!running || over) && (
          <div className="absolute inset-0 flex items-center justify-center rounded-2xl backdrop-blur-sm bg-black/40">
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-3">
                {over ? t.over : t.ready}
              </div>
              <button
                onClick={over ? reset : () => setRunning(true)}
                className="px-6 py-2.5 rounded-full font-semibold text-black transition-transform hover:scale-105"
                style={{
                  background: "linear-gradient(90deg,#00ffd1,#22d3ee)",
                  boxShadow: "0 0 24px rgba(0,255,209,0.5)",
                }}
              >
                {over ? t.again : t.start}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 grid grid-cols-3 gap-2 md:hidden text-white/80 w-48">
        <div />
        <button className="py-3 rounded-lg bg-white/5 border border-white/10" onClick={() => dir !== "DOWN" && setPendingDir("UP")}>↑</button>
        <div />
        <button className="py-3 rounded-lg bg-white/5 border border-white/10" onClick={() => dir !== "RIGHT" && setPendingDir("LEFT")}>←</button>
        <button className="py-3 rounded-lg bg-white/5 border border-white/10" onClick={() => dir !== "UP" && setPendingDir("DOWN")}>↓</button>
        <button className="py-3 rounded-lg bg-white/5 border border-white/10" onClick={() => dir !== "LEFT" && setPendingDir("RIGHT")}>→</button>
      </div>
    </div>
  );
}
