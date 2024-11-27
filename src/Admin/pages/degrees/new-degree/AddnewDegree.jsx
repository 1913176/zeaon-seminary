import React from "react";
import NewDegree from "./NewDegree";
import LeftBar from "../../../components/global/sidebar/LeftBar";

const AddnewCourse = () => {
  return (
    <div className="courses-page">
      <LeftBar />
      <NewDegree />
    </div>
  );
};

export default AddnewCourse;
