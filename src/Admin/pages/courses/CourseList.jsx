import React, { useEffect, useState } from "react";
import CourseCard from "./CourseCard";
import "./courses.css";

// import courseList from "../Assets/Data/courseList.json";
import { useNavigate } from "react-router-dom";
import { getDegrees } from "../../firebase/lessonApi";
import { getAllDegrees } from '../../firebase/degreeApi'

const CourseList = () => {
  const navigate = useNavigate();
  const [courses, SetCourses] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        if (courses === null) {
          const QueryDocumentSnapshots = await getAllDegrees();
          console.log(QueryDocumentSnapshots)
          SetCourses(QueryDocumentSnapshots);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchCourses()
  }, [courses])


  return (
    <div className="course-list-cnt">
      <div className="course-list-header">
        <h2 className="h2-user-title">All Courses</h2>
        <div className="admin-add-course-btn" onClick={() => navigate("../admin/courses/new")}>
          <h3 className="top-btn-text">Add Course</h3>
        </div>
      </div>
      <div className="course-list">
        {courses && courses?.map((course, index) => (
          <CourseCard data={course} key={index} />
        ))}
      </div>
    </div>
  );
};

export default CourseList;
