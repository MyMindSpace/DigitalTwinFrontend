import React from 'react';
import './index.css';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import { Card, StatCard } from './components/Cards';
import JournalingTable from './components/JournalingTable';
import ProgressGauge from './components/ProgressGauge';
import TasksWidget from './components/TasksWidget';
import CalendarWidget from './components/CalendarWidget';
import { Routes, Route } from 'react-router-dom';
import Therapy from './pages/Therapy';

function DashboardPage() {
  return (
    <main className="px-8 py-6 space-y-8">
      <Topbar title="Dashboard" />
      <div className="text-lg font-semibold opacity-80">Overview</div>
      <section className="grid grid-cols-4 gap-5">
        <StatCard icon="📊" title="Journaling" value="26/30 Days" hint="12% increase from last month" />
        <StatCard icon="🧘" title="Meditation Streak" value="123 Days" hint="Last Streak - 234" />
        <StatCard icon="🗓️" title="Next Therapy Session" value="28 Aug" hint="8% increase from last month" />
        <StatCard icon="👤" title="Mindful Time This Week" value="74 Minutes" hint="2% increase from last week" />
      </section>

      <section className="grid grid-cols-3 gap-5">
        <Card className="col-span-2">
          <JournalingTable />
        </Card>
        <Card>
          <div className="text-lg font-semibold mb-3">Overall Progress</div>
          <ProgressGauge />
        </Card>
      </section>

      <section className="grid grid-cols-3 gap-5">
        <Card>
          <TasksWidget />
        </Card>
        <Card>
          <CalendarWidget />
        </Card>
      </section>
    </main>
  );
}

export default function App() {
  return (
    <div className="min-h-screen grid" style={{ gridTemplateColumns: '256px 1fr' }}>
      <Sidebar />
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/therapy" element={<Therapy />} />
      </Routes>
    </div>
  );
}
