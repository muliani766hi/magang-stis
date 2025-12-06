/*
  Warnings:

  - You are about to drop the column `catatan2` on the `DokumenTranslok` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DokumenTranslok" DROP COLUMN "catatan2",
ADD COLUMN     "catatanRek" TEXT,
ADD COLUMN     "statusRek" TEXT DEFAULT 'menunggu';
