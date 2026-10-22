import * as migration_20261014_183941_initial from './20261014_183941_initial';
import * as migration_20261020_055414_blog_reviews from './20261020_055414_blog_reviews';
import * as migration_20261020_081502_awards from './20261020_081502_awards';
import * as migration_20261022_113939_career_specialization from './20261022_113939_career_specialization';

export const migrations = [
  {
    up: migration_20261014_183941_initial.up,
    down: migration_20261014_183941_initial.down,
    name: '20261014_183941_initial',
  },
  {
    up: migration_20261020_055414_blog_reviews.up,
    down: migration_20261020_055414_blog_reviews.down,
    name: '20261020_055414_blog_reviews',
  },
  {
    up: migration_20261020_081502_awards.up,
    down: migration_20261020_081502_awards.down,
    name: '20261020_081502_awards',
  },
  {
    up: migration_20261022_113939_career_specialization.up,
    down: migration_20261022_113939_career_specialization.down,
    name: '20261022_113939_career_specialization'
  },
];
