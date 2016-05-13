function returnData(r) { return r.data }

// UI cache, only loads once on SPA
var cache;

angular.module('app', [
    'ui.router',
    'ngMaterial',
    'ngAnimate',
    'ngAria',
    'ngMessages'
  ])
  .config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/');
    $stateProvider
      .state('home', {
        url: '/:platform',
        templateUrl: 'page.html',
        controller: 'DemoCtrl'
      });
  })
  .controller('DemoCtrl', function DemoCtrl($scope, $http, $stateParams, $state) {
    $scope.platform = $stateParams.platform || 'all'

    $scope.platformChange = function(platform){
      $state.go('home', {platform: platform})
    }

    if (cache){
      $scope.titles = cache
    }else{
      $scope.titles = []
      $http.get('/keys')
        .then(returnData)
        .then(function(ids) {
          var titles = []
          ids.forEach(function(id, i, a) {
            $http.get('/order/' + id)
              .then(returnData)
              .then(function(data) {
                titles = titles.concat(data.subproducts)
                if (i % 5 === 0 || i === (a.length-1)){
                  $scope.titles = cache = titles
                    .sort(function sortByTitle(a, b) {
                      if (a.human_name < b.human_name){
                        return -1;
                      } else if (a.human_name > b.human_name){
                        return 1;
                      } else {
                        return 0;
                      }
                    })
                    .filter(function mustHaveTitle(t){
                      return t.human_name;
                    })
                }
              })
          })
        })
    }
  })
  .filter('hasPlatform', function(){
    return function hasPlatform(items, platform){
      if (platform === 'all'){
        return items;
      }
      return items.filter(function(item){
        return (item.downloads.map(function(d){ return d.platform }).indexOf(platform) !== -1)
      })
    }
  })