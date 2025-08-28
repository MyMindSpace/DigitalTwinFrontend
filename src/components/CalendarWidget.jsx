import { addDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek, format } from 'date-fns';

function buildMonthDays(date) {
  const start = startOfWeek(startOfMonth(date), { weekStartsOn: 0 });
  const end = endOfWeek(endOfMonth(date), { weekStartsOn: 0 });
  const days = [];
  let d = start;
  while (d <= end) {
    days.push(d);
    d = addDays(d, 1);
  }
  return days;
}

export default function CalendarWidget({ date = new Date(2025, 7, 1) }) {
  const days = buildMonthDays(date);
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="text-lg font-semibold">August · 2025</div>
      </div>
      <div className="grid grid-cols-7 text-center text-xs text-gray-500 mb-2">
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((d) => (
          <div key={d.toISOString()} className="bg-gray-50 rounded-lg py-2 text-center text-sm">
            {format(d, 'd')}
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-4">
        <button className="px-3 py-1 rounded-full bg-brand-500 text-white text-sm">24</button>
        <button className="px-3 py-1 rounded-full bg-gray-100 text-sm">25</button>
        <button className="px-3 py-1 rounded-full bg-gray-100 text-sm">26</button>
        <button className="px-3 py-1 rounded-full bg-gray-100 text-sm">27</button>
        <button className="px-3 py-1 rounded-full bg-gray-100 text-sm">28</button>
        <button className="px-3 py-1 rounded-full bg-gray-100 text-sm">29</button>
        <button className="px-3 py-1 rounded-full bg-gray-100 text-sm">30</button>
      </div>
    </div>
  );
}



