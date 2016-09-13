// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','starter.factory','ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($ionicConfigProvider) {
$ionicConfigProvider.backButton.text('Go Back').icon('ion-chevron-left');
$ionicConfigProvider.navBar.alignTitle("center"); //Places them at the bottom for all OS
$ionicConfigProvider.tabs.position("bottom"); //Places them at the bottom for all OS
$ionicConfigProvider.tabs.style("standard"); //Makes them all look the same across all OS
})
 
.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  // setup the token interceptor
  $httpProvider.interceptors.push('TokenInterceptor');

  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    },
    onEnter: function($state, AuthFactory){
        if(!AuthFactory.isLoggedIn()){
           $state.go('login');
        }
    }
  })

  .state('tab.challenges', {
      url: '/challenges',
      cache: false,
      views: {
        'tab-challenges': {
          templateUrl: 'templates/tab-challenges.html',
          controller: 'ChallengesCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  })
  .state('tab.setmood', {
    url: '/setmood',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-setmood.html',
        controller: 'SetMoodCtrl'
      }
    }
  })
  .state('tab.setmood2', {
    url: '/setmood2',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-setmood2.html',
        controller: 'SetMood2Ctrl'
      }
    }
  })
  .state('tab.setmood3', {
    url: '/setmood3',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-setmood3.html',
        controller: 'SetMood3Ctrl'
      }
    }
  })

    .state('tab.chd', {
      url: '/chd',
      params: {
         obj: null
       },
       views: {
      'tab-challenges': {
        templateUrl: 'templates/challenge-detail.html',
        controller: 'ChallengeDetailCtrl'
      }
    }
  })
    
  .state('tab.ccd', {
      url: '/ccd',
       views: {
      'tab-challenges': {
        templateUrl: 'templates/challenge-complete-detail.html'
      }
    }
  })
  
  .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'SignInCtrl'
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');

});
