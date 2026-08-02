import { apiFetch } from './api';

export interface HealthCheckResponse {
  status: string;
  service: string;
  version: string;
  environment: string;
  timestamp: string;
}

export const HealthService = {
  getHealth(): Promise<HealthCheckResponse> {
    return apiFetch<HealthCheckResponse>('/health');
  },
};
