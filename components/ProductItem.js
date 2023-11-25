import Link from 'next/link';
import React, { useState } from 'react';
import Image from 'next/image';
import { Store } from '../utils/Store';
import { useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

export const ProductItem = ({ product }) => {
  const formatNumberWithDots = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const [isOutOfStock, setIsOutOfStock] = useState(false);
  const [qty, setQty] = useState(1);
  const router = useRouter();

  const addToCartHandler = async () => {
    const exisItem = cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = exisItem ? exisItem.quantity + qty : qty;
    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.countInStock < quantity) {
      setIsOutOfStock(true);
      return;
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });

    toast.success('item añadido al carrito');

    if (product.countInStock < quantity) {
      alert('No tenemos suficiente inventario para esta compra');

      return quantity;
    }
  };

  const buyNowHandler = async () => {
    addToCartHandler();
    router.push('Login?redirect=/shipping');
  };

  return (
    <div className="block justify-center card  items-center text-center my-3 text-xs lg:text-lg">
      <h2 className="font-bold my-2 h-[3.5rem] flex justify-center items-center">
        {product.name}
      </h2>
      <div className="grid grid-cols-2 justify-between h-[16rem] ">
        <Link
          href={{ pathname: `products/${product.slug}` }}
          className="justify-center items-center text-center flex-1"
        >
          <div className="flex justify-center items-center">
            <Image
              src={`${product.image}`}
              alt={product.description}
              className="max-w-full h-auto"
              width={800}
              height={1000}
            />
          </div>
        </Link>
        <div className="flex flex-col justify-center items-center p-5">
          <Link href={{ pathname: `products/${product.slug}` }}>
            <h2 className="font-bold text-lg">{product.name}</h2>
            <div className="mb-2 flex items-center flex-col text-center justify-center lg:block">
              <div className="font-bold mt-4">Cantidad</div>
              <div className="flex items-center justify-center flex-row">
                <button
                  className="border px-2 py-1 card"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  disabled={qty <= 1}
                >
                  -
                </button>
                <span className="px-1 mt-4">{isOutOfStock ? 0 : qty}</span>
                <button
                  className="border px-2 py-1 card"
                  onClick={() => {
                    if (qty < product.countInStock) {
                      setQty(qty + 1);
                    } else {
                      alert(
                        `Lo siento, no tenemos suficientes unidades de ${product.name} en este momento`
                      );
                    }
                  }}
                  disabled={isOutOfStock}
                >
                  +
                </button>
              </div>
            </div>
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-2 justify-between h-[4rem] ">
        <div className="font-bold text-xs ml-3">{product.includes}</div>
        <div className="flex justify-center items-center text-xl font-bold text-gray-500">
          ${formatNumberWithDots(product.price)}
        </div>
      </div>
      <div className="flex flex-row justify-center items-center p-5 gap-2">
        <button
          className="primary-button align-middle mt-2"
          type="button"
          onClick={addToCartHandler}
          disabled={product.countInStock === 0 || isOutOfStock}
        >
          {isOutOfStock ? 'Fuera de inventario' : 'Añadir al carrito'}
        </button>
        <button
          className="primary-button align-middle mt-2"
          type="button"
          onClick={buyNowHandler}
          disabled={product.countInStock === 0 || isOutOfStock}
        >
          {isOutOfStock ? 'Fuera de inventario' : 'Comprar ahora'}
        </button>
      </div>
    </div>
  );
};
