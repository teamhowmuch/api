import { extractMerchant } from './extractMerchant'
import { mocks } from './__mock__/mock'

describe('extractMerchant', () => {
  it('should be defined', () => {
    expect(extractMerchant).toBeDefined()
  })

  it('should return something', () => {
    for (const { transaction, name } of mocks) {
      const res = extractMerchant(transaction)
      expect(res.name).toEqual(name)
    }
  })
})
