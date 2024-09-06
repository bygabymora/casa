import { getToken } from 'next-auth/jwt';
import Transaction from '../../../../../models/Transaction'; // Changed from Product to Transaction
import db from '../../../../../utils/db';

const handler = async (req, res) => {
  const user = await getToken({ req });
  if (!user || (user && !user.isAdmin)) {
    return res.status(401).send('Registro Requerido');
  }

  if (req.method === 'GET') {
    return getHandler(req, res, user);
  } else if (req.method === 'PUT') {
    return putHandler(req, res, user);
  } else if (req.method === 'DELETE') {
    return deleteHandler(req, res, user);
  } else {
    return res.status(400).send({ message: 'Metodo no permitido' });
  }
};

const getHandler = async (req, res) => {
  await db.connect();
  const transaction = await Transaction.findById(req.query.id); // Changed from Product to Transaction
  await db.disconnect();
  res.send(transaction); // Changed from product to transaction
};

const putHandler = async (req, res) => {
  await db.connect();
  const transaction = await Transaction.findById(req.query.id); // Changed from Product to Transaction
  if (transaction) {
    transaction.name = req.body.name;
    transaction.slug = req.body.slug;
    transaction.store = req.body.store;
    transaction.value = req.body.value;
    transaction.paymentType = req.body.paymentType;
    transaction.typeOfPurchase = req.body.typeOfPurchase;
    transaction.notes = req.body.notes;
    transaction.date = req.body.date;
    await transaction.save();
    await db.disconnect();
    res.send({ message: 'Registro actualizado exiosamente' });
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'Registro no encontrado' });
  }
};

const deleteHandler = async (req, res) => {
  await db.connect();
  const transaction = await Transaction.findById(req.query.id); // Changed from Product to Transaction
  console.log('Transaction ID: ', req.query.id); // Changed log from Product to Transaction
  console.log('Found transaction: ', transaction); // Changed log from Product to Transaction
  if (transaction) {
    await Transaction.findByIdAndDelete(req.query.id); // Changed from Product to Transaction
    await db.disconnect();
    res.send({ message: 'Registro borrado exitosamente' });
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'Registro no encontrado' });
  }
};

export default handler;
