import * as React from 'react';
import {SelectedItems} from './types';

export interface ResourceListContextType {
  selectMode?: boolean;
  selectable?: boolean;
  selectedItems?: SelectedItems;
  resourceName?: {
    singular: string;
    plural: string;
  };
  loading?: boolean;
  onSelectionChange?(selected: boolean, id: string): void;
}

const ResourceListContext = React.createContext<ResourceListContextType>({});

export default ResourceListContext;
