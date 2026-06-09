import React from "react";
import { Contact } from "../../types";
import { Search, Loader2, Sparkles, ShieldCheck, Mail, Globe, BrainCircuit } from "lucide-react";

interface EnricherPanelProps {
  contacts: Contact[];
  onEnrichLead?: (contactId: string) => void;
}

export default function EnricherPanel({ contacts, onEnrichLead }: EnricherPanelProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [enrichingMap, setEnrichingMap] = React.useState<Record<string, boolean>>({});

  const filtered = contacts.filter((c) => {
    const term = searchTerm.toLowerCase();
    return c.name.toLowerCase().includes(term) || c.company.toLowerCase().includes(term);
  });

  const handleEnrich = (id: string) => {
    setEnrichingMap((p) => ({ ...p, id: true }));
    // Mock triggers trigger execution delay
    setTimeout(() => {
      setEnrichingMap((p) => ({ ...p, id: false }));
      if (onEnrichLead) onEnrichLead(id);
    }, 1200);
  };

  return (
    <div className="space-y-6" id="enrichment-module-container">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <div>
            <h2 className="font-bold text-slate-800 text-base">Metadata AI Enrichment Center</h2>
            <p className="text-xs text-slate-400 mt-0.5">Scans scraped candidate portals via Gemini API to pull technology stacks & sizes</p>
          </div>
          <div className="flex gap-2 bg-indigo-50 text-indigo-700 font-mono text-xs px-3 py-1.5 rounded-xl border border-indigo-100">
            <BrainCircuit className="w-4 h-4 text-indigo-500 animate-pulse" />
            <span>AI Enricher Status: READY</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-4 flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter leads on file to review enrichment parameter attributes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 pl-9 pr-4 py-2 rounded-xl text-xs outline-none focus:border-indigo-600 focus:bg-white"
            />
          </div>
        </div>

        {/* List of Enriched Cards */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          {filtered.length === 0 ? (
            <div className="col-span-2 p-12 text-center text-slate-400 text-xs italic">
              No matching CRM lead accounts to display. Run Google Maps scraper first!
            </div>
          ) : (
            filtered.map((item) => {
              const targetEnriched = item.enrichedData && Object.keys(item.enrichedData).length > 0;
              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border transition-all ${
                    targetEnriched
                      ? "bg-slate-50 border-slate-200/80 hover:border-slate-300"
                      : "bg-white border-slate-100 border-dashed"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm leading-tight">{item.name}</h4>
                      <p className="text-[10px] text-slate-400 font-mono font-medium truncate uppercase">{item.company}</p>
                    </div>
                    <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded ${
                      targetEnriched ? "bg-emerald-100 text-emerald-800 border border-emerald-200/30" : "bg-slate-100 text-slate-400"
                    }`}>
                      {targetEnriched ? "AI COMPLETED" : "SCROLL PENDING"}
                    </span>
                  </div>

                  {targetEnriched ? (
                    <div className="mt-3 space-y-2 text-[11px] text-slate-600 leading-normal font-mono">
                      <div className="flex justify-between py-1 border-b border-slate-150/40 border-slate-100">
                        <span className="text-slate-400 text-[10px]">Headcount size:</span>
                        <span className="font-bold text-slate-800">{item.enrichedData?.employeeCount || "5 - 20"} employees</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-400 text-[10px]">LinkedIn domain:</span>
                        <span className="text-indigo-600 truncate max-w-[150px]">{item.enrichedData?.linkedinUrl || "N/A"}</span>
                      </div>
                      <div className="p-2 bg-white rounded border border-slate-100 text-[10px] font-sans font-light text-slate-500">
                        {item.enrichedData?.description || "Enriched via Gemini schema web scraper engine."}
                      </div>

                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.enrichedData?.techStack?.map((t) => (
                          <span key={t} className="bg-slate-200/50 text-slate-700 text-[9px] px-1.5 py-0.5 rounded uppercase">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Globe className="w-3.5 h-3.5" /> No tech-stack crawled
                      </span>
                      <button
                        onClick={() => handleEnrich(item.id)}
                        disabled={enrichingMap[item.id]}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1 px-3 rounded-lg flex items-center gap-1 transition-colors text-[10px] uppercase font-mono tracking-wider shadow-xs"
                      >
                        {enrichingMap[item.id] ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3 h-3" />
                            Trigger Rich Audit
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
