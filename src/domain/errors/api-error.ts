import { HttpStatusCode } from "@/presentation/protocols";

export class ApiError extends Error {
  constructor(readonly message: string, readonly statusCode: HttpStatusCode) {
    super(message);
    this.name = "ApiError";
  }
}
