const { z } = require("zod");

const registerSchema = z.object({
  name: z.string().min(3),
  email: z.email(),
  password: z.string().min(8),
  role: z.enum(["PATIENT", "DOCTOR", "ADMIN"]).optional(),
});

module.exports = {
  registerSchema,
};
