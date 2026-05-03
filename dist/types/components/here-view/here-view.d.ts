import { ExploreMode, LocationContext } from '../../types';
export declare class HereView {
  activeMode: ExploreMode;
  locationContext: LocationContext;
  loading: boolean;
  componentWillLoad(): Promise<void>;
  private initLocation;
  private getWeekOfYear;
  private handleModeChange;
  private renderModePanel;
  render(): any;
}
