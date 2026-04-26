import { useState } from 'react';
import { formatAmount } from '../utils/format';
import { ClickEvent, ReportEntry } from '../types';

type ReportsSectionProps = {
  reports: ReportEntry[];
  onRemove: (id: string) => void;
  onEdit: (report: ReportEntry) => void;
};

const exportReportToCsv = (report: ReportEntry) => {
  const sep = ';';
  const lines: string[] = [];

  const createdLabel = new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(report.createdAt));

  lines.push(`Report du ${report.label}`);
  lines.push(`Saisi le ${createdLabel}`);
  lines.push('');

  if (report.enteredTransactions && report.enteredTransactions.length > 0) {
    lines.push('Virements saisis');
    lines.push(['De', 'Vers', 'Montant', 'Libellé'].join(sep));
    for (const t of report.enteredTransactions) {
      lines.push([t.from, t.to, t.amount, t.label ?? ''].join(sep));
    }
    lines.push('');
  }

  if (report.groupedTransfers && report.groupedTransfers.length > 0) {
    lines.push('Virements regroupés');
    lines.push(['De', 'Vers', 'Montant'].join(sep));
    for (const t of report.groupedTransfers) {
      lines.push([t.from, t.to, t.amount].join(sep));
    }
    const total = report.groupedTransfers.reduce((s, t) => s + t.amount, 0);
    lines.push(['Total', '', total].join(sep));
    lines.push('');
  }

  if (report.transfers.length > 0) {
    lines.push('Résumé simplifié');
    lines.push(['De', 'Vers', 'Montant'].join(sep));
    for (const t of report.transfers) {
      lines.push([t.from, t.to, t.amount].join(sep));
    }
    const total = report.transfers.reduce((s, t) => s + t.amount, 0);
    lines.push(['Total', '', total].join(sep));
  }

  const bom = '\uFEFF';
  const blob = new Blob([bom + lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `report-${report.date}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

export const ReportsSection = ({ reports, onRemove, onEdit }: ReportsSectionProps) => {
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
                  <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      className="btn btn-outline btn-info btn-sm"
                      onClick={(event: ClickEvent) => {
                        event.preventDefault();
                        event.stopPropagation();
                        exportReportToCsv(report);
                      }}
                    >
                      Exporter CSV
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline btn-warning btn-sm"
                      onClick={(event: ClickEvent) => {
                        event.preventDefault();
                        event.stopPropagation();
                        onEdit(report);
                      }}
                    >
                      Modifier
                    </button>
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
                </div>
                <div
                  className="collapse-content text-sm text-base-content/90"
                  onClick={(event) => event.stopPropagation()}
                >
                  {report.enteredTransactions && report.enteredTransactions.length > 0 ? (
                    <div className="mb-6">
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="text-base font-semibold text-base-content">Virements saisis</h3>
                        <span className="badge badge-primary badge-outline text-xs">
                          {report.enteredTransactions.length}
                        </span>
                      </div>
                      <ul className="space-y-2">
                        {report.enteredTransactions.map((transaction, index) => (
                          <li
                            key={transaction.id}
                            className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-base-300 bg-base-200 px-3 py-2"
                          >
                            <div className="flex flex-col gap-0.5">
                              <span className="font-medium text-base-content">
                                #{index + 1} {transaction.from} → {transaction.to}
                              </span>
                              {transaction.label ? (
                                <span className="text-xs italic text-base-content/60">{transaction.label}</span>
                              ) : null}
                            </div>
                            <span className="font-semibold text-success">{formatAmount(transaction.amount)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {report.groupedTransfers && report.groupedTransfers.length > 0 ? (
                    <div className="mb-6">
                      <h3 className="mb-2 text-base font-semibold text-base-content">Virements regroupés</h3>
                      <ul className="space-y-2">
                        {report.groupedTransfers.map((transfer) => (
                          <li
                            key={`${report.id}-grp-${transfer.from}->${transfer.to}`}
                            className="flex items-center justify-between rounded-lg border border-base-300 bg-base-200 px-3 py-2"
                          >
                            <span>
                              {transfer.from} → {transfer.to}
                            </span>
                            <span className="font-semibold text-info">{formatAmount(transfer.amount)}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-2 flex items-center justify-between rounded-lg border-2 border-info bg-base-200 px-3 py-2 font-semibold text-base-content">
                        <span>Total</span>
                        <span className="text-info">
                          {formatAmount(
                            report.groupedTransfers.reduce((sum, transfer) => sum + transfer.amount, 0),
                          )}
                        </span>
                      </div>
                    </div>
                  ) : null}

                  <div>
                    {report.enteredTransactions?.length || report.groupedTransfers?.length ? (
                      <h3 className="mb-2 text-base font-semibold text-base-content">Résumé simplifié</h3>
                    ) : null}
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
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
