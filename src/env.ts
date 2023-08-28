/*
 * env.ts
 * Author: evan kirkiles
 * Created On Sun Aug 27 2023
 * 2023 Design at Yale
 *
 * A file to declare required .env variables for your app. Some standard ones
 * (for using Sanity with Next.js) have been defined already for you.
 */

// Should be the domain you want to host your site at, for generating sitemaps
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL!;

// Sanity-specific variables [public]
export const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
export const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET!;
export const SANITY_API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION!;
// Sanity-specific variables [private]
export const SANITY_WEBHOOK_SECRET = process.env.SANITY_WEBHOOK_SECRET!;
export const SANITY_API_READ_TOKEN = process.env.SANITY_API_READ_TOKEN;
