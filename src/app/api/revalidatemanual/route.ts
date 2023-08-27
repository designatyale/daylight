/*
 * route.ts
 * Author: evan kirkiles
 * Created On Sun Aug 27 2023
 * 2023 Design at Yale
 *
 * THIS IS AN UNSAFE BUT WORKING MANUAL REVALIDATION ROUTE. This allows
 * users to trigger revalidation manually from the dashboard. Should probably
 * link this into auth status, but for now this is fine. See the revalidate
 * route for an explanation on why this manual triggering is necessary.
 *
 * Used in the document action for manually revalidating tags.
 */

import { UNSAFE_REVALIDATION_SECRET } from '@/env';
import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

// On any POST request, given the
export async function POST(req: NextRequest) {
  const body: { tags: string[] } = await req.json();

  const unsafe_secret = req.headers.get('UNSAFE_REVALIDATION_SECRET');
  if (unsafe_secret !== UNSAFE_REVALIDATION_SECRET)
    return NextResponse.json({ success: false, message: 'Invalid token.' });

  // if valid request, attempt to do the revalidation
  try {
    let { tags } = body;
    tags.forEach(revalidateTag);
    return NextResponse.json({ success: true, tags });
  } catch (e) {
    return NextResponse.json({ success: false, error: e });
  }
}
