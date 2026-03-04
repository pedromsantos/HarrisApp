import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { StandardCard } from '@/components/experimental/StandardCard';
import { useStandards } from '@/hooks/useStandards';

export function StandardsLibraryPage(): React.ReactElement {
  const { standards, error, isLoading, refetch } = useStandards();
  const navigate = useNavigate();

  const handleCardClick = useCallback(
    (id: string) => {
      void navigate(`/experimental/standards/${id}`);
    },
    [navigate]
  );

  const handleRetry = useCallback(() => {
    void refetch();
  }, [refetch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">Loading standards...</p>
      </div>
    );
  }

  if (error !== null && error !== '') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-lg text-red-600">{error}</p>
        <button onClick={handleRetry} className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          Retry
        </button>
      </div>
    );
  }

  if (!standards || standards.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">No standards available</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Jazz Standards Library</h1>
      <div data-testid="standards-grid" className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {standards.map((standard) => (
          <StandardCard key={standard.id} standard={standard} onClick={handleCardClick} />
        ))}
      </div>
    </div>
  );
}
