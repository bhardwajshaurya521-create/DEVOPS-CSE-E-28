export function CategoryBudgets({ items }: { items: any[] }) {
  return <div className="space-y-4">{items.map(x=>{
    const pct=Math.min(100,(x.spent/x.limit)*100);
    const cls=pct>=100?"bg-red-500":pct>=90?"bg-orange-500":pct>=70?"bg-yellow-400":"bg-black";
    return <div key={x.categoryId}>
      <div className="flex justify-between text-sm mb-2"><span className="font-bold">{x.name}</span><span className="text-gray-500">₹{x.spent.toLocaleString()} / ₹{x.limit.toLocaleString()}</span></div>
      <div className="progress"><div className={cls} style={{width:`${pct}%`}}/></div>
      <div className="text-xs text-gray-400 mt-1">{pct>=100?"Budget exceeded":`${Math.max(0,x.limit-x.spent).toLocaleString()} remaining`}</div>
    </div>
  })}</div>
}
