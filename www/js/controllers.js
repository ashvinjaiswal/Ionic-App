angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope,$state,UserFactory) {

  //  $scope.signIn = function(user) {
  //   $state.go('tab.setmood');
  // };



})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('SignInCtrl', function($scope, $state,AuthFactory,UserFactory,Loader) {
   $scope.user = {
                email: '',
                password: ''
            };


  
  $scope.signIn = function() {
      console.log($scope.user);
      Loader.showLoading('Authenticating...');

      UserFactory.login($scope.user).success(function(data) {
          console.log(data);

          data = data.data[0];
          AuthFactory.setUser(data.email);
          AuthFactory.setToken({
              token: data.Token                            
          });
          UserFactory.setUserMoods({
            moods:data.moods
          });

          //hide the loading
          Loader.hideLoading();
          $state.go('tab.dash');
          
      }).error(function(err, statusCode) {
          Loader.hideLoading();
          Loader.toggleLoadingWithMessage(err.message);
      });









    
  };
  
})
.controller('SetMoodCtrl', function($scope, $state) {  
  $scope.save = function(user) {
    $state.go('tab.setmood2');
  };
  
})
.controller('SetMood2Ctrl', function($scope, $state) {  
  
  $scope.save = function(user) {
    $state.go('tab.setmood3');
  };
  
})
.controller('SetMood3Ctrl', function($scope, $state) {  
  
  $scope.save = function(user) {
    $state.go('tab.setmood4');
  };
  
})



.controller('AccountCtrl', function($scope,$state,UserFactory) {
  //get the user moods
  var data = UserFactory.getUserMoods();
  $scope.moods= data.moods;
  $scope.firstRowMood= $scope.moods.slice(0,4);
  $scope.secondRowMood= $scope.moods.slice(4,9);

  //console.log($scope.moods);
  //console.log($scope.firstRowMood);
  //console.log($scope.secondRowMood);
});
