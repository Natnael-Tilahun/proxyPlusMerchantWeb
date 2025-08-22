import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { OperatorRole } from "~/types";


export const updateMerchantOperatorFormSchema = toTypedSchema(
  z.object({
    firstName: z.string(),
    middleName: z.string(),
    lastName: z.string(),
    branchId: z.string().optional().nullable(),
    operatorRoleId: z.string(),
    active: z.boolean().optional().default(true),
    operatorCode: z.string().optional().nullable(),
    language: z.string().optional().nullable(),
  })
);
