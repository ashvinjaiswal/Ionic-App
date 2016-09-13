angular.module('starter.services', [])

.factory('UploadFact', function($q, $cordovaCamera, $cordovaFileTransfer,LSFactory,AuthFactory) {

    return {
        fileTo: function(serverURL,moodid) {
            var deferred = $q.defer();
            var options = {
                quality: 50,
                targetWidth: 1023,
                targetHeight: 767,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.CAMERA
            };

        $cordovaCamera.getPicture(options).then(
            function(fileURL) {
                var token = AuthFactory.getToken();
                
                //Camera upload
                //console.log(fileURL);
                LSFactory.set('ImageURL',fileURL);
                var options = new FileUploadOptions();
                options.fileKey = "pic";
                options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
                options.mimeType = "image/jpeg";
                options.chunkedMode = true;
                options.httpMethod = 'POST';
                options.params = {'mood_id':moodid};
                options.headers={'x-access-token':token.token};
                
                //console.log(options);

                $cordovaFileTransfer.upload(serverURL, fileURL, options)
                  .then(function(result) {
                    //console.log(result);
                    deferred.resolve(result);
                  }, function(err) {
                    //console.log(err);
                    deferred.reject(err);
                  }, function (progress) {
                    //console.log(progress);
                  });

              }, function(err){
                deferred.reject(err);
              });
              return deferred.promise;

        }

    }

})

.factory('ChallengeUploadFact', function($q, $cordovaCamera, $cordovaFileTransfer,LSFactory,AuthFactory) {

    return {

        //capture the image
        cemeraCapture: function () {
            //create promises
            var deferred = $q.defer();
            //prepafre cemera option
            var options = {
                quality: 50,
                targetWidth: 1023,
                targetHeight: 767,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.CAMERA
            };
            //Call the capture image
            $cordovaCamera.getPicture(options).then(function(imageData) {
              //Resolve the image
              deferred.resolve(imageData);

            }, function(err) {
              // error
              deferred.reject(err);
            });
            //Return promise
            return deferred.promise;
        },
        fileTransfer:function(serverURL,fileURL,data){

            var deferred = $q.defer();
            //Get the token
            var token = AuthFactory.getToken();
            //Prepare for the option
            var options = new FileUploadOptions();
                options.fileKey = "pic";
                options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
                options.mimeType = "image/jpeg";
                options.chunkedMode = true;
                options.httpMethod = 'POST';
                options.params = {'challenge_id':data.challenge_id,'user_comment':data.user_comment};
                options.headers={'x-access-token':token.token};
                console.log("file options");
                console.log(options);
            
            //Transfer the file upload

                $cordovaFileTransfer.upload(serverURL, fileURL, options).then(function(result) {
                    console.log(result);
                    deferred.resolve(result);
                  }, function(err) {
                    //console.log(err);
                    deferred.reject(err);
                  }, function (progress) {
                    //console.log(progress);
                  });
            
              return deferred.promise;    

        }
    }

});