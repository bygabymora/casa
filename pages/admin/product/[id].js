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
        let dateValue = data.date;
        if (typeof dateValue === 'string') {
          dateValue = new Date(dateValue);
        }
        if (dateValue instanceof Date) {
          setValue('date', dateValue.toISOString().split('T')[0]);
        } else {
          console.error('Fecha no válida:', dateValue);
        }
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
      toast.success('Registro actualizado exitosamente.');
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
              <Link href="/admin/dashboard">Dashboard</Link>
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
                <label htmlFor="typeOfPurchase">Tipo de Compra</label>
                <select
                  className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                  id="typeOfPurchase"
                  {...register('typeOfPurchase', {
                    required: 'Por favor seleccione un tipo de compra',
                  })}
                >
                  <option value="">Selecciona un tipo de compra</option>
                  <optgroup label="Ingreso">
                    <option value="Salario FL">Salario FL</option>
                    <option value="Salario GM">Salario GM</option>
                    <option value="Otro ingreso">Otro Ingreso</option>
                  </optgroup>
                  <optgroup label="Categoría Casa">
                    <option value="Comida y aseo">Comida y aseo</option>
                    <option value="Extras Casa">Extras Casa</option>
                    <option value="Medicinas">Medicinas</option>
                    <option value="Colegio Niñas">Colegio Niñas</option>
                    <option value="María">María</option>
                    <option value="Clases Pollos">Clases Pollos</option>
                    <option value="Arriendo Casa">Arriendo Casa</option>
                    <option value="Administración">Administración</option>
                  </optgroup>

                  <optgroup label="Categoría Servicios Públicos">
                    <option value="Gas">Gas</option>
                    <option value="Luz">Luz</option>
                    <option value="Agua">Agua</option>
                    <option value="Internet">Internet</option>
                    <option value="Directv">Directv</option>
                    <option value="Netflix">Netflix</option>
                    <option value="Celular GMG">Celular GMG</option>
                    <option value="Operacional GMG">Operacional GMG</option>
                    <option value="Disney">Disney</option>
                    <option value="YouTube">YouTube</option>
                  </optgroup>

                  <optgroup label="Categoría Carro">
                    <option value="Gasolina">Gasolina</option>
                    <option value="Mantenimiento">Mantenimiento</option>
                    <option value="Lavado">Lavado</option>
                    <option value="Parqueadero">Parqueadero</option>
                    <option value="Peajes">Peajes</option>
                    <option value="Papeles">Papeles</option>
                  </optgroup>

                  <optgroup label="Categoría Ocio">
                    <option value="Ocio General">Ocio General</option>
                    <option value="Viajes">Viajes</option>
                    <option value="Cumpleaños">Cumpleaños</option>
                    <option value="Comidas afuera">Comidas afuera</option>
                  </optgroup>

                  <optgroup label="Categoría Ropa">
                    <option value="Ropa Pollos">Ropa Pollos</option>
                    <option value="Ropa Papás">Ropa Papás</option>
                  </optgroup>

                  <optgroup label="Categoría Perros">
                    <option value="Comida Perros">Comida Perros</option>
                    <option value="Guardería Perros">Guardería Perros</option>
                    <option value="Medicina Perros">Medicina Perros</option>
                  </optgroup>

                  <optgroup label="Categoría Extracurriculares">
                    <option value="Clases y Extracurriculares">
                      Clases y Extracurriculares
                    </option>
                  </optgroup>

                  <optgroup label="Categoría Ob. financieras">
                    <option value="Crédito Bancolombia">
                      Crédito Bancolombia
                    </option>
                    <option value="Crédito Banco Bogotá">
                      Crédito Banco Bogotá
                    </option>
                    <option value="Pago TC Master">Pago TC Master</option>
                    <option value="Pago TC Visa">Pago TC Visa</option>
                    <option value="Pago TC Bancolombia">
                      Pago TC Bancolombia
                    </option>
                  </optgroup>
                </select>
                {errors.typeOfPurchase && (
                  <div className="text-red-500">
                    {errors.typeOfPurchase.message}
                  </div>
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
                <label htmlFor="paymentType">Sistema de Registro</label>
                <select
                  className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                  id="paymentType"
                  {...register('paymentType', {
                    required: 'Por favor seleccione un tipo de pago',
                  })}
                >
                  <option value="">Selecciona un tipo de pago</option>
                  <option value="TC Master">TC Master</option>
                  <option value="TC Visa">TC Visa</option>
                  <option value="TC Bancolombia">TC Bancolombia</option>
                  <option value="Efectivo">Efectivo</option>
                </select>
                {errors.paymentType && (
                  <div className="text-red-500">
                    {errors.paymentType.message}
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
