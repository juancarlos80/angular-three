import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarouselComponent } from './carousel/carousel.component';
import { CubeComponent } from './cube/cube.component';
import { ListSquareComponent } from './list-square/list-square.component';

const routes: Routes = [
  {
    path: "",
    component: CubeComponent
  },
  {
    path: "list",
    component: ListSquareComponent
  },
  {
    path: "carousel",
    component: CarouselComponent
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
