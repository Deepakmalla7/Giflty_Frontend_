"use client";

import { useEffect, useState } from "react";
import { Gift } from "@/lib/types/gift";
import GiftCard from "@/app/components/GiftCard";
import Button from "@/app/components/Button";
import Link from "next/link";

interface GiftPreferences {
  age: number;
  event: string;
  gender: string;
}

export default function RecommendationsPage() {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [preferences, setPreferences] = useState<GiftPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load recommendations from localStorage
    const storedPreferences = localStorage.getItem("giftPreferences");
    const storedGifts = localStorage.getItem("giftRecommendations");

    if (storedPreferences && storedGifts) {
      try {
        const prefs = JSON.parse(storedPreferences) as GiftPreferences;
        const giftList = JSON.parse(storedGifts) as Gift[];
        setPreferences(prefs);
        setGifts(giftList);
      } catch (err) {
        setError("Failed to load recommendations");
      }
    } else {
      setError("No recommendations found. Please start over.");
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#faf7f2] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin inline-block h-12 w-12 border-4 border-pink-300 border-t-pink-500 rounded-full" />
          <p className="mt-4 text-gray-600">Loading recommendations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf7f2]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <img
                src="/hero.png"
                alt="Giftly Logo"
                className="h-8 w-8 rounded-md object-cover"
              />
              <span className="text-lg font-bold tracking-tight">Giftly</span>
            </Link>
            <Button variant="outline" size="sm">
              <Link href="/" className="flex items-center gap-1">
                ← Back to Search
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters Section */}
        {preferences && (
          <div className="mb-12">
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Showing recommendations for:</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="inline-block bg-pink-100 text-pink-700 px-4 py-2 rounded-full text-sm font-medium">
                  Event: {preferences.event}
                </span>
                <span className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                  Age: {preferences.age}
                </span>
                <span className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
                  Gender: {preferences.gender}
                </span>
              </div>
              <Link href="/" className="text-pink-500 hover:text-pink-600 font-medium text-sm">
                Modify search →
              </Link>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-6 text-center mb-8">
            <p className="text-red-600 font-medium mb-4">{error}</p>
            <Button variant="primary">
              <Link href="/">Start Over</Link>
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!error && gifts.length === 0 && (
          <div className="rounded-lg bg-gray-50 border-2 border-dashed border-gray-300 p-12 text-center">
            <p className="text-2xl mb-2"></p>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No gifts found
            </h3>
            <p className="text-gray-600 mb-6">
              We couldn't find any recommendations for your preferences. Try adjusting your filters.
            </p>
            <Button variant="primary">
              <Link href="/">Adjust Preferences</Link>
            </Button>
          </div>
        )}

        {/* Gift Grid */}
        {gifts.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Perfect Gifts for You
            </h2>
            <p className="text-gray-600 mb-8">
              Based on your preferences, we found {gifts.length} amazing gifts
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gifts.map((gift) => (
                <GiftCard key={gift.id} gift={gift} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
