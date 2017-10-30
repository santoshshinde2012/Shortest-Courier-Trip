'use strict';

import { CloudTravel } from "../lib/CloudTravel";
import * as config from '../../config/config.js'; // import config

let CloudTravelRoutes = (function() {

  let routes = {};

  //collect result based on use cases
  function collectResult(use_cases) {

    return new Promise((resolve, reject) => {

      //looping through all use cases set in config
      use_cases.map((input, key) => {

        //initialize CloudTravel with inputs
        let cloudTravel = new CloudTravel(input.latArr, input.longArr, input.canTravelArr, input.start, input.dest);

        let shortestCourierTrip = cloudTravel.shortestCourierTrip.bind(cloudTravel);

        //find shortest trip
        cloudTravel.shortestCourierTrip()
          .then((res) => {

            console.log("\n Result of input : " + input.case + "\n");

            console.log("Input : ", JSON.stringify(input), "\n Output => ", res);

          }).catch(err => {

            console.log("Err in input ", input.case, " => ", err);

            reject(err);
          });

      })

      resolve();

    });
  }


  /**
   *
   * Get shortest path result
   *
   * @param req
   * @param res
   */
  routes.get = function(req, res) {

    collectResult(config.use_cases).then(() => {

      //return to request
      res.writeHead(200, {
        'Content-Type': 'text/html'
      });
      res.write('<h1>Cloud Travel</h1><br /><br />Pleade check your console for result : <a href="/">Back</a>');
      res.end();

    }).catch(err => {

      //catch the error
      res.writeHead(404, {
        'Content-Type': 'text/html'
      });
      res.write('<h1><a href="/">Cloud Travel</a></h1><br /><br />Error : ' + err);
      res.end();

    });

  };

  //intro routes to use cases
  routes.intro = function(req, res) {

    res.writeHead(200, {
      'Content-Type': 'text/html'
    });
    res.write('<h1>Cloud Travel</h1><br /><br />To get result: <a href="/cloud-travel">Shortest Courier Trip</a>');
    res.end();

  };

  return routes;

})();

module.exports = CloudTravelRoutes;
