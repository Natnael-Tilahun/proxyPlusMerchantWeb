import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

export const newMerchantBranchFormSchema = toTypedSchema(
  z.object({
    merchantBranchId: z.string().optional(),
    branchName: z.string(),
    branchCode: z.string().optional().nullable(),
    businessPhoneNumber: z.string().optional().nullable(),
    faxNumber: z.string().optional().nullable(),
    paymentReceivingAccountNumber: z.string().optional().nullable(),
    city: z.string().optional().nullable(),
    businessEmail: z.string().optional().nullable(),
    postalNumber: z.string().optional().nullable(),
  })
);
