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
import { usePageTracking, useAnalytics } from './hooks/useAnalytics';
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

  // Track page view for home page
  usePageTracking('/', 'Transaction Flow Calculator - Home');

  // Analytics hook for tracking events
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    trackEvent('theme_changed', {
      theme: newTheme,
    });
  };

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

    // Track account addition
    trackEvent('account_added', {
      account_name: trimmed,
      total_accounts: updatedAccounts.length,
    });

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

    // Track transaction addition
    trackEvent('transaction_added', {
      from: newTransaction.from,
      to: newTransaction.to,
      amount: newTransaction.amount,
      has_label: !!newTransaction.label,
      total_transactions: transactions.length + 1,
    });
  };

  const handleTransactionFieldChange = (field: keyof TransactionFormState, value: string) => {
    setTransactionForm((prevState: TransactionFormState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleRemoveTransaction = (id: string) => {
    const transactionToRemove = transactions.find((t) => t.id === id);
    setTransactions((prevState: Transaction[]) =>
      prevState.filter((transaction) => transaction.id !== id),
    );

    // Track transaction removal
    if (transactionToRemove) {
      trackEvent('transaction_removed', {
        transaction_id: id,
        from: transactionToRemove.from,
        to: transactionToRemove.to,
        amount: transactionToRemove.amount,
        remaining_transactions: transactions.length - 1,
      });
    }
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

    // Track summary validation
    trackEvent('summary_validated', {
      report_date: reportDate,
      transfers_count: simplifiedTransfers.length,
      total_reports: reports.length + 1,
    });
  };

  const handleRemoveReport = (id: string) => {
    const reportToRemove = reports.find((r) => r.id === id);
    setReports((prevReports: ReportEntry[]) => prevReports.filter((report) => report.id !== id));

    // Track report removal
    if (reportToRemove) {
      trackEvent('report_removed', {
        report_id: id,
        report_date: reportToRemove.date,
        transfers_count: reportToRemove.transfers.length,
        remaining_reports: reports.length - 1,
      });
    }
  };

  const handleReportDateChange = (event: ValueEvent) => {
    setReportDate(event.target.value);
    setReportError(null);
  };

  const handleResetAll = () => {
    const accountsCount = accounts.length;
    const transactionsCount = transactions.length;
    const reportsCount = reports.length;

    resetAccounts();
    setAccountInput('');
    resetTransactions();
    resetTransactionForm();
    setReportDate('');
    setAccountError(null);
    setTransactionError(null);
    setReportError(null);
    setShowResetConfirm(false);

    // Track app reset
    trackEvent('app_reset', {
      accounts_count: accountsCount,
      transactions_count: transactionsCount,
      reports_count: reportsCount,
    });
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
