import axiosInstance from "./axios";
import { API } from "./endpoints";

// Helper to get user auth token from cookie
const getUserToken = () => {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(new RegExp(`(?:^|; )auth_token=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : null;
};

const getUserHeaders = () => {
    const token = getUserToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export interface CreateReviewData {
    giftId?: string;
    rating: number;
    comment: string;
}

export interface ReviewData {
    _id: string;
    userId: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        profilePicture?: string;
    } | string;
    giftId?: {
        _id: string;
        name: string;
        imageUrl?: string;
        category: string;
        price: number;
    } | string | null;
    rating: number;
    comment: string;
    status: "pending" | "approved" | "rejected";
    createdAt: string;
    updatedAt: string;
}

// Submit a new review (user)
export async function submitReview(data: CreateReviewData) {
    const res = await axiosInstance.post(API.REVIEWS.BASE, data, {
        headers: getUserHeaders(),
    });
    return res.data;
}

// Get current user's reviews
export async function getMyReviews(): Promise<ReviewData[]> {
    const res = await axiosInstance.get(API.REVIEWS.MY, {
        headers: getUserHeaders(),
    });
    return res.data.data;
}

// Get approved reviews for a specific gift (public)
export async function getGiftReviews(giftId: string): Promise<ReviewData[]> {
    const res = await axiosInstance.get(API.REVIEWS.GIFT(giftId));
    return res.data.data;
}
