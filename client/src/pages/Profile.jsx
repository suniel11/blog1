import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchAndFollow from '../components/SearchAndFollow';
import ConversationsUser from '../components/ConversationUser';
import { Link } from 'react-router-dom';

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newProfilePic, setNewProfilePic] = useState(null); // State for new profile picture
  const [imagePreview, setImagePreview] = useState(null); // State to preview the selected image

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfileData(response.data);
      } catch (err) {
        setError('Failed to fetch profile data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle file change (user selects a new profile picture)
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewProfilePic(file);
      setImagePreview(URL.createObjectURL(file)); // Preview the selected image
    }
  };

  // Handle form submission for profile picture change
  const handleProfilePicChange = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('profilePicture', newProfilePic);

    try {
      await axios.post('http://localhost:5000/api/users/upload', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      // Fetch the updated profile data
      const response = await axios.get('http://localhost:5000/api/users/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProfileData(response.data); // Update the profile data after successful upload
    } catch (err) {
      setError('Failed to update profile picture');
      console.error(err);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex justify-center items-center h-full text-white bg-black">
      <section className="bg-gray-50 dark:bg-gray-900 w-full ">
   
        <div className="flex w-full  items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className=" flex w-full h-screen items-center bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-20 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Your Profile
              </h1>
        
              {profileData && (
                <div className="space-y-4">
                        <div className="flex flex-col items-center">
          <img
            src={`http://localhost:5000${profileData.profilePicture}`}
            alt="Profile"
            className="w-32 h-32 rounded-full border-2 border-primary-600"
          />
        </div>

                  <div className="text-center">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                      {profileData.name}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Email: {profileData.email}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Account Created On: {new Date(profileData.createdOn).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}

<button
        className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
        onClick={() => <Link to="/conversation" />}
      >
       
       <Link to={'/conversation'}>View Active Conversations</Link>
         
</button>
              {/* Button and file input for profile picture change */}
              <form onSubmit={handleProfilePicChange} className="space-y-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-900 dark:text-white"
                />
                {imagePreview && (
                  <div className="mt-4">
                    <img src={imagePreview} alt="Image Preview" className="w-24 h-24 rounded-full" />
                  </div>
                )}
                <button
                  type="submit"
                  className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Change Profile Picture
                </button>
              </form>

          

              <div className="flex items-center justify-between mt-6">
                <button
                  className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  onClick={() => {
                    localStorage.removeItem('token');
                    window.location.href = '/login'; // Redirect to login
                  }}
                >
                  Log Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile;
