-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'BANK_ADMIN', 'BRANCH_MANAGER', 'EMPLOYEE', 'CUSTOMER');

-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'REJECTED');

-- CreateEnum
CREATE TYPE "QueueStatus" AS ENUM ('OPEN', 'PAUSED', 'CLOSED');

-- CreateEnum
CREATE TYPE "QueueTicketStatus" AS ENUM ('WAITING', 'CALLED', 'IN_SERVICE', 'COMPLETED', 'CANCELLED', 'NO_SHOW');

-- CreateTable
CREATE TABLE "Bank" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "logo" TEXT,
    "primaryColor" TEXT NOT NULL,
    "secondaryColor" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "phone" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'CUSTOMER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "bankId" TEXT,
    "branchId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Branch" (
    "id" TEXT NOT NULL,
    "bankId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "latitude" DECIMAL(10,7) NOT NULL,
    "longitude" DECIMAL(10,7) NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "openingTime" TIME(6) NOT NULL,
    "closingTime" TIME(6) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Branch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "bankId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "estimatedDurationMinutes" INTEGER NOT NULL DEFAULT 20,
    "requiresAppointment" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankProduct" (
    "id" TEXT NOT NULL,
    "bankId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "targetAudience" TEXT NOT NULL,
    "advantages" TEXT[],
    "fees" DECIMAL(12,2),
    "currency" TEXT NOT NULL DEFAULT 'MZN',
    "requirements" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BankProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductVideo" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "thumbnailUrl" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductVideo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequiredDocument" (
    "id" TEXT NOT NULL,
    "bankId" TEXT NOT NULL,
    "serviceId" TEXT,
    "productId" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isMandatory" BOOLEAN NOT NULL DEFAULT true,
    "acceptedFormats" TEXT[],
    "maxFileSizeMB" INTEGER NOT NULL DEFAULT 5,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RequiredDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerDocument" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "bankId" TEXT NOT NULL,
    "requiredDocumentId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "status" "DocumentStatus" NOT NULL DEFAULT 'PENDING',
    "rejectionReason" TEXT,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "reviewedById" TEXT,

    CONSTRAINT "CustomerDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "bankId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "appointmentDate" DATE NOT NULL,
    "startTime" TIME(6) NOT NULL,
    "endTime" TIME(6) NOT NULL,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Queue" (
    "id" TEXT NOT NULL,
    "bankId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "status" "QueueStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Queue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QueueTicket" (
    "id" TEXT NOT NULL,
    "queueId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "ticketNumber" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "status" "QueueTicketStatus" NOT NULL DEFAULT 'WAITING',
    "estimatedWaitMinutes" INTEGER NOT NULL DEFAULT 0,
    "calledAt" TIMESTAMP(3),
    "attendedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QueueTicket_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bank_slug_key" ON "Bank"("slug");

-- CreateIndex
CREATE INDEX "Bank_isActive_idx" ON "Bank"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_bankId_role_idx" ON "User"("bankId", "role");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_branchId_idx" ON "User"("branchId");

-- CreateIndex
CREATE INDEX "Branch_bankId_province_idx" ON "Branch"("bankId", "province");

-- CreateIndex
CREATE INDEX "Branch_bankId_isActive_idx" ON "Branch"("bankId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "Branch_bankId_code_key" ON "Branch"("bankId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "Branch_bankId_name_key" ON "Branch"("bankId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Branch_id_bankId_key" ON "Branch"("id", "bankId");

-- CreateIndex
CREATE INDEX "Service_bankId_isActive_idx" ON "Service"("bankId", "isActive");

-- CreateIndex
CREATE INDEX "Service_bankId_category_idx" ON "Service"("bankId", "category");

-- CreateIndex
CREATE UNIQUE INDEX "Service_bankId_name_key" ON "Service"("bankId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Service_id_bankId_key" ON "Service"("id", "bankId");

-- CreateIndex
CREATE INDEX "BankProduct_bankId_isActive_idx" ON "BankProduct"("bankId", "isActive");

-- CreateIndex
CREATE INDEX "BankProduct_bankId_category_idx" ON "BankProduct"("bankId", "category");

-- CreateIndex
CREATE UNIQUE INDEX "BankProduct_bankId_slug_key" ON "BankProduct"("bankId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "BankProduct_bankId_name_key" ON "BankProduct"("bankId", "name");

-- CreateIndex
CREATE INDEX "ProductVideo_productId_idx" ON "ProductVideo"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductVideo_productId_title_key" ON "ProductVideo"("productId", "title");

-- CreateIndex
CREATE INDEX "RequiredDocument_bankId_serviceId_idx" ON "RequiredDocument"("bankId", "serviceId");

-- CreateIndex
CREATE INDEX "RequiredDocument_bankId_productId_idx" ON "RequiredDocument"("bankId", "productId");

-- CreateIndex
CREATE INDEX "RequiredDocument_bankId_isActive_idx" ON "RequiredDocument"("bankId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "RequiredDocument_id_bankId_key" ON "RequiredDocument"("id", "bankId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerDocument_storageKey_key" ON "CustomerDocument"("storageKey");

-- CreateIndex
CREATE INDEX "CustomerDocument_bankId_customerId_idx" ON "CustomerDocument"("bankId", "customerId");

-- CreateIndex
CREATE INDEX "CustomerDocument_bankId_status_idx" ON "CustomerDocument"("bankId", "status");

-- CreateIndex
CREATE INDEX "CustomerDocument_customerId_uploadedAt_idx" ON "CustomerDocument"("customerId", "uploadedAt");

-- CreateIndex
CREATE INDEX "CustomerDocument_reviewedById_idx" ON "CustomerDocument"("reviewedById");

-- CreateIndex
CREATE INDEX "Appointment_bankId_appointmentDate_idx" ON "Appointment"("bankId", "appointmentDate");

-- CreateIndex
CREATE INDEX "Appointment_bankId_status_idx" ON "Appointment"("bankId", "status");

-- CreateIndex
CREATE INDEX "Appointment_branchId_appointmentDate_idx" ON "Appointment"("branchId", "appointmentDate");

-- CreateIndex
CREATE INDEX "Appointment_serviceId_idx" ON "Appointment"("serviceId");

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_customerId_appointmentDate_startTime_key" ON "Appointment"("customerId", "appointmentDate", "startTime");

-- CreateIndex
CREATE INDEX "Queue_bankId_date_idx" ON "Queue"("bankId", "date");

-- CreateIndex
CREATE INDEX "Queue_bankId_status_idx" ON "Queue"("bankId", "status");

-- CreateIndex
CREATE INDEX "Queue_branchId_date_idx" ON "Queue"("branchId", "date");

-- CreateIndex
CREATE INDEX "Queue_serviceId_idx" ON "Queue"("serviceId");

-- CreateIndex
CREATE UNIQUE INDEX "Queue_branchId_serviceId_date_name_key" ON "Queue"("branchId", "serviceId", "date", "name");

-- CreateIndex
CREATE INDEX "QueueTicket_ticketNumber_idx" ON "QueueTicket"("ticketNumber");

-- CreateIndex
CREATE INDEX "QueueTicket_queueId_status_idx" ON "QueueTicket"("queueId", "status");

-- CreateIndex
CREATE INDEX "QueueTicket_customerId_idx" ON "QueueTicket"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "QueueTicket_queueId_ticketNumber_key" ON "QueueTicket"("queueId", "ticketNumber");

-- CreateIndex
CREATE UNIQUE INDEX "QueueTicket_queueId_position_key" ON "QueueTicket"("queueId", "position");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "Bank"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_branchId_bankId_fkey" FOREIGN KEY ("branchId", "bankId") REFERENCES "Branch"("id", "bankId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Branch" ADD CONSTRAINT "Branch_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "Bank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "Bank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankProduct" ADD CONSTRAINT "BankProduct_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "Bank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVideo" ADD CONSTRAINT "ProductVideo_productId_fkey" FOREIGN KEY ("productId") REFERENCES "BankProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequiredDocument" ADD CONSTRAINT "RequiredDocument_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "Bank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequiredDocument" ADD CONSTRAINT "RequiredDocument_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequiredDocument" ADD CONSTRAINT "RequiredDocument_productId_fkey" FOREIGN KEY ("productId") REFERENCES "BankProduct"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerDocument" ADD CONSTRAINT "CustomerDocument_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerDocument" ADD CONSTRAINT "CustomerDocument_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "Bank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerDocument" ADD CONSTRAINT "CustomerDocument_requiredDocumentId_bankId_fkey" FOREIGN KEY ("requiredDocumentId", "bankId") REFERENCES "RequiredDocument"("id", "bankId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerDocument" ADD CONSTRAINT "CustomerDocument_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "Bank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_branchId_bankId_fkey" FOREIGN KEY ("branchId", "bankId") REFERENCES "Branch"("id", "bankId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_serviceId_bankId_fkey" FOREIGN KEY ("serviceId", "bankId") REFERENCES "Service"("id", "bankId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Queue" ADD CONSTRAINT "Queue_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "Bank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Queue" ADD CONSTRAINT "Queue_branchId_bankId_fkey" FOREIGN KEY ("branchId", "bankId") REFERENCES "Branch"("id", "bankId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Queue" ADD CONSTRAINT "Queue_serviceId_bankId_fkey" FOREIGN KEY ("serviceId", "bankId") REFERENCES "Service"("id", "bankId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueueTicket" ADD CONSTRAINT "QueueTicket_queueId_fkey" FOREIGN KEY ("queueId") REFERENCES "Queue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueueTicket" ADD CONSTRAINT "QueueTicket_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Um documento exigido pertence a um serviço OU a um produto, nunca a ambos.
ALTER TABLE "RequiredDocument" DROP CONSTRAINT IF EXISTS "RequiredDocument_service_or_product";
ALTER TABLE "RequiredDocument" ADD CONSTRAINT "RequiredDocument_service_or_product"
  CHECK (("serviceId" IS NOT NULL AND "productId" IS NULL)
      OR ("serviceId" IS NULL AND "productId" IS NOT NULL));
