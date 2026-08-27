"use client";
export function Modal({ open, title, onClose, children }: { open: boolean; title: string; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50" onMouseDown={onClose}>
    <div className="card w-full max-w-md p-5" onMouseDown={e => e.stopPropagation()}>
      <div className="flex justify-between items-center mb-4"><h2 className="font-black text-lg">{title}</h2><button onClick={onClose} className="text-gray-400">✕</button></div>
      {children}
    </div>
  </div>;
}
