"use client";

import { useState, useEffect, useCallback } from "react";
import { Star, Send, Gift, Loader2, CheckCircle, AlertCircle, ChevronDown } from "lucide-react";
import { submitReview, getMyReviews, type ReviewData, type CreateReviewData } from "@/lib/api/review.api";
import axiosInstance from "@/lib/api/axios";

interface GiftOption {
    _id: string;
    name: string;
    category: string;
}

export default function FeedbackPage() {
    // Form state
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");
    const [selectedGiftId, setSelectedGiftId] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formMessage, setFormMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    // Data state
    const [myReviews, setMyReviews] = useState<ReviewData[]>([]);
    const [gifts, setGifts] = useState<GiftOption[]>([]);
    const [loadingReviews, setLoadingReviews] = useState(true);
    const [activeTab, setActiveTab] = useState<"write" | "my-reviews">("write");

    // Load user's existing reviews
    const loadMyReviews = useCallback(async () => {
        try {
            setLoadingReviews(true);
            const data = await getMyReviews();
            setMyReviews(data);
        } catch (err) {
            console.error("Failed to load reviews:", err);
        } finally {
            setLoadingReviews(false);
        }
    }, []);

    // Load gifts for dropdown
    const loadGifts = useCallback(async () => {
        try {
            const res = await axiosInstance.get("/api/gifts?limit=100");
            const raw = res.data?.data || res.data || [];
            setGifts(
                raw.map((g: any) => ({
                    _id: g._id,
                    name: g.name,
                    category: g.category,
                }))
            );
        } catch (err) {
            console.error("Failed to load gifts:", err);
        }
    }, []);

    useEffect(() => {
        loadMyReviews();
        loadGifts();
    }, [loadMyReviews, loadGifts]);

    const resetForm = () => {
        setRating(0);
        setHoverRating(0);
        setComment("");
        setSelectedGiftId("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormMessage(null);

        if (rating === 0) {
            setFormMessage({ type: "error", text: "Please select a star rating." });
            return;
        }
        if (comment.trim().length < 3) {
            setFormMessage({ type: "error", text: "Comment must be at least 3 characters." });
            return;
        }

        setIsSubmitting(true);
        try {
            const payload: CreateReviewData = {
                rating,
                comment: comment.trim(),
            };
            if (selectedGiftId) {
                payload.giftId = selectedGiftId;
            }

            const res = await submitReview(payload);
            setFormMessage({ type: "success", text: res.message || "Review submitted successfully!" });
            resetForm();
            // Refresh the list
            loadMyReviews();
        } catch (err: any) {
            const msg =
                err?.response?.data?.message ||
                err?.response?.data?.errors?.[0]?.message ||
                "Failed to submit review. Please try again.";
            setFormMessage({ type: "error", text: msg });
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStars = (count: number, size = "w-5 h-5") => (
        <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
                <Star
                    key={i}
                    className={`${size} ${i < count ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                />
            ))}
        </div>
    );

    const statusColors: Record<string, string> = {
        pending: "bg-yellow-100 text-yellow-700",
        approved: "bg-green-100 text-green-700",
        rejected: "bg-red-100 text-red-700",
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Feedback & Reviews</h1>
            <p className="text-gray-500 mb-6">Share your experience or review a gift</p>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
                <button
                    onClick={() => setActiveTab("write")}
                    className={`px-5 py-3 text-sm font-medium border-b-2 transition ${
                        activeTab === "write"
                            ? "border-emerald-600 text-emerald-600"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                >
                    Write a Review
                </button>
                <button
                    onClick={() => setActiveTab("my-reviews")}
                    className={`px-5 py-3 text-sm font-medium border-b-2 transition ${
                        activeTab === "my-reviews"
                            ? "border-emerald-600 text-emerald-600"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                >
                    My Reviews ({myReviews.length})
                </button>
            </div>

            {/* ── Write Review Tab ── */}
            {activeTab === "write" && (
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Submit Your Feedback</h2>

                    {formMessage && (
                        <div
                            className={`flex items-center gap-2 p-3 rounded-lg mb-4 text-sm ${
                                formMessage.type === "success"
                                    ? "bg-green-50 text-green-700 border border-green-200"
                                    : "bg-red-50 text-red-700 border border-red-200"
                            }`}
                        >
                            {formMessage.type === "success" ? (
                                <CheckCircle className="w-4 h-4 shrink-0" />
                            ) : (
                                <AlertCircle className="w-4 h-4 shrink-0" />
                            )}
                            {formMessage.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Star Rating */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Rating <span className="text-red-500">*</span>
                            </label>
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        className="p-0.5 transition-transform hover:scale-110"
                                    >
                                        <Star
                                            className={`w-8 h-8 transition-colors ${
                                                star <= (hoverRating || rating)
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "text-gray-300"
                                            }`}
                                        />
                                    </button>
                                ))}
                                {rating > 0 && (
                                    <span className="ml-3 text-sm text-gray-500">
                                        {rating === 1 && "Poor"}
                                        {rating === 2 && "Fair"}
                                        {rating === 3 && "Good"}
                                        {rating === 4 && "Very Good"}
                                        {rating === 5 && "Excellent"}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Gift Selector (Optional) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Related Gift <span className="text-gray-400">(optional)</span>
                            </label>
                            <div className="relative">
                                <Gift className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <select
                                    value={selectedGiftId}
                                    onChange={(e) => setSelectedGiftId(e.target.value)}
                                    className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm appearance-none bg-white"
                                >
                                    <option value="">General Feedback (no specific gift)</option>
                                    {gifts.map((g) => (
                                        <option key={g._id} value={g._id}>
                                            {g.name} — {g.category}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Comment */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Your Review <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Tell us about your experience..."
                                rows={4}
                                maxLength={1000}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm resize-none"
                            />
                            <p className="text-xs text-gray-400 mt-1 text-right">
                                {comment.length}/1000
                            </p>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isSubmitting || rating === 0}
                            className="flex items-center justify-center gap-2 w-full sm:w-auto bg-emerald-600 text-white px-6 py-2.5 rounded-lg hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition font-medium text-sm"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    Submit Review
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-xs text-gray-400 mt-4">
                        Your review will be visible after admin approval.
                    </p>
                </div>
            )}

            {/* ── My Reviews Tab ── */}
            {activeTab === "my-reviews" && (
                <div>
                    {loadingReviews ? (
                        <div className="flex justify-center py-16">
                            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                        </div>
                    ) : myReviews.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                            <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <h3 className="font-medium text-gray-600 mb-1">No reviews yet</h3>
                            <p className="text-sm text-gray-400 mb-4">
                                You haven&apos;t submitted any reviews yet.
                            </p>
                            <button
                                onClick={() => setActiveTab("write")}
                                className="text-sm text-emerald-600 font-medium hover:underline"
                            >
                                Write your first review
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {myReviews.map((review) => {
                                const gift = typeof review.giftId === "object" && review.giftId ? review.giftId : null;
                                return (
                                    <div
                                        key={review._id}
                                        className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                                            <div className="flex items-center gap-3">
                                                {renderStars(review.rating)}
                                                <span
                                                    className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${
                                                        statusColors[review.status] || "bg-gray-100 text-gray-600"
                                                    }`}
                                                >
                                                    {review.status}
                                                </span>
                                            </div>
                                            <span className="text-xs text-gray-400">
                                                {new Date(review.createdAt).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </span>
                                        </div>

                                        {gift && (
                                            <p className="text-sm text-gray-500 mb-2">
                                                <Gift className="w-3.5 h-3.5 inline mr-1" />
                                                {gift.name} — {gift.category}
                                            </p>
                                        )}

                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            {review.comment}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
