import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { toast } from 'react-toastify';
import { FaCheck, FaTimes, FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import '../styles/AdminPanel.css';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMenuForm, setShowMenuForm] = useState(false);
  const [menuForm, setMenuForm] = useState({
    name: '',
    description: '',
    price: '',
    is_available: true
  });

  useEffect(() => {
    loadTabData(activeTab);
  }, [activeTab]);

  const loadTabData = async (tab) => {
    setLoading(true);
    try {
      switch (tab) {
        case 'bookings':
          const bookingsResponse = await adminAPI.getBookings();
          setBookings(bookingsResponse.data);
          break;
        case 'users':
          const usersResponse = await adminAPI.getUsers();
          setUsers(usersResponse.data);
          break;
        case 'menu':
          const menuResponse = await adminAPI.getMenuItems();
          setMenuItems(menuResponse.data);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(`Error loading ${tab}:`, error);
      toast.error(`Failed to load ${tab}. ${error.response?.data?.message || 'Please try again later.'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingStatus = async (id, status) => {
    try {
      await adminAPI.updateBookingStatus(id, status);
      toast.success(`Booking ${status === 'confirmed' ? 'accepted' : 'rejected'}`);
      loadTabData('bookings');
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('Failed to update booking status');
    }
  };

  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.addMenuItem(menuForm);
      toast.success('Menu item added successfully');
      setShowMenuForm(false);
      setMenuForm({
        name: '',
        description: '',
        price: '',
        is_available: true
      });
      loadTabData('menu');
    } catch (error) {
      console.error('Error adding menu item:', error);
      toast.error('Failed to add menu item');
    }
  };

  const handleDeleteMenuItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      try {
        await adminAPI.deleteMenuItem(id);
        toast.success('Menu item deleted successfully');
        loadTabData('menu');
      } catch (error) {
        console.error('Error deleting menu item:', error);
        toast.error('Failed to delete menu item');
      }
    }
  };

  return (
    <div className="admin-panel">
      <h1>Admin Panel</h1>
      
      <div className="admin-tabs">
        <button 
          className={activeTab === 'bookings' ? 'active' : ''} 
          onClick={() => setActiveTab('bookings')}
        >
          Bookings
        </button>
        <button 
          className={activeTab === 'users' ? 'active' : ''} 
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button 
          className={activeTab === 'menu' ? 'active' : ''} 
          onClick={() => setActiveTab('menu')}
        >
          Menu
        </button>
      </div>
      
      <div className="admin-content">
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading...</p>
          </div>
        ) : (
          <>
            {activeTab === 'bookings' && (
              <div className="bookings-section">
                <h2>Bookings Management</h2>
                {bookings.length > 0 ? (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>User</th>
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
                          <td>{booking.user?.name || 'Unknown'}</td>
                          <td>{booking.booking_date || booking.date}</td>
                          <td>{booking.booking_time || booking.time}</td>
                          <td>{booking.number_of_guests || booking.guests}</td>
                          <td>
                            <span className={`badge ${
                              booking.status === 'confirmed' ? 'bg-success' : 
                              booking.status === 'cancelled' ? 'bg-danger' : 
                              'bg-warning'
                            }`}>
                              {booking.status}
                            </span>
                          </td>
                          <td>
                            {booking.status === 'pending' && (
                              <div className="d-flex gap-2">
                                <button 
                                  className="btn btn-success btn-sm"
                                  onClick={() => handleBookingStatus(booking.id, 'confirmed')}
                                >
                                  <FaCheck className="me-1" /> Accept
                                </button>
                                <button 
                                  className="btn btn-danger btn-sm"
                                  onClick={() => handleBookingStatus(booking.id, 'cancelled')}
                                >
                                  <FaTimes className="me-1" /> Reject
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No bookings found.</p>
                )}
              </div>
            )}
            
            {activeTab === 'users' && (
              <div className="users-section">
                <h2>Users Management</h2>
                {users.length > 0 ? (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Joined</th>
                        <th>Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(user => (
                        <tr key={user.id}>
                          <td>{user.id}</td>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>{new Date(user.created_at).toLocaleDateString()}</td>
                          <td>
                            <span className={`badge ${user.is_admin ? 'bg-purple' : 'bg-secondary'}`}>
                              {user.is_admin ? 'Admin' : 'User'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No users found.</p>
                )}
              </div>
            )}
            
            {activeTab === 'menu' && (
              <div className="menu-section">
                <div className="section-header">
                  <h2>Menu Management</h2>
                  <button 
                    className="add-button"
                    onClick={() => setShowMenuForm(true)}
                  >
                    <FaPlus /> Add New Item
                  </button>
                </div>
                
                {showMenuForm && (
                  <div className="card mb-4">
                    <div className="card-header bg-light">
                      <h5 className="mb-0">{menuForm.id ? 'Edit Menu Item' : 'Add New Menu Item'}</h5>
                    </div>
                    <div className="card-body">
                      <form onSubmit={handleAddMenuItem}>
                        <div className="mb-3">
                          <label htmlFor="name" className="form-label">Name</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            id="name" 
                            value={menuForm.name} 
                            onChange={(e) => setMenuForm({...menuForm, name: e.target.value})}
                            required
                          />
                        </div>
                        
                        <div className="mb-3">
                          <label htmlFor="description" className="form-label">Description</label>
                          <textarea 
                            className="form-control" 
                            id="description" 
                            rows="3"
                            value={menuForm.description} 
                            onChange={(e) => setMenuForm({...menuForm, description: e.target.value})}
                            required
                          ></textarea>
                        </div>
                        
                        <div className="mb-3">
                          <label htmlFor="price" className="form-label">Price ($)</label>
                          <input 
                            type="number" 
                            className="form-control" 
                            id="price" 
                            step="0.01" 
                            min="0" 
                            value={menuForm.price} 
                            onChange={(e) => setMenuForm({...menuForm, price: e.target.value})}
                            required
                          />
                        </div>
                        
                        <div className="form-check mb-3">
                          <input 
                            className="form-check-input" 
                            type="checkbox" 
                            id="is_available" 
                            checked={menuForm.is_available} 
                            onChange={(e) => setMenuForm({...menuForm, is_available: e.target.checked})}
                          />
                          <label className="form-check-label" htmlFor="is_available">
                            Available
                          </label>
                        </div>
                        
                        <div className="d-flex justify-content-end gap-2">
                          <button 
                            type="button" 
                            className="btn btn-secondary" 
                            onClick={() => setShowMenuForm(false)}
                          >
                            Cancel
                          </button>
                          <button type="submit" className="btn btn-primary">
                            {menuForm.id ? 'Update' : 'Save'} Menu Item
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
                
                {menuItems.length > 0 ? (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {menuItems.map(item => (
                        <tr key={item.id}>
                          <td>{item.id}</td>
                          <td>{item.name}</td>
                          <td>{item.description}</td>
                          <td>${item.price}</td>
                          <td>
                            <div className="action-buttons">
                              <button 
                                className="delete"
                                onClick={() => handleDeleteMenuItem(item.id)}
                              >
                                <FaTrash /> Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No menu items found.</p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
