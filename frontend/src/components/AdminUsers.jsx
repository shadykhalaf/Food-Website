import { useEffect, useState } from 'react';
import { adminAPI } from '../services/api';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaPhone, FaCalendarAlt } from 'react-icons/fa';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getUsers();
      setUsers(res.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
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
        <h2 className="mb-0">Users</h2>
        <button className="btn btn-primary" onClick={fetchUsers}>
          Refresh
        </button>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted">No users found</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Joined</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      {user.profile_image ? (
                        <img
                          src={`http://localhost:8000/storage/${user.profile_image}`}
                          alt={user.name}
                          className="rounded-circle"
                          style={{ width: 32, height: 32, objectFit: 'cover' }}
                        />
                      ) : (
                        <div className="user-avatar">
                          <FaUser />
                        </div>
                      )}
                      <span>{user.name}</span>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <FaEnvelope className="text-muted" />
                      <span>{user.email}</span>
                    </div>
                  </td>
                  <td>
                    {user.phone ? (
                      <div className="d-flex align-items-center gap-2">
                        <FaPhone className="text-muted" />
                        <span>{user.phone}</span>
                      </div>
                    ) : (
                      <span className="text-muted">Not provided</span>
                    )}
                  </td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <FaCalendarAlt className="text-muted" />
                      <span>{new Date(user.created_at).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge bg-${user.is_admin ? 'primary' : 'secondary'}`}>
                      {user.is_admin ? 'Admin' : 'User'}
                    </span>
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

export default AdminUsers;
