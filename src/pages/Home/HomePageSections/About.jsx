import React from 'react';
import { ArrowRight, Activity, Users, Target } from 'lucide-react';

const AboutSection = () => {
  return (
    <section className="relative overflow-hidden py-20 bg-gradient-to-br from-gray-50 to-white">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-64 h-64 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 transform transition-all duration-500 hover:scale-105">
            Leading the Change in Fitness Innovation
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We're revolutionizing fitness by merging cutting-edge technology with genuine passion for wellness. 
            Our platform empowers your journey to better health through intelligent tracking, personalized guidance, 
            and vibrant community support.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: <Activity className="w-8 h-8 text-blue-500" />,
              title: "Smart Training",
              description: "AI-powered workout plans that adapt to your progress and preferences"
            },
            {
              icon: <Users className="w-8 h-8 text-purple-500" />,
              title: "Community Power",
              description: "Connect with like-minded fitness enthusiasts and share your journey"
            },
            {
              icon: <Target className="w-8 h-8 text-pink-500" />,
              title: "Goal Tracking",
              description: "Visual progress tracking with detailed insights and achievements"
            }
          ].map((feature, index) => (
            <div 
              key={index}
              className="group p-6 bg-white rounded-2xl shadow-xl hover:shadow-xl transform transition-all duration-300 hover:-translate-y-2"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 bg-gray-50 rounded-full group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
  <div className="bg-white p-6 rounded-2xl shadow-lg transform transition-all duration-300 hover:shadow-xl">
    <h3 className="text-2xl font-bold text-gray-800 mb-4">
      Empowering Health Through Technology
    </h3>
    <p className="text-gray-600 leading-relaxed">
      Unlock the future of fitness with AI-powered training plans. Our platform offers real-time analytics, helping you fine-tune every workout for maximum results.
    </p>
    <button className="mt-4 flex items-center text-blue-600 hover:text-blue-700 transition-colors">
      Learn more <ArrowRight className="w-4 h-4 ml-2" />
    </button>
  </div>

  <div className="bg-white p-6 rounded-2xl shadow-lg transform transition-all duration-300 hover:shadow-xl">
    <h3 className="text-2xl font-bold text-gray-800 mb-4">
      Join a Fitness-Focused Community
    </h3>
    <p className="text-gray-600 leading-relaxed">
      Be part of a vibrant community that motivates and encourages you. Engage with others on their fitness journeys, share tips, and celebrate victories together.
    </p>
    <button className="mt-4 flex items-center text-blue-600 hover:text-blue-700 transition-colors">
      Join the community <ArrowRight className="w-4 h-4 ml-2" />
    </button>
  </div>

  <div className="bg-white p-6 rounded-2xl shadow-lg transform transition-all duration-300 hover:shadow-xl">
    <h3 className="text-2xl font-bold text-gray-800 mb-4">
      Tailored Fitness Plans for Every Goal
    </h3>
    <p className="text-gray-600 leading-relaxed">
      Whether you’re looking to build strength, improve endurance, or lose weight, our personalized workout plans cater to all fitness levels and goals.
    </p>
    <button className="mt-4 flex items-center text-blue-600 hover:text-blue-700 transition-colors">
      Explore your plan <ArrowRight className="w-4 h-4 ml-2" />
    </button>
  </div>

  <div className="bg-white p-6 rounded-2xl shadow-lg transform transition-all duration-300 hover:shadow-xl">
    <h3 className="text-2xl font-bold text-gray-800 mb-4">
      Progress at Your Own Pace
    </h3>
    <p className="text-gray-600 leading-relaxed">
      Track your progress with detailed insights and achieve your fitness milestones. Our platform adjusts to your pace, helping you stay on track for continuous improvement.
    </p>
    <button className="mt-4 flex items-center text-blue-600 hover:text-blue-700 transition-colors">
      Start tracking <ArrowRight className="w-4 h-4 ml-2" />
    </button>
  </div>
</div>


          <div className="relative group h-full">
            <div className="aspect-[3/4] lg:aspect-[4/5] w-full h-full">
              <img
                src="https://i.ibb.co.com/rH148yT/sushil-ghimire.jpg"
                alt="Fitness Journey"
                className="w-full h-full object-cover rounded-2xl shadow-2xl transform transition-all duration-500 group-hover:scale-105 group-hover:rotate-2"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl">
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="text-xl font-bold">Start Your Journey</p>
                  <p className="text-sm">Transform your life today</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;