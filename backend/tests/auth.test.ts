import "dotenv/config";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { after, before, describe, it } from "node:test";
import { PrismaClient, UserRole, type Branch } from "@prisma/client";
import bcrypt from "bcrypt";
import type { Express } from "express";
import jwt from "jsonwebtoken";
import request from "supertest";

process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "bancaflow-test-secret-with-more-than-32-characters";
process.env.JWT_EXPIRES_IN = "1h";
process.env.RATE_LIMIT_MAX = "500";

const prisma = new PrismaClient();
const cleanupEmails: string[] = [];
const password = "Senha@123";

let app: Express;
let auroraBankId: string;
let meridianoBankId: string;
let auroraBaixa: Branch;
let auroraPolana: Branch;
let customerEmail: string;
let customerToken: string;
let customerId: string;
let adminToken: string;
let managerToken: string;

async function login(email: string, passwordValue = password): Promise<string> {
  const response = await request(app).post("/api/v1/auth/login").send({ email, password: passwordValue });
  assert.equal(response.status, 200, JSON.stringify(response.body));
  return response.body.accessToken as string;
}

function bearer(token: string): string {
  return `Bearer ${token}`;
}

before(async () => {
  const { createApp } = await import("../src/app");
  app = createApp();

  const aurora = await prisma.bank.findUniqueOrThrow({ where: { slug: "banco-aurora" } });
  const meridiano = await prisma.bank.findUniqueOrThrow({ where: { slug: "banco-meridiano" } });
  auroraBankId = aurora.id;
  meridianoBankId = meridiano.id;

  auroraBaixa = await prisma.branch.findFirstOrThrow({
    where: { bankId: auroraBankId, code: "AUR-BAIXA" },
  });
  auroraPolana = await prisma.branch.findFirstOrThrow({
    where: { bankId: auroraBankId, code: "AUR-POLANA" },
  });

  const adminEmail = `auth-test-admin-${randomUUID()}@example.com`;
  const managerEmail = `auth-test-manager-${randomUUID()}@example.com`;
  cleanupEmails.push(adminEmail, managerEmail);

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      fullName: "Administrador de Teste",
      email: adminEmail,
      passwordHash,
      role: UserRole.BANK_ADMIN,
      bankId: auroraBankId,
    },
  });

  await prisma.user.create({
    data: {
      fullName: "Gestor de Agência de Teste",
      email: managerEmail,
      passwordHash,
      role: UserRole.BRANCH_MANAGER,
      bankId: auroraBankId,
      branchId: auroraBaixa.id,
    },
  });

  adminToken = await login(adminEmail);
  managerToken = await login(managerEmail);
});

after(async () => {
  await prisma.user.deleteMany({ where: { email: { in: cleanupEmails } } });
  await prisma.$disconnect();
});

describe("autenticação e gestão inicial de utilizadores", () => {
  it("regista um novo cliente sem expor passwordHash nem permitir escolher papel", async () => {
    customerEmail = `auth-test-customer-${randomUUID()}@example.com`;
    cleanupEmails.push(customerEmail);

    const response = await request(app)
      .post("/api/v1/auth/register")
      .send({
        fullName: "Cliente de Teste",
        email: customerEmail,
        phone: "+258 84 000 0000",
        password,
      });

    assert.equal(response.status, 201, JSON.stringify(response.body));
    assert.equal(response.body.user.role, UserRole.CUSTOMER);
    assert.equal(response.body.user.email, customerEmail);
    assert.equal(response.body.user.passwordHash, undefined);
    assert.ok(response.body.accessToken);
    customerToken = response.body.accessToken;
    customerId = response.body.user.id;

    const roleAttempt = await request(app)
      .post("/api/v1/auth/register")
      .send({
        fullName: "Tentativa Administrador",
        email: `auth-test-role-${randomUUID()}@example.com`,
        phone: "+258 84 000 0001",
        password,
        role: UserRole.SUPER_ADMIN,
      });

    assert.equal(roleAttempt.status, 400);
  });

  it("recusa registo com email já existente", async () => {
    const response = await request(app)
      .post("/api/v1/auth/register")
      .send({
        fullName: "Cliente Duplicado",
        email: customerEmail,
        phone: "+258 84 000 0002",
        password,
      });

    assert.equal(response.status, 409);
  });

  it("faz login com credenciais válidas", async () => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: customerEmail, password });

    assert.equal(response.status, 200, JSON.stringify(response.body));
    assert.ok(response.body.accessToken);
    assert.equal(response.body.tokenType, "Bearer");
    assert.equal(response.body.user.passwordHash, undefined);
  });

  it("devolve a mesma mensagem para email e palavra-passe inválidos", async () => {
    const wrongPassword = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: customerEmail, password: "Errada@123" });
    const unknownEmail = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: `inexistente-${randomUUID()}@example.com`, password });

    assert.equal(wrongPassword.status, 401);
    assert.equal(unknownEmail.status, 401);
    assert.equal(wrongPassword.body.error, unknownEmail.body.error);
    assert.equal(wrongPassword.body.error, "Credenciais inválidas.");
  });

  it("exige autenticação em /api/auth/me", async () => {
    const response = await request(app).get("/api/v1/auth/me");
    assert.equal(response.status, 401);
  });

  it("rejeita token inválido em /api/auth/me", async () => {
    const response = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", bearer("token.invalido.aqui"));

    assert.equal(response.status, 401);
  });

  it("devolve os dados do utilizador autenticado sem dados sensíveis", async () => {
    const response = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", bearer(customerToken));

    assert.equal(response.status, 200, JSON.stringify(response.body));
    assert.equal(response.body.user.id, customerId);
    assert.equal(response.body.user.email, customerEmail);
    assert.equal(response.body.user.passwordHash, undefined);
  });

  it("bloqueia cliente numa rota protegida por permissões", async () => {
    const response = await request(app)
      .get("/api/v1/users")
      .set("Authorization", bearer(customerToken));

    assert.equal(response.status, 403);
  });

  it("bloqueia acesso de administrador a outro banco e respeita a agência", async () => {
    const otherBank = await request(app)
      .get(`/api/v1/users?bankId=${meridianoBankId}`)
      .set("Authorization", bearer(adminToken));

    assert.equal(otherBank.status, 403);

    const ownBank = await request(app)
      .get(`/api/v1/users?bankId=${auroraBankId}`)
      .set("Authorization", bearer(adminToken));

    assert.equal(ownBank.status, 200, JSON.stringify(ownBank.body));
    assert.ok(ownBank.body.data.length > 0);
    assert.ok(ownBank.body.data.every((user: { bankId: string | null }) => user.bankId === auroraBankId));

    const otherBranch = await request(app)
      .get(`/api/v1/users?branchId=${auroraPolana.id}`)
      .set("Authorization", bearer(managerToken));

    assert.equal(otherBranch.status, 403);

    const ownBranch = await request(app)
      .get(`/api/v1/users?branchId=${auroraBaixa.id}`)
      .set("Authorization", bearer(managerToken));

    assert.equal(ownBranch.status, 200, JSON.stringify(ownBranch.body));
  });

  it("revoga a sessão no logout e o token deixa de funcionar imediatamente", async () => {
    const logout = await request(app)
      .post("/api/v1/auth/logout")
      .set("Authorization", bearer(customerToken));

    assert.equal(logout.status, 200, JSON.stringify(logout.body));

    const decoded = jwt.decode(customerToken) as { sid?: string };
    const session = await prisma.authSession.findUnique({ where: { id: decoded.sid ?? "" } });
    assert.ok(session?.revokedAt, "A sessão deve estar revogada na base de dados.");

    const me = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", bearer(customerToken));

    assert.equal(me.status, 401);
  });
});
