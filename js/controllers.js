function MainCtrl($scope){
	$scope.parameters= {
	}

	$scope.updateParams = function(){
		var latex = $("#bla").mathquill('latex');
        var calc = new Calc(latex);
        var ps = calc.params();
        angular.forEach(ps, function(value, key){
        	console.log(value);
        	if(!(value in $scope.parameters)){
        		$scope.parameters[value] = {
        			name: value,
        			starting: 1,
        			ending: 10
        		};
        	}
        });
        //$scope.parameters = calc.params();
	}
}