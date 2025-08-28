const rows = [
  { name: 'Spent time with Bhushan', summary: 'Meeting Friends', date: 'Aug 23, 2025', emotion: 'Happy', progress: 100 },
  { name: 'Physics exam went good', summary: 'Exams', date: 'Aug 22, 2025', emotion: 'Anxious', progress: 38 },
  { name: 'Media channel branding', summary: 'Meeting', date: 'Aug 21, 2025', emotion: 'Angry', progress: 64 },
  { name: 'Date with Ameya', summary: 'Coffee Date', date: 'Aug 20, 2025', emotion: 'Happy', progress: 100 },
  { name: 'Sports with Friends', summary: 'Played Hockey', date: 'Aug 19, 2025', emotion: 'Thrilling', progress: 50 },
];

function ProgressPill({ value }) {
  return (
    <div className="inline-flex items-center gap-2">
      <div className="w-6 h-6 rounded-full border-2 border-brand-500 grid place-items-center text-[10px] font-semibold">
        {value}
      </div>
      <span className="text-xs opacity-70">%</span>
    </div>
  );
}

export default function JournalingTable() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="text-lg font-semibold">Journaling summary</div>
        <div className="flex gap-2">
          <button className="px-3 py-1 rounded-lg bg-gray-100 text-sm">Date</button>
          <button className="px-3 py-1 rounded-lg bg-gray-100 text-sm">Emotion</button>
        </div>
      </div>
      <div className="overflow-hidden rounded-xl border border-gray-100">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left p-3 font-medium">Name</th>
              <th className="text-left p-3 font-medium">Summary</th>
              <th className="text-left p-3 font-medium">Date</th>
              <th className="text-left p-3 font-medium">Emotion</th>
              <th className="text-left p-3 font-medium">Progress</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.name} className="odd:bg-white even:bg-gray-50">
                <td className="p-3">{r.name}</td>
                <td className="p-3 opacity-70">{r.summary}</td>
                <td className="p-3">{r.date}</td>
                <td className="p-3">
                  <span className="px-3 py-1 rounded-full text-xs bg-gray-100">{r.emotion}</span>
                </td>
                <td className="p-3"><ProgressPill value={r.progress} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}



