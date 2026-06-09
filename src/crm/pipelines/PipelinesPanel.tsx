import React from "react";
import { Contact, LeadStatus } from "../../types";
import { User, Sparkles, MoveRight, ArrowRight, ArrowLeft } from "lucide-react";

interface PipelinesPanelProps {
  contacts: Contact[];
  onUpdateContactStatus: (id: string, status: Contact["status"]) => void;
  onSelectContact: (c: Contact) => void;
  setActiveTab: (tab: string) => void;
}

export default function PipelinesPanel({
  contacts,
  onUpdateContactStatus,
  onSelectContact,
  setActiveTab,
}: PipelinesPanelProps) {
  const lanes: { status: LeadStatus; label: string; color: string; desc: string }[] = [
    { status: "Lead", label: "Raw Crawled Leads", color: "border-t-slate-400 bg-slate-50/40", desc: "Maps indexes pending verification" },
    { status: "Contact", label: "Validated Contacts", color: "border-t-indigo-400 bg-indigo-50/10", desc: "Verified corporate contacts" },
    { status: "Conversation", label: "Active Dialogues", color: "border-t-blue-400 bg-blue-50/10", desc: "Simulated dialog bots active" },
    { status: "Appointment", label: "Bookings", color: "border-t-purple-400 bg-purple-50/10", desc: "Confirmed timezone slots synced" },
    { status: "Sale", label: "Converted Sales", color: "border-t-emerald-500 bg-emerald-50/10", desc: "Sales converted" },
  ];

  const moveLead = (id: string, current: LeadStatus, direction: "next" | "prev") => {
    const statuses: LeadStatus[] = ["Lead", "Contact", "Conversation", "Appointment", "Sale"];
    const idx = statuses.indexOf(current);
    if (direction === "next" && idx < statuses.length - 1) {
      onUpdateContactStatus(id, statuses[idx + 1]);
    } else if (direction === "prev" && idx > 0) {
      onUpdateContactStatus(id, statuses[idx - 1]);
    }
  };

  return (
    <div className="space-y-6" id="crm-kanban-pipelines">
      {/* Top statistics overview bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="font-bold text-slate-800 text-base">Interactive Pipelines Kanban Board</h2>
          <p className="text-xs text-slate-405 text-slate-400 mt-0.5">Cycle contact state parameters using step-wise actions</p>
        </div>

        {/* Board Canvas */}
        <div className="grid grid-cols-5 gap-3 mt-6">
          {lanes.map((lane) => {
            const laneContacts = contacts.filter((c) => c.status === lane.status);
            return (
              <div
                key={lane.status}
                className={`p-3 rounded-2xl border border-slate-200/70 border-t-4 flex flex-col min-h-[440px] ${lane.color}`}
              >
                {/* Header */}
                <div className="pb-2 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-xs font-sans tracking-tight">{lane.label}</span>
                    <span className="text-[10px] font-mono bg-slate-200/80 px-2 py-0.5 rounded font-bold text-slate-600">
                      {laneContacts.length}
                    </span>
                  </div>
                  <p className="text-[9.5px] text-slate-400 mt-0.5 leading-tight font-serif italic truncate">{lane.desc}</p>
                </div>

                {/* Cards List */}
                <div className="flex-1 overflow-y-auto space-y-2.5 mt-3 pr-0.5 max-h-[380px]">
                  {laneContacts.length === 0 ? (
                    <div className="h-full flex items-center justify-center py-12 text-center text-slate-400 text-[10px] italic border border-dashed rounded-xl border-slate-200">
                      Empty column
                    </div>
                  ) : (
                    laneContacts.map((contact) => (
                      <div
                        key={contact.id}
                        className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col space-y-2 group"
                      >
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-slate-900 text-[11px] truncate leading-tight max-w-[95px]">
                            {contact.name}
                          </h4>
                          <span className="text-[8.5px] bg-slate-150 text-slate-500 font-mono scale-90 origin-right">
                            {contact.score}%
                          </span>
                        </div>
                        <p className="text-[9px] text-slate-400 font-mono truncate uppercase">{contact.company}</p>

                        {/* Interactive flow controls */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                          <div className="flex gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                moveLead(contact.id, lane.status, "prev");
                              }}
                              disabled={lane.status === "Lead"}
                              className="p-1 rounded bg-slate-105 bg-slate-100 hover:bg-slate-200 text-slate-600 disabled:opacity-30 cursor-pointer text-[10px]"
                              title="Shift status back"
                            >
                              ◀
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                moveLead(contact.id, lane.status, "next");
                              }}
                              disabled={lane.status === "Sale"}
                              className="p-1 rounded bg-slate-105 bg-slate-100 hover:bg-slate-200 text-slate-655 text-indigo-600 disabled:opacity-30 cursor-pointer text-[10px]"
                              title="Advance status next"
                            >
                              ▶
                            </button>
                          </div>

                          <button
                            onClick={() => {
                              onSelectContact(contact);
                              setActiveTab("crm");
                            }}
                            className="text-[9.5px] text-indigo-600 font-bold hover:underline font-mono"
                          >
                            Examine
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
