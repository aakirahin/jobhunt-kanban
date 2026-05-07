-- CreateEnum
CREATE TYPE "Status" AS ENUM ('EMPLOYED', 'UNEMPLOYED');

-- CreateEnum
CREATE TYPE "WorkArrangement" AS ENUM ('ONSITE', 'HYBRID', 'REMOTE');

-- CreateEnum
CREATE TYPE "ContractType" AS ENUM ('FREELANCE', 'CONTRACT', 'PERMANENT');

-- CreateEnum
CREATE TYPE "JobApplicationStatus" AS ENUM ('SAVED', 'APPLIED', 'INTERVIEW', 'OFFER', 'REJECTED', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "FriendshipStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'CANCELED');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "avatar" TEXT,
    "status" "Status" NOT NULL DEFAULT 'UNEMPLOYED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Friendship" (
    "id" TEXT NOT NULL,
    "requester_id" UUID NOT NULL,
    "addressee_id" UUID NOT NULL,
    "status" "FriendshipStatus" NOT NULL DEFAULT 'PENDING',
    "requested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "responded_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Friendship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "user_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "location" TEXT,
    "work_arrangement" "WorkArrangement",
    "contract_type" "ContractType",
    "url" TEXT,
    "notes" TEXT,
    "applicationStatus" "JobApplicationStatus" NOT NULL DEFAULT 'APPLIED',
    "applied_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Columns" (
    "id" TEXT NOT NULL,
    "user_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "colour" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Columns_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Friendship_requester_id_status_idx" ON "Friendship"("requester_id", "status");

-- CreateIndex
CREATE INDEX "Friendship_addressee_id_status_idx" ON "Friendship"("addressee_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Friendship_requester_id_addressee_id_key" ON "Friendship"("requester_id", "addressee_id");

-- CreateIndex
CREATE INDEX "Job_user_id_idx" ON "Job"("user_id");

-- CreateIndex
CREATE INDEX "Job_user_id_applicationStatus_idx" ON "Job"("user_id", "applicationStatus");

-- CreateIndex
CREATE INDEX "Columns_user_id_idx" ON "Columns"("user_id");

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_requester_id_fkey" FOREIGN KEY ("requester_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_addressee_id_fkey" FOREIGN KEY ("addressee_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Columns" ADD CONSTRAINT "Columns_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
