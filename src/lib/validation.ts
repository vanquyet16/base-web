import { z } from "zod";

/**
 * Validate and sanitize input data before sending to APIs.
 *
 * @throws {z.ZodError} When validation fails.
 */
export function validateAndSanitize<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown,
): z.infer<T> {
  return schema.parse(data);
}
