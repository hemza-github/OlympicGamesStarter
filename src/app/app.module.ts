import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // Import pour ngModel
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { OlympicService } from './core/services/olympic.service';

@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, FormsModule],
  providers: [OlympicService],
  bootstrap: [AppComponent],
})
export class AppModule {}
