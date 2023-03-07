import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire/compat';

import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { TodoComponent } from './todo/todo.component';
import { TimerComponent } from './shared/timer/timer.component';
import { CountdownModule } from 'ngx-countdown';

@NgModule({
  declarations: [
    AppComponent,
    TodoComponent,
    TimerComponent
  ],
  imports: [
    BrowserModule,
    CountdownModule,
    AngularFireModule.initializeApp(environment.firebaseConfig)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
