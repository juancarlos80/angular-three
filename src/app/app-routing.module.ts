import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
