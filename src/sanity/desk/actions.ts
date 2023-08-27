/*
 * actions.ts
 * Author: evan kirkiles
 * Created On Sun Aug 27 2023
 * 2023 Design at Yale
 *
 * Use this file to define custom document actions to add to the action dropdown.
 */

import { UNSAFE_REVALIDATION_SECRET } from '@/env';
import { SitePage } from '@/sanity/schema';
import { useToast } from '@sanity/ui';
import { useState } from 'react';
import { TbBrandNextjs } from 'react-icons/tb';
import { DocumentActionComponent } from 'sanity';

/**
 * The UpdatePageAction provides a hacky-way to manually revalidate Next.js 13
 * tags for pages to regenerate a page once its data has been published. See
 * the file header of the api/revalidate route handler for why this is necessary.
 *
 * This action is only avaiable in Site Page document types for now.
 */
export const UpdatePageAction: DocumentActionComponent = ({
  type,
  published,
  draft,
}) => {
  const toast = useToast();
  const document: SitePage | null = (published || draft) as any;
  const [loading, setLoading] = useState(false);

  if (type !== 'site_page') return null;

  return {
    label: 'Manual Page Update',
    icon: TbBrandNextjs,
    tone: 'positive',
    disabled: loading,
    onHandle: () => {
      setLoading(true);
      fetch(`/api/revalidatemanual`, {
        method: 'POST',
        body: JSON.stringify({
          tags: [`page:${document?.slug.current}`],
        }),
        headers: { UNSAFE_REVALIDATION_SECRET },
      })
        .then(() => {
          toast.push({
            status: 'success',
            title: `Manually updated "${document?.slug.current}".`,
          });
        })
        .catch((e) => {
          console.error(e);
          toast.push({
            status: 'error',
            title: `Failed manual updating of "${document?.slug.current}"`,
          });
        })
        .finally(() => setLoading(false));
    },
  };
};
