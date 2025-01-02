import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const isLoggedIn = !!localStorage.getItem('token'); // Check if the token exists

  return (
    <>
      <div className="flex justify-between items-center p-4 bg-gray-800 text-white h-1 w-full hover:animate-pulse">
        <span className="flex flex-row gap-10 justify-evenly font-bold">
          <Link to={'/'}>Home</Link>
          {isLoggedIn && <Link to={'/profile'}>Profile</Link>}
        </span>

        <span className="flex flex-end justify-evenly text-gray-400 gap-x-10">
          {!isLoggedIn && (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
          {isLoggedIn && <Link to={'/conversation'}>Messages</Link>}
          <Link to="/search">Add friends</Link>
          <Link to="/friends">Friends</Link>
        
        </span>
      </div>
    </>
  );
};

export default Header;
