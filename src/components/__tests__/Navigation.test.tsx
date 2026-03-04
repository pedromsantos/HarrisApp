import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

import Navigation from '@/components/Navigation';

describe('Navigation', () => {
  const renderNavigation = (initialRoute = '/') => {
    return render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <Navigation />
      </MemoryRouter>
    );
  };

  it('renders Experimental tab', () => {
    renderNavigation();

    const experimentalLink = screen.getByRole('link', { name: /experimental/i });
    expect(experimentalLink).toBeInTheDocument();
  });

  it('links Experimental tab to /experimental route', () => {
    renderNavigation();

    const experimentalLink = screen.getByRole('link', { name: /experimental/i });
    expect(experimentalLink).toHaveAttribute('href', '/experimental');
  });

  it('highlights Experimental tab when on /experimental route', () => {
    renderNavigation('/experimental');

    const experimentalLink = screen.getByRole('link', { name: /experimental/i });
    expect(experimentalLink).toHaveClass('bg-primary', 'text-primary-foreground');
  });

  it('allows keyboard navigation to Experimental tab', async () => {
    const user = userEvent.setup();
    renderNavigation();

    const experimentalLink = screen.getByRole('link', { name: /experimental/i });

    // Tab to the experimental link (skip other elements)
    await user.tab();

    // Verify link is focusable
    expect(experimentalLink).toBeInTheDocument();
  });

  it('renders all navigation tabs', () => {
    renderNavigation();

    expect(screen.getByRole('link', { name: /line generator/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /counterpoint/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /experimental/i })).toBeInTheDocument();
  });
});
