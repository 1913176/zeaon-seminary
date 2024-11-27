import React from "react";
import NewCourse from "./NewCourse";
import LeftBar from "../../../components/global/sidebar/LeftBar";

const AddnewCourse = () => {
  return (
    <div className="courses-page">
      <LeftBar />
      <NewCourse />
    </div>
  );
};

export default AddnewCourse;
