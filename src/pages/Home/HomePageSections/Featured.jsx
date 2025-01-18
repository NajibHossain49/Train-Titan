import React from "react";

const features = [
  {
    title: "Personalized Training",
    description:
      "Tailored workout plans that adapt to your specific goals, ensuring maximum results.",
    icon: "🏋️‍♂️",
    gradient: "bg-gradient-to-r from-indigo-600 to-blue-500",
  },
  {
    title: "Real-Time Progress Tracking",
    description:
      "Track your fitness progress with detailed stats and insights to stay on track.",
    icon: "📈",
    gradient: "bg-gradient-to-r from-teal-500 to-cyan-400",
  },
  {
    title: "Expert Coaching",
    description:
      "Gain access to expert coaches who provide guidance and motivation whenever you need it.",
    icon: "👨‍🏫",
    gradient: "bg-gradient-to-r from-rose-500 to-pink-400",
  },
  {
    title: "Community Support",
    description:
      "Join a community of like-minded individuals for motivation, support, and accountability.",
    icon: "🤝",
    gradient: "bg-gradient-to-r from-purple-600 to-blue-600",
  },
];

const FeaturedSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-6">
          Why Choose Us?
        </h2>
        <p className="text-lg text-gray-600 mb-10">
          Explore the premium features that elevate your fitness experience.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`feature-card p-6 rounded-xl text-white shadow-xl transform transition-transform hover:scale-105 ${feature.gradient}`}
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-lg">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
