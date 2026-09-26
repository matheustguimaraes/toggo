import { getToken } from 'next-auth/jwt';
import type { NextApiRequest, NextApiResponse } from 'next';
import { axiosChegadosApi } from 'components/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = await getToken({ req });

  if (!token || req.method !== 'POST') {
    return res.status(401).json({ error: 'Não autorizado ou método inválido' });
  }

  const { event_id } = req.body;

  try {
    const backendRes = await axiosChegadosApi.post('/social_events_likes/', {
      event: event_id
    }, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    });

    const data = backendRes.data;
    return res.status(backendRes.status).json(data);
  } catch (err) {
    console.error('Erro ao salvar evento:', err);
    return res.status(500).json({ error: 'Erro ao comunicar com o backend' });
  }
}
