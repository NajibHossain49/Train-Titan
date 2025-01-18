import AboutSection from "./HomePageSections/About";
import BannerSlider from "./HomePageSections/Banner";
import FeaturedSection from "./HomePageSections/Featured";
import Reviews from "./HomePageSections/Reviews";
import ForumPosts from "./HomePageSections/ForumPosts";
import NewsletterSubscription from "./HomePageSections/HomeNewsletterSubscription";
import TeamSection from "./HomePageSections/TeamSection";
import FeaturedClasses from "./HomePageSections/FeaturedClasses";


const Home = () => {
  return (
    <div>
      <BannerSlider />
      <FeaturedSection />
      <AboutSection />
      <FeaturedClasses />
      <Reviews />
      <ForumPosts />
      <NewsletterSubscription />
      <TeamSection />
    </div>
  );
};

export default Home;