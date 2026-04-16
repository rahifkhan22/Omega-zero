import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = {
  open: '#ef4444',
  closed: '#22c55e',
  inProgress: '#f59e0b',
  primary: '#3b82f6',
  secondary: '#8b5cf6',
};

const ChartIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const TotalIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);

const OpenIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const ClosedIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const EmptyChartIcon = () => (
  <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-2xl shadow-md p-5 transition-all duration-200 hover:shadow-lg border border-gray-100 ${className}`}>
    {children}
  </div>
);

const KPICard = ({ icon, label, value, colorClass, bgClass }) => (
  <Card>
    <div className="flex items-center gap-3 mb-3">
      <div className={`p-2.5 rounded-xl ${bgClass}`}>
        <div className={colorClass}>{icon}</div>
      </div>
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</h3>
    </div>
    <p className={`text-3xl font-extrabold ${colorClass}`}>{value}</p>
  </Card>
);

const ChartCard = ({ title, icon, children }) => (
  <Card>
    <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-100">
      <div className="text-blue-600">{icon}</div>
      <h3 className="text-base font-bold text-gray-800">{title}</h3>
    </div>
    {children}
  </Card>
);

const formatResolutionTime = (hours) => {
  if (hours === null || hours === undefined || isNaN(hours)) return 'N/A';
  if (hours < 1) return `${Math.round(hours * 60)} min`;
  if (hours < 24) return `${hours.toFixed(1)} hrs`;
  return `${(hours / 24).toFixed(1)} days`;
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

const AnalyticsDashboard = ({ issues = [] }) => {
  const stats = useMemo(() => {
    if (!issues || issues.length === 0) {
      return { total: 0, open: 0, closed: 0, avgResolutionHours: null, topCategories: [], topLocations: [], pieData: [] };
    }

    const total = issues.length;
    const open = issues.filter(i => i.status === 'Open').length;
    const inProgress = issues.filter(i => i.status === 'In Progress').length;
    const closed = issues.filter(i => i.status === 'Closed' || i.status === 'Resolved').length;

    const categoryCounts = issues.reduce((acc, issue) => {
      const category = issue.category || 'Uncategorized';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    const topCategories = Object.entries(categoryCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    const locationCounts = issues.reduce((acc, issue) => {
      const location = issue.location?.text || 'Unknown';
      acc[location] = (acc[location] || 0) + 1;
      return acc;
    }, {});

    const topLocations = Object.entries(locationCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    const resolvedIssues = issues.filter(i => (i.status === 'Closed' || i.status === 'Resolved') && i.createdAt && i.updatedAt);
    let avgResolutionHours = null;

    if (resolvedIssues.length > 0) {
      const totalHours = resolvedIssues.reduce((sum, issue) => {
        const created = new Date(issue.createdAt);
        const resolved = new Date(issue.updatedAt);
        const diffMs = resolved - created;
        const diffHours = diffMs / (1000 * 60 * 60);
        return sum + diffHours;
      }, 0);
      avgResolutionHours = totalHours / resolvedIssues.length;
    }

    return {
      total,
      open,
      inProgress,
      closed,
      avgResolutionHours,
      topCategories,
      topLocations,
      pieData: [
        { name: 'Open', value: open, color: COLORS.open },
        { name: 'In Progress', value: inProgress, color: COLORS.inProgress },
        { name: 'Resolved', value: closed, color: COLORS.closed },
      ],
    };
  }, [issues]);

  if (!issues || issues.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-12 border border-gray-100">
        <div className="flex flex-col items-center justify-center text-gray-400">
          <EmptyChartIcon />
          <p className="mt-4 text-lg font-semibold text-gray-600">No Analytics Data Available</p>
          <p className="text-sm text-gray-400 mt-1">Issues must be reported to generate insights.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <div className="text-blue-600"><ChartIcon /></div>
        <h2 className="text-xl font-bold text-gray-800">Analytics Overview</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          icon={<TotalIcon />}
          label="Total Issues"
          value={stats.total}
          colorClass="text-gray-900"
          bgClass="bg-gray-100"
        />
        <KPICard
          icon={<OpenIcon />}
          label="Open Issues"
          value={stats.open}
          colorClass="text-red-500"
          bgClass="bg-red-50"
        />
        <KPICard
          icon={<ClosedIcon />}
          label="Resolved Issues"
          value={stats.closed}
          colorClass="text-green-500"
          bgClass="bg-green-50"
        />
        <KPICard
          icon={<ClockIcon />}
          label="Avg Resolution"
          value={formatResolutionTime(stats.avgResolutionHours)}
          colorClass="text-blue-500"
          bgClass="bg-blue-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Issues by Status" icon={<div className="p-1.5 bg-blue-50 rounded-lg text-blue-600"><PieChartIcon /></div>}>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={stats.pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {stats.pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-4">
            {stats.pieData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs font-medium text-gray-600">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Top Categories" icon={<div className="p-1.5 bg-purple-50 rounded-lg text-purple-600"><BarIcon /></div>}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={stats.topCategories} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} />
              <YAxis type="category" dataKey="name" width={100} axisLine={false} tickLine={false} tick={{ fill: '#374151', fontSize: 12, fontWeight: 500 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill={COLORS.primary} radius={[0, 6, 6, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="Top Hotspot Locations" icon={<div className="p-1.5 bg-green-50 rounded-lg text-green-600"><MapPinIcon /></div>}>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={stats.topLocations} margin={{ left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#374151', fontSize: 11, fontWeight: 500 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" fill={COLORS.secondary} radius={[6, 6, 0, 0]} barSize={32} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
};

const PieChartIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
  </svg>
);

const BarIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const MapPinIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export default AnalyticsDashboard;
