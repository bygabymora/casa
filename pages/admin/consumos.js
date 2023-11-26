import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout';
import { BsSpeedometer } from 'react-icons/bs';

export default function Consumos() {
  const [consumos, setConsumos] = useState([]);

  useEffect(() => {
    // Fetching aggregated data
    const fetchData = async () => {
      const result = await axios('/api/admin/products?action=aggregate');
      setConsumos(result.data);
    };
    fetchData();
  }, []);

  // Main categories and their subcategories
  const mainCategories = {
    Ingreso: ['Salario FL', 'Salario GM', 'Otro ingreso'],
    Casa: [
      'Comida y aseo',
      'Extras Casa',
      'Medicinas',
      'Colegio Niñas',
      'María',
      'Clases Pollos',
      'Arriendo Casa',
      'Administración',
    ],
    'Servicios Públicos': [
      'Gas',
      'Luz',
      'Agua',
      'Internet',
      'Directv',
      'Netflix',
      'Celular GMG',
      'Operacional GMG',
      'Disney',
      'YouTube',
    ],
    Carro: ['Gasolina', 'Mantenimiento', 'Lavado', 'Parqueadero'],
    Ocio: ['Ocio General', 'Viajes', 'Cumpleaños'],
    Ropa: ['Ropa Pollos', 'Ropa Papás'],
    Perros: ['Comida Perros', 'Guardería Perros', 'Medicina Perros'],
    Extracurriculares: ['Clases y Extracurriculares'],
    ' Ob. financieras': [
      'Crédito Bancolombia',
      'Crédito Banco Bogotá',
      'Pago TC Master',
      'Pago TC Visa',
      'Pago TC Bancolombia',
    ],
  };

  const aggregatedSums = Object.keys(mainCategories).map((mainCategory) => {
    const subcategories = mainCategories[mainCategory];
    const totalSum = subcategories.reduce((sum, subcategory) => {
      const found = consumos.find((consumo) => consumo._id === subcategory);
      return sum + (found ? found.totalValue : 0);
    }, 0);

    return { mainCategory, totalSum };
  });

  return (
    <Layout>
      <div className="grid md:grid-cols-4 md:gap-2 mb-5">
        <div>
          <div>
            <ul className="hidden lg:block">
              <li>
                <Link href="/">Dashboard</Link>
              </li>
              <li>
                <Link href="/admin/consumos">Consumos</Link>
              </li>
              <li>
                <Link href="/admin/products" className="font-bold">
                  Registros
                </Link>
              </li>
              <li>
                <Link href="/admin/users">Usuarios</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="col-span-3">
          <div className="grid grid-cols-1 gap-1 md:grid-cols-3">
            {aggregatedSums.map(({ mainCategory, totalSum }) => (
              <div key={mainCategory} className="card p-2 text-center">
                <Link
                  href={`/admin/${mainCategory}`}
                  className="flex flex-col items-center justify-center"
                >
                  <div className=" p-2 border-b border-gray-300 mb-2 font-bold">
                    {mainCategory}
                  </div>
                  <BsSpeedometer className="mx-auto" />
                  <p className="font-bold">
                    Total Value:
                    <br />
                    <span className="font-light">{totalSum}</span>
                  </p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
