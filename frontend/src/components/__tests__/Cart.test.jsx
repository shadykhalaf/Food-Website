import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from '../../context/CartContext';
import Cart from '../Cart';

// Mock the API service
jest.mock('../../services/api', () => ({
  cartAPI: {
    getCart: jest.fn(),
    updateCartItem: jest.fn(),
    removeCartItem: jest.fn(),
    clearCart: jest.fn()
  }
}));

const mockCartItems = [
  {
    id: 1,
    menu_item_id: 1,
    name: 'Test Item 1',
    price: 9.99,
    quantity: 2,
    image: 'test1.jpg'
  },
  {
    id: 2,
    menu_item_id: 2,
    name: 'Test Item 2',
    price: 14.99,
    quantity: 1,
    image: 'test2.jpg'
  }
];

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <CartProvider>
        {component}
      </CartProvider>
    </BrowserRouter>
  );
};

describe('Cart Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders empty cart message when cart is empty', async () => {
    const { cartAPI } = require('../../services/api');
    cartAPI.getCart.mockResolvedValueOnce({ data: [] });

    renderWithProviders(<Cart />);

    await waitFor(() => {
      expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
    });
  });

  it('renders cart items correctly', async () => {
    const { cartAPI } = require('../../services/api');
    cartAPI.getCart.mockResolvedValueOnce({ data: mockCartItems });

    renderWithProviders(<Cart />);

    await waitFor(() => {
      expect(screen.getByText('Test Item 1')).toBeInTheDocument();
      expect(screen.getByText('Test Item 2')).toBeInTheDocument();
      expect(screen.getByText('$9.99')).toBeInTheDocument();
      expect(screen.getByText('$14.99')).toBeInTheDocument();
    });
  });

  it('calculates total price correctly', async () => {
    const { cartAPI } = require('../../services/api');
    cartAPI.getCart.mockResolvedValueOnce({ data: mockCartItems });

    renderWithProviders(<Cart />);

    await waitFor(() => {
      // Total should be (9.99 * 2) + 14.99 = 34.97
      expect(screen.getByText('$34.97')).toBeInTheDocument();
    });
  });

  it('updates item quantity when quantity buttons are clicked', async () => {
    const { cartAPI } = require('../../services/api');
    cartAPI.getCart.mockResolvedValueOnce({ data: mockCartItems });
    cartAPI.updateCartItem.mockResolvedValueOnce({ success: true });

    renderWithProviders(<Cart />);

    await waitFor(() => {
      const incrementButton = screen.getAllByText('+')[0];
      fireEvent.click(incrementButton);
    });

    expect(cartAPI.updateCartItem).toHaveBeenCalledWith(1, 3);
  });

  it('removes item when remove button is clicked', async () => {
    const { cartAPI } = require('../../services/api');
    cartAPI.getCart.mockResolvedValueOnce({ data: mockCartItems });
    cartAPI.removeCartItem.mockResolvedValueOnce({ success: true });

    renderWithProviders(<Cart />);

    await waitFor(() => {
      const removeButton = screen.getAllByText('Remove')[0];
      fireEvent.click(removeButton);
    });

    expect(cartAPI.removeCartItem).toHaveBeenCalledWith(1);
  });

  it('clears cart when clear cart button is clicked', async () => {
    const { cartAPI } = require('../../services/api');
    cartAPI.getCart.mockResolvedValueOnce({ data: mockCartItems });
    cartAPI.clearCart.mockResolvedValueOnce({ success: true });

    renderWithProviders(<Cart />);

    await waitFor(() => {
      const clearButton = screen.getByText(/clear cart/i);
      fireEvent.click(clearButton);
    });

    expect(cartAPI.clearCart).toHaveBeenCalled();
  });

  it('shows error message when API calls fail', async () => {
    const { cartAPI } = require('../../services/api');
    cartAPI.getCart.mockRejectedValueOnce(new Error('Failed to load cart'));

    renderWithProviders(<Cart />);

    await waitFor(() => {
      expect(screen.getByText(/failed to load cart/i)).toBeInTheDocument();
    });
  });

  it('navigates to checkout when checkout button is clicked', async () => {
    const { cartAPI } = require('../../services/api');
    cartAPI.getCart.mockResolvedValueOnce({ data: mockCartItems });

    renderWithProviders(<Cart />);

    await waitFor(() => {
      const checkoutButton = screen.getByText(/proceed to checkout/i);
      expect(checkoutButton).toHaveAttribute('href', '/checkout');
    });
  });
}); 