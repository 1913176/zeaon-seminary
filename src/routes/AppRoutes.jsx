import { Route, Routes } from "react-router-dom";
import Profile from "../Components/Profile/Profile";
import Dashboard from "../Components/Dashboard";
// import Courses from "../Components/courses/Courses";
import Enrolled from "../Components/Enrolled/Enrolled";
import Home from "../Components/Home/Home";
import AddnewDegree from "../Admin/pages/degrees/new-degree/AddnewDegree";
import AllDegrees from "../Admin/pages/degrees/AllDegrees";
import AddnewChapter from "../Admin/pages/degrees/new-degree/AddnewChapter";
import Register from '../Authentication/Register'
import Allusers from "../Admin/pages/userManagement/Allusers";
import EditDegree from "../Admin/pages/degrees/edit-degree/EditDegree";
import Login from "../Authentication/Login";
import CourseDetails from "../Components/CourseDetails/CourseDetails";
import AllTests from "../Admin/pages/tests/AllTests";
import TestDetails from "../Admin/pages/tests/TestDetails";
import Degrees from "../Components/Degrees/Degrees";
import ViewDegrees from "../Components/DegreeManager";
import AddDegreePage from "../Components/Degrees/dgree";

const AppRoutes = () => {
  return (
    <Routes>
      {/* <Route path="/" index element={<Dashboard />} /> */}
      <Route index element={<Register />}></Route>
      <Route path="ViewDegrees" element={<ViewDegrees />}></Route>
      <Route path="degree" element={<AddDegreePage />}></Route>
      <Route path="home" element={<Dashboard />}>
        <Route index element={<Home />}></Route>
        <Route path="profile" element={<Profile />}></Route>
        {/* <Route path="courses" element={<Courses />} ></Route> */}
        <Route path="degrees" element={<Degrees />} />
        <Route path="enrolled" element={<Enrolled />} ></Route>
        <Route path="courseDetails/:courseId" element={<CourseDetails />} />
      </Route>
      <Route path="/admin" element={<AllDegrees />} />
      <Route path="/admin/chapter" element={<AddnewChapter />} />
      <Route path="/admin/degrees/new" element={<AddnewDegree />} />
      <Route path="/admin/degrees/edit" element={<EditDegree />} />
     {/* <Route path="/admin/users" element={< Allusers />} /> */}
      <Route path="/admin/tests" element={< AllTests />} />
      <Route path="/admin/tests/details" element={< TestDetails />} />
    </Routes>
  );
};

export default AppRoutes;
