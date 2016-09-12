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
    $state.go('tab.setmood4');
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

      // -----------Upload Code Starts--------------------


        var images = [];
        $scope.imageDatas = images;

        $scope.data = { "ImageURI" :  "Select Image" };

        $scope.takePicture = function() {
          var options = {
              quality: 50,
              targetWidth: 300,
              targetHeight: 300,
              destinationType: Camera.DestinationType.FILE_URI,
              sourceType: Camera.PictureSourceType.CAMERA
            };
          $cordovaCamera.getPicture(options).then(
          function(imageData) {
            $scope.picData = imageData;
            images.push(imageData);
            $scope.ftLoad = true;
            window.localstorage.set('fotoUp', imageData);
            $ionicLoading.show({template: 'loading photo', duration:500});
            console.log($scope.data);
          },
          function(err){
              $ionicLoading.show({template: 'EROOR IN GETTING', duration:500});
          })
        }

        $scope.selectPicture = function() { 
          var options = {
            quality: 50,
            targetWidth: 300,
            targetHeight: 300,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY
          };

          $cordovaCamera.getPicture(options).then(
          function(imageURL) {
            window.resolveLocalFileSystemURL(imageURL, function(fileEntry) {
              $scope.picData = fileEntry.nativeURL;
              images.push(fileEntry.nativeURL);
              $scope.ftLoad = true;
              var image = document.getElementById('myImage');
              image.src = fileEntry.nativeURL;
              });
            $ionicLoading.show({template: 'loading photo', duration:500});
            console.log($scope.data);
          },
          function(err){
            $ionicLoading.show({template: 'EROOR IN GETTING', duration:500});
          })
        };

        

        $scope.showActionsheet = function() {
        
        $ionicActionSheet.show({
          titleText: 'Choose Upload Option',
          buttons: [
            { text: '<i class="icon ion-camera"></i> From Camera' },
            { text: '<i class="icon ion-images"></i> From Gallery' },
          ],
          destructiveText: 'Delete',
          cancelText: 'Cancel',
          cancel: function() {
            console.log('CANCELLED');
          },
          buttonClicked: function(index) {
            console.log('BUTTON CLICKED', index);
            return true;
          },
           buttonClicked: function(index) {
                if(index === 0) {
                   $scope.takePicture();
                }
            
                if(index === 1) {
                   $scope.selectPicture();
                }
             },
          destructiveButtonClicked: function() {
            console.log('DESTRUCT');
            return true;
          }
        });
      };
      // -----------Upload Code Ends---------------------- 

});
