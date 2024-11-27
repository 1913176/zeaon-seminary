import React from "react";
import "./courses.css";
import CourseList from "./CourseList";
import LeftBar from "../../components/global/sidebar/LeftBar";

const AllCourses = () => {
  return (
    <div className="courses-page">
      <LeftBar />
      <CourseList/>
    </div>
  );
};

export default AllCourses;
