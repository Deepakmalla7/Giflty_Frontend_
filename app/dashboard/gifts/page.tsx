"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import {
    Search,
    ChevronLeft,
    ChevronRight,
    Filter,
    Package,
    Star,
} from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

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
    recipientType?: string;
    ageGroup?: string;
    rating?: number;
    stock?: number;
    isAvailable: boolean;
}

export default function BrowseGiftsPage() {
    const [gifts, setGifts] = useState<Gift[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [occasion, setOccasion] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 12, totalPages: 0 });
    const [showFilters, setShowFilters] = useState(false);
    const [selectedGift, setSelectedGift] = useState<Gift | null>(null);

    const fetchGifts = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.set("page", String(page));
            params.set("limit", "12");
            params.set("isAvailable", "true");
            if (search.trim()) params.set("search", search.trim());
            if (category) params.set("category", category);
            if (occasion) params.set("occasion", occasion);
            if (minPrice) params.set("minPrice", minPrice);
            if (maxPrice) params.set("maxPrice", maxPrice);

            const response = await fetch(`${API_BASE_URL}/api/gifts/filter?${params.toString()}`);
            const result = await response.json();

            if (result.success) {
                setGifts(result.data || []);
                setPagination(result.pagination || { total: 0, page: 1, limit: 12, totalPages: 0 });
            }
        } catch (err) {
            console.error("Failed to fetch gifts:", err);
        } finally {
            setLoading(false);
        }
    }, [page, search, category, occasion, minPrice, maxPrice]);

    useEffect(() => {
        fetchGifts();
    }, [fetchGifts]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
    };

    const clearFilters = () => {
        setSearch("");
        setCategory("");
        setOccasion("");
        setMinPrice("");
        setMaxPrice("");
        setPage(1);
    };

    const getImageUrl = (gift: Gift) => {
        if (!gift.imageUrl) return null;
        if (gift.imageUrl.startsWith("http")) return gift.imageUrl;
        return `${API_BASE_URL}${gift.imageUrl}`;
    };

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Browse Gifts</h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Discover the perfect gift — filter by category, occasion, or price range
                </p>
            </div>

            {/* Search & Filter Bar */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 mb-6">
                <form onSubmit={handleSearch} className="flex gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search gifts..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowFilters(!showFilters)}
                        className={`inline-flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm font-medium transition-colors ${
                            showFilters
                                ? "bg-pink-50 border-pink-300 text-pink-700 dark:bg-pink-900/30 dark:border-pink-700 dark:text-pink-300"
                                : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`}
                    >
                        <Filter className="w-4 h-4" />
                        Filters
                    </button>
                    <button
                        type="submit"
                        className="px-5 py-2.5 bg-pink-500 hover:bg-pink-600 text-white text-sm rounded-lg font-medium transition-colors"
                    >
                        Search
                    </button>
                </form>

                {showFilters && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Category</label>
                            <select
                                value={category}
                                onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg text-sm px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500"
                            >
                                <option value="">All Categories</option>
                                {CATEGORIES.map((c) => (
                                    <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Occasion</label>
                            <select
                                value={occasion}
                                onChange={(e) => { setOccasion(e.target.value); setPage(1); }}
                                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg text-sm px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500"
                            >
                                <option value="">All Occasions</option>
                                {OCCASIONS.map((o) => (
                                    <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Min Price ($)</label>
                            <input
                                type="number"
                                min="0"
                                value={minPrice}
                                onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
                                placeholder="0"
                                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg text-sm px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Max Price ($)</label>
                            <input
                                type="number"
                                min="0"
                                value={maxPrice}
                                onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
                                placeholder="Any"
                                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg text-sm px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500"
                            />
                        </div>
                        <div className="sm:col-span-2 lg:col-span-4">
                            <button onClick={clearFilters} className="text-sm text-pink-600 hover:text-pink-800 font-medium">
                                Clear all filters
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Results count */}
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {pagination.total} gift{pagination.total !== 1 ? "s" : ""} found
            </p>

            {/* Gift Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-500" />
                </div>
            ) : gifts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-500 dark:text-gray-400">
                    <Package className="w-16 h-16 mb-4 text-gray-300 dark:text-gray-600" />
                    <p className="text-xl font-semibold">No gifts found</p>
                    <p className="text-sm mt-2">Try adjusting your filters or search terms.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {gifts.map((gift) => {
                        const imgUrl = getImageUrl(gift);
                        return (
                            <div
                                key={gift._id}
                                onClick={() => setSelectedGift(gift)}
                                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-lg transition-all cursor-pointer overflow-hidden group"
                            >
                                <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-700 overflow-hidden">
                                    {imgUrl ? (
                                        <img
                                            src={imgUrl}
                                            alt={gift.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Package className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                                        </div>
                                    )}
                                    {gift.occasion && gift.occasion.length > 0 && (
                                        <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
                                            {gift.occasion.slice(0, 2).map((occ) => (
                                                <span key={occ} className="px-2 py-0.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full text-xs font-medium text-pink-700 dark:text-pink-300 capitalize">
                                                    {occ}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <h3 className="font-bold text-gray-900 dark:text-white line-clamp-1 text-base">
                                            {gift.name}
                                        </h3>
                                        {gift.rating !== undefined && gift.rating > 0 && (
                                            <div className="flex items-center gap-0.5 text-yellow-500 shrink-0">
                                                <Star className="w-3.5 h-3.5 fill-current" />
                                                <span className="text-xs font-medium">{gift.rating}</span>
                                            </div>
                                        )}
                                    </div>
                                    <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-200 mb-2 capitalize">
                                        {gift.category}
                                    </span>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
                                        {gift.description}
                                    </p>
                                    <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                                        ${gift.price.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-8 bg-white dark:bg-gray-800 rounded-xl px-4 py-3 shadow-sm">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Page {pagination.page} of {pagination.totalPages}
                    </p>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page <= 1}
                            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
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
                                    className={`w-9 h-9 rounded-lg text-sm font-medium ${
                                        pageNum === page
                                            ? "bg-pink-500 text-white"
                                            : "border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                                    }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                        <button
                            onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                            disabled={page >= pagination.totalPages}
                            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Gift Detail Modal */}
            {selectedGift && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={() => setSelectedGift(null)}>
                    <div
                        className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {getImageUrl(selectedGift) ? (
                            <img
                                src={getImageUrl(selectedGift)!}
                                alt={selectedGift.name}
                                className="w-full h-64 object-cover rounded-t-2xl"
                            />
                        ) : (
                            <div className="w-full h-64 bg-gray-100 dark:bg-gray-700 flex items-center justify-center rounded-t-2xl">
                                <Package className="w-16 h-16 text-gray-300 dark:text-gray-600" />
                            </div>
                        )}
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-2">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedGift.name}</h2>
                                {selectedGift.rating !== undefined && selectedGift.rating > 0 && (
                                    <div className="flex items-center gap-1 text-yellow-500">
                                        <Star className="w-4 h-4 fill-current" />
                                        <span className="text-sm font-medium">{selectedGift.rating}</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-2 mb-3">
                                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-200 capitalize">
                                    {selectedGift.category}
                                </span>
                                {selectedGift.occasion?.map((occ) => (
                                    <span key={occ} className="px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200 capitalize">
                                        {occ}
                                    </span>
                                ))}
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 leading-relaxed">{selectedGift.description}</p>
                            {selectedGift.tags && selectedGift.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mb-4">
                                    {selectedGift.tags.map((tag) => (
                                        <span key={tag} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                    ${selectedGift.price.toFixed(2)}
                                </p>
                                <button
                                    onClick={() => setSelectedGift(null)}
                                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
