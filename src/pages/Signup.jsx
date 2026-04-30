import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

function Signup() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        city: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});

    // Handle input
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Validation
    const validate = () => {
        let err = {};

        if (!form.name.trim()) err.name = "Name required";
        if (!form.email.trim()) err.email = "Email required";
        if (!/\S+@\S+\.\S+/.test(form.email)) err.email = "Invalid email";

        if (!form.password) err.password = "Password required";
        if (form.password.length < 6) err.password = "Min 6 characters";

        if (form.password !== form.confirmPassword)
            err.confirmPassword = "Passwords do not match";

        if (!form.phone.trim()) err.phone = "Phone required";
        if (!form.city.trim()) err.city = "City required";

        setErrors(err);
        return Object.keys(err).length === 0;
    };

    // Signup
    const handleSignup = async () => {
        if (!validate()) return;

        const { error } = await supabase.auth.signUp({
            email: form.email,
            password: form.password,
            options: {
                data: {
                    name: form.name,
                    phone: form.phone,
                    city: form.city
                }
            }
        });

        if (error) {
            alert(error.message);
            return;
        }

        alert("Signup successful. Check your email to confirm account and login.");
        navigate('/login');
    };

    // Already logged in check
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
                <title>Signup</title>
            </Helmet>

            <div className="card p-4 col-md-5 mx-auto shadow">
                <h4 className="mb-3 text-center">Signup</h4>

                {/* Name */}
                <input
                    name="name"
                    className={`form-control mb-1 ${errors.name && 'is-invalid'}`}
                    placeholder="Full Name"
                    onChange={handleChange}
                />
                {errors.name && <div className="text-danger mb-2">{errors.name}</div>}

                {/* Email */}
                <input
                    name="email"
                    className={`form-control mb-1 ${errors.email && 'is-invalid'}`}
                    placeholder="Email"
                    onChange={handleChange}
                />
                {errors.email && <div className="text-danger mb-2">{errors.email}</div>}

                {/* Phone */}
                <input
                    name="phone"
                    className={`form-control mb-1 ${errors.phone && 'is-invalid'}`}
                    placeholder="Phone"
                    onChange={handleChange}
                />
                {errors.phone && <div className="text-danger mb-2">{errors.phone}</div>}

                {/* City */}
                <input
                    name="city"
                    className={`form-control mb-1 ${errors.city && 'is-invalid'}`}
                    placeholder="City"
                    onChange={handleChange}
                />
                {errors.city && <div className="text-danger mb-2">{errors.city}</div>}

                {/* Password */}
                <input
                    type="password"
                    name="password"
                    className={`form-control mb-1 ${errors.password && 'is-invalid'}`}
                    placeholder="Password"
                    onChange={handleChange}
                />
                {errors.password && <div className="text-danger mb-2">{errors.password}</div>}

                {/* Confirm Password */}
                <input
                    type="password"
                    name="confirmPassword"
                    className={`form-control mb-1 ${errors.confirmPassword && 'is-invalid'}`}
                    placeholder="Confirm Password"
                    onChange={handleChange}
                />
                {errors.confirmPassword && (
                    <div className="text-danger mb-2">{errors.confirmPassword}</div>
                )}

                <button className="btn btn-success w-100 mt-2" onClick={handleSignup}>
                    Signup
                </button>

                <p className="mt-3 text-center">
                    Already have account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
}

export default Signup;