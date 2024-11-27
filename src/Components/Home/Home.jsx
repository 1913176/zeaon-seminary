import React, { useState, useEffect } from "react";
import "./Home.css";
import axios from "axios";
import TopBar from "../TopBar/TopBar";
import Header from "../Header/Header.jsx";
import CustomCalendar from "../Calendar/Calendar.jsx";
import Statistics from "../Statistics/Statistics.jsx";
import LoadingPage from "../LoadingPage/LoadingPage";
import CourseRecommendation from "../CourseRecomend/CourseRecommendation";
import ErrorDataFetchOverlay from "../Error/ErrorDataFetchOverlay";

function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [recommendedCourses, setRecommendedCourses] = useState([]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  //       const response = await axios.get(`${apiBaseUrl}/courseDetail`);
  //       const courses = response.data;

  //       //
  //       const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  //       if (userInfo) {
  //         const { coursePurchased } = userInfo;

  //         // Checking course vangiyacha ?
  //         // if (coursePurchased.length === 0) {
  //         //   setHasPurchasedCourses(false);
  //         // }

  //         // Filtering
  //         // const filteredCourses = courses.filter((course) =>
  //         //   coursePurchased.includes(course._id)
  //         // );
  //         const filteredCourses = courses.filter(
  //           (course) => !coursePurchased.includes(course._id)
  //         );
  //         setRecommendedCourses(filteredCourses);
  //       } else {
  //         setFetchError(true);
  //         alert("User not logged in, Go to Profile page");
  //         console.log("No user info found in localStorage");
  //       }
  //       // setRecommendedCourses(courses);
  //       setIsLoading(false);
  //     } catch (err) {
  //       console.error("Error fetching course details:", err);
  //       setFetchError(true);
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, []);

  // Shuffle recommended courses
  const shuffledCourses = [...recommendedCourses].sort(
    () => 0.5 - Math.random()
  );

  // if (isLoading) {
  //   return <LoadingPage />;
  // }

  if (fetchError) {
    return <ErrorDataFetchOverlay />;
  }

  return (
    <div className="mainContent">
      <TopBar />
      <div className="headerPart">
        <Header />
        <CustomCalendar />
      </div>
      <Statistics />
      <div className="home-courseBox">
        <h3>Recommended Courses</h3>
        <div className="home-course">
          {/* {shuffledCourses.slice(0, 7).map((course, index) => (
            <CourseRecommendation
              key={index}
              title={course.title}
              courseId={course._id}
              imgName={course.image}
            />
          ))} */}
        </div>
      </div>
    </div>
  );
}

export default Home;
