import { DeepTimeEra } from '../../types';
export declare class HereDeepTime {
  /** Ordered list of eras (present → oldest) */
  eras: DeepTimeEra[];
  /** Index of the currently focused era (0 = present) */
  activeIndex: number;
  private get activeEra();
  private handleScrub;
  private renderTimeline;
  private renderEraContent;
  private getEraEmoji;
  render(): any;
}
