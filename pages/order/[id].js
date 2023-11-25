import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router'; // Removed unnecessary import for Router
import { useEffect, useReducer, useRef, useState } from 'react';
import Layout from '../../components/Layout';
import { getError } from '../../utils/error';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';
import { AiTwotoneLock } from 'react-icons/ai';
import Mercadopago from '../../public/images/assets/mercadopago.png';
import emailjs from '@emailjs/browser';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'PAY_REQUEST':
      return { ...state, loadingPay: true };
    case 'PAY_SUCCESS':
      return { ...state, loadingPay: false, successPay: true };
    case 'PAY_FAIL':
      return { ...state, loadingPay: false, errorPay: action.payload };
    case 'PAY_RESET':
      return { ...state, loadingPay: false, successPay: false, errorPay: '' };
    case 'DELIVER_REQUEST':
      return { ...state, loadingDeliver: true };
    case 'DELIVER_SUCCESS':
      return { ...state, loadingDeliver: false, successDeliver: true };
    case 'DELIVER_FAIL':
      return { ...state, loadingDeliver: false };
    case 'DELIVER_RESET':
      return {
        ...state,
        loadingDeliver: false,
        successDeliver: false,
      };
    case 'AT_COSTUMERS_REQUEST':
      return { ...state, loadingAtCostumers: true };
    case 'AT_COSTUMERS_SUCCESS':
      return { ...state, loadingAtCostumers: false, successAtCostumers: true };
    case 'AT_COSTUMERS_FAIL':
      return { ...state, loadingAtCostumers: false, successAtCostumers: false };
    default:
      return state; // Fixed the missing return statement here
  }
}

function OrderScreen() {
  const formatNumberWithDots = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };
  const { data: session } = useSession();
  const [paymentComplete, setPaymentComplete] = useState(false);

  const { query } = useRouter();
  const orderId = query.id;
  const trackUrlRef = useRef(null);
  const trackNumberRef = useRef(null);

  const [
    {
      loading,
      error,
      order,
      successPay,
      loadingPay,
      loadingDeliver,
      successDeliver,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    order: {},
    error: '',
  });

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/${orderId}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    if (
      !order._id ||
      successPay ||
      successDeliver ||
      (order._id && order._id !== orderId)
    ) {
      fetchOrder();
      if (successPay) {
        dispatch({ type: 'PAY_RESET' });
      }
      if (successDeliver) {
        dispatch({ type: 'DELIVER_RESET' });
      }
    }
  }, [order, orderId, successPay, successDeliver]);

  const {
    shippingAddress,
    paymentMethod,
    orderItems,
    itemsPrice,
    taxPrice,
    totalPrice,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
    trackUrl,
    trackNumber,
  } = order;

  const brutPrice = itemsPrice * 0.81;
  useEffect(() => {
    if (
      order &&
      order.paymentMethod === 'Contraentrega' &&
      order.shippingAddress
    ) {
      const createdAt = new Date(order.createdAt);
      const now = new Date();
      const oneMinute = 10 * 1000;
      if (now - createdAt < oneMinute) {
        sendEmail4();
      }
    } else if (
      order &&
      order.paymentMethod === 'Mercadopago' &&
      order.shippingAddress
    ) {
      const createdAt = new Date(order.createdAt);
      const now = new Date();
      const oneMinute = 10 * 1000;
      if (now - createdAt < oneMinute) {
        sendEmail5();
      }
    }
  }, [order]);

  //----EmailJS----//

  const form = useRef();

  const userEmail = order.user?.email || '';

  function sendEmail() {
    const formData = new FormData();

    formData.append('user_name', shippingAddress.fullName);
    formData.append('user_phone', shippingAddress.phone);
    formData.append('user_email', userEmail);
    formData.append('total_order', totalPrice);
    formData.append('payment_method', paymentMethod);
    formData.append('shipping_preference', shippingAddress.notes);

    emailjs
      .sendForm(
        'service_45krz9b',
        'template_p6qbr62',
        form.current,
        'LuJZSocJe5a_St7dQ'
      )
      .then(
        (result) => {
          console.log('Email enviado', result.text);
        },
        (error) => {
          console.log('Error al enviar mensaje', error.text);
        }
      );
  }
  function sendEmail3() {
    const formData = new FormData();

    formData.append('user_name', shippingAddress.fullName);
    formData.append('user_phone', shippingAddress.phone);
    formData.append('user_email', userEmail);
    formData.append('total_order', totalPrice);
    formData.append('payment_method', paymentMethod);
    formData.append('shipping_preference', shippingAddress.notes);
    formData.append('track_url', trackUrlRef);
    formData.append('track_number', trackNumberRef);

    emailjs
      .sendForm(
        'service_45krz9b',
        'template_emnnp5b',
        form.current,
        'LuJZSocJe5a_St7dQ'
      )
      .then(
        (result) => {
          console.log('Email enviado', result.text);
        },
        (error) => {
          console.log('Error al enviar mensaje', error.text);
        }
      );
  }
  function sendEmail2() {
    const formData = new FormData();

    formData.append('user_name', shippingAddress.fullName);
    formData.append('user_phone', shippingAddress.phone);
    formData.append('user_email', userEmail);
    formData.append('total_order', totalPrice);
    formData.append('payment_method', paymentMethod);
    formData.append('shipping_preference', shippingAddress.notes);
    formData.append('track_url', trackUrlRef.current.value);
    formData.append('track_number', trackNumberRef.current.value);

    emailjs
      .sendForm(
        'service_45krz9b',
        'template_tke8ycv',
        form.current,
        'LuJZSocJe5a_St7dQ'
      )
      .then(
        (result) => {
          console.log('Email enviado', result.text);
        },
        (error) => {
          console.log('Error al enviar mensaje', error.text);
        }
      );
  }
  function sendEmail4() {
    const formData = new FormData();

    formData.append('user_name', shippingAddress.fullName);
    formData.append('user_phone', shippingAddress.phone);
    formData.append('user_email', userEmail);
    formData.append('total_order', totalPrice);
    formData.append('payment_method', paymentMethod);
    formData.append('shipping_preference', shippingAddress.notes);
    formData.append('full_order_id', orderId);

    emailjs
      .sendForm(
        'service_45krz9b',
        'template_htcwujt',
        form.current,
        'LuJZSocJe5a_St7dQ'
      )
      .then(
        (result) => {
          console.log('Email enviado', result.text);
        },
        (error) => {
          console.log('Error al enviar mensaje', error.text);
        }
      );
  }
  function sendEmail5() {
    const formData = new FormData();

    formData.append('user_name', shippingAddress.fullName);
    formData.append('user_phone', shippingAddress.phone);
    formData.append('user_email', userEmail);
    formData.append('total_order', totalPrice);
    formData.append('payment_method', paymentMethod);
    formData.append('shipping_preference', shippingAddress.notes);
    formData.append('full_order_id', orderId);

    emailjs
      .sendForm(
        'service_45krz9b',
        'template_i95meue',
        form.current,
        'LuJZSocJe5a_St7dQ'
      )
      .then(
        (result) => {
          console.log('Email enviado', result.text);
        },
        (error) => {
          console.log('Error al enviar mensaje', error.text);
        }
      );
  }

  //-----------//

  const handlePayment = async () => {
    try {
      dispatch({ type: 'PAY_REQUEST' });
      const { data } = await axios.put(`/api/orders/${order._id}/pay`);
      dispatch({ type: 'PAY_SUCCESS', payload: data });
      toast.success('La orden se ha pagado de manera exitosa.');

      setPaymentComplete(true);
      sendEmail3();
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      dispatch({ type: 'PAY_FAIL', payload: getError(error) });
      toast.error(getError(error));
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('status');

    if (paymentStatus === 'success') {
      const handleAprove = async () => {
        try {
          dispatch({ type: 'PAY_REQUEST' });
          const { data } = await axios.put(
            `/api/orders/${orderId}/pay`,
            console.log(orderId)
            // Include any necessary payload here
          );
          dispatch({ type: 'PAY_SUCCESS', payload: data });
          toast.success('La orden se ha pagado de manera exitosa.');

          setPaymentComplete(true);
          sendEmail();
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } catch (error) {
          dispatch({ type: 'PAY_FAIL', payload: getError(error) });
          toast.error(getError(error));
        }
      };
      urlParams.delete('status');
      window.history.replaceState(
        {},
        document.title,
        window.location.pathname + '?' + urlParams.toString()
      );
      handleAprove();
    }
  }, [order._id]);

  const handleButtonClick = () => {
    handlePayment();
    console.log(userEmail);
  };

  const handleMercadoPagoClick = async () => {
    try {
      const response = await axios.post('/api/mercadopago', {
        totalPrice,
        orderId,
      });
      const { init_point } = response.data;
      window.location.href = init_point;
    } catch (error) {
      console.error('Detalle del error:', error.response.data);
      console.error('Error al obtener la URL de MercadoPago', error);
    }
  };
  async function deliverOrderHandler(e) {
    e.preventDefault();

    const trackUrl = trackUrlRef.current.value;
    const trackNumber = trackNumberRef.current.value;

    if (!trackUrl.trim() || !trackNumber.trim()) {
      toast.error('Por favor ingrese la URL y el número de seguimiento');
      return;
    }

    try {
      dispatch({ type: 'DELIVER_REQUEST' });

      const { data } = await axios.put(
        `/api/admin/orders/${order._id}/deliver`,
        {
          trackUrl: trackUrl,
          trackNumber: trackNumber,
        }
      );

      dispatch({ type: 'DELIVER_SUCCESS', payload: data });
      toast.success('Orden enviada correctamente');
      sendEmail2();
    } catch (err) {
      dispatch({ type: 'DELIVER_FAIL', payload: getError(err) });
      toast.error(getError(err));
    }
  }

  return (
    <Layout
      title={`Orden ${orderId.substring(orderId.length - 8).toUpperCase()}`}
    >
      <h1 className="mb-4 text-xl">{`Order ${orderId
        .substring(orderId.length - 8)
        .toUpperCase()}`}</h1>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="alert-error">{error}</div>
      ) : paymentComplete ? (
        <div className="alert-success">
          Pago redireccionado exitosamente. Redirecionando...
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-2">
          <div className="overflow-x-auto md:col-span-3">
            <div className="card  p-3">
              <h2 className="mb-2 text-lg">Dirección de envío</h2>
              <div>
                {shippingAddress.fullName}, {shippingAddress.address},{' '}
                {shippingAddress.state}, {shippingAddress.city},{' '}
                {shippingAddress.postalCode}, {shippingAddress.state}
              </div>
              {isDelivered ? (
                <div className="alert-success">
                  Enviado el{' '}
                  <span className="font-bold">
                    {new Date(deliveredAt).toLocaleDateString()}{' '}
                  </span>
                  <br />
                  Sigue tu orden &nbsp;
                  <Link
                    href={trackUrl}
                    target="_blank"
                    className="underline font-bold"
                  >
                    AQUÍ.
                  </Link>
                  <br />
                  Número de guía y empresa de envíos &nbsp;
                  <Link
                    href={trackUrl}
                    target="_blank"
                    className="underline font-bold"
                  >
                    {trackNumber}.
                  </Link>
                </div>
              ) : (
                <div className="alert-error">En preparación</div>
              )}
            </div>

            <div className="card p-5">
              <h2 className="mb-2 text-lg">Método de pago</h2>
              <div>{paymentMethod}</div>
              {isPaid ? (
                <div className="alert-success">
                  Pagado el {paidAt.substring(0, 10)}
                </div>
              ) : (
                <div className="alert-error">No pagado</div>
              )}
            </div>

            <div className="card overflow-x-auto p-5">
              <h2 className="mb-2 text-lg">Productos</h2>
              <table className="min-w-full">
                <thead className="border-b">
                  <tr>
                    <th className="px-5 text-left">Producto</th>
                    <th className="    p-5 text-right">Cantidad</th>
                    <th className="  p-5 text-right">Precio</th>
                    <th className="p-5 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.map((item) => (
                    <tr key={item._id} className="border-b">
                      <td>
                        <Link
                          href={`/product/${item.slug}`}
                          className="flex items-center"
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                          ></Image>
                          &nbsp;
                          {item.name}
                        </Link>
                      </td>
                      <td className=" p-5 text-right">{item.quantity}</td>
                      <td className="p-5 text-right">
                        ${formatNumberWithDots(item.price)}
                      </td>
                      <td className="p-5 text-right">
                        ${formatNumberWithDots(item.quantity * item.price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <div className="card p-2">
              <h2 className="mb-2 text-lg">Resumen</h2>
              <ul>
                <li>
                  <div className="mb-2 px-3 flex justify-between">
                    <div>Productos</div>
                    <div>${formatNumberWithDots(brutPrice)}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 px-3 flex justify-between">
                    <div>I.V.A.</div>
                    <div>${formatNumberWithDots(taxPrice)}</div>
                  </div>
                </li>

                <li>
                  <div className="mb-2  px-3 flex justify-between">
                    <div>Total</div>
                    <div>${formatNumberWithDots(totalPrice)}</div>
                  </div>
                  <br />
                </li>
                {!isPaid && (
                  <li className="buttons-container text-center mx-auto">
                    {paymentMethod === 'Mercadopago' ? (
                      <button
                        className="primary-button w-full mt-2"
                        onClick={handleMercadoPagoClick}
                      >
                        <div className="flex flex-row align-middle justify-center items-center font-bold ">
                          PAGAR &nbsp; <AiTwotoneLock className="" />
                        </div>
                        <Image
                          src={Mercadopago}
                          alt="Mercadopago"
                          height={80}
                          width={200}
                          className="mt-2"
                        />
                      </button>
                    ) : paymentMethod === 'Contraentrega' ? (
                      <div>
                        {session.user.isAdmin && (
                          <button
                            className="primary-button w-full mb-2"
                            onClick={handleButtonClick}
                          >
                            Marcar como pagado
                          </button>
                        )}
                        {!session.user.isAdmin && !isDelivered && (
                          <Link
                            className="primary-button w-full mt-2"
                            href={`/order/${order._id}/ManufacturerForm`}
                          >
                            Editar Contraentrega
                          </Link>
                        )}
                      </div>
                    ) : null}
                    {loadingPay && <div>Cargando...</div>}
                  </li>
                )}
                {session.user.isAdmin &&
                  !order.isDelivered &&
                  (order.isPaid || paymentMethod === 'Contraentrega') && (
                    <li>
                      {loadingDeliver && <div>Loading...</div>}
                      <form
                        action={`/api/admin/orders/${order._id}/deliver`}
                        method="POST"
                      >
                        <section>
                          <input
                            ref={trackUrlRef}
                            name="trackUrl"
                            placeholder="URL de seguimiento"
                            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline m-1"
                            required
                          />
                          <input
                            ref={trackNumberRef}
                            name="trackNumber"
                            placeholder="Número y empresa de envío"
                            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline m-1"
                            required
                          />
                          <button
                            type="submit"
                            role="link"
                            className="primary-button w-full"
                            onClick={deliverOrderHandler}
                          >
                            Enviar Orden
                          </button>
                        </section>
                      </form>
                    </li>
                  )}
                <br />
                {!session.user.isAdmin ? (
                  <li>
                    <div className="mb-2 px-3 flex justify-between">
                      <div>
                        Te enviaremos un mensaje con la confirmación de tu orden
                        y los datos de envío al siguiente correo:
                        <br />
                        <p className="font-bold">{userEmail}</p>
                      </div>
                    </div>
                  </li>
                ) : null}
              </ul>
            </div>
          </div>
          <form ref={form} hidden>
            <input
              type="hidden"
              name="order_id"
              value={orderId.substring(orderId.length - 8).toUpperCase()}
              readOnly
            />
            <input
              type="hidden"
              name="full_order_id"
              value={orderId}
              readOnly
            />
            <input
              type="hidden"
              name="user_name"
              value={shippingAddress.fullName}
              readOnly
            />
            <input
              type="hidden"
              name="user_phone"
              value={shippingAddress.phone}
              readOnly
            />
            <input type="hidden" name="user_email" value={userEmail} readOnly />
            <input
              type="hidden"
              name="total_order"
              value={totalPrice}
              readOnly
            />
            <input
              type="hidden"
              name="payment_method"
              value={paymentMethod}
              readOnly
            />
            <input
              type="hidden"
              name="shipping_address"
              value={shippingAddress.address}
              readOnly
            />
            <input
              type="hidden"
              name="shipping_preference"
              value={shippingAddress.notes}
              readOnly
            />
            <input
              type="hidden"
              name="track_url"
              value={trackUrlRef.current?.value || trackUrl}
              readOnly
            />
            <input
              type="hidden"
              name="track_number"
              value={trackNumberRef.current?.value || trackNumber}
              readOnly
            />
          </form>
        </div>
      )}
    </Layout>
  );
}

OrderScreen.auth = true;
export default OrderScreen;
