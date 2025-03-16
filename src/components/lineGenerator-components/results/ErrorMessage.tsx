import React from 'react';

interface ErrorMessageProps {
  error: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
  if (!error) return null;

  return (
    <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-4" role="alert">
      <p>{error}</p>
    </div>
  );
};
