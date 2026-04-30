import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

function Layout({ children }) {
  const navigate = useNavigate();

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">

          <Link className="navbar-brand" to="/dashboard">
            React Supabase App
          </Link>

          <div>
            <Link className="btn btn-outline-light me-2" to="/dashboard">
              Dashboard
            </Link>

            <Link className="btn btn-outline-light me-2" to="/users">
              Users
            </Link>

            <button className="btn btn-danger" onClick={logout}>
              Logout
            </button>
          </div>

        </div>
      </nav>

      {/* PAGE CONTENT */}
      <div className="container mt-4">
        {children}
      </div>
    </>
  );
}

export default Layout;