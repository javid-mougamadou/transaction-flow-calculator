import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SummarySection } from '../SummarySection';

describe('SummarySection', () => {
  it("désactive le bouton sans transactions", () => {
    render(
      <SummarySection
        hasTransactions={false}
        simplifiedTransfers={[]}
        reportDate=""
        onReportDateChange={vi.fn()}
        onValidate={vi.fn()}
        reportError={null}
      />,
    );

    expect(screen.getByRole('button', { name: 'Valider le résumé' })).toBeDisabled();
  });

  it('valide lorsquune date et des flux sont fournis', () => {
    const onValidate = vi.fn();

    render(
      <SummarySection
        hasTransactions
        simplifiedTransfers={[{ from: 'Compte A', to: 'Compte B', amount: 100 }]}
        reportDate="2024-01-01"
        onReportDateChange={vi.fn()}
        onValidate={onValidate}
        reportError={null}
      />,
    );

    const button = screen.getByRole('button', { name: 'Valider le résumé' });
    expect(button).toBeEnabled();
    fireEvent.click(button);
    expect(onValidate).toHaveBeenCalledTimes(1);
  });
});
