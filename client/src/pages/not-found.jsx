import React from 'react';

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md mx-4 bg-white rounded-lg shadow-md p-6">
        <div className="flex mb-4 gap-2">
          <div className="text-red-500 text-3xl">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900">404 Page Not Found</h1>
        </div>

        <p className="mt-4 text-sm text-gray-600">
          The page you are looking for does not exist.
        </p>
      </div>
    </div>
  );
}