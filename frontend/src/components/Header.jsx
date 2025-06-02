import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaUser, FaSignOutAlt, FaSignInAlt, FaUtensils } from 'react-icons/fa';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="bg-dark text-white py-3">
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-dark">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <FaUtensils className="me-2" />
            <span className="fw-bold">Delicious</span>
          </Link>
          
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/menu">Menu</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/book-table">Book a Table</Link>
              </li>
              
              {isAuthenticated ? (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/profile">
                      <FaUser className="me-1" />
                      {user?.name || 'Profile'}
                    </Link>
                  </li>
                  {user?.role === 'admin' && (
                    <li className="nav-item">
                      <Link className="nav-link" to="/admin">Admin</Link>
                    </li>
                  )}
                  <li className="nav-item">
                    <button 
                      className="nav-link btn btn-link" 
                      onClick={handleLogout}
                    >
                      <FaSignOutAlt className="me-1" />
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    <FaSignInAlt className="me-1" />
                    Login
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;