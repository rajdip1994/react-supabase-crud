import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

function EditUser() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        country: ''
    });

    const [preview, setPreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setForm({ ...form, image: file });
        setPreview(URL.createObjectURL(file));
    };

    useEffect(() => {
        const fetchUser = async () => {
            const { data } = await supabase
                .from('users')
                .select(`*, contact_details(*)`)
                .eq('id', id)
                .single();

            if (data) {
                const contact = data.contact_details?.[0] || {};

                setForm({
                    name: data.name || '',
                    email: data.email || '',
                    phone: contact.phone || '',
                    address: contact.address || '',
                    city: contact.city || '',
                    state: contact.state || '',
                    country: contact.country || ''
                });

                setPreview(data.image);
            }
        };

        fetchUser();
    }, [id]);

    const uploadImage = async () => {
        if (!form.image) return preview;

        const fileName = `user_${Date.now()}_${form.image.name}`;

        const { data, error } = await supabase.storage
            .from('user-images')
            .upload(fileName, form.image);

        if (error) {
            console.error("UPLOAD ERROR:", error);
            alert(error.message);
            return null;
        }

        console.log("UPLOAD SUCCESS:", data);

        const { data: publicUrlData } = supabase.storage
            .from('user-images')
            .getPublicUrl(fileName);

        return publicUrlData.publicUrl;
    };

    const validate = () => {
        let newErrors = {};

        if (!form.name.trim()) newErrors.name = "Required";

        if (!form.email.trim()) {
            newErrors.email = "Required";
        } else if (!/\S+@\S+\.\S+/.test(form.email)) {
            newErrors.email = "Invalid email";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const updateUser = async () => {
        if (!validate()) return;

        setLoading(true);

        const imageUrl = await uploadImage();

        // update user
        const { error: userError } = await supabase
            .from('users')
            .update({
                name: form.name,
                email: form.email,
                image: imageUrl
            })
            .eq('id', id);

        if (userError) {
            setLoading(false);
            alert('userError: ' + userError.message);
            return;
        }

        // upsert contact details
        const { error: contactError } = await supabase
            .from('contact_details')
            .update({
                phone: form.phone,
                address: form.address,
                city: form.city,
                state: form.state,
                country: form.country
            })
            .eq('user_id', id)

        setLoading(false);

        if (contactError) {
            alert(contactError.message);
            return;
        }

        navigate('/users');
    };

    return (
        <div className="container mt-5">

            <Helmet>
                <title>Edit User</title>
            </Helmet>

            <h2>Edit User</h2>

            {/* USER */}
            <div className="row mb-3">
                <div className="col-md-4">
                    <label>Name</label>
                    <input
                        name="name"
                        value={form.name}
                        placeholder='Name'
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>

                <div className="col-md-4">
                    <label>Email</label>
                    <input
                        name="email"
                        value={form.email}
                        placeholder='Email Address'
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <div className="col-md-4">
                    <label>Profile Image</label>
                    <input type="file" className="form-control" accept="image/*" onChange={handleImage} />

                    {preview && (
                        <img src={preview} width="120" className="mt-2 rounded" />
                    )}
                </div>
            </div>

            <hr />
            <h5>Contact Details</h5>

            {/* CONTACT */}
            <div className="row mb-3">
                <div className="col-md-6">
                    <label>Phone</label>
                    <input
                        name="phone"
                        value={form.phone}
                        placeholder='Phone Number'
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>

                <div className="col-md-6">
                    <label>City</label>
                    <input
                        name="city"
                        value={form.city}
                        placeholder='City'
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
            </div>

            <div className="row mb-3">
                <div className="col-md-6">
                    <label>State</label>
                    <input
                        name="state"
                        value={form.state}
                        placeholder='State'
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>

                <div className="col-md-6">
                    <label>Country</label>
                    <input
                        name="country"
                        value={form.country}
                        placeholder='Country'
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
            </div>

            <div className="mb-3">
                <label>Address</label>
                <textarea
                    name="address"
                    value={form.address}
                    placeholder='Address'
                    onChange={handleChange}
                    className="form-control"
                />
            </div>

            <button className="btn btn-primary" onClick={updateUser} disabled={loading}>
                {loading ? "Updating..." : "Update"}
            </button>

            <button className="btn btn-secondary ms-2" onClick={() => navigate('/users')}>
                Back
            </button>
        </div>
    );
}

export default EditUser;