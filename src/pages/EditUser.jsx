import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

function EditUser() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    // Fetch existing data
    useEffect(() => {
        const fetchUser = async () => {
            const { data } = await supabase
                .from('users')
                .select('*')
                .eq('id', id)
                .single();

            if (data) {
                setName(data.name);
                setEmail(data.email);
            }
        };

        fetchUser();
    }, [id]);

    // Update
    const updateUser = async () => {
        await supabase
            .from('users')
            .update({ name, email })
            .eq('id', id);

        navigate('/');
    };

    return (
        <div className="container mt-5">

            <Helmet>
                <title>Edit User</title>
                <meta name="description" content="Add user page" />
            </Helmet>
            <h2>Edit User</h2>

            <div className="row mb-3">
                <div className="col-md-6">
                    <label htmlFor="">Name</label>
                    <input
                        className="form-control"
                        placeholder="Name"
                        value={name}
                        required
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="col-md-6">
                    <label htmlFor="">Email</label>
                    <input
                        className="form-control"
                        placeholder="Email"
                        value={email}
                        required
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
            </div>


            <button className="btn btn-primary" onClick={updateUser}>
                Update
            </button>
            <button style={{ marginLeft: '10px' }} className="btn btn-secondary" onClick={() => navigate('/')}>
                Back
            </button>
        </div>
    );
}

export default EditUser;