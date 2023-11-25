import Head from 'next/head';
import React from 'react';
import Header from './Header';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Layout({ title, children }) {
  return (
    <>
      <Head>
        <title>{title ? title : 'Easy Home Designer'}</title>
        <meta name="description" content="Easy Home Designer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ToastContainer position="bottom-center" limit={1} />
      <div className="flex min-h-screen flex-col justify-between ">
        <Header />

        <main className="main container  m-auto mt-11 px-4">{children}</main>
      </div>
    </>
  );
}
