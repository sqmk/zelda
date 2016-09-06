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

let currentTime = moment().format('h:mm a');

function checkMotion() {
		if (busy === true) {
				return;
		}

		busy = true;

		client.sensors.getById(35)
				.then(sensor => {
						let changed    = moment(`${sensor.state.lastUpdated}Z`);
						let now        = moment();
						let difference = now.diff(changed, 'seconds');

						if (sensor.state.status == 1 && difference > 0 && lastChanged != changed.format()) {
								lastChanged = changed.format();

								return say.speak(`Welcome to the lab. The time is ${currentTime}.. Your access has been logged.`, "Samantha", 1.0, () => {
										busy = false;
								});
						}

						busy = false;
				})
				.catch(err => {
						busy = false;
				});
}

setInterval(checkMotion, 1000);