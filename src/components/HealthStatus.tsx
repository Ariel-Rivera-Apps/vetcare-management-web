import { useEffect, useState } from 'react';
import {
  HealthService,
  type HealthCheckResponse,
} from '../services/health.service';

export function HealthStatus() {
  const [health, setHealth] = useState<HealthCheckResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadHealth() {
      try {
        const response = await HealthService.getHealth();

        if (isMounted) {
          setHealth(response);
          setError(null);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : 'Unable to load API health.',
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadHealth();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return <p className="health-message">Loading health check...</p>;
  }

  if (error) {
    return <p className="health-message health-message-error">{error}</p>;
  }

  if (!health) {
    return <p className="health-message">No health data available.</p>;
  }

  return (
    <dl className="health-grid">
      <div>
        <dt>Status</dt>
        <dd>{health.status}</dd>
      </div>
      <div>
        <dt>Environment</dt>
        <dd>{health.environment}</dd>
      </div>
      <div>
        <dt>Timestamp</dt>
        <dd>{health.timestamp}</dd>
      </div>
      <div>
        <dt>Version</dt>
        <dd>{health.version}</dd>
      </div>
    </dl>
  );
}
