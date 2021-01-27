import { Component, EventEmitter, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Villager, Personality, Species, Hobby, VillagerSortOptions, AcnhApiService} from '../acnh-api.service';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { MatExpansionPanel} from '@angular/material/expansion';
import { MatSelectChange } from '@angular/material/select';

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

  private villagers: Villager[] = [];
  public displayedVillagers: Villager[] = [];
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

  constructor(private apiService: AcnhApiService) { }

  ngOnInit(): void {
    this.apiService.getVillagers().subscribe((villagers: Villager[]) => {
      this.displayedVillagers = this.villagers = villagers;
    });
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
    const filters = this.checkSelection;
    this.displayedVillagers = this.villagers.filter((villager: Villager) => {
      const villagerVals = Object.values(villager);
      const villagerHasTrait = villagerVals.some(r=> filters.includes(r));
      return villagerHasTrait;
    })
  }

  showFavorites(change: any) {
    this.accordion.close();
    if(change.checked) {
      this.displayedVillagers = this.villagers.filter(villager => villager.favorite);
    }
    else {
      this.filterList();
    }
  }

  setSort(event: MatSelectChange): void {
    this.sortList(this.villagers, event.value);
  }

  checkboxChecked(change: MatCheckboxChange) {
    const checkedValue = change.source.value as VillagerSortOptions;
    this.checkSelection  = change.checked ? [...this.checkSelection, checkedValue] : this.checkSelection.filter(item => item !== checkedValue)
  }

  favoriteVillager(event: any, villagerToFav: Villager) {
    event.stopPropagation();
    this.villagers = this.villagers.map((villager) => {
      if(villager.id === villagerToFav.id) {
        villager.favorite = !villager.favorite;
      }
      return villager;
    });
  }

  reset() {
    this.displayedVillagers = this.villagers;
    this.checkSelection = [];
    this.checkboxes.forEach((checkbox) => {
      if(checkbox.checked) {
        checkbox.toggle();
      }
    })
  }

}
