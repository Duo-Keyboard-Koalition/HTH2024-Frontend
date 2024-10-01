// pages/api/fetchData.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const url = "https://kq17idrqs9.execute-api.us-east-1.amazonaws.com/prod/getall";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await axios.get(url);
    res.status(200).json(response.data);
  } catch (error) {
    console.error(`Error: ${error}`);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}