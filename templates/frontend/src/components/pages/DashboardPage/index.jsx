import DashboardLayout from '../../templates/DashboardLayout';
import StatCard from '../../organisms/StatCard';
import { useAuth } from '../../../hooks/useAuth.js';

const DashboardPage = () => {
  const { user } = useAuth();
  const stats = [
    { title: 'Total Revenue', value: '$45,231.89', change: 20.1, trend: 'up', icon: '💰' },
    { title: 'Subscriptions', value: '+2,350', change: 180.1, trend: 'up', icon: '📈' },
    { title: 'Active Now', value: '+573', change: 19, trend: 'up', icon: '⚡' },
    { title: 'Churn Rate', value: '2.4%', change: 4.1, trend: 'down', icon: '📉' },
  ];

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome back, {user?.name || 'User'}!</h1>
        <p className="text-slate-400">Here's what's happening with your SaaS today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-slate-700 last:border-0">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-slate-700"></div>
                  <div>
                    <p className="text-sm font-medium">New subscription from Client {i}</p>
                    <p className="text-xs text-slate-500">2 hours ago</p>
                  </div>
                </div>
                <div className="text-sm font-bold text-green-400">+$99.00</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl">
          <h2 className="text-xl font-bold mb-4">Workspace Health</h2>
          <div className="flex items-center justify-center h-48 bg-slate-900/50 rounded-lg border border-dashed border-slate-700">
            <p className="text-slate-500">Chart Placeholder</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
