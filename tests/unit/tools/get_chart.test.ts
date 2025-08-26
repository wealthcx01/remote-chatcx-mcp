import { describe, it, expect } from 'vitest'
import getChart from '../../../src/tools/get_chart'
import { createSuccessResponse } from '../../../src/types'

const env = {
  RKD_BASE_URL: 'https://rkd.example.com',
  RKD_APP_ID: 'app',
  RKD_USERNAME: 'user',
  RKD_PASSWORD: 'pass',
}

describe('get_chart tool', () => {
  it('forms correct request and processes response', async () => {
    const tokenResponse = { CreateServiceToken_Response_1: { Token: 'test-token' } }
    const apiResponse = { image: 'base64data' }

      const fetchMock = fetch as any
      fetchMock.mockResolvedValueOnce({ ok: true, status: 200, json: async () => tokenResponse })
      fetchMock.mockResolvedValueOnce({ ok: true, status: 200, json: async () => apiResponse })

    const result = await getChart.handler(
      { ric: 'AAPL.O', chartType: 'Bar', period: '3M', width: 800, height: 600 },
      env
    )

    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      `${env.RKD_BASE_URL}/Charts/Charts.svc/REST/Charts_1/GetChart_2`,
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ 'X-Trkd-Auth-Token': 'test-token' }),
      })
    )

    const body = JSON.parse(fetchMock.mock.calls[1][1].body)
    expect(body).toEqual({
      GetChart_Request_2: {
        Symbol: 'AAPL.O',
        ChartType: 'Bar',
        Period: '3M',
        Width: 800,
        Height: 600,
      },
    })

    expect(result).toEqual(
      createSuccessResponse('Retrieved chart data', apiResponse)
    )
  })
})

