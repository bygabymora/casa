import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useReducer } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Layout from '../../../components/Layout';
import { getError } from '../../../utils/error';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true, errorUpdate: '' };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false, errorUpdate: '' };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false, errorUpdate: action.payload };

    case 'UPLOAD_REQUEST':
      return { ...state, loadingUpload: true, errorUpload: '' };
    case 'UPLOAD_SUCCESS':
      return {
        ...state,
        loadingUpload: false,
        errorUpload: '',
      };
    case 'UPLOAD_FAIL':
      return { ...state, loadingUpload: false, errorUpload: action.payload };

    default:
      return state;
  }
}
export default function AdminProductEditScreen() {
  const { query } = useRouter();
  const productId = query.id;
  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });

        const { data } = await axios.get(`/api/admin/products/${productId}`);
        dispatch({ type: 'FETCH_SUCCESS' });
        setValue('name', data.name);
        setValue('slug', data.slug);
        setValue('store', data.store);
        setValue('value', data.value);
        setValue('paymentType', data.paymentType);
        setValue('typeOfPurchase', data.typeOfPurchase);
        setValue('notes', data.notes);
        const existingDate = data.date.toISOString().split('T')[0];
        setValue('date', existingDate);
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    fetchData();
  }, [productId, setValue]);

  const router = useRouter();

  const submitHandler = async ({
    name,
    slug,
    store,
    value,
    paymentType,
    typeOfPurchase,
    notes,
    date,
  }) => {
    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      const dateObject = new Date(date);
      await axios.put(`/api/admin/products/${productId}`, {
        name,
        slug,
        store,
        value,
        paymentType,
        typeOfPurchase,
        notes,
        date: dateObject,
      });
      dispatch({ type: 'UPDATE_SUCCESS' });
      toast.success('Product updated successfully');
      router.push('/admin/products');
    } catch (err) {
      dispatch({ type: 'UPDATE_FAIL', payload: getError(err) });
      toast.error(getError(err));
    }
  };

  return (
    <Layout title={`Edit Product ${productId}`}>
      <div className="grid md:grid-cols-4 md:gap-5">
        <div>
          <ul>
            <li>
              <Link href="/admin/dashboard">Pánel</Link>
            </li>
            <li>
              <Link href="/admin/orders">Consumos</Link>
            </li>
            <li>
              <Link href="/admin/products">Registros</Link>
            </li>
            <li>
              <Link href="/admin/users" className="font-bold">
                Usuarios
              </Link>
            </li>
          </ul>
        </div>
        <div className="md:col-span-3">
          {loading ? (
            <div>Cargando...</div>
          ) : error ? (
            <div className="alert-error">{error}</div>
          ) : (
            <form
              className="mx-auto max-w-screen-md"
              onSubmit={handleSubmit(submitHandler)}
            >
              <h1 className="mb-4 text-xl">{`Editar Registro ${productId
                .substring(productId.length - 8)
                .toUpperCase()}`}</h1>
              <div className="mb-4">
                <label htmlFor="slug">Registro #</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                  id="slug"
                  autoFocus
                  readOnly
                  {...register('slug', {
                    required: 'Por favor ingrese un slug',
                  })}
                />
                {errors.slug && (
                  <div className="text-red-500">{errors.slug.message}</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="name">Nombre</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                  id="name"
                  autoFocus
                  {...register('name', {
                    required: 'Por favor ingrese un nombre',
                  })}
                />
                {errors.name && (
                  <div className="text-red-500">{errors.name.message}</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="store">Tienda</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                  id="store"
                  {...register('store', {
                    required: 'Por favor ingrese una tienda',
                  })}
                />
                {errors.store && (
                  <div className="text-red-500">{errors.store.message}</div>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="value">Valor</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                  id="value"
                  {...register('value', {
                    required: 'Por favor ingrese un valor',
                  })}
                />
                {errors.value && (
                  <div className="text-red-500">{errors.value.message}</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="category">Tipo de Pago</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                  id="paymentType"
                  {...register('paymentType', {
                    required: 'Por favor ingrese un tipo de pago',
                  })}
                />
                {errors.paymentType && (
                  <div className="text-red-500">
                    {errors.paymentType.message}
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="category">Tipo de Compra</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                  id="typeOfPurchase"
                  {...register('typeOfPurchase', {
                    required: 'Por favor ingrese un tipo de compra',
                  })}
                />
                {errors.typeOfPurchase && (
                  <div className="text-red-500">
                    {errors.typeOfPurchase.message}
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="category">Notas</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                  id="notes"
                  {...register('notes', {
                    required: 'Por favor ingrese notas',
                  })}
                />
                {errors.notes && (
                  <div className="text-red-500">{errors.notes.message}</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="date">Fecha</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                  id="date"
                  {...register('date', {
                    required: 'Por favor ingrese una fecha',
                  })}
                />
                {errors.date && (
                  <div className="text-red-500">{errors.date.message}</div>
                )}
              </div>

              <div className="flex flex-row">
                <div className="mb-4">
                  <button
                    disabled={loadingUpdate}
                    className="primary-button mr-2"
                  >
                    {loadingUpdate ? 'Cargando' : 'Actualizar'}
                  </button>
                </div>
                <div className="mb-4">
                  <button
                    onClick={() => router.push(`/`)}
                    className="primary-button"
                  >
                    Atrás
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
}

AdminProductEditScreen.auth = { adminOnly: true };
