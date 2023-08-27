/*
 * route.ts
 * Author: evan kirkiles
 * Created On Sun Aug 27 2023
 * 2023 Design at Yale
 *
 * This file defines a route handler for performing on-demand revalidation
 * for our Sanity assets. For example, it tells Next to regenerate a SitePage
 * when it is updated or created by us in the Sanity desk.
 *
 * HOWEVER—Sanity isn't quick enough to update the asset, so Next.js gets the
 * _old version_ of the document when it re-requests it. To fix this, we need
 * to insert a delay somewhere (where???) before this function is called. I
 * think this needs to be on the client side, without using webhooks. Otherwise,
 * it would require some additional backend resources somehow.
 */

import { SANITY_WEBHOOK_SECRET } from '@/env';
import { SitePage } from '@/sanity/schema';
import { isValidSignature, SIGNATURE_HEADER_NAME } from '@sanity/webhook';
import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

// to add other revalidation entities, add their types here.
function checkIsRevalidationEntity(body: any): body is SitePage {
  return !!body._type;
}

/**
 */
export async function POST(req: NextRequest) {
  const body = await req.json();

  // first, validate the request signature
  const signature = req.headers.get(SIGNATURE_HEADER_NAME);
  if (!signature) return NextResponse.json({});
  const isValid = isValidSignature(
    JSON.stringify(body),
    signature,
    SANITY_WEBHOOK_SECRET
  );
  if (!isValid) {
    return NextResponse.json({ success: false, message: 'Invalid signature.' });
  }
  if (!body || !checkIsRevalidationEntity(body)) {
    return NextResponse.json({ success: false, message: 'Invalid body.' });
  }

  // if valid request, attempt to do the revalidation
  try {
    let revalidated: string[] = [];
    switch (body._type) {
      case 'site_page':
        revalidated.push(`page:${body.slug.current}`);
        break;
      default:
        throw new Error('Invalid revalidation type.');
    }
    revalidated.forEach(revalidateTag);
    return NextResponse.json({ success: true, revalidated });
  } catch (e) {
    return NextResponse.json({ success: false, error: e });
  }
}
