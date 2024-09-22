/*
  Warnings:

  - The primary key for the `products_cart` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The required column `product_cart_id` was added to the `products_cart` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "products_cart" DROP CONSTRAINT "products_cart_pkey",
ADD COLUMN     "product_cart_id" TEXT NOT NULL,
ADD CONSTRAINT "products_cart_pkey" PRIMARY KEY ("product_cart_id");
