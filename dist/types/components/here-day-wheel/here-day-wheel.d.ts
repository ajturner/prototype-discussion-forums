import { Entity } from '../../types';
export declare class HereDayWheel {
  /** Entities with peak activity hours */
  entities: Entity[];
  /** Current local time */
  localTime: Date;
  /** Selected entity for detail panel */
  selectedEntity: Entity | null;
  /** Hovered hour for tooltip */
  hoveredHour: number | null;
  private get now();
  private handleEntityClick;
  private renderNowHand;
  private renderHourLabels;
  private renderEntityMarkers;
  private renderCenterInfo;
  render(): any;
}
