import React from "react";
import { Campaign } from "../../types";
import { Plus, Mail, Percent, Send } from "lucide-react";

interface EmailCampaignsProps {
  campaigns: Campaign[];
  onOpenNewCampaign: () => void;
}

export default function EmailCampaigns({ campaigns, onOpenNewCampaign }: EmailCampaignsProps) {
  const emailCampaigns = campaigns.filter((c) => c.channel === "email");

  return (
    <div className="grid grid-cols-12 gap-6" id="email-campaigns-container">
      {/* Campaign List */}
      <div className="col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="font-bold text-slate-800 text-base">Outbound E-mail Campaigns</h2>
            <p className="text-xs text-slate-400 mt-0.5">Blast beautiful newsletters and follow-ups to your lead lists</p>
          </div>

          <button
            onClick={onOpenNewCampaign}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Initialize E-mail Blast
          </button>
        </div>

        {/* Campaign cards loop */}
        <div className="mt-6 space-y-4">
          {emailCampaigns.length === 0 ? (
            <div className="p-8 border border-dashed border-slate-200 text-center text-slate-400 text-xs italic rounded-xl">
              No active email campaigns listed. Click Initialize to trigger SMTP template automation.
            </div>
          ) : (
            emailCampaigns.map((camp) => (
              <div key={camp.id} className="p-4 bg-slate-50 border border-slate-200/60 rounded-xl font-mono text-xs text-slate-700 space-y-3">
                <div className="flex justify-between items-start font-sans">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-indigo-500" />
                    <span className="font-bold text-slate-900 text-xs">{camp.name}</span>
                  </div>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                    camp.status === "completed" ? "bg-emerald-100 text-emerald-800" : "bg-amber-105 bg-amber-100 text-amber-800 animate-pulse"
                  }`}>
                    {camp.status.toUpperCase()}
                  </span>
                </div>

                <div className="text-[11px] text-slate-800 font-bold font-sans">
                  Subject: {camp.subject || "No Subject"}
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-slate-100 text-[10px] leading-relaxed text-slate-500 whitespace-pre-wrap">
                  {camp.template}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-[10px] text-slate-500 pt-2 border-t border-slate-200/50">
                  <div className="font-sans">
                    👥 Recipients: <strong className="text-slate-800">{camp.sentCount}</strong>
                  </div>
                  <div className="font-sans">
                    🖱️ Open (CTR): <strong className="text-indigo-600">{camp.clickCount} ({camp.sentCount > 0 ? ((camp.clickCount / camp.sentCount) * 100).toFixed(0) : 0}%)</strong>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Integration details */}
      <div className="col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col justify-start">
        <h3 className="font-bold text-slate-800 text-sm mb-3">SMTP Infrastructure Status</h3>
        <div className="space-y-4 text-xs font-mono">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="font-bold text-slate-950 font-sans">Amazon SES Pool</div>
            <p className="text-[9.5px] text-slate-400 mt-1">Pending live workspace keys creation</p>
            <div className="text-[10px] text-slate-400 font-semibold mt-1">○ INACTIVE</div>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="font-bold text-slate-955 font-sans">Sahootech Default Delivery</div>
            <p className="text-[9.5px] text-indigo-400 mt-1">Provides shared simulated IP proxies</p>
            <div className="text-[10px] text-emerald-600 font-bold mt-1">● READY (SMTP Active)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
