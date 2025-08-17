import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { Container, Row, Col, Card, Form, Button, Image as RBImage, Spinner, Alert } from 'react-bootstrap';
import pic from '../i/profile.png';
import Swal from 'sweetalert2';
import { FaPencilAlt } from 'react-icons/fa';
import './Profile.css';

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
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${cookies.session_id}`,
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then((data) => {
        setUser(data);
        setPreviewImage(
          data.profile_pic
            ? data.profile_pic.includes('googleusercontent.com')
              ? data.profile_pic
              : `${process.env.REACT_APP_API_URL}${data.profile_pic}`
            : pic
        );
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

    const img = new window.Image();
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

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/update/${user.email_id}`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${cookies.session_id}`,
        },
        body: JSON.stringify({
          full_name: user.full_name,
          dob: user.dob,
          city_name: user.city_name,
          gender: user.gender,
          membership: user.membership,
          exam_shortcut: user.exam_shortcut,
          mobile_number: user.mobile_number,
        }),
      });

      const data = await response.json();
      if (data.status === "1") {
        Swal.fire('Success', 'Profile updated successfully.', 'success');
        setIsEditing(false);
      } else {
        Swal.fire('Error', 'Profile update failed.', 'error');
      }
    } catch (error) {
      console.error('Error updating user data:', error);
      Swal.fire('Error', 'There was an error updating your profile.', 'error');
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">No user data found.</Alert>
      </Container>
    );
  }

  return (
    <Container className="profile-container mt-4">
      <Row className="g-4">
        <Col lg={4}>
          <Card className="h-100 text-center p-4">
            <div className="position-relative d-inline-block mt-4 profile-image-wrapper">
              <RBImage
                src={previewImage || pic}
                roundedCircle
                className="profile-image mb-3 mt-4"
                onClick={() => isEditing && document.getElementById('imageInput').click()}
              />
              {isEditing && (
                <>
                  <FaPencilAlt
                    className="edit-icon"
                    onClick={() => document.getElementById('imageInput').click()}
                  />
                  <input
                    id="imageInput"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleImageChange}
                  />
                </>
              )}
            </div>
            <Card.Title className="mb-2">{user.full_name}</Card.Title>
            <Card.Text className="text-muted mb-4">Welcome to your profile page</Card.Text>
            {!isEditing && (
              <Button variant="primary" onClick={handleEditClick} className="play-btn">
                Edit Profile
              </Button>
            )}
          </Card>
        </Col>

        <Col lg={8}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title className="mb-4">Personal Information</Card.Title>
              <Row className="mb-4">
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    {isEditing ? (
                      <Form.Control
                        type="text"
                        value={user.full_name}
                        onChange={(e) => setUser({ ...user, full_name: e.target.value })}
                      />
                    ) : (
                      <p className="form-control-static">{user.full_name}</p>
                    )}
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Date of Birth</Form.Label>
                    {isEditing ? (
                      <Form.Control
                        type="date"
                        value={new Date(user.dob).toLocaleDateString('en-CA')}
                        onChange={(e) => setUser({ ...user, dob: e.target.value })}
                      />
                    ) : (
                      <p className="form-control-static">{new Date(user.dob).toLocaleDateString('en-GB')}</p>
                    )}
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-4">
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Gender</Form.Label>
                    {isEditing ? (
                      <Form.Select
                        value={user.gender}
                        onChange={(e) => setUser({ ...user, gender: e.target.value })}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </Form.Select>
                    ) : (
                      <p className="form-control-static">{user.gender}</p>
                    )}
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>City</Form.Label>
                    {isEditing ? (
                      <Form.Control
                        type="text"
                        value={user.city_name}
                        onChange={(e) => setUser({ ...user, city_name: e.target.value })}
                      />
                    ) : (
                      <p className="form-control-static">{user.city_name}</p>
                    )}
                  </Form.Group>
                </Col>
              </Row>

              <Card.Title className="mb-4">Contact Information</Card.Title>
              <Row className="mb-4">
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <p className="form-control-static">{user.email_id}</p>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Mobile Number</Form.Label>
                    {isEditing ? (
                      <Form.Control
                        type="text"
                        value={user.mobile_number}
                        onChange={(e) => setUser({ ...user, mobile_number: e.target.value })}
                      />
                    ) : (
                      <p className="form-control-static">{user.mobile_number}</p>
                    )}
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-4">
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <p className="form-control-static">{user.status}</p>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Membership</Form.Label>
                    {isEditing ? (
                      <Form.Select
                        value={user.membership}
                        onChange={(e) => setUser({ ...user, membership: e.target.value })}
                      >
                        <option className="input-status-option" value="Basic">Basic</option>
                        <option className="input-status-option" value="Premium">Premium</option>
                        <option className="input-status-option" value="VIP">VIP</option>
                      </Form.Select>
                    ) : (
                      <p className="form-control-static">{user.membership}</p>
                    )}
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Exam Shortcut</Form.Label>
                    {isEditing ? (
                      <Form.Control
                        type="text"
                        value={user.exam_shortcut}
                        onChange={(e) => setUser({ ...user, exam_shortcut: e.target.value })}
                      />
                    ) : (
                      <p className="form-control-static">{user.exam_shortcut}</p>
                    )}
                  </Form.Group>
                </Col>
              </Row>

              {isEditing && (
                <div className="d-flex justify-content-end gap-2 mt-4">
                  <Button variant="secondary" onClick={handleCancelClick}>Cancel</Button>
                  <Button variant="primary" onClick={handleUpdateClick}>Update Profile</Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
