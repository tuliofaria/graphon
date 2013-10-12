var stage;
      var scale;
      var cartesianWidth;
      var cartesianHeight;
      var normalWidth;
      var normalHeight;
      
      var axisLayer;
      var axis;

      var smallerGridLayer;
      var smallerVerticalLines;
      var smallerHorizontalLines;

      var biggerGridLayer;
      var biggerVerticalLines;
      var biggerHorizontalLines;

      var lastCursorX;
      var lastCursorY;
      var isDragging;

      //aqui width e height estão normalizados
      function initLines(currentLayer,verticalArray, horizontalArray, offset, width, height, color){
        for(var i = 0; i <= width/2; i+=offset){
          var line1 = new Kinetic.Line({
                points: [i, -height/2, i, height/2],
                stroke: color,
                strokeWidth: 0.1
              });
          var line2 = new Kinetic.Line({
                points: [-i, -height/2, -i, height/2],
                stroke: color,
                strokeWidth: 0.1
              });
          verticalArray.push(line1);
          currentLayer.add(line1);
          verticalArray.push(line2);
          currentLayer.add(line2);
        }
        for(var i = 0; i <= height/2; i+=offset){
          var line1 = new Kinetic.Line({
                points: [-width/2, i, width/2, i],
                stroke: color,
                strokeWidth: 0.1
              });
          var line2 = new Kinetic.Line({
                points: [-width/2, -i, width/2, -i],
                stroke: color,
                strokeWidth: 0.1
          });
          horizontalArray.push(line1);
          currentLayer.add(line1);
          horizontalArray.push(line2);
          currentLayer.add(line2);
        }
      }

      function reDrawAxis(xOffset, yOffset){
        if(xOffset != 0){
          axis[1].getPoints()[0].x = (axis[1].getPoints()[0].x + xOffset);
          axis[1].getPoints()[1].x = (axis[1].getPoints()[1].x + xOffset);
        }
        if(yOffset!=0){
          axis[0].getPoints()[0].y = (axis[0].getPoints()[0].y + yOffset);
          axis[0].getPoints()[1].y = (axis[0].getPoints()[1].y + yOffset);
        }
      }
      
      function reDrawGrid(width, height, xOffset, yOffset, horizontalLines, verticalLines, layer){
        for(var i = 0; i < verticalLines.length; i++){
          currentLineX = verticalLines[i].getPoints()[0].x;
          if(xOffset != 0){
            if(xOffset > 0){//direita
              if(currentLineX + xOffset > width/2){//ta no final, preciso mudar pro começo...
                verticalLines[i].getPoints()[0].x = (currentLineX - width + xOffset);
                verticalLines[i].getPoints()[1].x = (currentLineX - width + xOffset);
              } else {
                verticalLines[i].getPoints()[0].x = (currentLineX + xOffset);
                verticalLines[i].getPoints()[1].x = (currentLineX + xOffset);
              }
            }else{//esquerda
              if(currentLineX + xOffset < -width/2){//ta no final à esquerda
                verticalLines[i].getPoints()[0].x = (currentLineX + width + xOffset);
                verticalLines[i].getPoints()[1].x = (currentLineX + width + xOffset);
              }else{
                verticalLines[i].getPoints()[0].x = (currentLineX + xOffset);
                verticalLines[i].getPoints()[1].x = (currentLineX + xOffset);
              }
            }
          }
        }
        for(i = 0; i < horizontalLines.length; i++){
          currentLineY = horizontalLines[i].getPoints()[0].y;
          if(yOffset!=0){
            if(yOffset > 0){//subindo
              if(currentLineY + yOffset > height/2){//ta no topo
                horizontalLines[i].getPoints()[0].y = (currentLineY - height + yOffset);
                horizontalLines[i].getPoints()[1].y = (currentLineY - height + yOffset);
              }else{
                horizontalLines[i].getPoints()[0].y = (currentLineY + yOffset);
                horizontalLines[i].getPoints()[1].y = (currentLineY + yOffset);
              }
            }else{//descendo
              if(currentLineY + yOffset < -height/2){//ta lá embaixo
                horizontalLines[i].getPoints()[0].y = (currentLineY + height + yOffset);
                horizontalLines[i].getPoints()[1].y = (currentLineY + height + yOffset);
              }else{
                horizontalLines[i].getPoints()[0].y = (currentLineY + yOffset);
                horizontalLines[i].getPoints()[1].y = (currentLineY + yOffset);
              }
            }
          }
        }
      }

      function drawAxis(){
        var xAxis = new Kinetic.Line({
          points: [-normalWidth/2, 0, normalWidth/2, 0],
          stroke: 'black',
          strokeWidth: 0.8
        });
        var yAxis = new Kinetic.Line({
          points: [0, -normalHeight/2, 0, normalHeight/2],
          stroke: 'black',
          strokeWidth: 0.8
        });
        axis.push(xAxis);
        axis.push(yAxis);
        axisLayer.add(yAxis);
        axisLayer.add(xAxis);
      }

      $(function(){
        scale = 1;
        isDragging = false;
        $("#cartesianPlane").height($(window).height());
        cartesianWidth = $("#cartesianPlane").width();
        cartesianHeight = $(window).height(); //removing padding
        normalWidth = cartesianWidth - (cartesianWidth%100) + 100;
        normalHeight = cartesianHeight - (cartesianHeight%100) + 100;
        stage = new Kinetic.Stage({
          container: 'cartesianPlane',
          width: normalWidth,
          height: normalHeight,
          draggable: false,
          x: normalWidth/2,
          y: normalHeight/2,
        });

        //init arrays
        smallerVerticalLines = [];
        biggerVerticalLines = [];
        smallerHorizontalLines = [];
        biggerHorizontalLines = [];
        axis = [];

        //initLayers
        smallerGridLayer = new Kinetic.Layer();
        initLines(smallerGridLayer,smallerVerticalLines, smallerHorizontalLines, 20, normalWidth, normalHeight, 'black');
        biggerGridLayer = new Kinetic.Layer();
        initLines(biggerGridLayer,biggerVerticalLines, biggerHorizontalLines, 100, normalWidth, normalHeight, 'red');
        axisLayer = new Kinetic.Layer();
        drawAxis();
        stage.add(smallerGridLayer);
        stage.add(biggerGridLayer);
        stage.add(axisLayer);
        stage.on('contentMousedown contentTouchstart', function(evt){
          isDragging = true;
          lastCursorX = stage.getPointerPosition().x;
          lastCursorY = stage.getPointerPosition().y;
        });  
        stage.on('contentMouseup contentTouchend', function(evt){
          isDragging = false;
        });
        stage.on('contentMousemove contentTouchmove', function(evt){
          if(isDragging){
            var xOffset = stage.getPointerPosition().x - lastCursorX;
            var yOffset = stage.getPointerPosition().y - lastCursorY;
            reDrawGrid(normalWidth, normalHeight, xOffset, yOffset, smallerHorizontalLines, smallerVerticalLines, smallerGridLayer);
            reDrawGrid(normalWidth, normalHeight, xOffset, yOffset, biggerHorizontalLines, biggerVerticalLines, biggerGridLayer);
            reDrawAxis(xOffset, yOffset);
            //com batchDraw depois pra não aparecer linha diagonal
            smallerGridLayer.batchDraw();
            biggerGridLayer.batchDraw();
            axisLayer.batchDraw();
          }
          lastCursorX = stage.getPointerPosition().x;
          lastCursorY = stage.getPointerPosition().y;
        });

        stage.draw();

        $(window).resize(function(){
          $("#cartesianPlane").height($(window).height());
        });

        $("#iconeCaret").hide();
        $(".keyboardCont").hide();
        $("#keyboardToggle").click(function(){
          $(".keyboardCont").slideToggle();
          $("#iconeCaret").toggle();
          $("#iconeCaret2").toggle();
          return false;
        });

      });