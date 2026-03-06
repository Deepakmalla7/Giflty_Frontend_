import axiosInstance from "./axios";
import { API } from "./endpoints";

// Helper to get admin auth token from localStorage
const getAdminHeaders = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export interface AdminReviewData {
    _id: string;
    userId: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        profilePicture?: string;
    };
    giftId?: {
        _id: string;
        name: string;
        imageUrl?: string;
        category: string;
        price: number;
    } | null;
    rating: number;
    comment: string;
    status: "pending" | "approved" | "rejected";
    createdAt: string;
    updatedAt: string;
}

export interface ReviewStats {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    avgRating: number;
}

export interface ReviewFilterParams {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
}

export interface PaginatedReviewResponse {
    success: boolean;
    data: AdminReviewData[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

// Get all reviews with filters (admin)
export async function adminGetAllReviews(params?: ReviewFilterParams): Promise<PaginatedReviewResponse> {
    const res = await axiosInstance.get(API.REVIEWS.BASE, {
        headers: getAdminHeaders(),
        params,
    });
    return res.data;
}

// Get review stats (admin)
export async function adminGetReviewStats(): Promise<ReviewStats> {
    const res = await axiosInstance.get(API.REVIEWS.STATS, {
        headers: getAdminHeaders(),
    });
    return res.data.data;
}

// Get single review (admin)
export async function adminGetReviewById(id: string): Promise<AdminReviewData> {
    const res = await axiosInstance.get(API.REVIEWS.BY_ID(id), {
        headers: getAdminHeaders(),
    });
    return res.data.data;
}

// Approve a review (admin)
export async function adminApproveReview(id: string) {
    const res = await axiosInstance.put(
        API.REVIEWS.STATUS(id),
        { status: "approved" },
        { headers: getAdminHeaders() }
    );
    return res.data;
}

// Reject a review (admin)
export async function adminRejectReview(id: string) {
    const res = await axiosInstance.put(
        API.REVIEWS.STATUS(id),
        { status: "rejected" },
        { headers: getAdminHeaders() }
    );
    return res.data;
}

// Delete a review (admin)
export async function adminDeleteReview(id: string) {
    const res = await axiosInstance.delete(API.REVIEWS.BY_ID(id), {
        headers: getAdminHeaders(),
    });
    return res.data;
}
