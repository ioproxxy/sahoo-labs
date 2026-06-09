import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

// Fix __dirname issue in target EMS/CJS environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize GoogleGenAI
const hasApiKey = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY";
const ai = hasApiKey
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    })
  : null;

console.log(`[Gemini API Config] Key Present: ${hasApiKey}`);

// ----------------- In-Memory Database State -----------------

let tenants = [
  {
    id: "cohub",
    name: "CoHub Tech Workspace",
    domain: "labs.sahootechnologies.com/cohub",
    timezone: "Europe/Paris",
    businessHours: { start: "08:30", end: "18:00", days: [1, 2, 3, 4, 5] },
  },
  {
    id: "greenfield",
    name: "Greenfield Clinic",
    domain: "labs.sahootechnologies.com/clinic",
    timezone: "Africa/Johannesburg",
    businessHours: { start: "09:00", end: "17:00", days: [1, 2, 3, 4, 5, 6] },
  },
  {
    id: "cloudsaas",
    name: "ApexSaaS Automation",
    domain: "labs.sahootechnologies.com/apexsaas",
    timezone: "Europe/London",
    businessHours: { start: "09:00", end: "17:30", days: [1, 2, 3, 4, 5] },
  },
];

let contacts: any[] = [
  {
    id: "lead-1",
    tenantId: "cohub",
    name: "Sarah Jenkins",
    company: "SvelteLabs Tech",
    email: "sarah@sveltelabs.io",
    phone: "+33 6 1234 5678",
    status: "Lead" as const,
    score: 85,
    source: "scraper" as const,
    enrichedData: {
      employeeCount: "11-50",
      techStack: ["React", "Svelte", "Node.js", "Docker"],
      linkedinUrl: "linkedin.com/in/sarahjenkins-svelte",
      description: "Fast-growing frontend engineering consultancy in Paris looking for flexible hotdesks for 15 engineers.",
    },
    summary: "Enriched with LinkedIn data. Strongly recommended: consulting firm with active recruitment drive in Paris.",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "lead-2",
    tenantId: "cohub",
    name: "Michael Chen",
    company: "Vortex Gaming",
    email: "m.chen@vortexplay.com",
    phone: "+44 7911 123456",
    status: "Contact" as const,
    score: 65,
    source: "webchat" as const,
    enrichedData: {
      employeeCount: "51-200",
      techStack: ["Unity", "C#", "Firebase"],
      linkedinUrl: "linkedin.com/company/vortexgaming",
      description: "Mobile gaming game studio looking to build a remote outpost office in central London/Paris.",
    },
    summary: "Interested in physical office tours. Reassigned from Webchat bot enquiry form.",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "lead-3",
    tenantId: "cohub",
    name: "Alex Rivera",
    company: "Rivera Digital",
    email: "riveradigital@gmail.com",
    phone: "+33 7 8882 1212",
    status: "Conversation" as const,
    score: 72,
    source: "whatsapp" as const,
    enrichedData: {
      employeeCount: "1-10",
      techStack: ["WordPress", "Figma", "Tailwind"],
      linkedinUrl: "linkedin.com/in/alexrivera-figma",
      description: "Freelance web designer looking for high-speed fiber internet & networking events in Paris.",
    },
    summary: "Active debate with WhatsApp AI Bot regarding standard packages versus premium dedicated desks.",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "lead-4",
    tenantId: "greenfield",
    name: "Emma Watson",
    company: "Private Executive",
    email: "emma.watson@example.com",
    phone: "+27 11 234 5678",
    status: "Appointment" as const,
    score: 95,
    source: "telegram" as const,
    enrichedData: {
      employeeCount: "1",
      techStack: [],
      linkedinUrl: "",
      description: "Inquiry about holistic dental consultations and emergency root canal work.",
    },
    summary: "Booked routine cleaning. Outcome: pending check-in.",
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "lead-5",
    tenantId: "greenfield",
    name: "John Doe",
    company: "N/A",
    email: "johndoe@webmail.co.za",
    phone: "+27 82 890 1234",
    status: "Sale" as const,
    score: 98,
    source: "manual" as const,
    summary: "Upgraded to active premium medical dental support package. Converted successfully.",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

let appointments: any[] = [
  {
    id: "apt-1",
    tenantId: "cohub",
    contactId: "lead-3",
    title: "CoHub Custom Workspace Consultation",
    startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 45 * 60 * 1000).toISOString(),
    timezone: "Europe/Paris",
    source: "whatsapp" as const,
    reminderStatus: "pending" as const,
    outcome: "none" as const,
    notes: "Discuss tailored 10-person dedicated desk allocation.",
  },
  {
    id: "apt-2",
    tenantId: "greenfield",
    contactId: "lead-4",
    title: "Holistic Dental Consultation",
    startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // Day after tomorrow
    endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
    timezone: "Africa/Johannesburg",
    source: "telegram" as const,
    reminderStatus: "pending" as const,
    outcome: "none" as const,
    notes: "Requires tooth cosmetic evaluation.",
  },
];

let bots = [
  {
    id: "bot-webchat",
    tenantId: "cohub",
    type: "webchat" as const,
    name: "CoHub Assistant Webchat",
    status: "online" as const,
    systemPrompt: `You are automated AI Receptionist for CoHub Tech Workspace.
We provide hotdesks (300€/mo), dedicated desks (450€/mo), and team private offices (from 1500€/mo).
Address the user respectfully. Try to get details like their company name, size, and email.
Encourage them to schedule a workspace visit consultation! Today is ${new Date().toDateString()}.`,
  },
  {
    id: "bot-whatsapp",
    tenantId: "cohub",
    type: "whatsapp" as const,
    name: "CoHub WhatsApp Concierge",
    status: "online" as const,
    systemPrompt: `You are WhatsApp Receptionist for CoHub Tech Workspace. Keeping responses brief and friendly with emojis.`,
  },
  {
    id: "bot-telegram",
    tenantId: "cohub",
    type: "telegram" as const,
    name: "CoHub Telegram Dispatcher",
    status: "online" as const,
    systemPrompt: `You are professional Telegram Receptionist for CoHub. Focused on developer leads and technical founders.`,
  },
  {
    id: "bot-greenfield-web",
    tenantId: "greenfield",
    type: "webchat" as const,
    name: "Greenfield Dental Advisor",
    status: "online" as const,
    systemPrompt: `You are Dental Clinic Receptionist for Greenfield Clinic in Johannesburg.
Help clients check session availability and book dental checkups (price: R650). Include friendly empathetic advice.`,
  },
];

let campaigns: any[] = [
  {
    id: "camp-1",
    tenantId: "cohub",
    name: "Summer Workspace Relaunch",
    channel: "email" as const,
    status: "completed" as const,
    subject: "Hotdesks are melting! Special summer packages",
    template: "Hello {{name}},\n\nClaim 20% off all dedicated desks this summer at CoHub central Paris rooms. Stop working from humid home basements!",
    sentCount: 154,
    clickCount: 42,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "camp-2",
    tenantId: "cohub",
    name: "WhatsApp Tour Invitations",
    channel: "whatsapp" as const,
    status: "sending" as const,
    template: "Hey {{name}}! CoHub AI Receptionist here. Would you like to schedule a walk-through of the private office suites tomorrow?",
    sentCount: 22,
    clickCount: 14,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

let workflowRules = [
  {
    id: "flow-1",
    tenantId: "cohub",
    name: "AI Enrichment on New scraper lead",
    trigger: "lead_created" as const,
    actionType: "enrich_lead" as const,
    actionConfig: {},
    active: true,
  },
  {
    id: "flow-2",
    tenantId: "cohub",
    name: "Auto-Send WhatsApp Booking Appt Confirmation",
    trigger: "appointment_booked" as const,
    actionType: "send_whatsapp" as const,
    actionConfig: {
      template: "Awesome! Your consultation at CoHub is confirmed for {{time}}. Looking forward! 🚀",
    },
    active: true,
  },
  {
    id: "flow-3",
    tenantId: "cohub",
    name: "No-Show Campaign Catch",
    trigger: "no_show" as const,
    actionType: "send_email" as const,
    actionConfig: {
      subject: "We missed you! Let's reschedule your tour",
      template: "Hey there! We saw you couldn't make it to our CoHub tour. Rebook instantly here.",
    },
    active: true,
  },
];

let scraperJobs: any[] = [
  {
    id: "job-1",
    tenantId: "cohub",
    url: "google.com/maps/search/web-agencies-paris",
    keyword: "Paris Web Agency",
    status: "completed" as const,
    itemsFound: 4,
    results: [
      { name: "SvelteLabs Tech", company: "SvelteLabs Tech", email: "sarah@sveltelabs.io", phone: "+33 6 1234 5678", scrapedUrl: "sveltelabs.io" },
      { name: "DevGrip Paris", company: "DevGrip Corp", email: "contact@devgrip.fr", phone: "+33 6 4531 9911", scrapedUrl: "devgrip.fr" },
      { name: "Atelier Code", company: "Atelier Code", email: "bonjour@ateliercode.paris", phone: "+33 7 9911 2233", scrapedUrl: "ateliercode.paris" },
    ],
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Helper to search and attach conversations logs
let messages: Array<{
  id: string;
  contactId: string;
  sender: "user" | "bot" | "agent";
  text: string;
  createdAt: string;
}> = [
  { id: "msg-1", contactId: "lead-3", sender: "user", text: "Hi, do you have private office rooms available for rent starting July?", createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString() },
  { id: "msg-2", contactId: "lead-3", sender: "bot", text: "Hello! Yes, we have standard team private offices starting from 1500€/month. What company are you with and how many seats do you need?", createdAt: new Date(Date.now() - 2.9 * 3600 * 1000).toISOString() },
  { id: "msg-3", contactId: "lead-3", sender: "user", text: "We are Rivera Digital, 4 designers. We would love a dedicated room.", createdAt: new Date(Date.now() - 2.8 * 3600 * 1000).toISOString() },
  { id: "msg-4", contactId: "lead-3", sender: "bot", text: "Excellent! That sounds perfect for our central wing desk clusters. Let's schedule a physical tour. Would tomorrow at 3 PM work for you?", createdAt: new Date(Date.now() - 2.7 * 3600 * 1000).toISOString() },
  { id: "msg-5", contactId: "lead-3", sender: "user", text: "Yes, tomorrow 3 PM works. Book it please.", createdAt: new Date(Date.now() - 2.6 * 3600 * 1000).toISOString() },
  { id: "msg-6", contactId: "lead-3", sender: "bot", text: "All set! I have booked a slot for Rivera Digital on Europe/Paris time. We've updated your CRM timeline status to Appointment booked. See you tomorrow at CoHub!", createdAt: new Date(Date.now() - 2.5 * 3600 * 1000).toISOString() },
];


// ----------------- API ROUTES -----------------

// Tenants endpoints
app.get("/api/tenants", (req, res) => {
  res.json(tenants);
});

// Contacts CRUD
app.get("/api/contacts", (req, res) => {
  const { tenantId } = req.query;
  if (!tenantId) {
    return res.status(400).json({ error: "Missing tenantId" });
  }
  const filtered = contacts.filter((c) => c.tenantId === tenantId);
  res.json(filtered);
});

app.post("/api/contacts", (req, res) => {
  const { tenantId, name, company, email, phone, status, score, source, enrichedData, summary } = req.body;
  if (!tenantId || !name) {
    return res.status(400).json({ error: "tenantId and name are required" });
  }

  const newContact = {
    id: `lead-${Date.now()}`,
    tenantId,
    name,
    company: company || "N/A",
    email: email || "",
    phone: phone || "",
    status: (status as any) || "Lead",
    score: typeof score === "number" ? score : 50,
    source: (source as any) || "manual",
    enrichedData: enrichedData || {},
    summary: summary || "Manual CRM entry",
    createdAt: new Date().toISOString(),
  };

  contacts.push(newContact);

  // Trigger automation workflow if configured
  const workflow = workflowRules.find((w) => w.tenantId === tenantId && w.trigger === "lead_created" && w.active);
  if (workflow) {
    console.log(`[Workflow triggered] for contact ${name} -> Action: ${workflow.actionType}`);
    if (workflow.actionType === "enrich_lead") {
      newContact.score = Math.min(newContact.score + 15, 95);
      newContact.summary += " [Auto-Enriched by CRM Workflow Engine]";
      newContact.enrichedData = {
        employeeCount: "10-25",
        techStack: ["CRM", "React", "CloudSaaS"],
        linkedinUrl: `linkedin.com/search?q=${encodeURIComponent(newContact.name)}`,
        description: "Enriched based on web domain data patterns automatically.",
      };
    }
  }

  res.json(newContact);
});

app.put("/api/contacts/:id", (req, res) => {
  const { id } = req.params;
  const index = contacts.findIndex((c) => c.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Contact not found" });
  }

  const updatedContact = {
    ...contacts[index],
    ...req.body,
  };

  contacts[index] = updatedContact;
  res.json(updatedContact);
});

app.delete("/api/contacts/:id", (req, res) => {
  const { id } = req.params;
  contacts = contacts.filter((c) => c.id !== id);
  res.json({ success: true });
});

// Appointments endpoints
app.get("/api/appointments", (req, res) => {
  const { tenantId } = req.query;
  if (!tenantId) {
    return res.status(400).json({ error: "Missing tenantId" });
  }
  const filtered = appointments.filter((a) => a.tenantId === tenantId);
  res.json(filtered);
});

app.post("/api/appointments", (req, res) => {
  const { tenantId, contactId, title, startTime, endTime, timezone, source, notes } = req.body;
  if (!tenantId || !contactId || !startTime) {
    return res.status(400).json({ error: "tenantId, contactId, and startTime are required" });
  }

  const newApt = {
    id: `apt-${Date.now()}`,
    tenantId,
    contactId,
    title: title || "Scheduled Consultation",
    startTime,
    endTime: endTime || new Date(new Date(startTime).getTime() + 30 * 60 * 1000).toISOString(),
    timezone: timezone || "Europe/Paris",
    source: (source as any) || "crm",
    reminderStatus: "pending" as any,
    outcome: "none" as const,
    notes: notes || "",
  };

  appointments.push(newApt);

  // Update contact status to "Appointment"
  const cIndex = contacts.findIndex((c) => c.id === contactId);
  if (cIndex !== -1) {
    contacts[cIndex].status = "Appointment";
    contacts[cIndex].score = Math.max(contacts[cIndex].score, 90);
  }

  // Trigger automation workflow
  const workflow = workflowRules.find((w) => w.tenantId === tenantId && w.trigger === "appointment_booked" && w.active);
  if (workflow) {
    console.log(`[Workflow triggered] Appointment confirmed -> ${workflow.actionType}`);
    newApt.reminderStatus = "sent";
  }

  res.json(newApt);
});

app.put("/api/appointments/:id", (req, res) => {
  const { id } = req.params;
  const index = appointments.findIndex((a) => a.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Appointment not found" });
  }

  const updated = {
    ...appointments[index],
    ...req.body,
  };

  appointments[index] = updated;

  // If outcome is converted, update contact to "Sale"
  if (req.body.outcome === "converted") {
    const cIndex = contacts.findIndex((c) => c.id === updated.contactId);
    if (cIndex !== -1) {
      contacts[cIndex].status = "Sale";
      contacts[cIndex].score = 100;
    }
  }

  res.json(updated);
});

app.delete("/api/appointments/:id", (req, res) => {
  const { id } = req.params;
  appointments = appointments.filter((a) => a.id !== id);
  res.json({ success: true });
});

// Bots Config endpoints
app.get("/api/bots", (req, res) => {
  const { tenantId } = req.query;
  if (!tenantId) {
    return res.status(400).json({ error: "Missing tenantId" });
  }
  const filtered = bots.filter((b) => b.tenantId === tenantId);
  res.json(filtered);
});

app.put("/api/bots/:id", (req, res) => {
  const { id } = req.params;
  const index = bots.findIndex((b) => b.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Bot not found" });
  }

  bots[index] = {
    ...bots[index],
    ...req.body,
  };
  res.json(bots[index]);
});

// Workflows endpoints
app.get("/api/workflows", (req, res) => {
  const { tenantId } = req.query;
  if (!tenantId) {
    return res.status(400).json({ error: "Missing tenantId" });
  }
  const filtered = workflowRules.filter((w) => w.tenantId === tenantId);
  res.json(filtered);
});

app.post("/api/workflows", (req, res) => {
  const { tenantId, name, trigger, actionType, actionConfig, active } = req.body;
  if (!tenantId || !name || !trigger || !actionType) {
    return res.status(400).json({ error: "Required fields missing" });
  }

  const newRule = {
    id: `flow-${Date.now()}`,
    tenantId,
    name,
    trigger,
    actionType,
    actionConfig: actionConfig || {},
    active: active !== undefined ? active : true,
  };

  workflowRules.push(newRule);
  res.json(newRule);
});

app.put("/api/workflows/:id", (req, res) => {
  const { id } = req.params;
  const index = workflowRules.findIndex((w) => w.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Workflow not found" });
  }
  workflowRules[index] = {
    ...workflowRules[index],
    ...req.body,
  };
  res.json(workflowRules[index]);
});

// Campaigns endpoints
app.get("/api/campaigns", (req, res) => {
  const { tenantId } = req.query;
  if (!tenantId) {
    return res.status(400).json({ error: "Missing tenantId" });
  }
  res.json(campaigns.filter((c) => c.tenantId === tenantId));
});

app.post("/api/campaigns", (req, res) => {
  const { tenantId, name, channel, subject, template } = req.body;
  if (!tenantId || !name || !channel || !template) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const newCamp = {
    id: `camp-${Date.now()}`,
    tenantId,
    name,
    channel,
    status: "sending" as any,
    subject,
    template,
    sentCount: contacts.filter((c) => c.tenantId === tenantId).length,
    clickCount: 0,
    createdAt: new Date().toISOString(),
  };

  campaigns.push(newCamp);

  // Simulate campaign completes after 4 seconds
  setTimeout(() => {
    newCamp.status = "completed";
    newCamp.clickCount = Math.floor(newCamp.sentCount * 0.28);
  }, 4000);

  res.json(newCamp);
});

// Scraper Engine simulation using Gemini to generate real scored leads
app.get("/api/scrapers", (req, res) => {
  const { tenantId } = req.query;
  if (!tenantId) {
    return res.status(400).json({ error: "Missing tenantId" });
  }
  res.json(scraperJobs.filter((s) => s.tenantId === tenantId));
});

app.post("/api/scrapers", async (req, res) => {
  const { tenantId, url, keyword } = req.body;
  if (!tenantId || !url || !keyword) {
    return res.status(400).json({ error: "Missing tenantId, url, or keyword" });
  }

  // Add job log as running
  const newJob = {
    id: `job-${Date.now()}`,
    tenantId,
    url,
    keyword,
    status: "running" as any,
    itemsFound: 0,
    results: [] as any[],
    createdAt: new Date().toISOString(),
  };
  scraperJobs.push(newJob);

  const targetTenant = tenants.find((t) => t.id === tenantId);
  const businessDescription = targetTenant ? targetTenant.name : "coworking space or medical clinic";

  try {
    if (ai) {
      // Prompt Gemini to act like a lead scraper + enricher that returns structured matching leads
      const prompt = `Simulate a background web crawler scraping lead opportunities matching the sector keyword "${keyword}" from the source website/directory: "${url}".
These leads are potential high-value clients for the tenant business of "${businessDescription}".
Generate excatly 3 highly realistic candidate leads with contact names, real-sounding company domains, realistic email addresses, phone numbers, and a brief description of their business needs.
Keep technical stack details populated like "React", "Python", "Dentistry", matching their focus.
Output your response STRICTLY as an official JSON array of objects conforming to the following typescript shape:
Array<{
  name: string;
  company: string;
  email: string;
  phone: string;
  scrapedUrl: string;
  techStack: string[];
  employeeCount: string;
  description: string;
  score: number; // calculated score from 0 to 100 on how good they fit for a client
}>.
Do not wrap in anything return raw valid JSON.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                company: { type: Type.STRING },
                email: { type: Type.STRING },
                phone: { type: Type.STRING },
                scrapedUrl: { type: Type.STRING },
                techStack: { type: Type.ARRAY, items: { type: Type.STRING } },
                employeeCount: { type: Type.STRING },
                description: { type: Type.STRING },
                score: { type: Type.INTEGER },
              },
              required: ["name", "company", "email", "phone", "scrapedUrl", "techStack", "employeeCount", "description", "score"],
            },
          },
        },
      });

      const items = JSON.parse(response.text || "[]");
      if (Array.isArray(items)) {
        newJob.status = "completed";
        newJob.itemsFound = items.length;
        newJob.results = items.map((itm) => ({
          name: itm.name,
          company: itm.company || "N/A",
          email: itm.email,
          phone: itm.phone,
          scrapedUrl: itm.scrapedUrl,
        }));

        // Insert into Contacts CRM database
        items.forEach((itm) => {
          contacts.push({
            id: `lead-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            tenantId,
            name: itm.name,
            company: itm.company || "N/A",
            email: itm.email,
            phone: itm.phone,
            status: "Lead",
            score: itm.score || 70,
            source: "scraper",
            enrichedData: {
              employeeCount: itm.employeeCount,
              techStack: itm.techStack,
              linkedinUrl: `linkedin.com/company/${itm.company?.toLowerCase().replace(/\s+/g, "")}`,
              description: itm.description,
            },
            summary: `Discovered & Scraped automatically from ${url} with scored fit: ${itm.score}%.`,
            createdAt: new Date().toISOString(),
          });
        });
      } else {
        throw new Error("Invalid output layout from Gemini API");
      }
    } else {
      // Fallback lead generator if Gemini Key is absent
      setTimeout(() => {
        newJob.status = "completed";
        newJob.itemsFound = 2;
        const resultItems = [
          {
            name: "David Miller",
            company: "Miller Law Corp",
            email: "dmiller@millerlaw.fr",
            phone: "+33 6 8811 9283",
            scrapedUrl: "millerlaw.fr",
            score: 75,
            techStack: ["WordPress", "PHP"],
            employeeCount: "2-10",
            description: "Boutique litigation firm looking for quiet private hotdesking options next month.",
          },
          {
            name: "Sophie Laurent",
            company: "Aura Creative",
            email: "sophie@auracreative.co",
            phone: "+33 7 1222 3444",
            scrapedUrl: "auracreative.co",
            score: 82,
            techStack: ["Next.js", "TailwindCSS"],
            employeeCount: "11-50",
            description: "Boutique digital marketing agency wanting desk credits and meeting rooms for clients.",
          },
        ];

        newJob.results = resultItems.map((ri) => ({
          name: ri.name,
          company: ri.company,
          email: ri.email,
          phone: ri.phone,
          scrapedUrl: ri.scrapedUrl,
        }));

        resultItems.forEach((itm) => {
          contacts.push({
            id: `lead-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            tenantId,
            name: itm.name,
            company: itm.company,
            email: itm.email,
            phone: itm.phone,
            status: "Lead",
            score: itm.score,
            source: "scraper",
            enrichedData: {
              employeeCount: itm.employeeCount,
              techStack: itm.techStack,
              linkedinUrl: `linkedin.com/company/${itm.company.toLowerCase()}`,
              description: itm.description,
            },
            summary: `Discovered automatically from simulated scraper at ${url}.`,
            createdAt: new Date().toISOString(),
          });
        });
      }, 3000);
    }

    res.json(newJob);
  } catch (error: any) {
    console.error("Scraper Error:", error);
    newJob.status = "failed";
    res.status(500).json({ error: error.message || "Failed running scraper simulation" });
  }
});

// Interactive Webchat / Channel Chat simulator with AI Receptionist
app.get("/api/chat/history", (req, res) => {
  const { contactId } = req.query;
  if (!contactId) {
    return res.status(400).json({ error: "Missing contactId" });
  }
  const history = messages.filter((m) => m.contactId === contactId);
  res.json(history);
});

app.post("/api/chat", async (req, res) => {
  const { contactId, tenantId, botType, text } = req.body;
  if (!contactId || !tenantId || !text) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // 1. Add User Message
  const userMsg = {
    id: `msg-${Date.now()}-u`,
    contactId,
    sender: "user" as const,
    text,
    createdAt: new Date().toISOString(),
  };
  messages.push(userMsg);

  // Update recipient contact to 'Conversation' status
  const cIndex = contacts.findIndex((c) => c.id === contactId);
  if (cIndex !== -1) {
    if (contacts[cIndex].status === "Lead") {
      contacts[cIndex].status = "Conversation";
    }
  }

  const targetTenant = tenants.find((t) => t.id === tenantId) || tenants[0];
  const targetBot = bots.find((b) => b.tenantId === tenantId && b.type === (botType || "webchat")) || bots[0];
  const activeHistory = messages.filter((m) => m.contactId === contactId).slice(-10);

  let botReplyText = "";

  try {
    if (ai) {
      // Structure chat context
      const chatHistoryPrompt = activeHistory
        .map((msg) => `${msg.sender === "user" ? "Client" : "Assistant"}: ${msg.text}`)
        .join("\n");

      const promptHead = `You are a real-time conversational AI Receptionist running on SaaS portal "labs.sahootechnologies.com".
Tenant Company name: "${targetTenant.name}"
Tenant business hours: ${targetTenant.businessHours.start} to ${targetTenant.businessHours.end} (Timezone: ${targetTenant.timezone}).
Our current timezone is ${targetTenant.timezone} and local system time is ${new Date().toLocaleTimeString('en-US', {timeZone: targetTenant.timezone})}.

${targetBot.systemPrompt}

Below is the user conversation history:
${chatHistoryPrompt}

IMPORTANT AUTOMATED APPOINTMENT SYSTEM RULE:
If the user wants to book, secure, schedule, or reserve a visit, meeting, audit, consultation, or dental checkup; AND they provided or suggested a day/time, you have the capability to schedule it automatically.
Our software scans your reply for scheduling commands.
If you schedule/book a time slot, always add this secret tag [SCHEDULE: YYYY-MM-DDTHH:MM] at the absolute END of your text response in a single line, replacing with the date and hour the customer requested (and adapt to ${targetTenant.timezone} timezone). Only do this if they agreed or requested. E.g. "Excellent! I have saved your tour at 3pm next Monday." followed by the tag on a separate line.

Provide a friendly, context-aware, helpful receptionist response:`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptHead,
      });

      botReplyText = response.text || "I apologize, let me double check that for you.";
    } else {
      // Smart Rule-based local fallbacks if Gemini is not set up
      const lower = text.toLowerCase();
      if (lower.includes("book") || lower.includes("schedule") || lower.includes("reserve") || lower.includes("visit") || lower.includes("tour")) {
        const fakeDate = new Date(Date.now() + 24 * 3600 * 1000); // 1 day from now
        fakeDate.setHours(14, 0, 0, 0); // 2:00 PM
        const isoStr = fakeDate.toISOString().substring(0, 16); // YYYY-MM-DDTHH:MM

        botReplyText = `Sure! I would be absolutely delighted to schedule a consultation at ${targetTenant.name}. I've proposed tomorrow at 2:00 PM (${targetTenant.timezone}). Does that work? Let me know, and we'll lock in the timing!\n\n[SCHEDULE:${isoStr}]`;
      } else if (lower.includes("price") || lower.includes("pricing") || lower.includes("cost") || lower.includes("fees")) {
        if (tenantId === "cohub") {
          botReplyText = "For CoHub Tech Workspace, our prices are: Hotdesks starting at 300€/month, Dedicated Desks at 450€/month, and Private Offices starting at 1500€/month. Let me know if you would like me to book a touring consultation!";
        } else if (tenantId === "greenfield") {
          botReplyText = "An initial oral evaluation and checkup with our lead dentist is R650. This covers scaling, polishing, and comprehensive consultation. Would you like me to book a slot?";
        } else {
          botReplyText = "Our base CRM optimization services start from 499$/month. I can register you for an elite AI workflow audit anytime!";
        }
      } else {
        botReplyText = `Thank you for reaching out to ${targetTenant.name}! I am your AI Receptionist. I am happy to guide you on services, pricing, and scheduling availability. What can I help you with today?`;
      }
    }

    // Capture scheduling automation signal
    const scheduleMatch = botReplyText.match(/\[SCHEDULE:(.*?)\]/);
    let autoScheduled = false;
    let autoScheduledApt: any = null;

    if (scheduleMatch && scheduleMatch[1]) {
      const dateVal = scheduleMatch[1].trim();
      botReplyText = botReplyText.replace(/\[SCHEDULE:.*?\]/g, "").trim();

      // Trigger automatic calendar insert!
      const contact = contacts.find((c) => c.id === contactId);
      const companyLabel = contact ? contact.company : "New Inquiry";
      const contactName = contact ? contact.name : "Client";

      autoScheduledApt = {
        id: `apt-${Date.now()}`,
        tenantId,
        contactId,
        title: `${targetTenant.name} AutoAI Booking - ${contactName}`,
        startTime: new Date(dateVal).toISOString(),
        endTime: new Date(new Date(dateVal).getTime() + 45 * 60 * 1000).toISOString(),
        timezone: targetTenant.timezone,
        source: botType || "webchat",
        reminderStatus: "sent" as const,
        outcome: "none" as const,
        notes: `AI-scheduled receptionist call from chat interaction details.`,
      };

      appointments.push(autoScheduledApt);
      autoScheduled = true;

      // Update CRM Lead state to Appointment phase!
      if (cIndex !== -1) {
        contacts[cIndex].status = "Appointment";
        contacts[cIndex].score = 92;
        contacts[cIndex].summary = `${contacts[cIndex].summary || ""} [Auto-booked by Bot Receptionist]`;
      }
    }

    // Add Bot reply message
    const botMsg = {
      id: `msg-${Date.now()}-b`,
      contactId,
      sender: "bot" as const,
      text: botReplyText,
      createdAt: new Date().toISOString(),
    };
    messages.push(botMsg);

    res.json({
      reply: botReplyText,
      autoScheduled,
      appointment: autoScheduledApt,
    });
  } catch (error: any) {
    console.error("Chat Error:", error);
    res.status(500).json({ error: error.message || "Chat model failed" });
  }
});


// ----------------- VITE DEVELOPMENT & PRODUCTION INTEGRATION -----------------

if (process.env.NODE_ENV !== "production") {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
} else {
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`[Full-Stack Server] running on http://localhost:${PORT}`);
});
