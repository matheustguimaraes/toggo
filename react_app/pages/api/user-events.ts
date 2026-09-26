import { getToken } from 'next-auth/jwt';
import type { NextApiRequest, NextApiResponse } from 'next';
import { axiosChegadosApi } from 'components/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = await getToken({ req });

  if (!token) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  if (req.method === 'GET') {
    try {
      const backendRes = await axiosChegadosApi.get('/social_events_likes/', {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      });

      const likes = backendRes.data;

      if (!Array.isArray(likes)) {
        console.error('Resposta inesperada da API de likes:', likes);
        return res.status(500).json({ error: 'Resposta inválida da API de likes' });
      }

      const events = likes.map((like: any) => like.event);
      return res.status(200).json(events);
    } catch (err) {
      console.error('Erro ao carregar eventos:', err);
      return res.status(500).json({ error: 'Erro ao carregar eventos' });
    }
  }

  if (req.method === 'POST') {
    const { event_id } = req.body;

    if (!event_id) {
      return res.status(400).json({ error: 'event_id é obrigatório' });
    }

    try {
      const backendRes = await axiosChegadosApi.post('/social_events_likes/', {
        event: event_id
      }, {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      });

      const created = backendRes.data;
      return res.status(201).json(created);
    } catch (err) {
      console.error('Erro ao salvar evento:', err);
      return res.status(500).json({ error: 'Erro ao salvar evento' });
    }
  }

  return res.status(405).json({ error: 'Método não permitido' });
}
