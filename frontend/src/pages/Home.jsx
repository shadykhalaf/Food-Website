import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FaArrowRight, FaStar } from 'react-icons/fa'

const Home = () => {
  const popularDishes = [
    {
      id: 1,
      name: "Chicken Burger",
      description: "Chicken patty, cheese, lettuce, tomato",
      price: "10.99",
      rating: 4.5,
      image: "/assets/burger.png"
    },
    {
      id: 2,
      name: "Pasta Carbonara",
      description: "Creamy sauce, bacon, parmesan cheese",
      price: "12.99",
      rating: 4.7,
      image: "/assets/pasta.png"
    },
    {
      id: 3,
      name: "Veggie Pizza",
      description: "Bell peppers, mushrooms, onions, olives",
      price: "14.99",
      rating: 4.6,
      image: "/assets/pizza.png"
    },
  ]

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero py-5 page-padding position-relative" style={{
        backgroundImage: `url('/assets/hero-food.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '80vh'
      }}>
        <div className="overlay position-absolute" style={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)'
        }}></div>
        <div className="container position-relative">
          <div className="row justify-content-center">
            <motion.div 
              className="col-lg-8 text-center"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h5 className="text-primary mb-3">Best in Town</h5>
              <h1 className="mb-4 text-white">Enjoy The Authentic <br /><span className="text-primary">Italian Cuisine</span></h1>
              <p className="mb-4 text-white">Indulge in the flavors of Italy with our authentic dishes prepared with fresh ingredients and traditional recipes.</p>
              <div className="d-flex gap-3 justify-content-center">
                <Link to="/menu" className="btn btn-primary px-4 py-2">Explore Menu</Link>
                <Link to="/book-table" className="btn btn-secondary px-4 py-2">Book a Table</Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Browse Our Menu Section */}
      <section className="browse-menu py-5">
        <div className="container">
          <div className="row justify-content-center mb-5">
            <div className="col-lg-6 text-center">
              <h2 className="section-title text-center">Browse Our Menu</h2>
            </div>
          </div>
          <div className="row">
            <motion.div 
              className="col-md-3"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="menu-category-card text-center p-4 border rounded h-100">
                <div className="icon-wrapper mb-4">
                  <div className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
                    <img src="/assets/breakfast-icon.png" alt="Breakfast" width="40" />
                  </div>
                </div>
                <h4 className="mb-3">Breakfast</h4>
                <p className="text-muted mb-4">In the new era of technology we look in the future with certainty and pride for our life.</p>
                <Link to="/menu" className="btn btn-outline-primary btn-sm">Explore Menu</Link>
              </div>
            </motion.div>
            
            <motion.div 
              className="col-md-3"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="menu-category-card text-center p-4 border rounded h-100">
                <div className="icon-wrapper mb-4">
                  <div className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
                    <img src="/assets/main-dishes-icon.png" alt="Main Dishes" width="40" />
                  </div>
                </div>
                <h4 className="mb-3">Main Dishes</h4>
                <p className="text-muted mb-4">In the new era of technology we look in the future with certainty and pride for our life.</p>
                <Link to="/menu" className="btn btn-outline-primary btn-sm">Explore Menu</Link>
              </div>
            </motion.div>
            
            <motion.div 
              className="col-md-3"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="menu-category-card text-center p-4 border rounded h-100">
                <div className="icon-wrapper mb-4">
                  <div className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
                    <img src="/assets/drinks-icon.png" alt="Drinks" width="40" />
                  </div>
                </div>
                <h4 className="mb-3">Drinks</h4>
                <p className="text-muted mb-4">In the new era of technology we look in the future with certainty and pride for our life.</p>
                <Link to="/menu" className="btn btn-outline-primary btn-sm">Explore Menu</Link>
              </div>
            </motion.div>
            
            <motion.div 
              className="col-md-3"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="menu-category-card text-center p-4 border rounded h-100">
                <div className="icon-wrapper mb-4">
                  <div className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
                    <img src="/assets/desserts-icon.png" alt="Desserts" width="40" />
                  </div>
                </div>
                <h4 className="mb-3">Desserts</h4>
                <p className="text-muted mb-4">In the new era of technology we look in the future with certainty and pride for our life.</p>
                <Link to="/menu" className="btn btn-outline-primary btn-sm">Explore Menu</Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="about-us-section py-5 bg-light">
        <div className="container">
          <div className="row align-items-center">
            <motion.div 
              className="col-lg-6 position-relative mb-4 mb-lg-0"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <img 
                src="/assets/healthy-food.png" 
                alt="Healthy Food" 
                className="img-fluid rounded shadow-lg" 
                style={{ width: '100%', height: '460px', objectFit: 'cover' }}
              />
              <div className="contact-card bg-dark text-white p-4 rounded shadow position-absolute" 
                style={{ 
                  bottom: '30px', 
                  right: '-30px',
                  maxWidth: '320px',
                  zIndex: 2 
                }}
              >
                <h5 className="mb-4">Come and visit us</h5>
                <div className="d-flex mb-3 align-items-center">
                  <i className="fa fa-phone me-3"></i>
                  <span>(414) 857 - 0107</span>
                </div>
                <div className="d-flex mb-3 align-items-center">
                  <i className="fa fa-envelope me-3"></i>
                  <span>happytummy@restaurant.com</span>
                </div>
                <div className="d-flex align-items-start">
                  <i className="fa fa-map-marker-alt me-3 mt-1"></i>
                  <span>837 W. Marshall Lane Marshalltown, IA 50158, Los Angeles</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="col-lg-6 ps-lg-5"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h2 className="mb-4 display-6 fw-bold">We provide healthy food for your family.</h2>
              <p className="mb-4">
                Our story began with a vision to create a unique dining experience that merges fine dining, exceptional service, and a vibrant ambiance. Rooted in city's rich culinary culture, we aim to honor our local roots while infusing a global palate.
              </p>
              <p className="mb-4">
                At [place], we believe that dining is not just about food, but also about the overall experience. Our staff, renowned for their warmth and dedication, strives to make every visit an unforgettable event.
              </p>
              <Link to="/about" className="btn btn-outline-dark rounded-pill px-4 py-2">
                More About Us
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home