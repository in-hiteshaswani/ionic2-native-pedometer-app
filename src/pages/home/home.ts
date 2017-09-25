import { Component } from '@angular/core';
import { Pedometer, IPedometerData } from '@ionic-native/pedometer';
import { Geolocation } from '@ionic-native/geolocation';
import { AlertController } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  map: any;
  startCount: Boolean = true;
  btnText: String = "START";
  stepsCount: any = 0;
  currentTime: Number;
  timeElapsed: Number;
  interval: any;
  caloriesBurnt: any = 0;
  pedometerSubscription: Subscription;

  constructor(private pedometer: Pedometer, private geolocation: Geolocation) {
              this.loadMap();
              this.map = { lat: 0, lng: 0, zoom: 17 };
  }
  
  loadMap() {
    
    this.geolocation.getCurrentPosition().then((position) => {
      this.map = { lat: position.coords.latitude, lng: position.coords.longitude, zoom: 17};
    });

    this.geolocation.watchPosition()
    .subscribe(position => {
      this.map = { lat: position.coords.latitude, lng: position.coords.longitude, zoom: 17};
    });

  }

  toggleCountSteps() {

    if(this.startCount === true) {

      console.log("Counting steps");
      this.btnText = "STOP";

      this.stepsCount = 0; // Reseting the steps counter
      this.caloriesBurnt = 0; //Resetting the calories counter

      this.currentTime = new Date().getTime();
      this.interval = setInterval(() => {
        this.timeElapsed = new Date().getTime() - 19800000 - (+this.currentTime); // Removing timezone hours
      }, 1000);

      this.pedometerSubscription = this.pedometer.startPedometerUpdates()
      .subscribe((data: IPedometerData) => {
        this.stepsCount = data.numberOfSteps;
        this.caloriesBurnt = Math.floor(this.stepsCount / 20); // Estimated that approx 20 steps burn 1 Calorie.
      });

      this.startCount = false;

    }
    else{

      this.btnText = "START";
      clearInterval(this.interval);
      this.startCount = true;
      this.pedometerSubscription.unsubscribe();

    }
  }

}
