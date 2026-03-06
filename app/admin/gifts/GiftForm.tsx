"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, X, ImageIcon } from "lucide-react";

const CATEGORIES = ["electronics", "clothing", "books", "toys", "home", "beauty", "sports", "food", "other"];
const OCCASIONS = ["birthday", "anniversary", "wedding", "christmas", "valentine", "graduation", "other"];
const RECIPIENT_TYPES = ["male", "female", "unisex", "child", "teen", "adult", "senior"];
const AGE_GROUPS = ["0-12", "13-17", "18-25", "26-35", "36-50", "51+"];
const RELATIONSHIP_TYPES = ["friend", "partner", "parent", "sibling", "colleague", "child", "other"];

export interface GiftFormValues {
    name: string;
    description: string;
    category: string;
    price: string;
    tags: string;
    occasion: string[];
    recipientType: string;
    ageGroup: string;
    relationshipType: string;
    interests: string;
    rating: string;
    stock: string;
    isAvailable: boolean;
    popularityScore: string;
}

interface GiftFormProps {
    initialValues?: Partial<GiftFormValues>;
    initialImageUrl?: string;
    onSubmit: (values: GiftFormValues, imageFile?: File) => Promise<void>;
    submitLabel: string;
    isSubmitting: boolean;
}

const defaultValues: GiftFormValues = {
    name: "",
    description: "",
    category: "",
    price: "",
    tags: "",
    occasion: [],
    recipientType: "",
    ageGroup: "",
    relationshipType: "",
    interests: "",
    rating: "",
    stock: "",
    isAvailable: true,
    popularityScore: "",
};

export default function GiftForm({ initialValues, initialImageUrl, onSubmit, submitLabel, isSubmitting }: GiftFormProps) {
    const [form, setForm] = useState<GiftFormValues>({ ...defaultValues, ...initialValues });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(initialImageUrl || null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const fileRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (initialValues) {
            setForm({ ...defaultValues, ...initialValues });
        }
        if (initialImageUrl) {
            setImagePreview(initialImageUrl);
        }
    }, [initialValues, initialImageUrl]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === "checkbox") {
            setForm((f) => ({ ...f, [name]: (e.target as HTMLInputElement).checked }));
        } else {
            setForm((f) => ({ ...f, [name]: value }));
        }
        if (errors[name]) setErrors((e) => ({ ...e, [name]: "" }));
    };

    const handleOccasionToggle = (occ: string) => {
        setForm((f) => ({
            ...f,
            occasion: f.occasion.includes(occ) ? f.occasion.filter((o) => o !== occ) : [...f.occasion, occ],
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            setErrors((e) => ({ ...e, image: "Only image files are allowed" }));
            return;
        }
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
        setErrors((e) => ({ ...e, image: "" }));
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
        if (fileRef.current) fileRef.current.value = "";
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!form.name.trim()) newErrors.name = "Name is required";
        if (!form.description.trim()) newErrors.description = "Description is required";
        if (!form.category) newErrors.category = "Category is required";
        if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) newErrors.price = "Valid price is required";
        if (form.rating && (isNaN(Number(form.rating)) || Number(form.rating) < 0 || Number(form.rating) > 5)) newErrors.rating = "Rating must be 0-5";
        if (form.stock && (isNaN(Number(form.stock)) || Number(form.stock) < 0)) newErrors.stock = "Stock must be a positive number";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        await onSubmit(form, imageFile || undefined);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info */}
            <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 ${errors.name ? "border-red-400" : "border-gray-300"}`}
                            placeholder="Gift name"
                        />
                        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows={3}
                            className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 ${errors.description ? "border-red-400" : "border-gray-300"}`}
                            placeholder="Gift description"
                        />
                        {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 ${errors.category ? "border-red-400" : "border-gray-300"}`}
                        >
                            <option value="">Select Category</option>
                            {CATEGORIES.map((c) => (
                                <option key={c} value={c}>
                                    {c.charAt(0).toUpperCase() + c.slice(1)}
                                </option>
                            ))}
                        </select>
                        {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Price ($) <span className="text-red-500">*</span>
                        </label>
                        <input
                            name="price"
                            type="number"
                            step="0.01"
                            min="0"
                            value={form.price}
                            onChange={handleChange}
                            className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 ${errors.price ? "border-red-400" : "border-gray-300"}`}
                            placeholder="0.00"
                        />
                        {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                        <input
                            name="stock"
                            type="number"
                            min="0"
                            value={form.stock}
                            onChange={handleChange}
                            className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 ${errors.stock ? "border-red-400" : "border-gray-300"}`}
                            placeholder="0"
                        />
                        {errors.stock && <p className="text-xs text-red-500 mt-1">{errors.stock}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rating (0-5)</label>
                        <input
                            name="rating"
                            type="number"
                            step="0.1"
                            min="0"
                            max="5"
                            value={form.rating}
                            onChange={handleChange}
                            className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 ${errors.rating ? "border-red-400" : "border-gray-300"}`}
                            placeholder="0"
                        />
                        {errors.rating && <p className="text-xs text-red-500 mt-1">{errors.rating}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                        <input
                            name="tags"
                            value={form.tags}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                            placeholder="Comma-separated: luxury, premium, ..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Interests</label>
                        <input
                            name="interests"
                            value={form.interests}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                            placeholder="Comma-separated: tech, music, ..."
                        />
                    </div>

                    <div className="flex items-center gap-3 pt-6">
                        <input
                            type="checkbox"
                            name="isAvailable"
                            checked={form.isAvailable}
                            onChange={handleChange}
                            id="isAvailable"
                            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                        <label htmlFor="isAvailable" className="text-sm font-medium text-gray-700">
                            Available for purchase
                        </label>
                    </div>
                </div>
            </section>

            {/* Target Audience */}
            <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Target Audience</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Type</label>
                        <select
                            name="recipientType"
                            value={form.recipientType}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">Select</option>
                            {RECIPIENT_TYPES.map((r) => (
                                <option key={r} value={r}>
                                    {r.charAt(0).toUpperCase() + r.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Age Group</label>
                        <select
                            name="ageGroup"
                            value={form.ageGroup}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">Select</option>
                            {AGE_GROUPS.map((a) => (
                                <option key={a} value={a}>{a}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                        <select
                            name="relationshipType"
                            value={form.relationshipType}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">Select</option>
                            {RELATIONSHIP_TYPES.map((r) => (
                                <option key={r} value={r}>
                                    {r.charAt(0).toUpperCase() + r.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Occasions</label>
                    <div className="flex flex-wrap gap-2">
                        {OCCASIONS.map((occ) => (
                            <button
                                key={occ}
                                type="button"
                                onClick={() => handleOccasionToggle(occ)}
                                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                                    form.occasion.includes(occ)
                                        ? "bg-indigo-100 border-indigo-300 text-indigo-700"
                                        : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
                                }`}
                            >
                                {occ.charAt(0).toUpperCase() + occ.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Image Upload */}
            <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Image</h2>
                {imagePreview ? (
                    <div className="relative inline-block">
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-48 h-48 object-cover rounded-lg border"
                        />
                        <button
                            type="button"
                            onClick={removeImage}
                            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <div
                        onClick={() => fileRef.current?.click()}
                        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-indigo-400 transition-colors"
                    >
                        <ImageIcon className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Click to upload an image</p>
                        <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 100MB</p>
                    </div>
                )}
                <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                />
                {errors.image && <p className="text-xs text-red-500 mt-2">{errors.image}</p>}
            </section>

            {/* Submit */}
            <div className="flex items-center gap-4">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isSubmitting ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Upload className="w-4 h-4" />
                            {submitLabel}
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
