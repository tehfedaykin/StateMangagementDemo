import { Injectable } from '@angular/core';
import { Store } from '../store.service';
import { AcnhApiService, Villager, VillagerSortOptions } from '../acnh-api.service';
import { take, tap } from 'rxjs/operators';

export interface VillagerState {
  villagers: Villager[],
  selectedSortOption: VillagerSortOptions | undefined,
  filterOptions: VillagerSortOptions[],
  showOnlyFavorites: boolean
}

export class InitialState {
  villagers = [];
  selectedSortOption = undefined;
  filterOptions = [];
  showOnlyFavorites = false;
}

@Injectable({
  providedIn: 'root'
})
export class VillagerStateService extends Store<VillagerState>{

  constructor(private acnhService: AcnhApiService) { 
    super(new InitialState());
  }


  loadVillagers(): void {
    this.acnhService.getVillagers().pipe(
      take(1),
      tap((villagers) => {
        this.setState({
          ...this.state,
          villagers
        })        
      })
    ).subscribe();
  }

  favoriteVillager(villager: Villager): void {
    const villagers = this.state.villagers;
    this.setState({
      ...this.state,
      villagers: villagers.map((vil) => {
        return {
          ...vil,
          favorite: vil.id === villager.id ? !vil.favorite : vil.favorite
        }
      })
    })
  }

  selectSort(selectedSortOption: VillagerSortOptions): void {
    this.setState({
      ...this.state,
      selectedSortOption
    })
  }

  selectFilters(filterOptions: VillagerSortOptions[]): void {
    this.setState({
      ...this.state,
      filterOptions
    })
  }

  resetSortFilter(): void {
    this.setState({
      ...this.state,
      selectedSortOption: undefined,
      filterOptions: []
    })
  }

  showFavorites(toggle: boolean): void {
    this.setState({
      ...this.state,
      showOnlyFavorites: toggle
    })
  }

  updateDisplayedVillagers(state: VillagerState): Villager[] {
    let displayVillagers = state.villagers;
    if(state.showOnlyFavorites) {
      return displayVillagers.filter(villager => villager.favorite)
    }
    else {
      const filteredList = state.filterOptions?.length ?  displayVillagers.filter((villager: Villager) => {
        const villagerVals = Object.values(villager);
        const villagerHasTrait = villagerVals.some(r=> state.filterOptions.includes(r));
        return villagerHasTrait;
      }) : displayVillagers;
      if (state.selectedSortOption) {
        return this.sortList(filteredList, state.selectedSortOption);
      }
      else {
        return filteredList
      }
    }
  }

  sortList(list: Villager[], property: VillagerSortOptions): Villager[] {
    let sortedList = [...list];
    if(property === "birthday") {
        return sortedList.sort(function(a,b){
        var [dayA, monthA] = a.birthday.split('/');
        var dateA = new Date(2020, parseInt(monthA, 10), parseInt(dayA, 10));

        var [dayB, monthB] = b.birthday.split('/');
        var dateB = new Date(2020, parseInt(monthB, 10), parseInt(dayB, 10));

        return dateA.getTime() - dateB.getTime()
      });
    }
    else {
        return sortedList.sort(function(a, b) {
        var nameA = a[property].toUpperCase();
        var nameB = b[property].toUpperCase();
  
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }    
        return 0;
      });
    }
}


}
