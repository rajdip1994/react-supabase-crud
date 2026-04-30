import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

function AddUser() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        country: '',
        image: null
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

    const uploadImage = async () => {
        if (!form.image) return null;

        const fileName = `user_${Date.now()}_${form.image.name}`;

        const { error } = await supabase.storage
            .from('user-images')
            .upload(fileName, form.image);

        if (error) {
            console.error("UPLOAD ERROR:", error);
            alert(error.message);
            return null;
        }

        console.log("UPLOAD SUCCESS:", data);

        const { data } = supabase.storage
            .from('user-images')
            .getPublicUrl(fileName);

        return data.publicUrl;
    };


    const validate = () => {
        let newErrors = {};

        if (!form.name.trim()) newErrors.name = "Name is required";

        if (!form.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(form.email)) {
            newErrors.email = "Invalid email";
        }

        if (!form.phone.trim()) {
            newErrors.phone = "Phone is required";
        } else if (!/^[0-9]{10}$/.test(form.phone)) {
            newErrors.phone = "Enter valid 10 digit number";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const addUser = async () => {
        if (!validate()) return;

        setLoading(true);

        const imageUrl = await uploadImage();

        // 1️⃣ Insert user
        const { data: userData, error: userError } = await supabase
            .from('users')
            .insert([{
                name: form.name,
                email: form.email,
                image: imageUrl
            }])
            .select()
            .single();

        if (userError) {
            setLoading(false);

            if (userError.message.includes('duplicate')) {
                setErrors({ email: "Email already exists" });
            } else {
                alert(userError.message);
            }
            return;
        }


        // 2️⃣ Insert contact details
        const { error: contactError } = await supabase
            .from('contact_details')
            .insert([{
                user_id: userData.id,
                phone: form.phone,
                address: form.address,
                city: form.city,
                state: form.state,
                country: form.country
            }]);

        setLoading(false);

        if (contactError) {
            alert(contactError.message);
            return;
        }

        navigate('/');
    };

    return (
        <div className="container mt-5">

            <Helmet>
                <title>Add User</title>
            </Helmet>

            <h2>Add User</h2>

            {/* USER INFO */}
            <div className="row mb-3">
                <div className="col-md-4">
                    <label>Name</label>
                    <input
                        name="name"
                        className={`form-control ${errors.name && 'is-invalid'}`}
                        placeholder='Name'
                        onChange={handleChange}
                    />
                    {errors.name && <div className="text-danger">{errors.name}</div>}
                </div>

                <div className="col-md-4">
                    <label>Email</label>
                    <input
                        name="email"
                        className={`form-control ${errors.email && 'is-invalid'}`}
                        placeholder='Email Address'
                        onChange={handleChange}
                    />
                    {errors.email && <div className="text-danger">{errors.email}</div>}
                </div>
                {/* IMAGE */}
                <div className="col-md-4">
                    <label>Profile Image</label>
                    <input type="file" className="form-control" accept="image/*" onChange={handleImage} />

                    {preview && (
                        <img src={preview} alt="preview" width="120" className="mt-2 rounded" />
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
                        className={`form-control ${errors.phone && 'is-invalid'}`}
                        placeholder='Phone Number'
                        onChange={handleChange}
                    />
                    {errors.phone && <div className="text-danger">{errors.phone}</div>}
                </div>

                <div className="col-md-6">
                    <label>City</label>
                    <input name="city" className="form-control" placeholder='City' onChange={handleChange} />
                </div>
            </div>

            <div className="row mb-3">
                <div className="col-md-6">
                    <label>State</label>
                    <input name="state" className="form-control" placeholder='State' onChange={handleChange} />
                </div>

                <div className="col-md-6">
                    <label>Country</label>
                    <input name="country" className="form-control" placeholder='Country' onChange={handleChange} />
                </div>
            </div>

            <div className="mb-3">
                <label>Address</label>
                <textarea name="address" className="form-control" placeholder='Address' onChange={handleChange}></textarea>
            </div>

            <button className="btn btn-success" onClick={addUser} disabled={loading}>
                {loading ? "Saving..." : "Save"}
            </button>

            <button className="btn btn-secondary ms-2" onClick={() => navigate('/users')}>
                Back
            </button>
        </div>
    );
}

export default AddUser;