import { Entity, PhenologyCategory } from '../../types';
export declare class HerePhenologyWheel {
  /** Entities with phenology information */
  entities: Entity[];
  /** Current week of year (1-52) */
  currentWeek: number;
  /** Selected entity */
  selectedEntity: Entity | null;
  /** Active category filters (empty = show all) */
  activeFilters: Set<PhenologyCategory>;
  private toggleFilter;
  private isVisible;
  private renderMonthLabels;
  private renderCurrentWeekSlice;
  private renderEntityArcs;
  private renderCenterSummary;
  render(): any;
}
