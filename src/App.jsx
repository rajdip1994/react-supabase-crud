import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';


function App() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const { data } = await supabase.from('users').select('*');
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = async (id) => {
    await supabase.from('users').delete().eq('id', id);
    fetchUsers();
  };

  return (
    <div className="container mt-5">
      <Helmet>
        <title>All Users List</title>
        <meta name="description" content="User listing page" />
      </Helmet>

      <h2>All Users List</h2>

      <Link to="/add" className="btn btn-primary mb-3">
        Add User
      </Link>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th width="150">Action</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((u) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>
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
    </div>
  );
}

export default App;