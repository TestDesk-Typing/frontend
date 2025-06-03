import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { Container, Row, Col, Card, Form, Button, Image, Spinner, Alert } from 'react-bootstrap';
import pic from '../i/profile.png';
import Swal from 'sweetalert2';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
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
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
        setLoading(false);
      });
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleUpdateClick = async () => {
    if (!user.full_name || !user.mobile_number) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fill in all the required fields.',
      });
      return;
    }

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
        }),
      });

      const data = await response.json();
      if (data.status === "1") {
        Swal.fire({
          icon: 'success',
          title: 'Profile Updated',
          text: 'Your profile has been updated successfully.',
        });
        setIsEditing(false);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Update Error',
          text: 'There was an error updating your profile. Please try again.',
        });
      }
    } catch (error) {
      console.error('Error updating user data:', error);
      Swal.fire({
        icon: 'error',
        title: 'Update Error',
        text: 'There was an error updating your profile. Please try again.',
      });
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
        {/* Profile Image and Basic Info */}
        <Col lg={4}>
          <Card className="h-100 text-center p-4">
            <Image src={pic} roundedCircle className="profile-image mb-3" />
            <Card.Title className="mb-2">{user.full_name}</Card.Title>
            <Card.Text className="text-muted mb-4">Welcome to your profile page</Card.Text>
            {!isEditing && (
              <Button variant="primary" onClick={handleEditClick} className="play-btn">
                Edit Profile
              </Button>
            )}
          </Card>
        </Col>

        {/* Profile Details */}
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
                        disabled
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
                      <Form.Control
                        type="text"
                        value={user.membership}
                        onChange={(e) => setUser({ ...user, membership: e.target.value })}
                      />
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
                  <Button variant="secondary" onClick={handleCancelClick}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={handleUpdateClick}>
                    Update Profile
                  </Button>
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