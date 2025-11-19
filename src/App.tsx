import { useEffect, useMemo, useState } from 'react';
import {
  HeaderSection,
  AccountsSection,
  TransferFormSection,
  TransactionsSection,
  GroupedTransfersSection,
  SummarySection,
  ReportsSection,
  AppFooter,
} from './components';
import { usePersistentState } from './hooks/usePersistentState';
import {
  ReportEntry,
  SimplifiedTransfer,
  Transaction,
  TransactionFormState,
  ValueEvent,
} from './types';
import { groupTransactions, simplifyTransactions } from './utils/transactions';
import { generateId } from './utils/id';

const App = () => {
  const [accounts, setAccounts, resetAccounts] = usePersistentState<string[]>({
    key: 'fluxcalc.accounts-v1',
    defaultValue: [],
  });
  const [accountInput, setAccountInput] = usePersistentState<string>({
    key: 'fluxcalc.accountInput-v1',
    defaultValue: '',
  });
  const [transactions, setTransactions, resetTransactions] = usePersistentState<Transaction[]>({
    key: 'fluxcalc.transactions-v1',
    defaultValue: [],
  });
  const [reports, setReports] = usePersistentState<ReportEntry[]>({
    key: 'fluxcalc.reports-v1',
    defaultValue: [],
  });
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const [transactionForm, setTransactionForm, resetTransactionForm] =
    usePersistentState<TransactionFormState>({
      key: 'fluxcalc.transactionForm-v1',
      defaultValue: {
        from: '',
        to: '',
        amount: '',
        label: '',
      },
    });
  const [accountError, setAccountError] = useState<string | null>(null);
  const [transactionError, setTransactionError] = useState<string | null>(null);
  const [reportDate, setReportDate] = usePersistentState<string>({
    key: 'fluxcalc.reportDate-v1',
    defaultValue: new Date().toISOString().split('T')[0],
  });
  const [reportError, setReportError] = useState<string | null>(null);
  const [theme, setTheme] = usePersistentState<'light' | 'dark'>({
    key: 'fluxcalc.theme-v1',
    defaultValue: 'dark',
  });

  const simplifiedTransfers = useMemo<SimplifiedTransfer[]>(
    () => simplifyTransactions(transactions),
    [transactions],
  );
  const groupedTransactions = useMemo<SimplifiedTransfer[]>(
    () => groupTransactions(transactions),
    [transactions],
  );

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  const handleAccountInputChange = (event: ValueEvent) => {
    setAccountInput(event.target.value);
    setAccountError(null);
  };

  const handleAddAccount = () => {
    const trimmed = accountInput.trim();
    if (!trimmed) {
      setAccountError('Le nom du compte est requis.');
      return;
    }

    if (accounts.some((account: string) => account.toLowerCase() === trimmed.toLowerCase())) {
      setAccountError('Ce compte existe déjà.');
      return;
    }

    const updatedAccounts = [...accounts, trimmed];
    setAccounts(updatedAccounts);
    setAccountInput('');
    setAccountError(null);

    if (!transactionForm.from) {
      setTransactionForm((prevState: TransactionFormState) => ({ ...prevState, from: trimmed }));
    } else if (!transactionForm.to && transactionForm.from !== trimmed) {
      setTransactionForm((prevState: TransactionFormState) => ({ ...prevState, to: trimmed }));
    }
  };

  const handleAddTransaction = () => {
    const { from, to, amount } = transactionForm;
    const parsedAmount = Number.parseInt(amount, 10);

    if (!from || !to) {
      setTransactionError('Sélectionnez un compte émetteur et destinataire.');
      return;
    }

    if (from === to) {
      setTransactionError('Le compte émetteur doit être différent du destinataire.');
      return;
    }

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setTransactionError('Montant invalide.');
      return;
    }

    const newTransaction: Transaction = {
      id: generateId(),
      from,
      to,
      amount: parsedAmount,
      ...(transactionForm.label.trim() ? { label: transactionForm.label.trim() } : {}),
    };

    setTransactions((prevState: Transaction[]) => [...prevState, newTransaction]);
    setTransactionForm((prevState: TransactionFormState) => ({
      ...prevState,
      amount: '',
      label: '',
    }));
    setTransactionError(null);
  };

  const handleTransactionFieldChange = (field: keyof TransactionFormState, value: string) => {
    setTransactionForm((prevState: TransactionFormState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleRemoveTransaction = (id: string) => {
    setTransactions((prevState: Transaction[]) =>
      prevState.filter((transaction) => transaction.id !== id),
    );
  };

  const handleValidateSummary = () => {
    if (!reportDate) {
      setReportError('Sélectionnez une date pour valider le résumé.');
      return;
    }

    if (simplifiedTransfers.length === 0) {
      setReportError('Aucun flux à valider pour cette date.');
      return;
    }

    const label = new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(new Date(reportDate));

    const entry: ReportEntry = {
      id: generateId(),
      label,
      date: reportDate,
      createdAt: new Date().toISOString(),
      transfers: simplifiedTransfers.map((transfer) => ({ ...transfer })),
    };

    setReports((prevReports: ReportEntry[]) => [entry, ...prevReports]);
    setReportError(null);
    setReportDate('');
  };

  const handleRemoveReport = (id: string) => {
    setReports((prevReports: ReportEntry[]) => prevReports.filter((report) => report.id !== id));
  };

  const handleReportDateChange = (event: ValueEvent) => {
    setReportDate(event.target.value);
    setReportError(null);
  };

  const handleResetAll = () => {
    resetAccounts();
    setAccountInput('');
    resetTransactions();
    resetTransactionForm();
    setReportDate('');
    setAccountError(null);
    setTransactionError(null);
    setReportError(null);
    setShowResetConfirm(false);
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center px-4 py-12">
      <section className="w-full max-w-5xl space-y-8 rounded-3xl border border-base-300 bg-base-100 p-8 shadow-2xl">
        <HeaderSection
          showResetConfirm={showResetConfirm}
          onRequestReset={() => setShowResetConfirm(true)}
          onConfirmReset={handleResetAll}
          onCancelReset={() => setShowResetConfirm(false)}
          isResetDisabled={
            accounts.length === 0 && transactions.length === 0 && reports.length === 0
          }
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        <div className="grid gap-6 md:grid-cols-2">
          <AccountsSection
            accounts={accounts}
            accountInput={accountInput}
            onAccountInputChange={handleAccountInputChange}
            onAddAccount={handleAddAccount}
            accountError={accountError}
          />
          <TransferFormSection
            accounts={accounts}
            form={transactionForm}
            onChange={handleTransactionFieldChange}
            onSubmit={handleAddTransaction}
            transactionError={transactionError}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <TransactionsSection transactions={transactions} onRemove={handleRemoveTransaction} />
          <GroupedTransfersSection
            hasTransactions={transactions.length > 0}
            groupedTransfers={groupedTransactions}
          />
        </div>

        <SummarySection
          hasTransactions={transactions.length > 0}
          simplifiedTransfers={simplifiedTransfers}
          reportDate={reportDate}
          onReportDateChange={handleReportDateChange}
          onValidate={handleValidateSummary}
          reportError={reportError}
        />

        <ReportsSection reports={reports} onRemove={handleRemoveReport} />
      </section>
      <AppFooter />
    </main>
  );
};

export default App;
