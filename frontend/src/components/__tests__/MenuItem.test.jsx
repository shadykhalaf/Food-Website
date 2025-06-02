import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import MenuItem from '../MenuItem';

// Mock the API service
jest.mock('../../services/api', () => ({
  menuAPI: {
    getMenuItem: jest.fn(),
    addToCart: jest.fn()
  }
}));

const mockMenuItem = {
  id: 1,
  name: 'Test Item',
  description: 'Test Description',
  price: 9.99,
  image: 'test.jpg',
  is_available: true
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

describe('MenuItem Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders menu item details correctly', () => {
    renderWithProviders(<MenuItem item={mockMenuItem} />);

    expect(screen.getByText('Test Item')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('$9.99')).toBeInTheDocument();
    expect(screen.getByAltText('Test Item')).toHaveAttribute('src', 'test.jpg');
  });

  it('shows unavailable badge when item is not available', () => {
    const unavailableItem = { ...mockMenuItem, is_available: false };
    renderWithProviders(<MenuItem item={unavailableItem} />);

    expect(screen.getByText('Unavailable')).toBeInTheDocument();
  });

  it('calls addToCart when Add to Cart button is clicked', async () => {
    const { menuAPI } = require('../../services/api');
    menuAPI.addToCart.mockResolvedValueOnce({ success: true });

    renderWithProviders(<MenuItem item={mockMenuItem} />);

    const addToCartButton = screen.getByText('Add to Cart');
    fireEvent.click(addToCartButton);

    expect(menuAPI.addToCart).toHaveBeenCalledWith(mockMenuItem.id);
  });

  it('shows error message when addToCart fails', async () => {
    const { menuAPI } = require('../../services/api');
    menuAPI.addToCart.mockRejectedValueOnce(new Error('Failed to add to cart'));

    renderWithProviders(<MenuItem item={mockMenuItem} />);

    const addToCartButton = screen.getByText('Add to Cart');
    fireEvent.click(addToCartButton);

    // Wait for error message to appear
    const errorMessage = await screen.findByText('Failed to add to cart');
    expect(errorMessage).toBeInTheDocument();
  });

  it('navigates to item details when clicked', () => {
    renderWithProviders(<MenuItem item={mockMenuItem} />);

    const itemLink = screen.getByRole('link');
    expect(itemLink).toHaveAttribute('href', `/menu/${mockMenuItem.id}`);
  });
}); 