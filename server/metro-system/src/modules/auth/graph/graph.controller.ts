import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { GraphService } from './graph.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('graph')
@UseGuards(AuthGuard('jwt'))  
export class GraphController {
  constructor(private readonly graphService: GraphService) {}

  @Post('update')
  async update() {
    const data = await this.graphService.updateDistanceMatrix();
    return { message: 'Matrix updated successfully', data };
  }

  @Get('distances')
  async getDistances() {
    return await this.graphService.getDistanceMatrix();
  }
}