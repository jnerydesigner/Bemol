/*
  Warnings:

  - You are about to drop the column `ordersOrderId` on the `products` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_ordersOrderId_fkey";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "ordersOrderId",
ADD COLUMN     "image_url" TEXT;
