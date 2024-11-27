import React from "react";
import { useNavigate } from "react-router-dom";
import DemoImgae from '../../assets/Images/imagenotxt2.png'

const DegreeCard = ({ data }) => {
  const navigate = useNavigate();
  // const resloveImagePath = (relativePath) => {
  //   return require(`../Assets/Images/imagenotxt.png`);
  // };
  return (
    <div
      className="course-card"
      onClick={() => navigate("degree/edit", { state: data })}
    >
      <img
        src={DemoImgae}
        alt={data?.image}
        className="course-img"
      />
      <h4 className="course-card-title">{data?.name}</h4>
      <p className="course-card-description">{data?.description?.slice(0,80)}..</p>
      <div className="course-edit-btn">
      <p>Edit Degree</p>
      </div>
    </div>
  );
};

export default DegreeCard;
