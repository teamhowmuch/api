// @index: import {${variable}} from ${relpath}

import { User } from './User'
import { UserOtp } from './UserOtp'
import { UserChat } from './UserChat'
import { UserRole } from './UserRole'

// /index

export const Collection = [User, UserChat, UserOtp, UserRole]
