import { db, storage } from './firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDoc, getDocs } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { getMediaDuration } from './mediaUtils';

export const uploadFile = async (file, type) => {
  let fileURL = '';
  try {
    const supportedTypes = {
      video: 'videos',
      image: 'images',
      document: 'documents',
      pdf: 'documents',
      ppt: 'presentations',
      audio: 'audios',
    };

    const folder = supportedTypes[type];
    if (!folder) {
      throw new Error(`Unsupported file type: ${type}`);
    }

    const fileRef = ref(storage, `${folder}/${uuidv4()}_${file.name}`);
    await uploadBytes(fileRef, file);
    fileURL = await getDownloadURL(fileRef);
    console.log(`File uploaded to Firebase Storage (${folder} folder), URL:`, fileURL);

    return fileURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('File upload failed');
  }
};


// Create a test object
const createTestObject = (testData) => {
  return {
    test_id: uuidv4(),
    title: testData.title,
    timeLimit: testData.timeLimit,
    type: testData.type, // quiz or paragraph
    questions: testData.questions.map((question) => ({
      question: question.question,
      options: question.options || null,
      correctAnswer: question.correctAnswer || null,
    })),
  };
};

// Add Degree with courses and tests
export const addDegree = async (degreeData) => {
  try {
    const degreeId = uuidv4();
    const courses = await Promise.all(degreeData.courses.map(async (course) => {
      let thumbnailUrl = '';
      if (course.thumbnail) {
        thumbnailUrl = await uploadFile(course.thumbnail, 'image');
      }

      let finalTest = null;
      if (course.finalTest) {
        finalTest = createTestObject(course.finalTest); // Final test for the course
      }

      return {
        course_id: uuidv4(),
        title: course.title,
        description: course.description,
        image: course.image || '',
        chapters: [], // Placeholder for chapters
        finalTest: finalTest, // Final test for the course
      };
    }));

    await addDoc(collection(db, 'degrees'), {
      id: degreeId,
      degree_title: degreeData.degree_title,
      description: degreeData.description,
      price: degreeData.price,
      thumbnail: degreeData.thumbnail || null,
      courses,
      createdAt: Date.now(),
    });

    console.log('Degree with courses successfully saved to Firestore!');
    return degreeId;
  } catch (error) {
    console.error('Error saving degree:', error);
    return null;
  }
};

// Add a course to an existing degree

export const addCourseToDegree = async (degreeId, courseData) => {
  try {
    const degreeRef = doc(db, 'degrees', degreeId);
    const degreeSnapshot = await getDoc(degreeRef);

    if (!degreeSnapshot.exists()) {
      console.error('No such degree found with id:', degreeId);
      return false;
    }

    const degreeData = degreeSnapshot.data();

    const newCourse = {
      course_id: uuidv4(),
      title: courseData.title,
      description: courseData.description,
      image: courseData.image || '',
      chapters: [], // Placeholder for chapters
      finalTest: courseData.finalTest ? createTestObject(courseData.finalTest) : null, // Final test for the course
    };

    const updatedCourses = [...degreeData.courses, newCourse];

    await updateDoc(degreeRef, { courses: updatedCourses });
    console.log('Course successfully added to degree!');
    return true;
  } catch (error) {
    console.error('Error adding course:', error);
    return false;
  }
};



// Add a chapter to a course
export const addChapterToCourse = async (degreeId, courseId, chapterData) => {
  try {
    const degreeRef = doc(db, 'degrees', degreeId);
    const degreeSnapshot = await getDoc(degreeRef);
    const degreeData = degreeSnapshot.data();

    const updatedCourses = degreeData.courses.map((course) => {
      if (course.course_id === courseId) {
        const newChapter = {
          chapter_id: uuidv4(),
          title: chapterData.title,
          description: chapterData.description,
          lessons: [] // Placeholder for lessons
        };
        return { ...course, chapters: [...(course.chapters || []), newChapter] };
      }
      return course;
    });

    await updateDoc(degreeRef, { courses: updatedCourses });
    console.log('Chapter successfully added to course!');
    return true;
  } catch (error) {
    console.error('Error adding chapter:', error);
    return false;
  }
};

export const addLessonToChapter = async (degreeId, courseId, chapterId, lessonData, file) => {
  try {
    const degreeRef = doc(db, 'degrees', degreeId);
    const degreeSnapshot = await getDoc(degreeRef);

    if (!degreeSnapshot.exists()) {
      console.error('No such degree found with id:', degreeId);
      return false;
    }

    const degreeData = degreeSnapshot.data();

    let fileMetadata = null;
    if (file) {
      const fileType = file.type.split('/')[0]; 
      const fileUrl = await uploadFile(file, fileType); 

      let duration = null;
      if (fileType === 'video' || fileType === 'audio') {
        duration = await getMediaDuration(file); 
      }

      fileMetadata = {
        url: fileUrl, 
        type: fileType, 
        name: file.name, 
        duration, 
        link: fileUrl,
      };
    }
    const updatedCourses = degreeData.courses.map((course) => {
      if (course.course_id === courseId) {
        const updatedChapters = course.chapters.map((chapter) => {
          if (chapter.chapter_id === chapterId) {
            const newLesson = {
              lesson_id: uuidv4(),
              title: lessonData.title,
              description: lessonData.description,
              file: fileMetadata, 
              test: lessonData.test ? createTestObject(lessonData.test) : null,
            };
            return { ...chapter, lessons: [...(chapter.lessons || []), newLesson] };
          }
          return chapter;
        });
        return { ...course, chapters: updatedChapters };
      }
      return course;
    });

    await updateDoc(degreeRef, { courses: updatedCourses });
    console.log('Lesson successfully added to chapter!');
    return true;
  } catch (error) {
    console.error('Error adding lesson:', error);
    return false;
  }
};


// Edit Chapter
export const editChapter = async (degreeId, courseId, chapterId, updatedChapterData) => {
  try {
    const degreeRef = doc(db, 'degrees', degreeId);
    const degreeSnapshot = await getDoc(degreeRef);
    const degreeData = degreeSnapshot.data();

    const updatedCourses = degreeData.courses.map((course) => {
      if (course.course_id === courseId) {
        const updatedChapters = course.chapters.map((chapter) =>
          chapter.chapter_id === chapterId ? { ...chapter, ...updatedChapterData, updatedAt: Date.now() } : chapter
        );
        return { ...course, chapters: updatedChapters };
      }
      return course;
    });

    await updateDoc(degreeRef, { courses: updatedCourses });
    console.log('Chapter updated successfully!');
    return true;
  } catch (error) {
    console.error('Error updating chapter:', error);
    return false;
  }
};

// Edit Lesson
export const editLesson = async (degreeId, courseId, chapterId, lessonId, updatedLessonData, newFile) => {
  try {
    const degreeRef = doc(db, 'degrees', degreeId);
    const degreeSnapshot = await getDoc(degreeRef);

    if (!degreeSnapshot.exists()) {
      console.error('No such degree found with id:', degreeId);
      return false;
    }

    const degreeData = degreeSnapshot.data();
    let newFileMetadata = null;
    let newDuration = null;

    if (newFile) {
      const fileType = newFile.type.split('/')[0];
      const fileUrl = await uploadFile(newFile, fileType);

      newFileMetadata = {
        url: fileUrl,
        type: fileType,
        name: newFile.name,
      };

      if (fileType === 'video' || fileType === 'audio') {
        newDuration = await getMediaDuration(fileUrl);
      }
    }

    const updatedCourses = degreeData.courses.map((course) => {
      if (course.course_id === courseId) {
        const updatedChapters = course.chapters.map((chapter) => {
          if (chapter.chapter_id === chapterId) {
            const updatedLessons = chapter.lessons.map((lesson) => {
              if (lesson.lesson_id === lessonId) {
                return {
                  ...lesson,
                  title: updatedLessonData.title || lesson.title,
                  description: updatedLessonData.description || lesson.description,
                  file: newFileMetadata || lesson.file,
                  duration: newDuration || lesson.duration, 
                  test: updatedLessonData.test || lesson.test,
                };
              }
              return lesson;
            });
            return { ...chapter, lessons: updatedLessons };
          }
          return chapter;
        });
        return { ...course, chapters: updatedChapters };
      }
      return course;
    });

    await updateDoc(degreeRef, { courses: updatedCourses });
    console.log('Lesson successfully updated!');
    return true;
  } catch (error) {
    console.error('Error updating lesson:', error);
    return false;
  }
};


// Edit Test
export const editTest = async (degreeId, courseId, chapterId, lessonId, testId, updatedTestData) => {
  try {
    const degreeRef = doc(db, 'degrees', degreeId);
    const degreeSnapshot = await getDoc(degreeRef);
    const degreeData = degreeSnapshot.data();

    const updatedCourses = degreeData.courses.map((course) => {
      if (course.course_id === courseId) {
        const updatedChapters = course.chapters.map((chapter) => {
          if (chapter.chapter_id === chapterId) {
            const updatedLessons = chapter.lessons.map((lesson) => {
              if (lesson.lesson_id === lessonId && lesson.test?.test_id === testId) {
                lesson.test = { ...lesson.test, ...updatedTestData, updatedAt: Date.now() };
              }
              return lesson;
            });
            return { ...chapter, lessons: updatedLessons };
          }
          return chapter;
        });
        return { ...course, chapters: updatedChapters };
      }
      return course;
    });

    await updateDoc(degreeRef, { courses: updatedCourses });
    console.log('Test updated successfully!');
    return true;
  } catch (error) {console.error('Error updating test:', error);
    return false;
  }
};

// Delete Chapter
export const deleteChapter = async (degreeId, courseId, chapterId) => {
  try {
    const degreeRef = doc(db, 'degrees', degreeId);
    const degreeSnapshot = await getDoc(degreeRef);
    const degreeData = degreeSnapshot.data();

    const updatedCourses = degreeData.courses.map((course) => {
      if (course.course_id === courseId) {
        const updatedChapters = course.chapters.filter((chapter) => chapter.chapter_id !== chapterId);
        return { ...course, chapters: updatedChapters };
      }
      return course;
    });

    await updateDoc(degreeRef, { courses: updatedCourses });
    console.log('Chapter deleted successfully!');
    return true;
  } catch (error) {
    console.error('Error deleting chapter:', error);
    return false;
  }
};

// Delete Lesson
export const deleteLesson = async (degreeId, courseId, chapterId, lessonId) => {
  try {
    const degreeRef = doc(db, 'degrees', degreeId);
    const degreeSnapshot = await getDoc(degreeRef);

    if (!degreeSnapshot.exists()) {
      console.error('No such degree found with id:', degreeId);
      return false;
    }

    const degreeData = degreeSnapshot.data();

    const updatedCourses = degreeData.courses.map((course) => {
      if (course.course_id === courseId) {
        const updatedChapters = course.chapters.map((chapter) => {
          if (chapter.chapter_id === chapterId) {
            const updatedLessons = chapter.lessons.filter((lesson) => {
              if (lesson.lesson_id === lessonId) {
                if (lesson.file?.url) {
                  deleteFile(lesson.file.url); 
                }
                return false; 
              }
              return true;
            });
            return { ...chapter, lessons: updatedLessons };
          }
          return chapter;
        });
        return { ...course, chapters: updatedChapters };
      }
      return course;
    });

    await updateDoc(degreeRef, { courses: updatedCourses });
    console.log('Lesson successfully deleted!');
    return true;
  } catch (error) {
    console.error('Error deleting lesson:', error);
    return false;
  }
};

// Delete Test
export const deleteTest = async (degreeId, courseId, chapterId, lessonId, testId) => {
  try {
    const degreeRef = doc(db, 'degrees', degreeId);
    const degreeSnapshot = await getDoc(degreeRef);
    const degreeData = degreeSnapshot.data();

    const updatedCourses = degreeData.courses.map((course) => {
      if (course.course_id === courseId) {
        const updatedChapters = course.chapters.map((chapter) => {
          if (chapter.chapter_id === chapterId) {
            const updatedLessons = chapter.lessons.map((lesson) => {
              if (lesson.lesson_id === lessonId && lesson.test?.test_id === testId) {
                lesson.test = null; // Remove the test
              }
              return lesson;
            });
            return { ...chapter, lessons: updatedLessons };
          }
          return chapter;
        });
        return { ...course, chapters: updatedChapters };
      }
      return course;
    });

    await updateDoc(degreeRef, { courses: updatedCourses });
    console.log('Test deleted successfully!');
    return true;
  } catch (error) {
    console.error('Error deleting test:', error);
    return false;
  }
};


// Get all degrees
export const getAllDegrees = async () => {
  try {
    const degreesCollectionRef = collection(db, 'degrees');
    const degreesSnapshot = await getDocs(degreesCollectionRef);
    const degreesList = degreesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return degreesList;
  } catch (error) {
    console.error('Error getting all degrees:', error);
    return [];
  }
};

// Get a degree by ID
export const getDegreeById = async (degreeId) => {
  try {
    const degreeRef = doc(db, 'degrees', degreeId);
    const degreeSnapshot = await getDoc(degreeRef);
    if (degreeSnapshot.exists()) {
      const data = degreeSnapshot.data();
      console.log('Degree data retrieved:', data);
      return data;
    } else {
      console.log('No such degree found!');
      return null;
    }
  } catch (error) {
    console.error('Error getting degree:', error);
    return null;
  }
};

// Get a course by ID
export const getCourseById = async (degreeId, courseId) => {
  try {
    const degreeRef = doc(db, 'degrees', degreeId);
    const degreeSnapshot = await getDoc(degreeRef);
    if (degreeSnapshot.exists()) {
      const degreeData = degreeSnapshot.data();
      const course = degreeData.courses.find((course) => course.course_id === courseId);
      if (course) {
        console.log('Course data retrieved:', course);
        return course;
      } else {
        console.log('No such course found!');
        return null;
      }
    } else {
      console.log('No such degree found!');
      return null;
    }
  } catch (error) {
    console.error('Error getting course:', error);
    return null;
  }
};
// Edit Course
export const editCourse = async (degreeId, courseId, updatedCourseData) => {
  try {
    const degreeRef = doc(db, 'degrees', degreeId);
    const degreeSnapshot = await getDoc(degreeRef);

    if (!degreeSnapshot.exists()) {
      console.error('No such degree found with id:', degreeId);
      return false;
    }

    const degreeData = degreeSnapshot.data();

    const updatedCourses = degreeData.courses.map((course) =>
      course.course_id === courseId
        ? { ...course, ...updatedCourseData, updatedAt: Date.now() }
        : course
    );

    await updateDoc(degreeRef, { courses: updatedCourses });
    console.log('Course updated successfully!');
    return true;
  } catch (error) {
    console.error('Error updating course:', error);
    return false;
  }
};

// Delete Course
export const deleteCourse = async (degreeId, courseId) => {
  try {
    const degreeRef = doc(db, 'degrees', degreeId);
    const degreeSnapshot = await getDoc(degreeRef);

    if (!degreeSnapshot.exists()) {
      console.error('No such degree found with id:', degreeId);
      return false;
    }

    const degreeData = degreeSnapshot.data();

    const updatedCourses = degreeData.courses.filter((course) => course.course_id !== courseId);

    await updateDoc(degreeRef, { courses: updatedCourses });
    console.log('Course deleted successfully!');
    return true;
  } catch (error) {
    console.error('Error deleting course:', error);
    return false;
  }
};
// Edit Degree
export const editDegree = async (degreeId, updatedDegreeData) => {
  try {
    const degreeRef = doc(db, 'degrees', degreeId);
    const degreeSnapshot = await getDoc(degreeRef);

    if (!degreeSnapshot.exists()) {
      console.error('No such degree found with id:', degreeId);
      return false;
    }

    const updatedData = {
      degree_title: updatedDegreeData.degree_title,
      description: updatedDegreeData.description,
      price: updatedDegreeData.price,
      thumbnail: updatedDegreeData.thumbnail || null, // If thumbnail is updated
      updatedAt: Date.now(),
    };
    
    await updateDoc(degreeRef, updatedData);
    console.log('Degree updated successfully!');
    return true;
  } catch (error) {
    console.error('Error updating degree:', error);
    return false;
  }
};

// Delete Degree
export const deleteDegree = async (degreeId) => {
  try {
    await deleteDoc(doc(db, 'degrees', degreeId));
    console.log('Degree deleted successfully!');
    return true;
  } catch (error) {
    console.error('Error deleting degree:', error);
    return false;
  }
};