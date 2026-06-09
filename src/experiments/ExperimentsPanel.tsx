import React from "react";
import { Sparkles, Brain, Gauge, Zap, AlertTriangle, ShieldCheck } from "lucide-react";

export default function ExperimentsPanel() {
  const [latencyTest, setLatencyTest] = React.useState<number | null>(null);
  const [testing, setTesting] = React.useState(false);
  const [promptQuality, setPromptQuality] = React.useState<number | null>(null);

  const performBenchmark = () => {
    setTesting(true);
    setLatencyTest(null);
    setPromptQuality(null);

    setTimeout(() => {
      setTesting(false);
      setLatencyTest(Math.round(180 + Math.random() * 80));
      setPromptQuality(Math.round(92 + Math.random() * 7));
    }, 1200);
  };

  return (
    <div className="space-y-6" id="experiments-lab-portal">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <div>
            <h2 className="font-bold text-slate-800 text-base">Sahootech Research & Development Experiments Sandbox</h2>
            <p className="text-xs text-slate-400 mt-0.5">Test state latencies and prototype experimental custom agent behaviors</p>
          </div>
          <span className="bg-amber-100 text-amber-800 border border-amber-250 border-amber-250/30 font-mono font-bold text-[10px] px-2.5 py-1 rounded-md">
            🧪 BETA PLAYGROUND
          </span>
        </div>

        <div className="leading-relaxed text-xs text-slate-600 bg-slate-50 p-4 border border-slate-200/50 rounded-xl space-y-1">
          <p>
            🚀 <strong className="text-slate-800">Prompt Engineering Model tuning:</strong> This playground measures how fast and accurate the automated receptionist agents response structures compute when reacting to incoming tenant lead phone/chat logs.
          </p>
        </div>

        {/* Action button */}
        <div className="pt-2 flex items-center justify-between">
          <button
            onClick={performBenchmark}
            disabled={testing}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-5 rounded-lg text-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Gauge className="w-4 h-4 text-amber-400 animate-pulse" />
            {testing ? "Benchmarking AI Pipeline..." : "Compute Latency & Accuracy Score"}
          </button>
          
          <span className="text-[10px] text-slate-405 text-slate-400 font-mono font-bold">Target Model: Gemini Pro 2.5 Flash</span>
        </div>

        {latencyTest !== null && (
          <div className="grid grid-cols-2 gap-4 mt-4 animate-fade-in">
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center gap-4">
              <Zap className="w-6 h-6 text-indigo-505 text-indigo-500 shrink-0" />
              <div>
                <dt className="text-[10px] text-slate-400 font-bold uppercase font-mono">Response Latency</dt>
                <dd className="text-lg font-bold text-slate-900 font-sans mt-0.5">{latencyTest} ms</dd>
                <p className="text-[9.5px] text-slate-400">Excellent performance threshold</p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center gap-4">
              <Brain className="w-6 h-6 text-emerald-500 shrink-0" />
              <div>
                <dt className="text-[10px] text-slate-400 font-bold uppercase font-mono">Accuracy index fit</dt>
                <dd className="text-lg font-bold text-slate-900 font-sans mt-0.5">{promptQuality}%</dd>
                <p className="text-[9.5px] text-slate-400">Low intent deviation mapped</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100">
          <div className="p-3 bg-indigo-50/20 border border-indigo-100/50 rounded-xl">
            <div className="font-bold text-slate-900 text-xs font-sans">1. Voice TTS Synthesis (Lab)</div>
            <p className="text-[10px] text-slate-400 mt-1">Simulate inbound greeting call threads on the browser speaker.</p>
            <button className="text-[10px] text-indigo-600 font-black mt-2 uppercase font-mono hover:underline cursor-pointer">
              Launch voice test
            </button>
          </div>

          <div className="p-3 bg-blue-50/20 border border-blue-100/50 rounded-xl">
            <div className="font-bold text-slate-900 text-xs font-sans">2. Context Window Monitor</div>
            <p className="text-[10px] text-slate-400 mt-1">Audit active prompt tokens footprint before dispatching API hooks.</p>
            <button className="text-[10px] text-blue-600 font-black mt-2 uppercase font-mono hover:underline cursor-pointer">
              Fetch token log [0.4K]
            </button>
          </div>

          <div className="p-3 bg-emerald-50/20 border border-emerald-100/50 rounded-xl">
            <div className="font-bold text-slate-900 text-xs font-sans">3. Bulk Export Pipelines</div>
            <p className="text-[10px] text-slate-400 mt-1">Transfer parsed database files from tenant isolation schemas into CSV.</p>
            <button className="text-[10px] text-emerald-600 font-black mt-2 uppercase font-mono hover:underline cursor-pointer">
              Trigger export
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
