import React, { useEffect, useState } from "react";
import Nolesson from "../../../assets/Images/no-lesson-illustration.svg";
import { useNavigate } from "react-router-dom";
import NewChapter from "./NewChapter";
import { addDegree } from "../../../firebase/degreeApi"; // Firebase API integration for adding a degree
import { toast } from "react-toastify";

const NewDegree = () => {
  const [popupOpen, setPopupOpen] = useState({ open: false, data: null });

  const navigate = useNavigate();
  const [degreeData, setDegreeData] = useState({
    name: "",
    description: "",
    price: null,
    thumbnail: null,
    courses: [],
  });

  useEffect(() => {
    if (popupOpen) window.scrollTo(0, 0);
  }, [popupOpen]);

  const handledirectInput = (type, value) => {
    setDegreeData({ ...degreeData, [type]: value });
  };

  const handleDeleteCourse = (courseIndex) => {
    const newCourses = [...degreeData.courses];
    newCourses.splice(courseIndex, 1);
    setDegreeData({ ...degreeData, courses: newCourses });
  };

  const addLessontoCourse = (lesson) => {
    console.log(lesson);
    const newCourses = [...degreeData.courses];
    if (lesson.updateIndex === null) {
      newCourses.push({
        ...lesson,
        updateIndex: newCourses?.length > 0 ? newCourses?.length : 0,
      });
      setDegreeData({ ...degreeData, courses: newCourses });
    } else {
      newCourses[lesson.updateIndex] = lesson;
      setDegreeData({ ...degreeData, courses: newCourses });
    }
    setPopupOpen({ open: false });
  };

  const uploadDegree = async () => {
    if (degreeData.name && degreeData.price && degreeData.description) {
      const response = await toast.promise(addDegree(degreeData), {
        pending: "Adding degree...",
        success: "Degree added successfully!",
        error: "An error occurred while adding the new degree.",
      });
      console.log(response);
      if (response) navigate("/admin");
    } else {
      toast.error("Please fill in all degree details, including at least one course.");
    }
  };

  console.log(degreeData);

  return (
    <div
      className="course-list-cnt new-course"
      style={{
        overflow: popupOpen.open ? "hidden" : "scroll",
      }}
    >
      <div className="top-header-cnt">
        <div>
          <h3 className="course-new-title">Create New Degree</h3>
          <p className="course-new-discription">
            Create a new degree and let's publish!
          </p>
        </div>
        <div className="top-btn-cnt">
          <div className="course-delete-btn" onClick={() => navigate("/")}>
            Cancel
          </div>
          <div className="add-new-lesson-btn" onClick={uploadDegree}>
            Save Degree
          </div>
        </div>
      </div>
      <div className="input-split-cover">
        <form className="left-form">
          <div className="course-name-cnt">
            <p>Enter degree Name</p>
            <input
              type="text"
              value={degreeData.name}
              className="name-input"
              onChange={(e) => handledirectInput("name", e.target.value)}
            />
          </div>

          <div className="course-name-cnt">
            <p>Enter degree Description</p>
            <textarea
              value={degreeData.description}
              className="name-input"
              rows="4"
              placeholder="Enter degree description here..."
              onChange={(e) => handledirectInput("description", e.target.value)}
            />
          </div>

          <div className="flex-input">
            <div className="course-name-cnt">
              <p>Enter degree price</p>
              <input
                type="number"
                value={degreeData.price !== null ? degreeData.price : ""}
                className="name-input price-input"
                placeholder="₹"
                onChange={(e) => handledirectInput("price", e.target.value)}
              />
            </div>
          </div>
          <div className="course-name-cnt">
            <p>Upload degree thumbnail</p>
            <input
              type="file"
              accept="image/png, image/svg+xml"
              onChange={(e) =>
                setDegreeData({ ...degreeData, thumbnail: e.target.files[0] })
              }
              className="styled-input"
            />
          </div>
        </form>
        <form className="form-right">
          <div className="form-right-header">
            <h3 className="course-new-title form-right-heading">Course List</h3>
            <div
              className="add-new-lesson-btn"
              onClick={() => setPopupOpen({ open: true, data: null })}
            >
              Add new course
            </div>
          </div>

          <div className="lesson-list-cnt">
            {degreeData.courses?.length > 0 ? (
              degreeData.courses.map((course, index) => (
                <div
                  key={index}
                  className="lesson"
                  onClick={() => setPopupOpen({ open: true, data: course })}
                >
                  <h1 className="lesson-number">{index + 1}</h1>
                  <div className="lesson-title-cnt">
                    <h3 className="lesson-title">{course?.name}</h3>
                  </div>
                  <ul className="lesson-subtitle-cnt">
                    {course?.lessons?.map((sublesson, idx) => (
                      <li key={idx}>
                        <p className="lesson-subtitle">{sublesson?.name}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <div className="no-lesson-cnt">
                <img
                  src={Nolesson}
                  alt="no-lesson"
                  className="empty-lesson-img"
                />
              </div>
            )}
          </div>
        </form>
      </div>
      {popupOpen.open && (
        <NewChapter
          addCourse={(course) => addLessontoCourse(course)}
          editData={popupOpen?.data}
          cancel={() => setPopupOpen({ open: false, data: null })}
          removeThisCourse={(index) => handleDeleteCourse(index)}
        />
      )}
    </div>
  );
};

export default NewDegree;
