import React, { useState, useEffect } from "react";
import { Tenant, Contact, Appointment, Bot, Campaign, WorkflowRule, ScraperJob, Message } from "./types";
import Sidebar from "./components/Sidebar";
import {
  Users,
  Target,
  Bot as BotIcon,
  Send,
  Plus,
  RefreshCw,
  TrendingUp,
  X,
  PlusCircle,
  AlertCircle
} from "lucide-react";

// Import modular components aligned withlabs.sahootechnologies.com directory structure
import ScraperPanel from "./lead-engine/scrapers/ScraperPanel";
import EnricherPanel from "./lead-engine/enrichers/EnricherPanel";
import DeduplicationPanel from "./lead-engine/deduplication/DeduplicationPanel";

import ContactsPanel from "./crm/contacts/ContactsPanel";
import PipelinesPanel from "./crm/pipelines/PipelinesPanel";
import AutomationsPanel from "./crm/automations/AutomationsPanel";

import WhatsappBot from "./bots/whatsapp/WhatsappBot";
import TelegramBot from "./bots/telegram/TelegramBot";
import WebchatBot from "./bots/webchat/WebchatBot";

import EmailCampaigns from "./campaigns/email/EmailCampaigns";
import SmsCampaigns from "./campaigns/sms/SmsCampaigns";
import WhatsappCampaigns from "./campaigns/whatsapp/WhatsappCampaigns";

import AnalyticsPanel from "./analytics/AnalyticsPanel";
import ExperimentsPanel from "./experiments/ExperimentsPanel";

export default function App() {
  // Database States
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [bots, setBots] = useState<Bot[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [workflows, setWorkflows] = useState<WorkflowRule[]>([]);
  const [scrapers, setScrapers] = useState<ScraperJob[]>([]);

  // UX Operational states
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [loading, setLoading] = useState<boolean>(true);
  const [apiError, setApiError] = useState<string | null>(null);

  // Sub-navigation state hooks for modular directories
  const [leadEngineSubtab, setLeadEngineSubtab] = useState<"scraper" | "enricher" | "dedup">("scraper");
  const [crmSubtab, setCrmSubtab] = useState<"contacts" | "pipelines" | "automations">("contacts");
  const [botSubtab, setBotSubtab] = useState<"whatsapp" | "telegram" | "webchat">("webchat");
  const [campaignSubtab, setCampaignSubtab] = useState<"email" | "sms" | "whatsapp">("email");

  // Bot Chat Simulation States
  const [chatSelectedContact, setChatSelectedContact] = useState<Contact | null>(null);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [chatInputText, setChatInputText] = useState<string>("");
  const [chatLoading, setChatLoading] = useState<boolean>(false);

  // Form Overlay Modals / Form inputs
  const [newContactForm, setNewContactForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    status: "Lead" as const,
    source: "manual" as const,
    score: 65,
    summary: ""
  });
  const [isNewContactOpen, setIsNewContactOpen] = useState(false);

  const [newAptForm, setNewAptForm] = useState({
    contactId: "",
    title: "",
    startTime: "",
    timezone: "",
    source: "crm" as const,
    notes: ""
  });
  const [isNewAptOpen, setIsNewAptOpen] = useState(false);

  const [newWorkflowForm, setNewWorkflowForm] = useState({
    name: "",
    trigger: "lead_created" as const,
    actionType: "enrich_lead" as const,
    template: ""
  });
  const [isNewWorkflowOpen, setIsNewWorkflowOpen] = useState(false);

  const [newCampaignForm, setNewCampaignForm] = useState({
    name: "",
    channel: "email" as const,
    subject: "",
    template: ""
  });
  const [isNewCampaignOpen, setIsNewCampaignOpen] = useState(false);

  const [scraperKeyword, setScraperKeyword] = useState("Cape Town Dental Clinics");
  const [scraperUrl, setScraperUrl] = useState("google.co.za/maps/search/dental-clinics");
  const [scraperLoading, setScraperLoading] = useState(false);

  // CRM Active Contact Inspector Card
  const [inspectedContact, setInspectedContact] = useState<Contact | null>(null);

  // Initial Load Tenants list
  useEffect(() => {
    fetch("/api/tenants")
      .then((res) => {
        if (!res.ok) throw new Error("Could not fetch Tenants portal database.");
        return res.json();
      })
      .then((data) => {
        setTenants(data);
        if (data && data.length > 0) {
          setSelectedTenant(data[0]);
        }
      })
      .catch((err) => setApiError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Reload Tenant-specific database entries
  const refreshTenantData = () => {
    if (!selectedTenant) return;
    
    // Fetch Contact representatives
    fetch(`/api/contacts?tenantId=${selectedTenant.id}`)
      .then((res) => res.json())
      .then((data) => {
        setContacts(data);
        if (data.length > 0) {
          if (!inspectedContact) setInspectedContact(data[0]);
          if (!chatSelectedContact) setChatSelectedContact(data[0]);
        }
      });

    // Fetch Appointments
    fetch(`/api/appointments?tenantId=${selectedTenant.id}`)
      .then((res) => res.json())
      .then((data) => setAppointments(data));

    // Fetch Bots prompt configurations
    fetch(`/api/bots?tenantId=${selectedTenant.id}`)
      .then((res) => res.json())
      .then((data) => setBots(data));

    // Fetch Campaigns
    fetch(`/api/campaigns?tenantId=${selectedTenant.id}`)
      .then((res) => res.json())
      .then((data) => setCampaigns(data));

    // Fetch Workflows
    fetch(`/api/workflows?tenantId=${selectedTenant.id}`)
      .then((res) => res.json())
      .then((data) => setWorkflows(data));

    // Fetch Scrapers
    fetch(`/api/scrapers?tenantId=${selectedTenant.id}`)
      .then((res) => res.json())
      .then((data) => setScrapers(data));
  };

  useEffect(() => {
    refreshTenantData();
  }, [selectedTenant]);

  // Load chat simulation history
  useEffect(() => {
    if (chatSelectedContact) {
      setChatLoading(true);
      fetch(`/api/chat/history?contactId=${chatSelectedContact.id}`)
        .then((res) => res.json())
        .then((history) => {
          setChatMessages(history);
        })
        .finally(() => setChatLoading(false));
    }
  }, [chatSelectedContact]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans flex items-center justify-center p-8">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm max-w-sm text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-lg font-bold text-slate-800">Booting CRM Isolation Core</h2>
          <p className="text-slate-400 text-xs mt-2 font-mono">Connecting Sahootech queue databases...</p>
        </div>
      </div>
    );
  }

  if (!selectedTenant) {
    return (
      <div className="min-h-screen bg-slate-100 font-sans flex items-center justify-center p-8">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-red-700">Database Connection Interrupted</h2>
          <p className="text-slate-500 text-sm mt-1">{apiError || "Configure a client tenant sandbox environment."}</p>
        </div>
      </div>
    );
  }

  // Database updates dispatches
  const handleCreateContact = (e: React.FormEvent) => {
    e.preventDefault();
    fetch("/api/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...newContactForm,
        tenantId: selectedTenant.id
      })
    })
      .then((res) => res.json())
      .then((newC) => {
        setContacts((prev) => [newC, ...prev]);
        setInspectedContact(newC);
        setIsNewContactOpen(false);
        // Reset Inputs
        setNewContactForm({
          name: "",
          company: "",
          email: "",
          phone: "",
          status: "Lead",
          source: "manual",
          score: 65,
          summary: ""
        });
      });
  };

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAptForm.contactId || !newAptForm.startTime) return;

    fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...newAptForm,
        tenantId: selectedTenant.id,
        timezone: selectedTenant.timezone
      })
    })
      .then((res) => res.json())
      .then((newApt) => {
        setAppointments((prev) => [newApt, ...prev]);
        setContacts((prev) =>
          prev.map((c) => (c.id === newAptForm.contactId ? { ...c, status: "Appointment", score: Math.max(c.score, 90) } : c))
        );
        setIsNewAptOpen(false);
        setNewAptForm({
          contactId: "",
          title: "",
          startTime: "",
          timezone: "",
          source: "crm",
          notes: ""
        });
      });
  };

  const handleUpdateBotPrompt = (botId: string, updatedPrompt: string) => {
    fetch(`/api/bots/${botId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ systemPrompt: updatedPrompt })
    })
      .then((res) => res.json())
      .then((updated) => {
        setBots((prev) => prev.map((b) => (b.id === botId ? updated : b)));
      });
  };

  const handleCreateWorkflow = (e: React.FormEvent) => {
    e.preventDefault();
    fetch("/api/workflows", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tenantId: selectedTenant.id,
        name: newWorkflowForm.name,
        trigger: newWorkflowForm.trigger,
        actionType: newWorkflowForm.actionType,
        actionConfig: { template: newWorkflowForm.template },
        active: true
      })
    })
      .then((res) => res.json())
      .then((newW) => {
        setWorkflows((prev) => [...prev, newW]);
        setIsNewWorkflowOpen(false);
        setNewWorkflowForm({
          name: "",
          trigger: "lead_created",
          actionType: "enrich_lead",
          template: ""
        });
      });
  };

  const handleToggleWorkflow = (id: string, currentVal: boolean) => {
    fetch(`/api/workflows/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !currentVal })
    })
      .then((res) => res.json())
      .then((updated) => {
        setWorkflows((prev) => prev.map((w) => (w.id === id ? updated : w)));
      });
  };

  const handleTriggerCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    fetch("/api/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tenantId: selectedTenant.id,
        ...newCampaignForm
      })
    })
      .then((res) => res.json())
      .then((newCamp) => {
        setCampaigns((prev) => [newCamp, ...prev]);
        setIsNewCampaignOpen(false);
        setNewCampaignForm({
          name: "",
          channel: "email",
          subject: "",
          template: ""
        });

        setTimeout(() => {
          refreshTenantData();
        }, 3000);
      });
  };

  const handleRunScraper = (e: React.FormEvent) => {
    e.preventDefault();
    setScraperLoading(true);
    fetch("/api/scrapers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tenantId: selectedTenant.id,
        url: scraperUrl,
        keyword: scraperKeyword
      })
    })
      .then((res) => res.json())
      .then(() => {
        refreshTenantData();
      })
      .finally(() => {
        setScraperLoading(false);
      });
  };

  const handleChatSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatSelectedContact || !chatInputText.trim()) return;

    const userText = chatInputText;
    setChatInputText("");
    
    // Add optimistic local user message
    const tempUserMsg: Message = {
      id: `temp-${Date.now()}`,
      contactId: chatSelectedContact.id,
      sender: "user",
      text: userText,
      createdAt: new Date().toISOString()
    };
    setChatMessages((prev) => [...prev, tempUserMsg]);

    setChatLoading(true);
    fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contactId: chatSelectedContact.id,
        tenantId: selectedTenant.id,
        botType: botSubtab,
        text: userText
      })
    })
      .then((res) => res.json())
      .then(() => {
        refreshTenantData();
        return fetch(`/api/chat/history?contactId=${chatSelectedContact.id}`);
      })
      .then((res) => res.json())
      .then((history) => {
        setChatMessages(history);
      })
      .finally(() => setChatLoading(false));
  };

  const handleUpdateContactStatus = (cid: string, status: Contact["status"]) => {
    fetch(`/api/contacts/${cid}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    })
      .then((res) => res.json())
      .then((updated) => {
        setContacts((prev) => prev.map((c) => (c.id === cid ? updated : c)));
        if (inspectedContact?.id === cid) setInspectedContact(updated);
      });
  };

  // Global aggregate metrics calculation
  const leadsScrapedVal = contacts.filter((c) => c.source === "scraper").length * 8 + scrapers.reduce((s, j) => s + j.itemsFound, 0);
  const enrichedVal = contacts.filter((c) => c.enrichedData && Object.keys(c.enrichedData).length > 0).length;
  const conversationsVal = contacts.filter((c) => c.status === "Conversation" || c.status === "Appointment" || c.status === "Sale").length;
  const appointmentsVal = appointments.length;

  return (
    <div id="app-root-container" className="flex h-screen w-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      
      {/* LEFT SIDEBAR CONTROLS */}
      <Sidebar
        tenants={tenants}
        selectedTenant={selectedTenant}
        onSelectTenant={setSelectedTenant}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* MAIN VIEW STREAM */}
      <main className="flex-1 flex flex-col h-full overflow-hidden" id="workspace-layout">
        
        {/* UPPER CLEAN MINIMAL HEADER */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 shadow-xs" id="workspace-header">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-slate-800 uppercase tracking-tight font-sans">
              {activeTab === "dashboard" && "🔥 Performance Analytics"}
              {activeTab === "crm" && "📋 Isolated CRM Hub"}
              {activeTab === "lead-engine" && "🌐 Directory Lead Scraper"}
              {activeTab === "bots" && "🤖 AI Receptionist Configuration"}
              {activeTab === "campaigns" && "✉️ Outbound Telephony Campaigns"}
              {activeTab === "experiments" && "🔬 Sahoo Experiments Lab"}
            </h1>
            <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-mono font-bold border border-indigo-100/50 uppercase tracking-widest">
              TZ: {selectedTenant.timezone}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full text-[10px] font-bold font-mono border border-emerald-100/50 uppercase">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              {bots.filter((b) => b.status === "online").length} Receptionists Active
            </div>

            <button
              id="header-shortcut-btn"
              onClick={() => {
                if (activeTab === "campaigns") setIsNewCampaignOpen(true);
                else if (activeTab === "crm" && crmSubtab === "automations") setIsNewWorkflowOpen(true);
                else if (activeTab === "crm" && crmSubtab === "pipelines") setIsNewAptOpen(true);
                else setIsNewContactOpen(true);
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              {activeTab === "campaigns" && "New Outbound Blast"}
              {activeTab === "crm" && crmSubtab === "automations" && "Hook Automation Trigger"}
              {activeTab === "crm" && crmSubtab === "pipelines" && "Book Slotted Time"}
              {(activeTab !== "campaigns" && !(activeTab === "crm" && crmSubtab === "automations") && !(activeTab === "crm" && crmSubtab === "pipelines")) && "Register Manual Lead"}
            </button>
          </div>
        </header>

        {/* WORKSPACE AREA VIEWS */}
        <div className="flex-1 overflow-y-auto p-8" id="client-scroll-viewport">
          
          {/* TOP METRICS SUMMARY BAR */}
          <section className="grid grid-cols-5 gap-4 mb-6 shrink-0" id="global-kpi-rack">
            <div className="bg-white p-4 rounded-xl border border-slate-205 border-slate-200 shadow-xs">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Leads Scraped</div>
              <div className="text-xl font-black mt-1 text-slate-800 font-sans">{leadsScrapedVal}</div>
              <span className="text-[9px] text-emerald-600 font-bold block mt-1">● Active Google Maps feeds</span>
            </div>
            
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Enriched Fit</div>
              <div className="text-xl font-black mt-1 text-slate-800 font-sans">{enrichedVal}</div>
              <span className="text-[9px] text-slate-400 block mt-1">Profiles indexed using AI</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Conversations</div>
              <div className="text-xl font-black mt-1 text-slate-800 font-sans">{conversationsVal}</div>
              <span className="text-[9px] text-indigo-700 font-semibold block mt-1">Simulated chat history active</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Booked slots</div>
              <div className="text-xl font-black mt-1 text-slate-800 font-sans">{appointmentsVal}</div>
              <span className="text-[9px] text-slate-400 block mt-1">Timezones auto-tracked</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs border-l-4 border-l-emerald-500">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Active Tenant</div>
              <div className="text-xs font-mono font-black mt-2 text-indigo-700 uppercase truncate">
                {selectedTenant.name}
              </div>
              <span className="text-[9px] text-slate-400 block mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
                {selectedTenant.domain}
              </span>
            </div>
          </section>

          {/* ========================================================== */}
          {/* ==================== 1. ANALYTICS VIEW ==================== */}
          {/* ========================================================== */}
          {activeTab === "dashboard" && (
            <AnalyticsPanel contacts={contacts} selectedTenant={selectedTenant} />
          )}

          {/* ========================================================== */}
          {/* ==================== 2. LEAD ENGINE TAB ==================== */}
          {/* ========================================================== */}
          {activeTab === "lead-engine" && (
            <div className="space-y-6">
              {/* Internal Directory Path Sub-Header Row */}
              <div className="bg-white p-2 rounded-xl border border-slate-200 flex items-center gap-2">
                <button
                  onClick={() => setLeadEngineSubtab("scraper")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                    leadEngineSubtab === "scraper" ? "bg-indigo-600 text-white shadow-xs" : "hover:bg-slate-50 text-slate-600"
                  }`}
                >
                  🌐 Scraper Crawler (/scrapers)
                </button>
                <button
                  onClick={() => setLeadEngineSubtab("enricher")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                    leadEngineSubtab === "enricher" ? "bg-indigo-600 text-white shadow-xs" : "hover:bg-slate-50 text-slate-600"
                  }`}
                >
                  🔍 Metadata Enricher (/enrichers)
                </button>
                <button
                  onClick={() => setLeadEngineSubtab("dedup")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                    leadEngineSubtab === "dedup" ? "bg-indigo-600 text-white shadow-xs" : "hover:bg-slate-50 text-slate-600"
                  }`}
                >
                  🛡️ Cleansing Deduplication (/deduplication)
                </button>
              </div>

              {leadEngineSubtab === "scraper" && (
                <ScraperPanel
                  selectedTenant={selectedTenant}
                  scraperKeyword={scraperKeyword}
                  setScraperKeyword={setScraperKeyword}
                  scraperUrl={scraperUrl}
                  setScraperUrl={setScraperUrl}
                  scraperLoading={scraperLoading}
                  onRunScraper={handleRunScraper}
                  contacts={contacts}
                  scrapers={scrapers}
                />
              )}

              {leadEngineSubtab === "enricher" && (
                <EnricherPanel
                  contacts={contacts}
                  onEnrichLead={() => refreshTenantData()}
                />
              )}

              {leadEngineSubtab === "dedup" && (
                <DeduplicationPanel contacts={contacts} />
              )}
            </div>
          )}

          {/* ========================================================== */}
          {/* ====================== 3. CRM HUB TAB ==================== */}
          {/* ========================================================== */}
          {activeTab === "crm" && (
            <div className="space-y-6">
              {/* Internal Directory Path Sub-Header Row */}
              <div className="bg-white p-2 rounded-xl border border-slate-200 flex items-center gap-2">
                <button
                  onClick={() => setCrmSubtab("contacts")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                    crmSubtab === "contacts" ? "bg-indigo-600 text-white shadow-xs" : "hover:bg-slate-50 text-slate-600"
                  }`}
                >
                  👤 Contacts Directory (/contacts)
                </button>
                <button
                  onClick={() => setCrmSubtab("pipelines")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                    crmSubtab === "pipelines" ? "bg-indigo-600 text-white shadow-xs" : "hover:bg-slate-50 text-slate-600"
                  }`}
                >
                  📊 Pipelines Kanban (/pipelines)
                </button>
                <button
                  onClick={() => setCrmSubtab("automations")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                    crmSubtab === "automations" ? "bg-indigo-600 text-white shadow-xs" : "hover:bg-slate-50 text-slate-600"
                  }`}
                >
                  ⚙️ Workflows & Triggers (/automations)
                </button>
              </div>

              {crmSubtab === "contacts" && (
                <ContactsPanel
                  contacts={contacts}
                  selectedTenant={selectedTenant}
                  inspectedContact={inspectedContact}
                  setInspectedContact={setInspectedContact}
                  onUpdateContactStatus={handleUpdateContactStatus}
                  onOpenNewContact={() => setIsNewContactOpen(true)}
                  onSimulateChatChat={(c) => {
                    setChatSelectedContact(c);
                    setActiveTab("bots");
                  }}
                  onOpenBookSlot={(cid) => {
                    setNewAptForm((prev) => ({ ...prev, contactId: cid }));
                    setIsNewAptOpen(true);
                  }}
                />
              )}

              {crmSubtab === "pipelines" && (
                <PipelinesPanel
                  contacts={contacts}
                  onUpdateContactStatus={handleUpdateContactStatus}
                  onSelectContact={(c) => {
                    setInspectedContact(c);
                    setChatSelectedContact(c);
                  }}
                  setActiveTab={setActiveTab}
                />
              )}

              {crmSubtab === "automations" && (
                <AutomationsPanel
                  workflows={workflows}
                  selectedTenant={selectedTenant}
                  onToggleWorkflow={handleToggleWorkflow}
                  onOpenNewWorkflow={() => setIsNewWorkflowOpen(true)}
                />
              )}
            </div>
          )}

          {/* ========================================================== */}
          {/* ======================= 4. BOTS TAB ====================== */}
          {/* ========================================================== */}
          {activeTab === "bots" && (
            <div className="space-y-6">
              {/* Internal Directory Path Sub-Header Row */}
              <div className="bg-white p-2 rounded-xl border border-slate-200 flex items-center gap-2">
                <button
                  onClick={() => setBotSubtab("webchat")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                    botSubtab === "webchat" ? "bg-indigo-600 text-white shadow-xs" : "hover:bg-slate-50 text-slate-600"
                  }`}
                >
                  💬 Webchat Widget (/webchat)
                </button>
                <button
                  onClick={() => setBotSubtab("whatsapp")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                    botSubtab === "whatsapp" ? "bg-indigo-600 text-white shadow-xs" : "hover:bg-slate-50 text-slate-600"
                  }`}
                >
                  🟢 WhatsApp Webhook (/whatsapp)
                </button>
                <button
                  onClick={() => setBotSubtab("telegram")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                    botSubtab === "telegram" ? "bg-indigo-600 text-white shadow-xs" : "hover:bg-slate-50 text-slate-600"
                  }`}
                >
                  🔷 Telegram Concierge (/telegram)
                </button>
              </div>

              {botSubtab === "whatsapp" && (
                <WhatsappBot
                  bot={bots.find((b) => b.type === "whatsapp")}
                  contacts={contacts}
                  chatMessages={chatMessages}
                  chatLoading={chatLoading}
                  selectedContact={chatSelectedContact}
                  onSelectContact={setChatSelectedContact}
                  chatInputText={chatInputText}
                  setChatInputText={setChatInputText}
                  onSendMessage={handleChatSendMessage}
                  onUpdateSystemPrompt={handleUpdateBotPrompt}
                />
              )}

              {botSubtab === "telegram" && (
                <TelegramBot
                  bot={bots.find((b) => b.type === "telegram")}
                  contacts={contacts}
                  chatMessages={chatMessages}
                  chatLoading={chatLoading}
                  selectedContact={chatSelectedContact}
                  onSelectContact={setChatSelectedContact}
                  chatInputText={chatInputText}
                  setChatInputText={setChatInputText}
                  onSendMessage={handleChatSendMessage}
                  onUpdateSystemPrompt={handleUpdateBotPrompt}
                />
              )}

              {botSubtab === "webchat" && (
                <WebchatBot
                  bot={bots.find((b) => b.type === "webchat")}
                  contacts={contacts}
                  chatMessages={chatMessages}
                  chatLoading={chatLoading}
                  selectedContact={chatSelectedContact}
                  onSelectContact={setChatSelectedContact}
                  chatInputText={chatInputText}
                  setChatInputText={setChatInputText}
                  onSendMessage={handleChatSendMessage}
                  onUpdateSystemPrompt={handleUpdateBotPrompt}
                />
              )}
            </div>
          )}

          {/* ========================================================== */}
          {/* ===================== 5. CAMPAIGNS TAB =================== */}
          {/* ========================================================== */}
          {activeTab === "campaigns" && (
            <div className="space-y-6">
              {/* Internal Directory Path Sub-Header Row */}
              <div className="bg-white p-2 rounded-xl border border-slate-200 flex items-center gap-2">
                <button
                  onClick={() => setCampaignSubtab("email")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                    campaignSubtab === "email" ? "bg-indigo-600 text-white shadow-xs" : "hover:bg-slate-50 text-slate-600"
                  }`}
                >
                  📧 Outbound Mail (/email)
                </button>
                <button
                  onClick={() => setCampaignSubtab("sms")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                    campaignSubtab === "sms" ? "bg-indigo-600 text-white shadow-xs" : "hover:bg-slate-50 text-slate-600"
                  }`}
                >
                  📱 Telephony SMS (/sms)
                </button>
                <button
                  onClick={() => setCampaignSubtab("whatsapp")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                    campaignSubtab === "whatsapp" ? "bg-indigo-600 text-white shadow-xs" : "hover:bg-slate-50 text-slate-600"
                  }`}
                >
                  🟢 WhatsApp Broadcast (/whatsapp)
                </button>
              </div>

              {campaignSubtab === "email" && (
                <EmailCampaigns campaigns={campaigns} onOpenNewCampaign={() => setIsNewCampaignOpen(true)} />
              )}

              {campaignSubtab === "sms" && (
                <SmsCampaigns campaigns={campaigns} onOpenNewCampaign={() => setIsNewCampaignOpen(true)} />
              )}

              {campaignSubtab === "whatsapp" && (
                <WhatsappCampaigns campaigns={campaigns} onOpenNewCampaign={() => setIsNewCampaignOpen(true)} />
              )}
            </div>
          )}

          {/* ========================================================== */}
          {/* ===================== 6. EXPERIMENTS TAB ================= */}
          {/* ========================================================== */}
          {activeTab === "experiments" && (
            <ExperimentsPanel />
          )}

        </div>
      </main>

      {/* ========================================================== */}
      {/* ==================== FORM OVERLAY MODALS ==================== */}
      {/* ========================================================== */}

      {/* NEW CONTACT MODAL */}
      {isNewContactOpen && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl relative">
            <button onClick={() => setIsNewContactOpen(false)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 cursor-pointer">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-1.5">
              🏢 Register CRM Contact Lead
            </h3>

            <form onSubmit={handleCreateContact} className="space-y-3.5 text-xs text-slate-700">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Full Representative Name *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. John Doe"
                  value={newContactForm.name}
                  onChange={(e) => setNewContactForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Company / Enterprise *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Sahoo Technologies"
                  value={newContactForm.company}
                  onChange={(e) => setNewContactForm((p) => ({ ...p, company: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Business Email address</label>
                <input
                  type="email"
                  placeholder="johndoe@gmail.com"
                  value={newContactForm.email}
                  onChange={(e) => setNewContactForm((p) => ({ ...p, email: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">International Phone number</label>
                <input
                  type="tel"
                  placeholder="+44 7911 123456"
                  value={newContactForm.phone}
                  onChange={(e) => setNewContactForm((p) => ({ ...p, phone: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Active Summary details</label>
                <textarea
                  placeholder="Insert notes captured during client intake dialogues..."
                  value={newContactForm.summary}
                  onChange={(e) => setNewContactForm((p) => ({ ...p, summary: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 outline-none"
                  rows={2}
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setIsNewContactOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer shadow-xs">
                  Save Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BOOK APPOINTMENT MODAL */}
      {isNewAptOpen && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl relative">
            <button onClick={() => setIsNewAptOpen(false)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 cursor-pointer">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-1.5">
              📅 Book Time Slot per Isolated Tenant
            </h3>

            <form onSubmit={handleCreateAppointment} className="space-y-3.5 text-xs text-slate-700">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Choose Target Representative</label>
                <select
                  required
                  value={newAptForm.contactId}
                  onChange={(e) => setNewAptForm((p) => ({ ...p, contactId: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 outline-none"
                >
                  <option value="">-- Choose Candidate --</option>
                  {contacts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.company})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Appointment Title</label>
                <input
                  required
                  type="text"
                  placeholder="Sahoo R&D Collaboration Onsite Demo"
                  value={newAptForm.title}
                  onChange={(e) => setNewAptForm((p) => ({ ...p, title: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">StartTime Slot</label>
                <input
                  required
                  type="datetime-local"
                  value={newAptForm.startTime}
                  onChange={(e) => setNewAptForm((p) => ({ ...p, startTime: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Internal Notes</label>
                <textarea
                  rows={2}
                  placeholder="Notes synchronized with isolation calendars..."
                  value={newAptForm.notes}
                  onChange={(e) => setNewAptForm((p) => ({ ...p, notes: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setIsNewAptOpen(false)}
                  className="px-4 py-2 bg-slate-100 rounded-lg text-slate-600 cursor-pointer"
                >
                  Close
                </button>
                <button type="submit" className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer shadow-xs">
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NEW CAMPAIGN OVERLAY MODAL */}
      {isNewCampaignOpen && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl relative">
            <button onClick={() => setIsNewCampaignOpen(false)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 cursor-pointer">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-1.5">
              🚀 Launch Outbound Campaign Blast
            </h3>

            <form onSubmit={handleTriggerCampaign} className="space-y-3.5 text-xs text-slate-700">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Campaign Title *</label>
                <input
                  required
                  type="text"
                  placeholder="Sahoo Tech Summer Promo"
                  value={newCampaignForm.name}
                  onChange={(e) => setNewCampaignForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Campaign Mode Channel</label>
                <select
                  value={newCampaignForm.channel}
                  onChange={(e) => setNewCampaignForm((p) => ({ ...p, channel: e.target.value as any }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 cursor-pointer outline-none"
                >
                  <option value="email">📧 Outbound E-mail Template</option>
                  <option value="sms">📱 Telephony SMS Blast</option>
                  <option value="whatsapp">🔵 WhatsApp Broadcast Gateway</option>
                </select>
              </div>

              {newCampaignForm.channel === "email" && (
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Subject Line</label>
                  <input
                    type="text"
                    placeholder="Exclusive access code attached"
                    value={newCampaignForm.subject}
                    onChange={(e) => setNewCampaignForm((p) => ({ ...p, subject: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-slate-400 font-bold mb-1">Broadcaster Body templates *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Hi {{name}}, claim your exclusive 20% discount slot now!..."
                  value={newCampaignForm.template}
                  onChange={(e) => setNewCampaignForm((p) => ({ ...p, template: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 font-mono text-[11px] outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 text-xs font-bold font-sans">
                <button
                  type="button"
                  onClick={() => setIsNewCampaignOpen(false)}
                  className="px-4 py-2 bg-slate-100 rounded-lg text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer shadow-xs">
                  Execute Blast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NEW WORKFLOW OVERLAY MODAL */}
      {isNewWorkflowOpen && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl relative">
            <button onClick={() => setIsNewWorkflowOpen(false)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 cursor-pointer">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-1.5">
              ⚙️ Add Micro Automation Hook (Trigger/Action)
            </h3>

            <form onSubmit={handleCreateWorkflow} className="space-y-3.5 text-xs text-slate-700">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Rule Name *</label>
                <input
                  required
                  type="text"
                  placeholder="Outbound WhatsApp booked slot confirmation template"
                  value={newWorkflowForm.name}
                  onChange={(e) => setNewWorkflowForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Event Trigger</label>
                <select
                  value={newWorkflowForm.trigger}
                  onChange={(e) => setNewWorkflowForm((p) => ({ ...p, trigger: e.target.value as any }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 outline-none cursor-pointer"
                >
                  <option value="lead_created">📂 On Lead Creation (Scraper/Manual)</option>
                  <option value="appointment_booked">📅 On Slot Scheduled</option>
                  <option value="no_show">📉 On Client No-Show marked</option>
                  <option value="status_changed">🔄 On Pipelines Status modify</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Target Action</label>
                <select
                  value={newWorkflowForm.actionType}
                  onChange={(e) => setNewWorkflowForm((p) => ({ ...p, actionType: e.target.value as any }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 outline-none cursor-pointer"
                >
                  <option value="enrich_lead font-mono">🔍 Run Google Maps Schema Scraping crawler</option>
                  <option value="send_whatsapp font-mono font-bold">🟢 Transmit simulated WhatsApp dialog reminder</option>
                  <option value="send_email">📧 Outbound custom automated SMTP Email</option>
                  <option value="notify_agent">🔔 Feed notifications directly onto admin dashboard</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Template message string</label>
                <input
                  type="text"
                  placeholder="Hey, we confirmed your slot for checkup at {{time}}!..."
                  value={newWorkflowForm.template}
                  onChange={(e) => setNewWorkflowForm((p) => ({ ...p, template: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setIsNewWorkflowOpen(false)}
                  className="px-4 py-2 bg-slate-100 rounded-lg text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer shadow-xs">
                  Register Hook Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
