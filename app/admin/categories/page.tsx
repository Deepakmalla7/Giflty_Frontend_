"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Search, GripVertical, ToggleLeft, ToggleRight, X } from "lucide-react";

interface Category {
    id: string;
    name: string;
    description: string;
    itemCount: number;
    status: "active" | "inactive";
    displayOrder: number;
    createdAt: string;
}

const initialCategories: Category[] = [
    { id: "c1", name: "Birthday Gifts", description: "Perfect gifts for birthdays of all ages", itemCount: 24, status: "active", displayOrder: 1, createdAt: "2025-01-01" },
    { id: "c2", name: "Anniversary Gifts", description: "Romantic and meaningful anniversary presents", itemCount: 18, status: "active", displayOrder: 2, createdAt: "2025-01-02" },
    { id: "c3", name: "Wedding Gifts", description: "Elegant gifts for weddings and engagements", itemCount: 15, status: "active", displayOrder: 3, createdAt: "2025-01-03" },
    { id: "c4", name: "Holiday & Seasonal", description: "Gifts for Christmas, Valentine's, and more", itemCount: 32, status: "active", displayOrder: 4, createdAt: "2025-01-04" },
    { id: "c5", name: "Thank You Gifts", description: "Show appreciation with thoughtful gifts", itemCount: 12, status: "active", displayOrder: 5, createdAt: "2025-01-05" },
    { id: "c6", name: "Corporate Gifts", description: "Professional gifts for business occasions", itemCount: 8, status: "inactive", displayOrder: 6, createdAt: "2025-01-06" },
    { id: "c7", name: "Personalized Gifts", description: "Custom-made items with a personal touch", itemCount: 20, status: "active", displayOrder: 7, createdAt: "2025-01-07" },
];

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>(initialCategories);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState({ name: "", description: "" });

    const filtered = categories.filter(
        (c) =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.description.toLowerCase().includes(search.toLowerCase())
    );

    const openCreateModal = () => {
        setEditingCategory(null);
        setFormData({ name: "", description: "" });
        setShowModal(true);
    };

    const openEditModal = (cat: Category) => {
        setEditingCategory(cat);
        setFormData({ name: cat.name, description: cat.description });
        setShowModal(true);
    };

    const handleSave = () => {
        if (!formData.name.trim()) return;

        if (editingCategory) {
            setCategories((prev) =>
                prev.map((c) =>
                    c.id === editingCategory.id
                        ? { ...c, name: formData.name, description: formData.description }
                        : c
                )
            );
        } else {
            const newCat: Category = {
                id: `c${Date.now()}`,
                name: formData.name,
                description: formData.description,
                itemCount: 0,
                status: "active",
                displayOrder: categories.length + 1,
                createdAt: new Date().toISOString().split("T")[0],
            };
            setCategories((prev) => [...prev, newCat]);
        }
        setShowModal(false);
    };

    const toggleStatus = (id: string) => {
        setCategories((prev) =>
            prev.map((c) =>
                c.id === id ? { ...c, status: c.status === "active" ? "inactive" : "active" } : c
            )
        );
    };

    const deleteCategory = (id: string) => {
        if (confirm("Are you sure you want to delete this category? Gifts in this category will be uncategorized.")) {
            setCategories((prev) => prev.filter((c) => c.id !== id));
        }
    };

    const stats = {
        total: categories.length,
        active: categories.filter((c) => c.status === "active").length,
        inactive: categories.filter((c) => c.status === "inactive").length,
        totalItems: categories.reduce((sum, c) => sum + c.itemCount, 0),
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Categories Management</h1>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
                >
                    <Plus className="w-4 h-4" />
                    Add Category
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <p className="text-sm text-gray-500">Total Categories</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <p className="text-sm text-gray-500">Active</p>
                    <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <p className="text-sm text-gray-500">Inactive</p>
                    <p className="text-2xl font-bold text-red-600">{stats.inactive}</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <p className="text-sm text-gray-500">Total Gifts</p>
                    <p className="text-2xl font-bold text-indigo-600">{stats.totalItems}</p>
                </div>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search categories..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full max-w-md pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                />
            </div>

            {/* Categories Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {filtered.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">No categories found.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-8">
                                        <GripVertical className="w-4 h-4 text-gray-300" />
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Gifts</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filtered.map((cat) => (
                                    <tr key={cat.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <GripVertical className="w-4 h-4 text-gray-300 cursor-grab" />
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="text-sm font-medium text-gray-900">{cat.name}</p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="text-sm text-gray-500 truncate max-w-xs">{cat.description}</p>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                                                {cat.itemCount}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <button
                                                onClick={() => toggleStatus(cat.id)}
                                                className="inline-flex items-center gap-1"
                                                title={`Click to ${cat.status === "active" ? "deactivate" : "activate"}`}
                                            >
                                                {cat.status === "active" ? (
                                                    <ToggleRight className="w-6 h-6 text-green-600" />
                                                ) : (
                                                    <ToggleLeft className="w-6 h-6 text-gray-400" />
                                                )}
                                                <span className={`text-xs font-medium capitalize ${cat.status === "active" ? "text-green-600" : "text-gray-400"}`}>
                                                    {cat.status}
                                                </span>
                                            </button>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500">{cat.createdAt}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() => openEditModal(cat)}
                                                    className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition"
                                                    title="Edit"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => deleteCategory(cat.id)}
                                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition"
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

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-gray-900">
                                {editingCategory ? "Edit Category" : "Create Category"}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                                    placeholder="e.g., Birthday Gifts"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                                    placeholder="Brief description of this category..."
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm resize-none"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 mt-6">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={!formData.name.trim()}
                                className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                            >
                                {editingCategory ? "Save Changes" : "Create Category"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
