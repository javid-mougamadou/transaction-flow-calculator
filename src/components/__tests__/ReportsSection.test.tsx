import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ReportsSection } from '../ReportsSection';

describe('ReportsSection', () => {
  it("affiche un message lorsqu'il n'y a pas de reports", () => {
    render(<ReportsSection reports={[]} onRemove={vi.fn()} />);

    expect(
      screen.getByText('Validez un résumé pour constituer un historique des flux simplifiés.'),
    ).toBeInTheDocument();
  });

  it('ouvre un reporting et permet de le retirer', () => {
    const onRemove = vi.fn();
    render(
      <ReportsSection
        reports={[
          {
            id: 'r1',
            label: 'lundi 01 janvier 2024',
            date: '2024-01-01',
            createdAt: '2024-01-01T10:00:00.000Z',
            transfers: [{ from: 'Compte A', to: 'Compte B', amount: 300 }],
          },
        ]}
        onRemove={onRemove}
      />,
    );

    fireEvent.click(screen.getByText('Report du lundi 01 janvier 2024'));
    expect(screen.getByText('Compte A → Compte B')).toBeVisible();

    fireEvent.click(screen.getByRole('button', { name: 'Retirer' }));
    expect(onRemove).toHaveBeenCalledWith('r1');
  });

  it('affiche virements saisis et regroupés lorsque présents dans le reporting', () => {
    render(
      <ReportsSection
        reports={[
          {
            id: 'r2',
            label: 'mardi 02 janvier 2024',
            date: '2024-01-02',
            createdAt: '2024-01-02T10:00:00.000Z',
            enteredTransactions: [
              { id: 't1', from: 'A', to: 'B', amount: 100 },
              { id: 't2', from: 'A', to: 'B', amount: 50, label: 'Test' },
            ],
            groupedTransfers: [{ from: 'A', to: 'B', amount: 150 }],
            transfers: [{ from: 'A', to: 'B', amount: 150 }],
          },
        ]}
        onRemove={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByText('Report du mardi 02 janvier 2024'));
    expect(screen.getByRole('heading', { name: 'Virements saisis' })).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Virements regroupés' })).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Résumé simplifié' })).toBeVisible();
    expect(screen.getByText('#1 A → B')).toBeVisible();
    expect(screen.getByText('Test')).toBeVisible();
  });
});
