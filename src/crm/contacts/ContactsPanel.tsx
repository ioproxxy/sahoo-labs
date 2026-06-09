import React from "react";
import { Contact, Tenant } from "../../types";
import { Plus, Grid, Search, Linkedin, RefreshCw } from "lucide-react";

interface ContactsPanelProps {
  contacts: Contact[];
  selectedTenant: Tenant;
  inspectedContact: Contact | null;
  setInspectedContact: (c: Contact | null) => void;
  onUpdateContactStatus: (id: string, status: Contact["status"]) => void;
  onOpenNewContact: () => void;
  onSimulateChatChat: (contact: Contact) => void;
  onOpenBookSlot: (contactId: string) => void;
}

export default function ContactsPanel({
  contacts,
  selectedTenant,
  inspectedContact,
  setInspectedContact,
  onUpdateContactStatus,
  onOpenNewContact,
  onSimulateChatChat,
  onOpenBookSlot,
}: ContactsPanelProps) {
  const [search, setSearch] = React.useState("");

  const filtered = contacts.filter((c) => {
    const term = search.toLowerCase();
    return c.name.toLowerCase().includes(term) || c.company.toLowerCase().includes(term) || c.phone.includes(term);
  });

  return (
    <div className="grid grid-cols-12 gap-6" id="crm-contacts-container">
      {/* Table list */}
      <div className="col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="font-bold text-slate-800 text-base">Client Isolation CRM Hub ({contacts.length})</h2>
            <p className="text-xs text-slate-400 mt-0.5">Isolated leads assigned under the active sandbox client</p>
          </div>
          
          <button
            onClick={onOpenNewContact}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Manual Lead Creation
          </button>
        </div>

        {/* Global Search Bar */}
        <div className="my-4 relative text-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search leads by company, representative name or telephone line codes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 pl-9 pr-4 py-2 rounded-xl text-xs outline-none focus:border-indigo-600 focus:bg-white font-medium"
          />
        </div>

        {/* Channels mini statistics summary */}
        <div className="grid grid-cols-5 gap-2 pb-4 text-center text-[10px] font-bold tracking-wider font-mono uppercase text-slate-500">
          <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
            📂 Lead ({contacts.filter(c => c.status === "Lead").length})
          </div>
          <div className="bg-indigo-50/50 p-2 rounded-lg border border-indigo-100/30 text-indigo-700">
            📞 Contact ({contacts.filter(c => c.status === "Contact").length})
          </div>
          <div className="bg-blue-50/50 p-2 rounded-lg border border-blue-100/30 text-blue-700">
            💬 Conversation ({contacts.filter(c => c.status === "Conversation").length})
          </div>
          <div className="bg-purple-50/50 p-2 rounded-lg border border-purple-100/30 text-purple-700">
            📅 Schedule ({contacts.filter(c => c.status === "Appointment").length})
          </div>
          <div className="bg-emerald-50/50 p-2 rounded-lg border border-emerald-100/30 text-emerald-700">
            💰 Sale ({contacts.filter(c => c.status === "Sale").length})
          </div>
        </div>

        {/* Compact CRM Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-750">
            <thead className="bg-slate-50 text-slate-500 font-mono text-[10px] uppercase border-b border-slate-100">
              <tr>
                <th className="p-3">Client Contact</th>
                <th className="p-3">Source Channel</th>
                <th className="p-3">System Fit Score</th>
                <th className="p-3">Current Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-slate-400">
                    No matching contacts on file. Trigger crawler or insert manually.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr
                    key={c.id}
                    className={`hover:bg-slate-50/40 transition-colors cursor-pointer ${
                      inspectedContact?.id === c.id ? "bg-slate-50 font-medium" : ""
                    }`}
                    onClick={() => setInspectedContact(c)}
                  >
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{c.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono uppercase truncate max-w-[130px]">{c.company}</div>
                    </td>
                    <td className="p-2.5 p-3">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-mono tracking-widest font-semibold uppercase">
                        {c.source}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-12 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full ${
                              c.score >= 80 ? "bg-emerald-500" : c.score >= 60 ? "bg-yellow-500" : "bg-red-400"
                            }`}
                            style={{ width: `${c.score}%` }}
                          ></div>
                        </div>
                        <span className="font-mono text-[10px] font-black text-slate-600">{c.score}%</span>
                      </div>
                    </td>
                    <td className="p-3" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={c.status}
                        onChange={(e) => onUpdateContactStatus(c.id, e.target.value as any)}
                        className="bg-white border border-slate-200 text-slate-800 text-[10px] py-1 px-1.5 rounded font-bold font-mono outline-none"
                      >
                        <option value="Lead">📂 Lead</option>
                        <option value="Contact">📞 Contact</option>
                        <option value="Conversation">💬 Conversation</option>
                        <option value="Appointment">📅 Appointment</option>
                        <option value="Sale">💰 Sale</option>
                      </select>
                    </td>
                    <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end gap-2 font-mono text-[9px]">
                        <button
                          onClick={() => onSimulateChatChat(c)}
                          className="text-indigo-600 hover:text-indigo-800 font-bold uppercase underline"
                        >
                          Chat Bot
                        </button>
                        <span className="text-slate-200">|</span>
                        <button
                          onClick={() => onOpenBookSlot(c.id)}
                          className="text-emerald-600 hover:text-emerald-800 font-bold uppercase underline"
                        >
                          Book Slot
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Information Inspector Panel */}
      <div className="col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col justify-start">
        {inspectedContact ? (
          <div className="space-y-4" id="contacts-inspector-pane">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[9.5px] font-black uppercase font-mono bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">
                  Isolated Lead Intel
                </span>
                <h3 className="font-bold text-slate-900 text-base mt-2">{inspectedContact.name}</h3>
                <p className="text-xs text-slate-400 italic font-serif truncate max-w-[190px]">{inspectedContact.email}</p>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{inspectedContact.phone}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-mono block">CANDIDATE</span>
                <span className="font-mono text-xs font-bold text-slate-700">{inspectedContact.id}</span>
              </div>
            </div>

            {/* score badge */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/60 font-mono text-xs text-slate-700 space-y-1">
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase mb-1">
                <span>AI Fit Rating:</span>
                <span className="text-slate-800">{inspectedContact.score}%</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full" style={{ width: `${inspectedContact.score}%` }}></div>
              </div>
            </div>

            {/* Enriched Info */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest font-mono">Enrichment Parameters</h4>
              
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400">Headcount</span>
                  <span className="font-bold text-slate-800 font-mono">{inspectedContact.enrichedData?.employeeCount || "5 - 20"}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400">LinkedIn Corp</span>
                  <span className="text-slate-800 truncate max-w-[150px] font-mono flex items-center gap-1">
                    <Linkedin className="w-3 h-3 text-indigo-500" /> Linked Profile
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block mb-1">Tech Stack tags:</span>
                  <div className="flex flex-wrap gap-1">
                    {inspectedContact.enrichedData?.techStack?.map((t) => (
                      <span key={t} className="bg-slate-100 text-slate-750 text-[9.5px] px-1.5 py-0.5 rounded border border-slate-200/55 font-mono">
                        {t}
                      </span>
                    )) || <span className="text-slate-400 italic text-[10px]">No stack index cached</span>}
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block mb-1">Crawl Descriptions:</span>
                  <p className="bg-indigo-50/20 p-2.5 rounded-lg border border-indigo-50 text-[10.5px] text-slate-600 leading-normal">
                    {inspectedContact.enrichedData?.description || "MANUAL REGISTRATION. No system crawler logs currently assigned."}
                  </p>
                </div>

                <div>
                  <span className="text-slate-400 block mb-1">AI Dialog Summary Notes:</span>
                  <p className="bg-amber-50/35 p-2.5 rounded-lg border border-amber-500/10 text-[11px] text-slate-700 font-medium">
                    {inspectedContact.summary || "No receptionist history catalogued. Direct the lead to simulator chat window."}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => onSimulateChatChat(inspectedContact)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2 rounded-xl text-xs font-bold shadow-sm transition-colors cursor-pointer"
            >
              Examine Dialog Sandbox
            </button>
          </div>
        ) : (
          <div className="text-center p-8 text-slate-400 flex flex-col items-center justify-center h-full space-y-2">
            <Grid className="w-8 h-8 text-slate-300 stroke-1" />
            <p className="text-xs">Click any representative contact to review active enrichment telemetry</p>
          </div>
        )}
      </div>
    </div>
  );
}
