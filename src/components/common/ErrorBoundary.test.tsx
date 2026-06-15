import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

function BrokenComponent(): never {
  throw new Error('Component crashed');
}

describe('ErrorBoundary', () => {
  it('renders fallback when a child throws', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    render(
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>,
    );

    expect(screen.getByRole('alert')).toHaveTextContent('Algo salió mal');
    expect(screen.getByRole('button', { name: /reintentar/i })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /reintentar/i }));

    consoleError.mockRestore();
  });
});
