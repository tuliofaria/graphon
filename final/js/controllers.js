function MainCtrl($scope, $timeout){
	$scope.parameters= {
	};
    $scope.isAnimatingParams = false;
    
    $scope.$watch('parameters', function(newValue){
        if(!$scope.isAnimatingParams){
            var ps = {};
            angular.forEach($scope.parameters, function(value, key){
                ps[key] = value.currentValue;
            });
            drawChart(ps);
        }
    }, true);

    $timeout(function somework(){
        if($scope.isAnimatingParams){
            var ps = {};
            angular.forEach($scope.parameters, function(value, key){
                if(value.ending<=value.currentValue){
                    $scope.parameters[key].currentValue = value.starting;
                }else{
                    $scope.parameters[key].currentValue+=value.step;
                }
                ps[key] = value.currentValue;
            });
            drawChart(ps);
        }
        $timeout(somework, 500);
    }, 500);

	$scope.updateParams = function(){
	    var latex = $("#bla").mathquill('latex');
        var calc = new Calc(latex);
        var ps = calc.params();
        angular.forEach(ps, function(value, key){
        	if(value!="x"){
                	if(!(value in $scope.parameters)){
                		$scope.parameters[value] = {
                			name: value,
                			starting: 1,
                			ending: 10,
                            currentValue: 1,
                            step: 1
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

    $scope.size = function(obj){
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    }
}