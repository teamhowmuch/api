import { Transaction } from 'src/bank-connections/models/transaction'
import { clean } from './clean'
import rabobank from './__mock__/rabobank.json'

describe('clean', () => {
  it('should be defined', () => {
    expect(clean).toBeDefined()
  })

  it('should extract amount', async () => {
    for (const line of rabobank) {
      const res = await clean(line as unknown as Transaction)
      console.log(res)
      expect(res.amount).toBeTruthy()
    }
  })
})
