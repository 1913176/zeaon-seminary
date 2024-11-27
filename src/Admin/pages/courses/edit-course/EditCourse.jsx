import React, { useEffect, useState } from "react";
import Edit from "./Edit";
import { useLocation } from "react-router-dom";
import LeftBar from "../../../components/global/sidebar/LeftBar";
import { getDegreeById } from "../../../firebase/degreeApi";

const EditCourse = () => {
  const [currentDegree, setCurrentDegree] = useState(null)
  const data = useLocation().state;

  useEffect(() => {
    const getDegreeData = async () => {
      const res = await getDegreeById(data.id)
      setCurrentDegree(res)
    }
    getDegreeData()
  }, [data])

  return (
    <div className="courses-page">
      <LeftBar />
      <Edit courseDetails={currentDegree} />
    </div>
  );
};

export default EditCourse;
