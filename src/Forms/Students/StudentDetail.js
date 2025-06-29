import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import LoadingSpinner from "../../Loading";
import "./StudentDetail.css";

const StudentDetail = () => {
  const { studentId } = useParams();
  const [student, setStudent] = useState({});
  const [typingData, setTypingData] = useState([]);
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedStudent, setEditedStudent] = useState({});
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Fields to display
  const requiredFields = [
    "_id",
    "full_name",
    "email_id",
    "password",
    "mobile_number",
    "dob",
    "city_name",
    "gender",
    "status",
    "membership",
    "exam_shortcut",
  ];

  // Fetch student details
  useEffect(() => {
    const fetchStudentDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/student/${studentId}`
        );
        const data = await response.json();
        setStudent(data);
        setEditedStudent(data);
      } catch (error) {
        console.error("Error fetching student details:", error);
        Swal.fire("Error", "Error fetching student details", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDetails();
  }, [studentId]);

  // Fetch typing product data
  useEffect(() => {
    if (student.email_id) {
      const fetchTypingData = async () => {
        if (student.email_id) {
          try {
            const response = await fetch(
              `${process.env.REACT_APP_API_URL}/api/student/${student.email_id}/typing`
            );
            if (response.ok) {
              const data = await response.json();
              setTypingData(data);
            } else {
              setTypingData([]); // Handle case where no typing product is purchased
            }
          } catch (error) {
            console.error("Error fetching typing data:", error);
            Swal.fire("Error", "Error fetching typing data", "error");
          }
        }
      };


      fetchTypingData();
    }
  }, [student.email_id]);

  // Fetch plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/getPlans`);
        const data = await response.json();
        const sortedPlans = data.sort(
          (a, b) =>
            parseFloat(a.totalAmount.replace(/[^0-9.-]+/g, "")) -
            parseFloat(b.totalAmount.replace(/[^0-9.-]+/g, ""))
        );
        setPlans(sortedPlans);
      } catch (error) {
        console.error("Failed to fetch plans:", error);
      }
    };

    fetchPlans();
  }, []);

  // Input handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedStudent({ ...editedStudent, [name]: value });
  };

  // Add typing access
  const handleAddTyping = async () => {
    if (!selectedPlan) {
      Swal.fire("Error", "Please select a plan before granting access", "error");
      return;
    }

    // Find the selected plan details
    const planDetails = plans.find((plan) => plan._id === selectedPlan);

    if (!planDetails) {
      Swal.fire("Error", "Invalid plan selected", "error");
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to grant typing access to this user for the plan: ${planDetails.name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, give access!",
      cancelButtonText: "No, cancel!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_API_URL}/api/add-typing-access`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email_id: student.email_id,
                product_id: "999", // Static product ID
                selectedPlan: planDetails.name, // Send plan name
              }),
            }
          );

          if (response.ok) {
            const data = await response.json();
            setMessage(data.message || "Typing product added successfully");
            Swal.fire("Success", "Typing product added successfully", "success");
          } else {
            const data = await response.json();
            setError(data.message || "Error adding typing product");
          }
        } catch (error) {
          setError("Error adding typing product");
        }
      }
    });
  };


  // Remove typing access
  const handleDeleteTyping = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to remove typing access for this user?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove access!",
      cancelButtonText: "No, cancel!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_API_URL}/api/remove-typing-access`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email_id: student.email_id,
                product_id: "999",
              }),
            }
          );

          if (response.ok) {
            setTypingData([]);
            Swal.fire("Success", "Typing product access removed successfully", "success");
          } else {
            const data = await response.json();
            setError(data.message || "Error removing typing product");
          }
        } catch (error) {
          setError("Error removing typing product");
        }
      }
    });
  };

  // Toggle edit mode
  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  // Save updated student details
  const handleSave = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/student/${studentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedStudent),
        }
      );

      if (response.ok) {
        setStudent(editedStudent);
        setIsEditing(false);
        Swal.fire("Success", "Student details updated successfully", "success");
      } else {
        const data = await response.json();
        setError(data.message || "Failed to update student details.");
      }
    } catch (error) {
      setError("Error updating student details.");
    }
  };

  return (
    <div className="showing-purchased-product-table">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <h2 className="add-student-correct-form">Student Details</h2>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Field</TableCell>
                  <TableCell>Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requiredFields.map((key) => (
                  <TableRow key={key}>
                    <TableCell>{key}</TableCell>
                    <TableCell>
                      {isEditing && key !== "_id" ? (
                        <TextField
                          name={key}
                          value={editedStudent[key] || ""}
                          onChange={handleInputChange}
                          variant="outlined"
                          size="small"
                        />
                      ) : (
                        student[key]
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell>Action</TableCell>
                  <TableCell>
                    {isEditing ? (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSave}
                      >
                        Save
                      </Button>
                    ) : (
                      <Button
                        variant="outlined"
                        onClick={handleEdit}
                      >
                        Edit
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <h3>Select Plan</h3>
          <Select
            value={selectedPlan}
            onChange={(e) => setSelectedPlan(e.target.value)}
            variant="outlined"
            fullWidth
            displayEmpty
          >
            <MenuItem value="" disabled>
              Select a Plan
            </MenuItem>
            {plans.map((plan) => (
              <MenuItem key={plan._id} value={plan._id}>
                {plan.name} - {plan.totalAmount}
              </MenuItem>
            ))}
          </Select>
          <button className="add-typing-button"
            variant="contained"
            color="primary"
            onClick={handleAddTyping}
            style={{ marginTop: "20px" }}
          >
            + Add Typing Product
          </button>

          <div className="box-typing">
            <h3>Typing</h3>
            <ul>
              {typingData?.length > 0 ? (
                typingData.map((item) => (
                  <li key={item._id} className="typing-item">
                    <div className="typing-info">
                      <p>
                        <strong>Product ID:</strong> {item.product_id}
                      </p>
                      <p>
                        <strong>Plan:</strong> {item.selectedPlan}
                      </p>
                      <p>
                        <strong>Subscription Start Date:</strong>{" "}
                        {new Date(item.subscriptionStartDate).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Subscription Expiry Date:</strong>{" "}
                        {new Date(item.subscriptionExpiryDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="delete-icon-container">
                      <FaTrash
                        className="delete-icon-access"
                        onClick={handleDeleteTyping}
                      />
                    </div>
                  </li>
                ))
              ) : (
                <p>No typing product purchased</p>
              )}
            </ul>
          </div>
          {error && <p className="error-message">{error}</p>}
          {message && <p className="success-message">{message}</p>}
        </>
      )}
    </div>
  );
};

export default StudentDetail;
