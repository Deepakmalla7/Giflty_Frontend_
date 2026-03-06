"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
    Plus,
    Search,
    ChevronLeft,
    ChevronRight,
    Eye,
    Pencil,
    Trash2,
    RotateCcw,
    Filter,
    Package,
} from "lucide-react";
import { getAdminGifts, deleteGift, restoreGift } from "@/lib/api/admin-gift.api";
import { useToast } from "@/app/components/Toast";

const CATEGORIES = ["electronics", "clothing", "books", "toys", "home", "beauty", "sports", "food", "other"];
const OCCASIONS = ["birthday", "anniversary", "wedding", "christmas", "valentine", "graduation", "other"];

interface Gift {
    _id: string;
    name: string;
    description: string;
    category: string;
    price: number;
    imageUrl?: string;
    tags: string[];
    occasion?: string[];
    isAvailable: boolean;
    isDeleted?: boolean;
    stock?: number;
    createdAt: string;
}

export default function AdminGiftsPage() {
    const [gifts, setGifts] = useState<Gift[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [occasion, setOccasion] = useState("");
    const [availability, setAvailability] = useState("");
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 0 });
    const [showFilters, setShowFilters] = useState(false);
    const { showToast } = useToast();

    const fetchGifts = useCallback(async () => {
        setLoading(true);
        try {
            const params: Record<string, any> = { page, limit };
            if (search.trim()) params.search = search.trim();
            if (category) params.category = category;
            if (occasion) params.occasion = occasion;
            if (availability === "true" || availability === "false") params.isAvailable = availability;

            const result = await getAdminGifts(params);
            setGifts(result.data || []);
            setPagination(result.pagination || { total: 0, page: 1, limit: 10, totalPages: 0 });
        } catch (err: any) {
            showToast(err?.response?.data?.message || "Failed to load gifts", "error");
        } finally {
            setLoading(false);
        }
    }, [page, limit, search, category, occasion, availability, showToast]);

    useEffect(() => {
        fetchGifts();
    }, [fetchGifts]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchGifts();
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
        try {
            await deleteGift(id);
            showToast(`"${name}" deleted successfully`, "success");
            fetchGifts();
        } catch (err: any) {
            showToast(err?.response?.data?.message || "Failed to delete gift", "error");
        }
    };

    const handleRestore = async (id: string, name: string) => {
        try {
            await restoreGift(id);
            showToast(`"${name}" restored successfully`, "success");
            fetchGifts();
        } catch (err: any) {
            showToast(err?.response?.data?.message || "Failed to restore gift", "error");
        }
    };

    const clearFilters = () => {
        setSearch("");
        setCategory("");
        setOccasion("");
        setAvailability("");
        setPage(1);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Gift Management</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {pagination.total} total gift{pagination.total !== 1 ? "s" : ""}
                    </p>
                </div>
                <Link
                    href="/admin/gifts/create"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Gift
                </Link>
            </div>

            {/* Search & Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <form onSubmit={handleSearch} className="flex gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search gifts by name, description, or category..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowFilters(!showFilters)}
                        className={`inline-flex items-center gap-2 px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${
                            showFilters
                                ? "bg-indigo-50 border-indigo-300 text-indigo-700"
                                : "border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                        <Filter className="w-4 h-4" />
                        Filters
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
                    >
                        Search
                    </button>
                </form>

                {showFilters && (
                    <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
                            <select
                                value={category}
                                onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                                className="w-full border border-gray-300 rounded-lg text-sm px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="">All Categories</option>
                                {CATEGORIES.map((c) => (
                                    <option key={c} value={c}>
                                        {c.charAt(0).toUpperCase() + c.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Occasion</label>
                            <select
                                value={occasion}
                                onChange={(e) => { setOccasion(e.target.value); setPage(1); }}
                                className="w-full border border-gray-300 rounded-lg text-sm px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="">All Occasions</option>
                                {OCCASIONS.map((o) => (
                                    <option key={o} value={o}>
                                        {o.charAt(0).toUpperCase() + o.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Availability</label>
                            <select
                                value={availability}
                                onChange={(e) => { setAvailability(e.target.value); setPage(1); }}
                                className="w-full border border-gray-300 rounded-lg text-sm px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="">All</option>
                                <option value="true">Available</option>
                                <option value="false">Unavailable</option>
                            </select>
                        </div>
                        <div className="sm:col-span-3">
                            <button
                                onClick={clearFilters}
                                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                            >
                                Clear all filters
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
                    </div>
                ) : gifts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                        <Package className="w-12 h-12 mb-3 text-gray-300" />
                        <p className="text-lg font-medium">No gifts found</p>
                        <p className="text-sm mt-1">Try adjusting your filters or add a new gift.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Gift
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Price
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Stock
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {gifts.map((gift) => (
                                    <tr key={gift._id} className={`hover:bg-gray-50 ${gift.isDeleted ? "opacity-60" : ""}`}>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                {gift.imageUrl ? (
                                                    <img
                                                        src={
                                                            gift.imageUrl.startsWith("http")
                                                                ? gift.imageUrl
                                                                : `http://localhost:5000${gift.imageUrl}`
                                                        }
                                                        alt={gift.name}
                                                        className="w-10 h-10 rounded-lg object-cover border"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                                        <Package className="w-5 h-5 text-gray-400" />
                                                    </div>
                                                )}
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                                                        {gift.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500 truncate max-w-[200px]">
                                                        {gift.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 capitalize">
                                                {gift.category}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                                            ${gift.price?.toFixed(2)}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {gift.stock ?? "-"}
                                        </td>
                                        <td className="px-4 py-3">
                                            {gift.isDeleted ? (
                                                <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                                    Deleted
                                                </span>
                                            ) : gift.isAvailable ? (
                                                <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                    Available
                                                </span>
                                            ) : (
                                                <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                                                    Unavailable
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link
                                                    href={`/admin/gifts/${gift._id}`}
                                                    className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                                                    title="View"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                                {!gift.isDeleted && (
                                                    <>
                                                        <Link
                                                            href={`/admin/gifts/${gift._id}/edit`}
                                                            className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-blue-600"
                                                            title="Edit"
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(gift._id, gift.name)}
                                                            className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-red-600"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
                                                {gift.isDeleted && (
                                                    <button
                                                        onClick={() => handleRestore(gift._id, gift.name)}
                                                        className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-green-600"
                                                        title="Restore"
                                                    >
                                                        <RotateCcw className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
                        <p className="text-sm text-gray-600">
                            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                            {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
                            {pagination.total} results
                        </p>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page <= 1}
                                className="p-1.5 rounded-md border border-gray-300 text-gray-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                const start = Math.max(1, Math.min(page - 2, pagination.totalPages - 4));
                                const pageNum = start + i;
                                if (pageNum > pagination.totalPages) return null;
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setPage(pageNum)}
                                        className={`w-8 h-8 rounded-md text-sm font-medium ${
                                            pageNum === page
                                                ? "bg-indigo-600 text-white"
                                                : "border border-gray-300 text-gray-600 hover:bg-white"
                                        }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                            <button
                                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                                disabled={page >= pagination.totalPages}
                                className="p-1.5 rounded-md border border-gray-300 text-gray-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
