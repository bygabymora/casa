import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout';
import { BsSpeedometer } from 'react-icons/bs';

export default function Consumos() {
  const [consumos, setConsumos] = useState([]);
  const [paymentTypeSums, setPaymentTypeSums] = useState([]);
  const [fecha, setFecha] = useState(new Date());

  const monthPlusOne = fecha.getMonth();
  const yearPlusOne = fecha.getFullYear();

  const fechaPlusOneMonth = new Date(
    Date.UTC(yearPlusOne, monthPlusOne, 1, 0, 0, 0, 0)
  );

  const handleDateChange = (e) => {
    const chanhedDate = new Date(e.target.value);
    const month = chanhedDate.getMonth() + 2;
    const year = chanhedDate.getFullYear();
    const updatedDate = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));
    setFecha(updatedDate);
  };

  const formatNumberWithDots = (number) => {
    if (number === undefined || number === null) {
      return '0';
    }
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  useEffect(() => {
    const fetchData = async () => {
      const month = fecha.getMonth() + 1;
      const year = fecha.getFullYear();

      const typeOfPurchaseResult = await axios(
        `/api/admin/products?action=aggregateTypeOfPurchase&month=${month}&year=${year}`
      );
      setConsumos(typeOfPurchaseResult.data.consumos || []);

      const paymentTypeResult = await axios(
        `/api/admin/products?action=aggregatePaymentType&month=${month}&year=${year}`
      );
      setPaymentTypeSums(paymentTypeResult.data);
    };
    fetchData();
  }, [fecha]);

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
      'Mesada Martina',
      'Mesada Rafaela',
    ],
    Servicios: [
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
    Carro: [
      'Gasolina',
      'Mantenimiento',
      'Lavado',
      'Parqueadero',
      'Peajes',
      'Papeles',
    ],
    Ocio: ['Ocio General', 'Viajes', 'Cumpleaños', 'Comidas afuera'],
    Ropa: ['Ropa Pollos', 'Ropa Papás'],
    Perros: ['Comida Perros', 'Guardería Perros', 'Medicina Perros'],
    Extracurriculares: ['Clases y Extracurriculares'],
    'Ob. financieras': [
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
        <div className="col-span-3 flex flex-col">
          <div>
            <input
              type="month"
              value={fechaPlusOneMonth.toISOString().substring(0, 7)}
              onChange={handleDateChange}
            />
          </div>

          <div className="mb-3">
            <h1 className="text-2xl font-bold border-b border-gray-300">
              Por Categoria
            </h1>
            <div className="grid grid-cols-1 gap-1 md:grid-cols-3">
              {aggregatedSums.map(({ mainCategory, totalSum }) => (
                <div key={mainCategory} className="card p-2 text-center">
                  <Link
                    href={`/admin/consumos/${mainCategory}`}
                    className="flex flex-col items-center justify-center"
                  >
                    <div className=" p-2 border-b border-gray-300 mb-2 font-bold">
                      {mainCategory}
                    </div>
                    <BsSpeedometer className="mx-auto" />
                    <p className="font-bold">
                      Total:
                      <br />
                      <span className="font-normal">
                        ${formatNumberWithDots(totalSum)}
                      </span>
                    </p>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-3">
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
                    <span className="font-normal">
                      ${formatNumberWithDots(totalValue)}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
