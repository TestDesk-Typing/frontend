import React, { useState, useEffect } from "react";
import "./SidebarEbook.css";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const SidebarEbook = ({ setComponent }) => {
  const [openGroups, setOpenGroups] = useState(() => {
    const savedGroups = localStorage.getItem("openGroups");
    return savedGroups ? JSON.parse(savedGroups) : {};
  });

  const toggleGroup = (group) => {
    setOpenGroups((prevOpenGroups) => {
      const newGroups = {
        ...prevOpenGroups,
        [group]: !prevOpenGroups[group],
      };
      localStorage.setItem("openGroups", JSON.stringify(newGroups));
      return newGroups;
    });
  };

  return (
    <div className="sidebar-ebook">
      <nav className="sidebar-ebook__nav">
        <div className="sidebar-ebook__group">
          <h3
            className={`sidebar-ebook__group-title ${openGroups["Typing"] ? "open" : ""
              }`}
            onClick={() => toggleGroup("Typing")}
          >
            Typing {openGroups["Typing"] ? <FaChevronUp /> : <FaChevronDown />}
          </h3>
          {openGroups["Typing"] && (
            <div className="sidebar-ebook__subitems">
              <button
                className="sidebar-ebook__link"
                onClick={() => setComponent("AddTypingParagraph")}
              >
                Add Typing{" "}
              </button>
              <button
                className="sidebar-ebook__link"
                onClick={() => setComponent("EditTypingParagraph")}
              >
                Edit Typing
              </button>
              <button
                className="sidebar-ebook__link"
                onClick={() => setComponent("ManageStatusTypingParagraph")}
              >
                Edit Typing Status
              </button>
              <button
                className="sidebar-ebook__link"
                onClick={() => setComponent("ExamForm")}
              >
                Add exam image
              </button>
              <button
                className="sidebar-ebook__link"
                onClick={() => setComponent("ExamTable")}
              >
                Edit exam image
              </button>
              <button
                className="sidebar-ebook__link"
                onClick={() => setComponent("AddPlanForm")}
              >
                Add price plans
              </button>

              <button
                className="sidebar-ebook__link"
                onClick={() => setComponent("PlansTable")}
              >
                Update price plans
              </button>

              <button
                className="sidebar-ebook__link"
                onClick={() => setComponent("TypingInfo")}
              >
                Add typing info
              </button>
              <button
                className="sidebar-ebook__link"
                onClick={() => setComponent("TypingInfoFormUpdate")}
              >
                Update typing info
              </button>


              <button
                className="sidebar-ebook__link"
                onClick={() => setComponent("AdminContactUs")}
              >
                Contact us
              </button>

              <button
                className="sidebar-ebook__link"
                onClick={() => setComponent("TypingCategoryErrorTable")}
              >
                Exam error percent
              </button>


            </div>
          )}
        </div>

        <div className="sidebar-ebook__group">
          <h3
            className={`sidebar-ebook__group-title ${openGroups["Mock"] ? "open" : ""
              }`}
            onClick={() => toggleGroup("Mock")}
          >
            Mock {openGroups["Mock"] ? <FaChevronUp /> : <FaChevronDown />}
          </h3>
          {openGroups["Mock"] && (
            <div className="sidebar-ebook__subitems">
              <button
                className="sidebar-ebook__link"
                onClick={() => setComponent("AddMock")}
              >
                Add Mock{" "}
              </button>

              <button
                className="sidebar-ebook__link"
                onClick={() => setComponent("UpdateMock")}
              >
                Edit Mock{" "}
              </button>
            </div>
          )}
        </div>
        <div className="sidebar-ebook__group">
          <h3
            className={`sidebar-ebook__group-title ${openGroups["Student"] ? "open" : ""
              }`}
            onClick={() => toggleGroup("Student")}
          >
            Student {openGroups["Student"] ? <FaChevronUp /> : <FaChevronDown />}
          </h3>
          {openGroups["Student"] && (
            <div className="sidebar-ebook__subitems">
              <button
                className="sidebar-ebook__link"
                onClick={() => setComponent("StudentTable")}
              >
                Student Table{" "}
              </button>

              <button
                className="sidebar-ebook__link"
                onClick={() => setComponent("StudentPurchase")}
              >
                Student Purchase Table{" "}
              </button>
              <button
                className="sidebar-ebook__link"
                onClick={() => setComponent("NotificationTable")}
              >
                Notification{" "}
              </button>

              <button
                className="sidebar-ebook__link"
                onClick={() => setComponent("EmailSender")}
              >
                Send Mail{" "}
              </button>

            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default SidebarEbook;
