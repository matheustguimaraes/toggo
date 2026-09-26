import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { axiosChegadosApi } from 'components/api'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const session = await getSession({ req })
    
    if (!session?.accessToken) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const response = await axiosChegadosApi.get('/social_events/', {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
      },
    })

    const data = response.data
    
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch events' })
  }
} 