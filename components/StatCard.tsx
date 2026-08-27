export function StatCard({ label, value, hint, icon }: { label: string; value: string; hint?: string; icon: React.ReactNode }) {
  return <div className="card p-4 md:p-5">
    <div className="flex items-start justify-between"><div><p className="text-sm text-gray-500">{label}</p><p className="text-2xl font-black mt-1">{value}</p></div><div className="p-2 rounded-xl bg-gray-100">{icon}</div></div>
    {hint && <p className="text-xs text-gray-400 mt-3">{hint}</p>}
  </div>;
}
