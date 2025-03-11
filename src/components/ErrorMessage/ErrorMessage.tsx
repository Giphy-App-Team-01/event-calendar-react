import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorMessageProps {
  error: { message?: string } | null;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-teal-300 flex items-center justify-center p-8">
      <div className="card w-full max-w-md shadow-2xl bg-white/90">
        <div className="card-body items-center text-center text-gray-800">
          <AlertTriangle className="h-16 w-16 text-error mb-4" />
          <h2 className="card-title text-3xl text-error mb-2">
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
