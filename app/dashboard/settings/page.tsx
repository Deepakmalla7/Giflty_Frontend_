"use client";

import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    orderUpdates: true,
    marketingEmails: false,
    darkMode: false,
    twoFactor: false,
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const stored = localStorage.getItem("theme") as
      | "light"
      | "dark"
      | "system"
      | null;

    let isDark = false;
    if (stored === "dark") {
      isDark = true;
    } else if (stored === "system" || stored === null) {
      isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    }

    setSettings((prev) => ({
      ...prev,
      darkMode: isDark,
    }));
  }, []);

  const applyTheme = (isDark: boolean) => {
    if (typeof document === "undefined") {
      return;
    }

    const root = document.documentElement;
    root.classList.toggle("dark", isDark);
    root.style.colorScheme = isDark ? "dark" : "light";
    localStorage.setItem("theme", isDark ? "dark" : "light");
  };

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => {
      const nextValue = !prev[key];

      if (key === "darkMode") {
        applyTheme(nextValue);
      }

      return {
        ...prev,
        [key]: nextValue,
      };
    });
  };

  const settingGroups = [
    {
      title: "Notifications",
      icon: "🔔",
      items: [
        {
          key: "emailNotifications",
          label: "Email Notifications",
          description: "Receive updates via email",
        },
        {
          key: "pushNotifications",
          label: "Push Notifications",
          description: "Receive push notifications on your devices",
        },
        {
          key: "orderUpdates",
          label: "Order Updates",
          description: "Get notified about your orders",
        },
        {
          key: "marketingEmails",
          label: "Marketing Emails",
          description: "Receive promotional offers and news",
        },
      ],
    },
    {
      title: "Preferences",
      icon: "⚙️",
      items: [
        {
          key: "darkMode",
          label: "Dark Mode",
          description: "Use dark theme throughout the app",
        },
        {
          key: "twoFactor",
          label: "Two-Factor Authentication",
          description: "Enable extra security for your account",
        },
      ],
    },
  ];

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Settings
      </h1>

      {/* Settings Groups */}
      <div className="space-y-6">
        {settingGroups.map((group) => (
          <div
            key={group.title}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="text-3xl">{group.icon}</span>
              {group.title}
            </h2>

            <div className="space-y-4">
              {group.items.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {item.label}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {item.description}
                    </p>
                  </div>

                  {/* Toggle Switch */}
                  <button
                    onClick={() => handleToggle(item.key as keyof typeof settings)}
                    className={`ml-4 relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                      settings[item.key as keyof typeof settings]
                        ? "bg-emerald-600"
                        : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                        settings[item.key as keyof typeof settings]
                          ? "translate-x-7"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Save Changes Section */}
      <div className="mt-8 flex gap-4">
        <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-8 rounded-lg transition">
          Save Changes
        </button>
        <button className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold py-3 px-8 rounded-lg transition">
          Reset to Default
        </button>
      </div>

      {/* Additional Settings */}
      <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-6 rounded">
        <h3 className="text-lg font-bold text-blue-900 dark:text-blue-300 mb-2">
          💡 Privacy Settings
        </h3>
        <p className="text-blue-800 dark:text-blue-200">
          Your data is important to us. You can manage your privacy settings in
          your{" "}
          <a href="/dashboard/accounts" className="font-semibold underline">
            Account Settings
          </a>
          .
        </p>
      </div>
    </div>
  );
}
