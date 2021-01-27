import { Component, EventEmitter, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Villager, Personality, Species, Hobby, VillagerSortOptions, AcnhApiService} from '../acnh-api.service';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { MatExpansionPanel} from '@angular/material/expansion';
import { MatSelectChange } from '@angular/material/select';
import { VillagerQuery } from '../+state/villager.query';
import { VillagerStore } from '../+state/villager.store';
import { take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { VillagerService } from '../+state/villager.service';

interface CheckboxGroup {
  attribute: VillagerSortOptions,
  list: any
}
@Component({
  selector: 'animal-crossing-villager-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.less']
})
export class VillagerListComponent implements OnInit {
  @ViewChild(MatExpansionPanel) accordion!: MatExpansionPanel;
  @ViewChildren(MatCheckbox) checkboxes!: QueryList<MatCheckbox>;

  public displayedVillagers$: Observable<Villager[]> = this.villagerQuery.displayVillagers$;
  private checkSelection: VillagerSortOptions[] = [];
  public sortOptions = ["personality", "species", "hobby", "birthday"];
  public checkBoxList: CheckboxGroup[] = [
    {
      attribute: 'personality',
      list: Object.values(Personality)
    },
    {
      attribute: 'species',
      list: Object.values(Species)
    },
    {
      attribute: 'hobby',
      list: Object.values(Hobby)
    }
  ]

  constructor(
    private villagerService: VillagerService, 
    private villagerQuery: VillagerQuery,
    private villagerStore: VillagerStore
    ) { }

  ngOnInit(): void {
    this.villagerService.getVillagers().pipe(take(1)).subscribe();
  }

  sortList(list: Villager[], property: VillagerSortOptions): Villager[] {
    if(property === "birthday") {
      return list.sort(function(a,b){
        var [dayA, monthA] = a.birthday.split('/');
        var dateA = new Date(2020, parseInt(monthA, 10), parseInt(dayA, 10));

        var [dayB, monthB] = b.birthday.split('/');
        var dateB = new Date(2020, parseInt(monthB, 10), parseInt(dayB, 10));

        return dateA.getTime() - dateB.getTime()
      });
    }
    else {
      return list.sort(function(a, b) {
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

  filterList() {
    this.accordion.close();
    this.villagerStore.update({filterOptions: this.checkSelection});
  }

  showFavorites(change: any) {
    this.accordion.close();
    this.villagerStore.update({showOnlyFavorites: change.checked});
  }

  setSort(event: MatSelectChange): void {
    this.villagerStore.update({selectedSortOption: event.value});
  }

  checkboxChecked(change: MatCheckboxChange) {
    const checkedValue = change.source.value as VillagerSortOptions;
    this.checkSelection  = change.checked ? [...this.checkSelection, checkedValue] : this.checkSelection.filter(item => item !== checkedValue)
  }

  favoriteVillager(event: any, villagerToFav: Villager) {
    event.stopPropagation();
    this.villagerStore.update((state) => {
      return {
        ...state, 
        villagers: state.villagers.map((vil) => {
          return {
            ...vil,
            favorite: vil.id === villagerToFav.id ? !vil.favorite : vil.favorite
          }
        })
      }
    })
  }

  reset() {
    this.villagerStore.update({selectedSortOption: undefined, filterOptions: []});    this.checkSelection = [];
    this.checkboxes.forEach((checkbox) => {
      if(checkbox.checked) {
        checkbox.toggle();
      }
    })
  }

}
