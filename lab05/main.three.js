function myThree(csv){
    d3.select('#histogram')
      .style('transform', 'none');

    var HEIGHT = d3.select('#histogram').node().clientHeight;
    var WIDTH = d3.select('#histogram').node().clientWidth;

    var scene = new THREE.Scene();
    var clock = new THREE.Clock();
    var camera = new THREE.PerspectiveCamera(
        45,
        WIDTH / HEIGHT,
        0.1, 
        1000
    );
    var renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    
    renderer.setClearColor(0xdddddd);
    renderer.setSize(WIDTH, HEIGHT);

    var group = new THREE.Group();

    var basePosition = 0;
    var tracks = [];

    

    for(var i = 0 ; i< csv.length; i++){
        var boxGeometry = new THREE.BoxGeometry(1, 1, 1);
        boxGeometry.center();
        var boxMaterial = new THREE.MeshBasicMaterial({color: 0x0fdfc5});
        var box = new THREE.Mesh(boxGeometry, boxMaterial);
        box.scale.set(1, +csv[i].頻率+1, 1);

        box.position.set(basePosition + i * 1.5, (+csv[i].頻率+1) / 2 , 0);
        box.name = 'box' + i;

        group.add(box);
        

        var times = [0,1];
        var values = [1,1,1,1, +csv[i].頻率+1, 1];
        var track = new THREE.KeyframeTrack('box' + i +  '.scale', times, values);
        tracks.push(track);
    }

    group.position.set(-20, -20, 10);
    scene.add(group); 

    var clip = new THREE.AnimationClip('scaleAnimation', 1, tracks);
    var mixer = new THREE.AnimationMixer(group);
    
    var animation = mixer.clipAction(clip);



    var controls = new THREE.OrbitControls( camera, renderer.domElement );
    camera.position.set(0, 0, 60);
    camera.lookAt(new THREE.Vector3(0,0,0));
    
    
    window.camera = camera;
    d3.select('#histogram')
        .node()
        .appendChild(renderer.domElement);

    
    var renderScene = function(){
        var delta = clock.getDelta();
        mixer.update(delta);
        controls.update();
        renderer.render(scene, camera);
        window.animationReq = window.requestAnimationFrame(renderScene);
    }
    setTimeout(function(){
        animation.stop();

    },1000)
    animation.play();
    renderScene();
}

function myD3(csv){
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
}





window.onload = function(){
    

    d3.csv("data.csv", function(csv){
        var sortedCsv = csv.sort(function(x, y){
            return (+y.組界) - (+x.組界);
        })

        var isD3 = true;

        myD3(sortedCsv);
        document.getElementById("ckBtn").onclick = function(){
            d3.select("#histogram")
                .html("");
            
    
            isD3 = !isD3;
    
            if(!isD3){
                d3.select("#ckBtn")
                    .text("D3JS");
                
                myThree(sortedCsv)
            }
            else {
                if(typeof window.animationReq != 'undefined'){
                    window.cancelAnimationFrame(window.animationReq);
                }

                d3.select("#ckBtn")
                    .text("ThreeJS");
                myD3(sortedCsv);
            }
        }

    });
}

