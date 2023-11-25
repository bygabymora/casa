import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import CheckoutWizard from '../components/CheckoutWizard';
import { useForm } from 'react-hook-form';
import { useContext } from 'react';
import { Store } from '../utils/Store';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useSession } from 'next-auth/react';

export default function ShippingScreen() {
  const usStates = [
    'Amazonas',
    'Antioquia',
    'Arauca',
    'Atlántico',
    'Bogotá D.C.',
    'Bolívar',
    'Boyacá',
    'Caldas',
    'Caquetá',
    'Casanare',
    'Cauca',
    'Cesar',
    'Chocó',
    'Córdoba',
    'Cundinamarca',
    'Guainía',
    'Guaviare',
    'Huila',
    'La Guajira',
    'Magdalena',
    'Meta',
    'Nariño',
    'Norte de Santander',
    'Putumayo',
    'Quindío',
    'Risaralda',
    'San Andrés y Providencia',
    'Santander',
    'Sucre',
    'Tolima',
    'Valle del Cauca',
    'Vaupés',
    'Vichada',
  ];

  const [filteredStates, setFilteredStates] = useState(usStates);
  const { data: session } = useSession();
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false); // Add state for tracking the visibility of suggestions

  const [selectedSuggestion, setSelectedSuggestion] = useState(-1); // Initialize to -1, meaning no suggestion is selected
  const [lastOrder, setLastOrder] = useState(null);
  const [useLastAddress, setUseLastAddress] = useState(false);

  const handleStateChange = (event) => {
    const inputValue = event.target.value.toLowerCase();
    setInputValue(inputValue);
    let filteredOptions = [];
    if (inputValue.length >= 3) {
      filteredOptions = usStates.filter((state) =>
        state.toLowerCase().startsWith(inputValue)
      );
    }
    setFilteredStates(filteredOptions);
    setShowSuggestions(true);
    setSelectedSuggestion(-1); // Reset the selected suggestion when input value changes
  };

  const handleSelectState = (state) => {
    if (state === 'Bogotá D.C.') {
      setValue('city', 'Bogotá D.C.');
    }
    setValue('state', state);
    setShowSuggestions(false);
    setSelectedSuggestion(-1); // Reset the selected suggestion when an option is clicked
  };

  const handleKeyDown = (event) => {
    if (filteredStates.length > 0) {
      if (event.key === 'ArrowDown') {
        // Move selection down when ArrowDown key is pressed
        setSelectedSuggestion((prev) =>
          prev < filteredStates.length - 1 ? prev + 1 : prev
        );
      } else if (event.key === 'ArrowUp') {
        // Move selection up when ArrowUp key is pressed
        setSelectedSuggestion((prev) => (prev > 0 ? prev - 1 : prev));
      } else if (event.key === 'Enter') {
        // Select the currently highlighted suggestion when Enter key is pressed
        if (selectedSuggestion !== -1) {
          handleSelectState(filteredStates[selectedSuggestion]);
        }
      }
    }
  };

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm();

  const router = useRouter();

  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const { shippingAddress } = cart;

  useEffect(() => {
    setValue('fullName', shippingAddress.fullName);
    setValue('phone', shippingAddress.phone);
    setValue('address', shippingAddress.address);
    setValue('state', shippingAddress.state);
    setValue('city', shippingAddress.city);
    setValue('postalCode', shippingAddress.postalCode);
    setValue('notes', shippingAddress.notes);
  }, [setValue, shippingAddress]);

  const submitHandler = ({
    fullName,

    phone,
    address,
    state,
    city,
    postalCode,
    notes,
  }) => {
    dispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: { fullName, phone, address, state, city, postalCode, notes },
    });
    Cookies.set(
      'cart',
      JSON.stringify({
        ...cart,
        shippingAddress: {
          fullName,
          phone,
          address,
          state,
          city,
          postalCode,
          notes,
        },
      })
    );

    router.push('/payment');
  };

  useEffect(() => {
    const fetchLastOrder = async () => {
      try {
        const { data } = await axios.get('/api/orders/lastOrder');
        setLastOrder(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchLastOrder();
  }, []);

  useEffect(() => {
    setValue('fullName', session?.user?.name);
    if (useLastAddress && lastOrder) {
      const { shippingAddress } = lastOrder;
      setValue('fullName', shippingAddress.fullName);
      setValue('phone', shippingAddress.phone);
      setValue('address', shippingAddress.address);
      setValue('state', shippingAddress.state);
      setValue('city', shippingAddress.city);
      setValue('postalCode', shippingAddress.postalCode);
      setValue('notes', shippingAddress.notes);
    }
  }, [lastOrder, session?.user?.name, setValue, useLastAddress]);

  return (
    <Layout title="Dirección de envío">
      <CheckoutWizard activeStep={1}></CheckoutWizard>
      <form
        className="mx-auto max-w-screen-md w-full "
        onSubmit={handleSubmit(submitHandler)}
      >
        <div>
          <h1 className="text-2xl font-bold">Dirección de envío</h1>
          <br />
          <p>
            El envío tiene un valor de $12.000 en Bogotá D.C. y de $15.000 en el
            resto del país.
          </p>

          <p className="text-lg font-bold">
            ¡Si tu orden es mayor a $80.000 el envío es gratis!
          </p>
        </div>
        {lastOrder && (
          <div className="mb-2 mt-2">
            <label htmlFor="useLastAddress" className="font-bold">
              Deseas usar la dirección de su último pedido?
            </label>{' '}
            &nbsp;
            <input
              type="checkbox"
              id="useLastAddress"
              checked={useLastAddress}
              onChange={(e) => setUseLastAddress(e.target.checked)}
            />
            <div className="mb-2">
              <p className="text-sm">
                {lastOrder.shippingAddress.fullName}
                <br />{' '}
                {lastOrder.shippingAddress.phone && (
                  <>
                    {lastOrder.shippingAddress.phone} <br />{' '}
                  </>
                )}
                {lastOrder.shippingAddress.address}
                <br /> {lastOrder.shippingAddress.state}
                <br /> {lastOrder.shippingAddress.city}
                <br /> {lastOrder.shippingAddress.postalCode}
                <br />{' '}
              </p>
            </div>
          </div>
        )}
        <div className="mb-4 contact__form-div">
          <label htmlFor="fullName">Nombre completo*</label>
          <input
            className="w-full contact__form-input"
            type="text"
            id="fullName"
            placeholder="Ingrese el nombre completo"
            {...register('fullName', { required: true, minLength: 3 })}
            autoFocus
            autoCapitalize="true"
            required
          />
          {errors.fullName && (
            <p className="text-red-500">El nombre es requerido.</p>
          )}
        </div>
        <div className="mb-4 contact__form-div">
          <label htmlFor="phone">Teléfono*</label>
          <input
            className="w-full contact__form-input"
            type="text"
            id="phone"
            placeholder="Ingrese el teléfono"
            {...register('phone', { required: true, minLength: 3 })}
            autoCapitalize="true"
            required
          />
          {errors.phone && (
            <p className="text-red-500">El teléfono es requerido.</p>
          )}
        </div>

        <div className="mb-4 contact__form-div">
          <label htmlFor="address">Dirección*</label>
          <input
            className="w-full contact__form-input"
            type="text"
            id="adress"
            placeholder="Ingrese la dirección"
            {...register('address', { required: true, minLength: 3 })}
            autoCapitalize="true"
            required
          />
          {errors.address && (
            <p className="text-red-500">La dirección es requerida.</p>
          )}
        </div>
        <div className="mb-4 contact__form-div">
          <label htmlFor="state">Departamento o Bogotá D.C.*</label>
          <input
            className="w-full contact__form-input"
            type="text"
            id="state"
            placeholder="Ingrese el departamento"
            {...register('state', { required: true, minLength: 3 })}
            onChange={handleStateChange}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={handleKeyDown} // Add the onKeyDown event handler
            autoCapitalize="true"
            required
          />
          {errors.state && (
            <p className="text-red-500">El departamento es requerido.</p>
          )}
          {filteredStates.length > 0 &&
            inputValue.length >= 3 &&
            showSuggestions && (
              <div className="mt-2 bg-white border border-gray-300 rounded-md absolute z-10 w-full">
                {filteredStates.map((state, index) => (
                  <div
                    key={index}
                    className={`cursor-pointer py-1 px-4 hover:bg-gray-200 ${
                      index === selectedSuggestion ? 'bg-gray-200' : ''
                    }`} // Highlight the selected suggestion
                    onClick={() => handleSelectState(state)}
                  >
                    {state}
                  </div>
                ))}
              </div>
            )}
        </div>
        <div className="mb-4 contact__form-div">
          <label htmlFor="city">Ciudad*</label>
          <input
            className="w-full contact__form-input"
            type="text"
            id="city"
            placeholder="Ingrese la ciudad"
            {...register('city', { required: true, minLength: 3 })}
            autoCapitalize="true"
            required
          />
          {errors.city && (
            <p className="text-red-500">La ciudad es requerida.</p>
          )}
        </div>
        <div className="mb-4 contact__form-div">
          <label htmlFor="postalCode">Código Postal*</label>
          <input
            className="w-full contact__form-input"
            type="text"
            id="postalCode"
            placeholder="Ingrese el código postal"
            {...register('postalCode', { required: true, minLength: 3 })}
            autoCapitalize="true"
            required
          />
          {errors.postalCode && (
            <p className="text-red-500">El código postal es requerido.</p>
          )}
        </div>
        <div className="mb-4 contact__form-div">
          <label htmlFor="notes">Notas</label>
          <input
            className="w-full contact__form-input"
            type="text"
            id="notes"
            placeholder="Ingrese las notas"
            {...register('notes', { required: false, minLength: 3 })}
            autoCapitalize="true"
          />
          {errors.notes && (
            <p className="text-red-500">Las notas son requeridas.</p>
          )}
        </div>

        <div className="mb-4 contact__form-div">
          <button className="primary-button w-full" type="submit">
            Continuar
          </button>
        </div>
      </form>
    </Layout>
  );
}

ShippingScreen.auth = true;
