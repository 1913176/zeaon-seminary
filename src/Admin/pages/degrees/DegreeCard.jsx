import React from "react";
import { useNavigate } from "react-router-dom";
import DemoImage from '../../assets/Images/imagenotxt2.png';

const DegreeCard = ({ data }) => {
  const navigate = useNavigate();

  return (
    <div
      className="course-card"
      onClick={() => navigate("degree/edit", { state: data })}
    >
      <img
        src={data?.thumbnail || DemoImage} 
        alt={data?.name || "Default thumbnail"}
        className="course-img"
      />
      <h4 className="course-card-title">{data?.name}</h4>
      <p className="course-card-description">
        {data?.description?.slice(0, 80) || "No description available"}..
      </p>
      <div className="course-edit-btn">
        <p>Edit Degree</p>
      </div>
    </div>
  );
};

export default DegreeCard;
