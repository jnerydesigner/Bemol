#!/bin/sh  


npx prisma migrate deploy --schema=/app/src/database/prisma/schema.prisma  
npx prisma generate --schema=/app/src/database/prisma/schema.prisma


npx prisma migrate dev --name init --schema=/app/src/database/prisma/schema.prisma
# ts-node ./src/infra/database/seeder/seed.ts


exec "$@"