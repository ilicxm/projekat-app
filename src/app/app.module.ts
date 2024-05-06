// app.module.ts

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular'; // Uvoz IonicRouteStrategy
import { RouteReuseStrategy } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InitialPageComponent } from './initial-page/initial-page.component';
import {HttpClientModule} from "@angular/common/http"; // Uvoz InitialPageComponent

@NgModule({
  declarations: [AppComponent, InitialPageComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,   HttpClientModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }], // Koristimo IonicRouteStrategy
  bootstrap: [AppComponent],
})
export class AppModule {}

