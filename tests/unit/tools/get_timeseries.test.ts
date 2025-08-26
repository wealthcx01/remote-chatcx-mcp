import { describe, it, expect } from 'vitest'
import getTimeseries from '../../../src/tools/get_timeseries'
import { createSuccessResponse } from '../../../src/types'

const env = {
  RKD_BASE_URL: 'https://rkd.example.com',
  RKD_APP_ID: 'app',
  RKD_USERNAME: 'user',
  RKD_PASSWORD: 'pass',
}

describe('get_timeseries tool', () => {
  it('forms correct request and processes response', async () => {
    const tokenResponse = { CreateServiceToken_Response_1: { Token: 'test-token' } }
    const apiResponse = { prices: [1, 2, 3] }

      const fetchMock = fetch as any
      fetchMock.mockResolvedValueOnce({ ok: true, status: 200, json: async () => tokenResponse })
      fetchMock.mockResolvedValueOnce({ ok: true, status: 200, json: async () => apiResponse })

    const result = await getTimeseries.handler(
      { ric: 'AAPL.O', start: '2023-01-01', end: '2023-01-31', interval: 'Weekly' },
      env
    )

    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      `${env.RKD_BASE_URL}/TimeSeries/TimeSeries.svc/REST/TimeSeries_1/GetInterdayTimeSeries_5`,
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ 'X-Trkd-Auth-Token': 'test-token' }),
      })
    )

    const body = JSON.parse(fetchMock.mock.calls[1][1].body)
    expect(body).toEqual({
      GetInterdayTimeSeries_Request_5: {
        Symbol: 'AAPL.O',
        StartDate: '2023-01-01',
        EndDate: '2023-01-31',
        Interval: 'Weekly',
      },
    })

    expect(result).toEqual(
      createSuccessResponse('Retrieved time series data', apiResponse)
    )
  })
})

