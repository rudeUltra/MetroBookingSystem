// database.module.ts
import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        ssl: { rejectUnauthorized: false },
        entities: [join(__dirname, '**', '*.entity.{ts,js}')],
        autoLoadEntities: true, // Crucial: This finds [User] from AuthModule automatically
        synchronize: true, 
        
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}