import { apiFetch } from './api';

export interface Owner {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOwnerRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export const OwnersService = {
  listOwners(): Promise<Owner[]> {
    return apiFetch<Owner[]>('/owners');
  },

  createOwner(owner: CreateOwnerRequest): Promise<Owner> {
    return apiFetch<Owner>('/owners', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(owner),
    });
  },
};
