import Layout from '../components/Layout.js';
import { ProductItem } from '../components/ProductItem.js';
import React from 'react';
import Banner from '../components/Banner';
import Contact from '../components/contact/Contact';
import StaticBanner from '../components/StaticBanner';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Product from '../models/Product.js';
import db from '../utils/db.js';
import Testimonios from '../components/Testimonios.js';

export default function Home({ products }) {
  const [carouselCenterSlidePercentage, setCarouselCenterSlidePercentage] =
    React.useState(33.33); // Set a default value for initial rendering

  React.useEffect(() => {
    const handleResize = () => {
      // Calculate the centerSlidePercentage based on the window size
      if (window.innerWidth < 768) {
        // Small screens, show one item at a time
        setCarouselCenterSlidePercentage(100);
      } else if (window.innerWidth < 1024) {
        // Medium screens, show two items at a time
        setCarouselCenterSlidePercentage(50);
      } else {
        // Larger screens, show three items at a time
        setCarouselCenterSlidePercentage(33.33);
      }
    };

    handleResize(); // Call the handleResize function on initial load

    // Add a window resize event listener
    window.addEventListener('resize', handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Layout title="Home Page">
      <StaticBanner />
      <Banner />

      <h2 className="section__title my-2" id="productos">
        Nuestros Productos
      </h2>
      <div>
        <p className="text-center text-sm md:text-lg">
          ¡Escoje los sujetadores que más se adapten a ti!
        </p>
      </div>
      <Carousel
        showArrows={true}
        showThumbs={false}
        showStatus={false}
        showIndicators={false}
        infiniteLoop={true}
        centerMode={true}
        centerSlidePercentage={carouselCenterSlidePercentage}
        emulateTouch={true}
        swipeable={true}
        autoPlay={true}
        interval={1500}
      >
        {products.map((product) => (
          <ProductItem product={product} key={product.slug}></ProductItem>
        ))}
      </Carousel>
      <Testimonios />

      <Contact className="mt-2" />
    </Layout>
  );
}
export async function getServerSideProps() {
  await db.connect();

  const products = await Product.find().sort({ createdAt: -1 }).lean();
  return {
    props: {
      products: products.map(db.convertDocToObj),
    },
  };
}
