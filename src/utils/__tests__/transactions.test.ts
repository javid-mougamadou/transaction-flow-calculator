import { describe, expect, it } from 'vitest';
import { groupTransactions, simplifyTransactions } from '../transactions';

describe('transactions utils', () => {
  it('regroupe les transactions par paire', () => {
    const grouped = groupTransactions([
      { id: '1', from: 'Compte A', to: 'Compte B', amount: 200 },
      { id: '2', from: 'Compte A', to: 'Compte B', amount: 100 },
    ]);

    expect(grouped).toEqual([{ from: 'Compte A', to: 'Compte B', amount: 300 }]);
  });

  it('simplifie les flux lorsque les comptes sont indépendants', () => {
    const simplified = simplifyTransactions([
      { id: '1', from: 'Compte A', to: 'Compte B', amount: 200 },
      { id: '2', from: 'Compte A', to: 'Compte C', amount: 100 },
    ]);

    expect(simplified).toContainEqual({ from: 'Compte A', to: 'Compte B', amount: 200 });
    expect(simplified).toContainEqual({ from: 'Compte A', to: 'Compte C', amount: 100 });
  });

  it('simplifie correctement un scénario en chaîne', () => {
    const simplified = simplifyTransactions([
      { id: '1', from: 'Compte A', to: 'Compte B', amount: 300 },
      { id: '2', from: 'Compte B', to: 'Compte C', amount: 200 },
    ]);

    expect(simplified).toEqual([
      { from: 'Compte A', to: 'Compte B', amount: 100 },
      { from: 'Compte A', to: 'Compte C', amount: 200 },
    ]);
  });
});
