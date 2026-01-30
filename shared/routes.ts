import { z } from 'zod';
import { insertCategorySchema, categories, entries } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  categories: {
    list: {
      method: 'GET' as const,
      path: '/api/categories',
      responses: {
        200: z.array(z.custom<typeof categories.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/categories',
      input: insertCategorySchema,
      responses: {
        201: z.custom<typeof categories.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/categories/:id',
      responses: {
        200: z.custom<typeof categories.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/categories/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  entries: {
    add: {
      method: 'POST' as const,
      path: '/api/categories/:id/entries',
      input: z.object({
        rawText: z.string(),
      }),
      responses: {
        201: z.object({ count: z.number() }), // Returns number of entries added
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
    distribution: {
      method: 'GET' as const,
      path: '/api/categories/:id/distribution',
      responses: {
        200: z.array(z.object({
          term: z.string(),
          count: z.number(),
        })),
        404: errorSchemas.notFound,
      },
    },
    merge: {
      method: 'POST' as const,
      path: '/api/categories/:id/merge',
      input: z.object({
        originalTerms: z.array(z.string()),
        mergedTerm: z.string(),
      }),
      responses: {
        200: z.object({ updatedCount: z.number() }),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
