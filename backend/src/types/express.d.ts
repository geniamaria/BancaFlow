import type { SafeUser } from "../modules/users/user.types";

declare global {
  namespace Express {
    interface Request {
      auth?: {
        user: SafeUser;
        sessionId: string;
      };
    }
  }
}

export {};
