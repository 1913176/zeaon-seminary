import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import './Register.css'; // Reuse the same CSS file
import { getAllUsers } from '../Admin/firebase/userApi';
import bcrypt from 'bcryptjs'; 

function Login() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [userdata, setUserdata] = useState(null);

  const onSubmit = async (data) => {
    try {
      const res = await getAllUsers();
      console.log(res); // Log to ensure you're getting the user data

      let foundUser = null;
      res.forEach(user => {
        if (user.username === data.username) {
          const isPasswordValid = bcrypt.compareSync(data.password, user.password); 
          if (isPasswordValid) {
            foundUser = user;
          }
        }
      });

      // If user is found, log them in
      if (foundUser) {
        setUserdata(foundUser);
        localStorage.setItem("userdata", JSON.stringify(foundUser));
        navigate("/home");
      } else {
        alert('Invalid username or password');
      }
    } catch (error) {
      console.error("Error fetching users: ", error);
      alert('An error occurred while logging in. Please try again.');
    }
  };

  return (
    <div style={{ height: "100vh" }} className='register'>
      <form className="my-form" onSubmit={handleSubmit(onSubmit)}>
        <h2 style={{ textAlign: 'center', marginBottom: "40px" }}>Login</h2>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            placeholder="Enter Username"
            {...register('username', { required: true })}
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter Password"
            {...register('password', { required: true })}
          />
        </div>
        <div className="form-group">
          <input type="submit" className='submit-btn' value="Login" />
        </div>
      </form>
    </div>
  );
}

export default Login;
