import { formatAmount } from '../utils/format';
import { SimplifiedTransfer, ValueEvent } from '../types';

type SummarySectionProps = {
  hasTransactions: boolean;
  simplifiedTransfers: SimplifiedTransfer[];
  reportDate: string;
  onReportDateChange: (event: ValueEvent) => void;
  onValidate: () => void;
  reportError: string | null;
};

export const SummarySection = ({
  hasTransactions,
  simplifiedTransfers,
  reportDate,
  onReportDateChange,
  onValidate,
  reportError,
}: SummarySectionProps) => (
  <div className="rounded-2xl border border-base-300 bg-base-200 p-6">
    <h2 className="text-xl font-semibold text-base-content">Résumé simplifié</h2>
    <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-end">
      <label className="form-control w-full md:w-64">
        <div className="label">
          <span className="label-text text-base-content/70">Date du reporting</span>
        </div>
        <input
          type="date"
          className="input input-bordered w-full"
          value={reportDate}
          max={new Date().toISOString().split('T')[0]}
          onChange={onReportDateChange}
        />
      </label>
      <button
        type="button"
        className="btn btn-primary"
        onClick={onValidate}
        disabled={simplifiedTransfers.length === 0 || !reportDate}
      >
        Valider le résumé
      </button>
    </div>
    {reportError ? <p className="mt-2 text-sm text-error">{reportError}</p> : null}
    {!hasTransactions ? (
      <p className="mt-4 text-sm text-base-content/60">
        Ajoutez des virements pour calculer automatiquement le résumé des flux.
      </p>
    ) : simplifiedTransfers.length === 0 ? (
      <p className="mt-4 text-sm text-base-content/70">
        Tous les comptes sont équilibrés, aucun flux net à afficher.
      </p>
    ) : (
      <>
        <ul className="mt-4 space-y-3 text-sm text-base-content/90">
          {simplifiedTransfers.map((transfer) => (
            <li
              key={`${transfer.from}->${transfer.to}`}
              className="flex items-center justify-between rounded-xl border border-base-300 bg-base-100 p-3"
            >
              <span>
                {transfer.from} → {transfer.to}
              </span>
              <span className="font-semibold text-warning">{formatAmount(transfer.amount)}</span>
            </li>
          ))}
        </ul>
        {simplifiedTransfers.length > 0 && (
          <div className="mt-4 flex items-center justify-between rounded-xl border-2 border-warning bg-base-100 p-3 font-semibold text-base-content">
            <span>Total</span>
            <span className="text-warning">
              {formatAmount(simplifiedTransfers.reduce((sum, transfer) => sum + transfer.amount, 0))}
            </span>
          </div>
        )}
      </>
    )}
  </div>
);
