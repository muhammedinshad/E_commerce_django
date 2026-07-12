import React from "react";
import { FiTarget, FiTruck, FiShield, FiHeart } from "react-icons/fi";

function About() {
  const values = [
    {
      icon: <FiTarget />,
      title: "Our Mission",
      desc: "To bring authentic, premium footwear to every doorstep — curated with care, delivered with trust.",
    },
    {
      icon: <FiTruck />,
      title: "Fast Delivery",
      desc: "From our warehouse to your feet in record time. Free shipping on all orders over $100.",
    },
    {
      icon: <FiShield />,
      title: "100% Authentic",
      desc: "Every pair is sourced directly from authorized retailers. No fakes, no compromises.",
    },
    {
      icon: <FiHeart />,
      title: "Customer First",
      desc: "Easy returns, responsive support, and a shopping experience built around you.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-32 pb-20 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-400 mb-4">
          About Us
        </p>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 leading-tight mb-6">
          We don't just sell shoes.
          <br />
          <span className="text-blue-600">We craft experiences.</span>
        </h1>
        <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
          SOLESCRIPT was born from a simple idea — sneaker shopping should be
          effortless, trustworthy, and enjoyable. We partner directly with the
          world's top brands to bring you verified authenticity and unmatched
          selection.
        </p>
      </section>

      {/* Divider */}
      <div className="max-w-6xl mx-auto px-6">
        <hr className="border-gray-100" />
      </div>

      {/* Values */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-400 text-center mb-3">
          What We Stand For
        </p>
        <h2 className="text-2xl md:text-3xl font-black tracking-tight text-gray-900 text-center mb-14">
          Our Core Values
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((item, i) => (
            <div
              key={i}
              className="group border border-gray-100 rounded-2xl p-8 hover:border-blue-200 hover:shadow-sm transition-all duration-300"
            >
              <div className="text-blue-600 text-2xl mb-5 group-hover:scale-110 transition-transform duration-300 inline-block">
                {item.icon}
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-3">
                {item.title}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-400 mb-3">
            Our Story
          </p>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-gray-900 mb-6">
            Started with a single pair.
          </h2>
          <p className="text-gray-400 text-base leading-relaxed max-w-xl mx-auto">
            What began as a passion project between two sneaker enthusiasts has
            grown into a trusted destination for thousands of customers worldwide.
            Our commitment remains the same — quality shoes, honest service, and
            a community built on trust.
          </p>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-2xl md:text-3xl font-black tracking-tight text-gray-900 mb-4">
          Ready to find your next pair?
        </h2>
        <p className="text-gray-400 mb-8 text-sm">
          Explore our full collection and experience the SOLESCRIPT difference.
        </p>
        <a
          href="/product"
          className="inline-block bg-gray-900 text-white text-xs font-bold uppercase tracking-widest px-8 py-3.5 rounded-full hover:bg-blue-600 transition-colors duration-300"
        >
          Browse Collection
        </a>
      </section>
    </div>
  );
}

export default About;
