// File: app/api/verify-otp/route.ts
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { verifyOTP } from '@/lib/otp'  // from Phase 2
export async function POST(req: NextRequest) {
  const session = await getServerSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }
  // Get the code the user typed in
  const { code } = await req.json()
  if (!code || code.length !== 6) {
    return NextResponse.json({ error: 'Invalid code format' }, { status: 400 })
  }
  // verifyOTP checks the DB and marks the user as verified if correct
  const isValid = await verifyOTP(session.user.id, code)
  if (!isValid) {
    return NextResponse.json({ error: 'Incorrect or expired code' }, { status: 400 })
  }
  return NextResponse.json({ success: true })
}