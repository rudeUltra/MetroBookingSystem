import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LineStation } from 'src/entities/line-station.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Station } from 'src/entities/station.entity';
import { Line } from 'src/entities/line.entity';

@Injectable()
export class GraphService {
  constructor(
    @InjectRepository(LineStation)
    private lineStationRepo: Repository<LineStation>,
    @InjectRepository(Station) private stationRepo: Repository<Station>,
    @InjectRepository(Line) private lineRepo: Repository<Line>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async updateDistanceMatrix() {
    // 1. Fetch all raw data
    const [connections, stations, lines] = await Promise.all([
      this.lineStationRepo.find(),
      this.stationRepo.find(),
      this.lineRepo.find(),
    ]);

    // 2. Build Name Maps (ID -> Name) for Frontend
    const stationMap = {};
    stations.forEach(s => stationMap[s.id] = s.name);

    const lineMap = {};
    lines.forEach(l => lineMap[l.id] = l.lineName);

    // 3. New Functionality: Line Membership (Which stations belong to which line)
    const lineStationsMap: Record<number, number[]> = {};
    lines.forEach((l) => (lineStationsMap[l.id] = []));

    // 4. New Functionality: Adjacency List (For Frontend Map Visualization)
    // Key is stationId, value is list of connections
    const adjacencyList: Record<number, { to: number; weight: number; lineId: number }[]> = {};
    stations.forEach((s) => (adjacencyList[s.id] = []));

    // 3. Initialize Floyd-Warshall Matrix
    const stationIds = stations.map(s => s.id);
    const dist: Record<number, Record<number, number>> = {};

    for (const i of stationIds) {
      dist[i] = {};
      for (const j of stationIds) {
        dist[i][j] = i === j ? 0 : Infinity;
      }
    }

    // 4. Fill direct edges (Undirected)
    for (const conn of connections) {
      if (conn.nextStationId) {
        const u = conn.stationId;
        const v = conn.nextStationId;
        const w = conn.distanceToNextStop;
        const lId = conn.lineId;

        // Update Line Membership Map
      if (!lineStationsMap[lId].includes(u)) lineStationsMap[lId].push(u);
      if (v && !lineStationsMap[lId].includes(v)) lineStationsMap[lId].push(v);

      // Build Adjacency List for visualization
        adjacencyList[u].push({ to: v, weight: w, lineId: lId });
        adjacencyList[v].push({ to: u, weight: w, lineId: lId }); // Undirected
        
        // Use Math.min in case multiple lines connect same stations with different weights
        dist[u][v] = Math.min(dist[u][v], w);
        dist[v][u] = Math.min(dist[v][u], w);
      }
    }

    // 5. Run Floyd-Warshall
    for (const k of stationIds) {
      for (const i of stationIds) {
        for (const j of stationIds) {
          if (dist[i][j] > dist[i][k] + dist[k][j]) {
            dist[i][j] = dist[i][k] + dist[k][j];
          }
        }
      }
    }

    // 6. Construct final JSON bundle
    const transitData = {
      lastUpdated: new Date().toISOString(),
      stations: stationMap,
      lines: lineMap,
      distanceMatrix: dist,
      lineStations: lineStationsMap,
      graph: adjacencyList,
    };

    // 7. Store in Cache (TTL 0 = Forever)
    await this.cacheManager.set('METRO_GRAPH_DATA', transitData, 0);
    
    return transitData;
  }

  async getDistanceMatrix() {
    const cachedData = await this.cacheManager.get('METRO_GRAPH_DATA');
    return cachedData ? cachedData : this.updateDistanceMatrix();
  }
}