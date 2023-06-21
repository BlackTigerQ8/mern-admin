import React, { useState, useRef } from "react";
import { Input, useTheme, Box, Button, Avatar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { uploadImage, updateUserProfile } from "../redux/apiCalls";
import {
  userProfileUpdateRequest,
  userProfileUpdateSuccess,
  userProfileUpdateFailure,
  updateProfileImage,
} from "../redux/userSlice";
import { toast } from "react-toastify";
import { tokens } from "../theme";
import Header from "../components/Header";

const Profile = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleProfileUpdate = async () => {
    if (selectedImage) {
      const formData = new FormData();
      formData.append("image", selectedImage);

      try {
        const { image } = await uploadImage(formData);
        const updatedUserData = {
          ...user,
          profileImage: image,
        };
        dispatch(userProfileUpdateSuccess(updatedUserData));
        toast.success("Image uploaded successfully");
        // Dispatch the updateProfileImage action
        dispatch(updateProfileImage(image));

        // Reset the file input value and clear selectedImage and previewImage states
        fileInputRef.current.value = "";
        setSelectedImage(null);
        setPreviewImage(null);
      } catch (error) {
        console.log("Error uploading image:", error);
        toast.error("Failed to upload image");
      }
    } else {
      dispatch(userProfileUpdateRequest(user));
    }
  };

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      setSelectedImage(selectedFile);
      setPreviewImage(URL.createObjectURL(selectedFile));
    } else {
      setSelectedImage(null);
      setPreviewImage(null);
    }
  };

  return (
    <Box m="20px">
      <Header title="Profile" subtitle="Update your profile information" />
      <div>
        {previewImage ? (
          <img
            width="100px"
            height="100px"
            style={{
              borderRadius: "50%",
            }}
            src={previewImage}
            alt="Profile Preview"
          />
        ) : (
          <img src={user.profileImage} alt="Profile" />
        )}
      </div>
      <div>
        <Input type="file" ref={fileInputRef} onChange={handleImageChange} />
      </div>
      <Box display="flex" justifyContent="end" mt="20px">
        <Button
          onClick={handleProfileUpdate}
          color="secondary"
          variant="contained"
        >
          Update Profile
        </Button>
      </Box>
    </Box>
  );
};

export default Profile;
