import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MongoCollections } from 'src/utils';

import { RelationshipController } from './relationship.controller';
import { RelationshipSchema } from './relationship.schema';
import { RelationshipService } from './relationship.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MongoCollections.Relationship, schema: RelationshipSchema },
    ]),
  ],
  controllers: [RelationshipController],
  providers: [RelationshipService],
})
export class RelationshipModule {}
