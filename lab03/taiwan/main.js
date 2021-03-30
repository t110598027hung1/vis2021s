
window.addEventListener('load', function(){
    getMap('taiwan.geojson', function(data){
        console.log(data)
        document.getElementById('map').appendChild(data)

    })
})