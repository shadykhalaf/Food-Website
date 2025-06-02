import { Link } from 'react-router-dom'
import { FaFacebook, FaInstagram, FaTwitter, FaPhoneAlt, FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className="footer bg-dark text-white py-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 mb-4 mb-lg-0">
            <Link to="/" className="footer-logo d-block mb-3">
              <img src="/assets/logo.png" alt="FoodHut" height="40" />
            </Link>
            <p className="mb-4">Experience the best Italian cuisine with our authentic recipes, made with fresh ingredients sourced locally.</p>
            <div className="social-icons d-flex">
              <a href="#" className="social-icon me-3"><FaFacebook /></a>
              <a href="#" className="social-icon me-3"><FaInstagram /></a>
              <a href="#" className="social-icon"><FaTwitter /></a>
            </div>
          </div>
          
          <div className="col-lg-2 col-md-6 mb-4 mb-md-0">
            <h5 className="footer-heading mb-4">Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/" className="footer-link">Home</Link></li>
              <li className="mb-2"><Link to="/about" className="footer-link">About Us</Link></li>
              <li className="mb-2"><Link to="/menu" className="footer-link">Menu</Link></li>
              <li className="mb-2"><Link to="/book-table" className="footer-link">Book A Table</Link></li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-6 mb-4 mb-md-0">
            <h5 className="footer-heading mb-4">Help</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/privacy" className="footer-link">Privacy Policy</Link></li>
              <li className="mb-2"><Link to="/terms" className="footer-link">Terms & Conditions</Link></li>
              <li className="mb-2"><Link to="/faq" className="footer-link">FAQ</Link></li>
            </ul>
          </div>
          
          <div className="col-lg-4">
            <h5 className="footer-heading mb-4">Contact</h5>
            <ul className="list-unstyled contact-info">
              <li className="d-flex mb-3">
                <FaMapMarkerAlt className="contact-icon me-3 mt-1" />
                <p className="mb-0">123 Food Street, Little Italy, New York, NY 10001</p>
              </li>
              <li className="d-flex mb-3">
                <FaPhoneAlt className="contact-icon me-3 mt-1" />
                <p className="mb-0">(123) 456-7890</p>
              </li>
              <li className="d-flex">
                <FaEnvelope className="contact-icon me-3 mt-1" />
                <p className="mb-0">info@foodhut.com</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom mt-5 pt-4">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <p className="mb-0">&copy; {new Date().getFullYear()} FoodHut. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer