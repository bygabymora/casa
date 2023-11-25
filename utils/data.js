import bcrypt from 'bcryptjs';

const data = {
  users: [
    {
      name: 'Admin User',
      email: 'sujetadoreseasyhome@gmail.com',
      password: bcrypt.hashSync('Sujetadores1*'),
      isAdmin: true,
    },
    {
      name: 'Gabriela',
      email: 'gabyby22@gmail.com',
      password: bcrypt.hashSync('Sujetadores1*'),
      isAdmin: false,
    },
  ],
  products: [
    {
      name: 'Sujetadores x 7',
      slug: '0001',
      image: '/images/sujetadoresx7.png',
      reference: '0001',
      description:
        'Juego de 7 sujetadores para sábanas con sistema de puas y liguero. ',
      price: 25000,
      size: 'Large',
      countInStock: 10,
      notes: 'El liguero se puede quitar y poner según la necesidad.',
      includes: '7 sujetadores con sistema de agujas.',
    },
    {
      name: 'Sujetadores x 4',
      slug: '0002',
      image: '/images/sujetadoresx4.png',
      reference: '0002',
      description: 'Juego de 4 sujetadores para sábanas con sistema de puas.',
      price: 25000,
      size: 'Medium',
      countInStock: 10,
      notes: 'El liguero se puede quitar y poner según la necesidad.',
      includes: '4 sujetadores con sistema de agujas.',
    },

    {
      name: 'Sujetadores liguero x 4',
      slug: '0003',
      image: '/images/sujetadoresliguero.png',
      reference: '0003',
      description:
        'Juego de 4 sujetadores para sábanas con sistema de liguero en ambas puntas.',
      price: 25000,
      size: 'Medium',
      countInStock: 10,
      notes: 'El liguero se puede quitar y poner según la necesidad.',
      includes: '4 sujetadores con sistema de liguero con liguero.',
    },

    {
      name: 'Sujetadores liguero y broche x 4',
      slug: '0004',
      image: '/images/sujetadoresbroche.png',
      reference: '0004',
      description:
        'Juego de 4 sujetadores para sábanas con sistema de liguero en ambas puntas y broche para unir en el centro.',
      price: 25000,
      size: 'Medium',
      countInStock: 10,
      notes: 'El liguero se puede quitar y poner según la necesidad.',
      includes: '4 sujetadores con sistema de liguero más broche.',
    },
  ],
  testimonios: [
    {
      id: 1,
      title: 'Padre ocupado',
      description:
        'Como padre de dos niños pequeños, el tiempo es valioso. Antes de descubrir los sujetadores para sábanas, siempre tenía que lidiar con sábanas sueltas y desordenadas cada mañana. Pero desde que comencé a usarlos, mi vida ha sido mucho más fácil. Puedo tender la cama en segundos y mis sábanas se mantienen en su lugar durante toda la noche. Dormir placidamente sin tener que ajustar las sábanas constantemente ha sido un verdadero cambio de juego. ¡Estoy realmente impresionado con estos sujetadores!',
      avatar: 'https://randomuser.me/api/portraits/men/47.jpg',
      name: 'Alejandro Gómez',
      designation: 'Padre',
      review: 4,
    },
    {
      id: 2,
      title: 'Amante del diseño de interiores',
      description:
        'Como amante del diseño de interiores, la estética y la atención al detalle son fundamentales para mí. Los sujetadores para sábanas no solo son prácticos, sino que también han mejorado significativamente la apariencia de mi cama. Ahora, mis sábanas se ven perfectamente lisas y ordenadas, creando una sensación de elegancia en mi dormitorio. Estoy encantada con la calidad y la funcionalidad de estos sujetadores. ¡Son una excelente adición a cualquier conjunto de ropa de cama!',
      avatar: 'https://randomuser.me/api/portraits/women/47.jpg',
      name: 'Carolina Ramos',
      designation: 'Diseñadora',
      review: 5,
    },
    {
      id: 3,
      title: 'Fáciles de usar',
      description:
        'Como empresario, mi vida es agitada y el tiempo es escaso. Los sujetadores para sábanas han sido una solución increíble para mí. Ahora puedo tender mi cama en cuestión de segundos, lo que me ahorra tiempo por las mañanas. Además, las sábanas se mantienen perfectamente ajustadas durante toda la noche, brindándome una comodidad excepcional. ¡Estoy realmente impresionado con la calidad y la practicidad de estos sujetadores!',
      avatar: 'https://randomuser.me/api/portraits/men/44.jpg',
      name: 'Andrés López',
      designation: 'Empresario',
      review: 5,
    },
    {
      id: 4,
      title: 'Esposa encantada',
      description:
        '¡Por fin logré que mi marido tienda la cama gracias a los sujetadores para sábanas! Estos pequeños accesorios han transformado por completo nuestro dormitorio. Ahora las sábanas se mantienen perfectamente ajustadas durante toda la noche, sin arrugas ni desorden. Mi marido se siente motivado y orgulloso de hacer la tarea, y nuestro dormitorio siempre luce ordenado y acogedor. Estoy encantada con la funcionalidad y el aspecto elegante que le han dado a nuestra cama. ¡Los sujetadores para sábanas son realmente increíbles!',
      avatar: 'https://randomuser.me/api/portraits/women/49.jpg',
      name: 'Sandra Martínez',
      designation: 'Ama de casa',
      review: 5,
    },
  ],
};

export default data;
