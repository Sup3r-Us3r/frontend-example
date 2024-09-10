// 'use client'; // decorator para fazer funcionar a página no lado do cliente e não do server

import axios from 'axios';

async function getData() {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      const response = await axios.get(
        'https://jsonplaceholder.typicode.com/todos',
      );

      resolve(response.data);
    }, 3000);
  });
}

const DashboardPage = async () => {
  const data = await getData();

  return (
    <div>
      <h1>Dashboard page</h1>

      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default DashboardPage;
