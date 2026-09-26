import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { axiosChegadosApi } from 'components/api'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const session = await getSession({ req })
    
    if (!session?.accessToken) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const { event_id } = req.body

    if (!event_id) {
      return res.status(400).json({ error: 'event_id is required' })
    }

    const response = await axiosChegadosApi.post('/participations/', {
      event_id: event_id
    }, {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
      },
    })

    res.status(201).json(response.data)
  } catch (error: any) {
    console.error('Error confirming presence:', error)
    
    const status = error.response?.status || 500
    const message = error.response?.data?.error || 'Failed to confirm presence'
    
    res.status(status).json({ error: message })
  }
} 