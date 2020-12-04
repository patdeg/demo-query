/*jslint for:false */

$(document).ready(function() {
  "use strict";
  $('.autoclose').click(function(event) {
    $('.navbar-collapse').collapse('hide');
  });
});

function debug(...args) {
  if (DEBUG) {
    console.log(...args);
  }   
}

function error(...args) {
  console.error(...args);  
}

const myApp = angular.module('myApp', ['ngRoute', 'ui.bootstrap', 'ui.codemirror']).
config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    "use strict";

    $locationProvider.html5Mode(true);
    $routeProvider
    /*.when('/', {
      templateUrl: 'static/html/home.html',
      controller:'HomeController'
    })
    */
    .when('/about', {
      templateUrl: 'static/html/about.html',
      controller: 'AboutController'
    })    
    .when('/query', {
      templateUrl: 'static/html/query.html',
      controller: 'QueryController'
    })  
    .otherwise({
      redirectTo: '/query'
    });
}]);

myApp.controller('BodyController', ['$scope', '$location',
  function($scope, $location) {
    "use strict";

    $scope.world = 'World';

    $scope.go = function(path) {
      debug("Going to ",path);
      $location.path(path);
    };

    $scope.isActive = function(page) {      
      $scope.location = $location.path();            
      if ($scope.location) {
        return $scope.location == page;        
      }      
      return false;
    };
  }
]);

myApp.controller('HomeController', ['$scope', '$http',
  function($scope, $http) {
    "use strict";

    $scope.world = 'World';

    $scope.getList = function() {
      debug(">>>> getList");
      var url = "/api/list";
      debug("Calling ",url);      
      $scope.is_loading = true;
      $http.get(url)
      .success(function(data) {
        $scope.is_loading = false;
        $scope.data = data;            
        debug("List:",$scope.data);            
      })
      .error(function(errorMessage, errorCode, errorThrown) {
        $scope.is_loading = false;        
        error('Error - errorMessage, errorCode, errorThrown:',
            errorMessage, errorCode, errorThrown);
        alert(errorMessage);
      });
    };
    $scope.getList();

}]);


myApp.controller('AboutController', ['$scope', 
  function($scope) {
    "use strict";

    $scope.world = 'World';

}]);

myApp.controller('QueryController', ['$scope', '$http', 
  function($scope, $http) {
    "use strict";

    $scope.world = 'World';

    
    $scope.editorOptions = {      
      mode: 'sql',
      indentWithTabs: true,
      smartIndent: true,
      lineNumbers: true,
      lineWrapping : true,
      matchBrackets : true,
      autofocus: true,
      extraKeys: {"Ctrl-Space": "autocomplete"},
      hintOptions: {tables: {
        users: ["name", "score", "birthDate"],
        countries: ["name", "population", "size"]
      }},
    };

    $scope.disable_query = false;

    $scope.submitQuery = function() {
      $scope.disable_submit = true;
      $http.post('/api/query', $scope.query)
      .success(function(data) {
        console.log("data:",data);
        $scope.disable_submit = false;
        if (data.data) {
            /*
            for (var r=0;r<data.data.length;r++) {
              for (var c=0;c<data.data[r].length;c++) {
                if (typeof data.data[r][c] === 'string' ||  data.data[r][c] instanceof String) {
                  data.data[r][c] = atob(data.data[r][c]);
                }
              }
            }          
            */
            $scope.data = data;
        } else {
            $scope.data = undefined;
            alert("Query successful");
        }
      })
      .error(function(errorMessage, errorCode, errorThrown) {
        console.log("Error - errorMessage, errorCode, errorThrown:", errorMessage, errorCode, errorThrown);
        $scope.disable_submit = false;
        alert(errorMessage);
      });
    }

    function quote(txt) {
      console.log(">>> quote:",txt);
      if (!txt) {
        return "\"\"";
      }
      if (typeof txt === 'string' || txt instanceof String) {
        return "\"" + txt.replace("\"","\"\"") + "\"";
      }
      return txt.toString();
    }

    function addText2Line(line, txt) {
      console.log(">>> addText2Line:", line, txt);
      if (line == "") {
        return quote(txt);
      }
      return line + "," + quote(txt);
    }

    $scope.saveCSV = function() {
      console.log(">>> saveCSV:",$scope.data);
      var fileContent = "";      
      var line = "";
      for (var c=0;c<$scope.data.columns.length;c++) {
        line = addText2Line(line, $scope.data.columns[c]);
      }
      fileContent = line;
      console.log(line);

      for (var r=0;r<$scope.data.data.length;r++) {
        var line = "";
        for (var c=0;c<$scope.data.data[r].length;c++) {
          line = addText2Line(line, $scope.data.data[r][c]);
        }
        fileContent = fileContent + "\n" + line;
        console.log(line);
      }

      var bb = new Blob([fileContent], { type: 'text/csv' });
      var a = document.createElement('a');
      a.download = 'data.csv';
      a.href = window.URL.createObjectURL(bb);
      a.click();

      fileContent = undefined;
      line = undefined;
      bb = undefined;
      a = undefined;
    }

    $scope.queryExamples = [
      {
        name: "2+2",
        query: `SELECT 2+2 AS Four`,
      },
      {
        name: "Create table Tbl",
        query: `CREATE TABLE Tbl (
  ONE TEXT, 
  TWO SMALLINT
)`,
      },{
        name: "Insert into Tbl",
        query: `INSERT INTO Tbl VALUES('hello',10);
INSERT INTO Tbl VALUES('world',20);
INSERT INTO Tbl VALUES('!',30);`,
  },{
        name: "Query Tbl",
        query: `SELECT * FROM Tbl`,
  },{
        name: "Delete table Tbl",
        query: `DROP TABLE Tbl`,
  },
    ];

    $scope.showQuery = function(id) {
      if ((id<0) || (id>$scope.queryExamples.length)) {
        return;
      }
      $scope.query = $scope.queryExamples[id].query;
    }

    $scope.query = $scope.queryExamples[0].query;

}]);