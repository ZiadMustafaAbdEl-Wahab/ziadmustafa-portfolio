import { Fragment, useEffect, useMemo, useRef, useState } from "react";

type WellType = "sample" | "pos" | "neg" | "ntc" | "empty";
type Well = { type: WellType; logCopies: number };
type Channel = "FAM" | "HEX" | "ROX" | "Cy5";

const INSTRUMENTS = [
  { id: "dt", name: "DT-Lite", brand: "DNA Technology", efficiency: 0.97 },
  { id: "step", name: "StepOne", brand: "Applied Biosystems", efficiency: 0.95 },
  { id: "cfx", name: "CFX96", brand: "Bio-Rad", efficiency: 0.98 },
  { id: "rg", name: "Rotor-Gene Q", brand: "Qiagen", efficiency: 0.99 },
];

const CHANNEL_VAR: Record<Channel, string> = {
  FAM: "var(--fam)",
  HEX: "var(--hex)",
  ROX: "var(--rox)",
  Cy5: "var(--cy5)",
};

const TYPE_LABEL: Record<WellType, string> = {
  sample: "Sample",
  pos: "Positive ctrl",
  neg: "Negative ctrl",
  ntc: "NTC",
  empty: "Empty",
};

const ROWS = ["A", "B", "C", "D"];
const COLS = 6;
const CYCLES = 40;

function seeded(i: number) {
  const x = Math.sin(i * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

function initialWells(): Well[] {
  return Array.from({ length: ROWS.length * COLS }, (_, i) => {
    if (i === 0) return { type: "pos", logCopies: 6 };
    if (i === 1) return { type: "neg", logCopies: 0 };
    if (i === 2) return { type: "ntc", logCopies: 0 };
    if (i < 15) return { type: "sample", logCopies: Math.round((2 + seeded(i) * 5) * 10) / 10 };
    return { type: "empty", logCopies: 0 };
  });
}

/** Computes theoretical Ct from log10 copies and efficiency */
export function theoreticalCt(logCopies: number, efficiency: number) {
  // Ct ≈ (log10(Nthreshold) - log10(N0)) / log10(1+E); Nthreshold ~ 10^10
  return (10 - logCopies) / Math.log10(1 + efficiency);
}

function curve(well: Well, eff: number, idx: number, cycle: number) {
  const noise = (seeded(idx * 41 + cycle) - 0.5) * 0.015;
  if (well.type === "empty") return 0;
  if (well.type === "neg" || well.type === "ntc" || well.logCopies <= 0) return 0.02 + noise;
  const ct = theoreticalCt(well.logCopies, eff);
  const plateau = 0.85 + seeded(idx) * 0.15;
  return plateau / (1 + Math.exp(-(cycle - ct - 1.5) / 1.6)) + 0.02 + noise;
}

export function QpcrSimulator() {
  const [instrument, setInstrument] = useState(INSTRUMENTS[2]!);
  const [channel, setChannel] = useState<Channel>("FAM");
  const [wells, setWells] = useState<Well[]>(initialWells);
  const [selected, setSelected] = useState(3);
  const [threshold, setThreshold] = useState(0.2);
  const [cycle, setCycle] = useState(0);
  const [running, setRunning] = useState(false);
  const [logScale, setLogScale] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    timer.current = window.setInterval(() => {
      setCycle((c) => {
        if (c >= CYCLES) {
          setRunning(false);
          return c;
        }
        return c + 1;
      });
    }, 110);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [running]);

  const start = () => {
    setCycle(0);
    setRunning(true);
  };

  const results = useMemo(() => {
    return wells.map((w, i) => {
      if (w.type === "empty") return null;
      let ct: number | null = null;
      for (let c = 1; c <= cycle; c++) {
        const prev = curve(w, instrument.efficiency, i, c - 1);
        const cur = curve(w, instrument.efficiency, i, c);
        if (prev < threshold && cur >= threshold) {
          ct = c - 1 + (threshold - prev) / (cur - prev);
          break;
        }
      }
      return ct;
    });
  }, [wells, cycle, threshold, instrument]);

  const interpret = (i: number) => {
    const w = wells[i]!;
    const ct = results[i] ?? null;
    if (w.type === "empty") return "—";
    if (cycle < CYCLES) return "running…";
    if (w.type === "pos") return ct !== null && ct < 35 ? "Valid ✓" : "Run invalid ✗";
    if (w.type === "neg" || w.type === "ntc") return ct === null ? "Valid ✓" : "Contamination ✗";
    if (ct === null) return "Not detected";
    if (ct < 30) return "Positive";
    if (ct < 37) return "Weak positive";
    return "Re-test";
  };

  // chart
  const W = 640;
  const H = 300;
  const P = 36;
  const toX = (c: number) => P + (c / CYCLES) * (W - P * 1.5);
  const toY = (v: number) => {
    if (logScale) {
      const lv = Math.log10(Math.max(v, 0.001));
      return H - P - ((lv + 3) / 3.1) * (H - P * 1.6);
    }
    return H - P - (v / 1.05) * (H - P * 1.6);
  };

  const color = CHANNEL_VAR[channel];
  const sel = wells[selected]!;

  const updateSel = (patch: Partial<Well>) =>
    setWells((ws) => ws.map((w, i) => (i === selected ? { ...w, ...patch } : w)));

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      {/* Control panel */}
      <div className="space-y-5 rounded-xl border bg-card p-5 font-mono text-sm">
        <div>
          <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">01 · Instrument</p>
          <div className="grid grid-cols-2 gap-2">
            {INSTRUMENTS.map((ins) => (
              <button
                key={ins.id}
                onClick={() => setInstrument(ins)}
                className={`rounded-md border px-2 py-2 text-left transition ${
                  instrument.id === ins.id ? "border-primary bg-primary/10 text-primary" : "hover:border-muted-foreground"
                }`}
              >
                <span className="block font-bold">{ins.name}</span>
                <span className="text-[10px] text-muted-foreground">{ins.brand}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">02 · Detection channel</p>
          <div className="flex gap-2">
            {(Object.keys(CHANNEL_VAR) as Channel[]).map((ch) => (
              <button
                key={ch}
                onClick={() => setChannel(ch)}
                className={`flex-1 rounded-md border py-1.5 text-xs transition ${channel === ch ? "border-foreground" : "opacity-60 hover:opacity-100"}`}
                style={{ color: CHANNEL_VAR[ch] }}
              >
                {ch}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">
            03 · Plate setup — well {ROWS[Math.floor(selected / COLS)]}
            {(selected % COLS) + 1}
          </p>
          <select
            value={sel.type}
            onChange={(e) => {
              const type = e.target.value as WellType;
              updateSel({ type, logCopies: type === "pos" ? 6 : type === "sample" ? 4 : 0 });
            }}
            className="mb-3 w-full rounded-md border bg-background px-2 py-2"
          >
            {(Object.keys(TYPE_LABEL) as WellType[]).map((t) => (
              <option key={t} value={t}>
                {TYPE_LABEL[t]}
              </option>
            ))}
          </select>
          {(sel.type === "sample" || sel.type === "pos") && (
            <label className="block">
              <span className="flex justify-between text-xs text-muted-foreground">
                <span>Template load</span>
                <span className="text-foreground">10^{sel.logCopies.toFixed(1)} copies</span>
              </span>
              <input
                type="range"
                min={0}
                max={8}
                step={0.1}
                value={sel.logCopies}
                onChange={(e) => updateSel({ logCopies: Number(e.target.value) })}
                className="w-full accent-primary"
              />
            </label>
          )}
        </div>

        <label className="block">
          <span className="flex justify-between text-xs uppercase tracking-widest text-muted-foreground">
            <span>04 · Threshold</span>
            <span className="text-accent">{threshold.toFixed(2)} ΔRn</span>
          </span>
          <input
            type="range"
            min={0.05}
            max={0.8}
            step={0.01}
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            className="w-full accent-accent"
          />
        </label>

        <div className="flex gap-2">
          <button
            onClick={start}
            disabled={running}
            className="flex-1 rounded-md bg-primary py-2.5 font-bold text-primary-foreground shadow-glow transition hover:brightness-110 disabled:opacity-50"
          >
            {running ? "RUNNING…" : cycle > 0 ? "▶ RE-RUN" : "▶ START RUN"}
          </button>
          <button
            onClick={() => {
              setRunning(false);
              setCycle(0);
              setWells(initialWells());
            }}
            className="rounded-md border px-3 hover:border-foreground"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Right side */}
      <div className="space-y-6">
        <div className="rounded-xl border bg-card p-4">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
            <span className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${running ? "animate-blink bg-primary" : "bg-muted-foreground"}`} />
              {instrument.brand} {instrument.name} · Amplification plot · {channel}
            </span>
            <span className="flex items-center gap-3">
              <span>
                Cycle <span className="text-primary">{String(cycle).padStart(2, "0")}</span>/{CYCLES}
              </span>
              <button onClick={() => setLogScale((l) => !l)} className="rounded border px-2 py-0.5 hover:border-foreground">
                {logScale ? "Log" : "Linear"}
              </button>
            </span>
          </div>
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
            {Array.from({ length: 9 }, (_, i) => (
              <line key={i} x1={toX(i * 5)} x2={toX(i * 5)} y1={P * 0.6} y2={H - P} stroke="var(--grid)" />
            ))}
            {Array.from({ length: 6 }, (_, i) => {
              const y = P * 0.6 + (i * (H - P * 1.6)) / 5;
              return <line key={i} x1={P} x2={W - P / 2} y1={y} y2={y} stroke="var(--grid)" />;
            })}
            {Array.from({ length: 9 }, (_, i) => (
              <text key={i} x={toX(i * 5)} y={H - P + 16} fontSize="10" textAnchor="middle" fill="var(--muted-foreground)" fontFamily="var(--font-mono)">
                {i * 5}
              </text>
            ))}
            <text x={W / 2} y={H - 4} fontSize="10" textAnchor="middle" fill="var(--muted-foreground)" fontFamily="var(--font-mono)">
              Cycle
            </text>
            <text x={10} y={H / 2} fontSize="10" textAnchor="middle" fill="var(--muted-foreground)" fontFamily="var(--font-mono)" transform={`rotate(-90 10 ${H / 2})`}>
              ΔRn
            </text>
            {wells.map((w, i) => {
              if (w.type === "empty" || cycle === 0) return null;
              const pts = Array.from({ length: cycle + 1 }, (_, c) => `${toX(c)},${toY(curve(w, instrument.efficiency, i, c))}`).join(" ");
              const isSel = i === selected;
              return (
                <polyline
                  key={i}
                  points={pts}
                  fill="none"
                  stroke={w.type === "pos" ? "var(--foreground)" : w.type === "sample" ? color : "var(--muted-foreground)"}
                  strokeWidth={isSel ? 3 : 1.4}
                  opacity={isSel ? 1 : 0.7}
                  style={isSel ? { filter: `drop-shadow(0 0 6px ${color})` } : undefined}
                />
              );
            })}
            <line x1={P} x2={W - P / 2} y1={toY(threshold)} y2={toY(threshold)} stroke="var(--accent)" strokeDasharray="6 4" strokeWidth={1.5} />
            <text x={W - P / 2} y={toY(threshold) - 5} fontSize="10" textAnchor="end" fill="var(--accent)" fontFamily="var(--font-mono)">
              threshold
            </text>
          </svg>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border bg-card p-4">
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">Plate view · click a well</p>
            <div className="grid gap-1.5" style={{ gridTemplateColumns: `20px repeat(${COLS}, 1fr)` }}>
              <span />
              {Array.from({ length: COLS }, (_, c) => (
                <span key={c} className="text-center font-mono text-[10px] text-muted-foreground">
                  {c + 1}
                </span>
              ))}
              {ROWS.map((r, ri) => (
                <Fragment key={r}>
                  <span className="self-center font-mono text-[10px] text-muted-foreground">
                    {r}
                  </span>
                  {Array.from({ length: COLS }, (_, c) => {
                    const i = ri * COLS + c;
                    const w = wells[i]!;
                    const ct = results[i];
                    const lit = ct !== null && w.type !== "empty";
                    return (
                      <button
                        key={i}
                        onClick={() => setSelected(i)}
                        title={`${r}${c + 1} · ${TYPE_LABEL[w.type]}`}
                        className={`aspect-square rounded-full border-2 font-mono text-[9px] font-bold transition ${
                          i === selected ? "scale-110 border-foreground" : "border-border"
                        }`}
                        style={{
                          background: lit ? color : w.type === "empty" ? "transparent" : "var(--muted)",
                          color: lit ? "var(--background)" : "var(--muted-foreground)",
                          boxShadow: lit ? `0 0 12px ${color}` : undefined,
                        }}
                      >
                        {w.type === "pos" ? "P" : w.type === "neg" ? "N" : w.type === "ntc" ? "NTC" : w.type === "sample" ? "S" : ""}
                      </button>
                    );
                  })}
                </Fragment>
              ))}
            </div>
          </div>

          <div className="max-h-[300px] overflow-auto rounded-xl border bg-card p-4">
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">Results · Ct values</p>
            <table className="w-full font-mono text-xs">
              <thead className="text-muted-foreground">
                <tr className="text-left">
                  <th className="pb-2">Well</th>
                  <th className="pb-2">Type</th>
                  <th className="pb-2">Ct</th>
                  <th className="pb-2">Result</th>
                </tr>
              </thead>
              <tbody>
                {wells.map((w, i) =>
                  w.type === "empty" ? null : (
                    <tr
                      key={i}
                      onClick={() => setSelected(i)}
                      className={`cursor-pointer border-t ${i === selected ? "bg-primary/10" : "hover:bg-muted"}`}
                    >
                      <td className="py-1.5">
                        {ROWS[Math.floor(i / COLS)]}
                        {(i % COLS) + 1}
                      </td>
                      <td>{TYPE_LABEL[w.type]}</td>
                      <td className="text-primary">{results[i] !== null ? results[i]!.toFixed(2) : "Undet."}</td>
                      <td className={interpret(i).includes("✗") ? "text-destructive" : ""}>{interpret(i)}</td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        </div>
        <p className="font-mono text-[11px] text-muted-foreground">
          Educational simulation. Curves are modelled from template load and instrument efficiency; not for diagnostic use.
        </p>
      </div>
    </div>
  );
}
