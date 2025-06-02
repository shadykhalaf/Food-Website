import { useEffect, useState } from 'react';
import { adminAPI } from '../services/api';
import { toast } from 'react-toastify';
import { FaCheck, FaTimes } from 'react-icons/fa';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getBookings();
      setBookings(res.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleStatus = async (id, status) => {
    try {
      await adminAPI.updateBookingStatus(id, status);
      toast.success(`Booking ${status}`);
      fetchBookings();
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error('Failed to update booking status');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Bookings</h2>
        <button className="btn btn-primary" onClick={fetchBookings}>
          Refresh
        </button>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted">No bookings found</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Table</th>
                <th>Date</th>
                <th>Time</th>
                <th>Guests</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(booking => (
                <tr key={booking.id}>
                  <td>{booking.user?.name}</td>
                  <td>{booking.table?.name}</td>
                  <td>{new Date(booking.booking_date).toLocaleDateString()}</td>
                  <td>{booking.booking_time}</td>
                  <td>{booking.number_of_guests}</td>
                  <td>
                    <span className={`badge bg-${booking.status === 'confirmed' ? 'success' : booking.status === 'cancelled' ? 'danger' : 'warning'}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td>
                    {booking.status === 'pending' && (
                      <div className="d-flex gap-2">
                        <button
                          className="action-btn btn-accept"
                          onClick={() => handleStatus(booking.id, 'confirmed')}
                        >
                          <FaCheck /> Accept
                        </button>
                        <button
                          className="action-btn btn-reject"
                          onClick={() => handleStatus(booking.id, 'cancelled')}
                        >
                          <FaTimes /> Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
