import { Villager, VillagerSortOptions } from '../acnh-api.service';
import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export interface VillagerState {
  villagers: Villager[],
  selectedSortOption: VillagerSortOptions | undefined,
  filterOptions: VillagerSortOptions[],
  showOnlyFavorites: boolean
}

export function createInitialState(): VillagerState {
  return {
    villagers: [],
    selectedSortOption: undefined,
    filterOptions: [],
    showOnlyFavorites: false
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'villager' })
export class VillagerStore extends Store<VillagerState> {

  constructor() {
    super(createInitialState());
  }

}
