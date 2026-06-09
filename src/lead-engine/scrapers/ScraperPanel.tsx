import React from "react";
import { ScraperJob, Contact, Tenant } from "../../types";
import { RefreshCw, Sparkles, Target, Database } from "lucide-react";

interface ScraperPanelProps {
  selectedTenant: Tenant;
  scraperKeyword: string;
  setScraperKeyword: (val: string) => void;
  scraperUrl: string;
  setScraperUrl: (val: string) => void;
  scraperLoading: boolean;
  onRunScraper: (e: React.FormEvent) => void;
  contacts: Contact[];
  scrapers: ScraperJob[];
}

export default function ScraperPanel({
  selectedTenant,
  scraperKeyword,
  setScraperKeyword,
  scraperUrl,
  setScraperUrl,
  scraperLoading,
  onRunScraper,
  contacts,
  scrapers,
}: ScraperPanelProps) {
  const scrapedContacts = contacts.filter((c) => c.source === "scraper");

  return (
    <div className="grid grid-cols-12 gap-6" id="lead-scrapers-container">
      {/* Search Input Launcher */}
      <div className="col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="font-bold text-slate-800 text-base">Google Maps & Web Directory Lead Scrapper</h2>
          <p className="text-xs text-slate-400 mt-0.5">Scrapes directories and formats leads under high precision criteria</p>
        </div>

        <div className="mt-4 leading-relaxed text-xs text-slate-600 bg-slate-50 p-4 border border-slate-200/50 rounded-xl space-y-1">
          <div>🤖 <strong className="text-slate-800">Crawler Intelligence Protocol:</strong></div>
          <div>Automatically searches client keywords, indexes relevant digital presence metrics, computes AI score ratios, and persists targets inside tenant environments isolation models.</div>
        </div>

        <form onSubmit={onRunScraper} className="space-y-4 mt-6">
          <div className="grid grid-cols-2 gap-4 text-xs text-slate-700">
            <div>
              <label className="block text-slate-500 mb-1 font-bold">Search sector keyword</label>
              <input
                required
                type="text"
                placeholder="e.g. Paris Web Agencies or Johannesburg Dental"
                value={scraperKeyword}
                onChange={(e) => setScraperKeyword(e.target.value)}
                className="w-full bg-white border border-slate-200 py-2.5 px-3 rounded-lg outline-none focus:border-indigo-600 font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-500 mb-1 font-bold">Directory search url</label>
              <input
                required
                type="text"
                placeholder="e.g. google.fr/maps/search/web-designers"
                value={scraperUrl}
                onChange={(e) => setScraperUrl(e.target.value)}
                className="w-full bg-white border border-slate-200 py-2.5 px-3 rounded-lg outline-none focus:border-indigo-600 font-medium"
              />
            </div>
          </div>

          <div className="text-right">
            <button
              type="submit"
              disabled={scraperLoading}
              className="bg-indigo-600 text-white font-bold py-2.5 px-5 rounded-lg text-xs hover:bg-indigo-700 transition-colors cursor-pointer flex items-center justify-end gap-2 ml-auto disabled:opacity-50"
            >
              {scraperLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Crawling maps directory schemas...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Initialize Background Scraper Worker
                </>
              )}
            </button>
          </div>
        </form>

        {/* Recently Web Scraped leads list */}
        <div className="mt-8">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono mb-3">Recently Scraped Lead Pool</h3>
          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {scrapedContacts.length === 0 ? (
              <div className="p-6 border border-dashed border-slate-200 rounded-xl text-center text-slate-400 text-xs">
                No scraped leads detected. Trigger search queries above.
              </div>
            ) : (
              scrapedContacts.map((lead) => (
                <div key={lead.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center text-xs font-mono">
                  <div>
                    <span className="font-bold text-slate-950 font-sans">{lead.name}</span>
                    <span className="text-[10px] text-slate-400 font-bold block ml-1">
                      🏢 {lead.company} ({lead.email || "No email"})
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded border border-indigo-100/40">
                      FIT SCORE: {lead.score}%
                    </span>
                    <span className="text-emerald-600 font-bold text-[10px] flex items-center gap-1">
                      <Database className="w-3 h-3" /> Saved CRM
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Sidebar execution console */}
      <div className="col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col justify-start">
        <h3 className="font-bold text-slate-800 text-sm mb-3">Cron Streams (BullMQ Status)</h3>
        <p className="text-slate-400 text-[10px] mb-4">Realtime queue monitoring for active isolated clients</p>
        
        <div className="space-y-4 overflow-y-auto max-h-[380px]">
          {scrapers.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-xs italic border border-dashed rounded-lg">
              No threads logged under this isolation sandbox context.
            </div>
          ) : (
            scrapers.map((job) => (
              <div key={job.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 font-mono text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-indigo-700 block truncate max-w-[130px]">{job.keyword}</span>
                    <span className="text-[9px] text-slate-400 truncate block max-w-[130px]">{job.url}</span>
                  </div>
                  <span className={`text-[9.5px] font-black px-1.5 py-0.5 rounded ${
                    job.status === "completed" ? "bg-emerald-100 text-emerald-800" : "bg-indigo-100 text-indigo-850 animate-pulse"
                  }`}>
                    {job.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1.5 border-t border-slate-200/50">
                  <span>Count:</span>
                  <span className="font-bold text-slate-700">{job.itemsFound} items</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
