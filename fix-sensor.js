#!/usr/bin/env node

let huejay = require('huejay');

let client = new huejay.Client({
  host: "10.0.1.2",
  username: "06aEKvJIr3o-9m3yLE-5Jm2S9K0nY8a1MpiA9afx"
});

Promise.all([
client.groups.getById(2),
  client.sensors.getById(35),
  client.rules.getById(15),
  client.rules.getById(16)
])
  .then(result => {
    let office = result[0];
    let sensor = result[1];
    let rule15 = result[2];
    let rule16 = result[3];

    sensor.state.status = 1;
    office.scene = '2d668cde7-on-0';

    rule15.clearActions();
    rule15.addAction(
      new client.actions.ChangeSensorState(sensor, ['status'])
    );
    rule15.addAction(
      new client.actions.ChangeGroupAction(office, ['scene'])
    );

    rule16.clearActions();
    rule16.addAction(
      new client.actions.ChangeSensorState(sensor, ['status'])
    );
    rule16.addAction(
      new client.actions.ChangeGroupAction(office, ['scene'])
    );

    client.rules.save(rule15)
      .then(() => {
        console.log('success');
      })
      .catch(err => {
        console.log(err.stack);
      });

    client.rules.save(rule16)
      .then(() => {
        console.log('success');
      })
      .catch(err => {
        console.log(err.stack);
      });
    })
  .catch(err => {
    console.log(err.stack);
  });
