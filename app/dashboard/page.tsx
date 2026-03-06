"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import watchTwo from "@/app/assets/watch (2).png";
import flowers from "@/app/assets/images/flowers.png";
import perfurm from "@/app/assets/images/perfurm.png";
import boot from "@/app/assets/images/boot.png";
import wallet from "@/app/assets/images/wallet.png";

export default function DashboardPage() {
  const [event, setEvent] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recommendedItems, setRecommendedItems] = useState<
    { id?: string; name: string; image: any; isBackendImage?: boolean; price?: number; category?: string; description?: string }[]
  >([]);
  const abortRef = useRef<AbortController | null>(null);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  const giftItems = [
    { name: "Watch", image: watchTwo },
    { name: "Flowers", image: flowers },
    { name: "Perfume", image: perfurm },
    { name: "Boots", image: boot },
    { name: "Wallet", image: wallet },
  ];

  useEffect(() => {
    return () => {
      if (abortRef.current) {
        abortRef.current.abort();
      }
    };
  }, []);

  const pickLocalImage = (name: string) => {
    const normalized = name.toLowerCase();
    if (normalized.includes("watch")) return watchTwo;
    if (normalized.includes("flower")) return flowers;
    if (normalized.includes("perfume") || normalized.includes("fragrance")) return perfurm;
    if (normalized.includes("boot")) return boot;
    if (normalized.includes("wallet")) return wallet;
    return watchTwo;
  };

  const handleGetRecommendations = async () => {
    setError("");

    if (!event || !age || !gender) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setRecommendedItems([]);

    if (abortRef.current) {
      abortRef.current.abort();
    }

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const params = new URLSearchParams({
        age,
        event,
        gender
      });

      const response = await fetch(
        `${API_BASE_URL}/api/gifts/recommendations?${params.toString()}`,
        { signal: controller.signal }
      );

      console.log("API Response Status:", response);

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => null);
        throw new Error(errorPayload?.message || "Failed to fetch recommendations");
      }

      const payload = await response.json();
      const items = Array.isArray(payload?.data) ? payload.data : [];

      // Map items: prefer backend imageUrl, fallback to local images if not available
      const mappedItems = items.map((item: { name?: string; imageUrl?: string; price?: number; category?: string; description?: string; _id?: string }) => {
        const name = item?.name || "Gift";
        let imageUrl = item?.imageUrl;
        
        // If backend provides a relative imageUrl, prepend the API base URL
        if (imageUrl && !imageUrl.startsWith("http")) {
          imageUrl = `${API_BASE_URL}${imageUrl}`;
        }

        // If backend provides imageUrl (from MongoDB), use it directly
        if (imageUrl) {
          return {
            id: item._id,
            name,
            image: imageUrl,
            isBackendImage: true,
            price: item.price,
            category: item.category,
            description: item.description,
          };
        }
        
        // Fallback to local image mapping
        return {
          id: item._id,
          name,
          image: pickLocalImage(name),
          isBackendImage: false,
          price: item.price,
          category: item.category,
          description: item.description,
        };
      });

      localStorage.setItem(
        "giftPreferences",
        JSON.stringify({ age: parseInt(age, 10), event, gender })
      );
      setRecommendedItems(mappedItems.length > 0 ? mappedItems : giftItems);
    } catch (err: any) {
      if (err?.name !== "AbortError") {
        setError(err?.message || "Failed to fetch recommendations");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Welcome to GIFTLY</h1>
        <p className="text-gray-600 dark:text-gray-400">A smart Gift Recommendation at your fingertips</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-4xl">📅</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Age</h3>
          </div>
          <select
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option value="">Select an age</option>
            {Array.from({ length: 116 }, (_, i) => i + 5).map((age) => (
              <option key={age} value={age}>
                {age} years old
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-4xl">🎉</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Event</h3>
          </div>
          <select
            value={event}
            onChange={(e) => setEvent(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option value="">Select an event</option>
            <option value="birthday">Birthday</option>
            <option value="anniversary">Anniversary</option>
            <option value="wedding">Wedding</option>
            <option value="christmas">Christmas</option>
            <option value="valentine">Valentine&apos;s Day</option>
            <option value="graduation">Graduation</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-4xl">👥</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Gender</h3>
          </div>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option value="">Select a gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">AI Suggested Gifts</h2>

        <div className="mb-8">
          <button
            onClick={handleGetRecommendations}
            disabled={isLoading}
            className="px-8 py-4 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Finding Gifts...
              </>
            ) : (
              <>
                <span></span>
                <span>Get Recommendations</span>
              </>
            )}
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {isLoading && (
            <div className="col-span-full text-center text-gray-500 dark:text-gray-400">
              Loading recommendations...
            </div>
          )}

          {!isLoading && recommendedItems.length === 0 && (
            <div className="col-span-full text-center text-gray-500 dark:text-gray-400">
              Select options above, then click Get Recommendations
            </div>
          )}

          {!isLoading &&
            recommendedItems.map((item) => (
              <div
                key={item.id || item.name}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden flex flex-col"
              >
                <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-700">
                  {item.isBackendImage ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain"
                      sizes="(min-width: 768px) 33vw, 100vw"
                    />
                  )}
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">
                    {item.name}
                  </h3>
                  {item.category && (
                    <span className="inline-block self-start px-2 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-200 mb-2 capitalize">
                      {item.category}
                    </span>
                  )}
                  {item.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2 flex-1">
                      {item.description}
                    </p>
                  )}
                  {item.price !== undefined && (
                    <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                      ${item.price.toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            ))}
        </div>

        <p className="mt-6 text-sm text-gray-600 dark:text-gray-400">
          💡 Tip: Select age, event, and gender to get personalized gift recommendations powered by AI
        </p>
      </div>
    </div>
  );
}
