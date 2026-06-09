import React from "react";
import { Bot, Contact, Message, Tenant } from "../../types";
import { Send, RefreshCw, MessageSquare } from "lucide-react";

interface WebchatBotProps {
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

export default function WebchatBot({
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
}: WebchatBotProps) {
  return (
    <div className="grid grid-cols-12 gap-6" id="webchat-bot-container">
      {/* Bot Info/Prompt configuration */}
      <div className="col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col space-y-4">
        <div>
          <h2 className="font-bold text-slate-800 text-base font-sans">Webchat Assistant Customizer</h2>
          <p className="text-xs text-slate-400 mt-0.5">Control web widgets placed directly inside corporate homepages</p>
        </div>

        {bot ? (
          <div className="space-y-3 p-4 bg-slate-55 bg-slate-50 border border-slate-200/80 rounded-xl">
            <div className="flex justify-between items-center text-xs font-bold font-mono text-slate-800">
              <span className="flex items-center gap-1">💬 WEBCHAT ACTIVE CONFIG</span>
              <span className="text-emerald-600">LIVE</span>
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
            No Webchat bot configured yet for this client isolation.
          </div>
        )}
      </div>

      {/* Live Sandbox Terminal Simulator */}
      <div className="col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden min-h-[460px]">
        <div className="p-4 bg-slate-50/50 border-b border-indigo-100 border-slate-100 shrink-0 flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold text-slate-800 flex items-center gap-1.5 uppercase">
            <span className="h-2.5 w-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
            Webchat Terminal Simulator
          </span>

          <div className="flex items-center gap-1.5 font-mono text-xs">
            <span className="text-slate-400">Leads conversation partner:</span>
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
                  {c.name} ({c.company})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Messages stream view */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/30 max-h-[310px]">
          {selectedContact ? (
            chatMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400 text-xs space-y-2">
                <MessageSquare className="w-8 h-8 text-indigo-300 stroke-1" />
                <div>No messages exchanged with {selectedContact.name} yet.</div>
                <p className="text-[10px] text-slate-400/80 max-w-[280px]">
                  Say something like "Hi, can you book me a tour tomorrow?" to test automatic calendar tracking!
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
                    {msg.sender === "user" ? selectedContact.name : "CRM AI BOT"}
                  </span>
                  
                  <div
                    className={`p-3 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "bg-white border border-slate-200 text-slate-805 text-slate-800"
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
            <div className="h-full flex items-center justify-center p-8 text-slate-400 text-xs text-center font-mono">
              Introduce a contact before launching simulation threads
            </div>
          )}

          {chatLoading && (
            <div className="mr-auto flex flex-col max-w-[80%] items-start animate-pulse">
              <span className="text-[9px] font-mono text-slate-400 px-1">AI REDIRECT BOT</span>
              <div className="p-3 bg-white border border-slate-200 rounded-2xl text-xs text-slate-400">
                Analyzing criteria... Syncing with tenant database hours...
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
            placeholder={selectedContact ? `Simulate customer replying as ${selectedContact.name}...` : "Select a contact first"}
            value={chatInputText}
            onChange={(e) => setChatInputText(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs outline-none focus:border-indigo-600"
          />
          <button
            type="submit"
            disabled={chatLoading || !selectedContact || !chatInputText.trim()}
            className="bg-indigo-650 bg-indigo-600 hover:bg-slate-900 text-white font-bold text-xs py-2 px-4 rounded-xl shadow-xs shrink-0 flex items-center gap-1 cursor-pointer disabled:opacity-50 transition-colors"
          >
            <Send className="w-3" /> Simulate Outbound
          </button>
        </form>
      </div>
    </div>
  );
}
