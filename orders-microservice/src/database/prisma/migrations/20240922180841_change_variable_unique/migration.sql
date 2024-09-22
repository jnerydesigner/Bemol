/*
  Warnings:

  - A unique constraint covering the columns `[product_id]` on the table `products_cart` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "products_cart_product_id_key" ON "products_cart"("product_id");
