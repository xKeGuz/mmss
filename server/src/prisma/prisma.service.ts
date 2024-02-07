import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect()
      .then(() => {
        console.log(
          '🚀 ~ PrismaService ~ Conection service was successfully done',
        );
      })
      .catch((e) => {
        console.log('🚀 ~ PrismaService ~ An error ocurred while connect to DB:', e);
      });
  }
}
