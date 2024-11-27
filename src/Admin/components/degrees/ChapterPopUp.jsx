import React, { useEffect, useState } from "react";
import BackIcon from "../../assets/Images/left-arrow.png";
import { toast } from "react-toastify";
import { addChapterToCourse, deleteChapter, editChapter } from "../../firebase/degreeApi";
import LessonPopUp from "./LessonPopUp"; // Ensure the correct path to LessonPopUp

const initialState = {
  name: "",
  description: "",
  subLessons: [],
  updateIndex: null,
};

const ChapterPopUp = ({ addChapter, cancel, editData, removeThisChapter, degreeId, courseId }) => {
  const [currentChapter, setCurrentChapter] = useState(initialState);
  const [openLessonPopup, setOpenLessonPopup] = useState(false); // State to toggle LessonPopUp
  const [editLessonData, setEditLessonData] = useState(null); // State for editing lessons

  const validateAndUpdateChapter = async () => {
    if (!currentChapter.name || !currentChapter.description) {
      toast.error("Please provide both a chapter title and description.");
      return;
    }

    if (currentChapter?.chapter_id) {
      const res = await toast.promise(
        editChapter(degreeId, courseId, currentChapter?.chapter_id, currentChapter),
        {
          pending: "Updating chapter...",
          success: "Chapter updated successfully",
          error: "An error occurred while updating chapter",
        }
      );
      if (res) {
        addChapter(currentChapter);
        cancel();
      }
    } else if (degreeId && courseId) {
      const res = await toast.promise(
        addChapterToCourse(degreeId, courseId, currentChapter),
        {
          pending: "Adding new chapter...",
          success: "Chapter added successfully",
          error: "An error occurred while adding new chapter",
        }
      );
      if (res) {
        addChapter(res);
        setCurrentChapter(res);
      }
    }
  };

  const handleAddLesson = (newLesson) => {
    const updatedLessons = [...currentChapter.subLessons, newLesson];
    setCurrentChapter({ ...currentChapter, subLessons: updatedLessons });
    setOpenLessonPopup(false); // Close LessonPopUp after adding the lesson
  };

  const handleEditLesson = (lesson, index) => {
    setEditLessonData({ ...lesson, updateIndex: index });
    setOpenLessonPopup(true);
  };

  const handleDelete = async () => {
    const confirm = window.confirm(
      "Confirm to delete this chapter? All subLessons will be deleted."
    );
    if (confirm) {
      const res = await deleteChapter(degreeId, courseId, currentChapter?.chapter_id);
      if (res) removeThisChapter(editData?.updateIndex);
      if (res) cancel();
    }
  };

  useEffect(() => {
    if (editData) setCurrentChapter(editData);
  }, [editData]);

  return (
    <div className="lesson-popup-page">
      {openLessonPopup && (
        <LessonPopUp
          addLesson={handleAddLesson}
          cancel={() => setOpenLessonPopup(false)}
          editData={editLessonData}
          degreeId={degreeId}
          courseId={courseId}
        />
      )}
      <div className="lesson-popup">
        <div className="form-right-header">
          <div className="back-btn" onClick={() => cancel()}>
            <img src={BackIcon} alt="back" className="back-icon-img" />
          </div>
          <div className="top-btn-cnt">
            {editData && (
              <div
                className="add-new-lesson-btn cancel-btn"
                onClick={() => handleDelete()}
              >
                Delete Chapter
              </div>
            )}
            <div
              className="add-new-lesson-btn"
              onClick={() => validateAndUpdateChapter()}
            >
              {currentChapter?.chapter_id ? "Update" : "Add to Course"}
            </div>
          </div>
        </div>
        <div className="lesson-data-inputs-cnt">
          <div className="lesson-name-cnt">
            <p>Chapter Title</p>
            <input
              type="text"
              value={currentChapter?.name || ""}
              className="sublesson-title-input"
              onChange={(e) =>
                setCurrentChapter({ ...currentChapter, name: e.target.value })
              }
            />
          </div>
          <div className="lesson-content-input-cnt">
            <div className="sublesson-name-cnt">
              <p>Chapter Description</p>
              <textarea
                type="text"
                style={{ height: "4.5rem" }}
                className="sublesson-title-input"
                value={currentChapter?.description || ""}
                onChange={(e) =>
                  setCurrentChapter({
                    ...currentChapter,
                    description: e.target.value,
                  })
                }
              />
            </div>
            <div
              className="add-newLesson-btn"
              onClick={() => {
                setEditLessonData(null); // Clear edit data for new lesson
                setOpenLessonPopup(true);
              }}
            >
              <p>Add New Lesson</p>
            </div>
          </div>
        </div>
        <div className="content-list">
          {currentChapter?.subLessons?.length > 0 &&
            currentChapter?.subLessons?.map((lesson, index) => (
              <div className="lesson-list-item-cnt" key={index}>
                <div className="lesson-edit-delete-cnt">
                  <p>{lesson.name}</p>
                  <button onClick={() => handleEditLesson(lesson, index)}>Edit</button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ChapterPopUp;
