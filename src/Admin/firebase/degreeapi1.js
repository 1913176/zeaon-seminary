import { db, storage } from './firebase';
import { collection, addDoc, getDocs, updateDoc, setDoc, doc, deleteDoc, query, where, getDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { getMediaDuration } from './mediaUtils';

const DEGREES_COLLECTION = 'degrees';
const SUPPORTED_FILE_FOLDERS = {
    video: 'videos',
    audio: 'audios',
    image: 'images',
    document: 'documents',
    pdf: 'documents',
    ppt: 'presentations',
};

const checkRequiredFields = (degreeData) => {
    if (!degreeData.name) {
        throw new Error('Degree title is required');
    }

    const hasValidCourses = degreeData.courses.every((course) => {
        if (!course.title) {
            throw new Error('Course title is required');
        }

        const hasValidChapters = course.chapters.every((chapter) => {
            if (!chapter.title) {
                throw new Error('Chapter title is required');
            }

            const hasValidLessons = chapter.lessons.every((lesson) => {
                if (!lesson.title) {
                    throw new Error('Lesson title is required');
                }
                return true;
            });

            return hasValidLessons;
        });

        return hasValidChapters;
    });

    return hasValidCourses;
};

export const uploadFile = async (file) => {
    try {
        const fileType = file.type.split('/')[0];
        const folder = SUPPORTED_FILE_FOLDERS[fileType];
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
        };
    } catch (error) {
        console.error('Error uploading file:', error.message);
        throw new Error('File upload failed');
    }
};

export const uploadThumbnail = async (file) => {
    try {
        const fileRef = ref(storage, `thumbnails/${uuidv4()}_${file.name}`);
        await uploadBytes(fileRef, file);
        return await getDownloadURL(fileRef);
    } catch (error) {
        console.error('Error uploading thumbnail:', error.message);
        throw new Error('Thumbnail upload failed');
    }
};

const createTestObject = (testData) => {
    const questions = testData.questions.map((question) => {
        const questionData = {
            question: question.question || null,
            answerType: question.type || null,
        };

        if (question.type === 'MCQ') {
            questionData.options = question.options || [];
            questionData.correctAnswer = question.correctAnswer || null;
            questionData.marks = question.marks || 1;
        } else if (question.type === 'Typed') {
            questionData.answer = question.answer || '';
            questionData.marks = question.marks || 0;
        }

        return questionData;
    });

    return {
        testId: uuidv4(),
        title: testData.title || null,
        timeLimit: testData.timeLimit || null,
        type: testData.type || null,
        questions,
        totalMarks: questions.reduce((total, q) => total + (q.marks || 0), 0),
    };
};

export const addDegree = async (degreeData) => {
    try {
        checkRequiredFields(degreeData);

        const { name, description, thumbnail, overviewPoints, courses } = degreeData;
        const degreeThumbnailUrl = thumbnail ? await uploadThumbnail(thumbnail) : null;

        const formattedCourses = await Promise.all(
            courses.map(async (course) => {
                const courseThumbnailUrl = course.thumbnail ? await uploadThumbnail(course.thumbnail) : null;

                const formattedChapters = await Promise.all(
                    course.chapters.map(async (chapter) => {
                        const formattedLessons = await Promise.all(
                            chapter.lessons.map(async (lesson) => {
                                const lessonFileMetadata = await uploadFile(lesson.file);
                                return {
                                    lessonId: uuidv4(),
                                    lessonTitle: lesson.title,
                                    file: lessonFileMetadata,
                                };
                            })
                        );

                        const test = chapter.test ? createTestObject(chapter.test) : null;

                        return {
                            chapterId: uuidv4(),
                            chapterTitle: chapter.title,
                            description: chapter.description || null,  // Default to null if not provided
                            test: chapter.test ? createTestObject(chapter.test) : null,
                            lessons: formattedLessons,
                        };
                    })
                );

                return {
                    courseId: uuidv4(),
                    courseTitle: course.title,
                    description: course.description || null, 
                    thumbnail: courseThumbnailUrl || null,
                    price: course.price || null,  
                    chapters: formattedChapters,
                    finalTest: course.finalTest ? createTestObject(course.finalTest) : null,
                    overviewPoints: course.overviewPoints ? course.overviewPoints.map((point) => ({
                        title: point.title || null,
                        description: point.description || null,
                    })) : [],
                };
            })
        );

        const degree = {
            degreeId: uuidv4(),
            degreeTitle: name,
            description: description || null,  
            thumbnail: degreeThumbnailUrl || null,
            overviewPoints: overviewPoints ? overviewPoints.map((point) => ({
                title: point.title || null,
                description: point.description || null,
            })) : [],
            courses: formattedCourses,
            createdAt: Date.now(),
        };

        await addDoc(collection(db, DEGREES_COLLECTION), degree);
        console.log('Degree added successfully!');
        return degree.degreeId;
    } catch (error) {
        console.error('Error adding degree:', error.message);
        throw new Error(error.message);
    }
};

export const getAllDegrees = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, DEGREES_COLLECTION));
        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
    } catch (error) {
        console.error('Error getting degrees:', error.message);
        throw new Error('Failed to fetch degrees');
    }
};

export const getDegreeById = async (degreeId) => {
    try {
        const docRef = doc(db, DEGREES_COLLECTION, degreeId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) throw new Error(`No degree found with ID: ${degreeId}`);
        return docSnap.data();
    } catch (error) {
        console.error('Error fetching degree by ID:', error.message);
        return null;
    }
};

export const editDegree = async (degreeId, updatedDegreeData) => {
    try {
        checkRequiredFields(updatedDegreeData);

        const degreeDocRef = doc(db, DEGREES_COLLECTION, degreeId);
        const { name, description, thumbnail, overviewPoints, courses } = updatedDegreeData;
        const degreeThumbnailUrl = thumbnail ? await uploadThumbnail(thumbnail) : null;

        const formattedCourses = await Promise.all(
            courses.map(async (course) => {
                const courseThumbnailUrl = course.thumbnail ? await uploadThumbnail(course.thumbnail) : null;

                const formattedChapters = await Promise.all(
                    course.chapters.map(async (chapter) => {
                        const formattedLessons = await Promise.all(
                            chapter.lessons.map(async (lesson) => {
                                const lessonFileMetadata = await uploadFile(lesson.file);
                                return {
                                    lessonId: uuidv4(),
                                    lessonTitle: lesson.title,
                                    file: lessonFileMetadata,
                                };
                            })
                        );

                        const test = chapter.test ? createTestObject(chapter.test) : null;

                        return {
                            chapterId: uuidv4(),
                            chapterTitle: chapter.title,
                            description: chapter.description || null,  
                            test: chapter.test ? createTestObject(chapter.test) : null,
                            lessons: formattedLessons,
                        };
                    })
                );

                return {
                    courseId: uuidv4(),
                    courseTitle: course.title,
                    description: course.description || null, 
                    thumbnail: courseThumbnailUrl || null,
                    price: course.price || null,  
                    chapters: formattedChapters,
                    finalTest: course.finalTest ? createTestObject(course.finalTest) : null,
                    overviewPoints: course.overviewPoints ? course.overviewPoints.map((point) => ({
                        title: point.title || null,
                        description: point.description || null,
                    })) : [],
                };
            })
        );

        const updatedDegree = {
            degreeTitle: name,
            description: description || null,  
            thumbnail: degreeThumbnailUrl || null,
            overviewPoints: overviewPoints ? overviewPoints.map((point) => ({
                title: point.title || null,
                description: point.description || null,
            })) : [],
            courses: formattedCourses,
            updatedAt: Date.now(),
        };

        await updateDoc(degreeDocRef, updatedDegree);
        console.log('Degree updated successfully!');
        return updatedDegree;
    } catch (error) {
        console.error('Error updating degree:', error.message);
        throw new Error('Degree update failed');
    }
};

export const deleteDegree = async (degreeId) => {
    try {
        const degreeDocRef = doc(db, DEGREES_COLLECTION, degreeId);
        await deleteDoc(degreeDocRef);
        console.log('Degree deleted successfully!');
    } catch (error) {
        console.error('Error deleting degree:', error.message);
        throw new Error('Degree deletion failed');
    }
};

export const getDegreeByCourseId = async (courseId) => {
    try {
        const q = query(collection(db, DEGREES_COLLECTION));
        const querySnapshot = await getDocs(q);
        const degrees = querySnapshot.docs
            .map((doc) => doc.data())
            .filter((degree) =>
                degree.courses.some((course) => course.courseId === courseId)
            );

        if (degrees.length === 0) {
            throw new Error(`No degree found for course ID: ${courseId}`);
        }
        return degrees;
    } catch (error) {
        console.error('Error getting degree by course ID:', error.message);
        throw new Error('Failed to fetch degree by course ID');
    }
};


export const getCourseById = async (courseId) => {
    try {
      const degreesSnapshot = await getDocs(collection(db, "degrees"));
  
      if (degreesSnapshot.empty) {
        throw new Error("No degrees found in the database");
      }
  
      for (const degreeDoc of degreesSnapshot.docs) {
        const degreeData = degreeDoc.data();
        console.log("Inspecting degree:", degreeData.degreeId);
  
        const course = degreeData.courses.find((c) => c.courseId === courseId);
  
        if (course) {
          console.log("Course found:", course);
          return {
            degreeId: degreeDoc.id,
            ...course, 
          };
        }
      }
      throw new Error(`Course with ID ${courseId} not found`);
    } catch (error) {
      console.error("Error fetching course by ID:", error.message);
      throw new Error("Failed to fetch course by ID");
    }
  };

  