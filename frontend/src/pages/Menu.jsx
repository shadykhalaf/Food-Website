import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaStar } from 'react-icons/fa'

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState('all')
  
  const categories = [
    { id: 'all', name: 'All' },
    { id: 'breakfast', name: 'Breakfast' },
    { id: 'pizza', name: 'Pizza' },
    { id: 'burgers', name: 'Burgers' },
    { id: 'desserts', name: 'Desserts' },
    { id: 'drinks', name: 'Drinks' }
  ]
  
  const menuItems = [
    // Breakfast
    {
      id: 1,
      name: "Fried Eggs",
      description: "Made with eggs, lettuce, salt, oil and other ingredients.",
      price: "9.99",
      rating: 4.7,
      image: "/assets/eggs.png",
      category: "breakfast"
    },
    {
      id: 2,
      name: "Classic Waffles",
      description: "Made with eggs, lettuce, salt, oil and other ingredients.",
      price: "12.99",
      rating: 4.8,
      image: "/assets/waffles.png",
      category: "breakfast"
    },
    
    // Pizza
    {
      id: 3,
      name: "Hawaiian Pizza",
      description: "Made with eggs, lettuce, salt, oil and other ingredients.",
      price: "15.99",
      rating: 4.6,
      image: "/assets/hawaiian-pizza.png",
      category: "pizza"
    },
    
    // Burgers
    {
      id: 4,
      name: "Cheese Burger",
      description: "Made with eggs, lettuce, salt, oil and other ingredients.",
      price: "12.55",
      rating: 4.9,
      image: "/assets/cheese-burger.png",
      category: "burgers"
    },
    
    // Desserts
    {
      id: 5,
      name: "Butterscotch Cake",
      description: "Made with eggs, lettuce, salt, oil and other ingredients.",
      price: "20.99",
      rating: 4.9,
      image: "/assets/butterscotch.png",
      category: "desserts"
    },
    {
      id: 6,
      name: "Chocolate Icecream",
      description: "Made with eggs, lettuce, salt, oil and other ingredients.",
      price: "18.05",
      rating: 4.7,
      image: "/assets/icecream.png",
      category: "desserts"
    },
    
    // Drinks
    {
      id: 7,
      name: "Martinez Cocktail",
      description: "Made with eggs, lettuce, salt, oil and other ingredients.",
      price: "7.25",
      rating: 4.5,
      image: "/assets/martinez.png",
      category: "drinks"
    },
    {
      id: 8,
      name: "Mint Lemonade",
      description: "Made with eggs, lettuce, salt, oil and other ingredients.",
      price: "5.89",
      rating: 4.8,
      image: "/assets/mint.png",
      category: "drinks"
    }
  ]

  const filteredItems = activeCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory)

  return (
    <div className="menu page-padding">
      {/* Hero Section */}
      <section className="menu-hero py-5 bg-light text-center">
        <div className="container py-5">
          <motion.h1 
            className="display-4 fw-bold mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >Our <span className="text-primary">Menu</span></motion.h1>
          <motion.div 
            className="mx-auto" 
            style={{maxWidth: "700px"}}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <p className="lead">Explore our range of authentic Italian dishes prepared with love</p>
          </motion.div>
        </div>
      </section>
      
      {/* Menu Categories */}
      <section className="menu-categories py-4">
        <div className="container">
          <div className="category-buttons d-flex justify-content-center flex-wrap">
            {categories.map(category => (
              <motion.button
                key={category.id}
                className={`btn category-btn mx-2 mb-3 ${activeCategory === category.id ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setActiveCategory(category.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category.name}
              </motion.button>
            ))}
          </div>
        </div>
      </section>
      
      {/* Menu Items */}
      <section className="menu-items py-5">
        <div className="container">
          <div className="row">
            {filteredItems.map(item => (
              <motion.div 
                key={item.id} 
                className="col-lg-4 col-md-6 mb-4"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                viewport={{ once: true }}
              >
                <div className="menu-card bg-white p-3 rounded shadow-sm h-100">
                  <div className="menu-img-wrapper mb-3 text-center" style={{
                    height: "220px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "8px"
                  }}>
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="img-fluid menu-img" 
                      style={{
                        maxHeight: "100%",
                        width: "auto",
                        maxWidth: "100%",
                        objectFit: "contain",
                        padding: "10px"
                      }}
                    />
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="mb-0">{item.name}</h5>
                    <div className="rating d-flex align-items-center">
                      <FaStar className="text-warning me-1" />
                      <span>{item.rating}</span>
                    </div>
                  </div>
                  <p className="text-muted small mb-3">{item.description}</p>
                  <div className="d-flex justify-content-between align-items-center mt-auto">
                    <h5 className="text-primary mb-0">${item.price}</h5>
                    <button className="btn btn-sm btn-primary">Add to Cart</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Delivery Apps Section */}
      <section className="delivery-apps py-5 bg-light">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-4">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="mb-4">You can order through apps</h2>
                <p className="text-muted mb-4">Enjoy our delicious meals delivered right to your doorstep through your favorite food delivery services.</p>
              </motion.div>
            </div>
            <div className="col-lg-8">
              <div className="row g-4">
                <motion.div 
                  className="col-4 col-md-3"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="delivery-app-card bg-white p-3 rounded shadow-sm text-center">
                    <img src="/assets/ubereats.png" alt="Uber Eats" className="img-fluid delivery-logo" />
                  </div>
                </motion.div>
                <motion.div 
                  className="col-4 col-md-3"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="delivery-app-card bg-white p-3 rounded shadow-sm text-center">
                    <img src="/assets/grubhub.png" alt="Grubhub" className="img-fluid delivery-logo" />
                  </div>
                </motion.div>
                <motion.div 
                  className="col-4 col-md-3"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  <div className="delivery-app-card bg-white p-3 rounded shadow-sm text-center">
                    <img src="/assets/postmates.png" alt="Postmates" className="img-fluid delivery-logo" />
                  </div>
                </motion.div>
                <motion.div 
                  className="col-4 col-md-3"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <div className="delivery-app-card bg-white p-3 rounded shadow-sm text-center">
                    <img src="/assets/doordash.png" alt="DoorDash" className="img-fluid delivery-logo" />
                  </div>
                </motion.div>
                <motion.div 
                  className="col-4 col-md-3"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                  viewport={{ once: true }}
                >
                  <div className="delivery-app-card bg-white p-3 rounded shadow-sm text-center">
                    <img src="/assets/foodpanda.png" alt="Foodpanda" className="img-fluid delivery-logo" />
                  </div>
                </motion.div>
                <motion.div 
                  className="col-4 col-md-3"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                  viewport={{ once: true }}
                >
                  <div className="delivery-app-card bg-white p-3 rounded shadow-sm text-center">
                    <img src="/assets/deliveroo.png" alt="Deliveroo" className="img-fluid delivery-logo" />
                  </div>
                </motion.div>
                <motion.div 
                  className="col-4 col-md-3"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.7 }}
                  viewport={{ once: true }}
                >
                  <div className="delivery-app-card bg-white p-3 rounded shadow-sm text-center">
                    <img src="/assets/instacart.png" alt="Instacart" className="img-fluid delivery-logo" />
                  </div>
                </motion.div>
                <motion.div 
                  className="col-4 col-md-3"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.8 }}
                  viewport={{ once: true }}
                >
                  <div className="delivery-app-card bg-white p-3 rounded shadow-sm text-center">
                    <img src="/assets/justeat.png" alt="Just Eat" className="img-fluid delivery-logo" />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Menu