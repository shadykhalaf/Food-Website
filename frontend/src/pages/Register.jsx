import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaUser, FaEnvelope, FaLock, FaFacebook, FaGoogle } from 'react-icons/fa'
import { authAPI } from '../services/api'
import { toast } from 'react-toastify'

const Register = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: ''
  })
  const [error, setError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Clear password error when user types
    if ((name === 'password' || name === 'confirmPassword') && passwordError) {
      setPasswordError('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords don't match!")
      setLoading(false)
      return
    }

    try {
      // Create a new object without confirmPassword for the API request
      const dataToSend = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword, // Change to password_confirmation
        phone: formData.phone,
        address: formData.address
      }
      
      await authAPI.register(dataToSend)
      toast.success('Registration successful! Please log in.')
      navigate('/login')
    } catch (error) {
      console.error('Registration error:', error)
      toast.error(error.response?.data?.message || 'Registration failed.')
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors
        if (errors.password) {
          setPasswordError(errors.password[0])
        }
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page page-padding py-5">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <motion.div 
              className="auth-form bg-white p-4 p-md-5 rounded shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-center mb-4">
                <h2 className="fw-bold mb-2">Create an Account</h2>
                <p className="text-muted">Join us and enjoy our delicious food</p>
              </div>
              
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FaUser />
                    </span>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="name" 
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FaEnvelope />
                    </span>
                    <input 
                      type="email" 
                      className="form-control" 
                      name="email" 
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FaLock />
                    </span>
                    <input 
                      type="password" 
                      className="form-control" 
                      name="password" 
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                  <small className="text-muted">Password must be at least 8 characters</small>
                </div>
                
                <div className="mb-4">
                  <label className="form-label">Confirm Password</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FaLock />
                    </span>
                    <input 
                      type="password" 
                      className={`form-control ${passwordError ? 'is-invalid' : ''}`}
                      name="confirmPassword" 
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                  {passwordError && <div className="invalid-feedback d-block">{passwordError}</div>}
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Phone</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FaUser />
                    </span>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="phone" 
                      placeholder="Enter your phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Address</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FaUser />
                    </span>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="address" 
                      placeholder="Enter your address"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div className="mb-3 form-check">
                  <input type="checkbox" className="form-check-input" id="agreeTerms" required />
                  <label className="form-check-label" htmlFor="agreeTerms">
                    I agree to the <Link to="/terms" className="text-decoration-none">Terms & Conditions</Link>
                  </label>
                </div>
                
                <button type="submit" className="btn btn-primary w-100 py-2 mb-3" disabled={loading}>
                  {loading ? 'Registering...' : 'Register'}
                </button>
                
                <div className="text-center mb-3">
                  <p className="text-muted">Or register with</p>
                  <div className="social-login">
                  <button type="button" className="btn btn-outline-secondary me-2" onClick={() => window.location.href = 'http://localhost:8000/auth/google'}>
                      <FaGoogle className="me-2" /> Google
                    </button>
                    <button type="button" className="btn btn-outline-primary" onClick={() => window.location.href = 'http://localhost:8000/auth/facebook'}>
                      <FaFacebook className="me-2" /> Facebook
                    </button>
                  </div>
                </div>
              </form>
              
              <div className="text-center mt-4">
                <p className="mb-0">Already have an account? <Link to="/login" className="text-decoration-none">Login</Link></p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
