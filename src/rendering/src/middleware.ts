/* eslint-disable prettier/prettier */
import { NextRequest, NextResponse } from 'next/server'
import { getHostnameDataOrDefault } from './lib/multisite/sites'

export const config = {
  matcher: ['/', '/_sites/:path'],
}

export default async function middleware(req: NextRequest): Promise<NextResponse> {
  const url = req.nextUrl.clone()
  // Get hostname (e.g. vercel.com, test.vercel.app, etc.)
  const hostname = req.headers.get('host')?.replace(':3000', '')

  // If localhost, assign the host value manually
  // If prod, get the custom domain/subdomain value by removing the root URL
  // (in the case of "test.vercel.app", "vercel.app" is the root URL)
  const currentHost =
    //process.env.NODE_ENV === 'production' &&
    hostname?.replace(`.${process.env.ROOT_DOMAIN}`, '')
  const data = await getHostnameDataOrDefault(currentHost?.toString())

  console.log('Site name: ' + data?.siteName)

  // Prevent security issues – users should not be able to canonically access
  // the pages/sites folder and its respective contents.
  if (url.pathname.startsWith(`/_sites`)) {
    url.pathname = `/404`
  } else {
    // rewrite to the current subdomain
    url.pathname = `/_sites/${data?.subdomain}${data?.siteName}${url.pathname}`
  }

  console.log(url);
  
  return NextResponse.rewrite(url);
}
