export interface Tenant {
  id: string;
  name: string;
  domain: string;
  timezone: string;
  businessHours: {
    start: string; // e.g. "09:00"
    end: string;   // e.g. "17:00"
    days: number[]; // e.g. [1, 2, 3, 4, 5] (Mon-Fri)
  };
}

export type LeadStatus = "Lead" | "Contact" | "Conversation" | "Appointment" | "Sale";

export interface Contact {
  id: string;
  tenantId: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: LeadStatus;
  score: number; // 0 to 100
  source: "webchat" | "whatsapp" | "telegram" | "manual" | "scraper";
  enrichedData?: {
    employeeCount?: string;
    techStack?: string[];
    linkedinUrl?: string;
    description?: string;
    scrapedFrom?: string;
  };
  summary?: string;
  createdAt: string;
}

export type BotType = "whatsapp" | "telegram" | "webchat" | "voice";

export interface Bot {
  id: string;
  tenantId: string;
  type: BotType;
  name: string;
  status: "online" | "offline";
  systemPrompt: string;
  webhookUrl?: string;
}

export interface Appointment {
  id: string;
  tenantId: string;
  contactId: string;
  title: string;
  startTime: string; // ISO string
  endTime: string;   // ISO string
  timezone: string;
  source: "whatsapp" | "telegram" | "crm" | "landing_page";
  reminderStatus: "pending" | "sent" | "failed";
  outcome: "none" | "showed_up" | "no_show" | "rescheduled" | "converted";
  notes?: string;
}

export interface Campaign {
  id: string;
  tenantId: string;
  name: string;
  channel: "email" | "sms" | "whatsapp";
  status: "draft" | "scheduled" | "sending" | "completed";
  subject?: string;
  template: string;
  sentCount: number;
  clickCount: number;
  createdAt: string;
}

export interface WorkflowRule {
  id: string;
  tenantId: string;
  name: string;
  trigger: "lead_created" | "appointment_booked" | "no_show" | "status_changed";
  actionType: "send_whatsapp" | "send_email" | "enrich_lead" | "notify_agent";
  actionConfig: {
    template?: string;
    subject?: string;
    recipientRole?: string;
  };
  active: boolean;
}

export interface Message {
  id: string;
  contactId: string;
  sender: "user" | "bot" | "agent";
  text: string;
  createdAt: string;
}

export interface ScraperJob {
  id: string;
  tenantId: string;
  url: string;
  keyword: string;
  status: "pending" | "running" | "completed" | "failed";
  itemsFound: number;
  results: Array<{
    name: string;
    company: string;
    email: string;
    phone: string;
    scrapedUrl: string;
  }>;
  createdAt: string;
}
