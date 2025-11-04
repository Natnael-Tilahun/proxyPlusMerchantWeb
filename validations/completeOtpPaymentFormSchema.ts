import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

export const completeOtpPaymentFormSchema = toTypedSchema(
  z
    .object({
      customerOtp: z.array(z.number()),
    })
);
