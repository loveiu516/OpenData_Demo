var request = require('request');
var Promise = require('bluebird');
var shellescape = require('shell-escape');
var child_process = require('child_process');
var Redis = require('redis');
Promise.promisifyAll(Redis.RedisClient.prototype);
Promise.promisifyAll(Redis.Multi.prototype);
var redis = Redis.createClient();

function fetch_json_gz_count(url,count) { 
  return new Promise(function(resolve, reject) {
console.log('processing:'+'curl -L '+'\''+url+'&$top='+count+'\'');
    child_process.exec(
  //    [shellescape(['curl', '-L', url]), '|', 'gunzip -c'].join(' '),
       shellescape(['curl', '-L', url+'&$top='+count]), 
      {
        maxBuffer: 800 * 1024 * 1024
      },
      function(err, stdout, stderr) {
//       console.log(stdout);
        resolve(JSON.parse(stdout));
      }
    );
  })
}

function fetch_json_gz_count_loop(url,count,orderby) {     
 return new Promise(function(resolve, reject) {   
var interval=2000;   
var data=[];    
var start=0; 

asyncLoop2(count/interval, 
function(loop) {
console.log('processing:'+'curl -L '+'\''+url+'&$skip='+(loop.iteration()*2000)+'&$orderby='+orderby+'\'');
child_process.exec(              
 shellescape(['curl', '-L', url+'\&\$skip='+loop.iteration()*2000+'\&\$orderby='+orderby]),         
{  
 maxBuffer: 100 * 1024 * 1024  
},
function(err, stdout, stderr) {       

//console.log(stdout);
try {
if (data.length==0)
{
data=JSON.parse(stdout);
} else
{
data2=JSON.parse(stdout);
console.log(data2.length);
//asyncLoop2(data2.length,function(loop2){ data.push(data2[loop2.interation()])} , function(){ console.log("append finished") ;setTimeout(function(){} ,2000) })
data2.forEach(function(item){data.push(item);});
}
setTimeout(function(){
loop.next();
},4000);
} catch(e)
{
//the end of data
console.log(data);
resolve(data);
}
}
)
}
//null
,
function(){
console.log("All done");
console.log(data);
resolve(data);
}
//null
);
})
}

function fetch_json_gz_count_loop_fail(url,count,orderby) {                                   
                                                                                                                                                                  
  return new Promise(function(resolve, reject) {                                                                                                                                                                                              
var interval=2000;
var data=[];
var start=0;

asyncLoop({
    length : count/interval,
    functionToLoop : function(loop, i){
        setTimeout(function(){
console.log('processing:'+'curl -L '+'\''+url+'&$skip='+(i*2000)+'&$orderby='+orderby+'\'');      
child_process.exec(               
  shellescape(['curl', '-L', url+'\&\$skip='+i+'\&\$orderby='+orderby]),                   
{ 
        maxBuffer: 100 * 1024 * 1024
      },
function(err, stdout, stderr) {     
data=JSON.parse(stdout);
}
);
loop();
        },1000);
    },
    callback : function(){
        console.log('All done!');
        resolve(data);
    }    
});

  })                                                                                                                                                                                                                                          }     


function asyncLoop2(iterations, func, callback) {
    var index = 0;
    var done = false;
    var loop = {
        next: function() {
            if (done) {
                return;
            }

            if (index < iterations) {
                index++;
                func(loop);

            } else {
                done = true;
                callback();
            }
        },

        iteration: function() {
            return index - 1;
        },

        break: function() {
            done = true;
            callback();
        }
    };
    loop.next();
    return loop;
}

var asyncLoop = function(o){
    var i=-1;

    var loop = function(){
        i++;
        if(i==o.length){o.callback(); return;}
        o.functionToLoop(loop, i);
    } 
    loop();//init
}

function fetch_json_gz(url) {
  return new Promise(function(resolve, reject) {
console.log('processing:'+'curl -L \''+url+ '\'');
    child_process.exec(
//      [shellescape(['curl', '-L', url]), '|', 'gunzip -c'].join(' '),
       shellescape(['curl', '-L', url]),
      {
        maxBuffer: 500 * 1024 * 1024
      },
      function(err, stdout, stderr) {
//console.log(stdout);
        resolve(JSON.parse(stdout));
      }
    );
  })
}


var data_sets = {
  stop: 'http://data.ntpc.gov.tw/od/data/api/18621BF3-6B00-4A07-B49C-0C5CCABFE026?$format=json',
  route: 'http://data.ntpc.gov.tw/od/data/api/5D3B5FE3-549A-40D5-8FA3-0C691230B213?$format=json',
  estimate: 'http://data.ntpc.gov.tw/od/data/api/CE74A94B-36D2-4482-A25D-670625ED0678?$format=json'
};

var sequelize;

var Bus = function(sequelize_instance) {
  sequelize = sequelize_instance;
}

Bus.prototype.fetch = {
  route: function() {
    return new Promise(function(resolve, reject) {

      fetch_json_gz(data_sets.route).then(function(data) {
//console.log(data);
        new Promise.all(data.map(function(row) {
//console.log(JSON.stringify(row));
          return sequelize.query(
            'INSERT INTO `ntp_route` (`id`, `name`, `routeQueryCode`) VALUES(:id, :name, :routeQueryCode) ON DUPLICATE KEY UPDATE `name` = :name, `routeQueryCode` = :routeQueryCode', {
              replacements: {
                id: row.RouteID,
                name: row.RouteName,
                routeQueryCode: row.RouteQueryCode
              },
              type: sequelize.QueryTypes.INSERT
            }
          );
        })).then(resolve);
     });
    });
  },
  stop: function() {
    return new Promise(function(resolve, reject) {
     fetch_json_gz_count_loop(data_sets.stop,30000,"Station_Id").then(function(data) {
        new Promise.all(data.map(function(row) {
          return sequelize.query(
            'INSERT INTO `ntp_stop` (`id`, `seq`,`departureEn`,`departureZh`,`destinationEn`,`destinationZh`,`stationNameZh`,`stationNameEn`,`route_Id`, `Back`,`route_name`) VALUES(:id, :seq,:departureEn,:departureZh,:destinationEn,:destinationZh,:stationNameZh ,:stationNameEn,:route_Id, :back, :route_name) ON DUPLICATE KEY UPDATE `seq` = :seq, `stationNameZh` = :stationNameZh, `route_Id` = :route_Id, `Back` = :back, `route_name`=:route_name', {
              replacements: {
                id: row.stationId,
                seq: row.seqNo,
                destinationEn: row.destinationEn,
                destinationZh: row.destinationZh,
                departureZh: row.departureZh,
                departureEn: row.departureEn,
                stationNameZh: row.stationNameZh,
                stationNameEn: row.stationNameEn,
                route_Id: row.routeId,
                back: row.goBack,
                route_name: row.routeNameZh
              },
              type: sequelize.QueryTypes.INSERT
            }
          );
        })).then(resolve);
      });
    });
  },
  estimate: function() {
console.log("start");
    return new Promise(function(resolve, reject) {
count_estimate=0;
     fetch_json_gz_count_loop(data_sets.estimate,30000,"StationId").then(function(data) {
        new Promise.all(data.map(function(row) {
count_estimate++;
          return redis.setAsync(row.StationId, row.EstimateTime);
        })).then(function() {
console.log("counting finished");
console.log(count_estimate);
          return resolve();
        });
      });
    });
  }
};

Bus.prototype.search = {
  route: function(name) {
    return sequelize.query(
      'SELECT * FROM `route` WHERE `name` = :name', {
        replacements: {
          name: name
        },
        type: sequelize.QueryTypes.SELECT
      }
    );
  },
  stop: function(offset, back, route_id) {
    return sequelize.query(
      'SELECT * FROM `stop` WHERE `route_id` = :route_id AND `back` = :back ORDER BY `seq` ASC LIMIT ' + parseInt(offset) + ',1', {
        replacements: {
          back: back,
          route_id: route_id
        },
        type: sequelize.QueryTypes.SELECT
      }
    );
  }
};

Bus.prototype.list = {
  stop: function(back, route_id) {
    return sequelize.query(
      'SELECT `name` FROM `stop` WHERE `route_id` = :route_id AND `back` = :back ORDER BY `seq` ASC', {
        replacements: {
          back: back,
          route_id: route_id
        },
        type: sequelize.QueryTypes.SELECT
      }
    );
  }
};

Bus.prototype.estimate = function(stop_id) {
  return redis.getAsync(stop_id);
};


module.exports = Bus;
