"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    Pencil,
    Trash2,
    RotateCcw,
    Package,
    Tag,
    DollarSign,
    Star,
    Calendar,
    Users,
    Heart,
} from "lucide-react";
import { getGiftById, deleteGift, restoreGift } from "@/lib/api/admin-gift.api";
import { useToast } from "@/app/components/Toast";

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
    relationshipType?: string;
    interests?: string[];
    rating?: number;
    stock?: number;
    isAvailable: boolean;
    isDeleted?: boolean;
    popularityScore?: number;
    createdAt: string;
    updatedAt: string;
}

export default function GiftDetailPage() {
    const [gift, setGift] = useState<Gift | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const params = useParams();
    const { showToast } = useToast();
    const giftId = params.id as string;

    useEffect(() => {
        const fetchGift = async () => {
            try {
                const result = await getGiftById(giftId);
                setGift(result.data);
            } catch (err: any) {
                showToast("Failed to load gift", "error");
                router.push("/admin/gifts");
            } finally {
                setLoading(false);
            }
        };
        fetchGift();
    }, [giftId, router, showToast]);

    const handleDelete = async () => {
        if (!gift || !confirm(`Are you sure you want to delete "${gift.name}"?`)) return;
        try {
            await deleteGift(giftId);
            showToast("Gift deleted", "success");
            router.push("/admin/gifts");
        } catch (err: any) {
            showToast("Failed to delete gift", "error");
        }
    };

    const handleRestore = async () => {
        if (!gift) return;
        try {
            await restoreGift(giftId);
            showToast("Gift restored", "success");
            setGift({ ...gift, isDeleted: false });
        } catch (err: any) {
            showToast("Failed to restore gift", "error");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
            </div>
        );
    }

    if (!gift) return null;

    const imageUrl = gift.imageUrl
        ? gift.imageUrl.startsWith("http") ? gift.imageUrl : `http://localhost:5000${gift.imageUrl}`
        : null;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/gifts" className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{gift.name}</h1>
                        <div className="flex items-center gap-2 mt-1">
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
                            <span className="text-sm text-gray-500 capitalize">{gift.category}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {gift.isDeleted ? (
                        <button
                            onClick={handleRestore}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Restore
                        </button>
                    ) : (
                        <>
                            <Link
                                href={`/admin/gifts/${gift._id}/edit`}
                                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-sm rounded-lg hover:bg-gray-50"
                            >
                                <Pencil className="w-4 h-4" />
                                Edit
                            </Link>
                            <button
                                onClick={handleDelete}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Image */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        {imageUrl ? (
                            <img src={imageUrl} alt={gift.name} className="w-full aspect-square object-cover" />
                        ) : (
                            <div className="w-full aspect-square bg-gray-100 flex items-center justify-center">
                                <Package className="w-16 h-16 text-gray-300" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Price & Stats */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-green-500" />
                                <div>
                                    <p className="text-xs text-gray-500">Price</p>
                                    <p className="text-lg font-bold text-gray-900">${gift.price?.toFixed(2)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Package className="w-5 h-5 text-blue-500" />
                                <div>
                                    <p className="text-xs text-gray-500">Stock</p>
                                    <p className="text-lg font-bold text-gray-900">{gift.stock ?? 0}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Star className="w-5 h-5 text-yellow-500" />
                                <div>
                                    <p className="text-xs text-gray-500">Rating</p>
                                    <p className="text-lg font-bold text-gray-900">{gift.rating ?? "-"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Heart className="w-5 h-5 text-pink-500" />
                                <div>
                                    <p className="text-xs text-gray-500">Popularity</p>
                                    <p className="text-lg font-bold text-gray-900">{gift.popularityScore ?? "-"}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-sm font-semibold text-gray-900 mb-2">Description</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{gift.description}</p>
                    </div>

                    {/* Tags & Occasions */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
                        {gift.tags && gift.tags.length > 0 && (
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1">
                                    <Tag className="w-4 h-4" /> Tags
                                </h3>
                                <div className="flex flex-wrap gap-1.5">
                                    {gift.tags.map((tag) => (
                                        <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {gift.occasion && gift.occasion.length > 0 && (
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1">
                                    <Calendar className="w-4 h-4" /> Occasions
                                </h3>
                                <div className="flex flex-wrap gap-1.5">
                                    {gift.occasion.map((occ) => (
                                        <span key={occ} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-xs capitalize">
                                            {occ}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {gift.interests && gift.interests.length > 0 && (
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 mb-2">Interests</h3>
                                <div className="flex flex-wrap gap-1.5">
                                    {gift.interests.map((interest) => (
                                        <span key={interest} className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-xs">
                                            {interest}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Target Audience */}
                    {(gift.recipientType || gift.ageGroup || gift.relationshipType) && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-1">
                                <Users className="w-4 h-4" /> Target Audience
                            </h3>
                            <div className="grid grid-cols-3 gap-4">
                                {gift.recipientType && (
                                    <div>
                                        <p className="text-xs text-gray-500">Recipient</p>
                                        <p className="text-sm font-medium text-gray-900 capitalize">{gift.recipientType}</p>
                                    </div>
                                )}
                                {gift.ageGroup && (
                                    <div>
                                        <p className="text-xs text-gray-500">Age Group</p>
                                        <p className="text-sm font-medium text-gray-900">{gift.ageGroup}</p>
                                    </div>
                                )}
                                {gift.relationshipType && (
                                    <div>
                                        <p className="text-xs text-gray-500">Relationship</p>
                                        <p className="text-sm font-medium text-gray-900 capitalize">{gift.relationshipType}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Metadata */}
                    <div className="text-xs text-gray-400 flex gap-4">
                        <p>Created: {new Date(gift.createdAt).toLocaleDateString()}</p>
                        <p>Updated: {new Date(gift.updatedAt).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
