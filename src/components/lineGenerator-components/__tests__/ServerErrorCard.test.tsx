/* eslint-disable import/no-relative-parent-imports */
/* eslint-disable react/jsx-no-bind */

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ServerErrorCard } from '@/components/lineGenerator-components/ServerErrorCard';

describe('ServerErrorCard', () => {
  function noop() {}

  it('renders nothing when server is healthy', () => {
    const { container } = render(<ServerErrorCard isServerHealthy={true} onRetry={noop} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when server health is null', () => {
    const { container } = render(<ServerErrorCard isServerHealthy={null} onRetry={noop} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders error message when server is unhealthy', () => {
    render(<ServerErrorCard isServerHealthy={false} onRetry={noop} />);

    expect(screen.getByText('Server Unavailable')).toBeInTheDocument();
    expect(
      screen.getByText(
        'The line generator service is currently unavailable. Please try again later.'
      )
    ).toBeInTheDocument();

    const retryButton = screen.getByText('Retry Connection');
    expect(retryButton).toBeInTheDocument();

    const card = screen.getByText('Server Unavailable').closest('.border-destructive');
    expect(card).toHaveClass('bg-destructive/10');
  });

  it('calls onRetry when retry button is clicked', () => {
    const mockRetry = vi.fn();
    render(<ServerErrorCard isServerHealthy={false} onRetry={mockRetry} />);

    const retryButton = screen.getByText('Retry Connection');
    fireEvent.click(retryButton);

    expect(mockRetry).toHaveBeenCalledTimes(1);
  });
});
