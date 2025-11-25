import { ResponseBase } from './shared.types';
import { Relationship } from '../../modules/relationship/relationship.schema';

export type RelationshipResponse = ResponseBase<Relationship, {}>;
