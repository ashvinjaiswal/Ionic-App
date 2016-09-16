angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope,$state,UserFactory,$ionicSlideBoxDelegate) {
   $scope.setUserMood = function() {
     $state.go('tab.moodslide');
    };

    UserFactory.user_data().success(function(data){
      
      $scope.moods = data.data[0].userTodayMood;
      //var date = new Date();
      //$scope.TodayDate = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
      console.log($scope.moods);

      $scope.TodayMoodLen=data.data[0].userTodayMood;
      if($scope.TodayMoodLen == null){
          $scope.iconscreen=true;
      }
      if($scope.TodayMoodLen){
        $scope.hasMood=true;
        $state.go('tab.setmood'); 
      }
      
    }).error(function(err, statusCode) {
        controller.log(err.message);
    });
})

.controller('ChallengesCtrl', function($scope,$state,UserFactory,Loader) {

  //get the data from the factory
  Loader.showLoading('Loading...');
  UserFactory.userChallengesData().success(function(data) {
          //get the dashboard data
          console.log(data);
          $scope.challengeData = data;
          
          Loader.hideLoading();

      }).error(function(err, statusCode) {
          Loader.hideLoading();
          Loader.toggleLoadingWithMessage(err.message);
      });



  $scope.challengeDetail = function(challengeItem) {
        challengeItem['type']='active';
        //console.log(challengeItem);
       

        //set the view flag to 1 
        Loader.showLoading('Loading...');
        var flagData = {"challenge_id":challengeItem.Id,"flag":0};
        UserFactory.setUserChallengeFlag(flagData).success(function(data) {
          //get the dashboard data
          //console.log(data);
          Loader.hideLoading();
          
      }).error(function(err, statusCode) {
          Loader.hideLoading();
          Loader.toggleLoadingWithMessage(err.message);
      });


        $state.go('tab.chd',{obj: challengeItem});
  }

  // Get the pending detail
  $scope.challengePendingDetail = function(challengeItem) {
        //add the challange type
        challengeItem['type']='pending';
        //console.log(challengeItem);
        $state.go('tab.chd',{obj: challengeItem});
  }
  $scope.challengeDetailComplete = function(challengeItem) {
        //challengeItem['pending']=true;
        //$state.go('tab.ccd');
        //console.log(challengeItem);
        challengeItem['type']='pending';
        //console.log(challengeItem);
        $state.go('tab.chd',{obj: challengeItem});
  }
  
})

.controller('ChallengeDetailCtrl', function($scope,$state,$stateParams,$ionicPopup,Loader,UserFactory,ChallengeUploadFact,LSFactory) {
  $scope.challengeData = $state.params.obj;
  var itemdata = $state.params.obj;
  console.log(itemdata);
  $scope.leaveComment=false;
  //set the comment dta
  $scope.user= {
        challenge_id:itemdata.Id,
        pic:itemdata.challenge_picture,
        user_comment: itemdata.user_comment
    };


  //console.log($state.params.obj);

  //when leave comment is clicked
  $scope.comment = function(commentType){
    //console.log("comment");
    //console.log(commentType);
    $scope.commentType=commentType;
    $scope.leaveComment=true;
  }
  //when save button is click on leave comment
  $scope.detailClick = function(user){
    //console.log("detail");
    //console.log(user);
    $scope.leaveComment=false;

  }

  //Capture the challenge image
  $scope.userCheallengePic = function(user) {
      //console.log("test");
      ChallengeUploadFact.cemeraCapture().then(function(res) {
          // Success
          var cemeraFileObject = res;
          $scope.user.pic= res;
          //console.log(cemeraFileObject);
          //console.log($scope.user);

        }, function(err) {
          // Error
        });
    
  }
  // End of Capture the challenge image

  //save challenge data
  $scope.saveChallenge = function(user) {
    //console.log(user);
    //console.log($scope.user);
    //show loading indicator
    
    //check for the image requried for the step
    if($scope.challengeData.picturereq == "Y"){
      //check for the image
      if($scope.user.pic && $scope.user.user_comment){
           Loader.showLoading('Saving...');
            //console.log("image is there");
            ChallengeUploadFact.fileTransfer('http://meanmentors.com/testapi/index.php/moodeeapi/update_user_challenge',$scope.user.pic,$scope.user).then(function(data) {
              
                //hide the loading
                //console.log(data);
                Loader.hideLoading();
                //reset scope
                $scope.user= {
                    challenge_id:'',
                    pic:'',
                    user_comment: ''
                };
                $state.go('tab.challenges');
                
            }, function(err) {
                // Error
                Loader.hideLoading();
                Loader.toggleLoadingWithMessage(err.message);
              });
      }else{
        $ionicPopup.alert({
         title: 'Alert',
         template: 'Please Upload Challenge Image & Submit Comment'
        });
      }  
    }else{
      //check for the comment 
      if($scope.user.user_comment){
          Loader.showLoading('Saving...');  
          //console.log("image is not there");
          UserFactory.setUserChallenge($scope.user).success(function(data) {
              
              //hide the loading
              Loader.hideLoading();
              //console.log(data);

              //reset scope
              $scope.user= {
                  challenge_id:'',
                  pic:'',
                  user_comment: ''
              };
              
              //$state.go('tab.dash');
              $state.go('tab.challenges');
              
          }).error(function(err, statusCode) {
              Loader.hideLoading();
              Loader.toggleLoadingWithMessage(err.message);
          });

      }else{
        $ionicPopup.alert({
         title: 'Alert',
         template: 'Please submit your comment'
        });

      }
    }
     

    // //check for the image is there
    // if($scope.user.pic){

    //   Loader.showLoading('Saving...');
    //   //console.log("image is there");
    //   ChallengeUploadFact.fileTransfer('http://meanmentors.com/testapi/index.php/moodeeapi/update_user_challenge',$scope.user.pic,$scope.user).then(function(data) {
        
    //       //hide the loading
    //       //console.log(data);
    //       Loader.hideLoading();
    //       //reset scope
    //       $scope.user= {
    //           challenge_id:'',
    //           pic:'',
    //           user_comment: ''
    //       };
    //       $state.go('tab.challenges');
          
    //   }, function(err) {
    //       // Error
    //       Loader.hideLoading();
    //       Loader.toggleLoadingWithMessage(err.message);
    //     });

    // }else{
      
    //   Loader.showLoading('Saving...');  
    //   //console.log("image is not there");
    //   UserFactory.setUserChallenge($scope.user).success(function(data) {
          
    //       //hide the loading
    //       Loader.hideLoading();
    //       //console.log(data);

    //       //reset scope
    //       $scope.user= {
    //           challenge_id:'',
    //           pic:'',
    //           user_comment: ''
    //       };
          
    //       //$state.go('tab.dash');
    //       $state.go('tab.challenges');
          
    //   }).error(function(err, statusCode) {
    //       Loader.hideLoading();
    //       Loader.toggleLoadingWithMessage(err.message);
    //   });

    // }
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('SignInCtrl', function($scope, $state,AuthFactory,UserFactory,Loader) {
    $scope.user= {
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
          
      }).error(function(err) {
          Loader.hideLoading();
          Loader.toggleLoadingWithMessage(err);
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

// Navigation Controller
.controller('NavCtrl', function($scope, $state) {
  $scope.dashboard = function() {
    $state.go('tab.account',{}, {reload: true});
  };
  
})

// Account controller
.controller('AccountCtrl', function($scope,$state,$ionicModal,$ionicPlatform, $cordovaCamera, $cordovaFileTransfer,UserFactory,Loader,UploadFact,LSFactory) {

      //set scope save factory to false
      $scope.save= false;
      
      //get the user moods from the server
      UserFactory.user_dashboard().success(function(data) {
          //get the dashboard data
          
          var resposeData = data.data[0];
          //console.log(resposeData);
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
        //console.log(moodItem);
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

})


.controller('moodslideCtrl', function($scope, $state,UserFactory,$ionicSlideBoxDelegate) {  
  
  $scope.timeValue1 = new Date();
  $scope.timeValue2 = new Date();
  $scope.rating = {};
  $scope.rating.rate = 0;
  $scope.rating.max = 5;

  //sotre the current object
  $scope.currentMood ={};

  
  $scope.save = function(userMood) {
     $scope.set = $scope.set + 1;

     $scope.currentMood =userMood;
     console.log($scope.currentMood);

     //check for the final submission of the value
     if($scope.set==4){
      //console.log("save data");
      var userMoodData ={
        'mood_id':userMood.moodid,
        'ranking':$scope.rating.rate,
        'sleeptime':$scope.timeValue1,
        'wakeuptime':$scope.timeValue1};

        console.log(userMoodData);

        UserFactory.setTodayMood(userMoodData).success(function(data){

          console.log(data);
          //$state.go($state.current, {}, {reload: true});
          $state.go('tab.dash');

        }).error(function(err, statusCode) {
              controller.log(err.message);
        });


     }
   
    console.log($scope.set);
  };

  UserFactory.user_data().success(function(data){
    $scope.set = 1;
    console.log(data.data[0]);
    console.log($scope.set);
    $scope.moods = data.data[0].userTodayMood;
    $scope.moodSetDate=data.data[0].userTodayMood;
    $scope.moods = data.data[0].moods;
    $ionicSlideBoxDelegate.update();
    var date = new Date();
    $scope.TodayDate = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
    
    $scope.TodayMoodLen=data.data[0].userTodayMood;
    if($scope.TodayMoodLen == null && $scope.set==0){
        $scope.iconscreen=true;
    }
    if($scope.TodayMoodLen){
      $scope.hasMood=true;
    }
    $ionicSlideBoxDelegate.update();
  }).error(function(err, statusCode) {
      controller.log(err.message);
  });

  
});
