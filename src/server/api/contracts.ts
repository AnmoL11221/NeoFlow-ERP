import { z } from "zod";

export const paginationInput = z.object({
  cursor: z.string().nullish(),
  limit: z.number().int().min(1).max(100).default(20),
});

export type PaginationInput = z.infer<typeof paginationInput>;

export const clientListInput = paginationInput;

export const projectListByClientInput = paginationInput.extend({
  clientId: z.string().min(1),
  status: z.enum(["PROPOSED","ACTIVE","COMPLETED","PAUSED"]).nullish(),
});
