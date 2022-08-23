// @index: import {${variable}} from ${relpath}

import { User } from './User'
import { UserOtp } from './UserOtp'
import { UserChat } from './UserChat'
import { UserRole } from './UserRole'
import { TrackingEvent } from './TrackingEvent'
import { TrackingSession } from './TrackingSession'

// /index

export const Collection = [TrackingEvent, TrackingSession, User, UserChat, UserOtp, UserRole]
