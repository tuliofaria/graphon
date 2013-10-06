function MainCtrl($scope){
	$scope.parameters= {
	}
        $scope.lastDrawedExp = "";

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
                                                currentValue: 25
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
                $scope.drawFunction();
	}
        $scope.drawFunction = function(){
          if(graficoLayer!=null){
            var latexMath = $("#bla");
            var latex = latexMath.mathquill('latex');
            if(latex!=$scope.lastDrawedExp){
                    $scope.lastDrawedExp = latex;
                    var calc = new Calc(latex);

                    var points = [];

                    for(var i=0-cartesianSize/2; i<cartesianSize/2; i++){
                      points.push(toCartX(i));
                      ps = {};
                      ps.x = i;
                      angular.forEach($scope.parameters, function(value, key){
                        ps[value.name] = value.currentValue;
                      });
                      points.push(toCartY(calc.eval(ps)));

                    }
                    if(grafico!=null){
                      grafico.remove();
                    }
                    //[toCartX(70+iii), toCartY(70+iii), toCartX(340), toCartY(23), 450, 60, 500, 20]
                    grafico = new Kinetic.Line({
                      points: points,
                      stroke: 'red',
                      strokeWidth: 1,
                      lineCap: 'round',
                      lineJoin: 'round'
                    });
                    //stage.add(grafico);
                    graficoLayer.add(grafico);
                    graficoLayer.draw();
                  }
                }
        }
}