import axiosInstance from "./axios";
import { API } from "./endpoints";

// Helper to get admin auth token from localStorage
const getAdminHeaders = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export interface GiftFormData {
    name: string;
    description: string;
    category: string;
    price: number;
    imageUrl?: string;
    tags?: string[];
    occasion?: string[];
    recipientType?: string;
    ageGroup?: string;
    relationshipType?: string;
    interests?: string[];
    rating?: number;
    stock?: number;
    isAvailable?: boolean;
    popularityScore?: number;
}

export interface GiftFilterParams {
    search?: string;
    category?: string;
    occasion?: string;
    minPrice?: number;
    maxPrice?: number;
    isAvailable?: boolean;
    tags?: string;
    page?: number;
    limit?: number;
}

export interface PaginatedResponse<T> {
    success: boolean;
    message: string;
    data: T[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface GiftStats {
    totalGifts: number;
    availableGifts: number;
    outOfStock: number;
    avgPrice: number;
    categories: number;
}

// Get all gifts with filters and pagination
export const getAdminGifts = async (params: GiftFilterParams = {}) => {
    const response = await axiosInstance.get<PaginatedResponse<any>>(API.GIFTS.FILTER, {
        params,
        headers: getAdminHeaders(),
    });
    return response.data;
};

// Get gift by ID
export const getGiftById = async (id: string) => {
    const response = await axiosInstance.get(API.GIFTS.BY_ID(id), {
        headers: getAdminHeaders(),
    });
    return response.data;
};

// Create gift (with optional image upload)
export const createGift = async (data: GiftFormData, imageFile?: File) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            if (Array.isArray(value)) {
                formData.append(key, value.join(","));
            } else {
                formData.append(key, String(value));
            }
        }
    });

    if (imageFile) {
        formData.append("image", imageFile);
    }

    const headers = {
        ...getAdminHeaders(),
        "Content-Type": "multipart/form-data",
    };

    const response = await axiosInstance.post(API.GIFTS.BASE, formData, { headers });
    return response.data;
};

// Update gift
export const updateGift = async (id: string, data: Partial<GiftFormData>, imageFile?: File) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            if (Array.isArray(value)) {
                formData.append(key, value.join(","));
            } else {
                formData.append(key, String(value));
            }
        }
    });

    if (imageFile) {
        formData.append("image", imageFile);
    }

    const headers = {
        ...getAdminHeaders(),
        "Content-Type": "multipart/form-data",
    };

    const response = await axiosInstance.put(API.GIFTS.BY_ID(id), formData, { headers });
    return response.data;
};

// Soft delete gift
export const deleteGift = async (id: string) => {
    const response = await axiosInstance.delete(API.GIFTS.BY_ID(id), {
        headers: getAdminHeaders(),
    });
    return response.data;
};

// Permanently delete gift
export const permanentDeleteGift = async (id: string) => {
    const response = await axiosInstance.delete(API.GIFTS.PERMANENT_DELETE(id), {
        headers: getAdminHeaders(),
    });
    return response.data;
};

// Restore soft-deleted gift
export const restoreGift = async (id: string) => {
    const response = await axiosInstance.patch(API.GIFTS.RESTORE(id), {}, {
        headers: getAdminHeaders(),
    });
    return response.data;
};

// Get gift stats
export const getGiftStats = async () => {
    const response = await axiosInstance.get(API.GIFTS.STATS, {
        headers: getAdminHeaders(),
    });
    return response.data;
};

// Admin login (uses existing user login endpoint)
export const adminLogin = async (email: string, password: string) => {
    const response = await axiosInstance.post(API.AUTH.LOGIN, { email, password });
    return response.data;
};
