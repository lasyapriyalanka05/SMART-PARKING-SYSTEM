import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { parkingService, bookingService } from '../services/api';
import { Car, CheckCircle, Clock, Calendar, MapPin } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [parkingStats, setParkingStats] = useState({
    total: 0,
    empty: 0,
    booked: 0,
    occupied: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const parkingResponse = await parkingService.getAllSlots();
        const slots = parkingResponse.data;

        const stats = {
          total: slots.length,
          empty: slots.filter((slot) => slot.status === 'empty').length,
          booked: slots.filter((slot) => slot.status === 'booked').length,
          occupied: slots.filter((slot) => slot.status === 'occupied').length,
        };

        setParkingStats(stats);

        const bookingsResponse = await bookingService.getUserBookings({ limit: 5 });
        setRecentBookings(bookingsResponse.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div
      className="p-6 max-w-6xl mx-auto"
      style={{
        background: 'linear-gradient(to bottom, #f0f4ff, #e0e7ff)', // Soft gradient background
        minHeight: '100vh',
      }}
    >
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Welcome, {user?.name}!</h1>
        <p className="text-gray-600 mt-1">Find and book parking spaces with ease.</p>
      </header>

      {/* Dashboard stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg shadow-md p-6 flex items-center hover:shadow-lg transition-shadow">
          <div className="rounded-full bg-white bg-opacity-20 p-3 mr-4">
            <Car size={24} className="text-white" />
          </div>
          <div>
            <div className="text-sm font-medium">Total Slots</div>
            <div className="text-2xl font-semibold">{parkingStats.total}</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg shadow-md p-6 flex items-center hover:shadow-lg transition-shadow">
          <div className="rounded-full bg-white bg-opacity-20 p-3 mr-4">
            <CheckCircle size={24} className="text-white" />
          </div>
          <div>
            <div className="text-sm font-medium">Available</div>
            <div className="text-2xl font-semibold">{parkingStats.empty}</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-500 to-amber-700 text-white rounded-lg shadow-md p-6 flex items-center hover:shadow-lg transition-shadow">
          <div className="rounded-full bg-white bg-opacity-20 p-3 mr-4">
            <Clock size={24} className="text-white" />
          </div>
          <div>
            <div className="text-sm font-medium">Booked</div>
            <div className="text-2xl font-semibold">{parkingStats.booked}</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-red-700 text-white rounded-lg shadow-md p-6 flex items-center hover:shadow-lg transition-shadow">
          <div className="rounded-full bg-white bg-opacity-20 p-3 mr-4">
            <Car size={24} className="text-white" />
          </div>
          <div>
            <div className="text-sm font-medium">Occupied</div>
            <div className="text-2xl font-semibold">{parkingStats.occupied}</div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/parking"
            className="bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="font-medium mb-2">Find Parking</h3>
            <p className="text-sm">View available spaces and book your spot</p>
          </Link>

          <Link
            to="/bookings"
            className="bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="font-medium mb-2">My Bookings</h3>
            <p className="text-sm">View and manage your current bookings</p>
          </Link>

          <Link
            to="/profile"
            className="bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="font-medium mb-2">Profile</h3>
            <p className="text-sm">Update your details and manage vehicles</p>
          </Link>
        </div>
      </div>

      {/* Recent bookings */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-800">Recent Bookings</h2>
          <Link to="/bookings" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View all
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {recentBookings.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {recentBookings.map((booking: any) => (
                <div key={booking._id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          booking.status === 'active'
                            ? 'bg-blue-100 text-blue-600'
                            : booking.status === 'completed'
                            ? 'bg-green-100 text-green-600'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        <Car size={20} />
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-gray-800">
                          Parking Slot {booking.parkingSlot.slotNumber}
                        </div>
                        <div className="text-sm text-gray-500">
                          <span className="inline-flex items-center mr-3">
                            <Calendar size={14} className="mr-1" />
                            {new Date(booking.startTime).toLocaleDateString()}
                          </span>
                          <span className="inline-flex items-center">
                            <MapPin size={14} className="mr-1" />
                            Floor {booking.parkingSlot.floor}, Section {booking.parkingSlot.section}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <span
                        className={`badge ${
                          booking.status === 'active'
                            ? 'badge-active'
                            : booking.status === 'completed'
                            ? 'badge-completed'
                            : 'badge-cancelled'
                        }`}
                      >
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <Calendar size={28} className="text-gray-400" />
              </div>
              <h3 className="text-gray-800 font-medium mb-1">No bookings yet</h3>
              <p className="text-gray-500 text-sm mb-4">You haven't made any bookings yet.</p>
              <Link to="/parking" className="btn btn-primary">
                Book a Parking Slot
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;