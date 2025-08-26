/**
 * Integration tests for RKD tools.
 * Requires RKD_BASE_URL, RKD_APP_ID, RKD_USERNAME and RKD_PASSWORD environment variables.
 * The tests are skipped if any of these variables are missing.
 */
import { describe, it, expect, beforeAll } from 'vitest'
import { get_quote, get_timeseries, get_news, get_chart } from '../../src/tools'
import type { Env } from '../../src/rkdClient'

const requiredEnv = ['RKD_BASE_URL', 'RKD_APP_ID', 'RKD_USERNAME', 'RKD_PASSWORD']
const hasEnv = requiredEnv.every((name) => !!process.env[name])
const describeIf = hasEnv ? describe : describe.skip

describeIf('RKD tools', () => {
  beforeAll(async () => {
    const { fetch: realFetch } = await import('undici')
    const { webcrypto } = await import('node:crypto')
    // Restore real fetch and crypto implementations for integration testing
    global.fetch = realFetch as any
    Object.defineProperty(global, 'crypto', { value: webcrypto })
  })

  const env: Env = {
    RKD_BASE_URL: process.env.RKD_BASE_URL!,
    RKD_APP_ID: process.env.RKD_APP_ID!,
    RKD_USERNAME: process.env.RKD_USERNAME!,
    RKD_PASSWORD: process.env.RKD_PASSWORD!,
  }

  const testCases = [
    { tool: get_quote, input: { ric: 'AAPL.O' } },
    { tool: get_timeseries, input: { ric: 'AAPL.O', start: '2024-01-01', end: '2024-01-31' } },
    { tool: get_news, input: { query: 'Apple' } },
    { tool: get_chart, input: { ric: 'AAPL.O' } },
  ]

  it.each(testCases)('$tool.name returns data', async ({ tool, input }) => {
    const res = await tool.handler(input, env)
    expect(res.content.length).toBeGreaterThan(0)
    const match = res.content[0].text.match(/```json\n([\s\S]+)\n```/)
    expect(match).toBeTruthy()
    const data = JSON.parse(match![1])
    if (Array.isArray(data)) {
      expect(data.length).toBeGreaterThan(0)
    } else if (data && typeof data === 'object') {
      expect(Object.keys(data).length).toBeGreaterThan(0)
    } else {
      expect(data).toBeTruthy()
    }
  })
})

