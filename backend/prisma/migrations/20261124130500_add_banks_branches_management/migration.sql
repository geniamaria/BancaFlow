-- AlterTable
ALTER TABLE "Branch" ADD COLUMN     "city" TEXT;

-- CreateTable
CREATE TABLE "UserBranchAssignment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bankId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserBranchAssignment_pkey" PRIMARY KEY ("id")
);

-- Regra que não é expressível directamente no schema Prisma:
-- apenas gestores de agência e funcionários podem ter associações de agência.
ALTER TABLE "UserBranchAssignment"
ADD CONSTRAINT "UserBranchAssignment_role_check"
CHECK ("role" IN ('BRANCH_MANAGER', 'EMPLOYEE'));

-- CreateIndex
CREATE INDEX "UserBranchAssignment_bankId_branchId_idx" ON "UserBranchAssignment"("bankId", "branchId");

-- CreateIndex
CREATE INDEX "UserBranchAssignment_userId_isActive_idx" ON "UserBranchAssignment"("userId", "isActive");

-- CreateIndex
CREATE INDEX "UserBranchAssignment_branchId_isActive_idx" ON "UserBranchAssignment"("branchId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "UserBranchAssignment_userId_branchId_key" ON "UserBranchAssignment"("userId", "branchId");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_bankId_key" ON "User"("id", "bankId");

-- AddForeignKey
ALTER TABLE "UserBranchAssignment" ADD CONSTRAINT "UserBranchAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBranchAssignment" ADD CONSTRAINT "UserBranchAssignment_userId_bankId_fkey" FOREIGN KEY ("userId", "bankId") REFERENCES "User"("id", "bankId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBranchAssignment" ADD CONSTRAINT "UserBranchAssignment_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "Bank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBranchAssignment" ADD CONSTRAINT "UserBranchAssignment_branchId_bankId_fkey" FOREIGN KEY ("branchId", "bankId") REFERENCES "Branch"("id", "bankId") ON DELETE CASCADE ON UPDATE CASCADE;
