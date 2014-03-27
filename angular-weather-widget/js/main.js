var App = angular.module("weatherApp", ['ngRoute', 'ngAnimate', 'weatherControllers', 'weatherServices']);

App.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
      templateUrl: 'js/views/weather.html',
      controller: 'GetWeatherCtrl'
    });
  }
  ])


var weatherControllers = angular.module("weatherControllers", []);
weatherControllers.controller("AppController", ['$route', '$routeParams', '$location',
  function($route, $routeParams, $location) {

  }
  ]);

weatherControllers.controller("GetWeatherCtrl", ['$scope', 'weatherApi',
  function($scope, weatherApi) {
    weatherApi.getWeeklyWeather().then(function(response){
      $scope.data=response.data;
      if($scope.data.list.length){
        $scope.data.list.forEach(function(i, v){          
          var date=moment(i.dt*1000);           
          i.dt={
            day:date.format("ddd")
          };          
          if(moment().format("d")==date.format("d")){ 
            i.dt.today=true;
          }
        });
      }
    });
  }
  ]);

var weatherServices = angular.module('weatherServices', []);

weatherServices.factory('weatherApi', ['myHttp',
  function(myHttp) {
    return {
      getWeeklyWeather: function() {
        return myHttp.getLocal('js/data/data.json');
        // return myHttp.get('http://api.openweathermap.org/data/2.5/forecast/daily?q=Dhaka&mode=json');
      }
    }
  }
  ]);


weatherServices.factory('myHttp', ['$http', 'myCache',
  function($http, myCache) {

    var headers = {
      'cache': myCache,
      'dataType': 'json'      
    };
    var APPID="bc1e24c531732375aece237bb2a5d49a";
    return {
      config: headers,
      get: function(url, success, fail) {
        return $http.get(url+"&APPID="+APPID, this.config);
      },
      getLocal: function(url, success, fail) {
        return $http.get(url);
      },
      jsonp: function(url, success, fail) {
        return $http.jsonp(url+"&APPID="+APPID, this.config);
      }
    };
  }
  ]);

weatherServices.factory('myCache', function($cacheFactory) {
  return $cacheFactory('myCache', {
    capacity: 100
  });
});