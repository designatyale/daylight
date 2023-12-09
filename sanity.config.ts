/*
 * sanity.config.ts
 * Author: evan kirkiles
 * Created On Mon Aug 28 2023
 * 2023 Design at Yale
 */

import { defineConfig, isDev } from 'sanity';
import { media } from 'sanity-plugin-media';
import { visionTool } from '@sanity/vision';
import { deskTool } from 'sanity/desk';
import schemaTypes from './schemas';
import { SANITY_PROJECT_ID, SANITY_DATASET, SANITY_PROJECT_TITLE } from '@/env';
import { pageStructure, singletonPlugin } from '@/sanity/plugins/settings';
import { defaultDocumentNode } from '@/sanity/plugins/studio';
import SiteHome from './schemas/singletons/SiteHome';
import SiteSettings from './schemas/singletons/SiteSettings';
import { presentationTool } from 'sanity/presentation';
import { locate } from '@/sanity/plugins/locate';
import UpdatePageAction from '@/sanity/plugins/actions';

export default defineConfig({
  title: SANITY_PROJECT_TITLE,
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  basePath: '/studio',
  schema: {
    types: schemaTypes,
  },
  plugins: [
    deskTool({
      structure: pageStructure([SiteHome, SiteSettings]),
      defaultDocumentNode,
    }),
    // Configures live preview pane
    presentationTool({
      locate,
      previewUrl: {
        origin:
          typeof location === 'undefined'
            ? 'http://localhost:3000'
            : location.origin,
        draftMode: {
          enable: '/api/draft',
        },
      },
    }),
    // Configures the global "new document" button, and document actions, to suit the Settings document singleton
    singletonPlugin([SiteHome.name, SiteSettings.name]),
    // Allows a centralized view of all uploaded media, with alt text, etc.
    media(),
    // Vision lets you query your content with GROQ in the studio
    visionTool(),
  ],
  // TODO: Add back in manual revalidation
  document: {
    actions: (prev, context) => [
      // ...prev.map((originalAction) =>
      //   originalAction.action === 'publish'
      //     ? augmentPublishAction(originalAction, context)
      //     : originalAction
      // ),
      ...prev,
      UpdatePageAction(context),
    ],
  },
});
