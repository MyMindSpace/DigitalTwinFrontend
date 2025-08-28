const tasks = [
  'Create a user flow of social application design',
  'Create a user flow of social application design',
  'Landing page design for Fintech project',
  'Interactive prototype for app screens',
  'Interactive prototype for app screens',
];

export default function TasksWidget() {
  return (
    <div>
      <div className="text-lg font-semibold mb-3">Today’s task</div>
      <ul className="space-y-3">
        {tasks.map((t, i) => (
          <li key={i} className="flex items-center gap-3">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-300" defaultChecked={i < 2} />
            <span className={i < 2 ? 'opacity-70' : ''}>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}



