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
    const lastSlugNumber = parseInt(lastProduct.slug.match(/\d+$/), 10);
    if (!isNaN(lastSlugNumber)) {
      newSlugNumber = lastSlugNumber + 1;
    }
  }

  // Construct new slug
  const newSlug = `${newSlugNumber}`;

  const newProduct = new Product({
    name: '.',
    slug: newSlug,
    store: '.',
    value: 0,
    paymentType: 'TC Master',
    typeOfPurchase: '.',
    notes: 'Nada',
    date: Date.now(),
  });

  const product = await newProduct.save();
  await db.disconnect();
  res.send({ message: 'Registro creado exitosamente', product });
};

const getHandler = async (req, res) => {
  await db.connect();

  // Check for a specific query parameter to decide the action
  const { action } = req.query;

  if (action === 'aggregate') {
    // Perform aggregation if the action is 'aggregate'
    const consumos = await Product.aggregate([
      {
        $group: {
          _id: '$typeOfPurchase', // Group by 'typeOfPurchase'
          totalValue: { $sum: '$value' }, // Sum the 'value' for each group
        },
      },
    ]);
    await db.disconnect();
    res.send(consumos);
  } else {
    // Else, return the list of products as before
    const products = await Product.find({});
    await db.disconnect();
    res.send(products);
  }
};

export default handler;
