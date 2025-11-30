import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import configuration from './config/configuration';
import { validationSchema } from './config/validation';
import { DatabaseModule } from './database/database.module';
import { EcopetrolModule } from './modules/ecopetrol/ecopetrol.module';
import { LocationsModule } from './modules/locations/locations.module';
import { PairsModule } from './modules/pairs/pairs.module';
import { RAGModule } from './modules/rag/rag.module';
import { RelationshipModule } from './modules/relationship/relationship.module';
import { TrendsModule } from './modules/trends/trends.module';
import { VTTModule } from './modules/vtt/vtt.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
      envFilePath: '.env',
    }),
    AuthModule,
    DatabaseModule,
    EcopetrolModule,
    PairsModule,
    TrendsModule,
    VTTModule,
    RelationshipModule,
    RAGModule,
    LocationsModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AuthService],
})
export class AppModule {}
