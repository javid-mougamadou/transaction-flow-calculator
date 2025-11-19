type HeaderSectionProps = {
  showResetConfirm: boolean;
  onRequestReset: () => void;
  onConfirmReset: () => void;
  onCancelReset: () => void;
  isResetDisabled: boolean;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
};

export const HeaderSection = ({
  showResetConfirm,
  onRequestReset,
  onConfirmReset,
  onCancelReset,
  isResetDisabled,
  theme,
  onToggleTheme,
}: HeaderSectionProps) => (
  <header className="flex flex-col gap-4 text-base-content md:flex-row md:items-center md:justify-between">
    <div>
      <h1 className="text-3xl font-semibold md:text-4xl">Transaction Flow Calculator</h1>
      <p className="mt-1 text-base-content/70">
        Ajoutez vos comptes, vos virements et obtenez un résumé simplifié des flux entre eux.
      </p>
      <h2 className="mt-2 italic">
        Application en Reactjs PWA Mobile fonctionne hors ligne
      </h2>
    </div>
    <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
      <button type="button" className="btn" onClick={onToggleTheme}>
        {theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
      </button>
      <button
        type="button"
        className="btn btn-outline btn-error"
        onClick={onRequestReset}
        disabled={isResetDisabled}
      >
        Réinitialiser
      </button>
      {showResetConfirm ? (
        <div className="flex items-center gap-2 rounded-xl border border-rose-500/60 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
          <span>Tout effacer ?</span>
          <button type="button" className="btn btn-error btn-sm" onClick={onConfirmReset}>
            Oui
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-sm text-slate-200 hover:text-slate-50"
            onClick={onCancelReset}
          >
            Non
          </button>
        </div>
      ) : null}
    </div>
  </header>
);
