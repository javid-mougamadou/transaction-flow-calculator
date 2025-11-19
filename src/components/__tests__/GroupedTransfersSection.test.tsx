import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { GroupedTransfersSection } from '../GroupedTransfersSection';

describe('GroupedTransfersSection', () => {
  it('affiche un message quand il ny a pas de transactions', () => {
    render(<GroupedTransfersSection hasTransactions={false} groupedTransfers={[]} />);

    expect(
      screen.getByText('Les regroupements apparaîtront lorsque des virements seront ajoutés.'),
    ).toBeInTheDocument();
  });

  it('affiche les transferts regroupés', () => {
    render(
      <GroupedTransfersSection
        hasTransactions
        groupedTransfers={[{ from: 'Compte A', to: 'Compte B', amount: 200 }]}
      />,
    );

    expect(screen.getByText('Compte A → Compte B')).toBeInTheDocument();
    expect(screen.getByText('Total')).toBeInTheDocument();
    // Vérifier que le montant apparaît deux fois : dans l'item et dans le total
    const amounts = screen.getAllByText(/200/);
    expect(amounts).toHaveLength(2);
  });
});
