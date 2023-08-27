/*
 * sanity.config.ts
 * author: evan kirkiles
 * created on Mon Apr 03 2023
 * 2023 evan's personal website,
 */
import { defineConfig, isDev } from 'sanity';
import { media } from 'sanity-plugin-media';
import { visionTool } from '@sanity/vision';
import { deskTool } from 'sanity/desk';
import schemaTypes from './schemas';
import { SANITY_PROJECT_ID, SANITY_DATASET } from '@/env';
import defaultDocumentNode from '@/sanity/desk/defaultDocumentNode';
import structure from '@/sanity/desk/structure';
import { UpdatePageAction } from '@/sanity/desk/actions';
import DAY from '@/assets/svg/DAY';

const devOnlyPlugins: any[] = [];

export default defineConfig({
  name: 'default',
  title: 'A Daylight App',
  icon: DAY,
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  basePath: '/studio',
  plugins: [
    deskTool({
      structure,
      defaultDocumentNode,
    }),
    media(),
    visionTool(),
    ...(isDev ? devOnlyPlugins : []),
  ],
  document: {
    actions: [UpdatePageAction],
  },
  schema: {
    types: schemaTypes,
  },
});
