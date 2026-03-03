"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import GiftForm, { GiftFormValues } from "../../GiftForm";
import { getGiftById, updateGift } from "@/lib/api/admin-gift.api";
import { useToast } from "@/app/components/Toast";

export default function EditGiftPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [initialValues, setInitialValues] = useState<Partial<GiftFormValues> | null>(null);
    const [initialImageUrl, setInitialImageUrl] = useState<string | undefined>();
    const router = useRouter();
    const params = useParams();
    const { showToast } = useToast();
    const giftId = params.id as string;

    useEffect(() => {
        const fetchGift = async () => {
            try {
                const result = await getGiftById(giftId);
                const gift = result.data;
                setInitialValues({
                    name: gift.name || "",
                    description: gift.description || "",
                    category: gift.category || "",
                    price: gift.price?.toString() || "",
                    tags: gift.tags?.join(", ") || "",
                    occasion: gift.occasion || [],
                    recipientType: gift.recipientType || "",
                    ageGroup: gift.ageGroup || "",
                    relationshipType: gift.relationshipType || "",
                    interests: gift.interests?.join(", ") || "",
                    rating: gift.rating?.toString() || "",
                    stock: gift.stock?.toString() || "",
                    isAvailable: gift.isAvailable ?? true,
                    popularityScore: gift.popularityScore?.toString() || "",
                });
                if (gift.imageUrl) {
                    setInitialImageUrl(
                        gift.imageUrl.startsWith("http")
                            ? gift.imageUrl
                            : `http://localhost:5000${gift.imageUrl}`
                    );
                }
            } catch (err: any) {
                showToast("Failed to load gift", "error");
                router.push("/admin/gifts");
            } finally {
                setLoading(false);
            }
        };
        fetchGift();
    }, [giftId, router, showToast]);

    const handleSubmit = async (values: GiftFormValues, imageFile?: File) => {
        setIsSubmitting(true);
        try {
            await updateGift(
                giftId,
                {
                    name: values.name.trim(),
                    description: values.description.trim(),
                    category: values.category,
                    price: Number(values.price),
                    tags: values.tags ? values.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
                    occasion: values.occasion.length > 0 ? values.occasion : undefined,
                    recipientType: values.recipientType || undefined,
                    ageGroup: values.ageGroup || undefined,
                    relationshipType: values.relationshipType || undefined,
                    interests: values.interests ? values.interests.split(",").map((t) => t.trim()).filter(Boolean) : undefined,
                    rating: values.rating ? Number(values.rating) : undefined,
                    stock: values.stock ? Number(values.stock) : undefined,
                    isAvailable: values.isAvailable,
                    popularityScore: values.popularityScore ? Number(values.popularityScore) : undefined,
                },
                imageFile
            );
            showToast("Gift updated successfully!", "success");
            router.push("/admin/gifts");
        } catch (err: any) {
            showToast(err?.response?.data?.message || "Failed to update gift", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/gifts" className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Edit Gift</h1>
                    <p className="text-sm text-gray-500 mt-1">Update gift details</p>
                </div>
            </div>

            {initialValues && (
                <GiftForm
                    initialValues={initialValues}
                    initialImageUrl={initialImageUrl}
                    onSubmit={handleSubmit}
                    submitLabel="Update Gift"
                    isSubmitting={isSubmitting}
                />
            )}
        </div>
    );
}
