import React, { useState, useEffect } from "react";
import "./SidebarEbook.css";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useCookies } from "react-cookie";
import { jwtDecode } from 'jwt-decode';

const SidebarEbook = ({ setComponent }) => {
  const [cookies] = useCookies(["myadmin"]);
  const [role, setRole] = useState("");
  const [openGroups, setOpenGroups] = useState(() => {
    const savedGroups = localStorage.getItem("openGroups");
    return savedGroups ? JSON.parse(savedGroups) : {};
  });

  useEffect(() => {
    if (cookies.myadmin) {
      try {
        const decodedToken = jwtDecode(cookies.myadmin);
        setRole(decodedToken.role);
      } catch (error) {
        console.error("Invalid Token", error);
      }
    }
  }, [cookies.myadmin]);

  const toggleGroup = (group) => {
    setOpenGroups((prevOpenGroups) => {
      const newGroups = { ...prevOpenGroups, [group]: !prevOpenGroups[group] };
      localStorage.setItem("openGroups", JSON.stringify(newGroups));
      return newGroups;
    });
  };

  // 🔥 Super simple menu list
  const menuItems = [
    { group: "Typing", name: "Add Typing", component: "AddTypingParagraph", roles: ["superAdmin", "typer"] },
    { group: "Typing", name: "Edit Typing", component: "EditTypingParagraph", roles: ["superAdmin", "typer"] },
    { group: "Typing", name: "Edit Typing Status", component: "ManageStatusTypingParagraph", roles: ["superAdmin"] },
    { group: "Typing", name: "Add exam image", component: "ExamForm", roles: ["superAdmin"] },
    { group: "Typing", name: "Edit exam image", component: "ExamTable", roles: ["superAdmin"] },
    { group: "Typing", name: "Add price plans", component: "AddPlanForm", roles: ["superAdmin"] },
    { group: "Typing", name: "Update price plans", component: "PlansTable", roles: ["superAdmin"] },
    { group: "Typing", name: "Add typing info", component: "TypingInfo", roles: ["superAdmin"] },
    { group: "Typing", name: "Update typing info", component: "TypingInfoFormUpdate", roles: ["superAdmin"] },
    { group: "Typing", name: "Contact us", component: "AdminContactUs", roles: ["superAdmin"] },
    { group: "Typing", name: "Exam error percent", component: "TypingCategoryErrorTable", roles: ["superAdmin"] },
    { group: "Student", name: "Student Table", component: "StudentTable", roles: ["superAdmin"] },
    { group: "Student", name: "Student Purchase Table", component: "StudentPurchase", roles: ["superAdmin"] },
    { group: "Student", name: "Notification", component: "NotificationTable", roles: ["superAdmin"] },
    { group: "Student", name: "Send Mail", component: "EmailSender", roles: ["superAdmin"] },
    { group: "Student", name: "User Online", component: "UserOnline", roles: ["superAdmin"] },
  ];

  // 👉 Group items by group name
  const groupedItems = menuItems
    .filter(item => item.roles.includes(role))
    .reduce((groups, item) => {
      if (!groups[item.group]) groups[item.group] = [];
      groups[item.group].push(item);
      return groups;
    }, {});

  return (
    <div className="sidebar-ebook">
      <nav className="sidebar-ebook__nav">
        {Object.entries(groupedItems).map(([groupName, items]) => (
          <div key={groupName} className="sidebar-ebook__group">
            <h3
              className={`sidebar-ebook__group-title ${openGroups[groupName] ? "open" : ""}`}
              onClick={() => toggleGroup(groupName)}
            >
              {groupName} {openGroups[groupName] ? <FaChevronUp /> : <FaChevronDown />}
            </h3>
            {openGroups[groupName] && (
              <div className="sidebar-ebook__subitems">
                {items.map((item, idx) => (
                  <button
                    key={idx}
                    className="sidebar-ebook__link"
                    onClick={() => setComponent(item.component)}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default SidebarEbook;
