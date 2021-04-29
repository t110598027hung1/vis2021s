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
    
    renderer.setClearColor(0xffffff);
    renderer.setSize(WIDTH, HEIGHT);
    renderer.shadowMap.enabled = true;

    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-40, 60, 60);
    spotLight.castShadow = true;
    spotLight.shadow.bias = -0.0005;

    scene.add(spotLight);

    var group = new THREE.Group();

    var basePosition = 0;
    var tracks = [];
    for(var i = 0 ; i< csv.length; i++){
        var boxGeometry = new THREE.BoxGeometry(1, 1, 1);
        boxGeometry.center();
        boxGeometry.computeVertexNormals();
        var boxMaterial = new THREE.MeshLambertMaterial({color: 0xb1b1eb});
        var box = new THREE.Mesh(boxGeometry, boxMaterial);
        box.receiveShadow = true;
        box.castShadow = true;
        box.scale.set(1, +csv[i].頻率+1, 1);
        box.position.set(basePosition + i * 1.5, (+csv[i].頻率+1) / 2 , 0);
        box.name = 'box' + i;
        group.add(box);
        var times = [0,1];
        var values = [1,1,1,1, +csv[i].頻率+1, 1];
        var track = new THREE.KeyframeTrack('box' + i +  '.scale', times, values);
        tracks.push(track);
    }

    group.position.set(-20, -15, 10);
    group.rotation.y = -20 * Math.PI / 180;
    scene.add(group); 

    var planeGeometry = new THREE.PlaneGeometry(100,100,1,1);
    planeGeometry.center();
    planeGeometry.computeVertexNormals();

    var planeMaterial = new THREE.MeshLambertMaterial({color: 0xcccccc});
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set(0,-15,0);

    scene.add(plane);
    var clip = new THREE.AnimationClip('scaleAnimation', 1, tracks);
    var mixer = new THREE.AnimationMixer(group);
    
    var animation = mixer.clipAction(clip);
    var controls = new THREE.OrbitControls( camera, renderer.domElement );
    camera.position.set(0, 0, 60);
    camera.lookAt(new THREE.Vector3(0,0,0));
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

function myCanvas(csv){
    var FPS = 30;

    d3.select('#histogram')
        .style('transform', 'none');
        
    var HEIGHT = d3.select('#histogram').node().clientHeight;
    var WIDTH = d3.select('#histogram').node().clientWidth;
    
    var canvas = document.createElement("canvas");
    canvas.height = HEIGHT;
    canvas.width = WIDTH;

    d3.select('#histogram').node().appendChild(canvas);

    var ctx = canvas.getContext("2d");
    var frames = [];
    for(var i = 1 ; i<=FPS; i++){
        var heightFrame = [];
        for(var j = 0; j<csv.length; j++){
            heightFrame.push((+csv[j].頻率 + 2) * 10 / FPS * i);
        }
        frames.push(heightFrame);
    }

    var renderScene = function(){
        if(frames.length == 0){
            return;
        }

        var frame = frames.shift();
        ctx.clearRect(0,0,WIDTH, HEIGHT);
        for(var i = 0, baseX = WIDTH / 2 - csv.length/2 * 40 ; i<csv.length; i++, baseX+=40){
            ctx.beginPath();
            ctx.lineWidth = '1';
            ctx.fillStyle = '#b1b1eb';
            ctx.rect(
                baseX,
                HEIGHT - frame[i],
                40,
                frame[i]
            );
            ctx.fill();
            ctx.stroke();
            if(frames.length == 0){
                ctx.font = "20pt serif";
                ctx.fillStyle = "black";
                ctx.fillText(csv[i].組界, baseX+10, HEIGHT);     
            }    
        }

        window.animationReq = window.requestAnimationFrame(renderScene);
    };
    renderScene();
}

window.onload = function(){
    d3.csv("data.csv", function(csv){
        var sortedCsv = csv.sort(function(x, y){
            return (+y.組界) - (+x.組界);
        })

        var playIdx = 0;

        myD3(sortedCsv);

        document.getElementById("ckBtn").onclick = function(){
            d3.select("#histogram")
                .html("");
            
            if(typeof window.animationReq != 'undefined'){
                window.cancelAnimationFrame(window.animationReq);
            }

            playIdx++;
            if(playIdx > 2){
                playIdx = 0;
            }
            
            if(playIdx == 0){
                d3.select("#ckBtn")
                    .text("ThreeJS");
                
                d3.select("#material")
                    .text("div")

                myD3(sortedCsv);
            }
            else if(playIdx == 1) {
                d3.select("#ckBtn")
                    .text("Pure Canvas");

                d3.select("#material")
                    .text("ThreeJS")

                myThree(sortedCsv);
            }
            else {
                d3.select("#ckBtn")
                    .text("D3JS");

                d3.select("#material")
                    .text("Pure Canvas")
                myCanvas(sortedCsv);
            }
        }

    });
}