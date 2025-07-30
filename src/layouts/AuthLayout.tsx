import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Car } from 'lucide-react';

const AuthLayout: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }
  
  return (
    <div
      className="flex min-h-screen bg-gray-50 relative"
      style={{
        backgroundImage: `url('/src/bg.jpg')`, // Path to the background image
        backgroundSize: 'cover', // Ensures the image covers the entire background
        backgroundPosition: 'center', // Centers the image
        backgroundRepeat: 'no-repeat', // Prevents the image from repeating
      }}
    >
      {/* Text overlay on the left side */}
      <div className="absolute inset-y-0 right-10 flex items-center z-0">
        <h1 className="text-black text-7xl font-extrabold drop-shadow-lg">
          Smart Parking System
        </h1>
      </div>

      {/* Right side - auth form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8  bg-opacity-90 z-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-10 lg:hidden">
            <div className="inline-flex items-center justify-center">
              <Car size={32} className="text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900 ml-3">Smart Parking</h1>
            </div>
          </div>
          
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;