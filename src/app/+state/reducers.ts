import { createReducer, on, Action } from '@ngrx/store';
import { Villager, VillagerSortOptions } from '../acnh-api.service';

import * as VillagerActions from './actions';

export interface VillagerState {
  villagers: Villager[],
  selectedSortOption: VillagerSortOptions | undefined,
  filterOptions: VillagerSortOptions[],
  showOnlyFavorites: boolean
}


export const initialState: VillagerState = {
  villagers: [],
  selectedSortOption: undefined,
  filterOptions: [],
  showOnlyFavorites: false
}

const villagerReducer = createReducer(
  initialState,
  on(VillagerActions.VillagersLoaded, (state, {villagers}) => ({...state, villagers})),
  on(VillagerActions.SelectSort, (state, {selectedSortOption}) => ({...state, selectedSortOption})),
  on(VillagerActions.SelectFilters, (state, {filterOptions}) => ({...state, filterOptions})),
  on(VillagerActions.ResetSortFilter, (state) => ({...state, filterOptions: [], selectedSortOption: undefined})),
  on(VillagerActions.FavoriteVillager, (state, {villager}) => {
    return {
      ...state,
      villagers: state.villagers.map((vil) => {
        return {
          ...vil,
          favorite: vil.id === villager.id ? !vil.favorite : vil.favorite
        }
      })
    }
  }),
  on(VillagerActions.ShowFavorites, (state, {toggle}) => ({...state, showOnlyFavorites: toggle}))
);

export function reducers(state: VillagerState | undefined, action: Action) {
  return villagerReducer(state, action);
}