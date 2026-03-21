export type Transaction = {
  id: string;
  from: string;
  to: string;
  amount: number;
  label?: string;
};

export type SimplifiedTransfer = {
  from: string;
  to: string;
  amount: number;
};

export type TransactionFormState = {
  from: string;
  to: string;
  amount: string;
  label: string;
};

export type ReportEntry = {
  id: string;
  label: string;
  date: string;
  createdAt: string;
  transfers: SimplifiedTransfer[];
  /** Snapshot des virements saisis au moment de la validation (absent sur les anciens reportings). */
  enteredTransactions?: Transaction[];
  /** Snapshot des virements regroupés au moment de la validation (absent sur les anciens reportings). */
  groupedTransfers?: SimplifiedTransfer[];
};

export type ValueEvent = {
  target: {
    value: string;
  };
};

export type ClickEvent = {
  preventDefault: () => void;
  stopPropagation: () => void;
};
