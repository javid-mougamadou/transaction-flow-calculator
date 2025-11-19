import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TransferFormSection } from '../TransferFormSection';

describe('TransferFormSection', () => {
  const baseProps = {
    accounts: ['Compte A', 'Compte B'],
    form: { from: '', to: '', amount: '' },
    onChange: vi.fn(),
    onSubmit: vi.fn(),
    transactionError: null,
  };

  it('met à jour les champs via onChange', () => {
    const onChange = vi.fn();

    render(<TransferFormSection {...baseProps} onChange={onChange} />);

    const [fromSelect, toSelect] = screen.getAllByRole('combobox');

    fireEvent.change(fromSelect, { target: { value: 'Compte A' } });
    fireEvent.change(toSelect, { target: { value: 'Compte B' } });
    fireEvent.change(screen.getByPlaceholderText('Montant'), {
      target: { value: '200' },
    });

    expect(onChange).toHaveBeenCalledWith('from', 'Compte A');
    expect(onChange).toHaveBeenCalledWith('to', 'Compte B');
    expect(onChange).toHaveBeenCalledWith('amount', '200');
  });

  it('soumet le formulaire', () => {
    const onSubmit = vi.fn();

    render(
      <TransferFormSection
        {...baseProps}
        form={{ from: 'Compte A', to: 'Compte B', amount: '100' }}
        onSubmit={onSubmit}
      />,
    );

    fireEvent.submit(screen.getByRole('button', { name: 'Ajouter le virement' }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('affiche une erreur', () => {
    render(<TransferFormSection {...baseProps} transactionError="Montant invalide" />);

    expect(screen.getByText('Montant invalide')).toBeInTheDocument();
  });
});
