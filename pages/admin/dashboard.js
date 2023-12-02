import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout';
import Link from 'next/link';
import { BsSpeedometer } from 'react-icons/bs';

export default function Dashboard() {
  const [fecha, setFecha] = useState(new Date());
  const [totalIngresos, setTotalIngresos] = useState(0);
  const [totalConsumos, setTotalConsumos] = useState(0);

  const formatNumberWithDots = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };
  const [mesadaRafaela, setMesadaRafaela] = useState(100000);
  const [mesadaMartina, setMesadaMartina] = useState(100000);
  const [mesadaRafaelaTotal, setMesadaRafaelaTotal] = useState(0);
  const [mesadaMartinaTotal, setMesadaMartinaTotal] = useState(0);

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

  useEffect(() => {
    const month = fecha.getMonth() + 1;
    const year = fecha.getFullYear();

    const fetchData = async () => {
      try {
        const ingresosResponse = await axios(
          `/api/admin/products?action=aggregateTypeOfPurchase&month=${month}&year=${year}`
        );
        const consumosResponse = await axios(
          `/api/admin/products?action=aggregatePaymentType&month=${month}&year=${year}`
        );

        // Asegúrate de que las respuestas son objetos con las propiedades esperadas
        if (
          ingresosResponse.data &&
          typeof ingresosResponse.data === 'object'
        ) {
          const { consumos, mesadaRafaela, mesadaMartina } =
            ingresosResponse.data;

          const totalIngresos = consumos
            .filter((item) =>
              ['Salario FL', 'Salario GM', 'Otro ingreso'].includes(item._id)
            )
            .reduce((sum, item) => sum + item.totalValue, 0);

          setMesadaRafaela(100000 - mesadaRafaela);
          setMesadaMartina(100000 - mesadaMartina);
          setMesadaRafaelaTotal(mesadaRafaela);
          setMesadaMartinaTotal(mesadaMartina);
          setTotalIngresos(totalIngresos);
        }

        if (Array.isArray(consumosResponse.data)) {
          const totalConsumos = consumosResponse.data.reduce(
            (sum, item) => sum + item.totalValue,
            0
          );
          setTotalConsumos(totalConsumos);
        }
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    fetchData();
  }, [fecha]);

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
            <BsSpeedometer />
            <br />

            <div className="grid grid-cols-1 gap-1 md:grid-cols-3">
              <div className="card p-2 text-center">
                <h2 className="text-xl font-bold">Resumen Financiero</h2>
                <p>Total Ingresos: ${formatNumberWithDots(totalIngresos)}</p>
                <p>Total Consumos: ${formatNumberWithDots(totalConsumos)}</p>

                <p>
                  Balance: $
                  {formatNumberWithDots(totalIngresos - totalConsumos)}
                </p>
              </div>
              <div className="card p-2 text-center">
                <h2 className="text-xl font-bold">Mesada Rafa</h2>
                <p>Inicial: ${formatNumberWithDots(100000)}</p>
                <p>
                  Total Consumos: ${formatNumberWithDots(mesadaRafaelaTotal)}
                </p>

                <p>Balance: ${formatNumberWithDots(mesadaRafaela)}</p>
              </div>
              <div className="card p-2 text-center">
                <h2 className="text-xl font-bold">Mesada Marti</h2>
                <p>Inicial: ${formatNumberWithDots(100000)}</p>
                <p>
                  Total Consumos: ${formatNumberWithDots(mesadaMartinaTotal)}
                </p>

                <p>Balance: ${formatNumberWithDots(mesadaMartina)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
