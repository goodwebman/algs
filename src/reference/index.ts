import { ARRAYS } from './arrays';
import { MAPS } from './maps';
import { OBJECTS } from './objects';
import { SETS } from './sets';
import { STRINGS } from './strings';
import type { ApiGroup } from './types';

export type { ApiEntry, ApiGroup, ApiSection } from './types';

/** Порядок вкладок на странице шпаргалки. */
export const API_GROUPS: readonly ApiGroup[] = [ARRAYS, STRINGS, OBJECTS, SETS, MAPS];
