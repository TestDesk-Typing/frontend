import React, { useEffect } from "react";
import { useSocket } from "../../SocketProvider";
import { Card, ListGroup, Badge, Image } from "react-bootstrap";

const UserOnline = () => {
  const {
    fetchConnectedUsers,
    connectedUsers,
    userCount,
  } = useSocket();

  useEffect(() => {
    fetchConnectedUsers();
  }, [fetchConnectedUsers]);

  return (
    <Card className="mt-3 shadow-sm">
      <Card.Header>
        <h5 className="mb-0">
          🟢 Online Users <Badge bg="success">{userCount}</Badge>
        </h5>
      </Card.Header>
      <ListGroup variant="flush">
        {connectedUsers.length > 0 ? (
          connectedUsers.map((user, index) => (
            <ListGroup.Item key={index}>
              <div className="d-flex align-items-center">
                {user.profile_pic && (
                  <Image
                    src={user.profile_pic}
                    alt="User"
                    roundedCircle
                    width={40}
                    height={40}
                    className="me-3"
                  />
                )}
                <div>
                  <strong>{user.fullName}</strong> <small className="text-muted">(ID: {user.id})</small>
                  <div>
                    <small>Email: {user.email || "N/A"}</small>
                  </div>
                  <div>
                    <small>Mobile: {user.mobile_number || "N/A"}</small>
                    {user.city_name && <> · <small>City: {user.city_name}</small></>}
                  </div>
                </div>
              </div>
            </ListGroup.Item>
          ))
        ) : (
          <ListGroup.Item>No users online.</ListGroup.Item>
        )}
      </ListGroup>
    </Card>
  );
};

export default UserOnline;
