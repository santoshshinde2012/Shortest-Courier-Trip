"use strict";

import _ from "lodash";

export class CloudTravel {

  //constructor to initialise with inputs
  constructor(latArr, longArr, canTravelArr, start, dest) {
    this.earthRadius = 4000;
    this.latArr = latArr;
    this.longArr = longArr;
    this.canTravelArr = canTravelArr;
    this.start = start;
    this.dest = dest;
  }

  // returns distance b/w 2 airports as per formula
  calcArcLength(lat1, lat2, lon1, lon2) {

    return this.earthRadius * Math.acos(Math.sin(lat1) * Math.sin(lat2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon1 - lon2));
  }

  // traverse canTravelMap, calculates Miles Traveled
  traverseCanTravelMap(currentAirport, currTravelPath) {

    // only TRUE when dest airport is found
    if (this.canTravelMap.get(currentAirport).indexOf(this.dest) > -1) {

      // so for usecase 1 as per doc, currTravelPath = "0=>2,2=>1"
      currTravelPath += "=>" + this.dest + ",";

      let milesTraveled = 0.0;

      currTravelPath.split(",").map((route) => {
        if (route) {
          milesTraveled += this.distanceMap.get(route);
        }
      });

      this.milesTraveled = milesTraveled; //total miles traveled for each use case

    } else {

      this.canTravelMap.get(currentAirport).map((canTravelAirport) => {
        currTravelPath += "=>" + canTravelAirport + "," + canTravelAirport;

        // recursion
        this.traverseCanTravelMap(canTravelAirport, currTravelPath);
      });
    }
  }

  // calculates distance between all routes found in each use case (canTravelMap)
  // Eg in case of { 0 => [ 2 ], 1 => [ 0, 2 ], 2 => [ 0, 1 ] }
  // routes will be 0 to 2, 1 to 0, 1 to 2, 2 to 0, 2 to 1
  calcTravelDistanceForAllRoutes() {

    let distanceMap = new Map();

    for (let [key, value] of this.canTravelMap) {

      value.map((canTravelAirport) => {

        let routeDistance = this.calcArcLength(this.latArr[key],
          this.latArr[canTravelAirport], this.longArr[key],
          this.longArr[canTravelAirport]);

        distanceMap.set(key + "=>" + canTravelAirport, routeDistance)
      });
    }

    return distanceMap;
  }

  // main method to find shortest courier trip
  shortestCourierTrip() {

    return new Promise((resolve, reject) => {

      this.validateConstraints().then((data) => {

        let startArr = data.canTravelMap.get(this.start);

        // check for -1 route not found
        // when data.canTravelMap has values like  { 0 => [ 2 ], 2 => [ 0 ] }
        if (startArr.length === 1 && data.canTravelMap.get(startArr[0]).length === 1 &&
          data.canTravelMap.get(startArr[0])[0] === this.start) {

          resolve(-1); // route not found

        } else if (this.start === this.dest) {
          resolve(0.0); // start airport same as dest airport
        } else {
          this.canTravelMap = data.canTravelMap;
          this.distanceMap = this.calcTravelDistanceForAllRoutes();

          let currTravelPath = this.start;

          // as this method is call recursively ,
          // 1st param denotes current airport,2nd param denotes current traveled path
          this.traverseCanTravelMap(this.start, currTravelPath);

          resolve(this.milesTraveled);
        }

      }).catch(err => {
        reject(err);
      });
    });
  }

  // validate constraints on lat, long, canTravel
  validateConstraints() {

    return new Promise((resolve, reject) => {

      // check constraint 2 as per doc
      if (!(this.latArr.length === this.longArr.length ||
          this.latArr.length === this.canTravelArr.length)) {

        reject("cloudTravel.validate()// " +
          "Length of latArr, longArr, canTravelArr not Equal");

      } else if (this.latArr.length > 20 || this.longArr.length > 20 ||
        this.canTravelArr.length > 20) { // check constraint 1 as per doc

        reject("cloudTravel.validate()// " +
          "Length of latArr or longArr or canTravelArr > 20");

      } else {

        let latLongMap = new Map(),
          canTravelMap = new Map();

        this.latArr.map((val, key) => {

          // check constraint 3 as per doc
          if (!_.inRange(val, -89, 90)) {
            reject("cloudTravel.validate()// " + "Lat val not valid");
          }

          latLongMap.set(key, {
            "lat": val
          });

        });

        this.longArr.map((val, key) => {

          // check constraint 4 as per doc
          if (!_.inRange(val, -179, 180)) {
            reject("cloudTravel.validate()// " + "Long val not valid");
          }

          let modObj = latLongMap.get(key);

          for (let [, value] of latLongMap) {

            // check constraint 8 as per doc
            if (modObj.lat === value.lat && val === value.long) {
              reject("cloudTravel.validate()// " +
                "Same Lat long not allowed for two airports");
            }
          }

          modObj.long = val;
        });

        this.canTravelArr.map((val, key) => {

          let airPortArr = [];

          val.split(" ").map((innerval) => {

            // check constraint 6 as per doc
            if (!(_.inRange(parseInt(innerval), 0, this.latArr.length))) {
              reject("cloudTravel.validate()// " + "canTravelArr val not valid");
            }

            airPortArr.push(parseInt(innerval));
          });

          canTravelMap.set(key, airPortArr);
        });

        // check constraint 7 as per doc
        if (!(_.inRange(this.start, 0, this.latArr.length) ||
            _.inRange(this.dest, 0, this.latArr.length))) {
          reject("cloudTravel.validate()// " + "start or dest val not valid");
        }

        resolve({
          latLongMap,
          canTravelMap
        });
      }
    });
  }
}
