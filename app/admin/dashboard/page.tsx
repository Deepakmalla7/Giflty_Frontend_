"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Gift, Users, Package, TrendingUp, Plus, ArrowRight } from "lucide-react";
import { getGiftStats } from "@/lib/api/admin-gift.api";

interface Stats {
    totalGifts: number;
    availableGifts: number;
    outOfStock: number;
    avgPrice: number;
    categories: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const result = await getGiftStats();
                setStats(result.data);
            } catch {
                // Stats may fail if no admin token, that's ok
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statCards = [
        {
            label: "Total Gifts",
            value: stats?.totalGifts ?? "-",
            icon: Gift,
            color: "bg-indigo-500",
            href: "/admin/gifts",
        },
        {
            label: "Available",
            value: stats?.availableGifts ?? "-",
            icon: Package,
            color: "bg-green-500",
            href: "/admin/gifts",
        },
        {
            label: "Out of Stock",
            value: stats?.outOfStock ?? "-",
            icon: TrendingUp,
            color: "bg-yellow-500",
            href: "/admin/gifts",
        },
        {
            label: "Categories",
            value: stats?.categories ?? "-",
            icon: Users,
            color: "bg-purple-500",
            href: "/admin/gifts",
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Welcome to the Giftly Admin Panel</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((card) => (
                    <Link key={card.label} href={card.href} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                            <div className={`${card.color} rounded-lg p-3`}>
                                <card.icon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{card.label}</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {loading ? (
                                        <span className="inline-block w-8 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                                    ) : (
                                        card.value
                                    )}
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Avg Price */}
            {stats?.avgPrice !== undefined && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Average Gift Price</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">${stats.avgPrice.toFixed(2)}</p>
                </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h2>
                </div>
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Link
                        href="/admin/gifts/create"
                        className="flex items-center gap-3 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:border-indigo-200 dark:hover:border-indigo-700 transition-colors"
                    >
                        <Plus className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Add New Gift</span>
                    </Link>
                    <Link
                        href="/admin/gifts"
                        className="flex items-center gap-3 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                        <Gift className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Manage Gifts</span>
                        <ArrowRight className="w-4 h-4 text-gray-400 dark:text-gray-500 ml-auto" />
                    </Link>
                    <Link
                        href="/admin/users"
                        className="flex items-center gap-3 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                        <Users className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Manage Users</span>
                        <ArrowRight className="w-4 h-4 text-gray-400 dark:text-gray-500 ml-auto" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
