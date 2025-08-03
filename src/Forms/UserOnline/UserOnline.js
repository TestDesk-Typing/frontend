import React, { useEffect, useState } from "react";
import { useSocket } from "../../SocketProvider";
import { Card, ListGroup, Badge, Image, Spinner } from "react-bootstrap";

const UserOnline = () => {
  const { connectedUsers, userCount } = useSocket();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set loading to false after initial render
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const uniqueUsers = Array.from(
    new Map(connectedUsers.map(user => [user.id, user])).values()
  );
  // Format user count display
  const displayCount = uniqueUsers?.length || userCount || 0;

  return (
    <Card className="mt-3 shadow-sm">
      <Card.Header className="bg-light">
        <h5 className="mb-0 d-flex align-items-center">
          <span className="me-2">🟢 Online Users</span>
          <Badge bg="success" pill>
            {displayCount}
          </Badge>
        </h5>
      </Card.Header>
      <ListGroup variant="flush" style={{ maxHeight: "500px", overflowY: "auto" }}>
        {loading ? (
          <ListGroup.Item className="text-center py-3">
            <Spinner animation="border" variant="primary" size="sm" className="me-2" />
            Loading users...
          </ListGroup.Item>
        ) : uniqueUsers?.length > 0 ? (
          uniqueUsers.map((user) => (
            <ListGroup.Item key={user.id} className="py-3">
              <div className="d-flex align-items-center">
                <div className="position-relative me-3">
                  {user.profile_pic ? (
                    <Image
                      src={`${process.env.REACT_APP_API_URL}${user.profile_pic}`}
                      alt={user.fullName}
                      roundedCircle
                      width={40}
                      height={40}
                      className="object-fit-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/40";
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        backgroundColor: "#6c757d",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      {user.fullName?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  )}
                  <span
                    style={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      width: 12,
                      height: 12,
                      backgroundColor: "#28a745",
                      borderRadius: "50%",
                      border: "2px solid white",
                    }}
                  />
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-center">
                    <strong>{user.fullName || "Unknown User"}</strong>
                    <small className="text-muted">ID: {user.id}</small>
                  </div>
                  <div className="text-muted small">
                    <div>
                      <span className="me-2">
                        ✉️ {user.email || "Email not available"}
                      </span>
                    </div>
                    <div className="d-flex flex-wrap">
                      <span className="me-2">
                        📱 {user.mobile_number || "Phone not available"}
                      </span>
                      {user.city_name && (
                        <span>📍 {user.city_name}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </ListGroup.Item>
          ))
        ) : (
          <ListGroup.Item className="text-center py-3 text-muted">
            No users currently online
          </ListGroup.Item>
        )}
      </ListGroup>
    </Card>
  );
};

export default UserOnline;