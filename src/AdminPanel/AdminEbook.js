


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import SidebarEbook from "./SidebarEbook";
import AdminHeader from "./AdminHeader";
import "./AdminEbook.css";

import AddTypingParagraph from "../Forms/AddTypingParagraph";
import EditTypingParagraph from "../Forms/EditTypingParagraph";
import ExamForm from "../Forms/Examform";
import ExamTable from "../Forms/ExamTable";
import AddPlanForm from "../Forms/AddPlanForm";
import ManageStatusTypingParagraph from "../Forms/ManageStatusTypingParagraph";
import TypingInfo from "../Forms/TypingInfo";
import StudentTable from "../Forms/Students/StudentTable";
import AdminContactUs from "../Forms/AdminContactUs";
import TypingInfoFormUpdate from "../Forms/TypingInfoFormUpdate";
import PlansTable from "../Forms/UpdatePlanForm";
import TypingCategoryErrorTable from "../Forms/TypingCategoryErrorTable";
import StudentPurchase from "../Forms/Students/StudentPurchase";
import NotificationTable from "../Forms/NotificationTable";
import EmailSender from "../Forms/Mails/SendMail";
import UserOnline from "../Forms/UserOnline/UserOnline";
import NoticeTable from "../Forms/NoticeTable/NoticeTable";

const AdminTyping = () => {
  const [activeComponent, setActiveComponent] = useState(
    localStorage.getItem("activeComponent") || "AddTypingParagraph"
  );
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const navigate = useNavigate();
  const [cookies] = useCookies(["myadmin"]);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const tokenAdmin = cookies.myadmin;
        if (!tokenAdmin) {
          throw new Error("No token found");
        }
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/checkaccessadmin`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenAdmin}`,
          },
        });

        if (!response.ok) {
          throw new Error("Access denied");
        }

        const result = await response.json();
        if (result.message !== "Access granted") {
          navigate("/operator-login");
        }
      } catch (error) {
        toast.error("Access Denied: You do not have permission to access this page.");
        navigate("/operator-login");
      }
    };

    checkAccess();
  }, [cookies, navigate]);

  useEffect(() => {
    localStorage.setItem("activeComponent", activeComponent);
  }, [activeComponent]);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case "AddTypingParagraph":
        return <AddTypingParagraph />;
      case "EditTypingParagraph":
        return <EditTypingParagraph />;
      case "ExamForm":
        return <ExamForm />;
      case "ExamTable":
        return <ExamTable />;
      case "AddPlanForm":
        return <AddPlanForm />;
      case "ManageStatusTypingParagraph":
        return <ManageStatusTypingParagraph />;
      case "TypingInfo":
        return <TypingInfo />;
      case "StudentTable":
        return <StudentTable />;
      case "StudentPurchase":
        return <StudentPurchase />;
      case "AdminContactUs":
        return <AdminContactUs />;
      case "TypingInfoFormUpdate":
        return <TypingInfoFormUpdate />;
      case "PlansTable":
        return <PlansTable />;
      case "TypingCategoryErrorTable":
        return <TypingCategoryErrorTable />;
      case "NotificationTable":
        return <NotificationTable />;
      case "EmailSender":
        return <EmailSender />;
      case "UserOnline":
        return <UserOnline />;
      case "NoticeTable":
        return <NoticeTable />;
      default:
        return <AddTypingParagraph />;
    }
  };

  return (
    <div className="admin-ebook">
      <ToastContainer />
      <AdminHeader
        toggleSidebar={toggleSidebar}
        sidebarVisible={sidebarVisible}
      />
      <div
        className={`admin-ebook__container ${sidebarVisible ? "" : "sidebar-hidden"
          }`}
      >
        {sidebarVisible && <SidebarEbook setComponent={setActiveComponent} />}
        <div className="admin-ebook__main-content">{renderComponent()}</div>
      </div>
    </div>
  );
};

export default AdminTyping;
