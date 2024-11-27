import { db } from './firebase'; 
import { collection, addDoc, updateDoc, deleteDoc, doc, getDoc, getDocs, query, where } from 'firebase/firestore';



export const addNewTest = async (testData) => {
  try {
    const testRef = await addDoc(collection(db, "tests"), {
      title: testData.title,
      timeLimit: testData.timeLimit,
      questions: testData.questions,
    });
    return testRef.id; 
  } catch (error) {
    console.error("Error adding new test: ", error);
    throw error;
  }
};

export const updateTest = async (testId, updatedTestData) => {
  try {
    const testDocRef = doc(db, "tests", testId);
    await updateDoc(testDocRef, {
      title: updatedTestData.title,
      timeLimit: updatedTestData.timeLimit,
      questions: updatedTestData.questions,
    });
  } catch (error) {
    console.error("Error updating test: ", error);
    throw error;
  }
};


export const addQuestionToTest = async (testId, questionData) => {
    try {
      const testDocRef = doc(db, "tests", testId);
      const testDoc = await getDoc(testDocRef);
  
      if (testDoc.exists()) {
        const currentQuestions = testDoc.data().questions || [];
  
        const formattedQuestion = {
          question: questionData.question,
          questionType: questionData.questionType, 
          correctAnswer: questionData.correctAnswer || null,
          options: questionData.options || [], 
        };
  
        
        await updateDoc(testDocRef, {
          questions: [...currentQuestions, formattedQuestion],
        });
      } else {
        console.error("Test document not found!");
      }
    } catch (error) {
      console.error("Error adding question to test: ", error);
      throw error;
    }
  };

  export const deleteTest = async (testId) => {
    try {
      const testDocRef = doc(db, "tests", testId);
      await deleteDoc(testDocRef);
      console.log(`Test with ID ${testId} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting test: ", error);
      throw error;
    }
  };
  
  
  export const getTestById = async (testId) => {
    try {
      const testDocRef = doc(db, "tests", testId);
      const testDoc = await getDoc(testDocRef);
  
      if (testDoc.exists()) {
        return testDoc.data(); 
      } else {
        console.error("No such test document!");
        return null;
      }
    } catch (error) {
      console.error("Error fetching test by ID: ", error);
      throw error;
    }
  };
  

  export const getAllTests = async () => {
    try {
      const testCollectionRef = collection(db, "tests");
      const testSnapshot = await getDocs(testCollectionRef);
      const tests = testSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      return tests; 
    } catch (error) {
      console.error("Error fetching all tests: ", error);
      throw error;
    }
  };

  //  using query to fetch
  
  export const getTestsByTitle = async (title) => {
    try {
      const testCollectionRef = collection(db, "tests");
      const q = query(testCollectionRef, where("title", "==", title));
      const querySnapshot = await getDocs(q);
  
      const tests = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      return tests; 
    } catch (error) {
      console.error("Error fetching tests by title: ", error);
      throw error;
    }
  };
