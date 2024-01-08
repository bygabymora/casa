import Layout from '../components/Layout.js';
import Product from '../models/Product.js';
import db from '../utils/db.js';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useReducer, useState } from 'react';
import { toast } from 'react-toastify';
import { getError } from '../utils/error.js';
import Link from 'next/link.js';

function reducer(state, action) {
  switch (action.type) {
    case 'CREATE_REQUEST':
      return { ...state, loadingCreate: true };
    case 'CREATE_SUCCESS':
      return { ...state, loadingCreate: false };
    case 'CREATE_FAIL':
      return { ...state, loadingCreate: false };

    default:
      return state;
  }
}

export default function Home() {
  const router = useRouter();

  const [{ loadingCreate, successDelete }, dispatch] = useReducer(reducer, {
    loading: true,
    products: [],
    error: '',
    loadingCreate: false,
  });

  const [categorySpent, setCategorySpent] = useState({});
  const formatNumberWithDots = (number) => {
    if (number === undefined || number === null) {
      return '0';
    }
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const createHandler = async () => {
    if (!window.confirm('ESTÁ SEGURO?')) {
      return;
    }
    try {
      dispatch({ type: 'CREATE_REQUEST' });
      const { data } = await axios.post(`/api/admin/products`);
      dispatch({ type: 'CREATE_SUCCESS' });
      toast.success('REGISTRO CREADO EXITOSAMENTE');
      router.push(`/admin/product/${data.product._id}`);
    } catch (err) {
      dispatch({ type: 'CREATE_FAIL' });
      toast.error(getError(err));
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/admin/products`);
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;

        const typeOfPurchaseResult = await axios(
          `/api/admin/products?action=aggregateTypeOfPurchase&month=${month}&year=${year}`
        );

        const initialCategorySpent = {
          'Comida y aseo': { spent: 0, maxAmount: 3000000 },
          'Extras Casa': { spent: 0, maxAmount: 1000000 },
          Medicinas: { spent: 0, maxAmount: 500000 },
          'Mesada Martina': { spent: 0, maxAmount: 100000 },
          'Mesada Rafaela': { spent: 0, maxAmount: 100000 },
          'Clases Pollos': { spent: 0, maxAmount: 370000 },
          Gasolina: { spent: 0, maxAmount: 880000 },
          Mantenimiento: { spent: 0, maxAmount: 200000 },
          Lavado: { spent: 0, maxAmount: 80000 },
          Parqueadero: { spent: 0, maxAmount: 50000 },
          Peajes: { spent: 0, maxAmount: 100000 },
          Papeles: { spent: 0, maxAmount: 100000 },
          'Ocio General': { spent: 0, maxAmount: 500000 },
          Viajes: { spent: 0, maxAmount: 400000 },
          Cumpleaños: { spent: 0, maxAmount: 400000 },
          'Comidas afuera': { spent: 0, maxAmount: 800000 },
          'Ropa Pollos': { spent: 0, maxAmount: 250000 },
          'Ropa Papás': { spent: 0, maxAmount: 250000 },
          'Comida Perros': { spent: 0, maxAmount: 300000 },
          'Guardería Perros': { spent: 0, maxAmount: 200000 },
          'Medicina Perros': { spent: 0, maxAmount: 100000 },
          // Add any other categories you need here in a similar fashion
        };

        // Update spent amounts for each category based on fetched data
        typeOfPurchaseResult.data.consumos.forEach((item) => {
          if (initialCategorySpent[item._id]) {
            initialCategorySpent[item._id].spent = item.totalValue;
          }
        });

        setCategorySpent(initialCategorySpent);
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [successDelete]);

  return (
    <Layout title="Home Page">
      <div className="grid grid-cols-3 my-10">
        <button
          disabled={loadingCreate}
          onClick={createHandler}
          className="primary-button align-middle  w-[70%]"
        >
          {loadingCreate ? 'Loading' : 'Crear Registro'}
        </button>
        <Link
          href="/admin/dashboard"
          className="primary-button align-middle text-center w-[70%]"
        >
          Dashboard
        </Link>
        <Link
          href="/admin/products"
          className="primary-button align-middle text-center w-[70%]"
        >
          Registros anteriores
        </Link>
      </div>
      <div>
        <h1 className="text-2xl my-3 font-bold border-b border-gray-300">
          Presupuesto disponible
        </h1>
        <div>
          <div className="grid grid-cols-3 mb-5">
            {Object.entries(categorySpent).map(([category, budget]) => (
              <div key={category}>
                {categorySpent[category].maxAmount > 0 && (
                  <div key={category}>
                    <h2 className="text-xl font-bold">{category}</h2>
                    <p>
                      <span className="font-bold">Gastado:</span> $
                      {formatNumberWithDots(budget.spent)}
                      <br />
                      <span className="font-bold">Máximo:</span> $
                      {formatNumberWithDots(budget.maxAmount)}
                      <br />
                      {budget.maxAmount - budget.spent < 0 && (
                        <div className="text-red-500">
                          <span className="font-bold">Restante:</span> $
                          {formatNumberWithDots(
                            budget.maxAmount - budget.spent
                          )}
                        </div>
                      )}
                      {budget.maxAmount - budget.spent > 0 && (
                        <div>
                          <span className="font-bold">Restante:</span> $
                          {formatNumberWithDots(
                            budget.maxAmount - budget.spent
                          )}
                        </div>
                      )}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
export async function getServerSideProps() {
  await db.connect();

  const products = await Product.find().sort({ createdAt: -1 }).lean();
  const serializableProducts = products.map((product) => {
    // Convert all Date objects to strings
    Object.keys(product).forEach((key) => {
      if (product[key] instanceof Date) {
        product[key] = product[key].toISOString();
      }
    });
    // Convert Mongoose documents to plain objects
    return db.convertDocToObj(product);
  });

  return {
    props: {
      products: serializableProducts,
    },
  };
}
