/**
 * Integration test for RKD token service.
 * Requires RKD_BASE_URL, RKD_APP_ID, RKD_USERNAME and RKD_PASSWORD environment variables.
 * The test is skipped if any of these variables are missing.
 */
import { describe, it, expect, beforeAll } from 'vitest'
import { getRkdToken } from '../../src/rkdClient'

const requiredEnv = ['RKD_BASE_URL', 'RKD_APP_ID', 'RKD_USERNAME', 'RKD_PASSWORD']
const hasEnv = requiredEnv.every((name) => !!process.env[name])

const describeIf = hasEnv ? describe : describe.skip

describeIf('RKD service token', () => {
  beforeAll(async () => {
    const { fetch: realFetch } = await import('undici')
    const { webcrypto } = await import('node:crypto')
    // Restore real fetch and crypto implementations for integration testing
    global.fetch = realFetch as any
    Object.defineProperty(global, 'crypto', { value: webcrypto })
  })

  it('retrieves a service token', async () => {
    const env = {
      RKD_BASE_URL: process.env.RKD_BASE_URL!,
      RKD_APP_ID: process.env.RKD_APP_ID!,
      RKD_USERNAME: process.env.RKD_USERNAME!,
      RKD_PASSWORD: process.env.RKD_PASSWORD!,
    }

    const token = await getRkdToken(env)
    expect(typeof token).toBe('string')
    expect(token.length).toBeGreaterThan(0)
  })
})
