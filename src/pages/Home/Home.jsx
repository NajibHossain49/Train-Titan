import AboutSection from "./HomePageSections/About";
import BannerSlider from "./HomePageSections/Banner";
import FeaturedSection from "./HomePageSections/Featured";
import Reviews from "./HomePageSections/Reviews";
import ForumPosts from "./HomePageSections/ForumPosts";
import NewsletterSubscription from "./HomePageSections/NewsletterSubscription";


const Home = () => {
  return (
    <div>
      <BannerSlider />
      <FeaturedSection />
      <AboutSection />
      <Reviews />
      <ForumPosts />
      <NewsletterSubscription />
    </div>
  );
};

export default Home;