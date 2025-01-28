import { db } from './firebase';
import { doc, setDoc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';

// Store completed lesson progress
export const markLessonAsCompleted = async (userId, courseId, chapterId, lessonId) => {
    try {

        const userDocRef = doc(db, 'completion', userId);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
            await setDoc(userDocRef, {
                courses: []  
            });
        }

        let courseData = userDocSnap.data().courses.find(course => course.courseId === courseId);

        if (!courseData) {
            courseData = {
                courseId,
                chapters: [],
                lessons: [],
            };
        }

        if (!courseData.lessons.includes(lessonId)) {
            courseData.lessons.push(lessonId);
        }

        if (!courseData.chapters.includes(chapterId)) {
            courseData.chapters.push(chapterId);
        }

        await updateDoc(userDocRef, {
            courses: arrayUnion(courseData), 
        });

        console.log(`User ${userId} completed lesson ${lessonId} in course ${courseId}, chapter ${chapterId}.`);

        return true;
    } catch (error) {
        console.error('Error marking lesson as completed:', error);
        throw new Error('Error marking lesson as completed');
    }
};


export const checkLessonCompletion = async (userId, courseId, lessonId) => {
    try {
        const userDocRef = doc(db, 'completion', userId);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
            return false; 
        }

        const courseData = userDocSnap.data().courses.find(course => course.courseId === courseId);
        if (!courseData || !courseData.lessons.includes(lessonId)) {
            return false; 
        }

        return true;
    } catch (error) {
        console.error('Error checking lesson completion:', error);
        throw new Error('Error checking lesson completion');
    }
};

export const getCompletionDetails = async (userId, courseId) => {
    try {
        
        const userDocRef = doc(db, 'completion', userId);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
            console.log(`No completion data found for user: ${userId}`);
            return null;
        }

        const courses = userDocSnap.data().courses;

        const courseData = courses.find(course => course.courseId === courseId);

        if (!courseData) {
            console.log(`No completion data found for course: ${courseId}`);
            return null; 
        }
        
        return {
            courseId: courseData.courseId,
            chapters: courseData.chapters, 
            lessons: courseData.lessons,    
        };
    } catch (error) {
        console.error('Error getting completion details:', error);
        throw new Error('Error getting completion details');
    }
};


export const markChapterAsCompleted = async (userId, courseId, chapterId) => {
    try {
        const userDocRef = doc(db, 'completion', userId);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
            await setDoc(userDocRef, {
                courses: []  
            });
        }

        let courseData = userDocSnap.data().courses.find(course => course.courseId === courseId);

        if (!courseData) {
            courseData = {
                courseId,
                chapters: [],
                lessons: [],
            };
        }

        const allLessonsCompleted = courseData.lessons.some(lessonId => lessonId.startsWith(`${chapterId}_`)); 

        if (allLessonsCompleted) {
            if (!courseData.chapters.includes(chapterId)) {
                courseData.chapters.push(chapterId);
            }
        }
        await updateDoc(userDocRef, {
            courses: arrayUnion(courseData), 
        });

        console.log(`User ${userId} completed chapter ${chapterId} in course ${courseId}.`);

        return true;
    } catch (error) {
        console.error('Error marking chapter as completed:', error);
        throw new Error('Error marking chapter as completed');
    }
};
