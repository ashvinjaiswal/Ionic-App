//Base url for the api
//var base = 'http://moodee.ctc500.com/moodeeapi';
var base = 'http://meanmentors.com/testapi/index.php/moodeeapi';

//var base = 'https://ionic-book-store.herokuapp.com';
angular.module('starter.factory', [])

.factory('Loader', ['$ionicLoading', '$timeout', function($ionicLoading, $timeout) {

    var LOADERAPI = {

        showLoading: function(text) {
            text = text || 'Loading...';
            $ionicLoading.show({
                template: text
            });
        },

        hideLoading: function() {
            $ionicLoading.hide();
        },

        toggleLoadingWithMessage: function(text, timeout) {
            var self = this;

            self.showLoading(text);

            $timeout(function() {
                self.hideLoading();
            }, timeout || 3000);
        }

    };
    return LOADERAPI;
}])

.factory('LSFactory', [function() {

    var LSAPI = {

        clear: function() {
            return localStorage.clear();
        },

        get: function(key) {
            return JSON.parse(localStorage.getItem(key));
        },

        set: function(key, data) {
            return localStorage.setItem(key, JSON.stringify(data));
        },

        delete: function(key) {
            return localStorage.removeItem(key);
        },

        getMoods: function() {
            var moods = [];
            var items = Object.keys(localStorage);

            for (var i = 0; i < items.length; i++) {
                if (items[i] !== 'user' || items[i] != 'token') {
                    books.push(JSON.parse(localStorage[items[i]]));
                }
            }
            return moods;
        }

    };

    return LSAPI;

}])


.factory('AuthFactory', ['LSFactory', function(LSFactory) {

    var userKey = 'user';
    var tokenKey = 'token';

    var AuthAPI = {

        isLoggedIn: function() {
            return this.getUser() === null ? false : true;
        },

        getUser: function() {
            return LSFactory.get(userKey);
        },

        setUser: function(user) {
            return LSFactory.set(userKey, user);
        },

        getToken: function() {
            return LSFactory.get(tokenKey);
        },

        setToken: function(token) {
            return LSFactory.set(tokenKey, token);
        },

        deleteAuth: function() {
            LSFactory.delete(userKey);
            LSFactory.delete(tokenKey);
        }

    };

    return AuthAPI;

}])

.factory('TokenInterceptor', ['$q', 'AuthFactory', function($q, AuthFactory) {

    return {
        request: function(config) {
            config.headers = config.headers || {};
            var token = AuthFactory.getToken();
            var user = AuthFactory.getUser();

            if (token && user) {
                config.headers['X-Access-Token'] = token.token;
                // config.headers['X-Key'] = user.email;
                // config.headers['Content-Type'] = "application/json";
            }
            return config || $q.when(config);
        },

        response: function(response) {
            return response || $q.when(response);
        }
    };

}])


.factory('BooksFactory', ['$http', function($http) {

    var perPage = 30;

    var API = {
        get: function(page) {
            return $http.get(base + '/api/v1/books/' + page + '/' + perPage);
        }
    };

    return API;
}])

.factory('UserFactory', ['$http', 'AuthFactory','LSFactory',
    function($http, AuthFactory,LSFactory) {

        var UserAPI = {

            login: function(user) {
                return $http.post(base + '/user_login', user);
            },

            user_dashboard: function() {
                return $http.get(base+'/user_dashboard_data');
            },

            register: function(user) {
                return $http.post(base + '/register', user);
            },
            setUserMoods:function(moods){
                return LSFactory.set('moods', moods);
            },
            getUserMoods:function(){
                return LSFactory.get('moods');    
            },
            logout: function() {
                AuthFactory.deleteAuth();
            }

        };

        return UserAPI;
    }
])
