import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./components/photobooth.js', () => () => <div>Photo booth content</div>);
afterEach(() => { jest.restoreAllMocks(); delete global.fetch; });

test('keeps the booth closed until the server accepts the PIN', async () => {
  global.fetch = jest.fn()
    .mockResolvedValueOnce({ ok: false, json: async () => ({ error: 'Incorrect PIN. Please try again.' }) })
    .mockResolvedValueOnce({ ok: true, json: async () => ({ unlocked: true }) });
  render(<App />);
  expect(screen.queryByText('Photo booth content')).not.toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('Access PIN'), { target: { value: 'wrong' } });
  fireEvent.click(screen.getByRole('button', { name: 'Unlock photo booth' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Incorrect PIN');
  expect(screen.queryByText('Photo booth content')).not.toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('Access PIN'), { target: { value: 'sky508' } });
  fireEvent.click(screen.getByRole('button', { name: 'Unlock photo booth' }));
  expect(await screen.findByText('Photo booth content')).toBeInTheDocument();
});

test('stays locked when the server cannot be reached', async () => {
  global.fetch = jest.fn().mockRejectedValue(new Error('offline'));
  render(<App />);
  fireEvent.change(screen.getByLabelText('Access PIN'), { target: { value: 'sky508' } });
  fireEvent.click(screen.getByRole('button', { name: 'Unlock photo booth' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Could not connect');
  expect(screen.queryByText('Photo booth content')).not.toBeInTheDocument();
});
