import type { Owner } from '../services/owners.service';

interface OwnerListProps {
  error: string | null;
  isLoading: boolean;
  owners: Owner[];
}

export function OwnerList({ error, isLoading, owners }: OwnerListProps) {
  if (isLoading) {
    return <p className="owners-message">Loading owners...</p>;
  }

  if (error) {
    return <p className="owners-message owners-message-error">{error}</p>;
  }

  if (owners.length === 0) {
    return <p className="owners-message">No owners registered yet.</p>;
  }

  return (
    <div className="owners-table-wrap">
      <table className="owners-table">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Phone</th>
            <th scope="col">Created</th>
          </tr>
        </thead>
        <tbody>
          {owners.map((owner) => (
            <tr key={owner.id}>
              <td>{`${owner.firstName} ${owner.lastName}`}</td>
              <td>{owner.email}</td>
              <td>{owner.phone}</td>
              <td>
                {new Intl.DateTimeFormat(undefined).format(
                  new Date(owner.createdAt),
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
