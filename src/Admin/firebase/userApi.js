
import { collection, addDoc, getDocs, updateDoc,setDoc, doc, deleteDoc, query, where, getDoc, arrayUnion } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from './firebase';
import bcrypt from 'bcryptjs';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    GoogleAuthProvider,
    signInWithPopup,
} from 'firebase/auth';
import { getDegreeByCourseId } from './degreeapi1';


const auth = getAuth();


export const signupUser = async (data, isGoogleSignup = false) => {
    try {
        const auth = getAuth();
        const usersRef = collection(db, 'users');

        let user;
        let firstName, lastName, email, username, password, profilePicture;

        if (isGoogleSignup) {
            
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            user = result.user;

            firstName = user.displayName?.split(' ')[0] || '';
            lastName = user.displayName?.split(' ')[1] || '';
            email = user.email;
            username = user.email.split('@')[0];
            profilePicture = user.photoURL || '';
            password = null; 
        } else {
            
            const usernameQuery = query(usersRef, where('username', '==', data.username));
            const usernameSnapshot = await getDocs(usernameQuery);

            const emailQuery = query(usersRef, where('email', '==', data.email));
            const emailSnapshot = await getDocs(emailQuery);

            if (!usernameSnapshot.empty) {
                return { success: false, message: 'Username already exists!' };
            }

            if (!emailSnapshot.empty) {
                return { success: false, message: 'Email already exists!' };
            }
            const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
            user = userCredential.user;

            
            firstName = data.firstName;
            lastName = data.lastName;
            email = data.email;
            username = data.username;
            profilePicture = ''; 
            password = await bcrypt.hash(data.password, 8); 
        }

        
        if (isGoogleSignup) {
            const userQuery = query(usersRef, where('email', '==', email));
            const userSnapshot = await getDocs(userQuery);

            if (!userSnapshot.empty) {
                return { success: true, message: 'User already exists!' }; 
            }
        }
        const userDoc = {
            firstName,
            lastName,
            email,
            username,
            password, 
            profilePicture,
            profileBanner: '', 
            mobileNo: '',
            maritalStatus: '',
            dob: '',
            gender: '',
            applyingFor: '',
            educationalQualification: '',
            theologicalQualification: '',
            presentAddress: '',
            ministryExperience: '',
            salvationExperience: '',
            signatureFile: '',
            passportPhotoFile: '',
            educationCertFile: '',
            purchasedCourse: [],
            role: 'client',
            joinedDate: new Date().toISOString(),
        };

        await setDoc(doc(usersRef, user.uid), userDoc);

        return { success: true, message: isGoogleSignup ? 'Google signup successful!' : 'Manual signup successful!' };
    } catch (error) {
        console.error('Error during signup:', error);
        return { success: false, message: 'Signup failed. Please try again.' };
    }
};


export const loginUser = async (data, isGoogleLogin = false) => {
    try {
        const auth = getAuth();
        const usersRef = collection(db, 'users');
        let userDoc;

        if (isGoogleLogin) {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const googleUser = result.user;

            const userQuery = query(usersRef, where('email', '==', googleUser.email));
            const userSnapshot = await getDocs(userQuery);

            if (userSnapshot.empty) {
                return { success: false, message: 'User not found. Please sign up first.' };
            }

            userDoc = userSnapshot.docs[0].data();

            return {
                success: true,
                message: 'Google login successful!',
                user: userDoc,
            };
        } else {
            const { emailOrUsername, password } = data;

            const loginQuery = emailOrUsername.includes('@')
                ? query(usersRef, where('email', '==', emailOrUsername))
                : query(usersRef, where('username', '==', emailOrUsername));

            const loginSnapshot = await getDocs(loginQuery);

            if (loginSnapshot.empty) {
                return { success: false, message: 'Invalid username or email.' };
            }

            userDoc = loginSnapshot.docs[0].data();

            const isPasswordValid = await bcrypt.compare(password, userDoc.password);
            if (!isPasswordValid) {
                return { success: false, message: 'Incorrect password.' };
            }

            await signInWithEmailAndPassword(auth, userDoc.email, password);

            return {
                success: true,
                message: 'Login successful!',
                user: userDoc,
            };
        }
    } catch (error) {
        console.error('Error during login:', error);
        return { success: false, message: 'Login failed. Please try again.' };
    }
};



export const forgotPassword = async (email) => {
    try {
        const auth = getAuth();
        await sendPasswordResetEmail(auth, email);
        
        return { success: true, message: 'Password reset email sent successfully. Please check your inbox.' };
    } catch (error) {
        console.error('Error sending password reset email:', error);
        return { success: false, message: 'Failed to send password reset email. Please try again.' };
    }
};


const uploadFile = async (file, folderName) => {
    const storageRef = ref(storage, `${folderName}/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
};

export const editUser = async (userId, updatedData, files) => {
    try {
        const userDocRef = doc(db, 'users', userId);

        const updatedFields = {
            firstName: updatedData.firstName || '',
            lastName: updatedData.lastName || '',
            email: updatedData.email || '',
            mobileNo: updatedData.mobileNo || '',
            maritalStatus: updatedData.maritalStatus || '',
            dob: updatedData.dob || '',
            gender: updatedData.gender || '',
            applyingFor: updatedData.applyingFor || '',
            educationalQualification: updatedData.educationalQualification || '',
            theologicalQualification: updatedData.theologicalQualification || '',
            presentAddress: updatedData.presentAddress || '',
            ministryExperience: updatedData.ministryExperience || '',
            salvationExperience: updatedData.salvationExperience || '',
        };

        if (files.profilePicture) {
            const profilePictureUrl = await uploadFile(files.profilePicture, 'profilePictures');
            updatedFields.profilePicture = profilePictureUrl;
        }

        if (files.profileBanner) {
            const profileBannerUrl = await uploadFile(files.profileBanner, 'profileBanners');
            updatedFields.profileBanner = profileBannerUrl;
        }

        if (files.signatureFile) {
            const signatureFileUrl = await uploadFile(files.signatureFile, 'signatures');
            updatedFields.signatureFile = signatureFileUrl;
        }

        if (files.passportPhotoFile) {
            const passportPhotoFileUrl = await uploadFile(files.passportPhotoFile, 'passportPhotos');
            updatedFields.passportPhotoFile = passportPhotoFileUrl;
        }

        if (files.educationCertFile) {
            const educationCertFileUrl = await uploadFile(files.educationCertFile, 'educationCerts');
            updatedFields.educationCertFile = educationCertFileUrl;
        }

        await updateDoc(userDocRef, updatedFields);

        return { success: true, message: 'User profile updated successfully!' };
    } catch (error) {
        console.error('Error updating user profile:', error);
        return { success: false, message: 'Failed to update profile. Please try again.' };
    }
};

export const getAllUsers = async () => {
    try {
        const usersRef = collection(db, 'users'); 
        const usersSnapshot = await getDocs(usersRef);  
        const usersList = usersSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(), 
        }));

        return { success: true, users: usersList };
    } catch (error) {
        console.error('Error getting all users:', error);
        return { success: false, message: 'Failed to get users. Please try again.' };
    }
};

export const getUserById = async (userId) => {
    try {
        const userDocRef = doc(db, 'users', userId); 
        const userDoc = await getDoc(userDocRef);  

        if (userDoc.exists()) {
            return { success: true, user: userDoc.data() };  
        } else {
            return { success: false, message: 'User not found.' };
        }
    } catch (error) {
        console.error('Error getting user by ID:', error);
        return { success: false, message: 'Failed to get user. Please try again.' };
    }
};

export const deleteUser = async (userId) => {
    try {
        const userDocRef = doc(db, 'users', userId);
        await deleteDoc(userDocRef);  
        return { success: true, message: 'User deleted successfully.' };
    } catch (error) {
        console.error('Error deleting user:', error);
        return { success: false, message: 'Failed to delete user. Please try again.' };
    }
};




export const addCourseToUser = async (userId, courseId, courseTitle) => {
    try {
        const { degreeId, degreeTitle } = await getDegreeByCourseId(courseId);

        const purchasedCourse = {
            courseId,
            courseTitle,
            degreeId,
            degreeTitle,
            progress: 0,
            chapters: [], 
        };

        const userDocRef = doc(db, 'users', userId);
        await updateDoc(userDocRef, {
            purchasedCourses: arrayUnion(purchasedCourse),
        });

        console.log('Course added to purchased courses successfully!');
    } catch (error) {
        console.error('Error adding course to user:', error);
        throw new Error('Failed to add course to user');
    }
};

export const markUserAnswers = async (userId, courseId, testType, answers, marks, totalMarks) => {
    try {
        const userDocRef = doc(db, 'users', userId);

        const userSnap = await getDoc(userDocRef);
        const purchasedCourses = userSnap.data().purchasedCourses;

        const updatedCourses = purchasedCourses.map(course => {
            if (course.courseId === courseId) {
                if (testType === 'finalTest') {
                    course.finalTestMarks = marks;
                    course.progress = (marks / totalMarks) * 100;
                } else {
                    
                    course.chapters.forEach(chapter => {
                        chapter.lessons.forEach(lesson => {
                            if (lesson.test?.testId === testType) {
                                lesson.test.userMarks = marks;
                                lesson.test.progress = (marks / totalMarks) * 100; 
                            }
                        });
                    });
                }
            }
            return course;
        });

        await updateDoc(userDocRef, {
            purchasedCourses: updatedCourses,
        });

        console.log('User answers and progress updated successfully!');
    } catch (error) {
        console.error('Error marking user answers:', error);
        throw new Error('Failed to mark user answers');
    }
};


export const getUsersByRole = async (role) => {
    try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('role', '==', role));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error fetching users by role:', error);
        return [];
    }
};


export const validateAndUpdateMarks = async (userId, courseId, testId, validatedAnswers) => {
    try {
        const userDocRef = doc(db, 'users', userId);

        const userSnap = await getDoc(userDocRef);
        if (!userSnap.exists()) {
            throw new Error('User not found');
        }

        const userData = userSnap.data();
        const updatedCourses = userData.purchasedCourses.map(course => {
            if (course.courseId === courseId) {
                course.chapters.forEach(chapter => {
                    chapter.lessons.forEach(lesson => {
                        if (lesson.test?.testId === testId) {
                            lesson.test.questions.forEach((question, index) => {
                                const validatedAnswer = validatedAnswers[index];
                                
                                if (validatedAnswer) {
                                    
                                    question.marks = validatedAnswer.marks;
                                    question.validated = true; 
                                }
                            });

                            const totalMarks = lesson.test.questions.reduce((sum, question) => sum + question.marks, 0);
                            lesson.test.totalMarks = totalMarks;
                        }
                    });
                });
            }
            return course;
        });
        await updateDoc(userDocRef, {
            purchasedCourses: updatedCourses
        });

        console.log('Test marks updated successfully');
        return 'Test marks updated successfully';
    } catch (error) {
        console.error('Error updating test marks:', error);
        throw new Error('Failed to update test marks');
    }
};

export const getEnrolledCourses = async (userId) => {
    try {
        const userDocRef = doc(db, 'users', userId);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
            throw new Error(`No user found with ID: ${userId}`);
        }

        const userData = userDocSnap.data();
        const enrolledCourses = userData.purchasedCourses || [];

        return enrolledCourses;
    } catch (error) {
        console.error('Error fetching enrolled courses:', error);
        throw new Error('Failed to fetch enrolled courses');
    }
};



// import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc , query, where} from 'firebase/firestore';
// import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
// import { db, storage } from './firebase'; 
// import bcrypt from 'bcryptjs';

// export const addUser = async (data) => {
//     try {
//         // Check if username or email already exists
//         const usersRef = collection(db, 'users');
//         const q = query(usersRef, where('username', '==', data.username));
//         const usernameSnapshot = await getDocs(q);

//         const qEmail = query(usersRef, where('email', '==', data.email));
//         const emailSnapshot = await getDocs(qEmail);

//         if (!usernameSnapshot.empty) {
//             console.error('Username already exists!');
//             return { success: false, message: 'Username already exists!' };
//         }

//         if (!emailSnapshot.empty) {
//             console.error('Email already exists!');
//             return { success: false, message: 'Email already exists!' };
//         }

//         // Hash the password
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(data.password, salt);

       
//         const signatureFile = data.signature[0];
//         const signatureRef = ref(storage, `signatures/${signatureFile.name}`);
//         await uploadBytes(signatureRef, signatureFile);
//         const signatureURL = await getDownloadURL(signatureRef);

        
//         const passportPhotoFile = data.passportSizePhoto[0];
//         const passportPhotoRef = ref(storage, `photos/${passportPhotoFile.name}`);
//         await uploadBytes(passportPhotoRef, passportPhotoFile);
//         const passportPhotoURL = await getDownloadURL(passportPhotoRef);

       
//         const educationCertFile = data.educationCertificate[0];
//         const educationCertRef = ref(storage, `certificates/${educationCertFile.name}`);
//         await uploadBytes(educationCertRef, educationCertFile);
//         const educationCertURL = await getDownloadURL(educationCertRef);

//         // Add user data to Firestore
//         await addDoc(usersRef, {
//             firstName: data.firstName,
//             lastName: data.lastName,
//             mobileNo: data.mobileNo,
//             email: data.email,
//             maritalStatus: data.maritalStatus,
//             dob: data.dob,
//             gender: data.gender,
//             applyingFor: data.applyingFor,
//             educationalQualification: data.educationalQualification,
//             theologicalQualification: data.theologicalQualification,
//             presentAddress: data.presentAddress,
//             ministryExperience: data.ministryExperience,
//             salvationExperience: data.salvationExperience,
//             signatureURL: signatureURL,
//             passportPhotoURL: passportPhotoURL,
//             educationCertURL: educationCertURL,
//             username: data.username,
//             password: hashedPassword,
//             purchasedDegrees: [],
//             role: data.role || 'client',
//             joinedDate: Date.now()
//         });

//         console.log('Data successfully saved to Firestore and files uploaded to Storage!');
//         return { success: true, message: 'User created successfully!' };

//     } catch (error) {
//         console.error('Error saving data or uploading files:', error);
//         return { success: false, message: 'Error saving data or uploading files' };
//     }
// };

// export const getAllUsers = async () => {
//     try {
//         const data = await getDocs(collection(db, 'users'));
//         const users = data?.docs?.map((doc) => { return { id: doc.id, ...doc.data() } });
//         return users;
//     } catch (error) {
//         console.log(error);
//     }
// };

// export const getUserById = async (id) => {
//     try {
//         if (!id) {
//             throw new Error('Invalid document ID');
//         }

//         const userDoc = doc(db, 'users', id);
//         const userSnapshot = await getDoc(userDoc);

//         if (userSnapshot.exists()) {
//             return { id: userSnapshot.id, ...userSnapshot.data() };
//         } else {
//             console.error('No such user exists!');
//             return null;
//         }
//     } catch (error) {
//         console.error('Error fetching user by ID:', error);
//         return null;
//     }
// };


// export const getUsersByPurchasedDegree = async (degreeId) => {
//     try {
//         if (!degreeId) {
//             throw new Error('Degree ID is required');
//         }
//         const usersRef = collection(db, 'users');
//         const q = query(usersRef, where('purchasedDegrees', 'array-contains', { degreeId }));
//         const querySnapshot = await getDocs(q);

//         const users = querySnapshot.docs.map(doc => ({
//             id: doc.id,
//             ...doc.data()
//         }));

//         console.log(`${users.length} users found with the purchased degree: ${degreeId}`);
//         return users;
//     } catch (error) {
//         console.error('Error fetching users by purchased degree:', error);
//         return [];
//     }
// };

// export const getUsersByRole = async (role) => {
//     try {
//         const usersRef = collection(db, 'users');
//         const q = query(usersRef, where('role', '==', role));
//         const querySnapshot = await getDocs(q);

//         const users = querySnapshot.docs.map(doc => ({
//             id: doc.id,
//             ...doc.data()
//         }));

//         console.log(`${users.length} users found with the role: ${role}`);
//         return users;
//     } catch (error) {
//         console.error('Error fetching users by role:', error);
//         return [];
//     }
// };



// export const editUser = async (id, data) => {
//     try {
//         let educationCertURL = data?.educationCertURL || '';
//         let signatureURL = data?.signatureURL || '';
//         let passportPhotoURL = data?.passportPhotoURL || '';

//         const signatureFile = data?.signature[0];
//         if (signatureFile) {
//             const signatureRef = ref(storage, `signatures/${signatureFile?.name}`);
//             await uploadBytes(signatureRef, signatureFile);
//             signatureURL = await getDownloadURL(signatureRef);
//         }

//         const passportPhotoFile = data.passportSizePhoto[0];
//         if (passportPhotoFile) {
//             const passportPhotoRef = ref(storage, `photos/${passportPhotoFile.name}`);
//             await uploadBytes(passportPhotoRef, passportPhotoFile);
//             passportPhotoURL = await getDownloadURL(passportPhotoRef);
//         }

//         const educationCertFile = data.educationCertificate[0];
//         if (educationCertFile) {
//             const educationCertRef = ref(storage, `certificates/${educationCertFile.name}`);
//             await uploadBytes(educationCertRef, educationCertFile);
//             educationCertURL = await getDownloadURL(educationCertRef);
//         }

//         const hashedPassword = data.password ? await bcrypt.hash(data.password, 10) : data.passwordHash;

//         await updateDoc(doc(db, 'users', id), {
//             firstName: data.firstName,
//             lastName: data.lastName,
//             mobileNo: data.mobileNo,
//             email: data.email,
//             maritalStatus: data.maritalStatus,
//             dob: data.dob,
//             gender: data.gender,
//             applyingFor: data.applyingFor,
//             educationalQualification: data.educationalQualification,
//             theologicalQualification: data.theologicalQualification,
//             presentAddress: data.presentAddress,
//             ministryExperience: data.ministryExperience,
//             salvationExperience: data.salvationExperience,
//             signatureURL: signatureURL,
//             passportPhotoURL: passportPhotoURL,
//             educationCertURL: educationCertURL,
//             username: data.username,
//             password: hashedPassword,
//             role: data.role || 'client' 
//         });

//         console.log('Data successfully updated in Firestore and files uploaded to Storage!');
//         return true;
//     } catch (error) {
//         console.error('Error updating data or uploading files:', error);
//     }
// };

// export const deleteUser = async (id) => {
//     try {
//         if (!id) {
//             throw new Error('Invalid document ID');
//         }
//         await deleteDoc(doc(db, 'users', id));
//         return true;
//     } catch (error) {
//         console.log('Error deleting user:', error);
//     }
// };

// export const addDegreeToUser = async (userId, degree) => {
//     try {
//         const userRef = doc(db, 'users', userId);
//         const userSnapshot = await getDoc(userRef);

//         if (!userSnapshot.exists()) {
//             console.error('No such user found!');
//             return { success: false, message: 'User not found' };
//         }

//         const userData = userSnapshot.data();
//         const purchasedDegrees = userData.purchasedDegrees || [];
//         const existingDegree = purchasedDegrees.find(d => d.degreeId === degree.degreeId);
//         if (existingDegree) {
//             console.log('Degree already purchased by user.');
//             return { success: false, message: 'Degree already purchased' };
//         }
//         const updatedDegrees = [
//             ...purchasedDegrees,
//             {
//                 degreeId: degree.degreeId,
//                 degreeName: degree.degreeName,
//                 progress: degree.progress || 0
//             }
//         ];

//         await updateDoc(userRef, { purchasedDegrees: updatedDegrees });

//         console.log('Degree successfully added to user!');
//         return { success: true, message: 'Degree added to user' };
//     } catch (error) {
//         console.error('Error adding degree to user:', error);
//         return { success: false, message: 'Error adding degree to user' };
//     }
// };
