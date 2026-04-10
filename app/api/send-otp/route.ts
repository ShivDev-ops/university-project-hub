import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { generateOTP, storeOTP, sendOTPEmail } from '@/lib/otp'

export async function POST() {
  const session = await getServerSession()

  if (!session?.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const userId = session.user.id
  const userEmail = session.user.email

  if (!userId || !userEmail) {
    return NextResponse.json({ error: 'User data incomplete' }, { status: 400 })
  }

  const otp = generateOTP()
  await storeOTP(userId, otp)
  await sendOTPEmail(userEmail, otp)
  return NextResponse.json({ success: true })
}