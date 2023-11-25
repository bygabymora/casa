import { getToken } from 'next-auth/jwt';
import Product from '../../../../models/Product';
import db from '../../../../utils/db';

const handler = async (req, res) => {
  const user = await getToken({ req });
  if (!user || !user.isAdmin) {
    return res.status(401).send('Registro requerido de administrador');
  }
  if (req.method === 'GET') {
    return getHandler(req, res);
  } else if (req.method === 'POST') {
    return postHandler(req, res);
  } else {
    return res.status(400).send({ message: 'Method not allowed' });
  }
};
const postHandler = async (req, res) => {
  await db.connect();
  const newProduct = new Product({
    name: 'Nombre del producto',
    slug: 'Código' + Math.random(),
    image:
      'https://res.cloudinary.com/dcjahs0jp/image/upload/v1692313973/tgesmy2eeunhammc5koa.png',
    reference: 'Referencia',
    description: 'Descripción del producto',
    price: 0,
    size: 'Tamaño',
    countInStock: 0,
    notes: 'Notas extra ',
    includes: 'Incluye',
  });

  const product = await newProduct.save();
  await db.disconnect();
  res.send({ message: 'Product creado exitosamente', product });
};
const getHandler = async (req, res) => {
  await db.connect();
  const products = await Product.find({});
  await db.disconnect();
  res.send(products);
};
export default handler;
