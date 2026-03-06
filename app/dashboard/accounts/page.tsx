"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCookieUserData } from "@/lib/actions/user-action";
import { deleteUserPhotoAction, uploadUserPhotoAction } from "@/lib/actions/user-photo-action";
import { deleteUserAccountAction } from "@/lib/actions/user-delete-action";
import { updateUserProfileAction } from "@/lib/actions/user-update-action";

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  age?: number;
  gender?: string;
  profilePicture?: string;
  accountStatus?: "active" | "inactive";
}

const getCookieValue = (name: string) => {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : "";
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

const normalizeProfilePicture = (value?: string) => {
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  if (value.startsWith("/uploads/")) return `${API_BASE_URL}${value}`;
  if (value.includes("uploads")) {
    const parts = value.split(/[/\\]/);
    const fileName = parts[parts.length - 1];
    return `${API_BASE_URL}/uploads/${fileName}`;
  }
  return value;
};

export default function AccountsPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editEmail, setEditEmail] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editStatus, setEditStatus] = useState<"active" | "inactive">("active");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const updateSessionCookie = async (updatedUser: UserData) => {
    const token = getCookieValue("auth_token");
    if (!token) return;

    try {
      await fetch("/api/auth/set-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          userData: updatedUser
        }),
        credentials: "include"
      });
    } catch (error) {
      console.error("Failed to update session cookie:", error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getCookieUserData();

        if (response.success && response.data) {
          const normalizedProfile = normalizeProfilePicture(response.data.profilePicture);
          const normalizedUser = {
            ...response.data,
            profilePicture: normalizedProfile
          };
          setUserData(normalizedUser);
          setEditEmail(normalizedUser.email || "");
          setEditUsername(normalizedUser.username || "");
          setEditStatus(normalizedUser.accountStatus || "active");
          if (normalizedProfile && response.data.profilePicture !== normalizedProfile) {
            await updateSessionCookie(normalizedUser);
          }
        } else {
          setError(response.message || "Failed to load user data from cookies");
        }
      } catch (err: any) {
        console.error("Error fetching user data:", err);
        setError("An unexpected error occurred. Please log in again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [uploadMessage]);

  const handleProfileSave = async () => {
    if (!userData?.id) {
      setError("User ID not found. Please log in again.");
      return;
    }

    if (!editEmail || !editUsername) {
      setError("Email and username are required.");
      return;
    }

    setIsSaving(true);
    setSaveMessage("Saving...");

    try {
      const result = await updateUserProfileAction(userData.id, {
        email: editEmail,
        username: editUsername,
        accountStatus: editStatus
      });

      if (!result.success) {
        setError(result.message || "Failed to update profile.");
        setSaveMessage(null);
        setIsSaving(false);
        return;
      }

      const updatedUser = {
        ...userData,
        email: editEmail,
        username: editUsername,
        accountStatus: editStatus
      };

      setUserData(updatedUser);
      await updateSessionCookie(updatedUser);
      setSaveMessage("Profile updated successfully!");
      setTimeout(() => setSaveMessage(null), 2000);
    } catch (err: any) {
      setError(err.message || "Failed to update profile.");
      setSaveMessage(null);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePhotoUpload = async (file: File) => {
    if (!file) {
      setUploadMessage("Please select a photo to upload.");
      return;
    }

    if (!userData?.id) {
      setUploadMessage("User ID not found. Please log in again.");
      return;
    }

    setUploadMessage("Uploading...");

    try {
      const formData = new FormData();
      formData.append("photo", file);
      formData.append("userId", userData.id);

      const actionResult = await uploadUserPhotoAction(formData);
      console.log('Upload result:', actionResult);
      
      if (!actionResult.success) {
        setUploadMessage(actionResult.message || "Failed to upload photo.");
        setTimeout(() => setUploadMessage(null), 3000);
        return;
      }

      // Get the photo URL from response - check multiple possible locations
      let photoUrl = actionResult.data?.url || 
                     actionResult.data?.data?.profilePicture ||
                     actionResult.data?.data?.url;
      
      console.log('Photo URL from response:', photoUrl);
      
      if (!photoUrl) {
        console.error('Response data:', actionResult.data);
        setUploadMessage("Photo uploaded but could not retrieve URL.");
        setTimeout(() => setUploadMessage(null), 3000);
        return;
      }

      // Normalize and update state immediately
      const normalizedPath = normalizeProfilePicture(photoUrl);
      console.log('Normalized path:', normalizedPath);
      
      setUserData((prev) =>
        prev
          ? {
              ...prev,
              profilePicture: normalizedPath
            }
          : prev
      );

      // Update session cookie with new data
      const updatedUserData = {
        ...userData,
        profilePicture: normalizedPath
      };
      
      await updateSessionCookie(updatedUserData);

      setUploadMessage("Photo uploaded successfully!");
      setTimeout(() => setUploadMessage(null), 2000);
      setPhoto(null);
    } catch (error: any) {
      console.error('Photo upload error:', error);
      setUploadMessage(error.message || "Failed to upload photo.");
      setTimeout(() => setUploadMessage(null), 3000);
    }
  };

  const handlePhotoDelete = async () => {
    if (!userData?.profilePicture || !userData?.id) {
      setUploadMessage("Cannot delete photo.");
      return;
    }

    setUploadMessage("Deleting...");

    try {
      const actionResult = await deleteUserPhotoAction({
        photoPath: userData.profilePicture,
        userId: userData.id
      });

      if (!actionResult.success) {
        setUploadMessage(actionResult.message || "Failed to delete photo.");
        setTimeout(() => setUploadMessage(null), 3000);
        return;
      }

      setUploadMessage(actionResult.message || "Photo deleted successfully!");
      setTimeout(() => setUploadMessage(null), 2000);
      setUserData((prev) => (prev ? { ...prev, profilePicture: "" } : prev));
      if (userData) {
        await updateSessionCookie({ ...userData, profilePicture: "" });
      }

      const userDataResponse = await getCookieUserData();
      if (userDataResponse.success && userDataResponse.data) {
        setUserData(userDataResponse.data);
      }
    } catch (error: any) {
      console.error('Photo delete error:', error);
      setUploadMessage(error.message || "Failed to delete photo.");
      setTimeout(() => setUploadMessage(null), 3000);
    }
  };

  const handleDeleteAccount = async () => {
    if (!userData?.id) {
      setError("User ID not found.");
      setDeleteConfirmOpen(false);
      return;
    }

    setIsDeleting(true);

    try {
      const actionResult = await deleteUserAccountAction(userData.id);

      if (!actionResult.success) {
        setError(actionResult.message || "Failed to delete account.");
        setIsDeleting(false);
        setDeleteConfirmOpen(false);
        return;
      }

      // Redirect to home page after successful deletion
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (error: any) {
      console.error('Account deletion error:', error);
      setError(error.message || "Failed to delete account.");
      setIsDeleting(false);
      setDeleteConfirmOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Account Settings
        </h1>
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-6 rounded">
          <p className="text-red-600 dark:text-red-400 font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Account Settings
      </h1>

      {/* Profile Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-6">
        <div className="flex items-start gap-8">
          {/* Profile Picture */}
          <div className="relative w-32 h-32">
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setPhoto(file);
                  await handlePhotoUpload(file);
                }
              }}
              className="hidden"
              id="photo-input"
            />
            
            {/* Profile Image or Initial */}
            {userData?.profilePicture ? (
              <img
                key={userData.profilePicture}
                src={`${normalizeProfilePicture(userData.profilePicture)}?t=${Date.now()}`}
                alt="Profile Picture"
                className="w-full h-full rounded-lg object-cover border-4 border-emerald-600"
              />
            ) : (
              <div className="w-full h-full rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-5xl font-bold">
                {userData?.firstName ? userData.firstName.charAt(0).toUpperCase() : "U"}
              </div>
            )}

            {/* Camera Icon - Bottom Left Corner */}
            <label
              htmlFor="photo-input"
              className="absolute bottom-0 left-0 bg-emerald-600 hover:bg-emerald-700 rounded-full p-3 cursor-pointer shadow-lg transform -translate-x-1/4 translate-y-1/4 transition duration-200 hover:scale-110"
            >
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </label>

            {/* Upload Status Overlay */}
            {uploadMessage && (
              <div className="absolute inset-0 rounded-lg bg-black bg-opacity-60 flex items-center justify-center">
                <p className="text-white text-xs font-semibold text-center px-2">{uploadMessage}</p>
              </div>
            )}

            {/* Delete Photo Button - Below Profile Picture */}
            {userData?.profilePicture && (
              <button
                onClick={handlePhotoDelete}
                className="absolute top-full mt-3 left-0 right-0 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition w-full"
              >
                Remove Photo
              </button>
            )}
          </div>

          {/* User Information */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {userData?.firstName} {userData?.lastName}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                  Email Address
                </label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="mt-2 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                  Username
                </label>
                <input
                  type="text"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  className="mt-2 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              {userData?.age && (
                <div>
                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Age
                  </label>
                  <p className="text-lg text-gray-900 dark:text-white mt-1">
                    {userData.age}
                  </p>
                </div>
              )}
              {userData?.gender && (
                <div>
                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Gender
                  </label>
                  <p className="text-lg text-gray-900 dark:text-white mt-1 capitalize">
                    {userData.gender}
                  </p>
                </div>
              )}
              <div>
                <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                  Account Status
                </label>
                <div className="mt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setEditStatus("active")}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${
                      editStatus === "active"
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    Active
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditStatus("inactive")}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${
                      editStatus === "inactive"
                        ? "bg-red-600 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    Inactive
                  </button>
                </div>
              </div>
              <div className="pt-2">
                <button
                  onClick={handleProfileSave}
                  disabled={isSaving}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-6 rounded-lg transition disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
                {saveMessage && (
                  <p className="mt-2 text-sm text-emerald-600 dark:text-emerald-400">
                    {saveMessage}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Account Settings Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg p-6">
        <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-4">
          Danger Zone
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Irreversible actions that affect your account.
        </p>
        <button
          onClick={() => setDeleteConfirmOpen(true)}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition"
        >
          Delete Account
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-sm w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Delete Account?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              This action cannot be undone. Your account and all associated data will be permanently deleted.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
              Please make sure you have backed up any important data before proceeding.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setDeleteConfirmOpen(false)}
                disabled={isDeleting}
                className="flex-1 bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
