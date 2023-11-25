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
  // Find the latest product
  const lastProduct = await Product.findOne({}).sort({ _id: -1 });
  let newSlugNumber = 1; // Default if no products are found

  if (lastProduct && lastProduct.slug) {
    // Extract the numeric part of the last slug and increment it
    const lastSlugNumber = parseInt(lastProduct.slug.match(/\d+$/), 10);
    if (!isNaN(lastSlugNumber)) {
      newSlugNumber = lastSlugNumber + 1;
    }
  }

  // Construct new slug
  const newSlug = `product-${newSlugNumber}`;
  const newProduct = new Product({
    name: 'N',
    slug: newSlug,
    store: 'S',
    value: 0,
    paymentType: 'TC Master',
    typeOfPurchase: 'Mercado',
    notes: 'Nada',
    date: Date.now(),
  });

  const product = await newProduct.save();
  await db.disconnect();
  res.send({ message: 'Registro creado exitosamente', product });
};
const getHandler = async (req, res) => {
  await db.connect();
  const products = await Product.find({});
  await db.disconnect();
  res.send(products);
};
export default handler;
