export function StatCard({ icon, title, value, hint }) {
  return (
    <div className="bg-white rounded-2xl shadow-card p-5 flex gap-4 items-start">
      <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 grid place-items-center text-xl">{icon}</div>
      <div className="flex-1">
        <div className="text-sm opacity-70">{title}</div>
        <div className="text-2xl font-semibold">{value}</div>
        {hint && <div className="text-xs opacity-60 mt-1">{hint}</div>}
      </div>
    </div>
  );
}

export function Card({ children, className = '' }) {
  return <div className={`bg-white rounded-2xl shadow-card p-5 ${className}`}>{children}</div>;
}



