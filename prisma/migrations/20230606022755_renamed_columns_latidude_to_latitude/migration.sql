/*
  Warnings:

  - You are about to drop the column `latidude` on the `gyms` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "gyms" DROP COLUMN "latidude",
ADD COLUMN     "latitude" DECIMAL(65,30) NOT NULL DEFAULT 0,
ALTER COLUMN "longitude" SET DEFAULT 0;
