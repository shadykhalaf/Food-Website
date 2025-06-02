import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaEnvelope, FaLock, FaFacebook, FaGoogle } from 'react-icons/fa'
import { authAPI } from '../services/api'
import { toast } from 'react-toastify'

const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await authAPI.login(formData)
      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
        toast.success('Login successful!')
        navigate('/profile')
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error(error.response?.data?.message || 'Login failed. Please try again.')
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
                <h2 className="fw-bold mb-2">Welcome Back!</h2>
                <p className="text-muted">Login to your account to continue</p>
              </div>
              
              <form onSubmit={handleSubmit}>
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
                  <div className="d-flex justify-content-between">
                    <label className="form-label">Password</label>
                    <Link to="/forgot-password" className="text-decoration-none small">Forgot Password?</Link>
                  </div>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FaLock />
                    </span>
                    <input 
                      type="password" 
                      className="form-control" 
                      name="password" 
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                </div>
                
                <div className="mb-3 form-check">
                  <input type="checkbox" className="form-check-input" id="rememberMe" />
                  <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary w-100 py-2 mb-3"
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Login'}
                </button>
                
                <div className="text-center mb-3">
                  <p className="text-muted">Or login with</p>
                  <div className="social-login">
                    <button type="button" className="btn btn-outline-secondary me-2" onClick={() => window.location.href = 'http://localhost:8000/api/auth/google'}>
                      <FaGoogle className="me-2" /> Google
                    </button>
                    <button type="button" className="btn btn-outline-primary" onClick={() => window.location.href = 'http://localhost:8000/api/auth/facebook'}>
                      <FaFacebook className="me-2" /> Facebook
                    </button>
                  </div>
                </div>
              </form>
              
              <div className="text-center mt-4">
                <p className="mb-0">Don't have an account? <Link to="/register" className="text-decoration-none">Register Now</Link></p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login