import { EventEmitter } from '../../stencil-public-runtime';
import { ExploreMode } from '../../types';
export declare class HereModeSwitcher {
  /** Currently active mode */
  activeMode: ExploreMode;
  /** Fired when user selects a different mode */
  modeChange: EventEmitter<ExploreMode>;
  private handleModeClick;
  render(): any;
}
