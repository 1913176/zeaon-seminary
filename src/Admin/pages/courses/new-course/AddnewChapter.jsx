import React from "react";
import NewChapter from "./NewChapter";
import LeftBar from "../../../components/global/sidebar/LeftBar";

const AddnewChapter= () => {
  return (
    <div className="courses-page">
      <LeftBar />
      <NewChapter/>
    </div>
  );
};

export default AddnewChapter;
