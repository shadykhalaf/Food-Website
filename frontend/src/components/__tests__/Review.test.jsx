import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import Review from '../Review';
import * as api from '../../services/api';

// Mock the API service
jest.mock('../../services/api', () => ({
  reviewAPI: {
    createReview: jest.fn(),
    getReviews: jest.fn(),
    updateReview: jest.fn(),
    deleteReview: jest.fn()
  },
  menuAPI: {
    getMenuItem: jest.fn()
  }
}));

const mockReview = {
  id: 1,
  user_id: 1,
  menu_item_id: 1,
  order_id: 1,
  rating: 5,
  comment: 'Great food and service!',
  created_at: '2024-03-20T10:00:00Z',
  user: {
    name: 'Test User'
  }
};

const mockMenuItem = {
  id: 1,
  name: 'Test Item',
  description: 'Test Description',
  price: 9.99,
  average_rating: 4.5,
  total_reviews: 10
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

describe('Review Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    api.menuAPI.getMenuItem.mockResolvedValue({ data: mockMenuItem });
    api.reviewAPI.getReviews.mockResolvedValue({ data: [mockReview] });
  });

  test('renders review form correctly', () => {
    renderWithProviders(<Review menuItemId={1} />);
    
    expect(screen.getByLabelText(/rating/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/comment/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit review/i })).toBeInTheDocument();
  });

  test('validates required fields', async () => {
    renderWithProviders(<Review menuItemId={1} />);
    
    const submitButton = screen.getByRole('button', { name: /submit review/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/rating is required/i)).toBeInTheDocument();
      expect(screen.getByText(/comment is required/i)).toBeInTheDocument();
    });
  });

  test('validates rating range', async () => {
    renderWithProviders(<Review menuItemId={1} />);
    
    const ratingInput = screen.getByLabelText(/rating/i);
    fireEvent.change(ratingInput, { target: { value: '6' } });
    
    const submitButton = screen.getByRole('button', { name: /submit review/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/rating must be between 1 and 5/i)).toBeInTheDocument();
    });
  });

  test('submits review successfully', async () => {
    api.reviewAPI.createReview.mockResolvedValue({ data: mockReview });
    
    renderWithProviders(<Review menuItemId={1} />);
    
    const ratingInput = screen.getByLabelText(/rating/i);
    const commentInput = screen.getByLabelText(/comment/i);
    
    fireEvent.change(ratingInput, { target: { value: '5' } });
    fireEvent.change(commentInput, { target: { value: 'Great food and service!' } });
    
    const submitButton = screen.getByRole('button', { name: /submit review/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(api.reviewAPI.createReview).toHaveBeenCalledWith(1, {
        rating: 5,
        comment: 'Great food and service!'
      });
      expect(screen.getByText(/review submitted successfully/i)).toBeInTheDocument();
    });
  });

  test('displays error message when submission fails', async () => {
    api.reviewAPI.createReview.mockRejectedValue(new Error('Failed to submit review'));
    
    renderWithProviders(<Review menuItemId={1} />);
    
    const ratingInput = screen.getByLabelText(/rating/i);
    const commentInput = screen.getByLabelText(/comment/i);
    
    fireEvent.change(ratingInput, { target: { value: '5' } });
    fireEvent.change(commentInput, { target: { value: 'Great food and service!' } });
    
    const submitButton = screen.getByRole('button', { name: /submit review/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/failed to submit review/i)).toBeInTheDocument();
    });
  });

  test('displays existing reviews', async () => {
    renderWithProviders(<Review menuItemId={1} />);

    await waitFor(() => {
      expect(screen.getByText('Great food and service!')).toBeInTheDocument();
      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByText('5 stars')).toBeInTheDocument();
    });
  });

  test('allows user to edit their review', async () => {
    api.reviewAPI.updateReview.mockResolvedValue({
      data: { ...mockReview, rating: 4, comment: 'Updated review' }
    });
    
    renderWithProviders(<Review menuItemId={1} />);

    await waitFor(() => {
      const editButton = screen.getByRole('button', { name: /edit/i });
      fireEvent.click(editButton);
    });

    const ratingInput = screen.getByLabelText(/rating/i);
    const commentInput = screen.getByLabelText(/comment/i);
    
    fireEvent.change(ratingInput, { target: { value: '4' } });
    fireEvent.change(commentInput, { target: { value: 'Updated review' } });
    
    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(api.reviewAPI.updateReview).toHaveBeenCalledWith(1, {
        rating: 4,
        comment: 'Updated review'
      });
      expect(screen.getByText('Updated review')).toBeInTheDocument();
    });
  });

  test('allows user to delete their review', async () => {
    api.reviewAPI.deleteReview.mockResolvedValue({});
    
    renderWithProviders(<Review menuItemId={1} />);

    await waitFor(() => {
      const deleteButton = screen.getByRole('button', { name: /delete/i });
      fireEvent.click(deleteButton);
    });

    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(api.reviewAPI.deleteReview).toHaveBeenCalledWith(1);
      expect(screen.queryByText('Great food and service!')).not.toBeInTheDocument();
    });
  });

  test('displays loading state while fetching reviews', () => {
    api.reviewAPI.getReviews.mockImplementation(() => new Promise(() => {}));
    
    renderWithProviders(<Review menuItemId={1} />);
    
    expect(screen.getByText(/loading reviews/i)).toBeInTheDocument();
  });

  test('displays error state when fetching reviews fails', async () => {
    api.reviewAPI.getReviews.mockRejectedValue(new Error('Failed to fetch reviews'));
    
    renderWithProviders(<Review menuItemId={1} />);

    await waitFor(() => {
      expect(screen.getByText(/failed to fetch reviews/i)).toBeInTheDocument();
    });
  });
}); 