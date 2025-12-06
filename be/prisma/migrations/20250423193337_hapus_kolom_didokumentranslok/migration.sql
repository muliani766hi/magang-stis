/*
  Warnings:

  - You are about to drop the column `catatanRek` on the `DokumenTranslok` table. All the data in the column will be lost.
  - You are about to drop the column `statusRek` on the `DokumenTranslok` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DokumenTranslok" DROP COLUMN "catatanRek",
DROP COLUMN "statusRek";

-- AlterTable
ALTER TABLE "Mahasiswa" ALTER COLUMN "statusRek" SET DEFAULT 'menunggu';
