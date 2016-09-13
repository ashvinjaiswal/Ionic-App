angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope,$state,UserFactory) {

   $scope.setUserMood = function() {
    console.log("mood is clicked");
    $state.go('tab.setmood');
  };



})

.controller('ChallengesCtrl', function($scope,$state,UserFactory) {

  //get the data from the factory
  UserFactory.userChallengesData().success(function(data) {
          //get the dashboard data
          console.log(data);
          $scope.challengeData = data;


      }).error(function(err, statusCode) {
          Loader.hideLoading();
          Loader.toggleLoadingWithMessage(err.message);
      });



  $scope.challengeDetail = function(challengeItem) {
        //console.log(challengeItem);
        //$state.go('tab.chd');

        //set the view flag to 1 
        //var flagData = {"":"","":""};


        $state.go('tab.chd',{obj: challengeItem});
  }
  $scope.challengeDetailComplete = function() {
        $state.go('tab.ccd');
  }
  
})

.controller('ChallengeDetailCtrl', function($scope,$state,$stateParams) {
  $scope.challengeData = $state.params.obj;
  //console.log($state.params.obj);

  
  
})

.controller('ChatDetailCtrl', function($scope, $stateParams) {
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
          //console.log(data);
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


.controller('AccountCtrl', function($scope,$state,$ionicModal,$ionicPlatform, $cordovaCamera, $cordovaFileTransfer,UserFactory,Loader,UploadFact,LSFactory) {

      //set scope save factory to false
      $scope.save= false;
      
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

      // Ionic Model
      $ionicModal.fromTemplateUrl('my-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
      });
      $scope.openSetMoodModal = function(moodItem) {
        console.log(moodItem);
        $scope.save =false;
        $scope.modal.show();
        $scope.moodItem=moodItem;
      };
      $scope.closeSetMoodModal = function() {
        $scope.modal.hide();
      };
      // Cleanup the modal when we're done with it!
      $scope.$on('$destroy', function() {
        $scope.modal.remove();
      });
      // Execute action on hide modal
      $scope.$on('modal.hidden', function() {
        // Execute action
      });
      // Execute action on remove modal
      $scope.$on('modal.removed', function() {
        // Execute action
      });

      $scope.uploadFile = function() {

        UploadFact.fileTo('http://meanmentors.com/testapi/index.php/moodeeapi/dashboard_mood_upload/',$scope.moodItem.moodid).then(
        function(res) {
          // Success
          $scope.moodItem.user_mood_picture = LSFactory.get('ImageURL');
          $scope.save =true;

        }, function(err) {
          // Error
        });
      };

});
