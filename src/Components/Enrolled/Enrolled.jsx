import React, { useState, useEffect } from "react";
// import axios from "axios";
import "../Degrees/Degrees.css"
import { useNavigate } from "react-router-dom";
import imgd from "../Assets/Images/imagenotxt2.png";
import LoadingPage from "../LoadingPage/LoadingPage";
import ErrorDataFetchOverlay from "../Error/ErrorDataFetchOverlay";
import courseDataJson from "../Assets/Data/CourseList.json";

const Enrolled = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [allLessons, setAllLessons] = useState([]);
  const [coursesData, setCoursesData] = useState([]);
  const [fetchError, setFetchError] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [hasPurchasedCourses, setHasPurchasedCourses] = useState(true);

  useEffect(()=>{
    setIsLoading(false)
    setCoursesData(courseDataJson);
  })

  // Data Fetching
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

  //       const coursesResponse = await axios.get(`${apiBaseUrl}/courseDetail`);

  //       const allCourses = coursesResponse.data;

  //       // isUserLogin ?
  //       const userInfo = JSON.parse(localStorage.getItem("userDataUpdated"));
  //       // console.log(userInfo);
  //       if (userInfo) {
  //         const { coursePurchased } = userInfo;
  //         const courseIds = coursePurchased.map((course) => course.courseId);

  //         // Checking course vangiyacha ?
  //         if (
  //           courseIds.length === 0 ||
  //           (courseIds.length === 1 &&
  //             (courseIds[0] === "" || courseIds[0] === null))
  //         ) {
  //           setHasPurchasedCourses(false);
  //         } else {
  //           setHasPurchasedCourses(true);
  //         }

  //         // Filtering
  //         const filteredCourses = allCourses.filter((course) =>
  //           courseIds.includes(course._id)
  //         );
  //         setCoursesData(filteredCourses);
  //       } else {
  //         setFetchError(true);
  //         alert("User not logged in, Go to Profile page");
  //         console.log("No user info found in localStorage");
  //       }

  //       setIsLoading(false);
  //     } catch (error) {
  //       setFetchError(true);
  //       setIsLoading(false);
  //     }
  //   };
  //   fetchData();
  // }, []);

  // useEffect(() => {
  //   const getAllLessons = () => {
  //     let lessons = [];
  //     coursesData.forEach((course) => {
  //       course.lessons.forEach((lesson) => {
  //         if (!lessons.includes(lesson.title)) {
  //           lessons.push(lesson.title);
  //         }
  //       });
  //     });

  //     // Random
  //     for (let i = lessons.length - 1; i > 0; i--) {
  //       const j = Math.floor(Math.random() * (i + 1));
  //       [lessons[i], lessons[j]] = [lessons[j], lessons[i]];
  //     }
  //     return lessons.slice(0, 10);
  //   };

  //   if (coursesData.length > 0) {
  //     setAllLessons(getAllLessons());
  //   }
  // }, [coursesData]);

  const resolveImagePath = (imagePath) => {
    if (
      imagePath &&
      (imagePath.startsWith("http://") || imagePath.startsWith("https://"))
    ) {
      return imagePath;
    } else if (imagePath && imagePath.startsWith("base64")) {
      return imgd;
    } else {
      try {
        return require(`../Assets/Images/${imagePath}`);
      } catch (error) {
        return imgd;
      }
    }
  };

  const filterCourses = (filters) => {
    try {
      if (filters.length === 0) {
        return coursesData;
      } else {
        return coursesData.filter((course) =>
          course.lessons.some((lesson) => filters.includes(lesson.title))
        );
      }
    } catch (err) {
      console.log(err);
      setFetchError(true);
      return [];
    }
  };

  // const handleFilterClick = (filter) => {
  //   if (selectedFilters.includes(filter)) {
  //     setSelectedFilters(selectedFilters.filter((f) => f !== filter));
  //   } else {
  //     setSelectedFilters([...selectedFilters, filter]);
  //   }
  // };

  // const clearFilters = () => {
  //   setSelectedFilters([]);
  // };

  const truncateDescription = (description) => {
    const words = description.split(" ");
    const truncated = words.slice(0, 15).join(" ");
    return truncated;
  };

  if (isLoading) {
    return (
      <div>
        <LoadingPage />

      </div>
    );
  }

  // if (!fetchError) {
  //   return <ErrorDataFetchOverlay />;
  // }

  return (
    <>
      <div className="main-content">
        <div className="cardContainer3">
          <h2>Enrolled Courses</h2>
          {!hasPurchasedCourses && (
            <h3>No courses have been purchased. Please purchase a course.</h3>
          )}

          <div className="filterChips">
            {allLessons.map((lesson, index) => (
              <div
                key={index}
                className={`filterChip ${
                  selectedFilters.includes(lesson) ? "active" : ""
                }`}
                onClick={() => handleFilterClick(lesson)}
              >
                {lesson}
              </div>
            ))}
            {selectedFilters.length > 0 && (
              <button className="clearFilters" onClick={clearFilters}>
                Clear All
              </button>
            )}
          </div>
          <div className="courseContainer3">
            {filterCourses(selectedFilters).map((course) => (
              <div className="courseCard3" key={course._id}>
                <div className="courseOverlay3">
                  <div className="courseImageBox3">
                    <img
                      // src={imgd}
                      src={course.image ? resolveImagePath(course.image) : imgd}
                      alt={course.title}
                      className="courseImage3"
                    />
                    <div className="courseImageTxt3">{course.title}</div>
                  </div>
                  <div className="courseDetails3">
                    <p>{truncateDescription(course.description)}...</p>
                    <button className="courseDetailBtn3">View Details</button>
                  </div>
                </div>
                <div className="courseLessonBox3">
                  <h5>Lessons</h5>
                  <ul>
                    {course.lessons.slice(0, 3).map((lesson, index) => (
                      <li key={index}>{lesson.title}</li>
                    ))}
                    {course.lessons.length > 3 && <li>...and more</li>}
                  </ul>
                  <button
                    onClick={() =>
                      navigate(`/home/courseContent/${course._id}`)
                    }
                    className="lessonDetailBtn3"
                  >
                    View Course
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Enrolled;
