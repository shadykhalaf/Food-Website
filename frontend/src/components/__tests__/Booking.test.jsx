import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import Booking from '../Booking';

// Mock the API service
jest.mock('../../services/api', () => ({
  bookingAPI: {
    createBooking: jest.fn(),
    getBookings: jest.fn(),
    getBooking: jest.fn(),
    updateBookingStatus: jest.fn(),
    cancelBooking: jest.fn()
  }
}));

const mockBooking = {
  id: 1,
  user_id: 1,
  date: '2024-03-25',
  time: '19:00',
  guests: 4,
  special_requests: 'Window seat preferred',
  status: 'pending',
  created_at: '2024-03-20T10:00:00Z'
};

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Booking Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders booking form correctly', () => {
    renderWithProviders(<Booking />);

    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/number of guests/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/special requests/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /book table/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    renderWithProviders(<Booking />);

    const bookButton = screen.getByRole('button', { name: /book table/i });
    fireEvent.click(bookButton);

    await waitFor(() => {
      expect(screen.getByText(/date is required/i)).toBeInTheDocument();
      expect(screen.getByText(/time is required/i)).toBeInTheDocument();
      expect(screen.getByText(/number of guests is required/i)).toBeInTheDocument();
    });
  });

  it('shows validation error for past date', async () => {
    renderWithProviders(<Booking />);

    const dateInput = screen.getByLabelText(/date/i);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    fireEvent.change(dateInput, { target: { value: yesterday.toISOString().split('T')[0] } });

    const bookButton = screen.getByRole('button', { name: /book table/i });
    fireEvent.click(bookButton);

    await waitFor(() => {
      expect(screen.getByText(/date must be in the future/i)).toBeInTheDocument();
    });
  });

  it('shows validation error for invalid guests number', async () => {
    renderWithProviders(<Booking />);

    const guestsInput = screen.getByLabelText(/number of guests/i);
    fireEvent.change(guestsInput, { target: { value: '0' } });

    const bookButton = screen.getByRole('button', { name: /book table/i });
    fireEvent.click(bookButton);

    await waitFor(() => {
      expect(screen.getByText(/guests must be between 1 and 10/i)).toBeInTheDocument();
    });
  });

  it('creates booking successfully', async () => {
    const { bookingAPI } = require('../../services/api');
    bookingAPI.createBooking.mockResolvedValueOnce({ data: mockBooking });

    renderWithProviders(<Booking />);

    const dateInput = screen.getByLabelText(/date/i);
    const timeInput = screen.getByLabelText(/time/i);
    const guestsInput = screen.getByLabelText(/number of guests/i);
    const specialRequestsInput = screen.getByLabelText(/special requests/i);

    fireEvent.change(dateInput, { target: { value: '2024-03-25' } });
    fireEvent.change(timeInput, { target: { value: '19:00' } });
    fireEvent.change(guestsInput, { target: { value: '4' } });
    fireEvent.change(specialRequestsInput, { target: { value: 'Window seat preferred' } });

    const bookButton = screen.getByRole('button', { name: /book table/i });
    fireEvent.click(bookButton);

    await waitFor(() => {
      expect(bookingAPI.createBooking).toHaveBeenCalledWith({
        date: '2024-03-25',
        time: '19:00',
        guests: 4,
        special_requests: 'Window seat preferred'
      });
    });

    expect(screen.getByText(/booking successful/i)).toBeInTheDocument();
  });

  it('shows error message when booking creation fails', async () => {
    const { bookingAPI } = require('../../services/api');
    bookingAPI.createBooking.mockRejectedValueOnce(new Error('Failed to create booking'));

    renderWithProviders(<Booking />);

    const dateInput = screen.getByLabelText(/date/i);
    const timeInput = screen.getByLabelText(/time/i);
    const guestsInput = screen.getByLabelText(/number of guests/i);

    fireEvent.change(dateInput, { target: { value: '2024-03-25' } });
    fireEvent.change(timeInput, { target: { value: '19:00' } });
    fireEvent.change(guestsInput, { target: { value: '4' } });

    const bookButton = screen.getByRole('button', { name: /book table/i });
    fireEvent.click(bookButton);

    await waitFor(() => {
      expect(screen.getByText(/failed to create booking/i)).toBeInTheDocument();
    });
  });

  it('allows admin to update booking status', async () => {
    const { bookingAPI } = require('../../services/api');
    bookingAPI.getBooking.mockResolvedValueOnce({ data: mockBooking });
    bookingAPI.updateBookingStatus.mockResolvedValueOnce({ data: { ...mockBooking, status: 'confirmed' } });

    // Mock user as admin
    jest.spyOn(require('../../context/AuthContext'), 'useAuth').mockReturnValue({
      user: { is_admin: true }
    });

    renderWithProviders(<Booking bookingId={1} />);

    await waitFor(() => {
      const statusSelect = screen.getByLabelText(/booking status/i);
      fireEvent.change(statusSelect, { target: { value: 'confirmed' } });
    });

    expect(bookingAPI.updateBookingStatus).toHaveBeenCalledWith(1, 'confirmed');
  });

  it('allows user to cancel their booking', async () => {
    const { bookingAPI } = require('../../services/api');
    bookingAPI.getBooking.mockResolvedValueOnce({ data: mockBooking });
    bookingAPI.cancelBooking.mockResolvedValueOnce({ data: { ...mockBooking, status: 'cancelled' } });

    renderWithProviders(<Booking bookingId={1} />);

    await waitFor(() => {
      const cancelButton = screen.getByText(/cancel booking/i);
      fireEvent.click(cancelButton);
    });

    expect(bookingAPI.cancelBooking).toHaveBeenCalledWith(1);
  });

  it('shows loading state while submitting', async () => {
    const { bookingAPI } = require('../../services/api');
    bookingAPI.createBooking.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    renderWithProviders(<Booking />);

    const dateInput = screen.getByLabelText(/date/i);
    const timeInput = screen.getByLabelText(/time/i);
    const guestsInput = screen.getByLabelText(/number of guests/i);

    fireEvent.change(dateInput, { target: { value: '2024-03-25' } });
    fireEvent.change(timeInput, { target: { value: '19:00' } });
    fireEvent.change(guestsInput, { target: { value: '4' } });

    const bookButton = screen.getByRole('button', { name: /book table/i });
    fireEvent.click(bookButton);

    expect(screen.getByText(/booking/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(/booking/i)).not.toBeInTheDocument();
    });
  });
}); 