import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
 
export default withAuth(
    function middleware(req) {
    // If user is logged in but NOT verified (OTP not done), send to /verify
    const token = req.nextauth.token
    const isVerified = token?.verified
    const isOnVerifyPage = req.nextUrl.pathname === '/verify'
 
    if (token && !isVerified && !isOnVerifyPage) {
      return NextResponse.redirect(new URL('/verify', req.url))
    }
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,  // !!token = true if logged in
    },
  }
)
 
// Which pages does this middleware protect?
export const config = {
  matcher: [
    // Protect everything EXCEPT login, public landing, and API auth routes
    '/((?!login|$|api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
}