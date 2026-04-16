import React, { useEffect, useState, useMemo } from 'react';
import { fetchIssues } from '../services/api';
import MapView from '../components/MapView';
import NotificationBell from '../components/NotificationBell';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MOCK_ISSUES = [
  { id: 'mock-1', category: 'Electrical', description: 'Streetlight not working near the main gate entrance. Causes safety concerns at night.', status: 'Open', location: { lat: 17.3950, lng: 78.4867, text: 'Main Gate' }, createdAt: '2026-04-10T08:00:00Z', updatedAt: '2026-04-10T08:00:00Z' },
  { id: 'mock-2', category: 'Plumbing', description: 'Water leakage in the second floor washroom. Flooding the corridor.', status: 'In Progress', location: { lat: 17.3855, lng: 78.4880, text: 'Science Block - 2nd Floor' }, createdAt: '2026-04-09T10:30:00Z', updatedAt: '2026-04-12T14:00:00Z' },
  { id: 'mock-3', category: 'Furniture', description: 'Broken chairs in Room 301. Three chairs have missing backrests.', status: 'Closed', location: { lat: 17.3840, lng: 78.4850, text: 'Arts Building - Room 301' }, createdAt: '2026-04-05T09:00:00Z', updatedAt: '2026-04-11T16:45:00Z' },
  { id: 'mock-4', category: 'Cleaning', description: 'Restroom in library basement is not maintained properly.', status: 'Closed', location: { lat: 17.3860, lng: 78.4900, text: 'Central Library - Basement' }, createdAt: '2026-04-01T07:00:00Z', updatedAt: '2026-04-08T12:00:00Z' },
  { id: 'mock-5', category: 'Electrical', description: 'Fan not working in Lecture Hall 2. Students complaining about heat.', status: 'Open', location: { lat: 17.3845, lng: 78.4870, text: 'Lecture Hall 2' }, createdAt: '2026-04-14T11:00:00Z', updatedAt: '2026-04-14T11:00:00Z' },
  { id: 'mock-6', category: 'Network', description: 'Wi-Fi connectivity issues in the hostel common room.', status: 'In Progress', location: { lat: 17.3835, lng: 78.4840, text: 'Hostel Block A - Common Room' }, createdAt: '2026-04-13T15:30:00Z', updatedAt: '2026-04-15T09:00:00Z' },
  { id: 'mock-7', category: 'Electrical', description: 'Power outlet not working in Computer Lab.', status: 'Closed', location: { lat: 17.3842, lng: 78.4860, text: 'Computer Lab' }, createdAt: '2026-04-03T10:00:00Z', updatedAt: '2026-04-10T14:00:00Z' },
];

const COLORS = {
  open: '#ef4444',
  closed: '#22c55e',
  inProgress: '#f59e0b',
  primary: '#3b82f6',
  secondary: '#8b5cf6',
};

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-2xl shadow-md p-5 sm:p-6 transition-all duration-200 hover:shadow-lg border border-gray-100 ${className}`}>
    {children}
  </div>
);

const KPICard = ({ icon, label, value, colorClass, bgClass }) => (
  <Card className="flex flex-col">
    <div className="flex items-center gap-3 mb-4">
      <div className={`p-2.5 rounded-xl ${bgClass}`}>{icon}</div>
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</h3>
    </div>
    <p className={`text-4xl font-extrabold ${colorClass} mt-auto`}>{value}</p>
  </Card>
);

const ChartCard = ({ title, subtitle, children }) => (
  <Card>
    <div className="mb-4">
      <h3 className="text-base font-bold text-gray-800">{title}</h3>
      {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
    </div>
    {children}
  </Card>
);

const Icons = {
  total: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
  open: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
  inProgress: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  closed: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  chart: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 text-white px-3 py-2 rounded-lg text-xs font-medium shadow-lg">
        <p className="text-gray-300">{label}</p>
        <p className="text-white font-bold">{payload[0].value} issues</p>
      </div>
    );
  }
  return null;
};

const formatResolutionTime = (hours) => {
  if (hours == null || isNaN(hours) || hours < 0) return 'N/A';
  if (hours < 1) return `${Math.round(hours * 60)}m`;
  if (hours < 24) return `${hours.toFixed(1)}h`;
  return `${(hours / 24).toFixed(1)}d`;
};

const DashboardAdmin = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadIssues = async () => {
      try {
        const data = await fetchIssues('admin');
        setIssues(Array.isArray(data) && data.length > 0 ? data : MOCK_ISSUES);
      } catch {
        setIssues(MOCK_ISSUES);
      } finally {
        setLoading(false);
      }
    };
    loadIssues();
  }, []);

  const stats = useMemo(() => {
    if (!issues?.length) {
      return { total: 0, open: 0, inProgress: 0, closed: 0, avgHours: null, categories: [], locations: [], pieData: [] };
    }

    const total = issues.length;
    const open = issues.filter(i => i.status === 'Open').length;
    const inProgress = issues.filter(i => i.status === 'In Progress').length;
    const closed = issues.filter(i => i.status === 'Closed').length;

    const categoryCounts = issues.reduce((acc, i) => {
      const cat = i.category || 'Uncategorized';
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {});
    const categories = Object.entries(categoryCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    const locationCounts = issues.reduce((acc, i) => {
      const loc = i.location?.text || 'Unknown';
      acc[loc] = (acc[loc] || 0) + 1;
      return acc;
    }, {});
    const locations = Object.entries(locationCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    const closedIssues = issues.filter(i => i.status === 'Closed' && i.createdAt && i.updatedAt);
    let avgHours = null;
    if (closedIssues.length > 0) {
      const totalHours = closedIssues.reduce((sum, i) => {
        const diff = new Date(i.updatedAt) - new Date(i.createdAt);
        return sum + diff / (1000 * 60 * 60);
      }, 0);
      avgHours = totalHours / closedIssues.length;
    }

    return {
      total,
      open,
      inProgress,
      closed,
      avgHours,
      categories,
      locations,
      pieData: [
        { name: 'Open', value: open, color: COLORS.open },
        { name: 'In Progress', value: inProgress, color: COLORS.inProgress },
        { name: 'Closed', value: closed, color: COLORS.closed },
      ],
    };
  }, [issues]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-12 h-12 border-b-2 border-blue-500 rounded-full animate-spin mb-4" />
        <p className="text-gray-400">Loading dashboard data…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-sm sm:text-base text-gray-500">Analytics overview and system-wide issue management</p>
          </div>
          <NotificationBell userId="admin-user-id" />
        </div>

        <MapView issues={issues} />

        <div className="mt-6 sm:mt-8 space-y-6">
          <div className="flex items-center gap-2">
            <span className="text-blue-600">{Icons.chart}</span>
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">Analytics Overview</h2>
          </div>

          {issues.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-lg font-semibold text-gray-600">No Analytics Data Available</p>
              <p className="text-sm text-gray-400 mt-1">Issues must be reported to generate insights.</p>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <KPICard
                  icon={<span className="text-gray-600">{Icons.total}</span>}
                  label="Total Issues"
                  value={stats.total}
                  colorClass="text-gray-900"
                  bgClass="bg-gray-100"
                />
                <KPICard
                  icon={<span className="text-red-500">{Icons.open}</span>}
                  label="Open"
                  value={stats.open}
                  colorClass="text-red-500"
                  bgClass="bg-red-50"
                />
                <KPICard
                  icon={<span className="text-yellow-500">{Icons.inProgress}</span>}
                  label="In Progress"
                  value={stats.inProgress}
                  colorClass="text-yellow-500"
                  bgClass="bg-yellow-50"
                />
                <KPICard
                  icon={<span className="text-green-500">{Icons.closed}</span>}
                  label="Closed"
                  value={stats.closed}
                  colorClass="text-green-500"
                  bgClass="bg-green-50"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <ChartCard title="Issues by Status" subtitle="Distribution of all issues">
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie
                        data={stats.pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                        stroke="none"
                      >
                        {stats.pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-2">
                    {stats.pieData.map((item, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-xs font-medium text-gray-600">{item.name}: {item.value}</span>
                      </div>
                    ))}
                  </div>
                </ChartCard>

                <ChartCard title="Top Categories" subtitle="Issues grouped by category">
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={stats.categories} layout="vertical" margin={{ left: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                      <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} />
                      <YAxis
                        type="category"
                        dataKey="name"
                        width={90}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#374151', fontSize: 11, fontWeight: 500 }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="count" fill={COLORS.primary} radius={[0, 6, 6, 0]} barSize={18} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>

              <ChartCard title="Top Hotspot Locations" subtitle="Areas with most reported issues">
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={stats.locations} margin={{ left: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#374151', fontSize: 10, fontWeight: 500 }}
                      dy={10}
                      interval={0}
                      angle={-20}
                      textAnchor="end"
                      height={50}
                    />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" fill={COLORS.secondary} radius={[6, 6, 0, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <Card className="flex items-center justify-between p-4 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-50 rounded-xl text-blue-500">{Icons.clock}</div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Avg Resolution Time</p>
                    <p className="text-2xl sm:text-3xl font-extrabold text-blue-600">{formatResolutionTime(stats.avgHours)}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-400 text-right">Based on {issues.filter(i => i.status === 'Closed').length} closed issues</p>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
