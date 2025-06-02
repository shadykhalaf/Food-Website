import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaHistory, FaSignOutAlt } from 'react-icons/fa'
import { profileAPI, authAPI } from '../services/api'
import { toast } from 'react-toastify'
import { useNavigate, Link } from 'react-router-dom'
import '../styles/Profile.css'

const Profile = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  })
  const [recentBookings, setRecentBookings] = useState([])
  const [recentOrders, setRecentOrders] = useState([])
  const [recentReviews, setRecentReviews] = useState([])
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await authAPI.getUser()
        fetchUserProfile()
      } catch (error) {
        console.error('Auth check failed:', error)
        navigate('/login')
      }
    }
    
    checkAuth()
  }, [navigate])

  useEffect(() => {
    if (activeTab === 'bookings') {
      fetchRecentBookings()
    } else if (activeTab === 'orders') {
      fetchRecentOrders()
    } else if (activeTab === 'reviews') {
      fetchRecentReviews()
    }
  }, [activeTab])

  const fetchUserProfile = async () => {
    try {
      const response = await profileAPI.getProfile()
      console.log('Profile response:', response.data)
      setUser(response.data)
      setFormData({
        name: response.data.name || '',
        email: response.data.email || '',
        phone: response.data.phone || '',
        address: response.data.address || ''
      })
    } catch (error) {
      console.error('Error fetching profile:', error)
      toast.error('Failed to load profile data')
    } finally {
      setLoading(false)
    }
  }

  const fetchRecentBookings = async () => {
    try {
      const response = await profileAPI.getBookings()
      console.log('Bookings response:', response.data)
      setRecentBookings(response.data || [])
    } catch (error) {
      console.error('Error fetching bookings:', error)
      toast.error('Failed to load bookings')
      setRecentBookings([])
    }
  }

  const fetchRecentOrders = async () => {
    try {
      const response = await profileAPI.getOrders()
      console.log('Orders response:', response.data)
      setRecentOrders(response.data || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Failed to load orders')
      setRecentOrders([])
    }
  }

  const fetchRecentReviews = async () => {
    try {
      const response = await profileAPI.getReviews()
      console.log('Reviews response:', response.data)
      setRecentReviews(response.data || [])
    } catch (error) {
      console.error('Error fetching reviews:', error)
      toast.error('Failed to load reviews')
      setRecentReviews([])
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = async () => {
    try {
      await profileAPI.deleteProfileImage()
      setImagePreview(null)
      setImageFile(null)
      fetchUserProfile()
      toast.success('Profile image removed successfully')
    } catch (error) {
      console.error('Error removing image:', error)
      toast.error('Failed to remove profile image')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name)
      formDataToSend.append('email', formData.email)
      formDataToSend.append('phone', formData.phone || '')
      formDataToSend.append('address', formData.address || '')
      
      if (imageFile) {
        formDataToSend.append('profile_image', imageFile)
      }
      
      await profileAPI.updateProfile(formDataToSend)
      setIsEditing(false)
      fetchUserProfile()
      toast.success('Profile updated successfully')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error(error.response?.data?.message || 'Failed to update profile')
    }
  }

  const handleLogout = async () => {
    try {
      await authAPI.logout()
      localStorage.removeItem('token')
      navigate('/login')
      toast.success('Logged out successfully')
    } catch (error) {
      console.error('Logout error:', error)
      localStorage.removeItem('token')
      navigate('/login')
    }
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-page page-padding py-5">
      <div className="container">
        <motion.div 
          className="profile-card bg-white rounded shadow-sm p-4 p-md-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="profile-header text-center mb-4">
            <div className="profile-avatar mb-3">
              {user?.profile_image ? (
                <img
                  src={`http://localhost:8000/storage/${user.profile_image}?t=${user.updated_at || Date.now()}`}
                  alt="Profile"
                  style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                <FaUser size={64} className="text-primary" />
              )}
            </div>
            <h2 className="fw-bold">{user?.name}</h2>
            <p className="text-muted">{user?.email}</p>
          </div>
          
          <ul className="nav nav-tabs mb-4">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                Profile
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'bookings' ? 'active' : ''}`}
                onClick={() => setActiveTab('bookings')}
              >
                Bookings
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => setActiveTab('orders')}
              >
                Orders
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'reviews' ? 'active' : ''}`}
                onClick={() => setActiveTab('reviews')}
              >
                Reviews
              </button>
            </li>
          </ul>
          
          <div className="tab-content">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="tab-pane fade show active">
                {isEditing ? (
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4 text-center">
                      <div className="profile-image-upload mb-3">
                        <div className="avatar-preview mb-2">
                          {imagePreview ? (
                            <img 
                              src={imagePreview} 
                              alt="Profile Preview" 
                              style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover' }}
                            />
                          ) : user?.profile_image ? (
                            <img
                              src={`http://localhost:8000/storage/${user.profile_image}?t=${Date.now()}`}
                              alt="Profile"
                              style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover' }}
                            />
                          ) : (
                            <FaUser size={64} className="text-primary" />
                          )}
                        </div>
                        <div className="d-flex justify-content-center gap-2">
                          <label className="btn btn-sm btn-outline-primary">
                            Choose Image
                            <input 
                              type="file" 
                              className="d-none" 
                              accept="image/*"
                              onChange={handleImageChange}
                            />
                          </label>
                          {(user?.profile_image || imagePreview) && (
                            <button 
                              type="button" 
                              className="btn btn-sm btn-outline-danger"
                              onClick={handleRemoveImage}
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label">Name</label>
                      <div className="input-group">
                        <span className="input-group-text"><FaUser /></span>
                        <input 
                          type="text" 
                          className="form-control" 
                          name="name" 
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <div className="input-group">
                        <span className="input-group-text"><FaEnvelope /></span>
                        <input 
                          type="email" 
                          className="form-control" 
                          name="email" 
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label">Phone</label>
                      <div className="input-group">
                        <span className="input-group-text"><FaPhone /></span>
                        <input 
                          type="text" 
                          className="form-control" 
                          name="phone" 
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="form-label">Address</label>
                      <div className="input-group">
                        <span className="input-group-text"><FaMapMarkerAlt /></span>
                        <input 
                          type="text" 
                          className="form-control" 
                          name="address" 
                          value={formData.address}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    
                    <div className="d-flex gap-2 justify-content-end">
                      <button 
                        type="button" 
                        className="btn btn-outline-secondary"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        Save Changes
                      </button>
                    </div>
                  </form>
                ) : (
                  <div>
                    <div className="profile-info">
                      <div className="info-item mb-3">
                        <div className="d-flex align-items-center mb-1">
                          <FaUser className="text-primary me-2" />
                          <h6 className="mb-0">Name</h6>
                        </div>
                        <p className="ms-4 mb-0">{user?.name}</p>
                      </div>
                      
                      <div className="info-item mb-3">
                        <div className="d-flex align-items-center mb-1">
                          <FaEnvelope className="text-primary me-2" />
                          <h6 className="mb-0">Email</h6>
                        </div>
                        <p className="ms-4 mb-0">{user?.email}</p>
                      </div>
                      
                      <div className="info-item mb-3">
                        <div className="d-flex align-items-center mb-1">
                          <FaPhone className="text-primary me-2" />
                          <h6 className="mb-0">Phone</h6>
                        </div>
                        <p className="ms-4 mb-0">{user?.phone || 'Not provided'}</p>
                      </div>
                      
                      <div className="info-item mb-4">
                        <div className="d-flex align-items-center mb-1">
                          <FaMapMarkerAlt className="text-primary me-2" />
                          <h6 className="mb-0">Address</h6>
                        </div>
                        <p className="ms-4 mb-0">{user?.address || 'Not provided'}</p>
                      </div>
                    </div>
                    
                    <div className="d-flex justify-content-between">
                      <button 
                        className="btn btn-outline-danger"
                        onClick={handleLogout}
                      >
                        <FaSignOutAlt className="me-2" />
                        Logout
                      </button>
                      <button 
                        className="btn btn-primary"
                        onClick={() => setIsEditing(true)}
                      >
                        <FaEdit className="me-2" />
                        Edit Profile
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div className="tab-pane fade show active">
                <h4 className="mb-4">
                  <FaHistory className="me-2" />
                  Recent Bookings
                </h4>
                
                {recentBookings.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Time</th>
                          <th>Guests</th>
                          <th>Table</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentBookings.map(booking => (
                          <tr key={booking.id}>
                            <td>{new Date(booking.booking_date).toLocaleDateString()}</td>
                            <td>{booking.booking_time}</td>
                            <td>{booking.number_of_guests}</td>
                            <td>{booking.table?.name || 'Any'}</td>
                            <td>
                              <span className={`badge ${
                                booking.status === 'confirmed' ? 'bg-success' : 
                                booking.status === 'pending' ? 'bg-warning' : 
                                booking.status === 'cancelled' ? 'bg-danger' : 'bg-secondary'
                              }`}>
                                {booking.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="mb-3">You don't have any bookings yet.</p>
                    <Link to="/book-table" className="btn btn-primary">
                      Book a Table
                    </Link>
                  </div>
                )}
              </div>
            )}
            
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="tab-pane fade show active">
                <h4 className="mb-4">
                  <FaHistory className="me-2" />
                  Recent Orders
                </h4>
                
                {recentOrders.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Date</th>
                          <th>Total</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentOrders.map(order => (
                          <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{new Date(order.created_at).toLocaleDateString()}</td>
                            <td>${order.total.toFixed(2)}</td>
                            <td>
                              <span className={`badge ${
                                order.status === 'completed' ? 'bg-success' : 
                                order.status === 'pending' ? 'bg-warning' : 
                                order.status === 'cancelled' ? 'bg-danger' : 'bg-secondary'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="mb-3">You don't have any orders yet.</p>
                    <Link to="/menu" className="btn btn-primary">
                      Order Now
                    </Link>
                  </div>
                )}
              </div>
            )}
            
            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="tab-pane fade show active">
                <h4 className="mb-4">
                  <FaHistory className="me-2" />
                  Recent Reviews
                </h4>
                
                {recentReviews.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Restaurant</th>
                          <th>Rating</th>
                          <th>Comment</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentReviews.map(review => (
                          <tr key={review.id}>
                            <td>{review.restaurant.name}</td>
                            <td>
                              <span className="text-warning">
                                {Array.from({ length: review.rating }, () => '★').join('')}
                              </span>
                            </td>
                            <td>{review.comment}</td>
                            <td>{new Date(review.created_at).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="mb-3">You don't have any reviews yet.</p>
                    <Link to="/restaurants" className="btn btn-primary">
                      Write a Review
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Profile
