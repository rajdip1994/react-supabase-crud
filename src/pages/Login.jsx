import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!email || !password) {
            setError("All fields required");
            return;
        }

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            setError(error.message);
            return;
        }

        navigate('/dashboard');
    };

    useEffect(() => {
        const check = async () => {
            const { data } = await supabase.auth.getSession();
            if (data.session) {
                navigate("/dashboard");
            }
        };
        check();
    }, []);

    return (
        <div className="container mt-5">
            <Helmet>
                <title>Login</title>
            </Helmet>

            <div className="card p-4 col-md-4 mx-auto">
                <h4>Login</h4>

                <input
                    className="form-control mb-2"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    className="form-control mb-2"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                />

                {error && <div className="text-danger">{error}</div>}

                <button className="btn btn-primary w-100" onClick={handleLogin}>
                    Login
                </button>

                <p className="mt-3 text-center">
                    No account? <Link to="/signup">Signup</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;