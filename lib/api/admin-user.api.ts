import axiosInstance from "./axios";
import { API } from "./endpoints";

// Helper to get admin auth token from localStorage
const getAdminHeaders = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export interface AdminUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    age?: number;
    gender?: string;
    event?: string;
    role: string;
    accountStatus: string;
    profilePicture?: string;
    createdAt: string;
    updatedAt: string;
}

export interface UserFilterParams {
    search?: string;
    role?: string;
    accountStatus?: string;
    page?: number;
    limit?: number;
}

export interface PaginatedUserResponse {
    success: boolean;
    message: string;
    data: AdminUser[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export const adminUserApi = {
    /**
     * Get users with pagination, search, and filters
     */
    async getUsers(params: UserFilterParams = {}): Promise<PaginatedUserResponse> {
        const queryParams = new URLSearchParams();
        if (params.search) queryParams.append("search", params.search);
        if (params.role) queryParams.append("role", params.role);
        if (params.accountStatus) queryParams.append("accountStatus", params.accountStatus);
        if (params.page) queryParams.append("page", params.page.toString());
        if (params.limit) queryParams.append("limit", params.limit.toString());

        const url = `${API.ADMIN_USERS.BASE}?${queryParams.toString()}`;
        const response = await axiosInstance.get(url, { headers: getAdminHeaders() });
        return response.data;
    },

    /**
     * Get user by ID
     */
    async getUserById(id: string): Promise<{ success: boolean; data: AdminUser }> {
        const response = await axiosInstance.get(API.ADMIN_USERS.BY_ID(id), {
            headers: getAdminHeaders(),
        });
        return response.data;
    },

    /**
     * Create a new user (FormData for file upload support)
     */
    async createUser(formData: FormData): Promise<{ success: boolean; message: string; data: AdminUser }> {
        const response = await axiosInstance.post(API.ADMIN_USERS.BASE, formData, {
            headers: {
                ...getAdminHeaders(),
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    },

    /**
     * Update user by ID (FormData for file upload support)
     */
    async updateUser(id: string, formData: FormData): Promise<{ success: boolean; message: string; data: AdminUser }> {
        const response = await axiosInstance.put(API.ADMIN_USERS.BY_ID(id), formData, {
            headers: {
                ...getAdminHeaders(),
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    },

    /**
     * Soft delete (deactivate) user
     */
    async deleteUser(id: string): Promise<{ success: boolean; message: string; data: AdminUser }> {
        const response = await axiosInstance.delete(API.ADMIN_USERS.BY_ID(id), {
            headers: getAdminHeaders(),
        });
        return response.data;
    },

    /**
     * Permanently delete user
     */
    async permanentDeleteUser(id: string): Promise<{ success: boolean; message: string }> {
        const response = await axiosInstance.delete(API.ADMIN_USERS.PERMANENT_DELETE(id), {
            headers: getAdminHeaders(),
        });
        return response.data;
    },

    /**
     * Restore a deactivated user
     */
    async restoreUser(id: string): Promise<{ success: boolean; message: string; data: AdminUser }> {
        const response = await axiosInstance.put(API.ADMIN_USERS.RESTORE(id), {}, {
            headers: getAdminHeaders(),
        });
        return response.data;
    },

    /**
     * Reset user password
     */
    async resetPassword(id: string, newPassword: string): Promise<{ success: boolean; message: string }> {
        const response = await axiosInstance.put(
            API.ADMIN_USERS.RESET_PASSWORD(id),
            { newPassword },
            { headers: getAdminHeaders() }
        );
        return response.data;
    },

    /**
     * Toggle user active/inactive status
     */
    async toggleStatus(id: string): Promise<{ success: boolean; message: string; data: AdminUser }> {
        const response = await axiosInstance.put(
            API.ADMIN_USERS.TOGGLE_STATUS(id),
            {},
            { headers: getAdminHeaders() }
        );
        return response.data;
    },
};
