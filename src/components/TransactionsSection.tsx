import { formatAmount } from '../utils/format';
import { Transaction } from '../types';

type TransactionsSectionProps = {
  transactions: Transaction[];
  onRemove: (id: string) => void;
};

export const TransactionsSection = ({ transactions, onRemove }: TransactionsSectionProps) => (
  <div className="rounded-2xl border border-base-300 bg-base-200 p-6">
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-semibold text-base-content">Virements saisis</h2>
      <span className="badge badge-primary badge-outline text-xs">{transactions.length}</span>
    </div>

    {transactions.length === 0 ? (
      <p className="mt-4 text-sm text-base-content/60">
        Ajoutez un virement pour voir la liste détaillée.
      </p>
    ) : (
      <ul className="mt-4 space-y-3 text-sm text-base-content/90">
        {transactions.map((transaction, index) => (
          <li
            key={transaction.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-base-300 bg-base-100 p-3"
          >
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex flex-col gap-1">
                <span className="font-medium text-base-content">
                  #{index + 1} {transaction.from} → {transaction.to}
                </span>
                {transaction.label ? (
                  <span className="text-xs text-base-content/60 italic">{transaction.label}</span>
                ) : null}
              </div>
              <span className="font-semibold text-success">{formatAmount(transaction.amount)}</span>
            </div>
            <button
              type="button"
              className="btn btn-sm btn-outline btn-error"
              onClick={() => onRemove(transaction.id)}
            >
              Retirer
            </button>
          </li>
        ))}
      </ul>
    )}
  </div>
);
