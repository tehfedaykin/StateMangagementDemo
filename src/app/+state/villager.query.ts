import { Injectable } from '@angular/core';
import { Villager, VillagerSortOptions } from '../acnh-api.service';
import { Query } from '@datorama/akita';
import { VillagerStore, VillagerState } from './villager.store';

@Injectable({ providedIn: 'root' })
export class VillagerQuery extends Query<VillagerState> {
  displayVillagers$ = this.select((state) => {
    if(state.showOnlyFavorites) {
      return state.villagers.filter(villager => villager.favorite)
    }
    else {
      const filteredList = state.filterOptions?.length ?  state.villagers.filter((villager: Villager) => {
        const villagerVals = Object.values(villager);
        const villagerHasTrait = villagerVals.some(r=> state.filterOptions.includes(r));
        return villagerHasTrait;
      }) : state.villagers;
      if (state.selectedSortOption) {
        return this.sortList(filteredList, state.selectedSortOption);
      }
      else {
          return filteredList
      }
    }

  });

  constructor(protected store: VillagerStore) {
    super(store);
  }

  sortList(list: Villager[], property: VillagerSortOptions) {
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
