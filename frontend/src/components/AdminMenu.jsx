import { useEffect, useState } from 'react';
import { adminAPI } from '../services/api';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaImage } from 'react-icons/fa';

const AdminMenu = () => {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    image: null,
    is_available: true
  });

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getMenuItems();
      setMenu(res.data);
    } catch (error) {
      console.error('Error fetching menu:', error);
      toast.error('Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) {
          form.append(key, formData[key]);
        }
      });

      if (editingItem) {
        await adminAPI.updateMenuItem(editingItem.id, form);
        toast.success('Menu item updated successfully');
      } else {
        await adminAPI.addMenuItem(form);
        toast.success('Menu item added successfully');
      }

      setShowForm(false);
      setEditingItem(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        category_id: '',
        image: null,
        is_available: true
      });
      fetchMenu();
    } catch (error) {
      console.error('Error saving menu item:', error);
      toast.error(editingItem ? 'Failed to update menu item' : 'Failed to add menu item');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category_id: item.category_id,
      image: null,
      is_available: item.is_available
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      try {
        await adminAPI.deleteMenuItem(id);
        toast.success('Menu item deleted successfully');
        fetchMenu();
      } catch (error) {
        console.error('Error deleting menu item:', error);
        toast.error('Failed to delete menu item');
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Menu Items</h2>
        <div className="d-flex gap-2">
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            <FaPlus /> {showForm ? 'Cancel' : 'Add New Item'}
          </button>
          <button className="btn btn-secondary" onClick={fetchMenu}>
            Refresh
          </button>
        </div>
      </div>

      {showForm && (
        <div className="admin-form mb-4">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows="3"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Price</label>
              <input
                type="number"
                className="form-control"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                step="0.01"
                min="0"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Image</label>
              <input
                type="file"
                className="form-control"
                name="image"
                onChange={handleInputChange}
                accept="image/*"
              />
            </div>

            <div className="form-group">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  name="is_available"
                  checked={formData.is_available}
                  onChange={handleInputChange}
                  id="isAvailable"
                />
                <label className="form-check-label" htmlFor="isAvailable">
                  Available
                </label>
              </div>
            </div>

            <button type="submit" className="btn btn-primary">
              {editingItem ? 'Update Item' : 'Add Item'}
            </button>
          </form>
        </div>
      )}

      {menu.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted">No menu items found</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {menu.map(item => (
                <tr key={item.id}>
                  <td>
                    {item.image ? (
                      <img
                        src={`http://localhost:8000/storage/${item.image}`}
                        alt={item.name}
                        style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: '4px' }}
                      />
                    ) : (
                      <div className="menu-item-placeholder">
                        <FaImage />
                      </div>
                    )}
                  </td>
                  <td>{item.name}</td>
                  <td>{item.description}</td>
                  <td>${item.price}</td>
                  <td>
                    <span className={`badge bg-${item.is_available ? 'success' : 'danger'}`}>
                      {item.is_available ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        className="action-btn btn-edit"
                        onClick={() => handleEdit(item)}
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        className="action-btn btn-delete"
                        onClick={() => handleDelete(item.id)}
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminMenu;
