// @index: import {${variable}} from ${relpath}
import { Airport } from './Airport'
import { Bank } from './Bank'
import { Car } from './Car'
import { EmissionEvent } from './EmissionEvent'
import { Flight } from './Flight'
import { Merchant } from './Merchant'
import { MerchantBankAccount } from './MerchantBankAccount'
import { MerchantCategory } from './MerchantCategory'
import { MerchantTransactionSearchPattern } from './MerchantTransactionSearchPattern'
import { UserRole } from './UserRole'
import { Transaction } from './Transaction'
import { User } from './User'
import { UserBankConnection } from './UserBankConnection'
import { UserOtp } from './UserOtp'
import { TransactionAnonymized } from './TransactionAnonymized'

// /index

export const Collection = [
  Airport,
  Bank,
  Car,
  EmissionEvent,
  Flight,
  Merchant,
  MerchantBankAccount,
  MerchantCategory,
  MerchantTransactionSearchPattern,
  UserRole,
  Transaction,
  TransactionAnonymized,
  User,
  UserBankConnection,
  UserOtp,
]
