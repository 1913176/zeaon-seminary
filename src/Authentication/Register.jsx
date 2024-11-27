import React, { useEffect, useState } from 'react';
import './Register.css';
import { useForm } from 'react-hook-form';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import { db, storage } from '../Admin/firebase/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { getAllDegrees } from '../Admin/firebase/degreeApi';
import { addUser } from '../Admin/firebase/userApi';
import courseContent from '../Components/Assets/Data/couseContent.json'
 
const options = {
  maritalStatus: [  
    { value: 'single', label: 'Single' },
    { value: 'married', label: 'Married' },
    { value: 'divorced', label: 'Divorced' },
    { value: 'widowed', label: 'Widowed' }
  ],
  gender: [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' }
  ],
};

function Register() {
  const [applyingForOptions, setApplyingForOptions] = useState([]);
  const navigate = useNavigate();
  const { register, handleSubmit, setValue } = useForm();
  const [courseOptions, setCourseOptions] = useState([]);



  // Fetch courses from Firestore 
  useEffect(() => {
    const fetchCourses = async () => {
      const coursesSnapshot = await getAllDegrees();
      const coursesList = coursesSnapshot?.map((doc) => ({
        value: doc.id,
        label: doc.domain,
      }));
      setCourseOptions(coursesList);
    };

    fetchCourses();
  }, []);


  // Submit 
  const onSubmit = async (data) => {
    const res = await addUser(data)
    res && navigate('/login');
  };

  return (
    <div className='register'>
      <form className="my-form" onSubmit={handleSubmit(onSubmit)}>
        <h2 style={{ textAlign: 'center', marginBottom: "60px" }}>Registration form</h2>
        <div className="form-container">
          <div className="leftcolumn">
            <div className="form-group">
              <label>First Name *</label>
              <input type="text" placeholder="Enter First Name" {...register('firstName', { required: true })} />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input type="text" placeholder="Enter Last Name" {...register('lastName')} />
            </div>
            <div className="form-group">
              <label>Mobile No *</label>
              <input type="tel" placeholder="Enter Mobile Number" {...register('mobileNo', { required: true })} />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input type="email" placeholder="Enter email address" {...register('email', { required: true })} />
            </div>
            <div className="form-group">
              <label>Marital Status *</label>
              <Select
                options={options.maritalStatus}
                onChange={(option) => setValue('maritalStatus', option.value)}
              />
            </div>
            <div className="form-group">
              <label>DOB *</label>
              <input type="date" {...register('dob', { required: true })} />
            </div>
            <div className="form-group">
              <label>Gender *</label>
              <Select
                options={options.gender}
                onChange={(option) => setValue('gender', option.value)}
              />
            </div>
            <div className="form-group">
              <label>Applying for *</label>
              <Select
                options={courseOptions}
                onChange={(option) => setValue('applyingFor', option.value)}
              />
            </div>
            <div className="form-group">
              <label>Educational Qualification *</label>
              <input type="text" placeholder="Enter Educational Qualification" {...register('educationalQualification', { required: true })} />
            </div>
          </div>
          <div className="rightcolumn">
            <div className="form-group">
              <label>Theological Qualification *</label>
              <input type="text" placeholder="Enter Theological Qualification" {...register('theologicalQualification', { required: true })} />
            </div>
            <div className="form-group">
              <label>Present Address *</label>
              <input type="text" placeholder="Enter Present Address" {...register('presentAddress', { required: true })} />
            </div>
            <div className="form-group">
              <label>Ministry Experience *</label>
              <input type="text" placeholder="Enter Ministry Experience" {...register('ministryExperience', { required: true })} />
            </div>
            <div className="form-group">
              <label>Salvation Experience *</label>
              <input type="text" placeholder="Enter Salvation Experience" {...register('salvationExperience', { required: true })} />
            </div>

            <div className="form-group">
              <label>Signature *</label>
              <input type="file" {...register('signature', { required: true })} />
            </div>
            <div className="form-group">
              <label>Passport Size Photo *</label>
              <input type="file" {...register('passportSizePhoto', { required: true })} />
            </div>
            <div className="form-group">
              <label>Education Certificate *</label>
              <input type="file" {...register('educationCertificate', { required: true })} />
            </div>
            <div className="form-group">
              <label>User Name *</label>
              <input type="text" placeholder="Enter Username" {...register('username', { required: true })} />
            </div>
            <div className="form-group">
              <label>Password *</label>
              <input type="password" placeholder="Enter Password" {...register('password', { required: true })} />
            </div>
          </div>
        </div>
        <div className="form-group">
              <input type="submit" className='submit-btn' value="Submit" />
            </div>
            <div className="form-group" style={{ textAlign: 'center', marginTop: '20px' }}>
          <p>Already have an account? <a href='/login'>signin</a></p> 
        </div>
      </form>
    </div>
  );
}

export default Register;