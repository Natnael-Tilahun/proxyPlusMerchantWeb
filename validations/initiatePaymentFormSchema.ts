import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

export const initiatePaymentFormSchema = toTypedSchema(
  z
    .object({
      amount: z.number().min(0.001).max(300000, { message: "Maximum limit amount is 300000" }),
      paymentReference: z.string().optional(),
      customerPhone: z.string().min(9).optional(),
      sendOtp: z.boolean().default(false),
      sendPushUssd: z.boolean().default(true)
    })
);
