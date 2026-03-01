import { Module } from '@nestjs/common';
import { GraphController } from './graph.controller';
import { GraphService } from './graph.service';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LineStation } from 'src/entities/line-station.entity';
import { Station } from 'src/entities/station.entity';
import { Line } from 'src/entities/line.entity';
@Module({
  imports: [
    CacheModule.register({
  ttl: 0, // Store forever in RAM Add url for redis TO DO
  // No "store" or "url" property means it uses default memory storage
}),
    TypeOrmModule.forFeature([LineStation, Station, Line]),
  ],
  controllers: [GraphController],
  providers: [GraphService],
})
export class GraphModule {}
