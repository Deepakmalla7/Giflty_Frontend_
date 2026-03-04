"use client";

import { useState } from "react";
import { Heart, Trash2, ShoppingCart, Gift, Search } from "lucide-react";

interface WishlistItem {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    addedAt: string;
    inStock: boolean;
}

const dummyWishlist: WishlistItem[] = [
    {
        id: "1",
        name: "Premium Gift Box",
        price: 49.99,
        image: "",
        category: "Gift Boxes",
        addedAt: "2025-01-20",
        inStock: true,
    },
    {
        id: "2",
        name: "Luxury Chocolate Set",
        price: 35.00,
        image: "",
        category: "Food & Treats",
        addedAt: "2025-01-18",
        inStock: true,
    },
    {
        id: "3",
        name: "Personalized Photo Frame",
        price: 25.99,
        image: "",
        category: "Personalized",
        addedAt: "2025-01-15",
        inStock: false,
    },
    {
        id: "4",
        name: "Scented Candle Collection",
        price: 42.50,
        image: "",
        category: "Home & Living",
        addedAt: "2025-01-12",
        inStock: true,
    },
];

export default function WishlistPage() {
    const [wishlist, setWishlist] = useState<WishlistItem[]>(dummyWishlist);
    const [search, setSearch] = useState("");

    const filtered = wishlist.filter(
        (item) =>
            item.name.toLowerCase().includes(search.toLowerCase()) ||
            item.category.toLowerCase().includes(search.toLowerCase())
    );

    const removeItem = (id: string) => {
        setWishlist((prev) => prev.filter((item) => item.id !== id));
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                        <Heart className="w-8 h-8 text-red-500" />
                        My Wishlist
                    </h1>
                    <p className="text-gray-500 mt-1">{wishlist.length} items saved</p>
                </div>
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search wishlist..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                </div>
            </div>

            {filtered.length === 0 ? (
                <div className="text-center py-16">
                    <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">
                        {search ? "No matching items" : "Your wishlist is empty"}
                    </h3>
                    <p className="text-gray-400 mb-6">
                        {search
                            ? "Try a different search term"
                            : "Browse gifts and add your favorites here!"}
                    </p>
                    {!search && (
                        <a
                            href="/dashboard/gifts"
                            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-2.5 rounded-lg hover:bg-emerald-700 transition font-medium"
                        >
                            <Gift className="w-4 h-4" />
                            Browse Gifts
                        </a>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                        >
                            {/* Image placeholder */}
                            <div className="h-48 bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center">
                                <Gift className="w-16 h-16 text-emerald-300" />
                            </div>

                            <div className="p-5">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                                        <p className="text-sm text-gray-500">{item.category}</p>
                                    </div>
                                    <span className="text-lg font-bold text-emerald-600">
                                        ${item.price.toFixed(2)}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between mt-4">
                                    <span
                                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                                            item.inStock
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                        }`}
                                    >
                                        {item.inStock ? "In Stock" : "Out of Stock"}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        Added {item.addedAt}
                                    </span>
                                </div>

                                <div className="flex gap-2 mt-4">
                                    <button
                                        disabled={!item.inStock}
                                        className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition text-sm font-medium"
                                    >
                                        <ShoppingCart className="w-4 h-4" />
                                        Add to Cart
                                    </button>
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="p-2 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition"
                                        title="Remove from wishlist"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
