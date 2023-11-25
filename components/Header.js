'use client';
import Signupbutton from './Signupbutton';
import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { BsCart2 } from 'react-icons/bs';
import Image from 'next/image';
import Logo from '../public/images/assets/logo2.png';
import Logo2 from '../public/images/assets/logo.png';
import Navbar from './Navbar';
import { Store } from '../utils/Store';
import { useRouter } from 'next/router';
import { BsWhatsapp } from 'react-icons/bs';

const Header = () => {
  const router = useRouter();
  const { state } = useContext(Store);
  const { cart } = state;
  const [cartItemsCount, setCarItemsCount] = useState(0);
  useEffect(() => {
    setCarItemsCount(cart.cartItems.reduce((a, c) => a + c.quantity, 0));
  }, [cart.cartItems]);

  const handleHomeClick = () => {
    if (router.pathname === '/') {
      router.reload();
    } else {
      router.push('/');
    }
  };
  return (
    <>
      <header className="header  flex flex-col">
        <div className="md:mx-auto md:max-w-[1600px] md:mb-2 flex text-right p-2 equal-button-size btn-contact items-center justify-center mr-4 py-2 sm:mb-0 text-white bg-title-color-dark hover:bg-title-color rounded sm:text-3xl lg:text-4xl md:justify-center md:order-last lg:hidden xl:hidden ">
          <Link
            className="flex flex-row "
            href="https://wa.me/573044450405"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="text-lg">¿Necesitas ayuda? &nbsp;</span>
            <BsWhatsapp className="text-2xl" />
          </Link>
        </div>

        <nav className="nav container">
          <div className="flex h-12 items-center">
            <div className="flex h-12 items-center">
              <Link
                href="/"
                className="nav__logo logo"
                onClick={handleHomeClick}
              >
                <div className="r__logo r__logo-1">
                  <Image src={Logo2} alt="logo" width={500} />
                </div>
              </Link>
              <Link
                href="/"
                className="nav__logo_2 logo"
                onClick={handleHomeClick}
              >
                <div className="r__logo r__logo-2">
                  <Image src={Logo} alt="logo" width={400} />
                </div>
              </Link>
            </div>
            <div className=" hidden md:mx-auto md:max-w-[1600px] md:mb-2   p-2 equal-button-size btn-contact items-center justify-center  py-2 sm:mb-0 text-white bg-title-color-dark hover:bg-title-color rounded sm:text-3xl lg:text-2xl md:justify-center md:order-last lg:block xl:block ">
              <Link
                className="flex flex-row "
                href="https://wa.me/573044450405"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="text-lg">¿Necesitas ayuda? &nbsp;</span>
                <BsWhatsapp className="text-2xl" />
              </Link>
            </div>
            <div className="nav-reverse flex h-12 place-items-center gap-4">
              <div className="flex h-12 items-center">
                <Link
                  href={{ pathname: '/cart' }}
                  className="flex text-xl font-bold p-2"
                >
                  <BsCart2 />
                </Link>
                {cartItemsCount > 0 && (
                  <sub
                    className="cart-badge"
                    onClick={() => router.push('/cart')}
                  >
                    {cartItemsCount}
                  </sub>
                )}
              </div>

              <Signupbutton />
              <Navbar />
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Header;
