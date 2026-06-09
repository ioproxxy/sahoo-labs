import React from "react";
import { Contact, Tenant } from "../types";
import {
  TrendingUp,
  Inbox,
  CheckCircle,
  Clock,
  Briefcase,
  Layers,
  BarChart,
  UserCheck,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart as ReBarChart,
  Bar,
  Legend,
} from "recharts";

interface AnalyticsPanelProps {
  contacts: Contact[];
  selectedTenant: Tenant;
}

export default function AnalyticsPanel({ contacts, selectedTenant }: AnalyticsPanelProps) {
  // Aggregate mock metrics
  const totalVolume = contacts.length;
  const leadCount = contacts.filter((c) => c.status === "Lead").length;
  const contactCount = contacts.filter((c) => c.status === "Contact").length;
  const convCount = contacts.filter((c) => c.status === "Conversation").length;
  const aptCount = contacts.filter((c) => c.status === "Appointment").length;
  const saleCount = contacts.filter((c) => c.status === "Sale").length;

  const averageScore =
    contacts.length > 0
      ? Math.round(contacts.reduce((acc, c) => acc + c.score, 0) / contacts.length)
      : 80;

  // Chart structured data
  const pipelineChartData = [
    { name: "Scraped Leads", value: leadCount, fill: "#94a3b8" },
    { name: "Verified Contacts", value: contactCount, fill: "#6366f1" },
    { name: "Active Chats", value: convCount, fill: "#3b82f6" },
    { name: "Bookings", value: aptCount, fill: "#a855f7" },
    { name: "Sales", value: saleCount, fill: "#10b981" },
  ];

  const acquisitionTrendData = [
    { date: "June 03", value: Math.max(0, totalVolume - 4) },
    { date: "June 04", value: Math.max(0, totalVolume - 3) },
    { date: "June 05", value: Math.max(0, totalVolume - 2) },
    { date: "June 06", value: Math.max(0, totalVolume - 2) },
    { date: "June 07", value: totalVolume },
    { date: "June 08", value: totalVolume },
    { date: "June 09", value: totalVolume },
  ];

  return (
    <div className="space-y-6" id="analytics-reporting-hub">
      {/* KPI Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-5 border border-slate-200 shadow-xs rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">
              Total Managed Leads
            </span>
            <div className="text-2xl font-bold text-slate-900 tracking-tight font-sans">
              {totalVolume}
            </div>
          </div>
          <Inbox className="w-8 h-8 text-indigo-500" />
        </div>

        <div className="bg-white p-5 border border-slate-200 shadow-xs rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">
              Average Fit Score
            </span>
            <div className="text-2xl font-bold text-slate-900 tracking-tight font-sans">
              {averageScore}%
            </div>
          </div>
          <TrendingUp className="w-8 h-8 text-indigo-500" />
        </div>

        <div className="bg-white p-5 border border-slate-200 shadow-xs rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">
              Timezone Bookings
            </span>
            <div className="text-2xl font-bold text-slate-900 tracking-tight font-sans">
              {aptCount}
            </div>
          </div>
          <Clock className="w-8 h-8 text-indigo-500" />
        </div>

        <div className="bg-white p-5 border border-slate-200 shadow-xs rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">
              Sales Conversion Rate
            </span>
            <div className="text-2xl font-bold text-slate-900 tracking-tight font-sans">
              {totalVolume > 0 ? ((saleCount / totalVolume) * 100).toFixed(0) : 0}%
            </div>
          </div>
          <CheckCircle className="w-8 h-8 text-emerald-500" />
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* acquisition area chart */}
        <div className="col-span-7 bg-white p-6 border border-slate-200 rounded-2xl shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Lead Generation Timeline Tracker</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Evolution of lead lists acquisition logged in background</p>
          </div>

          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={acquisitionTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e2e8f0" }} />
                <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* pipeline bar charts */}
        <div className="col-span-5 bg-white p-6 border border-slate-200 rounded-2xl shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Active CRM Funnel Pipelines</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Leads counts partitioned by pipeline parameter states</p>
          </div>

          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <ReBarChart data={pipelineChartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e2e8f0" }} />
                <Bar dataKey="value" strokeWidth={0} radius={[6, 6, 0, 0]} />
              </ReBarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
