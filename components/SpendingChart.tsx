"use client";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export function SpendingChart({ data }: { data: any[] }) {
  if (!data.length) return <div className="h-56 grid place-items-center text-gray-400">No spending yet.</div>;
  return <div className="h-64">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart><Pie data={data} dataKey="value" nameKey="name" innerRadius={62} outerRadius={90} paddingAngle={3}>
        {data.map((_,i)=><Cell key={i} fill={`hsl(${i*43},70%,55%)`}/>)}
      </Pie><Tooltip formatter={(v:any)=>`₹${Number(v).toLocaleString()}`}/></PieChart>
    </ResponsiveContainer>
  </div>
}
