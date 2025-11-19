import { SimplifiedTransfer, Transaction } from '../types';

export const simplifyTransactions = (transactions: Transaction[]): SimplifiedTransfer[] => {
  const balance = new Map<string, number>();

  transactions.forEach(({ from, to, amount }) => {
    balance.set(from, (balance.get(from) ?? 0) - amount);
    balance.set(to, (balance.get(to) ?? 0) + amount);
  });

  const debtors: { account: string; amount: number }[] = [];
  const creditors: { account: string; amount: number }[] = [];

  balance.forEach((value, account) => {
    if (value < -0.0001) {
      debtors.push({ account, amount: -value });
    } else if (value > 0.0001) {
      creditors.push({ account, amount: value });
    }
  });

  const transfers: SimplifiedTransfer[] = [];
  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    const amount = Math.min(debtor.amount, creditor.amount);

    if (amount > 0) {
      transfers.push({ from: debtor.account, to: creditor.account, amount });
    }

    debtor.amount -= amount;
    creditor.amount -= amount;

    if (debtor.amount <= 0.0001) {
      i += 1;
    }

    if (creditor.amount <= 0.0001) {
      j += 1;
    }
  }

  const aggregated = new Map<string, number>();
  transfers.forEach((transfer) => {
    const key = `${transfer.from}->${transfer.to}`;
    aggregated.set(key, (aggregated.get(key) ?? 0) + transfer.amount);
  });

  return Array.from(aggregated.entries()).map(([key, amount]) => {
    const [from, to] = key.split('->') as [string, string];
    return { from, to, amount };
  });
};

export const groupTransactions = (transactions: Transaction[]): SimplifiedTransfer[] => {
  const map = new Map<string, number>();
  transactions.forEach((transaction) => {
    const key = `${transaction.from}->${transaction.to}`;
    map.set(key, (map.get(key) ?? 0) + transaction.amount);
  });

  return Array.from(map.entries()).map(([key, amount]) => {
    const [from, to] = key.split('->') as [string, string];
    return { from, to, amount };
  });
};
