import React, { useEffect, useState } from "react";
import Select from 'react-select';
import { getAllDegrees } from "../../firebase/degreeApi";
import { addUser } from "../../firebase/userApi";
// import { addnewUser } from "../../api/baseApi";

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


const AddnewUser = ({ closeNewUser }) => {

  const [newUserData, setNewUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobileNo: null,
    maritalStatus: '',
    dob: '',
    gender: '',
    applyingFor: '',
    educationalQualification: '',
    presentAddress: '',
    salvationExperience: '',
    ministryExperience: '',
    signatureURL: null,
    passportPhotoURL: null,
    educationCertURL: null,
  });

  const [courseOptions, setCourseOptions] = useState([]);


  useEffect(() => {
    const fetchCourses = async () => {
      const coursesSnapshot = await getAllDegrees();
      const coursesList = coursesSnapshot?.map((doc) => ({
        value: doc?.id,
        label: doc.data()?.domain,
      }));
      setCourseOptions(coursesList);
    };

    fetchCourses();
  }, []);

  const handleChangeData = (type, value) => {
    setNewUserData({ ...newUserData, [type]: value });
  };

  const createNewUser = async () => {
    const res = await addUser(newUserData)
    res && closeNewUser()
  };

  console.log(newUserData)

  return (
    <div className="add-new-user-cover">
      <div className="add-new-user-cnt">
        <>
          <h3>New User </h3>
          <p>Enter New User Details</p>
        </>
        <form className="user-details-from">
          <div className="course-name-cnt user-input">
            <p>First Name *</p>
            <input
              type="text"
              className="name-input "
              placeholder="Enter user first name"
              onChange={(e) => handleChangeData("firstName", e.target.value)}
            />
          </div>
          <div className="course-name-cnt user-input">
            <p>Last Name *</p>
            <input
              type="text"
              className="name-input "
              placeholder="Enter user last name"
              onChange={(e) => handleChangeData("lastName", e.target.value)}
            />
          </div>
          <div className="course-name-cnt user-input">
            <p>Mobile No *</p>
            <input
              type="number"
              placeholder="Enter mobile number"
              className="name-input "
              onChange={(e) => handleChangeData("mobileNo", e.target.value)}
            />
          </div>
          <div className="course-name-cnt user-input">
            <p>Theological Qualification *</p>
            <input
              type="text"
              className="name-input "
              placeholder="Enter theological Qualification"
              onChange={(e) => handleChangeData("theologicalQualification", e.target.value)}
            />
          </div>
          <div className="course-name-cnt user-input">
            <p>Present Address *</p>
            <input
              type="text"
              className="name-input "
              placeholder="Enter Present Address"
              onChange={(e) => handleChangeData("presentAddress", e.target.value)}
            />
          </div>
          <div className="course-name-cnt user-input">
            <p>Gender *</p>
            <Select
              placeholder="Select Gender "
              options={options.gender}
              // className="name-input"
              onChange={(e) => handleChangeData("gender", e.target.value)}
            />
          </div>
          <div className="course-name-cnt user-input">
            <p>Ministry Experience *</p>
            <input
              type="text"
              placeholder="Enter ministry experience"
              value={newUserData?.ministryExperience || ''}
              className="name-input "
              onChange={(e) => handleChangeData("ministryExperience", e.target.value)}
            />
          </div>
          <div className="course-name-cnt user-input">
            <p>Email *</p>
            <input
              type="text"
              placeholder="Enter user email"
              value={newUserData?.email || ''}
              className="name-input "
              onChange={(e) => handleChangeData("email", e.target.value)}
            />
          </div>
          <div className="course-name-cnt user-input">
            <p>Salvation Experience *
            </p>
            <input
              type="text"
              placeholder="Enter salvation experience"
              value={newUserData?.salvationExperience || ''}
              className="name-input "

              onChange={(e) => handleChangeData("salvationExperience", e.target.value)}
            />
          </div>
          <div className="course-name-cnt user-input">
            <p>Marital Status *</p>
            <Select
              options={options.maritalStatus}
              onChange={(e) => handleChangeData("maritalStatus", e.value)}
            />
          </div>
          <div className="course-name-cnt user-input">
            <p>Educational Qualification *</p>
            <input
              type="text"
              className="name-input "
              placeholder="Enter Educational Qualification"
              onChange={(e) => handleChangeData("educationalQualification", e.target.value)}
            />
          </div>
          <div className="course-name-cnt user-input">
            <p>User Name *</p>
            <input
              type="text"
              className="name-input "
              placeholder="Enter user name"
            // onChange={(e) => handleChnageData("", e.target.value)}
            />
          </div>
          <div className="course-name-cnt user-input">
            <p>DOB *</p>
            <input
              type="date"
              className="name-input "
              onChange={(e) => handleChangeData("dob", e.target.value)}
            />
          </div>
          <div className="course-name-cnt user-input">
            <p>Applying for *</p>
            <Select
              options={courseOptions}
              onChange={(e) => handleChangeData("applyingFor", e.value)}
            />
          </div>
          <div className="course-name-cnt user-input">
            <p>Password *</p>
            <input
              type="password"
              className="name-input "
              placeholder="Enter user password"
              onChange={(e) => handleChangeData("password", e.target.value)}
            />
          </div>
          <div
            className="course-name-cnt name-input user-input "
            style={{ position: "relative" }}
          >
            <p className="file-upload ">{newUserData?.signatureURL?.name ? newUserData?.signatureURL?.name.slice(0, 20) : "Upload Signature *"}</p>
            <input
              type="file"
              className="name-input file-input-hide "
              onChange={(e) =>
                handleChangeData('signatureURL', e.target.files,)
              }
            />
          </div>
          <div
            className="course-name-cnt name-input user-input "
            style={{ position: "relative" }}
          >
            <p className="file-upload ">{newUserData?.passportPhotoURL?.name ? newUserData?.passportPhotoURL?.name.slice(0, 20) : "Upload Passport Size Photo *"}</p>
            <input
              type="file"
              className="name-input file-input-hide "
              onChange={(e) =>
                handleChangeData('passportPhotoURL', e.target.files,)
              }
            />
          </div>
          <div
            className="course-name-cnt name-input user-input "
            style={{ position: "relative" }}
          >
            <p className="file-upload ">{newUserData?.educationCertURL?.name ? newUserData?.educationCertURL?.name.slice(0, 20) : "Upload Education Certificate *"}</p>
            <input
              type="file"
              className="name-input file-input-hide "
              onChange={(e) =>
                handleChangeData('educationCertURL', e.target.files,)
              }
            />
          </div>
        </form>
        <div className="bottom-btn-cnt">
          <div className=" course-delete-btn " onClick={() => closeNewUser()}>
            Cancel
          </div>
          <div className="add-new-lesson-btn" onClick={() => createNewUser()}>
            Add User
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddnewUser;
