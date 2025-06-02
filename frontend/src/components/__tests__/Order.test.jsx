import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import Order from '../Order';

// Mock the API service
jest.mock('../../services/api', () => ({
  orderAPI: {
    createOrder: jest.fn(),
    getOrders: jest.fn(),
    getOrder: jest.fn(),
    updateOrderStatus: jest.fn()
  }
}));

const mockOrder = {
  id: 1,
  user_id: 1,
  delivery_address: '123 Test St',
  phone_number: '1234567890',
  payment_method: 'credit_card',
  total_amount: '19.98',
  status: 'pending',
  created_at: '2024-03-20T10:00:00Z',
  items: [
    {
      id: 1,
      menu_item_id: 1,
      name: 'Test Item',
      quantity: 2,
      price: '9.99'
    }
  ]
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

describe('Order Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders order details correctly', async () => {
    const { orderAPI } = require('../../services/api');
    orderAPI.getOrder.mockResolvedValueOnce({ data: mockOrder });

    renderWithProviders(<Order orderId={1} />);

    await waitFor(() => {
      expect(screen.getByText('Order #1')).toBeInTheDocument();
      expect(screen.getByText('123 Test St')).toBeInTheDocument();
      expect(screen.getByText('1234567890')).toBeInTheDocument();
      expect(screen.getByText('credit_card')).toBeInTheDocument();
      expect(screen.getByText('$19.98')).toBeInTheDocument();
      expect(screen.getByText('pending')).toBeInTheDocument();
    });
  });

  it('renders order items correctly', async () => {
    const { orderAPI } = require('../../services/api');
    orderAPI.getOrder.mockResolvedValueOnce({ data: mockOrder });

    renderWithProviders(<Order orderId={1} />);

    await waitFor(() => {
      expect(screen.getByText('Test Item')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('$9.99')).toBeInTheDocument();
    });
  });

  it('shows error message when order fetch fails', async () => {
    const { orderAPI } = require('../../services/api');
    orderAPI.getOrder.mockRejectedValueOnce(new Error('Failed to load order'));

    renderWithProviders(<Order orderId={1} />);

    await waitFor(() => {
      expect(screen.getByText(/failed to load order/i)).toBeInTheDocument();
    });
  });

  it('allows admin to update order status', async () => {
    const { orderAPI } = require('../../services/api');
    orderAPI.getOrder.mockResolvedValueOnce({ data: mockOrder });
    orderAPI.updateOrderStatus.mockResolvedValueOnce({ data: { ...mockOrder, status: 'preparing' } });

    // Mock user as admin
    jest.spyOn(require('../../context/AuthContext'), 'useAuth').mockReturnValue({
      user: { is_admin: true }
    });

    renderWithProviders(<Order orderId={1} />);

    await waitFor(() => {
      const statusSelect = screen.getByLabelText(/order status/i);
      fireEvent.change(statusSelect, { target: { value: 'preparing' } });
    });

    expect(orderAPI.updateOrderStatus).toHaveBeenCalledWith(1, 'preparing');
  });

  it('does not show status update for non-admin users', async () => {
    const { orderAPI } = require('../../services/api');
    orderAPI.getOrder.mockResolvedValueOnce({ data: mockOrder });

    // Mock user as non-admin
    jest.spyOn(require('../../context/AuthContext'), 'useAuth').mockReturnValue({
      user: { is_admin: false }
    });

    renderWithProviders(<Order orderId={1} />);

    await waitFor(() => {
      expect(screen.queryByLabelText(/order status/i)).not.toBeInTheDocument();
    });
  });

  it('shows order date in correct format', async () => {
    const { orderAPI } = require('../../services/api');
    orderAPI.getOrder.mockResolvedValueOnce({ data: mockOrder });

    renderWithProviders(<Order orderId={1} />);

    await waitFor(() => {
      expect(screen.getByText(/march 20, 2024/i)).toBeInTheDocument();
    });
  });

  it('navigates back to orders list', async () => {
    const { orderAPI } = require('../../services/api');
    orderAPI.getOrder.mockResolvedValueOnce({ data: mockOrder });

    renderWithProviders(<Order orderId={1} />);

    await waitFor(() => {
      const backButton = screen.getByText(/back to orders/i);
      expect(backButton).toHaveAttribute('href', '/orders');
    });
  });

  it('shows loading state while fetching order', async () => {
    const { orderAPI } = require('../../services/api');
    orderAPI.getOrder.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    renderWithProviders(<Order orderId={1} />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
  });
}); 