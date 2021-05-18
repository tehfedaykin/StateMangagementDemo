import { Component, EventEmitter, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Villager, Personality, Species, Hobby, VillagerSortOptions, AcnhApiService} from '../acnh-api.service';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { MatExpansionPanel} from '@angular/material/expansion';
import { MatSelectChange } from '@angular/material/select';
import { BehaviorSubject, combineLatest, merge, Observable, Subject } from 'rxjs';
import { map, mapTo } from 'rxjs/operators';

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
  private selectedSortOption$ = new BehaviorSubject<VillagerSortOptions | undefined>(undefined);
  private filterOptions$ = new BehaviorSubject<VillagerSortOptions[]>([]);
  private reset$ = new Subject<boolean>();

  constructor(private apiService: AcnhApiService) { }

  ngOnInit(): void {

    const villagers$: Observable<Villager[]> = this.apiService.getVillagers();

    const sortReset$ = this.reset$.pipe((
      mapTo(undefined)
    ))
    const selectedSortOptions$ = merge(this.selectedSortOption$, sortReset$);

    const filterReset$ = this.reset$.pipe((
      mapTo([])
    ));
    const filterOptions$: Observable<VillagerSortOptions[] | []> = merge(this.filterOptions$, filterReset$)

    this.displayedVillagers$ = combineLatest([villagers$, selectedSortOptions$, filterOptions$]).pipe(
      map(([villagers, sortOption, filterOptions]) => {
        const villagerList = filterOptions.length ? villagers.filter((villager: Villager) => {
          const villagerVals: string[] = Object.values(villager);
          const filters = filterOptions as string[];
          const villagerHasTrait = villagerVals.some((trait) => filters.includes(trait))
          return villagerHasTrait;
        }) : villagers;

        return sortOption ? this.sortList(villagerList, sortOption) : villagerList
      })
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
    this.filterOptions$.next(this.checkSelection);
  }

  showFavorites(change: any) {
    this.accordion.close();
    // if(change.checked) {
    //   this.displayedVillagers = this.villagers.filter(villager => villager.favorite);
    // }
    // else {
    //   this.filterList();
    // }
  }

  setSort(value: VillagerSortOptions): void {
    this.selectedSortOption$.next(value);
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
    this.reset$.next(true);
    this.checkSelection = [];
    this.checkboxes.forEach((checkbox) => {
      if(checkbox.checked) {
        checkbox.toggle();
      }
    })
  }

}
