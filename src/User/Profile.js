// Updated Profile.js (React Component with Image Upload, Compression, and Pencil Icon)
import React, { useEffect, useState } from 'react';
import './Profile.css';
import { useCookies } from 'react-cookie';
import pic from '../i/profile.png';
import Swal from 'sweetalert2';
import { FaPencilAlt } from 'react-icons/fa';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [cookies] = useCookies(['session_id', 'SSIDCE']);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/users/profile/${cookies.SSIDCE}`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${cookies.session_id}`,
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then((data) => {
        setUser(data);
        setPreviewImage(data.profile_pic ? `${process.env.REACT_APP_API_URL}${data.profile_pic}` : pic);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
        setLoading(false);
      });
  }, [cookies]);

  const handleEditClick = () => setIsEditing(true);
  const handleCancelClick = () => setIsEditing(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const img = new Image();
    const reader = new FileReader();

    reader.onload = (event) => {
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxSize = 300;
        const scale = Math.min(maxSize / img.width, maxSize / img.height);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
          const compressedFile = new File([blob], file.name, { type: 'image/jpeg' });
          setSelectedImage(compressedFile);
          setPreviewImage(URL.createObjectURL(blob));
        }, 'image/jpeg', 0.7);
      };
    };
    reader.readAsDataURL(file);
  };

  const uploadProfileImage = async () => {
    if (!selectedImage) return;

    const formData = new FormData();
    formData.append('profileImage', selectedImage);

    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/upload-profile-picture/${user.email_id}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cookies.session_id}`,
      },
      body: formData,
    });

    const result = await response.json();
    if (result.status === '1') {
      setPreviewImage(`${process.env.REACT_APP_API_URL}${result.path}`);
      return true;
    } else {
      Swal.fire('Error', 'Image upload failed.', 'error');
      return false;
    }
  };

  const handleUpdateClick = async () => {
    if (!user.full_name || !user.mobile_number) {
      Swal.fire('Error', 'Please fill in all required fields.', 'error');
      return;
    }

    await uploadProfileImage();

    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/update/${user.email_id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${cookies.session_id}`,
      },
      body: JSON.stringify({
        full_name: user.full_name,
        dob: user.dob,
        city_name: user.city_name,
        gender: user.gender,
        membership: user.membership,
        exam_shortcut: user.exam_shortcut,
      }),
    });

    const data = await response.json();
    if (data.status === '1') {
      Swal.fire('Success', 'Profile updated successfully.', 'success');
      setIsEditing(false);
    } else {
      Swal.fire('Error', 'Profile update failed.', 'error');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>No user data found.</p>;

  return (
    <div className="register-container">
      <div className="register-content">
        <div className="register-left">
          <div className="image-wrapper">
            <img
              src={previewImage || pic}
              className="profile-image"
              alt="Profile"
              onClick={() => isEditing && document.getElementById('imageInput').click()}
            />
            {isEditing && <FaPencilAlt className="edit-icon" onClick={() => document.getElementById('imageInput').click()} />}
            {isEditing && (
              <input
                id="imageInput"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageChange}
              />
            )}
          </div>
          <h1>{user.full_name}</h1>
          <p>Welcome to your profile page</p>
          {!isEditing && (
            <button onClick={handleEditClick} className="play-btn">Edit</button>
          )}
        </div>
        <div className="register-right">
          <div className="register-form">
            <h2>Personal Information</h2>
            <div className="register-form-grid">
              <div className="register-test-input-groups">
                <label>Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={user.full_name}
                    onChange={(e) => setUser({ ...user, full_name: e.target.value })}
                    className="editable-input"
                  />
                ) : (
                  <p>{user.full_name}</p>
                )}
              </div>
              <div className="register-test-input-groups">
                <label>Date of Birth</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={new Date(user.dob).toLocaleDateString('en-CA')}
                    onChange={(e) => setUser({ ...user, dob: e.target.value })}
                    className="editable-input"
                  />
                ) : (
                  <p>{new Date(user.dob).toLocaleDateString('en-GB')}</p>
                )}
              </div>
            </div>

            <div className="register-form-grid">
              <div className="register-test-input-groups">
                <label>Gender</label>
                {isEditing ? (
                  <select
                    value={user.gender}
                    onChange={(e) => setUser({ ...user, gender: e.target.value })}
                    className="editable-input"
                  >
                    <option className="input-status-option" value="Male">Male</option>
                    <option className="input-status-option" value="Female">Female</option>
                    <option className="input-status-option" value="Other">Other</option>
                  </select>
                ) : (
                  <p>{user.gender}</p>
                )}
              </div>
              <div className="register-test-input-groups">
                <label>City</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={user.city_name}
                    onChange={(e) => setUser({ ...user, city_name: e.target.value })}
                    className="editable-input"
                  />
                ) : (
                  <p>{user.city_name}</p>
                )}
              </div>
            </div>

            <h2>Contact Information</h2>
            <div className="register-form-grid">
              <div className="register-test-input-groups">
                <label>Email</label>
                <p>{user.email_id}</p>
              </div>
              <div className="register-test-input-groups">
                <label>Mobile Number</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={user.mobile_number}
                    onChange={(e) => setUser({ ...user, mobile_number: e.target.value })}
                    className="editable-input"
                    disabled
                  />
                ) : (
                  <p>{user.mobile_number}</p>
                )}
              </div>
            </div>

            <div className="register-form-grid">
              <div className="register-test-input-groups">
                <label>Status</label>
                <p>{user.status}</p>
              </div>
              <div className="register-test-input-groups">
                <label>Membership</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={user.membership}
                    onChange={(e) => setUser({ ...user, membership: e.target.value })}
                    className="editable-input"
                  />
                ) : (
                  <p>{user.membership}</p>
                )}
              </div>
            </div>

            <div className="register-form-grid">
              <div className="register-test-input-groups">
                <label>Exam Shortcut</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={user.exam_shortcut}
                    onChange={(e) => setUser({ ...user, exam_shortcut: e.target.value })}
                    className="editable-input"
                  />
                ) : (
                  <p>{user.exam_shortcut}</p>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="button-group">
                <button onClick={handleUpdateClick} className="register-btn update">Update</button>
                <button onClick={handleCancelClick} className="register-btn cancle">Cancel</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
