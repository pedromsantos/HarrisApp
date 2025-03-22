/* eslint-disable import/no-relative-parent-imports */
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ErrorCard } from '@/components/lineGenerator-components/ErrorCard';

describe('ErrorCard', () => {
  it('renders nothing when error is null', () => {
    const { container } = render(<ErrorCard error={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when error is empty string', () => {
    const { container } = render(<ErrorCard error="" />);
    expect(container.firstChild).toBeNull();
  });

  it('renders error message when error is present', () => {
    const errorMessage = 'Test error message';
    render(<ErrorCard error={errorMessage} />);

    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();

    const card = screen.getByText('Error').closest('.border-destructive');
    expect(card).toHaveClass('bg-destructive/10');
  });
});
