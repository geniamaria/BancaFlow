import "dotenv/config";
import {
  AppointmentStatus,
  DocumentStatus,
  Prisma,
  PrismaClient,
  QueueStatus,
  QueueTicketStatus,
  UserRole,
} from "@prisma/client";

const prisma = new PrismaClient();

// Hash fictício apenas para desenvolvimento. Não é uma palavra-passe real
// e deve ser substituído por um hash bcrypt/argon2 ao implementar autenticação.
const DEMO_PASSWORD_HASH =
  "$2b$12$demo0000000000000000000000000000000000000000000000000000";

function uuid(seed: number): string {
  return `00000000-0000-4000-8000-${String(seed).padStart(12, "0")}`;
}

function day(value: string): Date {
  return new Date(`${value}T00:00:00.000Z`);
}

function time(value: string): Date {
  const [hours, minutes] = value.split(":").map(Number);
  return new Date(Date.UTC(1970, 0, 1, hours, minutes, 0, 0));
}

async function main() {
  await prisma.$transaction(
    async (tx) => {
      // 1. Bancos
      const aurora = await tx.bank.upsert({
        where: { slug: "banco-aurora" },
        update: {
          name: "Banco Aurora",
          description: "Banco fictício usado apenas para desenvolvimento.",
          primaryColor: "#003B71",
          secondaryColor: "#00A6A6",
          email: "demo@aurora.example",
          phone: "+258 21 000 001",
          website: "https://aurora.example",
          isActive: true,
        },
        create: {
          id: uuid(1),
          name: "Banco Aurora",
          slug: "banco-aurora",
          description: "Banco fictício usado apenas para desenvolvimento.",
          primaryColor: "#003B71",
          secondaryColor: "#00A6A6",
          email: "demo@aurora.example",
          phone: "+258 21 000 001",
          website: "https://aurora.example",
        },
      });

      const meridiano = await tx.bank.upsert({
        where: { slug: "banco-meridiano" },
        update: {
          name: "Banco Meridiano",
          description: "Segundo banco fictício para validar o isolamento.",
          primaryColor: "#0066CC",
          secondaryColor: "#FFB800",
          email: "demo@meridiano.example",
          phone: "+258 21 000 002",
          website: "https://meridiano.example",
          isActive: true,
        },
        create: {
          id: uuid(2),
          name: "Banco Meridiano",
          slug: "banco-meridiano",
          description: "Segundo banco fictício para validar o isolamento.",
          primaryColor: "#0066CC",
          secondaryColor: "#FFB800",
          email: "demo@meridiano.example",
          phone: "+258 21 000 002",
          website: "https://meridiano.example",
        },
      });

      // 2. Agências — três por banco
      const auroraBranchData = [
        {
          id: uuid(10),
          code: "AUR-BAIXA",
          name: "Aurora — Baixa",
          address: "Av. 25 de Abril, 120",
          province: "Maputo Cidade",
          district: "Baixa",
          latitude: "-25.9686000",
          longitude: "32.5738000",
          phone: "+258 21 300 001",
          email: "baixa@aurora.example",
        },
        {
          id: uuid(11),
          code: "AUR-POLANA",
          name: "Aurora — Polana",
          address: "Av. Julius Nyerere, 355",
          province: "Maputo Cidade",
          district: "Polana",
          latitude: "-25.9661000",
          longitude: "32.5880000",
          phone: "+258 21 300 002",
          email: "polana@aurora.example",
        },
        {
          id: uuid(12),
          code: "AUR-BEIRA",
          name: "Aurora — Beira Centro",
          address: "Av. Poder Popular, 88",
          province: "Sofala",
          district: "Beira",
          latitude: "-19.8382000",
          longitude: "34.8384000",
          phone: "+258 23 300 003",
          email: "beira@aurora.example",
        },
      ];

      const meridianoBranchData = [
        {
          id: uuid(13),
          code: "MER-MATOLA",
          name: "Meridiano — Matola",
          address: "Av. das Nações Unidas, 88",
          province: "Maputo",
          district: "Matola",
          latitude: "-25.9457000",
          longitude: "32.4642000",
          phone: "+258 21 400 001",
          email: "matola@meridiano.example",
        },
        {
          id: uuid(14),
          code: "MER-NAMPULA",
          name: "Meridiano — Nampula Centro",
          address: "Av. Paulo Samuel Kankhomba, 210",
          province: "Nampula",
          district: "Nampula",
          latitude: "-15.1102000",
          longitude: "39.2687000",
          phone: "+258 26 400 002",
          email: "nampula@meridiano.example",
        },
        {
          id: uuid(15),
          code: "MER-TETE",
          name: "Meridiano — Tete",
          address: "Av. 24 de Julho, 45",
          province: "Tete",
          district: "Tete",
          latitude: "-16.1538000",
          longitude: "33.5913000",
          phone: "+258 25 400 003",
          email: "tete@meridiano.example",
        },
      ];

      for (const [bank, list] of [
        [aurora, auroraBranchData],
        [meridiano, meridianoBranchData],
      ] as const) {
        for (const item of list) {
          await tx.branch.upsert({
            where: { bankId_code: { bankId: bank.id, code: item.code } },
            update: {
              name: item.name,
              address: item.address,
              province: item.province,
              district: item.district,
              latitude: new Prisma.Decimal(item.latitude),
              longitude: new Prisma.Decimal(item.longitude),
              phone: item.phone,
              email: item.email,
              openingTime: time("08:00"),
              closingTime: time("16:30"),
              isActive: true,
            },
            create: {
              id: item.id,
              bankId: bank.id,
              code: item.code,
              name: item.name,
              address: item.address,
              province: item.province,
              district: item.district,
              latitude: new Prisma.Decimal(item.latitude),
              longitude: new Prisma.Decimal(item.longitude),
              phone: item.phone,
              email: item.email,
              openingTime: time("08:00"),
              closingTime: time("16:30"),
            },
          });
        }
      }

      const auroraBranches = await tx.branch.findMany({
        where: { bankId: aurora.id },
        orderBy: { code: "asc" },
      });
      const meridianoBranches = await tx.branch.findMany({
        where: { bankId: meridiano.id },
        orderBy: { code: "asc" },
      });
      const auroraBaixa = auroraBranches.find((b) => b.code === "AUR-BAIXA")!;
      const auroraPolana = auroraBranches.find((b) => b.code === "AUR-POLANA")!;
      const meridianoMatola = meridianoBranches.find((b) => b.code === "MER-MATOLA")!;

      // 3. Serviços — cada banco oferece apenas os seus próprios serviços
      const auroraServicesData = [
        ["Abertura de conta", 45, true],
        ["Actualização de dados", 25, true],
        ["Depósitos", 15, false],
        ["Transferências", 20, true],
        ["Solicitação de cartões", 30, true],
        ["Crédito", 60, true],
      ] as const;

      const meridianoServicesData = [
        ["Abertura de conta", 40, true],
        ["Actualização de dados", 20, true],
        ["Levantamentos", 10, false],
        ["Depósitos", 15, false],
        ["Transferências", 20, true],
        ["Crédito", 55, true],
      ] as const;

      async function seedServices(
        bankId: string,
        items: ReadonlyArray<readonly [string, number, boolean]>,
      ) {
        const records: Record<string, string> = {};
        let counter = 0;
        for (const [name, duration, requiresAppointment] of items) {
          counter += 1;
          const service = await tx.service.upsert({
            where: { bankId_name: { bankId, name } },
            update: {
              description: `${name}: serviço fictício de demonstração.`,
              category: "Atendimento",
              estimatedDurationMinutes: duration,
              requiresAppointment,
              isActive: true,
            },
            create: {
              id: uuid(20_000 + counter + (bankId === aurora.id ? 0 : 100)),
              bankId,
              name,
              description: `${name}: serviço fictício de demonstração.`,
              category: "Atendimento",
              estimatedDurationMinutes: duration,
              requiresAppointment,
            },
          });
          records[name] = service.id;
        }
        return records;
      }

      const auroraServiceIds = await seedServices(aurora.id, auroraServicesData);
      const meridianoServiceIds = await seedServices(meridiano.id, meridianoServicesData);

      // 4. Produtos — carteiras diferentes por banco
      async function seedProduct(data: {
        id: string;
        bankId: string;
        name: string;
        slug: string;
        description: string;
        category: string;
        targetAudience: string;
        advantages: string[];
        fees: string;
        requirements: string[];
      }) {
        await tx.bankProduct.upsert({
          where: { bankId_slug: { bankId: data.bankId, slug: data.slug } },
          update: {
            name: data.name,
            description: data.description,
            category: data.category,
            targetAudience: data.targetAudience,
            advantages: data.advantages,
            fees: new Prisma.Decimal(data.fees),
            currency: "MZN",
            requirements: data.requirements,
            isActive: true,
          },
          create: {
            id: data.id,
            bankId: data.bankId,
            name: data.name,
            slug: data.slug,
            description: data.description,
            category: data.category,
            targetAudience: data.targetAudience,
            advantages: data.advantages,
            fees: new Prisma.Decimal(data.fees),
            requirements: data.requirements,
          },
        });
        return tx.bankProduct.findUniqueOrThrow({
          where: { bankId_slug: { bankId: data.bankId, slug: data.slug } },
        });
      }

      const auroraCurrentAccount = await seedProduct({
        id: uuid(30),
        bankId: aurora.id,
        name: "Conta à ordem",
        slug: "conta-a-ordem",
        description: "Conta fictícia para movimentos diários.",
        category: "Contas",
        targetAudience: "Clientes individuais",
        advantages: ["Acesso digital", "Sem comissão de manutenção"],
        fees: "0.00",
        requirements: ["Documento de identificação", "Comprovativo de residência"],
      });
      const auroraSavings = await seedProduct({
        id: uuid(31),
        bankId: aurora.id,
        name: "Conta poupança",
        slug: "conta-poupanca",
        description: "Poupança fictícia com rendimento ilustrativo.",
        category: "Poupança",
        targetAudience: "Clientes individuais",
        advantages: ["Rendimento mensal", "Objectivos de poupança"],
        fees: "0.00",
        requirements: ["Documento de identificação"],
      });
      await seedProduct({
        id: uuid(32),
        bankId: aurora.id,
        name: "Conta jovem",
        slug: "conta-jovem",
        description: "Conta fictícia para maiores de 18 anos.",
        category: "Contas",
        targetAudience: "Jovens",
        advantages: ["Sem comissão", "Cartão digital"],
        fees: "0.00",
        requirements: ["Documento de identificação", "Comprovativo de escolaridade"],
      });
      await seedProduct({
        id: uuid(33),
        bankId: meridiano.id,
        name: "Conta à ordem",
        slug: "conta-a-ordem",
        description: "Conta fictícia para movimentos diários.",
        category: "Contas",
        targetAudience: "Clientes individuais",
        advantages: ["Acesso digital", "Transferências ilimitadas"],
        fees: "50.00",
        requirements: ["Documento de identificação"],
      });
      const meridianoBusiness = await seedProduct({
        id: uuid(34),
        bankId: meridiano.id,
        name: "Conta empresarial",
        slug: "conta-empresarial",
        description: "Conta fictícia para pequenas empresas.",
        category: "Empresas",
        targetAudience: "Micro, pequenas e médias empresas",
        advantages: ["Gestão de funcionários", "Relatórios mensais"],
        fees: "250.00",
        requirements: ["Certificado de registo comercial", "Documento de representação legal"],
      });
      await seedProduct({
        id: uuid(35),
        bankId: meridiano.id,
        name: "Conta poupança",
        slug: "conta-poupanca",
        description: "Poupança fictícia com objectivos.",
        category: "Poupança",
        targetAudience: "Clientes individuais",
        advantages: ["Rendimento trimestral"],
        fees: "0.00",
        requirements: ["Documento de identificação"],
      });

      // 5. Vídeos explicativos
      const videos = [
        {
          id: uuid(40),
          productId: auroraCurrentAccount.id,
          title: "Como abrir a conta à ordem",
          duration: 185,
        },
        {
          id: uuid(41),
          productId: auroraSavings.id,
          title: "Poupança em 3 minutos",
          duration: 176,
        },
        {
          id: uuid(42),
          productId: meridianoBusiness.id,
          title: "Conta empresarial: primeiros passos",
          duration: 242,
        },
      ];

      for (const video of videos) {
        await tx.productVideo.upsert({
          where: {
            productId_title: { productId: video.productId, title: video.title },
          },
          update: {
            description: "Vídeo fictício de demonstração.",
            videoUrl: `https://videos.example/${video.id}/video.mp4`,
            thumbnailUrl: `https://videos.example/${video.id}/thumb.jpg`,
            duration: video.duration,
            isActive: true,
          },
          create: {
            id: video.id,
            productId: video.productId,
            title: video.title,
            description: "Vídeo fictício de demonstração.",
            videoUrl: `https://videos.example/${video.id}/video.mp4`,
            thumbnailUrl: `https://videos.example/${video.id}/thumb.jpg`,
            duration: video.duration,
          },
        });
      }

      // 6. Documentos exigidos — cada registo pertence a um serviço OU a um produto
      async function seedRequiredDocument(data: {
        id: string;
        bankId: string;
        serviceId?: string;
        productId?: string;
        name: string;
        description: string;
        isMandatory?: boolean;
        acceptedFormats?: string[];
        maxFileSizeMB?: number;
      }) {
        const isMandatory = data.isMandatory ?? true;
        const acceptedFormats = data.acceptedFormats ?? ["pdf", "jpg", "png"];
        const maxFileSizeMB = data.maxFileSizeMB ?? 5;
        const values = {
          bankId: data.bankId,
          serviceId: data.serviceId ?? null,
          productId: data.productId ?? null,
          name: data.name,
          description: data.description,
          isMandatory,
          acceptedFormats,
          maxFileSizeMB,
          isActive: true,
        };
        return tx.requiredDocument.upsert({
          where: { id: data.id },
          update: values,
          create: { id: data.id, ...values },
        });
      }

      const auroraIdentity = await seedRequiredDocument({
        id: uuid(50),
        bankId: aurora.id,
        serviceId: auroraServiceIds["Abertura de conta"],
        name: "Documento de identificação",
        description: "Bilhete de identidade ou cartão de cidadão fictício.",
      });
      const auroraResidence = await seedRequiredDocument({
        id: uuid(51),
        bankId: aurora.id,
        serviceId: auroraServiceIds["Abertura de conta"],
        name: "Comprovativo de residência",
        description: "Documento fictício com morada actualizada.",
      });
      await seedRequiredDocument({
        id: uuid(52),
        bankId: aurora.id,
        productId: auroraCurrentAccount.id,
        name: "Comprovativo de rendimento",
        description: "Necessário apenas para produtos fictícios com limite.",
        isMandatory: false,
        maxFileSizeMB: 3,
      });
      const meridianoIdentity = await seedRequiredDocument({
        id: uuid(53),
        bankId: meridiano.id,
        serviceId: meridianoServiceIds["Actualização de dados"],
        name: "Documento de identificação actualizado",
        description: "Documento fictício para actualização de dados.",
      });
      await seedRequiredDocument({
        id: uuid(54),
        bankId: meridiano.id,
        productId: meridianoBusiness.id,
        name: "Certificado de registo comercial",
        description: "Exigido apenas no banco Meridiano.",
        acceptedFormats: ["pdf"],
        maxFileSizeMB: 10,
      });
      await seedRequiredDocument({
        id: uuid(55),
        bankId: meridiano.id,
        productId: meridianoBusiness.id,
        name: "Documento de representação legal",
        description: "Exigido apenas no banco Meridiano.",
        acceptedFormats: ["pdf"],
      });

      // 7. Utilizadores — clientes globais; administradores vinculados ao banco
      async function seedUser(data: {
        id: string;
        fullName: string;
        email: string;
        role: UserRole;
        bankId?: string;
        branchId?: string;
      }) {
        return tx.user.upsert({
          where: { email: data.email },
          update: {
            fullName: data.fullName,
            passwordHash: DEMO_PASSWORD_HASH,
            role: data.role,
            bankId: data.bankId ?? null,
            branchId: data.branchId ?? null,
            isActive: true,
          },
          create: {
            id: data.id,
            fullName: data.fullName,
            email: data.email,
            passwordHash: DEMO_PASSWORD_HASH,
            role: data.role,
            bankId: data.bankId ?? null,
            branchId: data.branchId ?? null,
          },
        });
      }

      const superAdmin = await seedUser({
        id: uuid(100),
        fullName: "Administrador Global Demo",
        email: "superadmin@bancaflow.example",
        role: UserRole.SUPER_ADMIN,
      });
      const auroraAdmin = await seedUser({
        id: uuid(101),
        fullName: "Administrador Aurora Demo",
        email: "admin.aurora@bancaflow.example",
        role: UserRole.BANK_ADMIN,
        bankId: aurora.id,
      });
      const meridianoAdmin = await seedUser({
        id: uuid(102),
        fullName: "Administrador Meridiano Demo",
        email: "admin.meridiano@bancaflow.example",
        role: UserRole.BANK_ADMIN,
        bankId: meridiano.id,
      });
      await seedUser({
        id: uuid(103),
        fullName: "Gestor da Agência Baixa",
        email: "gestor.baixa@aurora.example",
        role: UserRole.BRANCH_MANAGER,
        bankId: aurora.id,
        branchId: auroraBaixa.id,
      });
      await seedUser({
        id: uuid(104),
        fullName: "Operador da Agência Matola",
        email: "operador.matola@meridiano.example",
        role: UserRole.EMPLOYEE,
        bankId: meridiano.id,
        branchId: meridianoMatola.id,
      });
      const customer = await seedUser({
        id: uuid(105),
        fullName: "Cliente Demonstrativo",
        email: "cliente.demo@example.com",
        role: UserRole.CUSTOMER,
      });
      await seedUser({
        id: uuid(106),
        fullName: "Segundo Cliente Demonstrativo",
        email: "cliente2.demo@example.com",
        role: UserRole.CUSTOMER,
      });
      void superAdmin;

      // 8. Marcações em bancos diferentes para o mesmo cliente
      const appointments = [
        {
          id: uuid(200),
          bankId: aurora.id,
          branchId: auroraBaixa.id,
          serviceId: auroraServiceIds["Abertura de conta"],
          date: day("2026-11-25"),
          start: time("09:30"),
          end: time("10:15"),
          status: AppointmentStatus.CONFIRMED,
          notes: "Levar os documentos originais.",
        },
        {
          id: uuid(201),
          bankId: meridiano.id,
          branchId: meridianoMatola.id,
          serviceId: meridianoServiceIds["Transferências"],
          date: day("2026-11-26"),
          start: time("14:00"),
          end: time("14:20"),
          status: AppointmentStatus.PENDING,
          notes: null,
        },
        {
          id: uuid(202),
          bankId: aurora.id,
          branchId: auroraPolana.id,
          serviceId: auroraServiceIds["Actualização de dados"],
          date: day("2026-11-18"),
          start: time("11:00"),
          end: time("11:25"),
          status: AppointmentStatus.COMPLETED,
          notes: "Atendimento concluído.",
        },
      ];

      for (const item of appointments) {
        await tx.appointment.upsert({
          where: { id: item.id },
          update: {
            status: item.status,
            notes: item.notes,
            endTime: item.end,
          },
          create: {
            id: item.id,
            customerId: customer.id,
            bankId: item.bankId,
            branchId: item.branchId,
            serviceId: item.serviceId,
            appointmentDate: item.date,
            startTime: item.start,
            endTime: item.end,
            status: item.status,
            notes: item.notes,
          },
        });
      }

      // 9. Filas e senhas digitais
      const auroraQueue = await tx.queue.upsert({
        where: {
          branchId_serviceId_date_name: {
            branchId: auroraBaixa.id,
            serviceId: auroraServiceIds["Depósitos"],
            date: day("2026-11-24"),
            name: "Atendimento geral",
          },
        },
        update: { status: QueueStatus.OPEN },
        create: {
          id: uuid(300),
          bankId: aurora.id,
          branchId: auroraBaixa.id,
          serviceId: auroraServiceIds["Depósitos"],
          name: "Atendimento geral",
          date: day("2026-11-24"),
          status: QueueStatus.OPEN,
        },
      });

      const meridianoQueue = await tx.queue.upsert({
        where: {
          branchId_serviceId_date_name: {
            branchId: meridianoMatola.id,
            serviceId: meridianoServiceIds["Levantamentos"],
            date: day("2026-11-24"),
            name: "Levantamentos",
          },
        },
        update: { status: QueueStatus.OPEN },
        create: {
          id: uuid(301),
          bankId: meridiano.id,
          branchId: meridianoMatola.id,
          serviceId: meridianoServiceIds["Levantamentos"],
          name: "Levantamentos",
          date: day("2026-11-24"),
          status: QueueStatus.OPEN,
        },
      });

      const tickets = [
        {
          id: uuid(400),
          queueId: auroraQueue.id,
          ticketNumber: "A001",
          position: 1,
          status: QueueTicketStatus.IN_SERVICE,
          estimatedWaitMinutes: 0,
          calledAt: new Date("2026-11-24T09:10:00.000Z"),
          attendedAt: new Date("2026-11-24T09:12:00.000Z"),
        },
        {
          id: uuid(401),
          queueId: auroraQueue.id,
          ticketNumber: "A002",
          position: 2,
          status: QueueTicketStatus.WAITING,
          estimatedWaitMinutes: 6,
          calledAt: null,
          attendedAt: null,
        },
        {
          id: uuid(402),
          queueId: meridianoQueue.id,
          ticketNumber: "M001",
          position: 1,
          status: QueueTicketStatus.CALLED,
          estimatedWaitMinutes: 0,
          calledAt: new Date("2026-11-24T09:25:00.000Z"),
          attendedAt: null,
        },
      ];

      for (const ticket of tickets) {
        await tx.queueTicket.upsert({
          where: { id: ticket.id },
          update: {
            status: ticket.status,
            position: ticket.position,
            estimatedWaitMinutes: ticket.estimatedWaitMinutes,
            calledAt: ticket.calledAt,
            attendedAt: ticket.attendedAt,
          },
          create: {
            id: ticket.id,
            queueId: ticket.queueId,
            customerId: customer.id,
            ticketNumber: ticket.ticketNumber,
            position: ticket.position,
            status: ticket.status,
            estimatedWaitMinutes: ticket.estimatedWaitMinutes,
            calledAt: ticket.calledAt,
            attendedAt: ticket.attendedAt,
          },
        });
      }

      // 10. Documentos enviados — apenas metadados e chave privada de armazenamento
      await tx.customerDocument.upsert({
        where: { id: uuid(500) },
        update: { status: DocumentStatus.APPROVED },
        create: {
          id: uuid(500),
          customerId: customer.id,
          bankId: aurora.id,
          requiredDocumentId: auroraIdentity.id,
          fileName: "identificacao.pdf",
          storageKey: "private/aurora/cliente-demo/identificacao.pdf",
          mimeType: "application/pdf",
          fileSize: 245760,
          status: DocumentStatus.APPROVED,
          reviewedAt: new Date("2026-11-20T10:30:00.000Z"),
          reviewedById: auroraAdmin.id,
        },
      });

      await tx.customerDocument.upsert({
        where: { id: uuid(501) },
        update: { status: DocumentStatus.PENDING },
        create: {
          id: uuid(501),
          customerId: customer.id,
          bankId: meridiano.id,
          requiredDocumentId: meridianoIdentity.id,
          fileName: "comprovativo-residencia.pdf",
          storageKey: "private/meridiano/cliente-demo/comprovativo-residencia.pdf",
          mimeType: "application/pdf",
          fileSize: 189440,
          status: DocumentStatus.PENDING,
        },
      });

      // Referência auxiliar apenas para validar o isolamento no arranque.
      void auroraResidence;
      void meridianoAdmin;
    },
    { maxWait: 15_000, timeout: 90_000 },
  );

  const counts = {
    banks: await prisma.bank.count(),
    branches: await prisma.branch.count(),
    services: await prisma.service.count(),
    products: await prisma.bankProduct.count(),
    videos: await prisma.productVideo.count(),
    requiredDocuments: await prisma.requiredDocument.count(),
    users: await prisma.user.count(),
    appointments: await prisma.appointment.count(),
    queues: await prisma.queue.count(),
    queueTickets: await prisma.queueTicket.count(),
    customerDocuments: await prisma.customerDocument.count(),
  };
  console.log("Seed concluído:", JSON.stringify(counts, null, 2));
}

main()
  .catch((error) => {
    console.error("Falha no seed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
