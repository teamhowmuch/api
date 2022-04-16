// @index: import {${variable}} from ${relpath}
import { Bank } from './Bank'
import { Car } from './Car'
import { EmissionEvent } from './EmissionEvent'
import { Merchant } from './Merchant'
import { MerchantAccount } from './MerchantAccount'
import { MerchantCategory } from './MerchantCategory'
import { MerchantPattern } from './MerchantPattern'
import { Transaction } from './Transaction'
import { User } from './User'
import { UserBankConnection } from './UserBankConnection'
import { UserOtp } from './UserOtp'

// /index

export const Collection = [
  Bank,
  Car,
  EmissionEvent,
  Merchant,
  MerchantAccount,
  MerchantCategory,
  MerchantPattern,
  Transaction,
  User,
  UserBankConnection,
  UserOtp,
]
