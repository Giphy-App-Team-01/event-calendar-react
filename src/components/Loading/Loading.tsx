import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingProps {
  type?: 'event' | 'default';
}

const Loading: React.FC<LoadingProps> = ({ type = 'default' }) => {
  if (type === 'event') {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="flex flex-col items-center space-y-6">
          <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
          <p className="text-2xl font-semibold text-blue-500 animate-pulse">
            Loading event...
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-teal-300 flex items-center justify-center p-8">
      <div className="flex flex-col items-center space-y-6">
        <Loader2 className="w-16 h-16 text-white animate-spin" />
        <p className="text-2xl font-semibold text-white animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
};

export default Loading;
