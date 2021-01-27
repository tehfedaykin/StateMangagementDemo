import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { Villager, Personality, Species, Hobby, VillagerSortOptions, AcnhApiService} from '../acnh-api.service';

import * as VillagerActions from './actions';

 
@Injectable()
export class VillagerEffects {
 
  loadVillagers$ = createEffect(() => this.actions$.pipe(
    ofType(VillagerActions.LoadVillagers),
    mergeMap(() => this.acnhService.getVillagers()
      .pipe(
        map(villagers => VillagerActions.VillagersLoaded({villagers: villagers})),
        catchError(() => EMPTY)
      ))
    ) 
  );
 
  constructor(
    private actions$: Actions,
    private acnhService: AcnhApiService
  ) {}
}