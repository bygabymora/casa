import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout';
import { BsSpeedometer } from 'react-icons/bs';

export default function Consumos() {
  const [consumos, setConsumos] = useState([]);
  const [paymentTypeSums, setPaymentTypeSums] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // current month
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // current year

  useEffect(() => {
    const fetchData = async () => {
      const typeOfPurchaseResult = await axios(
        '/api/admin/products?action=aggregateTypeOfPurchase'
      );
      setConsumos(typeOfPurchaseResult.data);

      const paymentTypeResult = await axios(
        '/api/admin/products?action=aggregatePaymentType'
      );
      setPaymentTypeSums(paymentTypeResult.data);
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
        <div className="date-selector">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            {Array.from(
              { length: 5 },
              (_, i) => new Date().getFullYear() - i
            ).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <h1 className="text-2xl font-bold border-b border-gray-300">
          Por Categoria
        </h1>
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
                  Total:
                  <br />
                  <span className="font-light">{totalSum}</span>
                </p>
              </Link>
            </div>
          ))}
        </div>
        <h1 className="text-2xl font-bold border-b border-gray-300">
          Por Medio de Pago
        </h1>
        <div className="grid grid-cols-1 gap-1 md:grid-cols-3">
          {paymentTypeSums.map(({ _id: paymentType, totalValue }) => (
            <div key={paymentType} className="card p-2 text-center">
              <div className="p-2 border-b border-gray-300 mb-2 font-bold">
                {paymentType || 'Unknown'}
              </div>
              <BsSpeedometer className="mx-auto" />
              <p className="font-bold">
                Total:
                <br />
                <span className="font-light">{totalValue}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
