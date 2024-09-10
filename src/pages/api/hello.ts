import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  name: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  if (Math.floor(Math.random() * 100) > 50) {
    return res.status(200).json({ name: 'Name 1' });
  } else {
    return res.status(200).json({ name: 'Name 2' });
  }
}
