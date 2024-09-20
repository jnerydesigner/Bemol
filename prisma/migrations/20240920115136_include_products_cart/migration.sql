/*
  Warnings:

  - You are about to drop the column `order_id` on the `products` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_order_id_fkey";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "order_id",
ADD COLUMN     "ordersOrderId" TEXT;

-- CreateTable
CREATE TABLE "products_cart" (
    "product_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "order_id" TEXT,

    CONSTRAINT "products_cart_pkey" PRIMARY KEY ("product_id")
);

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_ordersOrderId_fkey" FOREIGN KEY ("ordersOrderId") REFERENCES "orders"("order_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products_cart" ADD CONSTRAINT "products_cart_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("order_id") ON DELETE SET NULL ON UPDATE CASCADE;
