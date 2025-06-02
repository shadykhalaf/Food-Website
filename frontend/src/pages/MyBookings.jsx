import { useEffect, useState } from 'react'
import { profileAPI } from '../services/api'
import { toast } from 'react-toastify'

const MyBookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const response = await profileAPI.getBookings()
      setBookings(response.data)
    } catch (error) {
      console.error('Error fetching bookings:', error)
      toast.error('Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="container py-5 text-center">Loading...</div>

  return (
    <div className="container py-5">
      <h2 className="mb-4">My Bookings</h2>
      {bookings.length === 0 ? (
        <p className="text-muted">No bookings found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Table</th>
                <th>Date</th>
                <th>Time</th>
                <th>Guests</th>
                <th>Status</th>
                <th>Special Requests</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(booking => (
                <tr key={booking.id}>
                  <td>{booking.table?.name || 'Table ' + booking.table_id}</td>
                  <td>{new Date(booking.booking_date).toLocaleDateString()}</td>
                  <td>{booking.booking_time}</td>
                  <td>{booking.number_of_guests}</td>
                  <td>
                    <span className={`badge bg-${booking.status === 'confirmed' ? 'success' : booking.status === 'cancelled' ? 'danger' : 'warning'}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td>{booking.special_requests || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default MyBookings
