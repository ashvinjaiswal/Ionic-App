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

            console.log(fileURL);
            
            LSFactory.set('ImageURL',fileURL);
            var options = new FileUploadOptions();
            options.fileKey = "pic";
            options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
            options.mimeType = "image/jpeg";
            options.chunkedMode = true;
            options.httpMethod = 'POST';
            options.params = {'mood_id':moodid};
            options.headers={'x-access-token':token.token};

            console.log(options);

            $cordovaFileTransfer.upload(serverURL, fileURL, options)
              .then(function(result) {

                console.log(result);
                deferred.resolve(result);

              }, function(err) {

                console.log(err);
                deferred.reject(err);

              }, function (progress) {

                console.log(progress);

              });

          }, function(err){
            deferred.reject(err);
          });

      

      return deferred.promise;

        }

    }

});