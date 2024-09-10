'use client';

import { use } from 'react';

const getData = async () => {
  const response = await fetch('http://localhost:3000/api/hello', {
    next: { revalidate: 5 },
  });
  const data = await response.json();

  return data;
};

const ReportPage = () => {
  const data = use(getData());

  return (
    <div>
      <h1>Report Page</h1>

      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default ReportPage;
