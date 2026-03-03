"use client";

import { useState, useEffect, useCallback } from "react";
import { Star, Trash2, CheckCircle, XCircle, Search, Filter, Eye, Loader2, RefreshCw } from "lucide-react";
import {
    adminGetAllReviews,
    adminGetReviewStats,
    adminApproveReview,
    adminRejectReview,
    adminDeleteReview,
    type AdminReviewData,
    type ReviewStats,
} from "@/lib/api/admin-review.api";

export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState<AdminReviewData[]>([]);
    const [stats, setStats] = useState<ReviewStats>({ total: 0, pending: 0, approved: 0, rejected: 0, avgRating: 0 });
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [selectedReview, setSelectedReview] = useState<AdminReviewData | null>(null);
    const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const showToast = (type: "success" | "error", text: string) => {
        setToast({ type, text });
        setTimeout(() => setToast(null), 3500);
    };

    const loadReviews = useCallback(async () => {
        try {
            setLoading(true);
            const res = await adminGetAllReviews({
                status: statusFilter !== "all" ? statusFilter : undefined,
                search: search || undefined,
                page,
                limit: 15,
            });
            setReviews(res.data);
            setTotalPages(res.pagination.totalPages);
            setTotal(res.pagination.total);
        } catch (err) {
            console.error("Failed to load reviews:", err);
            showToast("error", "Failed to load reviews");
        } finally {
            setLoading(false);
        }
    }, [statusFilter, search, page]);

    const loadStats = useCallback(async () => {
        try {
            const data = await adminGetReviewStats();
            setStats(data);
        } catch (err) {
            console.error("Failed to load stats:", err);
        }
    }, []);

    useEffect(() => {
        loadReviews();
    }, [loadReviews]);

    useEffect(() => {
        loadStats();
    }, [loadStats]);

    // Reset page when filters change
    useEffect(() => {
        setPage(1);
    }, [search, statusFilter]);

    const handleApprove = async (id: string) => {
        setActionLoading(id);
        try {
            await adminApproveReview(id);
            showToast("success", "Review approved");
            loadReviews();
            loadStats();
            if (selectedReview?._id === id) setSelectedReview(null);
        } catch (err: any) {
            showToast("error", err?.response?.data?.message || "Failed to approve review");
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (id: string) => {
        setActionLoading(id);
        try {
            await adminRejectReview(id);
            showToast("success", "Review rejected");
            loadReviews();
            loadStats();
            if (selectedReview?._id === id) setSelectedReview(null);
        } catch (err: any) {
            showToast("error", err?.response?.data?.message || "Failed to reject review");
        } finally {
            setActionLoading(null);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to permanently delete this review?")) return;
        setActionLoading(id);
        try {
            await adminDeleteReview(id);
            showToast("success", "Review deleted");
            loadReviews();
            loadStats();
            if (selectedReview?._id === id) setSelectedReview(null);
        } catch (err: any) {
            showToast("error", err?.response?.data?.message || "Failed to delete review");
        } finally {
            setActionLoading(null);
        }
    };

    const renderStars = (rating: number) => (
        <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
                <Star
                    key={i}
                    className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                />
            ))}
        </div>
    );

    const statusBadge = (status: string) => {
        const styles: Record<string, string> = {
            approved: "bg-green-100 text-green-700",
            pending: "bg-yellow-100 text-yellow-700",
            rejected: "bg-red-100 text-red-700",
        };
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${styles[status] || "bg-gray-100 text-gray-600"}`}>
                {status}
            </span>
        );
    };

    const getUserName = (review: AdminReviewData) => {
        if (typeof review.userId === "object" && review.userId) {
            return `${review.userId.firstName} ${review.userId.lastName}`;
        }
        return "Unknown User";
    };

    const getUserEmail = (review: AdminReviewData) => {
        if (typeof review.userId === "object" && review.userId) {
            return review.userId.email;
        }
        return "";
    };

    const getGiftName = (review: AdminReviewData) => {
        if (typeof review.giftId === "object" && review.giftId) {
            return review.giftId.name;
        }
        return null;
    };

    return (
        <div>
            {/* Toast */}
            {toast && (
                <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium ${
                    toast.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
                }`}>
                    {toast.text}
                </div>
            )}

            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Reviews Management</h1>
                <button
                    onClick={() => { loadReviews(); loadStats(); }}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 transition"
                >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <p className="text-sm text-gray-500">Approved</p>
                    <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <p className="text-sm text-gray-500">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <p className="text-sm text-gray-500">Rejected</p>
                    <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <p className="text-sm text-gray-500">Avg Rating</p>
                    <p className="text-2xl font-bold text-gray-900">
                        {stats.avgRating} <Star className="w-5 h-5 inline fill-yellow-400 text-yellow-400" />
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search reviews..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="all">All Status</option>
                        <option value="approved">Approved</option>
                        <option value="pending">Pending</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            </div>

            {/* Reviews Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="flex justify-center py-16">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="text-center py-16 text-gray-500">
                        <Star className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                        <p>No reviews found.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gift</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {reviews.map((review) => (
                                    <tr key={review._id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <p className="text-sm font-medium text-gray-900">{getUserName(review)}</p>
                                            <p className="text-xs text-gray-500">{getUserEmail(review)}</p>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-700">
                                            {getGiftName(review) || <span className="text-gray-400 italic">General</span>}
                                        </td>
                                        <td className="px-4 py-3">{renderStars(review.rating)}</td>
                                        <td className="px-4 py-3 text-sm text-gray-500">
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3">{statusBadge(review.status)}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() => setSelectedReview(review)}
                                                    className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition"
                                                    title="View details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                {review.status === "pending" && (
                                                    <>
                                                        <button
                                                            onClick={() => handleApprove(review._id)}
                                                            disabled={actionLoading === review._id}
                                                            className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-md transition disabled:opacity-50"
                                                            title="Approve"
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(review._id)}
                                                            disabled={actionLoading === review._id}
                                                            className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-md transition disabled:opacity-50"
                                                            title="Reject"
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
                                                {review.status === "rejected" && (
                                                    <button
                                                        onClick={() => handleApprove(review._id)}
                                                        disabled={actionLoading === review._id}
                                                        className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-md transition disabled:opacity-50"
                                                        title="Re-approve"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(review._id)}
                                                    disabled={actionLoading === review._id}
                                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition disabled:opacity-50"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-gray-500">
                        Showing {reviews.length} of {total} reviews
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50 transition"
                        >
                            Previous
                        </button>
                        <span className="px-3 py-1.5 text-sm text-gray-600">
                            Page {page} of {totalPages}
                        </span>
                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50 transition"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* Review Detail Modal */}
            {selectedReview && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">{getUserName(selectedReview)}</h2>
                                <p className="text-sm text-gray-500">{getUserEmail(selectedReview)}</p>
                            </div>
                            {statusBadge(selectedReview.status)}
                        </div>
                        <div className="flex items-center gap-3 mb-4">
                            {renderStars(selectedReview.rating)}
                            <span className="text-sm text-gray-500">
                                {new Date(selectedReview.createdAt).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </span>
                        </div>
                        {getGiftName(selectedReview) && (
                            <p className="text-sm text-gray-500 mb-1">
                                Gift: <span className="font-medium text-gray-700">{getGiftName(selectedReview)}</span>
                            </p>
                        )}
                        <p className="text-gray-700 mt-3 leading-relaxed">{selectedReview.comment}</p>

                        <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-200">
                            {selectedReview.status === "pending" && (
                                <>
                                    <button
                                        onClick={() => handleApprove(selectedReview._id)}
                                        disabled={actionLoading === selectedReview._id}
                                        className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleReject(selectedReview._id)}
                                        disabled={actionLoading === selectedReview._id}
                                        className="px-4 py-2 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition disabled:opacity-50"
                                    >
                                        Reject
                                    </button>
                                </>
                            )}
                            {selectedReview.status === "rejected" && (
                                <button
                                    onClick={() => handleApprove(selectedReview._id)}
                                    disabled={actionLoading === selectedReview._id}
                                    className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                                >
                                    Re-approve
                                </button>
                            )}
                            <button
                                onClick={() => handleDelete(selectedReview._id)}
                                disabled={actionLoading === selectedReview._id}
                                className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => setSelectedReview(null)}
                                className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
