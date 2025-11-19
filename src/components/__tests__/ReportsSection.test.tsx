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
});
