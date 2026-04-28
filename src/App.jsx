import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Papa from 'papaparse';
import { useRef } from 'react';

function App() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('users')
      .select(`*, contact_details (*)`);

    if (error) console.log(error);

    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // const deleteUser = async (id) => {
  //   if (!window.confirm("Are you sure you want to delete this user?")) return;

  //   await supabase.from('users').delete().eq('id', id);
  //   fetchUsers();
  // };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    // delete contact details first
    const { error: contactError } = await supabase
      .from('contact_details')
      .delete()
      .eq('user_id', id);

    if (contactError) {
      alert(contactError.message);
      return;
    }

    // then delete user
    const { error: userError } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (userError) {
      alert(userError.message);
      return;
    }

    fetchUsers();
  };

  const openModal = (user) => {
    setSelectedUser(user);
  };

  const filteredUsers = users.filter((u) =>
    `${u.name} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  );

  // CSV IMPORT FUNCTION
  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          for (let row of results.data) {
            // basic validation
            if (!row.name || !row.email) continue;

            // insert user
            const { data: user, error: userError } = await supabase
              .from('users')
              .insert([{ name: row.name, email: row.email }])
              .select()
              .single();

            if (userError) {
              console.log("User insert error:", userError.message);
              continue;
            }

            // insert contact
            await supabase.from('contact_details').insert([{
              user_id: user.id,
              phone: row.phone || '',
              address: row.address || '',
              city: row.city || '',
              state: row.state || '',
              country: row.country || ''
            }]);
          }

          alert("CSV Imported Successfully!");
          fetchUsers();

        } catch (err) {
          console.error(err);
          alert("Error importing CSV");
        }

        setUploading(false);
      }
    });
  };

  const fileInputRef = useRef();

  const downloadSampleCSV = () => {
    const csv = `name,email,phone,address,city,state,country
Raj Ghosal,raj1@gmail.com,9876543210,Street 1,Kolkata,WB,India
Amit Das,amit@gmail.com,9876543211,Street 2,Delhi,DL,India
Riya Sen,riya@gmail.com,9876543212,Street 3,Mumbai,MH,India
John Doe,john@gmail.com,9876543213,Street 4,Bangalore,KA,India
Jane Smith,jane@gmail.com,9876543214,Street 5,Chennai,TN,India
Arjun Roy,arjun@gmail.com,9876543215,Street 6,Pune,MH,India
Priya Sharma,priya@gmail.com,9876543216,Street 7,Jaipur,RJ,India
Rahul Verma,rahul@gmail.com,9876543217,Street 8,Hyderabad,TS,India
Sneha Paul,sneha@gmail.com,9876543218,Street 9,Goa,GA,India
Karan Mehta,karan@gmail.com,9876543219,Street 10,Ahmedabad,GJ,India`;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'users_sample.csv';
    link.click();
  };

  return (
    <div className="container mt-5">

      <Helmet>
        <title>Users List</title>
      </Helmet>

      <h2>Users List</h2>

      <div className="d-flex gap-2 mb-3">

        <Link to="/add" className="btn btn-primary">
          Add User
        </Link>

        {/* Import Button */}
        <button
          className="btn btn-success"
          onClick={() => fileInputRef.current.click()}
        >
          Import CSV
        </button>

        {/* Download Sample */}
        <button
          className="btn btn-secondary"
          onClick={downloadSampleCSV}
        >
          Download Sample CSV
        </button>

        {/* Hidden File Input */}
        <input
          type="file"
          accept=".csv"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleCSVUpload}
        />

        {uploading && <span className="text-primary">Importing...</span>}
      </div>

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
          {filteredUsers.map((u) => (
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

      {/* Modal */}
      {selectedUser && <div className="modal-backdrop fade show"></div>}

      {selectedUser && (
        <div className="modal fade show d-block">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5>User Details</h5>
                <button className="btn-close" onClick={() => setSelectedUser(null)}></button>
              </div>

              <div className="modal-body">
                <h6 className="mb-3 text-primary">Basic Info</h6>

                <p><b>Name:</b> {selectedUser.name}</p>
                <p><b>Email:</b> {selectedUser.email}</p>

                <hr />

                <h6 className="mb-3 text-success">Contact Details</h6>

                {selectedUser.contact_details?.length > 0 ? (
                  <>
                    <p><b>Phone:</b> {selectedUser.contact_details[0].phone}</p>
                    <p><b>City:</b> {selectedUser.contact_details[0].city}</p>
                    <p><b>State:</b> {selectedUser.contact_details[0].state}</p>
                    <p><b>Country:</b> {selectedUser.contact_details[0].country}</p>
                    <p><b>Address:</b> {selectedUser.contact_details[0].address}</p>
                  </>
                ): (
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