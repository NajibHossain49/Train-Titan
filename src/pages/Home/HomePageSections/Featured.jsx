import React from "react";
import { ArrowRight, Star, Trophy, Users, LineChart } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    title: "Personalized Training",
    description:
      "Tailored workout plans that adapt to your specific goals, ensuring maximum results.",
    Icon: Trophy,
    gradient: "from-violet-600 to-indigo-600",
    highlight: "95% Success Rate",
  },
  {
    title: "Real-Time Progress",
    description:
      "Track your fitness progress with detailed stats and insights to stay on track.",
    Icon: LineChart,
    gradient: "from-blue-600 to-cyan-500",
    highlight: "Daily Updates",
  },
  {
    title: "Expert Coaching",
    description:
      "Gain access to expert coaches who provide guidance and motivation whenever you need it.",
    Icon: Star,
    gradient: "from-rose-600 to-pink-500",
    highlight: "Certified Trainers",
  },
  {
    title: "Community Support",
    description:
      "Join a community of like-minded individuals for motivation, support, and accountability.",
    Icon: Users,
    gradient: "from-purple-600 to-blue-600",
    highlight: "10k+ Members",
  },
];

const FeaturedSection = () => {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Transform Your Fitness Journey
          </h2>
          <p className="text-base md:text-lg text-gray-600 leading-relaxed">
            Discover why thousands of fitness enthusiasts choose our platform for their transformation
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

              {/* Content Container */}
              <div className="relative p-6 h-full flex flex-col">
                {/* Icon and Title Section */}
                <div className="mb-4">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} text-white mb-4`}>
                    <feature.Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-white transition-colors duration-300">
                    {feature.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-gray-600 group-hover:text-gray-100 transition-colors duration-300 mb-4">
                  {feature.description}
                </p>

                {/* Highlight Badge */}
                <div className="mt-auto">
                  <span className="inline-flex items-center text-sm font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-800 group-hover:bg-white/20 group-hover:text-white transition-colors duration-300">
                    {feature.highlight}
                  </span>
                </div>

                {/* Hover Arrow */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                  <ArrowRight className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center mt-12">
          <Link to="/signup">
          <button className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium transition-transform duration-300 hover:scale-105 hover:shadow-lg">
            Start Your Journey
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;