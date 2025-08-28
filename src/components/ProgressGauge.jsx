import { RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';

const data = [{ name: 'Completed', value: 72, fill: '#6A42FF' }];

export default function ProgressGauge() {
  return (
    <div className="grid place-items-center">
      <RadialBarChart width={240} height={160} innerRadius={80} outerRadius={120} data={data} startAngle={180} endAngle={0}>
        <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
        <RadialBar dataKey="value" background cornerRadius={10} />
      </RadialBarChart>
      <div className="-mt-24 text-center">
        <div className="text-3xl font-semibold">72%</div>
        <div className="text-sm opacity-70">Completed</div>
      </div>
      <div className="grid grid-cols-4 gap-6 text-center text-sm mt-4">
        <div>
          <div className="text-lg font-semibold">95</div>
          <div className="opacity-70 text-xs">Total Sessions</div>
        </div>
        <div>
          <div className="text-lg font-semibold text-green-600">26</div>
          <div className="opacity-70 text-xs">Completed</div>
        </div>
        <div>
          <div className="text-lg font-semibold text-yellow-600">35</div>
          <div className="opacity-70 text-xs">Incomplete</div>
        </div>
        <div>
          <div className="text-lg font-semibold text-gray-500">35</div>
          <div className="opacity-70 text-xs">Skipped</div>
        </div>
      </div>
    </div>
  );
}



