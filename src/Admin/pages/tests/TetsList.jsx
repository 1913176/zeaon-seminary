import React, { useState } from 'react'
import moreIcon from "../../Assets/Images/more.png";
import searchIcon from "../../Assets/Images/search.png";
import { useNavigate } from 'react-router-dom';
import TestDetails from './TestDetails';



const TetsList = () => {
    const [testList, setTestList] = useState([])
    const [openTest,setOpenTest] = useState({open:false})
    const navigate = useNavigate()
    return (
        <div className="user-page">
            <div className="users-list-header">
                <h2 className="h2-user-title">
                    All tests
                    <span> 0</span>
                </h2>
                <div className="users-header-actions-cnt">
                    <div className="search-user-cnt">
                        <img src={searchIcon} alt="search-icon" className="search-icon" />
                        <input type="text" className="search-input" placeholder="Search" />
                    </div>
                </div>
            </div>
            <div className="users-list-cnt">
                <div className="users-details-header">
                    <p className="test-cell-cnt ">Student Name</p>
                    <p className="test-cell-cnt ">Student ID</p>
                    <p className="test-cell-cnt">Test Type</p>
                    <p className="test-cell-cnt">Submission Date</p>
                    <p className="test-cell-cnt">Correction Status</p>
                    <p style={{ width: "2rem" }}></p>
                </div>
                {/* {testList &&
                    testList?.map((test, index) => ( */}
                <div className="test-details-cnt">
                    <p className="test-cell-cnt details-text">
                        test-student
                    </p>
                    <p className="test-cell-cnt details-text">9111111545</p>
                    <p className="details-text test-cell-cnt">Course</p>
                    <p className="details-text test-cell-cnt">12-05-29</p>
                    <p className="details-text test-cell-cnt">Corrected</p>
                    <img
                        src={moreIcon}
                        alt="more"
                        className="more-icon"
                        onClick={()=> navigate('details')}  
                    />
                </div>
                {/* ))} */}
            </div>
        </div>
    )
}

export default TetsList