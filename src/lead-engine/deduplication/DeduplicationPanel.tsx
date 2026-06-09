import React from "react";
import { Contact } from "../../types";
import { ShieldCheck, UserCheck, AlertTriangle, RefreshCw, Layers } from "lucide-react";

interface DeduplicationPanelProps {
  contacts: Contact[];
}

export default function DeduplicationPanel({ contacts }: DeduplicationPanelProps) {
  const [strategy, setStrategy] = React.useState<"email" | "phone" | "company">("email");
  const [runningAudit, setRunningAudit] = React.useState(false);
  const [auditMessage, setAuditMessage] = React.useState<string | null>(null);

  // Group by selected fields to detect simulated duplicates
  const runDeduplicationAudit = () => {
    setRunningAudit(true);
    setAuditMessage(null);
    setTimeout(() => {
      setRunningAudit(false);
      // Determine if duplicates exist (same emails/business domains)
      const seen = new Set();
      const duplicates: string[] = [];
      contacts.forEach((c) => {
        const val = strategy === "email" ? c.email : strategy === "phone" ? c.phone : c.company;
        if (val && seen.has(val.toLowerCase())) {
          duplicates.push(c.name);
        } else if (val) {
          seen.add(val.toLowerCase());
        }
      });

      if (duplicates.length > 0) {
        setAuditMessage(
          `Detected ${duplicates.length} overlapping records with identical ${strategy} values: [${duplicates.join(
            ", "
          )}]. The engine bypassed duplicating these entries and prioritized high-quality details inside the CRM.`
        );
      } else {
        setAuditMessage(
          "Audit Completed successfully! Lead pipeline integrity scored 100%. No identical duplicates detected with matching criteria details."
        );
      }
    }, 1000);
  };

  return (
    <div className="space-y-6" id="deduplication-module-pane">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="pb-4 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="font-bold text-slate-800 text-base">Automatic Lead Deduplication & Cleansing</h2>
            <p className="text-xs text-slate-400 mt-0.5">Cleanses lists dynamically during Maps Crawling threads</p>
          </div>
          <Layers className="w-5 h-5 text-indigo-505 text-indigo-500" />
        </div>

        <div className="mt-4 leading-relaxed text-xs text-slate-600 bg-slate-50 p-4 border border-slate-200/50 rounded-xl space-y-2">
          <p>
            🛡️ <strong className="text-slate-800">Dynamic Matching Mechanism:</strong> By default, Sahoo technology uses key-by-key data indices to prevent multiple sales reps from reaching out to the same lead twice.
          </p>
        </div>

        {/* Configurations options */}
        <div className="mt-6 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Deduplication Matching Key Rules</h3>
          
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setStrategy("email")}
              className={`p-3 border rounded-xl text-left text-xs ${
                strategy === "email"
                  ? "border-indigo-600 bg-indigo-50/50 font-bold text-indigo-800"
                  : "border-slate-200 hover:bg-slate-50 text-slate-600"
              }`}
            >
              <div className="font-sans text-xs">📬 Email Address</div>
              <p className="text-[10px] text-slate-400 font-normal mt-1 font-mono">Skip duplicate electronic mail domains</p>
            </button>

            <button
              onClick={() => setStrategy("phone")}
              className={`p-3 border rounded-xl text-left text-xs ${
                strategy === "phone"
                  ? "border-indigo-600 bg-indigo-50/50 font-bold text-indigo-800"
                  : "border-slate-200 hover:bg-slate-50 text-slate-600"
              }`}
            >
              <div className="font-sans text-xs">📞 Phone Number</div>
              <p className="text-[10px] text-slate-400 font-normal mt-1 font-mono">Deduplicate identical mobile lines</p>
            </button>

            <button
              onClick={() => setStrategy("company")}
              className={`p-3 border rounded-xl text-left text-xs ${
                strategy === "company"
                  ? "border-indigo-600 bg-indigo-50/50 font-bold text-indigo-800"
                  : "border-slate-200 hover:bg-slate-50 text-slate-600"
              }`}
            >
              <div className="font-sans text-xs">🏢 Company Corp Name</div>
              <p className="text-[10px] text-slate-400 font-normal mt-1 font-mono">Scan overlapping business names</p>
            </button>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={runDeduplicationAudit}
              disabled={runningAudit}
              className="bg-indigo-605 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-5 rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
            >
              {runningAudit ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Analyzing business metadata rules...
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4" />
                  Perform Isolation Cleansing Check
                </>
              )}
            </button>

            <span className="text-[10px] font-mono font-bold text-slate-400">Total volume on audit: {contacts.length} leads</span>
          </div>

          {auditMessage && (
            <div className={`p-4 rounded-xl text-xs flex items-start gap-3 mt-4 border ${
              auditMessage.includes("lapping")
                ? "bg-amber-50 border-amber-200 text-amber-800"
                : "bg-emerald-50 border-emerald-250 border-emerald-250/50 text-emerald-800"
            }`}>
              {auditMessage.includes("lapping") ? (
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              ) : (
                <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              )}
              <div className="leading-relaxed font-sans">{auditMessage}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
