import Layout from '../components/Layout.js';
import Product from '../models/Product.js';
import db from '../utils/db.js';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useReducer } from 'react';
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
      <div className="flex flex-col items-center justify-center h-screen gap-10">
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
