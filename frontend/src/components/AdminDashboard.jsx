import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">School Name</h1>
          <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-300 transition">
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Welcome to the Admin Dashboard</h2>
          <button
            onClick={() => navigate('/addbus')}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            ➕ Add New Bus
          </button>
        </div>

        {/* Dashboard Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Attendance Dashboard */}
          <div
            onClick={() => navigate('/attendance')}
            className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center justify-center hover:shadow-lg transition-shadow cursor-pointer"
          >
            <svg className="w-12 h-12 text-blue-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Attendance Dashboard</h3>
            <p className="text-gray-600 text-center">View and manage student attendance logs.</p>
          </div>

          {/* Bus Location */}
          <div
            onClick={() => navigate('/buslocation')}
            className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center justify-center hover:shadow-lg transition-shadow cursor-pointer"
          >
            <svg className="w-12 h-12 text-blue-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.243l-4.243-4.243m0 0l-4.243 4.243m4.243-4.243l4.243-4.243m-4.243 4.243l-4.243-4.243m0 0a6 6 0 1112 0 6 6 0 01-12 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Bus Location</h3>
            <p className="text-gray-600 text-center">Track the real-time location of buses.</p>
          </div>

          {/* Student Logs */}
          <div
            onClick={() => navigate('/student-logs')}
            className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center justify-center hover:shadow-lg transition-shadow cursor-pointer"
          >
            <svg className="w-12 h-12 text-blue-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Student Logs</h3>
            <p className="text-gray-600 text-center">View and log individual student records.</p>
          </div>

          {/* Alerts Box */}
          <div
            onClick={() => navigate('/emergencies-overspeeding')}
            className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center justify-center hover:shadow-lg transition-shadow cursor-pointer"
          >
            <svg className="w-12 h-12 text-blue-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M12 4a8 8 0 100 16 8 8 0 000-16z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Alert Notifications</h3>
            <p className="text-gray-600 text-center">Monitor emergencies and overspeeding incidents.</p>
          </div>
          {/* Live Streams Box */}
<div
  onClick={() => navigate('/live-streams')}
  className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center justify-center hover:shadow-lg transition-shadow cursor-pointer"
>
  <svg className="w-12 h-12 text-blue-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A2 2 0 0122 9.618v4.764a2 2 0 01-2.447 1.894L15 14M4 6h8M4 10h8M4 14h4" />
  </svg>
  <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Streams</h3>
  <p className="text-gray-600 text-center">Watch live bus camera footage</p>
</div>

        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
