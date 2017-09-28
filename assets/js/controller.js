angular.module('App',['ngRoute', 'ngStorage'])
.config(function ($routeProvider, $locationProvider){
  $routeProvider
  .when('/', {
    controller: 'PostsCtrl',
    templateUrl: 'partials/posts.html'
  })
  .when('/users/login', {
    controller: 'LoginCtrl',
    templateUrl: 'partials/login.html'
  })
  .when('/users/register', {
    controller: 'RegisterCtrl',
    templateUrl: 'partials/register.html'
  })
  .when('/users/logout', {
    controller: 'LogoutCtrl',
    templateUrl: 'partials/logout.html'
  })
  .otherwise({
    redirectTo: '/'
  })
  $locationProvider.html5Mode(true)
})
.run(function ($http, $localStorage, User) {
  if($localStorage.token){
    $http.defaults.headers.common['X-Auth'] = $localStorage.token
  }
})
.service('User', function($http, $localStorage) {
  this.authenticate = ()=>{
    return $http.get('/users/authenticate')
    .then((res)=>{
      return res.data
    })
  }
  this.register = (username, password)=>{
    return $http.post('/users/register',{username: username, password: password})
    .then((res)=>{
      return res.data
    })
  }
  this.login = (username, password)=>{
    return $http.post('/users/login',{username: username, password: password})
    .then((res)=>{
      if(res.data.success){
        $localStorage.token = res.data.message
        $http.defaults.headers.common['X-Auth'] = res.data.message
        return this.authenticate()
      }
      return res.data
    })
  }
  this.logout = ()=>{
    delete $localStorage.token
    delete $http.defaults.headers.common['X-Auth']
  }
})
.service('Post', function($http) {
  this.fetch = ()=>{
    return $http.get('/posts')
    .then((res)=>{
      return res.data
    })
  }
  this.create = (post)=>{
    return $http.post('/posts', post)
    .then((res)=>{
      return res.data
    })
  }
})
.controller('AppCtrl', function($scope, $location, User){
  User.authenticate()
  .then((res)=>{
    if(res.success)
      $scope.currentUser = res.message
  })
  $scope.logout = ()=>{
    User.logout()
    delete $scope.currentUser
  }
  $scope.$on('login', (_, user)=>{
    $scope.currentUser = user
  })
})
.controller('PostsCtrl',  function($scope, $location, Post){
  let socket = io.connect()
  socket.on('new post', (post)=>{
    $scope.$apply(function () {
      $scope.posts.unshift(post)
    })
  })
  Post.fetch()
  .then((res)=>{
    $scope.posts = res.message
  })
  $scope.addPost = ()=>{
    if ($scope.postBody) {
      Post.create({
        body: $scope.postBody
      })
      .then((res)=>{
        if(res.success) {
          socket.emit('new post', {author: $scope.currentUser.username, body: $scope.postBody})
          $scope.postBody = null}
        else
          $location.path('/users/login')
      })
    }
  }
})

.controller('RegisterCtrl', function($scope, User, $location) {
  $scope.register = (username, password)=>{
    User.register(username, password)
    .then((res)=>{
      if(res.success){
        $location.path('/users/login')
        console.log(res.message);
      }
  })}
})

.controller('LoginCtrl', function($scope, User, $location, $localStorage) {
  $scope.login = (username, password)=>{
    User.login(username, password)
    .then((res)=>{
      if(res.success){
        $scope.$emit('login', res.message)
        $location.path('/')}
      else {
        console.log(res.message);
      }
  })}
})
