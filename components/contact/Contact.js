import React from 'react';
import ContactUs from './ContactUs';

import Link from 'next/link';

const Contact = () => {
  return (
    <section className="contact" id="contacto">
      <div className="contact__container">
        <h1 className="section__title">¡Contáctanos!</h1>
        <span className="section__subtitle">
          Contáctanos si tienes alguna duda o pregunta.
        </span>
        <div className="contact__container container grid">
          <div className="contact__content">
            <div className="contact__title text-black">
              Puedes contactarnos por WhatsApp o Email
            </div>
            <div className="contact__card">
              <h3 className="contact__card-title">WhatsApp</h3>
              <Link
                className="contact__card-data"
                href=" https://wa.me/573044450405 "
                target="_blank"
              >
                304 445 0405
              </Link>
            </div>

            <div className="contact__card">
              <h3 className="contact__card-title">Email</h3>
              <Link
                href="mailto:sujetadoreseasyhome@gmail.com"
                className="contact__card-data"
                target="_blank"
              >
                servicioalcliente@easyhome.com
              </Link>
            </div>
          </div>
          <ContactUs />
        </div>
      </div>
    </section>
  );
};

export default Contact;
