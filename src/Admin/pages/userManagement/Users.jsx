import React from "react";
import searchIcon from "../../Assets/Images/search.png";
import addIcon from "../../Assets/Images/plus.png";
import UsersList from "./UsersList";

const Users = ({ openNewUser, openEditUser }) => {
  return (
    <div className="user-page">
      <>
        {/* <h2 className="users-page-title">User Management</h2> */}
      </>
      <div className="users-list-header">
        <h2 className="h2-user-title">
          All users
          <span> 44</span>
        </h2>
        <div className="users-header-actions-cnt">
          <div className="search-user-cnt">
            <img src={searchIcon} alt="search-icon" className="search-icon" />
            <input type="text" className="search-input" placeholder="Search" />
          </div>
          <div className="add-new-btn" onClick={() => openNewUser()}>
            <img
              src={addIcon}
              alt="add-icon"
              className="search-icon add-icon"
            />
            <p> Add user</p>
          </div>
        </div>
      </div>
      <UsersList editAction={openEditUser} />
    </div>
  );
};

export default Users;
