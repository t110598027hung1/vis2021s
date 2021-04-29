
window.onload = function(){
    d3.csv("data.csv", function(csv){
        d3.select('#histogram')
            .style('transform', 'rotate(180deg)')
            .selectAll('div')
            .data(csv)
            .enter()
            .append('div')
            .style('position', 'relative')
            .style('opacity', '.5')
            .on('mouseover', function(){
                var el = d3.event.target;

                d3.select(el)
                    .style('opacity', 1)
                    .style('background-color' , '#fc68df')
                    .selectAll('div')
                    .style('background-color', 'transparent')
            })
            .on('mouseleave', function(){
                var el = d3.event.target;

                d3.select(el)
                    .style('opacity', 0.5)
                    .style('background-color' , 'rgba(177, 177, 235, 0.336)')
                    .selectAll('div')
                    .style('background-color', 'transparent')
            })
            .transition()
            .duration(1000)
            .style('height', function(d){
                return (+d.頻率+2) * 10 + 'px';
            })
            .attr('class', 'bar')
            .attr('title', function(d){ return '頻率' + d.頻率});

        window.setTimeout(function(){
            d3.selectAll('.bar')
                .data(csv)
                .append('div')
                .style('position', 'absolute')
                .style('top', 0)
                .style('right', '10%')
                .style('transform', 'rotate(-180deg)')
                .style('user-select', 'none')
                .text(function(d){
                    return d.組界
                });
        },1000)
    });
}
