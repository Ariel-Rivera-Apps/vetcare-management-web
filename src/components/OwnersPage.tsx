import { useEffect, useState } from 'react';
import { ApiError } from '../services/api';
import {
  OwnersService,
  type CreateOwnerRequest,
  type Owner,
} from '../services/owners.service';
import { OwnerForm } from './OwnerForm';
import { OwnerList } from './OwnerList';

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError && error.status === 409) {
    return 'An owner with this email already exists.';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Unable to complete the request.';
}

export function OwnersPage() {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function loadOwners() {
    try {
      const response = await OwnersService.listOwners();
      setOwners(response);
      setLoadError(null);
    } catch (error) {
      setLoadError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void Promise.resolve().then(loadOwners);
  }, []);

  async function handleCreateOwner(
    owner: CreateOwnerRequest,
  ): Promise<boolean> {
    setIsSubmitting(true);
    setFormError(null);
    setSuccessMessage(null);

    try {
      const created = await OwnersService.createOwner(owner);
      setOwners((currentOwners) => [created, ...currentOwners]);
      setSuccessMessage('Owner created.');
      return true;
    } catch (error) {
      setFormError(getErrorMessage(error));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="owners-section" aria-labelledby="owners-title">
      <div className="section-header">
        <div>
          <p className="eyebrow">Clients</p>
          <h2 id="owners-title">Owners</h2>
        </div>
        <span className="count-badge">{owners.length}</span>
      </div>
      <OwnerForm
        error={formError}
        isSubmitting={isSubmitting}
        onSubmit={handleCreateOwner}
      />
      {successMessage ? (
        <p className="form-message form-message-success">{successMessage}</p>
      ) : null}
      <OwnerList error={loadError} isLoading={isLoading} owners={owners} />
    </section>
  );
}
