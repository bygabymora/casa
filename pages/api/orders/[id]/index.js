// /api/orders/:id
import { getToken } from 'next-auth/jwt';
import Order from '../../../../models/Order';
import db from '../../../../utils/db';

const handler = async (req, res) => {
  const user = await getToken({ req });
  if (!user) {
    return res.status(401).send('Registro Requerido');
  }

  await db.connect();

  const order = await Order.findById(req.query.id).populate('user', 'email');
  await db.disconnect();
  res.send(order);
};

export default handler;
