function MainCtrl($scope){
	$scope.parameters= {
	}

	$scope.updateParams = function(){
        	var latex = $("#bla").mathquill('latex');
                var calc = new Calc(latex);
                var ps = calc.params();
                angular.forEach(ps, function(value, key){
                	if(value!="x"){
                        	if(!(value in $scope.parameters)){
                        		$scope.parameters[value] = {
                        			name: value,
                        			starting: 0,
                        			ending: 50,
                                                currentValue: 0
                        		};
                        	}
                        }
                });
                angular.forEach($scope.parameters, function(value, key){
                        if(ps.indexOf(value.name)<0){
                                delete $scope.parameters[key];
                        }
                });
                $scope.$apply();
                //$scope.parameters = calc.params();
	}
}