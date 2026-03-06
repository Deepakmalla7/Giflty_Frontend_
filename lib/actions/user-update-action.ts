import { updateUserProfile } from "../api/user";

type UpdateUserActionResult = {
  success: boolean;
  message: string;
  data?: any;
};

export const updateUserProfileAction = async (
  userId: string,
  payload: {
    email?: string;
    username?: string;
    accountStatus?: "active" | "inactive";
  }
): Promise<UpdateUserActionResult> => {
  try {
    const result = await updateUserProfile(userId, payload);
    return {
      success: true,
      message: result.message || "Profile updated successfully",
      data: result.data || result
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || "Update failed"
    };
  }
};
