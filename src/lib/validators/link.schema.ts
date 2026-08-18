import { z } from 'zod';

export const createLinkSchema = z.object({
  longUrl: z
    .string()
    .min(1, 'Destination URL is required')
    .url('Please enter a valid URL (e.g. https://example.com)'),
  customAlias: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[a-zA-Z0-9_-]+$/.test(val),
      'Custom back-half can only contain letters, numbers, hyphens, and underscores',
    ),
  title: z.string().optional(),
  expiresAt: z.string().optional(),
  campaignId: z.string().optional(),
  channel: z.string().optional(),
  tags: z.array(z.string()).optional(),
  password: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  utmTerm: z.string().optional(),
  utmContent: z.string().optional(),
});

export type CreateLinkFormData = z.infer<typeof createLinkSchema>;

export const updateLinkSchema = z.object({
  longUrl: z
    .string()
    .min(1, 'Destination URL is required')
    .url('Please enter a valid URL')
    .optional(),
  title: z.string().optional(),
  expiresAt: z.string().nullable().optional(),
  campaignId: z.string().nullable().optional(),
  channel: z.string().nullable().optional(),
  tags: z.array(z.string()).optional(),
  password: z.string().nullable().optional(),
});

export type UpdateLinkFormData = z.infer<typeof updateLinkSchema>;
