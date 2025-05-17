import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./EditProfile.css";

function EditProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
  });

  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      navigate("/login");
      return;
    }
    setUser(storedUser);
    setFormData({
      name: storedUser.username || "",
      email: storedUser.email || "",
      mobile: storedUser.mobile || "",
      address: storedUser.address || "",
    });
  }, [navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await axios.put(
        `http://localhost:5000/api/users/${user._id}`,
        formData
      );
      localStorage.setItem("user", JSON.stringify(updatedUser.data));
      setMessage({ type: "success", text: "Profile updated successfully!" });

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      console.error("Error updating profile", err);
      setMessage({ type: "error", text: "Invalid details. Please try again." });
    }
  };

  return (
    <div className="edit-profile-container">
      <h2>Edit Your Profile</h2>

      {message.text && (
        <div className={`message ${message.type === "success" ? "success" : "error"}`}>
          {message.text}
        </div>
      )}

      <form className="edit-profile-form" onSubmit={handleSubmit}>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          name="mobile"
          value={formData.mobile}
          onChange={handleChange}
          placeholder="Mobile Number"
          required
        />
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Home Address"
          required
        />
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
}

export default EditProfile;
