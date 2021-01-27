import { Component, EventEmitter, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Villager, Personality, Species, Hobby, VillagerSortOptions, AcnhApiService} from '../acnh-api.service';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { MatExpansionPanel} from '@angular/material/expansion';
import { MatSelectChange } from '@angular/material/select';
import { Observable } from 'rxjs';
import { VillagerStateService } from './villager-state.service';
import { map, tap } from 'rxjs/operators';

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

  public displayedVillagers$!: Observable<Villager[]>;
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

  constructor(private stateService: VillagerStateService) { }

  ngOnInit(): void {
    this.stateService.loadVillagers();
    this.displayedVillagers$ = this.stateService.state$.pipe(
      map((state) => this.stateService.updateDisplayedVillagers(state)),
      tap((state) => console.log('state changed', state))
    )
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
    this.stateService.selectFilters(this.checkSelection);
  }

  showFavorites(change: any) {
    this.accordion.close();
    this.stateService.showFavorites(change.checked);
  }

  setSort(event: MatSelectChange): void {
    this.stateService.selectSort(event.value);
  }

  checkboxChecked(change: MatCheckboxChange) {
    const checkedValue = change.source.value as VillagerSortOptions;
    this.checkSelection  = change.checked ? [...this.checkSelection, checkedValue] : this.checkSelection.filter(item => item !== checkedValue)
  }

  favoriteVillager(event: any, villagerToFav: Villager) {
    event.stopPropagation();
    this.stateService.favoriteVillager(villagerToFav);
  }

  reset() {
    this.stateService.resetSortFilter();
    this.checkSelection = [];
    this.checkboxes.forEach((checkbox) => {
      if(checkbox.checked) {
        checkbox.toggle();
      }
    })
  }

}
