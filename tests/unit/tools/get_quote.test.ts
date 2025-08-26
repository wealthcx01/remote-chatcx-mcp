import { describe, it, expect } from 'vitest'
import getQuote from '../../../src/tools/get_quote'

const env = {
  RKD_BASE_URL: 'https://rkd.example.com',
  RKD_APP_ID: 'app',
  RKD_USERNAME: 'user',
  RKD_PASSWORD: 'pass',
}

describe('get_quote tool', () => {
  it('forms correct request and processes response', async () => {
    const tokenResponse = { CreateServiceToken_Response_1: { Token: 'test-token' } }
    const apiResponse = { data: { price: 123.45 } }

      const fetchMock = fetch as any
      fetchMock.mockResolvedValueOnce({ ok: true, status: 200, json: async () => tokenResponse })
      fetchMock.mockResolvedValueOnce({ ok: true, status: 200, json: async () => apiResponse })

    const result = await getQuote.handler({ ric: 'AAPL.O', scope: 'All' }, env)

    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      `${env.RKD_BASE_URL}/Quotes/Quotes.svc/REST/Quotes_1/RetrieveItem_3`,
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ 'X-Trkd-Auth-Token': 'test-token' }),
      })
    )

    const body = JSON.parse(fetchMock.mock.calls[1][1].body)
    expect(body).toEqual({
      RetrieveItem_Request_3: {
        TrimResponse: false,
        ItemRequest: [
          {
            RequestKey: [{ Name: 'AAPL.O', NameType: 'RIC' }],
            Scope: 'All',
          },
        ],
      },
    })

    expect(result).toEqual(apiResponse)
  })
})

