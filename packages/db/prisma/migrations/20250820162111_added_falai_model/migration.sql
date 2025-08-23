/*
  Warnings:

  - Added the required column `prompt` to the `OutputImages` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."OutputImageStatusEnum" AS ENUM ('Pending', 'Generated', 'Failed');

-- CreateEnum
CREATE TYPE "public"."ModelTrainingStatusEnum" AS ENUM ('Pending', 'Generated', 'Failed');

-- AlterTable
ALTER TABLE "public"."Model" ADD COLUMN     "falAiRequestId" TEXT,
ADD COLUMN     "tensorPath" TEXT,
ADD COLUMN     "trainingStatus" "public"."ModelTrainingStatusEnum" NOT NULL DEFAULT 'Pending',
ADD COLUMN     "triggerWord" TEXT;

-- AlterTable
ALTER TABLE "public"."OutputImages" ADD COLUMN     "falAiRequestId" TEXT,
ADD COLUMN     "prompt" TEXT NOT NULL,
ADD COLUMN     "status" "public"."OutputImageStatusEnum" NOT NULL DEFAULT 'Pending',
ALTER COLUMN "imageUrl" SET DEFAULT '';
