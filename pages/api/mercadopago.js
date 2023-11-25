import mercadopago from 'mercadopago';

mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

const mercadopagoHandler = async (req, res) => {
  if (req.method === 'POST') {
    const { totalPrice, orderId } = req.body;

    const preference = {
      items: [
        {
          title: `Orden #${orderId}`,
          unit_price: parseFloat(totalPrice),
          quantity: 1,
          currency_id: 'COP',
        },
      ],
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_APP_URL}/order/${orderId}?status=success`,
        failure: `${process.env.NEXT_PUBLIC_APP_URL}/order/${orderId}?status=failure`,
        pending: `${process.env.NEXT_PUBLIC_APP_URL}/order/${orderId}?status=pending`,
      },
      auto_return: 'approved',
    };

    try {
      const response = await mercadopago.preferences.create(preference);
      res.status(200).json({ init_point: response.body.init_point });
    } catch (error) {
      console.error(error); // Imprimir el error en el servidor
      res.status(400).json({ error: error.message }); // Cambiado para enviar el mensaje real del error
    }
  } else {
    res.status(405).end();
  }
};

export default mercadopagoHandler;
