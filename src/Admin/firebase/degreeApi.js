import { db, storage } from './firebase';
import { collection, doc, getDocs, query, where, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';


export const uploadFile = async (file) => {
    try {
        const supportedFolders = {
            video: 'videos',
            audio: 'audios',
            image: 'images',
            document: 'documents',
            pdf: 'documents',
            ppt: 'presentations',
        };

        const fileType = file.type.split('/')[0]; 
        const folder = supportedFolders[fileType];
        if (!folder) throw new Error(`Unsupported file type: ${file.type}`);

        const fileRef = ref(storage, `${folder}/${uuidv4()}_${file.name}`);
        await uploadBytes(fileRef, file);
        const fileUrl = await getDownloadURL(fileRef);

        let duration = null;
        if (fileType === 'video' || fileType === 'audio') {
            duration = await getMediaDuration(file); 
        }

        return {
            url: fileUrl,
            type: fileType,
            name: file.name,
            duration,
            autoUpdate: true,
            link: fileUrl,
        };
    } catch (error) {
        console.error('Error uploading file:', error);
        throw new Error('File upload failed');
    }
};


const getMediaDuration = (file) => {
    return new Promise((resolve) => {
        const mediaElement = document.createElement(file.type.startsWith('audio') ? 'audio' : 'video');
        mediaElement.preload = 'metadata';

        const fileUrl = URL.createObjectURL(file);
        mediaElement.src = fileUrl;

        mediaElement.onloadedmetadata = () => {
            URL.revokeObjectURL(fileUrl);
            resolve(mediaElement.duration); 
        };

        mediaElement.onerror = () => {
            resolve(null); 
        };
    });
};


const createTestObject = (testData) => ({
    testId: uuidv4(),
    title: testData.title,
    timeLimit: testData.timeLimit,
    type: testData.type, 
    questions: testData.questions.map((question) => ({
        question: question.question,
        options: question.options || null,
        correctAnswer: question.correctAnswer || null,
    })),
});


export const addDegree = async (degreeData) => {
    try {
        const { name, description, thumbnail, overviewPoints, courses } = degreeData;

        const degreeThumbnailUrl = thumbnail ? await uploadFile(thumbnail) : null;

        const formattedCourses = await Promise.all(courses.map(async (course) => {
            const courseThumbnailUrl = course.thumbnail ? await uploadFile(course.thumbnail) : null;

            const formattedChapters = await Promise.all(course.chapters.map(async (chapter) => {
                const formattedLessons = await Promise.all(chapter.lessons.map(async (lesson) => {
                    const lessonFileMetadata = await uploadFile(lesson.file);

                    return {
                        lessonId: uuidv4(),
                        lessonTitle: lesson.title,
                        file: lessonFileMetadata,
                    };
                }));

                return {
                    chapterId: uuidv4(),
                    chapterTitle: chapter.title,
                    description: chapter.description || '',
                    test: chapter.test ? createTestObject(chapter.test) : null,
                    lessons: formattedLessons,
                };
            }));

            return {
                courseId: uuidv4(),
                courseTitle: course.title,
                description: course.description,
                thumbnail: courseThumbnailUrl,
                price: course.price,
                chapters: formattedChapters,
                finalTest: course.finalTest ? createTestObject(course.finalTest) : null,
                overviewPoints: course.overviewPoints || null,
            };
        }));

        const degree = {
            degreeId: uuidv4(),
            degreeTitle: name,
            description,
            thumbnail: degreeThumbnailUrl,
            overviewPoints: overviewPoints || null,
            courses: formattedCourses,
            createdAt: Date.now(),
        };

        await addDoc(collection(db, 'degrees'), degree);
        console.log('Degree added successfully!');
        return degree.degreeId;
    } catch (error) {
        console.error('Error adding degree:', error);
        throw new Error('Degree saving failed');
    }
};

export const getAllDegrees = async () => {
  try {
      const degreesSnapshot = await getDocs(collection(db, 'degrees'));
      const degrees = degreesSnapshot.docs.map(doc => ({
          id: doc.id, 
          ...doc.data(), 
      }));

      console.log(`${degrees.length} degrees fetched successfully!`);
      return degrees;
  } catch (error) {
      console.error('Error fetching all degrees:', error);
      return [];
  }
};

export const getDegreeById = async (degreeId) => {
    try {
        const degreesQuery = query(collection(db, 'degrees'), where('degreeId', '==', degreeId));
        const degreeSnapshot = await getDocs(degreesQuery);

        if (degreeSnapshot.empty) throw new Error(`No degree found with ID: ${degreeId}`);
        return degreeSnapshot.docs[0].data();
    } catch (error) {
        console.error('Error fetching degree by ID:', error);
        return null;
    }
};


export const editDegree = async (degreeId, updates) => {
    try {
        const degreeDocQuery = query(collection(db, 'degrees'), where('degreeId', '==', degreeId));
        const degreeSnapshot = await getDocs(degreeDocQuery);

        if (degreeSnapshot.empty) {
            throw new Error(`Degree with ID ${degreeId} not found.`);
        }

        const degreeDoc = degreeSnapshot.docs[0];
        const degreeData = degreeDoc.data();
        const degreeRef = degreeDoc.ref;

        if (updates.newCourse) {
            const newCourse = {
                courseId: uuidv4(),
                courseTitle: updates.newCourse.title,
                description: updates.newCourse.description,
                thumbnail: updates.newCourse.thumbnail ? await uploadFile(updates.newCourse.thumbnail) : null,
                price: updates.newCourse.price,
                chapters: [],
                finalTest: updates.newCourse.finalTest ? createTestObject(updates.newCourse.finalTest) : null,
                overviewPoints: updates.newCourse.overviewPoints || null,
            };

            degreeData.courses.push(newCourse);
        }

        if (updates.newChapter) {
            const { courseId, title, description } = updates.newChapter;

            const courseIndex = degreeData.courses.findIndex(course => course.courseId === courseId);
            if (courseIndex === -1) {
                throw new Error(`Course with ID ${courseId} not found.`);
            }

            const newChapter = {
                chapterId: uuidv4(),
                chapterTitle: title,
                description: description || '',
                lessons: [],
                test: null,
            };

            degreeData.courses[courseIndex].chapters.push(newChapter);
        }

        if (updates.newLesson) {
            const { courseId, chapterId, title, file } = updates.newLesson;

            const courseIndex = degreeData.courses.findIndex(course => course.courseId === courseId);
            if (courseIndex === -1) {
                throw new Error(`Course with ID ${courseId} not found.`);
            }

            const chapterIndex = degreeData.courses[courseIndex].chapters.findIndex(chapter => chapter.chapterId === chapterId);
            if (chapterIndex === -1) {
                throw new Error(`Chapter with ID ${chapterId} not found.`);
            }

            const lessonFileMetadata = await uploadFile(file);

            const newLesson = {
                lessonId: uuidv4(),
                lessonTitle: title,
                file: lessonFileMetadata,
            };

            degreeData.courses[courseIndex].chapters[chapterIndex].lessons.push(newLesson);
        }

        await updateDoc(degreeRef, degreeData);
        console.log('Degree updated successfully!');
        return true;
    } catch (error) {
        console.error('Error updating degree:', error);
        return false;
    }
};


export const deleteDegreeById = async (degreeId) => {
  try {
      const degreesQuery = query(collection(db, 'degrees'), where('degreeId', '==', degreeId));
      const degreeSnapshot = await getDocs(degreesQuery);

      if (degreeSnapshot.empty) {
          throw new Error(`No degree found with ID: ${degreeId}`);
      }

      const degreeDocRef = degreeSnapshot.docs[0].ref;
      await deleteDoc(degreeDocRef);

      console.log(`Degree with ID ${degreeId} deleted successfully!`);
      return { success: true, message: 'Degree deleted successfully' };
  } catch (error) {
      console.error('Error deleting degree:', error);
      return { success: false, message: 'Error deleting degree' };
  }
};



// import { db, storage } from './firebase';
// import {collection, doc, getDoc, getDocs, updateDoc, query, where, addDoc } from 'firebase/firestore';
// import { v4 as uuidv4 } from 'uuid';
// import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
// import { getMediaDuration } from './mediaUtils';

// export const uploadFile = async (file, type) => {
//   let fileURL = '';
//   try {
//     const supportedTypes = {
//       video: 'videos',
//       image: 'images',
//       document: 'documents',
//       pdf: 'documents',
//       ppt: 'presentations',
//       audio: 'audios',
//     };

//     const folder = supportedTypes[type];
//     if (!folder) {
//       throw new Error(`Unsupported file type: ${type}`);
//     }

//     const fileRef = ref(storage, `${folder}/${uuidv4()}_${file.name}`);
//     await uploadBytes(fileRef, file);
//     fileURL = await getDownloadURL(fileRef);
//     console.log(`File uploaded to Firebase Storage (${folder} folder), URL:`, fileURL);

//     return fileURL;
//   } catch (error) {
//     console.error('Error uploading file:', error);
//     throw new Error('File upload failed');
//   }
// };


// // Create a test object
// const createTestObject = (testData) => {
//   return {
//     test_id: uuidv4(),
//     title: testData.title,
//     timeLimit: testData.timeLimit,
//     type: testData.type, // quiz or paragraph
//     questions: testData.questions.map((question) => ({
//       question: question.question,
//       options: question.options || null,
//       correctAnswer: question.correctAnswer || null,
//     })),
//   };
// };

// export const getDegreeById = async (degreeId) => {
//   try {
//     const degreesQuery = query(
//       collection(db, 'degrees'),
//       where('id', '==', degreeId) 
//     );
//     const degreeSnapshot = await getDocs(degreesQuery);

//     if (degreeSnapshot.empty) {
//       throw new Error(`No degree found with id: ${degreeId}`);
//     }

//     return degreeSnapshot.docs[0]; 
//   } catch (error) {
//     console.error('Error fetching degree by id:', error);
//     return null;
//   }
// };

// // Add Degree with courses and tests
// export const addDegree = async (degreeData) => {
//   try {
//     const degreeId = uuidv4();
//     let thumbnailUrl = '';

//     // Upload thumbnail if provided
//     if (degreeData.thumbnail) {
//       thumbnailUrl = await uploadFile(degreeData.thumbnail, 'image');
//     }

//     const courses = await Promise.all(
//       degreeData.courses.map(async (course) => {
//         let courseThumbnailUrl = '';
//         if (course.thumbnail) {
//           courseThumbnailUrl = await uploadFile(course.thumbnail, 'image');
//         }

//         let finalTest = null;
//         if (course.finalTest) {
//           finalTest = createTestObject(course.finalTest); // Final test for the course
//         }

//         return {
//           course_id: uuidv4(),
//           title: course.title,
//           description: course.description,
//           image: courseThumbnailUrl || '',
//           chapters: [], // Placeholder for chapters
//           finalTest: finalTest, 
//         };
//       })
//     );

//     await addDoc(collection(db, 'degrees'), {
//       id: degreeId, 
//       degree_title: degreeData.name,
//       description: degreeData.description,
//       price: degreeData.price,
//       thumbnail: thumbnailUrl || null,
//       courses,
//       createdAt: Date.now(),
//     });

//     console.log('Degree with courses successfully saved to Firestore!');
//     return degreeId;
//   } catch (error) {
//     console.error('Error saving degree:', error);
//     return null;
//   }
// };


// // Add a course to an existing degree
export const addCourseToDegree = async (degreeId, courseData) => {
  try {
    const degreeDoc = await getDegreeById(degreeId); 
    if (!degreeDoc) {
      return false;
    }

    const degreeRef = degreeDoc.ref; 
    const degreeData = degreeDoc.data();

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
    const degreeDoc = await getDegreeById(degreeId); 
    if (!degreeDoc) {
      return false;
    }
    const degreeRef = degreeDoc.ref; 
    const degreeData = degreeDoc.data();

    const updatedCourses = degreeData.courses.map((course) => {
      if (course.course_id === courseId) {
        const newChapter = {
          chapter_id: uuidv4(),
          title: chapterData.title,
          description: chapterData.description,
          lessons: [], // Placeholder for lessons
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
    const degreeDoc = await getDegreeById(degreeId); 
    if (!degreeDoc) {
      return false;
    }

    const degreeRef = degreeDoc.ref; 
    const degreeData = degreeDoc.data();

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


// Edit Test
export const editTest = async (degreeId, courseId, chapterId, lessonId, testId, updatedTestData) => {
  try {
    const lesson = await getLessonById(degreeId, courseId, chapterId, lessonId);
    if (!lesson) {
      throw new Error(`Lesson with id ${lessonId} does not exist`);
    }

    if (lesson.test && lesson.test.test_id === testId) {
      const updatedTest = { ...lesson.test, ...updatedTestData, updatedAt: Date.now() };
      const updatedLessons = lesson.chapter.lessons.map((lessonItem) =>
        lessonItem.lesson_id === lessonId
          ? { ...lessonItem, test: updatedTest }
          : lessonItem
      );

      const updatedChapters = lesson.chapter.course.chapters.map((chapter) =>
        chapter.chapter_id === chapterId
          ? { ...chapter, lessons: updatedLessons }
          : chapter
      );

      const updatedCourses = lesson.chapter.course.degree.courses.map((course) =>
        course.course_id === courseId
          ? { ...course, chapters: updatedChapters }
          : course
      );

      await updateDoc(doc(db, 'degrees', degreeId), { courses: updatedCourses });
      console.log('Test updated successfully!');
      return true;
    } else {
      throw new Error(`Test with id ${testId} does not exist in this lesson`);
    }
  } catch (error) {
    console.error('Error updating test:', error);
    return false;
  }
};

// // Delete Test
export const deleteTest = async (degreeId, courseId, chapterId, lessonId, testId) => {
  try {
    const lesson = await getLessonById(degreeId, courseId, chapterId, lessonId);
    if (!lesson) {
      throw new Error(`Lesson with id ${lessonId} does not exist`);
    }
    if (lesson.test && lesson.test.test_id === testId) {
      const updatedLessons = lesson.chapter.lessons.map((lessonItem) =>
        lessonItem.lesson_id === lessonId
          ? { ...lessonItem, test: null }
          : lessonItem
      );

      const updatedChapters = lesson.chapter.course.chapters.map((chapter) =>
        chapter.chapter_id === chapterId
          ? { ...chapter, lessons: updatedLessons }
          : chapter
      );

      const updatedCourses = lesson.chapter.course.degree.courses.map((course) =>
        course.course_id === courseId
          ? { ...course, chapters: updatedChapters }
          : course
      );

      await updateDoc(doc(db, 'degrees', degreeId), { courses: updatedCourses });
      console.log('Test deleted successfully!');
      return true;
    } else {
      throw new Error(`Test with id ${testId} does not exist in this lesson`);
    }
  } catch (error) {
    console.error('Error deleting test:', error);
    return false;
  }
};


// // Edit Degree
// export const editDegree = async (degreeId, updatedDegreeData) => {
//   try {
//     const degree = await getDegreeById(degreeId);
//     if (!degree) {
//       throw new Error(`Degree with id ${degreeId} does not exist`);
//     }

//     const updatedData = {
//       ...updatedDegreeData,
//       updatedAt: Date.now(),
//     };

//     await updateDoc(doc(db, 'degrees', degreeId), updatedData);
//     console.log('Degree updated successfully!');
//     return true;
//   } catch (error) {
//     console.error('Error updating degree:', error);
//     return false;
//   }
// };

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
// Edit Course
export const editCourse = async (degreeId, courseId, updatedCourseData) => {
  try {
    const degree = await getDegreeById(degreeId);
    if (!degree) {
      throw new Error(`Degree with id ${degreeId} does not exist`);
    }

    const updatedCourses = degree.courses.map((course) =>
      course.course_id === courseId
        ? { ...course, ...updatedCourseData, updatedAt: Date.now() }
        : course
    );

    await updateDoc(doc(db, 'degrees', degreeId), { courses: updatedCourses });
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
    const degree = await getDegreeById(degreeId);
    if (!degree) {
      throw new Error(`Degree with id ${degreeId} does not exist`);
    }

    const updatedCourses = degree.courses.filter((course) => course.course_id !== courseId);

    await updateDoc(doc(db, 'degrees', degreeId), { courses: updatedCourses });
    console.log('Course deleted successfully!');
    return true;
  } catch (error) {
    console.error('Error deleting course:', error);
    return false;
  }
};
// Edit Chapter
export const editChapter = async (degreeId, courseId, chapterId, updatedChapterData) => {
  try {
    const course = await getCourseById(degreeId, courseId);
    if (!course) {
      throw new Error(`Course with id ${courseId} does not exist`);
    }

    const updatedChapters = course.chapters.map((chapter) =>
      chapter.chapter_id === chapterId
        ? { ...chapter, ...updatedChapterData, updatedAt: Date.now() }
        : chapter
    );

    await editCourse(degreeId, courseId, { chapters: updatedChapters });
    console.log('Chapter updated successfully!');
    return true;
  } catch (error) {
    console.error('Error updating chapter:', error);
    return false;
  }
};

// Delete Chapter
export const deleteChapter = async (degreeId, courseId, chapterId) => {
  try {
    const course = await getCourseById(degreeId, courseId);
    if (!course) {
      throw new Error(`Course with id ${courseId} does not exist`);
    }

    const updatedChapters = course.chapters.filter((chapter) => chapter.chapter_id !== chapterId);

    await editCourse(degreeId, courseId, { chapters: updatedChapters });
    console.log('Chapter deleted successfully!');
    return true;
  } catch (error) {
    console.error('Error deleting chapter:', error);
    return false;
  }
};
// Edit Lesson
export const editLesson = async (degreeId, courseId, chapterId, lessonId, updatedLessonData, newFile = null) => {
  try {
    const chapter = await getChapterById(degreeId, courseId, chapterId);
    if (!chapter) {
      throw new Error(`Chapter with id ${chapterId} does not exist`);
    }

    let newFileMetadata = null;
    if (newFile) {
      const fileType = newFile.type.split('/')[0];
      const fileUrl = await uploadFile(newFile, fileType);

      newFileMetadata = {
        url: fileUrl,
        type: fileType,
        name: newFile.name,
        duration: fileType === 'video' || fileType === 'audio' ? await getMediaDuration(newFile) : null,
      };
    }

    const updatedLessons = chapter.lessons.map((lesson) =>
      lesson.lesson_id === lessonId
        ? { ...lesson, ...updatedLessonData, file: newFileMetadata || lesson.file, updatedAt: Date.now() }
        : lesson
    );

    await editChapter(degreeId, courseId, chapterId, { lessons: updatedLessons });
    console.log('Lesson updated successfully!');
    return true;
  } catch (error) {
    console.error('Error updating lesson:', error);
    return false;
  }
};

// Delete Lesson
export const deleteLesson = async (degreeId, courseId, chapterId, lessonId) => {
  try {
    const chapter = await getChapterById(degreeId, courseId, chapterId);
    if (!chapter) {
      throw new Error(`Chapter with id ${chapterId} does not exist`);
    }

    const updatedLessons = chapter.lessons.filter((lesson) => {
      if (lesson.lesson_id === lessonId) {
        if (lesson.file?.url) {
          deleteFile(lesson.file.url); 
        }
        return false;
      }
      return true;
    });

    await editChapter(degreeId, courseId, chapterId, { lessons: updatedLessons });
    console.log('Lesson deleted successfully!');
    return true;
  } catch (error) {
    console.error('Error deleting lesson:', error);
    return false;
  }
};

// // Get all degrees
// export const getAllDegrees = async () => {
//   try {
//     const degreesCollectionRef = collection(db, 'degrees');
//     const degreesSnapshot = await getDocs(degreesCollectionRef);
//     const degreesList = degreesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//     return degreesList;
//   } catch (error) {
//     console.error('Error getting all degrees:', error);
//     return [];
//   }
// };

// Get a course by ID
export const getCourseById = async (degreeId, courseId) => {
  try {
    const degreeDoc = await getDegreeById(degreeId);
    if (!degreeDoc) return null;

    const degreeData = degreeDoc.data();
    const course = degreeData.courses.find((course) => course.course_id === courseId);

    if (!course) {
      throw new Error(`No course found with id: ${courseId}`);
    }

    return course; 
  } catch (error) {
    console.error('Error fetching course by id:', error);
    return null;
  }
};

// Get a chapter by ID
export const getChapterById = async (degreeId, courseId, chapterId) => {
  try {
    const course = await getCourseById(degreeId, courseId); 
    if (!course) return null;

    const chapter = course.chapters.find((chapter) => chapter.chapter_id === chapterId);

    if (!chapter) {
      throw new Error(`No chapter found with id: ${chapterId}`);
    }

    return chapter; 
  } catch (error) {
    console.error('Error fetching chapter by id:', error);
    return null;
  }
};

// Get a lesson by ID
export const getLessonById = async (degreeId, courseId, chapterId, lessonId) => {
  try {
    const chapter = await getChapterById(degreeId, courseId, chapterId);
    if (!chapter) return null;

    const lesson = chapter.lessons.find((lesson) => lesson.lesson_id === lessonId);

    if (!lesson) {
      throw new Error(`No lesson found with id: ${lessonId}`);
    }

    return lesson;
  } catch (error) {
    console.error('Error fetching lesson by id:', error);
    return null;
  }
};






