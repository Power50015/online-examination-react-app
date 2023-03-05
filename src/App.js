import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navbar from "./Layouts/Navbar";
import Login from "./Pages/Login";
import AdminDashborad from "./Pages/admin/Dashborad";
import Profile from "./Pages/Profile";
//Students
import Students from "./Pages/admin/Student/Students";
import CreateStudent from "./Pages/admin/Student/CreateStudent";
import ReadStudent from "./Pages/admin/Student/ReadStudent";
import UpdateStudent from "./Pages/admin/Student/UpdateStudent";
//Admins
import Admins from "./Pages/admin/Admins/Admins";
import CreateAdmin from "./Pages/admin/Admins/CreateAdmin";
//Subjects
import Subjects from "./Pages/admin/Subject/Subjects";
import CreateSubject from "./Pages/admin/Subject/CreateSubject";
//Exams
import Exams from "./Pages/admin/Exam/Exams";
import CreateExam from "./Pages/admin/Exam/CreateExam";
import ReadExam from "./Pages/admin/Exam/ReadExam";
import UpdateExam from "./Pages/admin/Exam/UpdateExam";

const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Hello world!</div>,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/admin-dashborad",
    element: <AdminDashborad />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/create-student",
    element: <CreateStudent />,
  },
  {
    path: "/student/:stuId",
    element: <ReadStudent />,
  },
  {
    path: "/update-students/:stuId",
    element: <UpdateStudent />,
  },
  {
    path: "/students",
    element: <Students />,
  },
  {
    path: "/admins",
    element: <Admins />,
  },
  {
    path: "/create-admins",
    element: <CreateAdmin />,
  },
  {
    path: "/subjects",
    element: <Subjects />,
  },
  {
    path: "/create-subjects",
    element: <CreateSubject />,
  },
  {
    path: "/exams",
    element: <Exams />,
  },
  {
    path: "/create-exams",
    element: <CreateExam />,
  },
  {
    path: "/exam/:examId",
    element: <ReadExam />,
  },
  {
    path: "/update-exam/:examId",
    element: <UpdateExam />,
  },
]);

export default function App() {
  return (
    <div className="content ">
      <Navbar />
      <RouterProvider router={router} />
    </div>
  );
}
