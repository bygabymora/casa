import axios from 'axios';
import Link from 'next/link';
import { Bar } from 'react-chartjs-2';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import React, { useEffect, useReducer, useState } from 'react';
import Layout from '../../components/Layout';
import { getError } from '../../utils/error';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
  },
};

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, summary: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      state;
  }
}
function AdminDashboardScreen() {
  const [activeChart, setActiveChart] = useState('sales');
  const chartTitles = {
    sales: 'Reporte de Ventas',
    orders: 'Reporte de Órdenes',
    products: 'Reporte de Productos',
    users: 'Reporte de Usuarios',
  };
  const [{ loading, error, summary }, dispatch] = useReducer(reducer, {
    loading: true,
    summary: null,
    error: '',
  });

  let data = {};

  if (summary) {
    switch (activeChart) {
      case 'sales':
        data = {
          labels: summary.salesData.map((x) => x._id),
          datasets: [
            {
              label: 'Ventas',
              backgroundColor: 'rgba(162, 222, 208, 1)',
              data: summary.salesData.map((x) => x.totalSales),
            },
          ],
        };
        break;
      case 'orders':
        data = {
          labels: summary.salesData ? summary.salesData.map((x) => x._id) : [],
          datasets: [
            {
              label: 'Cantidad de Órdenes',
              backgroundColor: 'rgba(162, 222, 208, 1)',
              data: summary.salesData
                ? summary.salesData.map((x) => x.orderCount)
                : [],
            },
          ],
        };
        break;
      case 'products':
        data = {
          labels: summary.salesPerProduct.map((x) => x._id),
          datasets: [
            {
              label: 'Cantidad de Productos Vendidos',
              backgroundColor: 'rgba(162, 222, 208, 1)',
              data: summary.salesPerProduct.map((x) => x.totalQuantity),
            },
          ],
        };
        break;
      case 'users':
        data = {
          labels: summary.totalPricePerUser.map((x) => x._id), // This will be user's name now
          datasets: [
            {
              label: 'Dinero Gastado',
              backgroundColor: 'rgba(162, 222, 208, 1)',
              data: summary.totalPricePerUser.map((x) => x.totalSpent),
            },
          ],
        };
        break;
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/admin/summary`);
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    fetchData();
  }, []);

  return (
    <Layout title="Admin Dashboard">
      <div className="grid  md:grid-cols-4 md:gap-5">
        <div>
          <ul>
            <li>
              <Link href="/admin/dashboard">Pánel</Link>
            </li>
            <li>
              <Link href="/admin/dashboard">Consumos</Link>
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
        <div className="md:col-span-3">
          <h1 className="mb-4 text-xl">Panel de administrador</h1>
          {loading ? (
            <div>Cargando...</div>
          ) : error ? (
            <div className="alert-error">{error}</div>
          ) : (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-4">
                <div className="card m-5 p-5">
                  <p>
                    $
                    {summary.ordersPrice.toLocaleString('en-US', {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                  </p>
                  <p className="font-bold">Ventas</p>
                  <a
                    className="underline hover:cursor-pointer"
                    onClick={() => setActiveChart('sales')}
                  >
                    Ver ventas
                  </a>
                </div>

                <div className="card m-5 p-5">
                  <p>{summary.ordersCount} </p>
                  <p className="font-bold">Órdenes</p>
                  <a
                    className="underline hover:cursor-pointer "
                    onClick={() => setActiveChart('orders')}
                  >
                    Ver Órdenes
                  </a>
                </div>
                <div className="card m-5 p-5">
                  <p>{summary.productsCount} </p>
                  <p className="font-bold">Productos</p>
                  <a
                    className="underline hover:cursor-pointer"
                    onClick={() => setActiveChart('products')}
                  >
                    Ver Productos
                  </a>
                </div>
                <div className="card m-5 p-5">
                  <p>{summary.usersCount} </p>
                  <p className="font-bold">Usuarios</p>
                  <a
                    className="underline hover:cursor-pointer"
                    onClick={() => setActiveChart('users')}
                  >
                    Ver Usuarios
                  </a>
                </div>
              </div>
              <h2 className="text-xl">{chartTitles[activeChart]}</h2>
              {summary && (
                <Bar
                  options={{
                    legend: { display: true, position: 'right' },
                  }}
                  data={data}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

AdminDashboardScreen.auth = { adminOnly: true };
export default AdminDashboardScreen;
