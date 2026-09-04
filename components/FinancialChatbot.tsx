'use client';
import { useState } from 'react';

export default function FinancialChatbot() {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([
    { role: 'model', text: 'Hi! I am your PocketWise financial assistant. Ask me anything about your spending or budget.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await res.json();

      if (data.reply) {
        setMessages((prev) => [...prev, { role: 'model', text: data.reply }]);
      } else {
        setMessages((prev) => [...prev, { role: 'model', text: 'Sorry, I ran into an issue answering that.' }]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { role: 'model', text: 'Network error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-5 mt-6 flex flex-col h-[400px]">
      <h2 className="font-bold text-lg mb-3">PocketWise AI Assistant</h2>
      
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 p-2 bg-gray-50 rounded-lg text-sm">
        {messages.map((msg, idx) => (
          <div key={idx} className={`p-2 rounded-md ${msg.role === 'user' ? 'bg-indigo-100 text-right ml-8' : 'bg-white border text-left mr-8'}`}>
            <span className="block text-xs font-semibold text-gray-500 mb-1">{msg.role === 'user' ? 'You' : 'AI'}</span>
            {msg.text}
          </div>
        ))}
        {loading && <div className="text-gray-400 text-xs italic">AI is thinking...</div>}
      </div>

      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your budget..."
          className="input flex-1 border rounded px-3 py-2 text-sm"
        />
        <button type="submit" disabled={loading} className="btn btn-primary px-4 py-2 bg-indigo-600 text-white rounded text-sm">
          Send
        </button>
      </form>
    </div>
  );
}