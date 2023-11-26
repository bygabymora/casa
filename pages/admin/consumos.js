import Link from 'next/link';

import React from 'react';

import Layout from '../../components/Layout';

export default function Consumos() {
  return (
    <Layout>
      <div className="grid md:grid-cols-4 md:gap-2">
        <div>
          <ul className="hidden lg:block">
            <li>
              <Link href="/">Dashboard</Link>
            </li>
            <li>
              <Link href="/admin/consumos" className="font-bold">
                Consumos
              </Link>
            </li>
            <li>
              <Link href="/admin/products">Registros</Link>
            </li>
            <li>
              <Link href="/admin/users">Usuarios</Link>
            </li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
