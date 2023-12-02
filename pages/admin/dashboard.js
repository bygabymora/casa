import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout';
import Link from 'next/link';
import { BsSpeedometer } from 'react-icons/bs';

export default function Dashboard() {
  const [fecha, setFecha] = useState(new Date());
  const [totalIngresos, setTotalIngresos] = useState(0);
  const [totalConsumos, setTotalConsumos] = useState(0);
  const [balance, setBalance] = useState(0);
  const formatNumberWithDots = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };
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
      // Obtener los ingresos
      const ingresosResult = await axios(
        `/api/admin/products?action=aggregateTypeOfPurchase&month=${month}&year=${year}`
      );
      const totalIngresos = ingresosResult.data
        .filter(
          (item) =>
            item._id === 'Salario FL' ||
            item._id === 'Salario GM' ||
            item._id === 'Otro ingreso'
        )
        .reduce((sum, item) => sum + item.totalValue, 0);

      // Obtener los consumos
      const consumosResult = await axios(
        `/api/admin/products?action=aggregatePaymentType&month=${month}&year=${year}`
      );
      const totalConsumos = consumosResult.data.reduce(
        (sum, item) => sum + item.totalValue,
        0
      );

      // Calcular el balance
      const balance = totalIngresos - totalConsumos;

      // Actualizar estados
      setTotalIngresos(totalIngresos);
      setTotalConsumos(totalConsumos);
      setBalance(balance);
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
              <div className="mt-4">
                <h2 className="text-xl font-bold">Resumen Financiero</h2>
                <p>Total Ingresos: ${formatNumberWithDots(totalIngresos)}</p>
                <p>Total Consumos: ${formatNumberWithDots(totalConsumos)}</p>

                <p>Balance: ${formatNumberWithDots(balance)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
