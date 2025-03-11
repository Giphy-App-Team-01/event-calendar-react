import React from 'react';
import { Loader2 } from 'lucide-react';

const Loading: React.FC = () => {
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
