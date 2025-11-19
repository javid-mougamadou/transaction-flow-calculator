import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TransactionsSection } from '../TransactionsSection';

describe('TransactionsSection', () => {
  it('affiche un message si vide', () => {
    render(<TransactionsSection transactions={[]} onRemove={vi.fn()} />);

    expect(
      screen.getByText('Ajoutez un virement pour voir la liste détaillée.'),
    ).toBeInTheDocument();
  });

  it('liste les transactions et gère la suppression', () => {
    const onRemove = vi.fn();
    render(
      <TransactionsSection
        transactions={[{ id: '1', from: 'Compte A', to: 'Compte B', amount: 150 }]}
        onRemove={onRemove}
      />,
    );

    expect(screen.getByText('#1 Compte A → Compte B')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Retirer' }));
    expect(onRemove).toHaveBeenCalledWith('1');
  });
});
