import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { VillagerStore } from './villager.store';
import { AcnhApiService, Villager } from '../acnh-api.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class VillagerService {

  constructor(private villagerStore: VillagerStore, private acnhService: AcnhApiService) {
  }

  getVillagers(): Observable<Villager[]> {
    return this.acnhService.getVillagers().pipe(
      tap((villagers: Villager[]) => this.villagerStore.update({villagers:villagers}))
    )
  }
  
}
