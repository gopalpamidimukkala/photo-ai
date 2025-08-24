-- AlterTable
ALTER TABLE "public"."OutputImages" ALTER COLUMN "imageUrl" DROP NOT NULL,
ALTER COLUMN "imageUrl" DROP DEFAULT;
