import { useState } from 'react';
import { formatAmount } from '../utils/format';
import { ClickEvent, ReportEntry } from '../types';

type ReportsSectionProps = {
  reports: ReportEntry[];
  onRemove: (id: string) => void;
};

export const ReportsSection = ({ reports, onRemove }: ReportsSectionProps) => {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="rounded-2xl border border-base-300 bg-base-200 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-base-content">Reportings</h2>
        <span className="badge badge-outline text-xs text-base-content/70">{reports.length}</span>
      </div>
      {reports.length === 0 ? (
        <p className="mt-4 text-sm text-base-content/60">
          Validez un résumé pour constituer un historique des flux simplifiés.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {reports.map((report) => {
            const createdLabel = new Intl.DateTimeFormat('fr-FR', {
              dateStyle: 'medium',
              timeStyle: 'short',
            }).format(new Date(report.createdAt));
            const isOpen = openId === report.id;

            return (
              <div
                key={report.id}
                className={`collapse collapse-arrow border border-base-300 bg-base-100 ${
                  isOpen ? 'collapse-open' : ''
                }`}
              >
                <div
                  className="collapse-title flex cursor-pointer flex-col gap-2 text-base-content sm:flex-row sm:items-center sm:justify-between"
                  onClick={() => toggle(report.id)}
                >
                  <div className="flex flex-col">
                    <span className="text-base font-semibold capitalize">
                      Report du {report.label}
                    </span>
                    <span className="text-xs text-base-content/70">Saisi le {createdLabel}</span>
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline btn-error btn-sm"
                    onClick={(event: ClickEvent) => {
                      event.preventDefault();
                      event.stopPropagation();
                      onRemove(report.id);
                    }}
                  >
                    Retirer
                  </button>
                </div>
                <div
                  className="collapse-content text-sm text-base-content/90"
                  onClick={(event) => event.stopPropagation()}
                >
                  <ul className="space-y-2">
                    {report.transfers.map((transfer) => (
                      <li
                        key={`${report.id}-${transfer.from}->${transfer.to}`}
                        className="flex items-center justify-between rounded-lg border border-base-300 bg-base-200 px-3 py-2"
                      >
                        <span>
                          {transfer.from} → {transfer.to}
                        </span>
                        <span className="font-semibold text-warning">
                          {formatAmount(transfer.amount)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  {report.transfers.length > 0 && (
                    <div className="mt-3 flex items-center justify-between rounded-lg border-2 border-warning bg-base-200 px-3 py-2 font-semibold text-base-content">
                      <span>Total</span>
                      <span className="text-warning">
                        {formatAmount(report.transfers.reduce((sum, transfer) => sum + transfer.amount, 0))}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
