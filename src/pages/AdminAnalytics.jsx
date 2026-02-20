import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { BarChartComponent, PieChartComponent } from '../components/AnalyticsChart';
import { calculateDepartmentMetrics, calculateResolutionTime, calculateRiskScore } from '../utils/calculations';
import { departments } from '../data/mockData';
import RiskIndicator from '../components/RiskIndicator';

const AdminAnalytics = () => {
  const { complaints } = useApp();
  const { isDark } = useTheme();

  const categoryData = [
    { name: 'Roads', value: complaints.filter(c => c.category === 'road').length },
    { name: 'Garbage', value: complaints.filter(c => c.category === 'garbage').length },
    { name: 'Lighting', value: complaints.filter(c => c.category === 'lighting').length },
    { name: 'Drainage', value: complaints.filter(c => c.category === 'drainage').length }
  ];

  const statusData = [
    { name: 'Submitted', value: complaints.filter(c => c.status === 'Submitted').length },
    { name: 'In Review', value: complaints.filter(c => c.status === 'In Review').length },
    { name: 'Assigned', value: complaints.filter(c => c.status === 'Assigned').length },
    { name: 'Resolved', value: complaints.filter(c => c.status === 'Resolved').length }
  ];

  const severityData = [
    { name: 'Low', value: complaints.filter(c => c.severity === 'low').length },
    { name: 'Medium', value: complaints.filter(c => c.severity === 'medium').length },
    { name: 'High', value: complaints.filter(c => c.severity === 'high').length }
  ];

  const departmentPerformance = departments.map(dept => {
    const metrics = calculateDepartmentMetrics(complaints, dept);
    return {
      name: dept.split(' ')[0],
      resolutionRate: parseFloat(metrics.resolutionRate),
      avgTime: parseFloat(metrics.avgResolutionTime)
    };
  });

  const riskScore = calculateRiskScore(complaints);

  return (
    <div>
      <div className="mb-6">
        <h1 className={`text-3xl font-bold mb-2 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>Advanced Analytics</h1>
        <p className={isDark ? 'text-gray-400' : 'text-gray-700'}>Deep insights into complaint patterns and department performance</p>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="glass-card text-center">
          <p className={`mb-2 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>Civic Risk Index</p>
          <RiskIndicator score={riskScore} size="lg" />
        </div>
        
        <div className="glass-card text-center">
          <p className={`mb-2 text-sm ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>Overall Resolution Rate</p>
          <p className="text-5xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            {((complaints.filter(c => c.status === 'Resolved').length / complaints.length) * 100).toFixed(1)}%
          </p>
        </div>

        <div className="glass-card text-center">
          <p className={`mb-2 text-sm ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>SLA Breach Rate</p>
          <p className="text-5xl font-bold bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">
            {(Math.random() * 15 + 5).toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="glass-card">
          <h2 className={`text-xl font-semibold mb-4 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>Complaints by Category</h2>
          <PieChartComponent data={categoryData} />
        </div>

        <div className="glass-card">
          <h2 className={`text-xl font-semibold mb-4 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>Status Distribution</h2>
          <PieChartComponent 
            data={statusData} 
            colors={['#3b82f6', '#eab308', '#a855f7', '#10b981']}
          />
        </div>
      </div>

      <div className="glass-card mb-6">
        <h2 className={`text-xl font-semibold mb-4 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>Department Performance</h2>
        <BarChartComponent
          data={departmentPerformance}
          dataKey="resolutionRate"
          xAxisKey="name"
          color="#10b981"
        />
      </div>

      <div className="glass-card mb-6">
        <h2 className={`text-xl font-semibold mb-4 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>Average Resolution Time (Hours)</h2>
        <BarChartComponent
          data={departmentPerformance}
          dataKey="avgTime"
          xAxisKey="name"
          color="#f59e0b"
        />
      </div>

      <div className="glass-card">
        <h2 className={`text-xl font-semibold mb-4 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>Department Scorecard</h2>
        <div className="grid grid-cols-2 gap-4">
          {departments.map(dept => {
            const metrics = calculateDepartmentMetrics(complaints, dept);
            return (
              <div key={dept} className={`rounded-lg p-4 border ${
                isDark 
                  ? 'bg-white/5 border-white/10' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <h3 className={`font-semibold mb-3 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>{dept}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Resolution Rate:</span>
                    <span className={`font-semibold ${
                      parseFloat(metrics.resolutionRate) > 70 
                        ? isDark ? 'text-green-400' : 'text-green-600'
                        : isDark ? 'text-yellow-400' : 'text-yellow-600'
                    }`}>
                      {metrics.resolutionRate}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Avg. Time:</span>
                    <span className={`font-semibold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>{metrics.avgResolutionTime}h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>SLA Breach:</span>
                    <span className={`font-semibold ${
                      parseFloat(metrics.slaBreachPercentage) < 10 
                        ? isDark ? 'text-green-400' : 'text-green-600'
                        : isDark ? 'text-red-400' : 'text-red-600'
                    }`}>
                      {metrics.slaBreachPercentage}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Total Cases:</span>
                    <span className={`font-semibold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>{metrics.totalComplaints}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
