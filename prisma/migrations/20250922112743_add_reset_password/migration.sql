-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "resetPasswordExpiry" TIMESTAMP(3),
ADD COLUMN     "resetPasswordToken" TEXT;
