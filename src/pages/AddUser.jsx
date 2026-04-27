import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

function AddUser() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    // Validation function
    const validate = () => {
        let newErrors = {};

        if (!name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Invalid email format";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const addUser = async () => {
        if (!validate()) return; // stop if invalid

        const { error } = await supabase
            .from('users')
            .insert([{ name, email }]);

        if (error) {
            if (error.message.includes('duplicate')) {
                setErrors({ email: "Email already exists" });
            } else {
                alert(error.message);
            }
            return;
        }

        navigate('/');
    };

    return (
        <div className="container mt-5">

            <Helmet>
                <title>Add User</title>
                <meta name="description" content="Add user page" />
            </Helmet>

            <h2>Add User</h2>

            <div className="row mb-3">
                <div className="col-md-6">
                    <label htmlFor="">Name</label>
                    <input
                        className={`form-control mb-1 ${errors.name ? 'is-invalid' : ''}`}
                        placeholder="Name"
                        required
                        onChange={(e) => setName(e.target.value)}
                    />
                    {errors.name && <div className="text-danger mb-2">{errors.name}</div>}
                </div>
                <div className="col-md-6">
                    <label htmlFor="">Email</label>
                    <input
                        className={`form-control mb-1 ${errors.email ? 'is-invalid' : ''}`}
                        placeholder="Email"
                        required
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {errors.email && <div className="text-danger mb-2">{errors.email}</div>}
                </div>
            </div>

            <button className="btn btn-success" onClick={addUser}>
                Save
            </button>
            <button style={{ marginLeft: '10px' }} className="btn btn-secondary" onClick={() => navigate('/')}>
                Back
            </button>
        </div>
    );
}

export default AddUser;