/*
  Warnings:

  - You are about to drop the `TrainingImages` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."TrainingImages" DROP CONSTRAINT "TrainingImages_modelId_fkey";

-- DropTable
DROP TABLE "public"."TrainingImages";

-- CreateIndex
CREATE INDEX "Model_falAiRequestId_idx" ON "public"."Model"("falAiRequestId");

-- CreateIndex
CREATE INDEX "OutputImages_falAiRequestId_idx" ON "public"."OutputImages"("falAiRequestId");
