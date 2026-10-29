'use client';
import { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { useAppContext } from '@/components/AppContext';

type Message = { role: 'user' | 'model'; text: string };

export default function AIPage() {
  const { familyPlan, score } = useAppContext();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: '[Analyse de l\'Environnement]\nIntégrité de l\'abri vérifiée. En attente de la prochaine directive pour le renforcement du secteur.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) throw new Error("Clé API manquante.");

      const ai = new GoogleGenAI({ apiKey });
      
      const systemInstruction = `Tu es Survival Architect AI, un assistant de commandement tactique de mission. 
      Utilise une terminologie militaire/tactique (ex: "Affirmatif", "Opérateur", "Protocole", "Secteur").
      Garde tes réponses concises, structurées et hautement analytiques.
      Contexte : Score de Préparation = ${score}%. Membres de l'Unité = ${familyPlan.members.length}.`;

      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: { systemInstruction }
      });

      for (const msg of messages.slice(1)) {
        if (msg.role === 'user') {
            await chat.sendMessage({ message: msg.text });
        }
      }

      const response = await chat.sendMessage({ message: userMsg });
      setMessages(prev => [...prev, { role: 'model', text: response.text || 'Erreur.' }]);
    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'model', text: `[ERREUR SYSTÈME] ${err.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <header className="border-b border-primary/20 bg-background-dark/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center p-4 justify-between w-full">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-2xl">shield_with_heart</span>
            <h2 className="text-slate-100 text-lg font-bold leading-tight tracking-tight uppercase">Survival Architect AI</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <p className="text-primary text-[10px] font-bold leading-normal tracking-widest uppercase">Système En Ligne</p>
          </div>
        </div>
        <div className="bg-primary/10 py-1 text-center border-y border-primary/5">
          <span className="text-[10px] font-bold text-primary tracking-[0.2em] uppercase">Commandement Tactique Actif</span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'model' && (
              <div className="size-10 shrink-0 border border-primary/30 rounded-lg flex items-center justify-center bg-primary/5">
                <span className="material-symbols-outlined text-primary text-xl">smart_toy</span>
              </div>
            )}
            <div className={`flex flex-1 flex-col gap-1.5 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className="flex items-center gap-2">
                {msg.role === 'user' && <span className="text-slate-500 text-[10px]">OPÉRATEUR</span>}
                <p className={`text-[11px] font-bold tracking-wider uppercase ${msg.role === 'model' ? 'text-primary' : 'text-slate-400'}`}>
                  {msg.role === 'model' ? 'Architecte' : 'Opérateur'}
                </p>
              </div>
              {msg.role === 'model' ? (
                <div className="relative group">
                  <div className="absolute -left-1 top-0 bottom-0 w-0.5 bg-primary/40"></div>
                  <div className="text-sm font-normal leading-relaxed max-w-full rounded-r-lg px-4 py-3 bg-primary/5 border border-primary/20 text-primary/90 whitespace-pre-wrap">
                    {msg.text}
                  </div>
                </div>
              ) : (
                <p className="text-sm font-medium leading-relaxed max-w-[85%] rounded-lg px-4 py-3 bg-primary text-background-dark shadow-lg shadow-primary/10 border border-primary whitespace-pre-wrap">
                  {msg.text}
                </p>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="size-10 shrink-0 border border-primary/30 rounded-lg flex items-center justify-center bg-primary/5">
              <span className="material-symbols-outlined text-primary text-xl">insights</span>
            </div>
            <div className="flex flex-1 flex-col gap-1.5 items-start">
              <p className="text-primary text-[11px] font-bold tracking-wider uppercase">Architecte</p>
              <div className="flex items-center gap-1 px-4 py-3 bg-primary/5 border border-primary/20 rounded-r-lg italic text-primary/60 text-xs">
                <span className="animate-pulse">Traitement des données tactiques...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      <div className="p-4 bg-background-dark border-t border-primary/20 w-full pb-8">
        <form onSubmit={handleSend} className="relative flex flex-col gap-2">
          <label className="text-[10px] font-bold text-primary/70 tracking-widest uppercase ml-1">En attente d&apos;entrée de commande...</label>
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full bg-primary/10 border-primary/30 border text-slate-100 placeholder:text-primary/40 rounded-lg py-4 pl-4 pr-14 focus:ring-1 focus:ring-primary focus:border-primary transition-all font-mono text-sm"
              placeholder="Entrez une commande tactique..."
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-2 top-2 bottom-2 aspect-square bg-primary text-background-dark rounded flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <span className="material-symbols-outlined font-bold">arrow_forward</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
