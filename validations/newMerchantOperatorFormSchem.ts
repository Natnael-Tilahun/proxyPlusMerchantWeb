import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";


export const newMerchantOperatorFormSchema = toTypedSchema(
  z.object({
    firstName: z.string(),
    middleName: z.string(),
    lastName: z.string(),
    branchId: z.string().optional().nullable(),
    operatorRoleId: z.string(),
    active: z.boolean().optional().default(true),
    operatorCode: z.string().optional().nullable(),
    language: z.string().optional().nullable(),
    // operatorType: OperatorTypeSchema,
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(50)
      .refine(
        (val) => !/^(\d)\1+$/.test(val), // Prevent all same digit (e.g., 111111)
        { message: "Password cannot be all the same digit or character" }
      )
      .refine(
        (val) => !/^(?:123456|123321|123123|654321|000000|111111|222222|333333|444444|555555|666666|777777|888888|999999)$/.test(val),
        { message: "Password is too weak or common" }
      ),
    confirmPassword: z.string().min(6).max(50),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match!",
    path: ["confirmPassword"],
  })
);
