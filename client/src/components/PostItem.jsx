import React, { useState } from "react";
import axios from "axios";

const PostItem = ({ onPostAdded }) => {
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const formData = new FormData();
    formData.append("description", description);
    if (image) {
      formData.append("image", image);
    }

    try {
      const userId = localStorage.getItem("userId"); // Assuming user ID is stored in localStorage
      const token = localStorage.getItem("token");
      if (!userId) {
        throw new Error("User not logged in");
      }

      formData.append("userId", userId);

      const response = await axios.post("http://localhost:5000/api/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
        },
      });

      onPostAdded(response.data); // Notify parent component of the new post
      setDescription("");
      setImage(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add post");
      console.error(err);
    }
  };

  return (
    <div className="p-1 w-full bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-lg text-white mb-4">Add New Post</h2>
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Write something..."
          className="w-full p-2 rounded-lg bg-gray-700 text-white resize-none"
          rows={4}
          required
        ></textarea>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="text-gray-300"
          
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add Post
        </button>
      </form>
    </div>
  );
};

export default PostItem;
