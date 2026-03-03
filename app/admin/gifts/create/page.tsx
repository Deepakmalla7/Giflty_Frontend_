"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import GiftForm, { GiftFormValues } from "../GiftForm";
import { createGift } from "@/lib/api/admin-gift.api";
import { useToast } from "@/app/components/Toast";

export default function CreateGiftPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const { showToast } = useToast();

    const handleSubmit = async (values: GiftFormValues, imageFile?: File) => {
        setIsSubmitting(true);
        try {
            await createGift(
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
            showToast("Gift created successfully!", "success");
            router.push("/admin/gifts");
        } catch (err: any) {
            showToast(err?.response?.data?.message || "Failed to create gift", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/gifts"
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Create Gift</h1>
                    <p className="text-sm text-gray-500 mt-1">Add a new gift to the catalog</p>
                </div>
            </div>

            <GiftForm onSubmit={handleSubmit} submitLabel="Create Gift" isSubmitting={isSubmitting} />
        </div>
    );
}
