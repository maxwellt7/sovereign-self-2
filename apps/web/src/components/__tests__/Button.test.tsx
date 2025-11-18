import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '../ui/button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button').textContent).toBe('Click me');
  });

  it('applies variant classes', () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('destructive');
  });

  it('can be disabled', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button').hasAttribute('disabled')).toBe(true);
  });
});

