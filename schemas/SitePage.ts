/*
 * SitePage.ts
 * Author: evan kirkiles
 * Created On Sun Aug 27 2023
 * 2023 Design at Yale
 */

import { defineArrayMember, defineField, defineType } from 'sanity';
import pageElements from './page';

const SitePage = defineType({
  name: 'site_page',
  type: 'document' as const,
  title: 'Site Page',
  groups: [{ name: 'seo', title: 'SEO' }],
  fields: [
    defineField({
      name: 'title',
      type: 'string' as const,
      title: 'Title',
      validation: (Rule) => Rule.required(),
      codegen: { required: true },
      description: 'The title of the page.',
    }),
    defineField({
      name: 'slug',
      type: 'slug' as const,
      title: 'Slug',
      validation: (Rule) => Rule.required(),
      codegen: { required: true },
      description: 'The path to the page on the site',
    }),
    defineField({
      name: 'last_updated',
      type: 'date' as const,
      title: 'Last Validated',
      description: 'When this page was last revalidated.',
      readOnly: true,
    }),
    defineField({
      name: 'pageBuilder',
      type: 'array' as const,
      title: 'Page Builder',
      description: 'Assemble your page using configurable modules.',
      validation: (Rule) => Rule.required(),
      // map all of our page elements to pageBuilder sub-types
      of: pageElements.map(({ title, name }) =>
        defineArrayMember({
          title,
          type: name,
        })
      ),
    }),

    /* -------------------------------- SEO Types ------------------------------- */

    defineField({
      name: 'seo_title',
      type: 'string' as const,
      title: 'SEO Title',
      group: 'seo',
      description:
        "An SEO title (appears in the tab bar). If unset, uses the page's title.",
    }),
    defineField({
      name: 'seo_description',
      type: 'string' as const,
      title: 'SEO Description',
      group: 'seo',
      description:
        "An SEO description. If unset, uses text from the page's content.",
    }),
    defineField({
      name: 'seo_keywords',
      type: 'string' as const,
      title: 'SEO Keywords',
      group: 'seo',
      description: 'SEO keywords.',
    }),
  ],
  preview: {
    select: {
      title: 'slug.current',
    },
  },
});

export default SitePage;