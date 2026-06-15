import type { ErrorFallbackProps } from '@/types/components';
import { Button } from './Button';

export function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div className="error-fallback" role="alert">
      <h2>Algo salió mal</h2>
      <p>{error.message}</p>
      <Button onClick={resetErrorBoundary}>Reintentar</Button>
    </div>
  );
}
