// import React, { useState } from 'react';
// import { addDegree, uploadFile } from '../../Admin/firebase/degreeapi1';




// const AddDegreePage = () => {
//   const [degreeData, setDegreeData] = useState({
//     name: '',
//     description: '',
//     thumbnail: null,
//     overviewPoints: [],
//     courses: [],
//   });

//   const [course, setCourse] = useState({
//     title: '',
//     description: '',
//     thumbnail: null,
//     chapters: [],
//   });

//   const [chapter, setChapter] = useState({
//     title: '',
//     description: '',
//     lessons: [],
//   });

//   const [lesson, setLesson] = useState({
//     title: '',
//     file: null,
//   });

//   // Handle form input changes
//   const handleChange = (e, field, setData) => {
//     const { name, value } = e.target;
//     setData((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };

//   const handleFileChange = (e, field, setData) => {
//     const file = e.target.files[0];
//     setData((prevState) => ({
//       ...prevState,
//       [field]: file,
//     }));
//   };

//   const handleOverviewPointsChange = (e, index) => {
//     const { name, value } = e.target;
//     const updatedPoints = [...degreeData.overviewPoints];
//     updatedPoints[index] = {
//       ...updatedPoints[index],
//       [name]: value,
//     };
//     setDegreeData((prevState) => ({
//       ...prevState,
//       overviewPoints: updatedPoints,
//     }));
//   };

//   const addCourse = () => {
//     setDegreeData((prevState) => ({
//       ...prevState,
//       courses: [...prevState.courses, { ...course }],
//     }));
//     setCourse({
//       title: '',
//       description: '',
//       thumbnail: null,
//       chapters: [],
//     });
//   };

//   const addChapter = () => {
//     setCourse((prevState) => ({
//       ...prevState,
//       chapters: [...prevState.chapters, { ...chapter }],
//     }));
//     setChapter({
//       title: '',
//       description: '',
//       lessons: [],
//     });
//   };

//   const addLesson = () => {
//     setChapter((prevState) => ({
//       ...prevState,
//       lessons: [...prevState.lessons, { ...lesson }],
//     }));
//     setLesson({
//       title: '',
//       file: null,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (!degreeData.name || degreeData.courses.length === 0) {
//         alert('Degree title and at least one course are required.');
//         return;
//       }

//       const degreeId = await addDegree(degreeData);
//       alert(`Degree added successfully! Degree ID: ${degreeId}`);
//     } catch (error) {
//       alert('Error adding degree: ' + error.message);
//     }
//   };

//   return (
//     <div className="add-degree-form">
//       <h1>Add a New Degree</h1>
//       <form onSubmit={handleSubmit}>
//         {/* Degree Title */}
//         <div>
//           <label>Degree Title</label>
//           <input
//             type="text"
//             name="name"
//             value={degreeData.name}
//             onChange={(e) => handleChange(e, 'name', setDegreeData)}
//             required
//           />
//         </div>

//         {/* Degree Description */}
//         <div>
//           <label>Degree Description</label>
//           <textarea
//             name="description"
//             value={degreeData.description}
//             onChange={(e) => handleChange(e, 'description', setDegreeData)}
//           />
//         </div>

//         {/* Degree Thumbnail */}
//         <div>
//           <label>Degree Thumbnail</label>
//           <input
//             type="file"
//             onChange={(e) => handleFileChange(e, 'thumbnail', setDegreeData)}
//           />
//         </div>

//         {/* Overview Points */}
//         <div>
//           <h3>Overview Points</h3>
//           {degreeData.overviewPoints.map((point, index) => (
//             <div key={index}>
//               <input
//                 type="text"
//                 name="title"
//                 value={point.title}
//                 onChange={(e) => handleOverviewPointsChange(e, index)}
//                 placeholder="Title"
//               />
//               <textarea
//                 name="description"
//                 value={point.description}
//                 onChange={(e) => handleOverviewPointsChange(e, index)}
//                 placeholder="Description"
//               />
//             </div>
//           ))}
//           <button
//             type="button"
//             onClick={() =>
//               setDegreeData((prevState) => ({
//                 ...prevState,
//                 overviewPoints: [...prevState.overviewPoints, { title: '', description: '' }],
//               }))
//             }
//           >
//             Add Overview Point
//           </button>
//         </div>

//         {/* Courses */}
//         <div>
//           <h3>Courses</h3>
//           <input
//             type="text"
//             name="title"
//             value={course.title}
//             onChange={(e) => handleChange(e, 'title', setCourse)}
//             placeholder="Course Title"
//             required
//           />
//           <textarea
//             name="description"
//             value={course.description}
//             onChange={(e) => handleChange(e, 'description', setCourse)}
//             placeholder="Course Description"
//           />
//           <input
//             type="file"
//             onChange={(e) => handleFileChange(e, 'thumbnail', setCourse)}
//             placeholder="Course Thumbnail"
//           />
//           <button type="button" onClick={addCourse}>
//             Add Course
//           </button>

//           {/* Chapters */}
//           <div>
//             <h4>Chapters</h4>
//             {course.chapters.map((chapter, index) => (
//               <div key={index}>
//                 <input
//                   type="text"
//                   name="title"
//                   value={chapter.title}
//                   onChange={(e) => handleChange(e, 'title', setChapter)}
//                   placeholder="Chapter Title"
//                   required
//                 />
//                 <textarea
//                   name="description"
//                   value={chapter.description}
//                   onChange={(e) => handleChange(e, 'description', setChapter)}
//                   placeholder="Chapter Description"
//                 />
//                 <button type="button" onClick={addChapter}>
//                   Add Chapter
//                 </button>

//                 {/* Lessons */}
//                 <div>
//                   <h5>Lessons</h5>
//                   {chapter.lessons.map((lesson, index) => (
//                     <div key={index}>
//                       <input
//                         type="text"
//                         name="title"
//                         value={lesson.title}
//                         onChange={(e) => handleChange(e, 'title', setLesson)}
//                         placeholder="Lesson Title"
//                         required
//                       />
//                       <input
//                         type="file"
//                         onChange={(e) => handleFileChange(e, 'file', setLesson)}
//                       />
//                     </div>
//                   ))}
//                   <button type="button" onClick={addLesson}>
//                     Add Lesson
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Submit Button */}
//         <button type="submit">Add Degree</button>
//       </form>
//     </div>
//   );
// };

// export default AddDegreePage;

// import React, { useState } from 'react';

import React, { useState } from "react";

const AddDegreePage = () => {
  const [degreeData, setDegreeData] = useState({
    title: "",
    description: "",
    price: "",
    degreeThumbnail: null,
    courses: [],
  });

  const handleDegreeChange = (field, value) => {
    setDegreeData({ ...degreeData, [field]: value });
  };

  const handleFileChange = (e) => {
    setDegreeData({ ...degreeData, degreeThumbnail: e.target.files[0] });
  };

  const handleAddCourse = () => {
    setDegreeData({
      ...degreeData,
      courses: [
        ...degreeData.courses,
        { title: "", description: "", courseThumbnail: null, chapters: [] },
      ],
    });
  };

  const handleCourseChange = (index, field, value) => {
    const updatedCourses = [...degreeData.courses];
    updatedCourses[index][field] = value;
    setDegreeData({ ...degreeData, courses: updatedCourses });
  };

  const handleAddChapter = (courseIndex) => {
    const updatedCourses = [...degreeData.courses];
    updatedCourses[courseIndex].chapters.push({ title: "", lessons: [] });
    setDegreeData({ ...degreeData, courses: updatedCourses });
  };

  const handleChapterChange = (courseIndex, chapterIndex, field, value) => {
    const updatedCourses = [...degreeData.courses];
    updatedCourses[courseIndex].chapters[chapterIndex][field] = value;
    setDegreeData({ ...degreeData, courses: updatedCourses });
  };

  const handleAddLesson = (courseIndex, chapterIndex) => {
    const updatedCourses = [...degreeData.courses];
    updatedCourses[courseIndex].chapters[chapterIndex].lessons.push({
      title: "",
      file: null,
      sublessons: [],
    });
    setDegreeData({ ...degreeData, courses: updatedCourses });
  };

  const handleLessonChange = (courseIndex, chapterIndex, lessonIndex, field, value) => {
    const updatedCourses = [...degreeData.courses];
    updatedCourses[courseIndex].chapters[chapterIndex].lessons[lessonIndex][field] = value;
    setDegreeData({ ...degreeData, courses: updatedCourses });
  };

  const handleAddSublesson = (courseIndex, chapterIndex, lessonIndex) => {
    const updatedCourses = [...degreeData.courses];
    updatedCourses[courseIndex].chapters[chapterIndex].lessons[lessonIndex].sublessons.push({
      title: "",
      file: null,
    });
    setDegreeData({ ...degreeData, courses: updatedCourses });
  };

  const handleSublessonChange = (courseIndex, chapterIndex, lessonIndex, sublessonIndex, field, value) => {
    const updatedCourses = [...degreeData.courses];
    updatedCourses[courseIndex].chapters[chapterIndex].lessons[lessonIndex].sublessons[sublessonIndex][field] = value;
    setDegreeData({ ...degreeData, courses: updatedCourses });
  };



const uploadFile2 = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("https://zion-test.onrender.com/api/upload/type", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (data.success) {
      console.log(`File uploaded successfully: ${data.fileUrl}, Type: ${data.fileType}`);
      return { fileUrl: data.fileUrl, fileType: data.fileType };
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error("Error uploading lesson/sublesson file:", error.message);
    alert("File upload failed. Please try again.");
    throw error;
  }
};


 const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("https://zion-test.onrender.com/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (data.success) {
      console.log("File uploaded successfully:", data.fileUrl);
      alert(`File uploaded! Public URL: ${data.fileUrl}`);
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error("Error uploading file:", error.message);
    alert("File upload failed. Please try again.");
  }
};


  const handleSubmit = async () => {
    // Basic validation
    if (!degreeData.title || !degreeData.description || !degreeData.price) {
      alert("Please fill out all degree fields.");
      return;
    }

    for (const course of degreeData.courses) {
      if (!course.title || !course.description) {
        alert("Please fill out all course fields.");
        return;
      }
      for (const chapter of course.chapters) {
        if (!chapter.title) {
          alert("Please fill out all chapter titles.");
          return;
        }
        for (const lesson of chapter.lessons) {
          if (!lesson.title) {
            alert("Please fill out all lesson titles.");
            return;
          }
          for (const sublesson of lesson.sublessons) {
            if (!sublesson.title) {
              alert("Please fill out all sublesson titles.");
              return;
            }
          }
        }
      }
    }

    try {
      // Upload degree thumbnail
      const degreeThumbnailUrl = await uploadFile(degreeData.degreeThumbnail);

      // Upload course thumbnails, lesson files, and sublesson files
      const updatedCourses = await Promise.all(
        degreeData.courses.map(async (course) => {
          const courseThumbnailUrl = await uploadFile(course.courseThumbnail);

          const updatedChapters = await Promise.all(
            course.chapters.map(async (chapter) => {
              const updatedLessons = await Promise.all(
                chapter.lessons.map(async (lesson) => {
                  const lessonFileUrl = await uploadFile2(lesson.file);

                  const updatedSublessons = await Promise.all(
                    lesson.sublessons.map(async (sublesson) => {
                      const sublessonFileUrl = await uploadFile2(sublesson.file);
                      return { ...sublesson, file: sublessonFileUrl };
                    })
                  );

                  return { ...lesson, file: lessonFileUrl, sublessons: updatedSublessons };
                })
              );

              return { ...chapter, lessons: updatedLessons };
            })
          );

          return { ...course, courseThumbnail: courseThumbnailUrl, chapters: updatedChapters };
        })
      );

      // Prepare final degree data
      const finalDegreeData = {
        title: degreeData.title,
        description: degreeData.description,
        price: degreeData.price,
        degreeThumbnail: degreeThumbnailUrl,
        courses: updatedCourses,
      };

      // Submit the degree data
      const response = await fetch("https://zion-test.onrender.com/api/degre", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalDegreeData),
      });

      if (!response.ok) {
        throw new Error("Failed to upload degree data");
      }

      const result = await response.json();
      console.log("Degree uploaded:", result);
      alert("Degree uploaded successfully!");
    } catch (error) {
      console.error("Error uploading degree:", error);
      alert("Error uploading degree. Please try again.");
    }
  };

  return (
    <div>
      <h2>Add Degree</h2>
      <input
        type="text"
        placeholder="Title"
        onChange={(e) => handleDegreeChange("title", e.target.value)}
      />
      <input
        type="text"
        placeholder="Description"
        onChange={(e) => handleDegreeChange("description", e.target.value)}
      />
      <input
        type="number"
        placeholder="Price"
        onChange={(e) => handleDegreeChange("price", e.target.value)}
      />
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleAddCourse}>Add Course</button>
      {degreeData.courses.map((course, courseIndex) => (
        <div key={courseIndex}>
          <h3>Course {courseIndex + 1}</h3>
          <input
            type="text"
            placeholder="Course Title"
            onChange={(e) => handleCourseChange(courseIndex, "title", e.target.value)}
          />
          <input
            type="text"
            placeholder="Course Description"
            onChange={(e) => handleCourseChange(courseIndex, "description", e.target.value)}
          />
          <input
            type="file"
            onChange={(e) =>
              handleCourseChange(courseIndex, "courseThumbnail", e.target.files[0])
            }
          />
          <button onClick={() => handleAddChapter(courseIndex)}>Add Chapter</button>
          {course.chapters.map((chapter, chapterIndex) => (
            <div key={chapterIndex}>
              <h4>Chapter {chapterIndex + 1}</h4>
              <input
                type="text"
                placeholder="Chapter Title"
                onChange={(e) =>
                  handleChapterChange(courseIndex, chapterIndex, "title", e.target.value)
                }
              />
              <button onClick={() => handleAddLesson(courseIndex, chapterIndex)}>
                Add Lesson
              </button>
              {chapter.lessons.map((lesson, lessonIndex) => (
                <div key={lessonIndex}>
                  <h5>Lesson {lessonIndex + 1}</h5>
                  <input
                    type="text"
                    placeholder="Lesson Title"
                    onChange={(e) =>
                      handleLessonChange(courseIndex, chapterIndex, lessonIndex, "title", e.target.value)
                    }
                  />
                  <input
                    type="file"
                    onChange={(e) =>
                      handleLessonChange(courseIndex, chapterIndex, lessonIndex, "file", e.target.files[0])
                    }
                  />
                  <button
                    onClick={() =>
                      handleAddSublesson(courseIndex, chapterIndex, lessonIndex)
                    }
                  >
                    Add Sublesson
                  </button>
                  {lesson.sublessons.map((sublesson, sublessonIndex) => (
                    <div key={sublessonIndex}>
                      <h6>Sublesson {sublessonIndex + 1}</h6>
                      <input
                        type="text"
                        placeholder="Sublesson Title"
                        onChange={(e) =>
                          handleSublessonChange(
                            courseIndex,
                            chapterIndex,
                            lessonIndex,
                            sublessonIndex,
                            "title",
                            e.target.value
                          )
                        }
                      />
                      <input
                        type="file"
                        onChange={(e) =>
                          handleSublessonChange(
                            courseIndex,
                            chapterIndex,
                            lessonIndex,
                            sublessonIndex,
                            "file",
                            e.target.files[0]
                          )
                        }
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
      <button onClick={handleSubmit}>Submit Degree</button>
    </div>
  );
};

export default AddDegreePage;



