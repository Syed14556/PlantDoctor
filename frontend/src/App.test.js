import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Plant Doctor heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/Plant Doctor/i);
  expect(headingElement).toBeInTheDocument();
});
