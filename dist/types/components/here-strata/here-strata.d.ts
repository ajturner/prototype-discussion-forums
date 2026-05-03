import { StrataLayer, Entity } from '../../types';
export declare class HereStrata {
  /** Ordered list of strata layers (sky → bedrock) */
  layers: StrataLayer[];
  /** Currently expanded layer key */
  expandedLayer: string | null;
  /** Currently selected entity for the detail panel */
  selectedEntity: Entity | null;
  private toggleLayer;
  private selectEntity;
  private renderDepthRuler;
  private renderEntityPanel;
  render(): any;
}
