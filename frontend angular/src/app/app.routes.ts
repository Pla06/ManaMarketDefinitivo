/**
 * Definición de rutas de la aplicación Angular.
 * Cada path apunta a un componente específico.
 */
import { Routes } from '@angular/router';
import {CardListComponent} from './components/card/card-list/card-list.component';
import {CardEditComponent} from './components/card/card-edit/card-edit.component';
import {CardDetailComponent} from './components/card/card-detail/card-detail.component';
import {CartPageComponent} from './components/cart/cart-page/cart-page.component';
import {HomeComponent} from './components/home/home.component';
import {FavoritesComponent} from './components/favorites/favorites.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'card/list',
    component: CardListComponent
  },
  {
    path: 'card/detail/:id',
    component: CardDetailComponent
  },
  {
    path: 'card/add',
    component: CardEditComponent,
  },
  {
    path: 'card/edit/:id',
    component: CardEditComponent,
  },
  {
    path: 'cart',
    component: CartPageComponent
  },
  {
    path: 'favorites',
    component: FavoritesComponent
  },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];
