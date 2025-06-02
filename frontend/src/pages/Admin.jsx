import { useState } from 'react'

const Admin = () => {
  const [activeTab, setActiveTab] = useState('bookings')
  
  // Sample data - in a real app this would come from your backend
  const [bookings, setBookings] = useState([
    { id: 1, name: 'John Doe', date: '2023-10-15', time: '19:00', guests: 4, status: 'confirmed' },
    // More bookings...
  ])
  
  const [menuItems, setMenuItems] = useState([
    { id: 1, name: 'Garlic Bread', category: 'starters', price: '$5.99', available: true },
    // More menu items...
  ])

  const handleDeleteBooking = (id) => {
    setBookings(bookings.filter(booking => booking.id !== id))
  }

  const handleToggleItem = (id) => {
    setMenuItems(menuItems.map(item => 
      item.id === id ? { ...item, available: !item.available } : item
    ))
  }

  return (
    <div className="admin">
      <section className="admin-header">
        <h1>Admin Panel</h1>
      </section>
      
      <section className="admin-tabs">
        <button 
          className={activeTab === 'bookings' ? 'active' : ''}
          onClick={() => setActiveTab('bookings')}
        >
          Bookings
        </button>
        <button 
          className={activeTab === 'menu' ? 'active' : ''}
          onClick={() => setActiveTab('menu')}
        >
          Menu Management
        </button>
        <button 
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
      </section>
      
      <section className="admin-content">
        {activeTab === 'bookings' && (
          <div className="bookings-table">
            <h2>Recent Bookings</h2>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Guests</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(booking => (
                  <tr key={booking.id}>
                    <td>{booking.id}</td>
                    <td>{booking.name}</td>
                    <td>{booking.date}</td>
                    <td>{booking.time}</td>
                    <td>{booking.guests}</td>
                    <td>
                      <span className={`status ${booking.status}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn-edit">Edit</button>
                      <button 
                        className="btn-delete"
                        onClick={() => handleDeleteBooking(booking.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {activeTab === 'menu' && (
          <div className="menu-management">
            <h2>Menu Items</h2>
            <button className="btn-primary">Add New Item</button>
            
            <div className="menu-items">
              {menuItems.map(item => (
                <div key={item.id} className="menu-item">
                  <div className="item-info">
                    <h3>{item.name}</h3>
                    <p>{item.category} • {item.price}</p>
                  </div>
                  <div className="item-actions">
                    <button className="btn-edit">Edit</button>
                    <button 
                      className={`btn-toggle ${item.available ? 'active' : ''}`}
                      onClick={() => handleToggleItem(item.id)}
                    >
                      {item.available ? 'Available' : 'Unavailable'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'users' && (
          <div className="users-management">
            <h2>User Management</h2>
            {/* User management content would go here */}
          </div>
        )}
      </section>
    </div>
  )
}

export default Admin