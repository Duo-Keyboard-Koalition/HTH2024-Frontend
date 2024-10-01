"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function testsite() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/fetchData');
        setData(response.data);
      } catch (error) {
        //setError('Failed to fetch data');
        console.error(`Error: ${error}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Data from Backend</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}