import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { generateOTP, storeOTP, sendOTPEmail } from '@/lib/otp'

export async function POST() {
  const session = await getServerSession()

  // Check session exists
  if (!session?.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  // Check id and email are defined before using them
  if (!session.user.id || !session.user.email) {
    return NextResponse.json({ error: 'User data incomplete' }, { status: 400 })
  }

  // Generate a new OTP, store it in DB, send it via email
  const otp = generateOTP()
  await storeOTP(session.user.id, otp)        // ← id is now guaranteed string
  await sendOTPEmail(session.user.email, otp)  // ← email is now guaranteed string
  return NextResponse.json({ success: true })
}