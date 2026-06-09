import React from "react";
import { Bot, Contact, Message, Tenant } from "../../types";
import { Send, RefreshCw, MessageSquare } from "lucide-react";

interface TelegramBotProps {
  bot: Bot | undefined;
  contacts: Contact[];
  chatMessages: Message[];
  chatLoading: boolean;
  selectedContact: Contact | null;
  onSelectContact: (c: Contact) => void;
  chatInputText: string;
  setChatInputText: (val: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
  onUpdateSystemPrompt: (botId: string, prompt: string) => void;
}

export default function TelegramBot({
  bot,
  contacts,
  chatMessages,
  chatLoading,
  selectedContact,
  onSelectContact,
  chatInputText,
  setChatInputText,
  onSendMessage,
  onUpdateSystemPrompt,
}: TelegramBotProps) {
  return (
    <div className="grid grid-cols-12 gap-6" id="telegram-bot-container">
      {/* Configuration Column */}
      <div className="col-span-12 md:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col space-y-4">
        <div>
          <h2 className="font-bold text-slate-800 text-base font-sans">Telegram AI Concierge Bot</h2>
          <p className="text-xs text-slate-400 mt-0.5">Automate corporate availability questions on Telegram channel</p>
        </div>

        {bot ? (
          <div className="space-y-3 p-4 bg-slate-50 border border-slate-200/80 rounded-xl">
            <div className="flex justify-between items-center text-xs font-bold font-mono text-slate-800">
              <span className="flex items-center gap-1 text-sky-600">🔷 TELEGRAM ASSISTANT BOT</span>
              <span className="text-emerald-600">ONLINE</span>
            </div>
            
            <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
              Tune system instructions for standard pricing schemas, calendar book rules, or holiday timings:
            </p>

            <textarea
              rows={9}
              className="w-full bg-white border border-slate-200 rounded-lg p-2.5 font-mono text-[11px] leading-relaxed text-slate-700 outline-none focus:border-indigo-600"
              value={bot.systemPrompt}
              onChange={(e) => onUpdateSystemPrompt(bot.id, e.target.value)}
            />
            <div className="text-right text-[10px] text-slate-400 font-mono">
              ✨ Updates active client hooks instantly
            </div>
          </div>
        ) : (
          <div className="p-6 text-center text-slate-400 text-xs bg-slate-50 rounded-xl border">
            No Telegram bot configured yet for this client isolation.
          </div>
        )}
      </div>

      {/* Terminal Sandbox Column */}
      <div className="col-span-12 md:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden min-h-[460px]">
        <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold text-sky-600 flex items-center gap-1.5 uppercase">
            <span className="h-2.5 w-2.5 bg-sky-500 rounded-full animate-pulse"></span>
            Telegram Sandbox Interface Simulator
          </span>

          <div className="flex items-center gap-1.5 font-mono text-xs">
            <span className="text-slate-400">Replying as:</span>
            <select
              value={selectedContact?.id || ""}
              onChange={(e) => {
                const c = contacts.find((item) => item.id === e.target.value);
                if (c) onSelectContact(c);
              }}
              className="bg-white border border-slate-200 text-slate-800 text-[10px] px-1.5 py-0.5 rounded font-black outline-none cursor-pointer"
            >
              {contacts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/20 max-h-[310px]">
          {selectedContact ? (
            chatMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400 text-xs space-y-2">
                <MessageSquare className="w-8 h-8 text-sky-300 stroke-1" />
                <div>No messages on Telegram line with {selectedContact.name}.</div>
                <p className="text-[10px] text-slate-405 text-slate-400 max-w-[280px]">
                  Simulate contact query like: "Are there workspaces available now in Johannesburg?"
                </p>
              </div>
            ) : (
              chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col max-w-[80%] ${
                    msg.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"
                  }`}
                >
                  <span className="text-[9px] font-mono text-slate-400 px-1 mb-0.5">
                    {msg.sender === "user" ? selectedContact.name : "CRM TELEGRAM BOT"}
                  </span>
                  
                  <div
                    className={`p-3 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-sky-600 text-white shadow-xs"
                        : "bg-white border border-slate-200 text-slate-850 text-slate-800"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[8px] text-slate-400 font-mono px-1.5 mt-0.5">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              ))
            )
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 text-xs italic">
              Select contacts to simulate inline testing sandbox dialog fields.
            </div>
          )}

          {chatLoading && (
            <div className="mr-auto flex flex-col max-w-[80%] items-start animate-pulse">
              <span className="text-[9px] font-mono text-slate-400 px-1">CRM TELEGRAM BOT</span>
              <div className="p-3 bg-white border border-slate-200 rounded-2xl text-xs text-slate-400">
                Triggering API hooks... Formulating response parameters...
              </div>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={onSendMessage} className="p-3 bg-white border-t border-slate-200 flex gap-2 shrink-0">
          <input
            disabled={chatLoading || !selectedContact}
            type="text"
            required
            placeholder={selectedContact ? `Type simulated Telegram reply as ${selectedContact.name}...` : "Select a contact first"}
            value={chatInputText}
            onChange={(e) => setChatInputText(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs outline-none focus:border-indigo-600"
          />
          <button
            type="submit"
            disabled={chatLoading || !selectedContact || !chatInputText.trim()}
            className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs py-2 px-4 rounded-xl shadow-xs transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
          >
            <Send className="w-3" /> Transmit Inbound
          </button>
        </form>
      </div>
    </div>
  );
}
