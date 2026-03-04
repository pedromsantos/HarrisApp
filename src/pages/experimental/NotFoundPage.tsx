import React from 'react';
import { Link } from 'react-router-dom';

export function NotFoundPage(): React.ReactElement {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <div className="mb-6 text-center">
          <h1 className="mb-2 text-4xl font-bold text-gray-900">404</h1>
          <p className="text-lg text-gray-700">Standard not found</p>
        </div>

        <div className="text-center">
          <p className="mb-6 text-sm text-gray-600">
            The standard you are looking for does not exist or has been removed.
          </p>

          <Link
            to="/experimental"
            className="inline-block rounded-md bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Return to Library
          </Link>
        </div>
      </div>
    </div>
  );
}
