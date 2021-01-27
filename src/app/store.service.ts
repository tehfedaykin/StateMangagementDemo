import { BehaviorSubject, Observable } from 'rxjs';

export class Store<State> {

  private _state$: BehaviorSubject<State>;
  public state$: Observable<State>;

  constructor (initialState: State) {
    this._state$ = new BehaviorSubject(initialState);
    this.state$ = this._state$.asObservable() as Observable<State>;
  }

  get state(): State {
    return this._state$.getValue();
  }

  setState (nextState: State): void {
    this._state$.next(nextState);
  }

}
