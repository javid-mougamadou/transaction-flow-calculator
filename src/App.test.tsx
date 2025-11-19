import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('affiche le message de bienvenue', () => {
    render(<App />);
    expect(screen.getByText(/Transaction Flow Calculator/i)).toBeInTheDocument();
  });
});
