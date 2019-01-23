import { schema } from 'normalizr';

const Root = new schema.Entity(
  'wepow:root',
  {},
  { idAttribute: () => 'singleton' }
);

export default Root;
