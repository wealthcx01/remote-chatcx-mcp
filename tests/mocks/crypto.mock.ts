import { vi } from 'vitest'

// Mock crypto.subtle for cookie signing
export const mockCryptoSubtle = {
  sign: vi.fn(),
  verify: vi.fn(),
  importKey: vi.fn(),
}

// Mock crypto.getRandomValues
export const mockGetRandomValues = vi.fn()

export function setupCryptoMocks() {
  // Mock HMAC signing
  mockCryptoSubtle.sign.mockResolvedValue(new ArrayBuffer(32))
  
  // Mock signature verification
  mockCryptoSubtle.verify.mockResolvedValue(true)
  
  // Mock key import
  mockCryptoSubtle.importKey.mockResolvedValue({} as CryptoKey)
  
  // Mock random values
  mockGetRandomValues.mockImplementation((array: Uint8Array) => {
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256)
    }
    return array
  })
}

export function setupCryptoError() {
  mockCryptoSubtle.sign.mockRejectedValue(new Error('Crypto signing failed'))
  mockCryptoSubtle.verify.mockRejectedValue(new Error('Crypto verification failed'))
}

export function resetCryptoMocks() {
  vi.clearAllMocks()
  setupCryptoMocks()
}

// Apply mocks to global crypto object
const g = globalThis as any
if (!g.crypto) {
  Object.defineProperty(g, 'crypto', {
    value: {
      subtle: mockCryptoSubtle,
      getRandomValues: mockGetRandomValues,
    },
    writable: true,
  })
} else {
  g.crypto.subtle = mockCryptoSubtle
  g.crypto.getRandomValues = mockGetRandomValues
}