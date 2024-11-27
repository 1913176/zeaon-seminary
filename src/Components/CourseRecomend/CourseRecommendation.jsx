import "./CourseRecommendation.css";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import js from "../Assets/Images/imagenotxt.png";

const CourseRecommendation = ({ title, courseId, imgName }) => {
  useEffect(() => {}, [courseId]);

  const resolveImagePath = (imagePath) => {
    if (
      imagePath &&
      (imagePath.startsWith("http://") || imagePath.startsWith("https://"))
    ) {
      return imagePath;
    } else if (imagePath && imagePath.startsWith("base64")) {
      return js;
    } else {
      try {
        return require(`../Assets/Images/${imagePath}`);
      } catch (error) {
        return js;
      }
    }
  };
  const navigate = useNavigate();
  return (
    <div className="cr-card">
      <div className="cr-image-container">
        <img
          src={imgName ? resolveImagePath(imgName) : js}
          className="cr-image"
          alt="thumbnail"
        />
        <div className="cr-title">{title}</div>
      </div>
      <button
        className="cr-button"
        onClick={() => navigate(`/home/courseDetails/${courseId}`)}
      >
        View Course
      </button>
    </div>
  );
};

export default CourseRecommendation;
