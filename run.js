#!/usr/bin/env node

let huejay = require('huejay');
let moment = require('moment-timezone');
let say    = require('say');

let client = new huejay.Client({
  host: "10.0.1.2",
  username: "06aEKvJIr3o-9m3yLE-5Jm2S9K0nY8a1MpiA9afx"
});

var busy    = false;
let lastChanged = 0;

function checkMotion() {
  if (busy === true) {
    return;
  }

  busy = true;

  Promise.all([
    client.sensors.getById(35),
    client.sensors.getById(32)
  ])
    .then(result => {
      let sensor = result[0];
      let tmpSensor = result[1];

      let changed    = moment(`${sensor.state.lastUpdated}Z`);
      let now        = moment();
      let difference = now.diff(changed, 'seconds');

      if (sensor.state.status == 1 && difference > 0 && lastChanged != changed.format()) {
        lastChanged = changed.format();

        let currentTime = moment().format('h:mm a');
        let temperature = parseInt(tmpSensor.state.temperature * 1.8 + 32);

        return say.speak(`Welcome visitor. The current time is ${currentTime}.. You are currently experiencing a thermal temperature of ${temperature} freedom units. Your access to this office has been noted. . . Have a nice day, you stupid bitch.`, "Samantha", 1.0, () => {
          busy = false;
        });
      }

      busy = false;
    })
    .catch(err => {
      console.log(err);
      busy = false;
    });
}

setInterval(checkMotion, 1000);
