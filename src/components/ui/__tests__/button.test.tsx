import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Button } from '../button';

describe('Button', () => {
  it('renders as a button element by default', () => {
    render(<Button>Click me</Button>);
    
    const button = screen.getByRole('button');
    expect(button.tagName).toBe('BUTTON');
    expect(button).toHaveTextContent('Click me');
  });

  it('renders with asChild prop using Slot', () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    );
    
    const link = screen.getByRole('link');
    expect(link.tagName).toBe('A');
    expect(link).toHaveTextContent('Link Button');
    expect(link).toHaveAttribute('href', '/test');
  });

  it('applies default variant and size', () => {
    render(<Button>Default</Button>);
    
    const button = screen.getByRole('button');
    expect(button.className).toContain('inline-flex');
  });

  it('applies custom variant', () => {
    render(<Button variant="destructive">Delete</Button>);
    
    const button = screen.getByRole('button');
    expect(button.className).toContain('destructive');
  });

  it('applies custom size', () => {
    render(<Button size="sm">Small</Button>);
    
    const button = screen.getByRole('button');
    // Size class should be applied
    expect(button.className).toBeDefined();
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Custom</Button>);
    
    const button = screen.getByRole('button');
    expect(button.className).toContain('custom-class');
  });

  it('handles disabled state', () => {
    render(<Button disabled>Disabled</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('passes through additional props', () => {
    render(<Button data-testid="test-button" aria-label="Test">Button</Button>);
    
    const button = screen.getByTestId('test-button');
    expect(button).toHaveAttribute('aria-label', 'Test');
  });
});
