"use strict";

let config = {
    "PORT": "3000",
    "use_cases":[
        {
            "case": "case1",
            "latArr": [0, 0, 70],
            "longArr": [90, 0, 45],
            "canTravelArr": ["2", "0 2","0 1"],
            "start": 0,
            "dest": 1
        },
        {
            "case": "case2",
            "latArr": [0, 0, 70],
            "longArr": [90, 0, 45],
            "canTravelArr": ["1 2", "0 2","0 1"],
            "start": 0,
            "dest": 1
        },
        {
            "case": "case3",
            "latArr": [0, 30, 60],
            "longArr": [25, -130, 78],
            "canTravelArr": ["1 2", "0 2","1 2"],
            "start": 0,
            "dest": 0
        },
        {
            "case": "case4",
            "latArr": [0,20,55],
            "longArr": [-20,85,42],
            "canTravelArr": ["1", "0","0"],
            "start": 0,
            "dest": 2
        }
    ]
};

module.exports = config;
