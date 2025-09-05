import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { OperatorRole } from "~/types";


export const inviteNewMerchantOperatorFormSchema = toTypedSchema(
  z.object({
    firstName: z.string(),
    middleName: z.string(),
    lastName: z.string(),
    branchId: z.string().optional().nullable(),
    role: z.string().optional(),
    active: z.boolean().optional().default(true),
    operatorCode: z.string().optional().nullable(),
    language: z.string().optional().nullable(),
    phoneNumber: z.string(),
  }
))
