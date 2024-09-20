/*
  Warnings:

  - Added the required column `quantity` to the `products_cart` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "products_cart" ADD COLUMN     "quantity" INTEGER NOT NULL;
