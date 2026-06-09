import React from "react";
import { WorkflowRule, Tenant } from "../../types";
import { Plus, ToggleLeft, ToggleRight, Sparkles } from "lucide-react";

interface AutomationsPanelProps {
  workflows: WorkflowRule[];
  selectedTenant: Tenant;
  onToggleWorkflow: (id: string, currentVal: boolean) => void;
  onOpenNewWorkflow: () => void;
}

export default function AutomationsPanel({
  workflows,
  selectedTenant,
  onToggleWorkflow,
  onOpenNewWorkflow,
}: AutomationsPanelProps) {
  return (
    <div className="grid grid-cols-12 gap-6" id="crm-automations-container">
      {/* List of workflow hooks */}
      <div className="col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <div>
            <h2 className="font-bold text-slate-800 text-base">Automation Workflows (BullMQ Hook Hub)</h2>
            <p className="text-xs text-slate-400 mt-0.5">Automate data enrichment and customer reminders dynamically</p>
          </div>
          
          <button
            onClick={onOpenNewWorkflow}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Configure Custom Hook Rule
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {workflows.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs italic border border-dashed rounded-xl">
              No automation pipelines configured. Hook rules to auto-respond to leads.
            </div>
          ) : (
            workflows.map((flow) => (
              <div key={flow.id} className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between font-mono text-xs text-slate-700">
                <div className="space-y-1">
                  <strong className="text-slate-900 font-sans text-xs block">{flow.name}</strong>
                  <div className="text-[10px] text-slate-500 leading-relaxed space-y-0.5">
                    <div>⚡ Trigger: <code className="bg-slate-200 px-1 rounded">{flow.trigger.replace("_", " ")}</code></div>
                    <div>🎯 Action: <code className="bg-indigo-50 text-indigo-700 px-1 rounded">{flow.actionType.replace("_", " ")}</code></div>
                    {flow.actionConfig?.template && (
                      <div className="text-[9px] text-slate-400 truncate max-w-[340px]">Template: {flow.actionConfig.template}</div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <span className={`text-[9.5px] font-bold ${flow.active ? "text-indigo-600 animate-pulse" : "text-slate-400"}`}>
                    {flow.active ? "● ACTIVE WORKER" : "○ SUSPENDED"}
                  </span>
                  <button
                    onClick={() => onToggleWorkflow(flow.id, flow.active)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition-colors ${
                      flow.active
                        ? "bg-red-50 text-red-600 hover:bg-red-150 border border-red-200/50"
                        : "bg-indigo-50 text-indigo-700 hover:bg-indigo-150 border border-indigo-200/50"
                    }`}
                  >
                    {flow.active ? "Toggle Off" : "Toggle On"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Info Panel Guide */}
      <div className="col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col justify-start">
        <h3 className="font-bold text-slate-800 text-sm mb-3">CRM AI Triggers</h3>
        <div className="space-y-3 leading-relaxed text-xs text-slate-500 font-sans">
          <p>
            Automations use <strong className="text-slate-800">background execution jobs</strong> to respond to pipeline movements:
          </p>
          <ul className="list-disc pl-4 space-y-2">
            <li>
              <strong className="text-slate-700 font-mono">On Lead Created:</strong> Dispatches background Google Maps web crawlers + LinkedIn scrapers.
            </li>
            <li>
              <strong className="text-slate-700 font-mono">On Slot Scheduled:</strong> Sends real-time SMS reminder updates exactly 60 minutes beforehand.
            </li>
            <li>
              <strong className="text-slate-700 font-mono">On Outbound No-Show:</strong> Starts template-based rescheduling flows immediately on selected chat channels.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
