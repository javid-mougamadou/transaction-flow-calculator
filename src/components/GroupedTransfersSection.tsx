import { formatAmount } from '../utils/format';
import { SimplifiedTransfer } from '../types';

type GroupedTransfersSectionProps = {
  hasTransactions: boolean;
  groupedTransfers: SimplifiedTransfer[];
};

export const GroupedTransfersSection = ({
  hasTransactions,
  groupedTransfers,
}: GroupedTransfersSectionProps) => (
  <div className="rounded-2xl border border-base-300 bg-base-200 p-6">
    <h2 className="text-xl font-semibold text-base-content">Virements regroupés</h2>
    {!hasTransactions ? (
      <p className="mt-4 text-sm text-base-content/60">
        Les regroupements apparaîtront lorsque des virements seront ajoutés.
      </p>
    ) : (
      <ul className="mt-4 space-y-3 text-sm text-base-content/90">
        {groupedTransfers.map((transfer) => (
          <li
            key={`${transfer.from}->${transfer.to}`}
            className="flex items-center justify-between rounded-xl border border-base-300 bg-base-100 p-3"
          >
            <span>
              {transfer.from} → {transfer.to}
            </span>
            <span className="font-semibold text-info">{formatAmount(transfer.amount)}</span>
          </li>
        ))}
      </ul>
    )}
  </div>
);
