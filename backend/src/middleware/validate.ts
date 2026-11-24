import type { RequestHandler } from "express";
import type { ZodTypeAny } from "zod";
import { HttpError } from "../utils/http-error";

export function validate(schema: ZodTypeAny): RequestHandler {
  return (request, _response, next) => {
    const result = schema.safeParse(request.body);

    if (!result.success) {
      // Só são devolvidos o caminho e a mensagem: nunca os valores recebidos.
      const details = result.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      }));
      next(new HttpError(400, "Dados inválidos.", details));
      return;
    }

    request.body = result.data;
    next();
  };
}
