import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { HeaderSection } from '../HeaderSection';

describe('HeaderSection', () => {
  const baseProps = {
    showResetConfirm: false,
    onRequestReset: vi.fn(),
    onConfirmReset: vi.fn(),
    onCancelReset: vi.fn(),
    isResetDisabled: false,
    theme: 'dark' as const,
    onToggleTheme: vi.fn(),
  };

  it('affiche le bouton de thème et déclenche le toggle', () => {
    const onToggleTheme = vi.fn();

    render(<HeaderSection {...baseProps} onToggleTheme={onToggleTheme} />);

    const button = screen.getByRole('button', { name: 'Mode clair' });
    fireEvent.click(button);

    expect(onToggleTheme).toHaveBeenCalledTimes(1);
  });

  it('demande une confirmation de reset', () => {
    const onRequestReset = vi.fn();

    render(<HeaderSection {...baseProps} onRequestReset={onRequestReset} />);

    fireEvent.click(screen.getByRole('button', { name: 'Réinitialiser' }));
    expect(onRequestReset).toHaveBeenCalledTimes(1);
  });

  it('affiche les actions de confirmation', () => {
    const onConfirmReset = vi.fn();
    const onCancelReset = vi.fn();

    render(
      <HeaderSection
        {...baseProps}
        showResetConfirm
        onConfirmReset={onConfirmReset}
        onCancelReset={onCancelReset}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Oui' }));
    fireEvent.click(screen.getByRole('button', { name: 'Non' }));

    expect(onConfirmReset).toHaveBeenCalledTimes(1);
    expect(onCancelReset).toHaveBeenCalledTimes(1);
  });
});
