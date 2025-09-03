import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../pages/login/Login";
import Student from "../pages/student/dashboard/Student";
import Admin from "../pages/master/Admin";
import Home from "../pages/student/home/Home";
import { AdminLayout, StudentLayout } from "./RouteLayout";
import Unauth from "../pages/components/Unauth";
import NotFound from "../pages/components/NotFound";

const RouterComp = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<StudentLayout Component={Home} />} />
          <Route
            path="/student"
            element={<StudentLayout Component={Student} />}
          />
          <Route path="/admin" element={<AdminLayout Component={Admin} />} />
          <Route path="/unauthorised" element={<Unauth />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default RouterComp;
