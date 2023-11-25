import React from 'react';
import Image from 'next/image';
import Banner1 from '../public/images/assets/banner1.svg';
import Banner2 from '../public/images/assets/banner2.svg';
import Banner3 from '../public/images/assets/banner3.svg';
import { useRouter } from 'next/router';

const Banner = () => {
  const router = useRouter();

  const handleCallButtonClick = () => {
    window.location.href = 'tel:8132520727';
  };

  const handleLinkClick = (section) => {
    if (window.innerWidth >= 800) {
      const yOffsetLargeScreen = -170;
      setTimeout(() => {
        const element = document.getElementById(section);
        const y =
          element.getBoundingClientRect().top +
          window.scrollY +
          yOffsetLargeScreen;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }, 200);
    } else {
      const yOffsetSmallScreen = -50;
      setTimeout(() => {
        const path = `/#${section}`; // Construct anchor link with #
        router.push(path);
        const element = document.getElementById(section);
        const y =
          element.getBoundingClientRect().top +
          window.scrollY +
          yOffsetSmallScreen;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }, 200);
    }
  };

  return (
    <div className="static-banner-container lg:relative lg:text-title-color-dark lg:text-center overflow-hidden  lg:h-[315px] h-[300px] w-[375px]">
      <div className="absolute inset-0 w-full ">
        <Image
          className="object-cover w-full h-full hidden -z-40 lg:block xl:hidden"
          src={Banner1}
          alt="Banner"
        />
        <Image
          className="object-cover w-full h-full hidden -z-40 lg:hidden xl:block"
          src={Banner3}
          alt="Banner"
        />
      </div>

      <div className="relative z-10 grid lg:grid-cols-1 md:grid-cols-1 banner-container mx-auto px-4 py-8 items-center  w-[100%] ">
        <div className="absolute inset-0 w-full -z-40">
          <Image
            className="object-cover w-full h-full lg:hidden "
            src={Banner2}
            alt="Banner"
          />
        </div>
        <div className="grid grid-cols-1 lg:mt-8 w-[40%] lg:mb-8 text-right mt-[30%] z-10">
          <button
            href="tel:3044450405"
            onClick={handleCallButtonClick}
            className="equal-button-size btn-call sm:inline-block block mr-4 mb-4  sm:mb-0 text-white bg-title-color-dark hover:bg-title-color  rounded lg:hidden text-center"
          >
            Llámanos
          </button>

          <button
            href="/#contacto"
            className=" equal-button-size btn-contact   block mr-4 py-1  sm:mb-0 text-white bg-title-color-dark hover:bg-title-color  rounded  text-center sm:text-3xl  lg:text-4xl md:py-2 mb-1"
            onClick={() => handleLinkClick('contacto')}
          >
            Contáctanos
          </button>
        </div>
      </div>
    </div>
  );
};

export default Banner;
