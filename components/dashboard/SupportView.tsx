import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/Button';
import { getSupportAdvice } from '../../services/geminiService';
import { ChatMessage } from '../../types';
import { MessageSquare, Send, User, Bot } from 'lucide-react';

export const SupportView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: 'Namaste! I am Saarthi Support. Are you facing delays or need help with a booking?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const advice = await getSupportAdvice(userMsg.text);
    
    const botMsg: ChatMessage = { 
        id: (Date.now() + 1).toString(), 
        role: 'model', 
        text: advice 
    };
    
    setMessages(prev => [...prev, botMsg]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] md:h-[600px] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mx-4 my-2">
      <div className="bg-green-600 p-4 text-white flex items-center gap-3 shadow-sm">
        <div className="bg-white/20 p-2 rounded-full">
            <MessageSquare size={20} />
        </div>
        <div>
            <h2 className="font-bold text-lg">Support & Delays</h2>
            <p className="text-xs text-green-100">AI Assistant (Hinglish Supported)</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-2 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`p-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user' 
                  ? 'bg-green-600 text-white rounded-br-none' 
                  : 'bg-white text-gray-800 shadow-sm border border-gray-200 rounded-bl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
             <div className="flex gap-2 max-w-[80%]">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center"><Bot size={16} /></div>
                <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm border border-gray-200">
                    <div className="flex gap-1">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                    </div>
                </div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-200 flex gap-2">
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your issue (e.g., Truck is late)..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
        />
        <Button type="submit" className="px-4" disabled={loading || !input.trim()}>
            <Send size={20} />
        </Button>
      </form>
    </div>
  );
};