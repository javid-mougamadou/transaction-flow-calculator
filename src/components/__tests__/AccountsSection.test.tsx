import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AccountsSection } from '../AccountsSection';

describe('AccountsSection', () => {
  it('affiche les comptes existants', () => {
    render(
      <AccountsSection
        accounts={['Compte A', 'Compte B']}
        accountInput=""
        onAccountInputChange={vi.fn()}
        onAddAccount={vi.fn()}
        accountError={null}
      />,
    );

    expect(screen.getByText('Compte A')).toBeInTheDocument();
    expect(screen.getByText('Compte B')).toBeInTheDocument();
  });

  it("déclenche les callbacks d'entrée et d'ajout", () => {
    const onChange = vi.fn();
    const onAdd = vi.fn();

    render(
      <AccountsSection
        accounts={[]}
        accountInput=""
        onAccountInputChange={onChange}
        onAddAccount={onAdd}
        accountError={null}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText('Compte (ex. Compte A)'), {
      target: { value: 'Compte C' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Ajouter' }));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onAdd).toHaveBeenCalledTimes(1);
  });

  it('affiche un message d’erreur', () => {
    render(
      <AccountsSection
        accounts={[]}
        accountInput=""
        onAccountInputChange={vi.fn()}
        onAddAccount={vi.fn()}
        accountError="Erreur"
      />,
    );

    expect(screen.getByText('Erreur')).toBeInTheDocument();
  });
});
