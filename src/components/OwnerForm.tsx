import type { FormEvent } from 'react';
import type { CreateOwnerRequest } from '../services/owners.service';

interface OwnerFormProps {
  error: string | null;
  isSubmitting: boolean;
  onSubmit: (owner: CreateOwnerRequest) => Promise<boolean>;
}

const emptyOwner: CreateOwnerRequest = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
};

export function OwnerForm({ error, isSubmitting, onSubmit }: OwnerFormProps) {
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const wasCreated = await onSubmit({
      firstName: String(formData.get('firstName') ?? '').trim(),
      lastName: String(formData.get('lastName') ?? '').trim(),
      email: String(formData.get('email') ?? '').trim(),
      phone: String(formData.get('phone') ?? '').trim(),
    });

    if (wasCreated) {
      form.reset();
    }
  }

  return (
    <form className="owner-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label>
          <span>First Name</span>
          <input
            autoComplete="given-name"
            defaultValue={emptyOwner.firstName}
            maxLength={120}
            name="firstName"
            required
          />
        </label>
        <label>
          <span>Last Name</span>
          <input
            autoComplete="family-name"
            defaultValue={emptyOwner.lastName}
            maxLength={120}
            name="lastName"
            required
          />
        </label>
        <label>
          <span>Email</span>
          <input
            autoComplete="email"
            defaultValue={emptyOwner.email}
            maxLength={320}
            name="email"
            required
            type="email"
          />
        </label>
        <label>
          <span>Phone</span>
          <input
            autoComplete="tel"
            defaultValue={emptyOwner.phone}
            maxLength={40}
            name="phone"
            required
          />
        </label>
      </div>
      {error ? (
        <p className="form-message form-message-error">{error}</p>
      ) : null}
      <button className="primary-button" disabled={isSubmitting} type="submit">
        {isSubmitting ? 'Creating...' : 'Create Owner'}
      </button>
    </form>
  );
}
