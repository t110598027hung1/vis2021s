function getMap(geojson, callback){
    var BASE_COLOR = '#008000';

    function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
      


    return d3.json(geojson, function(data){
        var height = 500;
        var width = 960;
        var node = document.createElement("div");

        var svg = d3.select(node)
                    .append('svg')
                    .attr('width', width)
                    .attr('height', height)
                    .attr('viewBox', '0 0 ' + width + ' ' + height)
                    

        var myPrjection = d3.geoMercator()
                            .scale(7000)
                            .center([122, 23.5]);
                            
        
        var myPath = d3.geoPath()
                       .projection(myPrjection);


        svg.selectAll("path")
            .data(data.features)
            .enter()
            .append('path')
            .attr('d', function(d){ return myPath(d)})
            .attr('fill', BASE_COLOR)
            .on('mouseover', function(d){
                document.getElementById('city-title').innerText = d.properties.COUNTYNAME;
                
                d3.event.target.style.transform = 'translateY(-5px)'
                d3.event.target.style.fill = getRandomColor();
                
            })
            .on('mouseleave', function(d){
                document.getElementById('city-title').innerText = '台灣';

                d3.event.target.style.fill = BASE_COLOR;
                d3.event.target.style.transform = 'translateY(0)'
                
            })
        return callback(node);
    });
};