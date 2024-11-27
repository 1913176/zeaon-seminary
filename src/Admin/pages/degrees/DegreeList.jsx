import React, { useEffect, useState } from "react";
import DegreeCard from "./DegreeCard";
import "./degrees.css";

// import courseList from "../Assets/Data/courseList.json";
import { useNavigate } from "react-router-dom";
import { getDegrees } from "../../firebase/lessonApi";
import { getAllDegrees } from '../../firebase/degreeApi'

const DegreeList = () => {
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
        <h2 className="h2-user-title">All Degrees</h2>
        <div className="admin-add-course-btn" onClick={() => navigate("degrees/new")}>
          <h3 className="top-btn-text">Add Degree</h3>
        </div>
      </div>
      <div className="course-list">
        {courses && courses?.map((course, index) => (
          <DegreeCard data={course} key={index} />
        ))}
      </div>
    </div>
  );
};

export default DegreeList;
