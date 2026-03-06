import axios from "./axios";
import { API } from "./endpoints";

export const uploadUserPhoto = async (formData: FormData) => {
  try {
    const response = await axios.post(API.USER.UPLOAD_PHOTO, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return response.data;
  } catch (err: any) {
    console.error("Upload user photo error:", err);
    throw new Error(err.response?.data?.message || err.message || "Upload failed");
  }
};

export const deleteUserPhoto = async (payload: {
  photoPath: string;
  userId: string;
}) => {
  try {
    const response = await axios.delete(API.USER.DELETE_PHOTO, {
      data: payload
    });
    return response.data;
  } catch (err: any) {
    console.error("Delete user photo error:", err);
    throw new Error(err.response?.data?.message || err.message || "Delete failed");
  }
};

export const updateUserProfile = async (userId: string, payload: {
  email?: string;
  username?: string;
  accountStatus?: "active" | "inactive";
}) => {
  try {
    const response = await axios.put(`${API.USER.UPDATE_PROFILE}/${userId}`, payload);
    return response.data;
  } catch (err: any) {
    console.error("Update user profile error:", err);
    throw new Error(err.response?.data?.message || err.message || "Update failed");
  }
};
