import React from "react";
import "./degrees.css";
import DegreeList from "./DegreeList";
import LeftBar from "../../components/global/sidebar/LeftBar";

const AllDegrees = () => {
  return (
    <div className="courses-page">
      <LeftBar />
      <DegreeList/>
    </div>
  );
};

export default AllDegrees;
