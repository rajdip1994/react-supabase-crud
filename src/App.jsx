import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';


function App() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('users')
      .select(`
      *,
      contact_details (*)
    `);

    if (error) console.log(error);

    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = async (id) => {
    await supabase.from('users').delete().eq('id', id);
    fetchUsers();
  };

  const openModal = (user) => {
    setSelectedUser(user);
  };

  const filteredUsers = users.filter((u) =>
    `${u.name} ${u.email}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="container mt-5">

      <Helmet>
        <title>Users List</title>
      </Helmet>

      <h2>Users List</h2>

      <Link to="/add" className="btn btn-primary mb-3">
        Add User
      </Link>

      <div className="row mb-3">
        <div className="col-md-4">
          <input
            type="search"
            className="form-control"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th width="200">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers?.map((u) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>
                <button
                  className="btn btn-info btn-sm me-2"
                  onClick={() => openModal(u)}
                >
                  View
                </button>

                <Link
                  to={`/edit/${u.id}`}
                  className="btn btn-warning btn-sm me-2"
                >
                  Edit
                </Link>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteUser(u.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* BACKDROP (put BEFORE modal) */}
      {selectedUser && <div className="modal-backdrop fade show"></div>}

      {/* MODAL (inside return) */}
      {selectedUser && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">User Details</h5>
                <button
                  className="btn-close"
                  onClick={() => setSelectedUser(null)}
                ></button>
              </div>

              <div className="modal-body">

                <h6 className="mb-3 text-primary">Basic Info</h6>
                <p><strong>Name:</strong> {selectedUser.name}</p>
                <p><strong>Email:</strong> {selectedUser.email}</p>

                <hr />

                <h6 className="mb-3 text-success">Contact Details</h6>

                {selectedUser.contact_details?.length > 0 ? (
                  <>
                    <p><strong>Phone:</strong> {selectedUser.contact_details[0].phone}</p>
                    <p><strong>Address:</strong> {selectedUser.contact_details[0].address}</p>
                    <p><strong>City:</strong> {selectedUser.contact_details[0].city}</p>
                    <p><strong>State:</strong> {selectedUser.contact_details[0].state}</p>
                    <p><strong>Country:</strong> {selectedUser.contact_details[0].country}</p>
                  </>
                ) : (
                  <p className="text-muted">No contact details available</p>
                )}

              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setSelectedUser(null)}
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;