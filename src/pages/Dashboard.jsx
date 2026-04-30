import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { Helmet } from 'react-helmet-async';

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (data?.user) {
        setUser(data.user);
      }

      setLoading(false);
    };

    getUser();
  }, []);

  if (loading) return <div className="p-4">Loading dashboard...</div>;

  if (!user) return <div className="p-4 text-danger">No user found</div>;

  return (
    <div className="container mt-5">
      <Helmet>
        <title>Dashboard</title>
        <link rel="shortcut icon" href="../../public/launchericon-192x192.png" type="image/x-icon" />
      </Helmet>
      <h2>Welcome to the Dashboard</h2>

      <div className="card p-4 col-md-6">
        <p><strong>Name:</strong> {user.user_metadata?.name || "N/A"}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.user_metadata?.phone || "N/A"}</p>
        <p><strong>City:</strong> {user.user_metadata?.city || "N/A"}</p>
        <p><strong>User ID:</strong> {user.id}</p>
      </div>
      <br />
      <button className="btn btn-primary me-2" onClick={() => navigate("/users")}>
        Go to User List
      </button>
    </div>
  );
}

export default Dashboard;