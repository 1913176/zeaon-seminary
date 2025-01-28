import React, { useEffect, useState } from 'react';
import { getAllDegrees } from '../Admin/firebase/degreeapi1'; // Import the API function
import './degree.css';

const ViewDegrees = () => {
    const [degrees, setDegrees] = useState([]);

    // Fetch degrees on component mount
    useEffect(() => {
        const fetchDegrees = async () => {
            try {
                const degreeList = await getAllDegrees();
                setDegrees(degreeList);
            } catch (error) {
                console.error('Error fetching degrees:', error);
                alert('Failed to load degrees.');
            }
        };

        fetchDegrees();
    }, []);

    return (
        <div className="view-degrees">
            <h1>All Degrees</h1>
            {degrees.length === 0 ? (
                <p>No degrees available</p>
            ) : (
                <div className="degrees-list">
                    {degrees.map((degree) => (
                        <DegreeCard key={degree.id} degree={degree} />
                    ))}
                </div>
            )}
        </div>
    );
};

// Component for displaying a single degree
const DegreeCard = ({ degree }) => {
    return (
        <div className="degree-card">
            <h2>{degree.degreeTitle}</h2>
            <p>{degree.description}</p>
            {degree.thumbnail && (
                <img
                    src={degree.thumbnail}
                    alt={`${degree.degreeTitle} Thumbnail`}
                    style={{ width: '200px', height: 'auto' }}
                />
            )}

            {/* Overview Points */}
            {degree.overviewPoints && (
                <div className="overview-points">
                    <h3>Overview:</h3>
                    <p>
                        <strong>{degree.overviewPoints.heading}</strong>
                    </p>
                    <p>{degree.overviewPoints.description}</p>
                </div>
            )}

            {/* Courses */}
            {degree.courses && degree.courses.length > 0 && (
                <div className="courses-section">
                    <h3>Courses:</h3>
                    {degree.courses.map((course) => (
                        <CourseCard key={course.courseId} course={course} />
                    ))}
                </div>
            )}
        </div>
    );
};

// Component for displaying a single course
const CourseCard = ({ course }) => {
    return (
        <div className="course-card">
            <h4>{course.courseTitle}</h4>
            <p>{course.description}</p>
            <p>Price: ${course.price}</p>
            {course.thumbnail && (
                <img
                    src={course.thumbnail}
                    alt={`${course.courseTitle} Thumbnail`}
                    style={{ width: '150px', height: 'auto' }}
                />
            )}

            {/* Chapters */}
            {course.chapters && course.chapters.length > 0 && (
                <div className="chapters-section">
                    <h5>Chapters:</h5>
                    {course.chapters.map((chapter) => (
                        <ChapterCard key={chapter.chapterId} chapter={chapter} />
                    ))}
                </div>
            )}

            {/* Final Test */}
            {course.finalTest && (
                <div className="final-test">
                    <h5>Final Test:</h5>
                    <p>Title: {course.finalTest.title}</p>
                    <p>Time Limit: {course.finalTest.timeLimit} minutes</p>
                </div>
            )}
        </div>
    );
};

// Component for displaying a single chapter
const ChapterCard = ({ chapter }) => {
    return (
        <div className="chapter-card">
            <h5>{chapter.chapterTitle}</h5>
            <p>{chapter.description}</p>

            {/* Lessons */}
            {chapter.lessons && chapter.lessons.length > 0 && (
                <div className="lessons-section">
                    <h6>Lessons:</h6>
                    {chapter.lessons.map((lesson) => (
                        <LessonCard key={lesson.lessonId} lesson={lesson} />
                    ))}
                </div>
            )}

            {/* Test */}
            {chapter.test && (
                <div className="chapter-test">
                    <h6>Chapter Test:</h6>
                    <p>Title: {chapter.test.title}</p>
                    <p>Time Limit: {chapter.test.timeLimit} minutes</p>
                </div>
            )}
        </div>
    );
};

// Component for displaying a single lesson
const LessonCard = ({ lesson }) => {
    return (
        <div className="lesson-card">
            <h6>{lesson.lessonTitle}</h6>
            {lesson.file && (
                <div>
                    <p>File Type: {lesson.file.type}</p>
                    <p>Duration: {lesson.file.duration ? `${lesson.file.duration} seconds` : 'N/A'}</p>
                    <a href={lesson.file.url} target="_blank" rel="noopener noreferrer">
                        Download/View File
                    </a>
                </div>
            )}
        </div>
    );
};

export default ViewDegrees;
