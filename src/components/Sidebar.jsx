import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-brand-500 text-white min-h-screen rounded-r-2xl p-5 flex flex-col gap-6">
      <div className="flex items-center gap-3 text-xl font-semibold">
        <div className="w-8 h-8 bg-white/20 rounded-full grid place-items-center">🧠</div>
        <span>MindSpace</span>
      </div>
      <button className="bg-white text-brand-600 font-medium rounded-xl py-3">Create Note</button>
      <nav className="flex-1 grid gap-2 text-[15px]">
        <NavLink to="/" end className={({ isActive }) => `rounded-xl px-3 py-2 text-left ${isActive ? 'bg-white/15' : 'hover:bg-white/10'}`}>Dashboard</NavLink>
        <NavLink to="/journaling" className={({ isActive }) => `rounded-xl px-3 py-2 text-left ${isActive ? 'bg-white/15' : 'hover:bg-white/10'}`}>Journaling</NavLink>
        <NavLink to="/therapy" className={({ isActive }) => `rounded-xl px-3 py-2 text-left ${isActive ? 'bg-white/15' : 'hover:bg-white/10'}`}>Therapy</NavLink>
        <NavLink to="/meditation" className={({ isActive }) => `rounded-xl px-3 py-2 text-left ${isActive ? 'bg-white/15' : 'hover:bg-white/10'}`}>Meditation</NavLink>
        <button className="text-left rounded-xl px-3 py-2 hover:bg-white/10 mt-auto">Menu settings</button>
      </nav>
      <div className="mt-auto flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-white/30" />
        <div className="leading-tight">
          <div className="text-sm">Chintu Manhotra</div>
          <div className="text-xs opacity-80">Pro</div>
        </div>
      </div>
    </aside>
  );
}


