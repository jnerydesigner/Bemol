/*
  Warnings:

  - You are about to drop the column `product_id` on the `orders` table. All the data in the column will be lost.
  - Added the required column `status` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "orders" DROP COLUMN "product_id",
ADD COLUMN     "status" TEXT NOT NULL,
ADD COLUMN     "total" DECIMAL(10,2) NOT NULL;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "description" TEXT NOT NULL;
