import "./Profile.css";
import { useState, useEffect } from "react";
// import profileImage from "../Assets/Images/profileImage.jpeg";
// import profileBanner from "../Assets/Images/profileBanner.jpg";
import phoneSVG from "../Assets/SVG/phoneSVG.svg";
import mailSVG from "../Assets/SVG/mailSVG.svg";
// import axios from "axios";
// import LoadingPage from "../LoadingPage/LoadingPage";
// import ErrorDataFetchOverlay from "../Error/ErrorDataFetchOverlay";
// import { fetchUserData } from "../../../api/baseapi";
import defaultPorfileSVG from "../Assets/SVG/defaultPorfileSVG.svg";
import defaultBannerSVG from "../Assets/SVG/defaultBannerSVG.svg";
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    name: "Default name",
    email: "Default email",
    phoneNumber: "Default phoneNumber",
    gender: "Default gender",
    profilePic: defaultPorfileSVG,
    profileBanner: defaultBannerSVG,
    address: "Default address",
    educationalQualification: "Default educational Qualification",
    maritalStatus:"Default marital Status",
    dob:"default dob",
    ministryExperience:"default ministry Experience",
    theologicalQualification:"default theological Qualification",
    salvationExperience:"default salvation Experience"
  });
  const [selectedProfileImage, setSelectedProfileImage] = useState(null);
  const [selectedProfileBanner, setSelectedProfileBanner] = useState(null);
  useEffect(()=>{
    if(localStorage.getItem("userdata")!=null){
      const user  = JSON.parse(localStorage.getItem("userdata"))
      console.log(user)
      setProfileData({
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phoneNumber: user.mobileNo,
        gender: user.gender,
        profilePic: user.passportPhotoURL ? user.passportPhotoURL : defaultPorfileSVG,
        profileBanner: defaultBannerSVG,
        address: user.presentAddress,
        educationalQualification: user.educationalQualification,
        maritalStatus:user.maritalStatus,
        dob:user.dob,
        ministryExperience:user.ministryExperience,
        theologicalQualification:user.theologicalQualification,
        salvationExperience:user.salvationExperience
      })
    }
    else{
      navigate("/login")
    }
  },[])
  // const [isLoading, setIsLoading] = useState(true);
  // const [fetchError, setFetchError] = useState(false);

  // useEffect(() => {
  //   const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  //   const id = localStorage.getItem("userid");
  //   const userInfo = JSON.parse(localStorage.getItem("userDataUpdated"));
  //   if (userInfo) {
  //     // console.log(response.data.user);
  //     const data = userInfo;
  //     // console.log(response.data.users[0]._id);
  //     setProfileData(data);

  //     // usid
  //     const csuiteUserInfo = {
  //       userID: data._id,
  //       coursePurchased:
  //         data.coursePurchased != []
  //           ? data.coursePurchased.map((x) => x.courseId)
  //           : [],
  //     };
  //     localStorage.setItem("userInfo", JSON.stringify(csuiteUserInfo));

  //     if (
  //       data.profilePic &&
  //       !data.profilePic.startsWith("data:image/jpeg;base64,")
  //     ) {
  //       setProfileData((prevData) => ({
  //         ...prevData,
  //         profilePic: `data:image/jpeg;base64,${data.profilePic}`,
  //       }));
  //     } else if (data.profilePic) {
  //       setProfileData((prevData) => ({
  //         ...prevData,
  //         profilePic: data.profilePic,
  //       }));
  //     }

  //     if (
  //       data.profileBanner &&
  //       !data.profileBanner.startsWith("data:image/jpeg;base64,")
  //     ) {
  //       setProfileData((prevData) => ({
  //         ...prevData,
  //         profileBanner: `data:image/jpeg;base64,${data.profileBanner}`,
  //       }));
  //     } else if (data.profileBanner) {
  //       setProfileData((prevData) => ({
  //         ...prevData,
  //         profileBanner: data.profileBanner,
  //       }));
  //     }

  //     setIsLoading(false);
  //   } else {
  //     console.error("Error fetching profile data:");
  //     setIsLoading(false);
  //     setFetchError(true);
  //   }

  //   // axios
  //   //   .get(`${apiBaseUrl}/user/user/${id}`)
  //   //   .then((response) => {
  //   //     // console.log(response.data.user);
  //   //     const data = response.data.user;
  //   //     // console.log(response.data.users[0]._id);
  //   //     setProfileData(data);

  //   //     // usid
  //   //     const csuiteUserInfo = {
  //   //       userID: data._id,
  //   //       coursePurchased:
  //   //         data.coursePurchased != []
  //   //           ? data.coursePurchased.map((x) => x.courseId)
  //   //           : [],
  //   //     };
  //   //     localStorage.setItem("userInfo", JSON.stringify(csuiteUserInfo));

  //   //     if (
  //   //       data.profilePic &&
  //   //       !data.profilePic.startsWith("data:image/jpeg;base64,")
  //   //     ) {
  //   //       setProfileData((prevData) => ({
  //   //         ...prevData,
  //   //         profilePic: `data:image/jpeg;base64,${data.profilePic}`,
  //   //       }));
  //   //     } else if (data.profilePic) {
  //   //       setProfileData((prevData) => ({
  //   //         ...prevData,
  //   //         profilePic: data.profilePic,
  //   //       }));
  //   //     }

  //   //     if (
  //   //       data.profileBanner &&
  //   //       !data.profileBanner.startsWith("data:image/jpeg;base64,")
  //   //     ) {
  //   //       setProfileData((prevData) => ({
  //   //         ...prevData,
  //   //         profileBanner: `data:image/jpeg;base64,${data.profileBanner}`,
  //   //       }));
  //   //     } else if (data.profileBanner) {
  //   //       setProfileData((prevData) => ({
  //   //         ...prevData,
  //   //         profileBanner: data.profileBanner,
  //   //       }));
  //   //     }

  //   //     setIsLoading(false);
  //   //   })
  //   //   .catch(() => {
  //   //     console.error("Error fetching profile data:");
  //   //     setIsLoading(false);
  //   //     setFetchError(true);
  //   //   });
  // }, []);

  // async function fetchData(id) {
  //   try {
  //     const res = await fetchUserData(id);
  //     console.log(res);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("emergencyContact.")) {
      const field = name.split(".")[1];
      setProfileData((prevData) => ({
        ...prevData,
        emergencyContact: {
          ...prevData.emergencyContact,
          [field]: value,
        },
      }));
    } else {
      setProfileData({
        ...profileData,
        [name]: value,
      });
    }
  };

  const handleSaveClick = async () => {
    setIsEditing(false);
    const formData = new FormData();

    for (const key in profileData) {
      if (key === "emergencyContact") {
        const emergencyContact = profileData[key];
        for (const field in emergencyContact) {
          formData.append(`emergencyContact.${field}`, emergencyContact[field]);
        }
      } else {
        formData.append(key, profileData[key]);
      }
    }
    if (selectedProfileImage) {
      formData.append("profilePic", selectedProfileImage);
    }
    if (selectedProfileBanner) {
      formData.append("profileBanner", selectedProfileBanner);
    }

    // try {
    //   const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

    //   const response = await axios.put(
    //     `${apiBaseUrl}/user/${profileData._id}`,
    //     formData
    //   );

    //   localStorage.setItem(
    //     "userDataUpdated",
    //     JSON.stringify(response.data.user)
    //   );

    //   if (response.status !== 200) {
    //     console.error("Error updating profile:", response.data);
    //   }
    // } catch (error) {
    //   console.error("Network error updating profile:", error);
    // }
  };

  const handleProfileImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedProfileImage(file);
      const reader = new FileReader();
      reader.onload = (e) =>
        setProfileData((prevData) => ({
          ...prevData,
          profilePic: e.target.result,
        }));
      reader.readAsDataURL(file);
    }
  };

  const handleProfileBannerChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedProfileBanner(file);
      const reader = new FileReader();
      reader.onload = (e) =>
        setProfileData((prevData) => ({
          ...prevData,
          profileBanner: e.target.result,
        }));
      reader.readAsDataURL(file);
    }
  };

  const inputClassName = (value) => {
    if (value === "" || value === null || value === undefined) {
      return "error-border";
    }
    return "";
  };

  // if (fetchError) {
  //   return <ErrorDataFetchOverlay />;
  // }

  // if (isLoading) {
  //   return (
  //     <div>
  //       <LoadingPage />
  //     </div>
  //   );
  // }

  return (
    <div className="profileContainer">
      <div className="profileBannerBox">
        <div className="profileBGBox">
          <img
            src={
              profileData?.profileBanner
                ? profileData?.profileBanner
                : defaultBannerSVG
            }
            alt="Banner"
          />
          {isEditing && (
            <label className="custom-file-upload imageBanner">
              <input
                type="file"
                accept="image/*"
                onChange={handleProfileBannerChange}
                className="imageBannerUpload"
              />
              Choose File for Profile Banner
            </label>
          )}
        </div>
        <div className="profileHeader">
          <div className="profileImage">
            <img
              src={
                profileData?.profilePic
                  ? profileData?.profilePic
                  : defaultPorfileSVG
              }
              alt="Profile"
              className="defaultImage"
            />
            {isEditing && (
              <label className="custom-file-upload">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  className="imageUpload"
                />
                Choose File
              </label>
            )}
          </div>
          <div className="profileHeaderInfo">
            <div className="profileName">{profileData?.name}</div>
            <div className="profileEmail">{profileData?.email}</div>
          </div>
          <div className="profileEditBtn">
            <button onClick={isEditing ? handleSaveClick : handleEditClick}>
              {isEditing ? "Save" : "Edit"}
            </button>
          </div>
        </div>
      </div>
      <div className="profileContent">
        <div className="profileSection">
          <div className="hh5">General Information</div>
          <div
            className={`${inputClassName(profileData?.name)} profileDetails`}
          >
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={profileData.name}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          <div
            className={`${inputClassName(profileData.gender)} profileDetails`}
          >
            {" "}
            <label>Gender</label>
            <input
              type="text"
              name="gender"
              value={profileData?.gender}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          <div
            className={`${inputClassName(profileData.address)} profileDetails`}
          >
            <label>Address</label>
            <textarea
              type="text"
              name="address"
              value={profileData?.address}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          <div className="profileSeperator"></div>
          <div className="hh5">Contact Details</div>
          <div
            className={`${inputClassName(
              profileData.email
            )} profileDetails profileSPLBox`}
          >
            <img src={phoneSVG} alt="phoneNumberSVG" />
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={profileData?.email}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          <div
            className={`${inputClassName(
              profileData.phoneNumber
            )} profileDetails profileSPLBox`}
          >
            <img src={mailSVG} alt="mailSVG" />
            <label>Phone Number</label>
            <input
              type="number"
              name="phoneNumber"
              value={profileData?.phoneNumber}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
        </div>
        <div className="profileSection">
          <div className="hh5">Other Informations</div>
          <div
            className={`${inputClassName(
              profileData.educationalQualification
            )} profileDetails`}
          >
            <label>Education Qualification</label>
            <input
              type="text"
              name="companyname"
              value={profileData?.educationalQualification}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          <div
            className={`${inputClassName(profileData.maritalStatus)} profileDetails`}
          >
            <label>Marital Status</label>
            <input
              type="text"
              name="position"
              value={profileData?.maritalStatus}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          <div
            className={`${inputClassName(profileData.dob)} profileDetails`}
          >
            <label>Date of Birth</label>
            <input
              type="text"
              name="DOB"
              value={profileData?.dob}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          <div className={`${inputClassName(profileData.ministryExperience)} profileDetails`}>
            <label>Ministry Experience</label>
            <textarea
              name="bio"
              value={profileData?.ministryExperience}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          <div className={`${inputClassName(profileData.theologicalQualification)} profileDetails`}>
            <label>Theological Qualification</label>
            <textarea
              name="bio"
              value={profileData?.theologicalQualification}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          <div className={`${inputClassName(profileData.salvationExperience)} profileDetails`}>
            <label>Salvation Experience</label>
            <textarea
              name="bio"
              value={profileData?.salvationExperience}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
