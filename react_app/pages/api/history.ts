import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import { axiosChegadosApi } from '../../components/api';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });


    if (!token || !token.accessToken) {
        return res.status(401).json({ message: 'Não autorizado' });
    }

    try {
        const response = await axiosChegadosApi.get('/api/participations/', {
            headers: {
                'Authorization': `Bearer ${token.accessToken}`,
            },
        });

        res.status(200).json(response.data);

    } catch (error: any) {
        console.error('Erro ao conectar com o backend para buscar histórico:', error);
        
        if (error.response) {
            return res.status(error.response.status).json(error.response.data);
        }
        
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
} 