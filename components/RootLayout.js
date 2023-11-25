import React from 'react';
import Layout from './Layout';

export const metadata = {
  title: 'Easy Home Designer',
  description: 'Discounted surgical supplies.',
};

export default function RootLayout({ children }) {
  return <Layout title="Easy Home Designer">{children}</Layout>;
}
