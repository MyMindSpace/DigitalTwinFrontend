export default function Topbar({ title = 'Dashboard' }) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <div className="flex items-center gap-3">
        <div className="bg-white rounded-full shadow-card flex items-center px-4 py-2 w-[420px]">
          <input className="flex-1 outline-none text-sm" placeholder="Search for anything..." />
        </div>
        <div className="bg-white rounded-full shadow-card px-3 py-1 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-brand-500" />
          <div className="text-sm">Chintu Manhotra</div>
        </div>
      </div>
    </div>
  );
}



