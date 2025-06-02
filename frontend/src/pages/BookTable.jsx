import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaCalendarAlt, FaUsers, FaClock, FaUtensils } from 'react-icons/fa'
import { bookingAPI } from '../services/api'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const BookTable = () => {
  const navigate = useNavigate()
  const [tables, setTables] = useState([])
  const [formData, setFormData] = useState({
    table_id: '',
    booking_date: '',
    booking_time: '',
    number_of_guests: 2,
    special_requests: '',
    email: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTables()
  }, [])

  const fetchTables = async () => {
    try {
      const response = await bookingAPI.getTables()
      setTables(response.data)
    } catch (error) {
      console.error('Error fetching tables:', error)
      toast.error('Failed to load tables')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await bookingAPI.createBooking(formData)
      toast.success('Booking created successfully!')
      navigate('/profile')
    } catch (error) {
      console.error('Booking error:', error)
      toast.error(error.response?.data?.message || 'Failed to create booking')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="book-table page-padding">
      {/* Hero Section */}
      <section className="booking-hero py-5 bg-light text-center">
        <div className="container py-5">
          <motion.h1 
            className="display-4 fw-bold mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >Book A <span className="text-primary">Table</span></motion.h1>
          <motion.div 
            className="mx-auto" 
            style={{maxWidth: "700px"}}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <p className="lead">Reserve your table for a delightful dining experience</p>
          </motion.div>
        </div>
      </section>
      
      {/* Booking Form Section */}
      <section className="booking-form-section py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <motion.div 
                className="booking-info pe-lg-5"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="section-title">Make a Reservation</h2>
                <p className="mb-4">Book your table in advance to secure your spot. Our restaurant is often fully booked, especially on weekends.</p>
                
                <div className="booking-features">
                  <div className="booking-feature d-flex mb-4">
                    <div className="feature-icon me-3">
                      <FaCalendarAlt className="text-primary" size={24} />
                    </div>
                    <div>
                      <h5>Opening Hours</h5>
                      <p className="mb-0">Monday - Friday: 11:00 AM - 10:00 PM<br />
                      Saturday - Sunday: 10:00 AM - 11:00 PM</p>
                    </div>
                  </div>
                  
                  <div className="booking-feature d-flex mb-4">
                    <div className="feature-icon me-3">
                      <FaUsers className="text-primary" size={24} />
                    </div>
                    <div>
                      <h5>Group Bookings</h5>
                      <p className="mb-0">For parties larger than 8 people, please contact us directly at (123) 456-7890.</p>
                    </div>
                  </div>
                  
                  <div className="booking-feature d-flex">
                    <div className="feature-icon me-3">
                      <FaUtensils className="text-primary" size={24} />
                    </div>
                    <div>
                      <h5>Special Events</h5>
                      <p className="mb-0">Planning a special celebration? Contact us for custom event packages.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
            
            <div className="col-lg-6">
              <motion.div 
                className="booking-form bg-white p-4 rounded shadow"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <form onSubmit={handleSubmit}>
                  <h4 className="mb-4">Reservation Details</h4>
                  
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input 
                      type="email" 
                      className="form-control" 
                      name="email" 
                      value={formData.email}
                      onChange={handleChange}
                      required 
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Select Table</label>
                    <select 
                      className="form-select" 
                      name="table_id" 
                      value={formData.table_id}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a table</option>
                      {tables.map(table => (
                        <option key={table.id} value={table.id}>
                          Table {table.name} - {table.capacity} seats
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-md-6 mb-3 mb-md-0">
                      <label className="form-label">Date</label>
                      <div className="input-group">
                        <span className="input-group-text"><FaCalendarAlt /></span>
                        <input 
                          type="date" 
                          className="form-control" 
                          name="booking_date" 
                          value={formData.booking_date}
                          onChange={handleChange}
                          required 
                        />
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <label className="form-label">Time</label>
                      <div className="input-group">
                        <span className="input-group-text"><FaClock /></span>
                        <input 
                          type="time" 
                          className="form-control" 
                          name="booking_time" 
                          value={formData.booking_time}
                          onChange={handleChange}
                          required 
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Number of Guests</label>
                    <div className="input-group">
                      <span className="input-group-text"><FaUsers /></span>
                      <select 
                        className="form-select" 
                        name="number_of_guests" 
                        value={formData.number_of_guests}
                        onChange={handleChange}
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                          <option key={num} value={num}>{num} {num === 1 ? 'Person' : 'People'}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="form-label">Special Requests</label>
                    <textarea 
                      className="form-control" 
                      name="special_requests" 
                      value={formData.special_requests}
                      onChange={handleChange}
                      rows="4"
                      placeholder="Any dietary requirements or special occasions?"
                    ></textarea>
                  </div>
                  
                  <button 
                    type="submit" 
                    className="btn btn-primary w-100 py-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Booking...' : 'Book Now'}
                  </button>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default BookTable