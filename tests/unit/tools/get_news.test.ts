import { describe, it, expect } from 'vitest'
import getNews from '../../../src/tools/get_news'

const env = {
  RKD_BASE_URL: 'https://rkd.example.com',
  RKD_APP_ID: 'app',
  RKD_USERNAME: 'user',
  RKD_PASSWORD: 'pass',
}

describe('get_news tool', () => {
  it('forms correct request and processes response', async () => {
    const tokenResponse = { CreateServiceToken_Response_1: { Token: 'test-token' } }
    const apiResponse = { headlines: [{ id: 1, text: 'News' }] }

      const fetchMock = fetch as any
      fetchMock.mockResolvedValueOnce({ ok: true, status: 200, json: async () => tokenResponse })
      fetchMock.mockResolvedValueOnce({ ok: true, status: 200, json: async () => apiResponse })

    const result = await getNews.handler(
      { query: 'AAPL', maxCount: 10, start: '2023-01-01', end: '2023-01-31' },
      env
    )

    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      `${env.RKD_BASE_URL}/News/News.svc/REST/News_1/RetrieveHeadlineML_1`,
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ 'X-Trkd-Auth-Token': 'test-token' }),
      })
    )

    const body = JSON.parse(fetchMock.mock.calls[1][1].body)
    expect(body).toEqual({
      RetrieveHeadlineML_Request_1: {
        Query: 'AAPL',
        MaxCount: 10,
        DateRange: { StartDate: '2023-01-01', EndDate: '2023-01-31' },
      },
    })

    expect(result).toEqual(apiResponse)
  })
})

