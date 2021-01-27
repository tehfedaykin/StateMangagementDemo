import { VillagerSortOptions, Villager } from '../acnh-api.service';
import { createAction, props } from '@ngrx/store';

export const LoadVillagers = createAction('[Villagers] Load');
export const VillagersLoaded = createAction(
    '[Villagers] Loaded', 
    props<{villagers: Villager[]}>()
);
export const FavoriteVillager = createAction(
    '[Villagers] Favorite', 
    props<{villager: Villager}>()
);

export const SelectSort = createAction(
    '[Villagers] Sort',
    props<{selectedSortOption: VillagerSortOptions}>()
)

export const SelectFilters = createAction(
    '[Villagers] Filter',
    props<{filterOptions: VillagerSortOptions[]}>()
)

export const ResetSortFilter = createAction(
    '[Villagers] Reset Filter & Sort'
)

export const ShowFavorites = createAction(
    '[Villagers] Show Favorites',
    props<{toggle: boolean}>()
)