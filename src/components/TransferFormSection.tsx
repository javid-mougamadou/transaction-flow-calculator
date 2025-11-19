import { TransactionFormState, ValueEvent } from '../types';

type TransferFormSectionProps = {
  accounts: string[];
  form: TransactionFormState;
  onChange: (field: keyof TransactionFormState, value: string) => void;
  onSubmit: () => void;
  transactionError: string | null;
};

export const TransferFormSection = ({
  accounts,
  form,
  onChange,
  onSubmit,
  transactionError,
}: TransferFormSectionProps) => (
  <form
    className="rounded-2xl border border-base-300 bg-base-200 p-6"
    onSubmit={(event: { preventDefault: () => void }) => {
      event.preventDefault();
      onSubmit();
    }}
  >
    <h2 className="text-xl font-semibold text-base-content">Ajouter un virement</h2>
    <div className="mt-4 grid gap-4 sm:grid-cols-3">
      <select
        className="select select-bordered w-full"
        value={form.from}
        onChange={(event: ValueEvent) => onChange('from', event.target.value)}
      >
        <option value="">Compte émetteur</option>
        {accounts.map((account) => (
          <option key={`from-${account}`} value={account}>
            {account}
          </option>
        ))}
      </select>
      <select
        className="select select-bordered w-full"
        value={form.to}
        onChange={(event: ValueEvent) => onChange('to', event.target.value)}
      >
        <option value="">Compte destinataire</option>
        {accounts.map((account) => (
          <option key={`to-${account}`} value={account}>
            {account}
          </option>
        ))}
      </select>
      <input
        type="number"
        min="1"
        step="1"
        placeholder="Montant"
        className="input input-bordered w-full"
        value={form.amount}
        onChange={(event: ValueEvent) => onChange('amount', event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            onSubmit();
          }
        }}
      />
    </div>
    <div className="mt-4">
      <input
        type="text"
        placeholder="Label (optionnel)"
        className="input input-bordered w-full"
        value={form.label}
        onChange={(event: ValueEvent) => onChange('label', event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            onSubmit();
          }
        }}
      />
    </div>
    {transactionError ? <p className="mt-2 text-sm text-error">{transactionError}</p> : null}
    <button
      type="submit"
      className="btn btn-accent mt-4 w-full sm:w-auto"
      disabled={accounts.length < 2}
    >
      Ajouter le virement
    </button>
    {accounts.length < 2 ? (
      <p className="mt-2 text-xs text-base-content/60">
        Ajoutez au moins deux comptes pour créer un virement.
      </p>
    ) : null}
  </form>
);
