import React from 'react';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

interface ErrorMessageProps {
  error: { message?: string } | null;
  type?: 'default' | 'event';
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  error,
  type = 'default',
}) => {
  if (type === 'event') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <AlertTriangle className="w-20 h-20 text-red-500" />
        <h2 className="mt-4 text-4xl font-bold text-gray-800">
          Event Not Found
        </h2>
        <p className="mt-2 text-xl text-gray-600">
          {error?.message || "We couldn't find the event you're looking for."}
        </p>
        <button
          onClick={() => window.history.back()}
          className="mt-6 flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md shadow transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5" /> Go Back
        </button>
      </div>
    );
  }

  // default error view
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="card w-full max-w-md shadow-2xl bg-white/90">
        <div className="card-body items-center text-center text-gray-800">
          <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
          <h2 className="card-title text-3xl text-red-500 mb-2">
            Oops! Something went wrong.
          </h2>
          <p className="text-base">
            {error?.message ||
              'An unexpected error occurred. Please try again later.'}
          </p>
          <div className="card-actions mt-6">
            <button
              className="btn btn-primary"
              onClick={() => window.location.reload()}
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
