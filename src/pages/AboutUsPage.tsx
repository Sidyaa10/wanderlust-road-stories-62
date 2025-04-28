
import React from "react";
import Layout from "@/components/Layout";

const features = [
  {
    title: "Share Your Journey",
    desc: "Post detailed stories, stops, and photos from your favorite road trips to inspire fellow travelers.",
  },
  {
    title: "Discover Curated Adventures",
    desc: "Explore unique road trips from people around the world. Filter by location, duration, style, or difficulty.",
  },
  {
    title: "Profile & Community",
    desc: "Create your traveler profile, connect with like-minded explorers, and build your road trip passport.",
  },
  {
    title: "Plan with Confidence",
    desc: "View honest reviews, hidden gems, and real experiences so you can plan better adventures.",
  },
];

export default function AboutUsPage() {
  return (
    <Layout>
      <div
        className="relative min-h-[100vh] flex flex-col items-center justify-start py-8 px-2"
        style={{
          background: `url('/') center/cover no-repeat`,
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-forest-700/70 via-sky-100/70 to-sky-300/40 backdrop-blur-[2px]" />
        <div className="relative z-10 w-full max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center pt-12 pb-2 drop-shadow-lg font-playfair">About Us</h1>

          <div className="mt-8 mb-10 mx-auto rounded-2xl bg-white/80 shadow-xl border border-white/40 backdrop-blur-[4px] px-8 py-6 flex flex-col items-center">
            <h2 className="text-2xl font-semibold mb-2 text-forest-700">Our Mission</h2>
            <p className="text-gray-700 text-center text-base">
              Wanderlust Road Stories is dedicated to connecting travelers through the power of unforgettable road trip moments.<br/>
              We empower you to share, explore, and relive the world’s best journeys—one story at a time.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-14">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-white/80 backdrop-blur rounded-xl p-6 shadow road-card border border-white/30"
              >
                <h3 className="font-semibold text-xl mb-2 text-forest-700">{f.title}</h3>
                <p className="text-base text-gray-700">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Created by Section */}
          <div className="mx-auto bg-white/80 backdrop-blur-lg rounded-2xl mt-10 mb-4 px-8 pt-8 pb-4 shadow-xl border border-white/60 flex flex-col items-center max-w-2xl relative"
               style={{
                 boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.20)",
               }}>
            <span className="text-lg text-gray-700 mb-1 font-medium">Created By</span>
            <span className="text-3xl sm:text-4xl font-bold text-forest-800 mb-1 drop-shadow font-playfair">
              Siddhesh Anand Kadam
            </span>
            <span className="text-base text-gray-600 mb-2 text-center">
              Bringing innovation to travel technology
            </span>
          </div>
        </div>
      </div>
    </Layout>
  );
}
