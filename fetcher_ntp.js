  var config = require('./example.config');
  var schedule = require('node-schedule');
  var Sequelize = require('sequelize');
  var Bus = require('./bus_ntp');
  var sequelize = new Sequelize(config.db.url);
  var bus = new Bus(sequelize);

  var fetch_estimate = schedule.scheduleJob('0 0,5,10,15,20,25,30,35,40,45,50,55 * * * *', bus.fetch.estimate);
  var fetch_stop = schedule.scheduleJob('0 0 4 * * *', bus.fetch.stop);
  var fetch_route = schedule.scheduleJob('0 0 4 * * *', bus.fetch.route);
