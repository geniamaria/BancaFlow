import bcrypt from "bcrypt";
import { config } from "../config/env";

// Comparação com um hash real evita responder mais depressa quando o email não existe.
const dummyHash = bcrypt.hashSync("bancaflow-dummy-password", config.bcryptRounds);

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, config.bcryptRounds);
}

export async function verifyPasswordOrDummy(
  password: string,
  hash: string | null,
): Promise<boolean> {
  return bcrypt.compare(password, hash ?? dummyHash);
}
