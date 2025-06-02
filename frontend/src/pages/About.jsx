import { motion } from 'framer-motion'
import { FaLeaf, FaUtensils, FaUserTie } from 'react-icons/fa'

const About = () => {
  const teamMembers = [
    {
      id: 1,
      name: "Marco Rossi",
      role: "Head Chef",
      image: "/assets/chef1.png",
      description: "With over 15 years of experience in Italian cuisine, Chef Marco brings authentic flavors from his hometown in Naples."
    },
    {
      id: 2,
      name: "Elena Romano",
      role: "Sous Chef",
      image: "/assets/chef2.png",
      description: "Elena specializes in pasta-making and has perfected traditional recipes passed down through generations."
    },
    {
      id: 3,
      name: "Daniel Smith",
      role: "Restaurant Manager",
      image: "/assets/manager.png",
      description: "Daniel ensures every guest receives exceptional service during their dining experience."
    }
  ];

  return (
    <div className="about page-padding">
      {/* Hero Section */}
      <section className="about-hero py-5 bg-light text-center">
        <div className="container py-5">
          <motion.h1 
            className="display-4 fw-bold mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >About <span className="text-primary">Bistro Bliss</span></motion.h1>
          <motion.div 
            className="mx-auto" 
            style={{maxWidth: "700px"}}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <p className="lead">We are passionate about delivering exceptional food experiences with authentic Italian cuisine</p>
          </motion.div>
        </div>
      </section>
      
      {/* Story Section */}
      <section className="py-5">
        <div className="container">
          <div className="row align-items-center">
            <motion.div 
              className="col-lg-6 mb-4 mb-lg-0"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="section-title">Our Story</h2>
              <p>Founded in 2010, FoodHut began as a small family restaurant with a big dream - to bring the authentic taste of Italy to every table. What started as a passion project has grown into a beloved dining destination known for quality food and exceptional service.</p>
              <p>Each dish we serve carries the traditions and flavors that have been perfected through generations. Our commitment to using locally-sourced, fresh ingredients ensures that every bite tells a story of quality and passion.</p>
            </motion.div>
            <motion.div 
              className="col-lg-6"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <img src="/assets/restaurant.png" alt="Restaurant Interior" className="img-fluid rounded shadow" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title text-center">Our Values</h2>
            <p className="mx-auto" style={{maxWidth: "700px"}}>The principles that guide everything we do</p>
          </div>
          <div className="row">
            <motion.div 
              className="col-md-4 mb-4 mb-md-0"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="text-center p-4">
                <div className="value-icon-wrapper mb-3">
                  <FaLeaf className="value-icon" />
                </div>
                <h4>Fresh Ingredients</h4>
                <p>We source only the freshest ingredients from local farmers and suppliers.</p>
              </div>
            </motion.div>
            <motion.div 
              className="col-md-4 mb-4 mb-md-0"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="text-center p-4">
                <div className="value-icon-wrapper mb-3">
                  <FaUtensils className="value-icon" />
                </div>
                <h4>Authentic Recipes</h4>
                <p>Our dishes are prepared using traditional recipes and cooking methods.</p>
              </div>
            </motion.div>
            <motion.div 
              className="col-md-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="text-center p-4">
                <div className="value-icon-wrapper mb-3">
                  <FaUserTie className="value-icon" />
                </div>
                <h4>Exceptional Service</h4>
                <p>We are committed to providing outstanding hospitality to every guest.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title text-center">What Our Customers Say</h2>
          </div>
          <div className="row">
            <motion.div 
              className="col-md-4 mb-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="testimonial-card bg-light p-4 rounded h-100">
                <h5 className="text-primary mb-3">"The best restaurant"</h5>
                <p className="mb-4">Last night, we dined at place and were simply blown away. From the moment we stepped in, we were enveloped in an inviting atmosphere and greeted with warm smiles.</p>
                <div className="d-flex align-items-center">
                  <img 
                    src="/assets/sophia-avatar.jpg" 
                    alt="Sophie Robson" 
                    className="rounded-circle me-3"
                    style={{width: "50px", height: "50px", objectFit: "cover"}}
                  />
                  <div>
                    <h6 className="mb-0">Sophia Robson</h6>
                    <small className="text-muted">Los Angeles, CA</small>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="col-md-4 mb-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="testimonial-card bg-light p-4 rounded h-100">
                <h5 className="text-primary mb-3">"Simply delicious"</h5>
                <p className="mb-4">Place exceeded my expectations on all fronts. The ambience was cozy and relaxed, making it a perfect venue for our anniversary dinner. Each dish was prepared and beautifully presented.</p>
                <div className="d-flex align-items-center">
                  <img 
                    src="/assets/matt-avatar.jpg" 
                    alt="Matt Cannon" 
                    className="rounded-circle me-3"
                    style={{width: "50px", height: "50px", objectFit: "cover"}}
                  />
                  <div>
                    <h6 className="mb-0">Matt Cannon</h6>
                    <small className="text-muted">San Diego, CA</small>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="col-md-4 mb-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="testimonial-card bg-light p-4 rounded h-100">
                <h5 className="text-primary mb-3">"One of a kind restaurant"</h5>
                <p className="mb-4">The culinary experience at place is first to none. The atmosphere is vibrant, the food - nothing short of extraordinary. The food was the highlight of our evening. Highly recommended.</p>
                <div className="d-flex align-items-center">
                  <img 
                    src="/assets/andy-avatar.jpg" 
                    alt="Andy Smith" 
                    className="rounded-circle me-3"
                    style={{width: "50px", height: "50px", objectFit: "cover"}}
                  />
                  <div>
                    <h6 className="mb-0">Andy Smith</h6>
                    <small className="text-muted">San Francisco, CA</small>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About