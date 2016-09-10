angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope,$state,UserFactory) {

   $scope.setUserMood = function() {
    console.log("mood is clicked");
    $state.go('tab.setmood');
  };



})

.controller('ChallengesCtrl', function($scope,$state, Chats) {
  $scope.challengeDetail = function() {
        $state.go('tab.chd');
  }
  $scope.challengeDetailComplete = function() {
        $state.go('tab.ccd');
  }
  
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
      //console.log($scope.user);
      //show loading indicator
      Loader.showLoading('Authenticating...');
      UserFactory.login($scope.user).success(function(data) {
          //check the data from the console
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
    $state.go('tab.dash',{}, {reload: true});

  };
  
})
.controller('NavCtrl', function($scope, $state) {
  $scope.dashboard = function() {
    $state.go('tab.account',{}, {reload: true});
  };
  
})


.controller('AccountCtrl', function($scope,$state,UserFactory,Loader) {

      
      //get the user moods from the server
      UserFactory.user_dashboard().success(function(data) {
          //get the dashboard data
          
          var resposeData = data.data[0];
          console.log(resposeData);
          $scope.moods = resposeData.userAllMoods;
          $scope.firstRowMood= $scope.moods.slice(0,4);
          $scope.secondRowMood= $scope.moods.slice(4,9);



      }).error(function(err, statusCode) {
          Loader.hideLoading();
          Loader.toggleLoadingWithMessage(err.message);
      });

      $scope.logout = function(){
        UserFactory.logout();
        $state.go('login');
      }

      //check the user selection
      $scope.setMood = function(moodId) {
        //console.log("test");
        console.log(moodId);

      };


      // var data = UserFactory.getUserMoods();
      // $scope.moods= data.moods;
      // $scope.firstRowMood= $scope.moods.slice(0,4);
      // $scope.secondRowMood= $scope.moods.slice(4,9);

      //console.log($scope.moods);
      //console.log($scope.firstRowMood);
      //console.log($scope.secondRowMood);
});
