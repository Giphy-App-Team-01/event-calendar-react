import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="border border-gray-200 shadow-xl rounded-lg p-12 max-w-lg w-full text-center">
        <h1 className="text-7xl font-extrabold text-gray-800">404</h1>
        <p className="mt-6 text-3xl text-gray-600">Page Not Found</p>
        <p className="mt-4 text-xl text-gray-500">
          The page you're looking for doesn't exist.
        </p>
        <button
          onClick={() => navigate('/')}
          className="mt-8 inline-flex items-center px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md transition"
        >
          <ArrowLeft className="w-6 h-6 mr-3" />
          Go Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
