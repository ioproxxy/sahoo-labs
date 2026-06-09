import { Tenant } from "../types";
import { 
  LayoutDashboard, 
  Target, 
  Users, 
  Bot, 
  Calendar, 
  Send, 
  Cpu, 
  Globe, 
  CheckCircle,
  Clock,
  Shuffle
} from "lucide-react";

interface SidebarProps {
  tenants: Tenant[];
  selectedTenant: Tenant;
  onSelectTenant: (tenant: Tenant) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({
  tenants,
  selectedTenant,
  onSelectTenant,
  activeTab,
  setActiveTab
}: SidebarProps) {
  
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "crm", label: "CRM & Pipelines", icon: Users },
    { id: "lead-engine", label: "Lead Engine", icon: Target },
    { id: "bots", label: "AI Receptionist Bots", icon: Bot },
    { id: "campaigns", label: "Campaigns", icon: Send },
    { id: "experiments", label: "Experiments Lab", icon: Shuffle },
  ];

  return (
    <aside className="w-64 bg-white text-slate-700 flex flex-col border-r border-slate-200" id="crm-sidebar">
      {/* Platform Branding */}
      <div className="p-6 border-b border-slate-100" id="sidebar-branding">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold" id="branding-logo">
            <div className="w-4 h-4 border-2 border-white rounded-full"></div>
          </div>
          <span className="font-bold tracking-tight text-xl text-slate-900">Sahoo Lab</span>
        </div>
        <div className="mt-2 text-[10px] uppercase tracking-widest text-slate-400 font-semibold">CRM AI Receptionist</div>
      </div>

      {/* Multi-Tenant Switcher */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/50" id="sidebar-tenant-switcher">
        <label className="block text-[11px] uppercase tracking-wider text-slate-400 font-mono mb-2 font-semibold">
          CLIENT TENANT ISOLATION
        </label>
        <div className="relative">
          <select
            id="tenant-id-select"
            value={selectedTenant.id}
            onChange={(e) => {
              const selected = tenants.find((t) => t.id === e.target.value);
              if (selected) onSelectTenant(selected);
            }}
            className="w-full bg-white border border-slate-200 text-slate-800 text-sm rounded-lg px-3 py-2 outline-none focus:border-indigo-600 cursor-pointer appearance-none pr-8"
          >
            {tenants.map((t) => (
              <option key={t.id} value={t.id}>
                🏢 {t.name}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
            ▼
          </div>
        </div>

        {/* Tenant Details Card */}
        <div className="mt-3 p-2.5 bg-white rounded-xl border border-slate-200/80 text-[11px] space-y-1.5 text-slate-600 font-mono shadow-sm" id="sidebar-tenant-card">
          <div className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-indigo-500" />
            <span className="truncate">{selectedTenant.domain}</span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <Clock className="w-3.5 h-3.5 text-indigo-505 text-indigo-500" />
            <span>TZ: {selectedTenant.timezone}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-indigo-500" />
            <span>Hrs: {selectedTenant.businessHours.start} - {selectedTenant.businessHours.end}</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Menu */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto" id="sidebar-nav">
        <span className="block px-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-2">
          OPERATIONAL CHANNELS
        </span>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-btn-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all text-left ${
                isActive
                  ? "bg-indigo-50 text-indigo-700 font-semibold shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Platform Health Log */}
      <div className="p-4 border-t border-slate-100 text-[11px] text-slate-500 bg-slate-50/50" id="sidebar-foot">
        <div className="flex items-center gap-2 mb-1">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-mono text-slate-700 font-semibold uppercase tracking-wider">GATEWAY LIVE</span>
        </div>
        <p className="text-slate-400">BullMQ & Redis streams active</p>
      </div>
    </aside>
  );
}
