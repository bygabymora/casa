import React from 'react';
import { TbMessage2Check } from 'react-icons/tb';
import { GiThreeFriends } from 'react-icons/gi';
import { FiTag } from 'react-icons/fi';
import Image from 'next/image';
import LogoWhite from '../public/images/assets/logoWhite.png';

export default function Footer() {
  return (
    <div className="footer">
      <div className="grid grid-cols-1 lg:grid-cols-3 p-10 m-10 text-sm gap-4">
        <div className="grid grid-cols-1">
          <TbMessage2Check className="text-4xl" />
          <h1 className="footer-title"> Escríbenos </h1>
          <p>
            {' '}
            Estamos aquí para responder cualquier pregunta o inquietud que
            puedas tener. Si necesitas más información sobre nuestros
            sujetadores para sábanas o deseas recibir asesoramiento
            personalizado, no dudes en ponerte en contacto con nosotros.
          </p>
        </div>
        <div className="grid grid-cols-1">
          <GiThreeFriends className="text-4xl" />
          <h1 className="footer-title">Comparte la felicidad</h1>
          <p>
            {' '}
            Sabemos que nuestros sujetadores para sábanas han hecho la vida más
            fácil y confortable para muchas personas. Si has tenido una
            experiencia positiva con nuestros productos, te invitamos a
            compartir tu felicidad con otros. Comparte tus comentarios y
            testimonios con nosotros para que más personas puedan descubrir los
            beneficios de tener sábanas perfectamente ajustadas.{' '}
          </p>
        </div>
        <div className="grid grid-cols-1">
          <FiTag className="text-4xl" />
          <h1 className="footer-title">
            Etiquetanos en tus redes y gana muchos premios
          </h1>
          <p>
            ¡Queremos verte disfrutando de la comodidad de nuestros sujetadores
            para sábanas! Etiquétanos en tus publicaciones en redes sociales
            para que podamos ver cómo nuestros productos mejoran tu experiencia
            de descanso. Comparte fotos de tu cama perfectamente tendida y
            etiquétanos con nuestro nombre de usuario para que podamos compartir
            tu entusiasmo con nuestra comunidad.
          </p>
        </div>
      </div>
      <div className="flex flex-col justify-center">
        <Image
          src={LogoWhite}
          alt="Easy Home Designer"
          className="footer-logo self-center"
        />
        <p className="text-xl justify-items-center text-center self-center p-3 mb-5">
          Copyrights 2023 Easy Home Designer
        </p>
        <br />
      </div>
    </div>
  );
}
