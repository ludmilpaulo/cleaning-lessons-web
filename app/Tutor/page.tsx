"use client";
import { useState } from "react";
import Sidebar from "./Sidebar"; // Adjust the path if needed
import { FaBook, FaUserGraduate, FaClipboard, FaChartBar } from "react-icons/fa";
import withAuth from "@/components/PrivateRoute";
import Course from "./courses/Course";
import Marks from "./mark/Marks";
import Students from "./students/Students";
import Tests from "./test/Tests";

const TutorPage: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState<string>("Course");

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "Course":
        return <Course />;
      case "Students":
        return <Students />;
      case "Tests":
        return <Tests />;
      case "Marks":
        return <Marks />;
      default:
        return <Course />; // Default to Course if unknown
    }
  };

  // Define the navigation items with icons
  const navigation = [
    { name: "Meu Curso", component: "Course", icon: FaBook },
    { name: "Estudantes", component: "Students", icon: FaUserGraduate },
    { name: "Testes", component: "Tests", icon: FaClipboard },
    { name: "Notas", component: "Marks", icon: FaChartBar },
  ];

  return (
    <div className="lg:flex">
      {/* Sidebar */}
      <Sidebar setActiveComponent={setActiveComponent} navigation={navigation} />
      
      {/* Main content */}
      <div className="flex-grow p-6 lg:ml-64"> {/* Added lg:ml-64 to account for sidebar width */}
        {renderActiveComponent()}
      </div>
    </div>
  );
};

export default withAuth(TutorPage);
