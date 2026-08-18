import { z } from 'zod';

export const campaignSchema = z.object({
  name: z.string().min(1, 'Campaign name is required').max(100, 'Name cannot exceed 100 characters'),
  description: z.string().max(500, 'Description cannot exceed 500 characters').optional(),
});

export type CampaignFormValues = z.infer<typeof campaignSchema>;

export const createCampaignSchema = campaignSchema;
export type CreateCampaignFormData = CampaignFormValues;
