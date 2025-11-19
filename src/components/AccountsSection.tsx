import { ValueEvent } from '../types';

type AccountsSectionProps = {
  accounts: string[];
  accountInput: string;
  onAccountInputChange: (event: ValueEvent) => void;
  onAddAccount: () => void;
  accountError: string | null;
};

export const AccountsSection = ({
  accounts,
  accountInput,
  onAccountInputChange,
  onAddAccount,
  accountError,
}: AccountsSectionProps) => (
  <div className="rounded-2xl border border-base-300 bg-base-200 p-6">
    <h2 className="text-xl font-semibold text-base-content">Ajouter un compte</h2>
    <div className="mt-4 flex flex-col gap-3 sm:flex-row">
      <input
        type="text"
        placeholder="Compte (ex. Compte A)"
        className="input input-bordered w-full"
        value={accountInput}
        onChange={onAccountInputChange}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            onAddAccount();
          }
        }}
      />
      <button type="button" className="btn btn-primary" onClick={onAddAccount}>
        Ajouter
      </button>
    </div>
    {accountError ? <p className="mt-2 text-sm text-error">{accountError}</p> : null}

    <div className="mt-4">
      <p className="text-sm font-medium uppercase tracking-wide text-base-content/70">Comptes</p>
      {accounts.length === 0 ? (
        <p className="mt-2 text-sm text-base-content/60">Aucun compte pour le moment.</p>
      ) : (
        <ul className="mt-2 flex flex-wrap gap-2">
          {accounts.map((account) => (
            <li
              key={account}
              className="badge badge-outline border-base-300 bg-base-100 text-base-content"
            >
              {account}
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
);
