"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
    LayoutDashboard,
    Gift,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronRight,
    Star,
    FolderTree,
    Moon,
    Sun,
} from "lucide-react";
import { ToastProvider } from "../components/Toast";
import ThemeProvider, { useTheme } from "../providers/ThemeProvider";

const navItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Gifts", href: "/admin/gifts", icon: Gift },
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Categories", href: "/admin/categories", icon: FolderTree },
    { label: "Reviews", href: "/admin/reviews", icon: Star },
    { label: "Settings", href: "/admin/settings", icon: Settings },
];

function AdminSidebar({
    sidebarOpen,
    setSidebarOpen,
    pathname,
    handleLogout,
}: {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    pathname: string | null;
    handleLogout: () => void;
}) {
    const { theme, toggleTheme } = useTheme();

    return (
        <>
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-200 lg:translate-x-0 lg:static lg:z-auto ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
                    <Link href="/admin/dashboard" className="flex items-center gap-2">
                        <Gift className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
                        <span className="text-lg font-bold text-gray-900 dark:text-white">Giftly Admin</span>
                    </Link>
                    <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
                        <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </button>
                </div>

                <nav className="flex-1 px-3 py-4 space-y-1">
                    {navItems.map((item) => {
                        const active = pathname === item.href || pathname?.startsWith(item.href + "/");
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                    active
                                        ? "bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300"
                                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                                }`}
                            >
                                <item.icon className={`w-5 h-5 ${active ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400 dark:text-gray-500"}`} />
                                {item.label}
                                {active && <ChevronRight className="w-4 h-4 ml-auto text-indigo-400 dark:text-indigo-500" />}
                            </Link>
                        );
                    })}
                </nav>

                <div className="px-3 py-4 border-t border-gray-200 dark:border-gray-700 space-y-1">
                    <button
                        onClick={toggleTheme}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        {theme === "dark" ? (
                            <>
                                <Sun className="w-5 h-5" />
                                Light Mode
                            </>
                        ) : (
                            <>
                                <Moon className="w-5 h-5" />
                                Dark Mode
                            </>
                        )}
                    </button>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
}

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    // Allow login page to render without auth check
    const isLoginPage = pathname === "/admin/login";

    useEffect(() => {
        if (isLoginPage) {
            setIsLoading(false);
            setIsAuthenticated(false);
            return;
        }

        const authenticated = localStorage.getItem("adminAuthenticated");
        const token = localStorage.getItem("adminToken");

        if (authenticated === "true" && token) {
            setIsAuthenticated(true);
        } else {
            router.replace("/admin/login");
        }
        setIsLoading(false);
    }, [isLoginPage, router]);

    const handleLogout = () => {
        localStorage.removeItem("adminAuthenticated");
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminEmail");
        router.push("/admin/login");
    };

    // Login page renders without shell
    if (isLoginPage) {
        return <ToastProvider>{children}</ToastProvider>;
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
            </div>
        );
    }

    if (!isAuthenticated) return null;

    return (
        <ToastProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
                <AdminSidebar
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    pathname={pathname}
                    handleLogout={handleLogout}
                />

                {/* Main content */}
                <div className="flex-1 flex flex-col min-w-0">
                    {/* Top bar */}
                    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center px-4 lg:px-6 gap-4">
                        <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                            <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                        </button>
                        <div className="flex-1" />
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            {typeof window !== "undefined" && localStorage.getItem("adminEmail")}
                        </span>
                    </header>

                    {/* Page content */}
                    <main className="flex-1 p-4 lg:p-6 overflow-auto bg-gray-50 dark:bg-gray-900">
                        {children}
                    </main>
                </div>
            </div>
        </ToastProvider>
    );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <AdminLayoutContent>{children}</AdminLayoutContent>
        </ThemeProvider>
    );
}
