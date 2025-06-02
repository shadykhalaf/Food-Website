import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { FaBars, FaTimes, FaUser, FaShoppingCart } from 'react-icons/fa'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  
  // Function to check if the link is active
  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') {
      return true
    }
    // For other pages, check if the current path starts with the link path (except for home)
    return path !== '/' && location.pathname.startsWith(path)
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light fixed-top bg-white">
      <div className="container">
        <Link to="/" className="navbar-brand">
          <img src="/assets/logo.png" alt="FoodHut Logo" height="40" />
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
        
        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`}>
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link 
                to="/" 
                className={`nav-link position-relative ${isActive('/') ? 'active fw-bold' : ''}`}
                style={isActive('/') ? { 
                  color: '#fd7e14'
                } : {}}
              >
                Home
                {isActive('/') && (
                  <span className="active-indicator position-absolute" style={{
                    height: '2px',
                    background: '#fd7e14',
                    width: '100%',
                    bottom: '0',
                    left: '0'
                  }}></span>
                )}
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/about" 
                className={`nav-link position-relative ${isActive('/about') ? 'active fw-bold' : ''}`}
                style={isActive('/about') ? { 
                  color: '#fd7e14'
                } : {}}
              >
                About Us
                {isActive('/about') && (
                  <span className="active-indicator position-absolute" style={{
                    height: '2px',
                    background: '#fd7e14',
                    width: '100%',
                    bottom: '0',
                    left: '0'
                  }}></span>
                )}
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/menu" 
                className={`nav-link position-relative ${isActive('/menu') ? 'active fw-bold' : ''}`}
                style={isActive('/menu') ? { 
                  color: '#fd7e14'
                } : {}}
              >
                Our Menu
                {isActive('/menu') && (
                  <span className="active-indicator position-absolute" style={{
                    height: '2px',
                    background: '#fd7e14',
                    width: '100%',
                    bottom: '0',
                    left: '0'
                  }}></span>
                )}
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/book-table" 
                className={`nav-link position-relative ${isActive('/book-table') ? 'active fw-bold' : ''}`}
                style={isActive('/book-table') ? { 
                  color: '#fd7e14'
                } : {}}
              >
                Book A Table
                {isActive('/book-table') && (
                  <span className="active-indicator position-absolute" style={{
                    height: '2px',
                    background: '#fd7e14',
                    width: '100%',
                    bottom: '0',
                    left: '0'
                  }}></span>
                )}
              </Link>
            </li>
            <li className="nav-item ms-lg-3">
              <Link to="/login" className="btn btn-outline-primary">
                <FaUser className="me-2" /> Login
              </Link>
            </li>
            <li className="nav-item ms-2">
              <Link to="/cart" className="btn btn-primary">
                <FaShoppingCart />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar