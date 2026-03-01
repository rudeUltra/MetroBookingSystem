import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

export const databaseProviders = [
  {
    provide: DataSource,
    // Inject ConfigService so the factory can use it
    inject: [ConfigService], 
    useFactory: async (configService: ConfigService) => {
      const dataSource = new DataSource({
        type: 'postgres',
        // Pull the string from your .env file
        url: configService.get<string>('DATABASE_URL'),
        ssl: {
          rejectUnauthorized: false, // Required for Neon in many environments
        },
        entities: [
            __dirname + '/../**/*.entity{.ts,.js}',
        ],
        synchronize: true, 
      });

      return dataSource.initialize();
    },
  },
];