"use strict";

const body = document.body;
const hero = document.getElementById("hero");

function checkScroll(scrollY) {
  if(scrollY >= 5){
    body.classList.add("scrolled");
  } else {
    body.classList.remove("scrolled");
  }
}

window.onload = checkScroll();
document.body.onload = setTimeout(function(){document.body.className=''},800);

const callback = (entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      body.classList.remove("scrolled")
    } else {
        body.classList.add("scrolled")
    }
  })
}

const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.99
}

const scrolledObserver = new IntersectionObserver(callback, options)
scrolledObserver.observe(hero)

function addClass(A){document.documentElement.classList.add(A)}var avif=new Image;function check_webp_feature(a){var e=new Image;e.onload=function(){var A=0<e.width&&0<e.height;a(A)},e.onerror=function(){a(!1)},e.src="data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA=="}avif.src="data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=",avif.onload=function(){addClass("avif")},avif.onerror=function(){check_webp_feature(function(A){return addClass(A?"webp":"fallback")})};

// MatCap-style image rendered on a sphere

var camera, scene, renderer;
var image;
var mesh;

const satellites = [];
const ringsList = [];

//var seedDate;
function createGyros(color) {

  
    const material = new THREE.MeshPhongMaterial({
        side: THREE.DoubleSide,
        color: color,
        transparent: false,
        reflectivity:20,
        shininess:50
    });

    const geometry = new THREE.RingBufferGeometry(140, 143, 80);
    var pos = geometry.attributes.position;
    var v3 = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
        v3.fromBufferAttribute(pos, i);
        geometry.attributes.uv.setXY(i, v3.length() < 4 ? 0 : 1, 1);
    }
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = Math.PI / 2 * 0.94;
    mesh.castShadow = true;
    mesh.receiveShadow = false;
    return mesh;
}

if (window.innerWidth >= 1020) {
    init("/img/CardaWorld1627.png","/img/CardaWorld1627.png", "CardaWorld1627", "Rocky", 0.76, "Arcane", "no","1957-03-29", "no", "Versicoloria colony");
}

function init(imageURL, heightmap, name, planetType, planetSize, atmosphere, moons, seedDateString, rings, rareBiomes) {

    var seedDate = new Date(seedDateString);
    var planetRadius = 80;


    const moonsArray = moons.split(", ");
    const raritiesArray = rareBiomes.split(", ");

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); //alpha: true is used to allow backgrounds
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;


    hero.appendChild(renderer.domElement);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1500);
    camera.position.set(0, 0, 220);
    var maxDistance =290 + 8 * (0.51 * planetRadius / planetSize);


    var light = new THREE.DirectionalLight(0x404040, 2  );
    light.castShadow = true;
    //light.position.set(0, 0, 380);
    light.position.set(0, 20, maxDistance);
    light.shadow.radius = 10;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    light.shadow.bias = 0.01;

    const d = 180;

    light.shadow.camera.left = - d/2;
    light.shadow.camera.right = d/2;
    light.shadow.camera.top = d/2;
    light.shadow.camera.bottom = - d/2;
    light.shadow.camera.far = d*7;
    /* let helper = new THREE.CameraHelper ( light.shadow.camera );
    scene.add( helper ); */

    scene.add(light);

    var ambientLight = new THREE.AmbientLight(0xffffff, 0.98);
    scene.add(ambientLight);

    const loader = new THREE.TextureLoader();

    const cubeLoader = new THREE.CubeTextureLoader();
    const spaceTexture = cubeLoader.load([
        './space-posx.jpg',
        './space-negx.jpg',
        './space-posy.jpg',
        './space-negy.jpg',
        './space-posz.jpg',
        './space-negz.jpg',
    ]);
    spaceTexture.encoding = THREE.sRGBEncoding;
    scene.background = spaceTexture;

    // ----- test moon -------
    if (moonsArray[0] != "No") {
        var moonGeometry = new THREE.SphereBufferGeometry(1, 200, 200);
        var i = 0;
        for (let moon of moonsArray) {
            if(moon=="small moon"){
                var size = 0.065 * planetRadius / planetSize;
            } else if(moon=="medium moon"){
                var size = 0.14 * planetRadius / planetSize;
            } else if(moon=="large moon"){
                var size = 0.28 * planetRadius / planetSize;
            } else if(moon=="ice moon" || moon=="fungal moon"){
                var size = 0.10 * planetRadius / planetSize;
            } else if(moon=="living moon"){
                var size = 0.05 * planetRadius / planetSize;
            }

            //var size = moon == "small moon" ? 0.065 * planetRadius / planetSize : (moon == "medium moon" ? 0.14 * planetRadius / planetSize : 0.28 * planetRadius / planetSize);
            var bufferDistance = planetSize + 160; //space between planet and first moon
            var distance = bufferDistance + i*size*6; //testing new distance measure
            const moonOrbit = new THREE.Object3D();
            moonOrbit.position.x = distance;
            moonOrbit.position.y = 5;
            satellites.push(moonOrbit);
            let color=moon == "living moon"?"lightgreen":"0x000000";
            let bumpScale=moon=="ice moon"?0:0.8;

            const moonMaterial = new THREE.MeshPhongMaterial({color:color, map: loader.load("moon" + i + ".png"), bumpMap: loader.load("moon" + i + ".png"), bumpScale: bumpScale, displacementMap: loader.load("moon" + i + ".png"), displacementScale: 0, reflectivity: 1, shininess: 0 });

            const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);

            moonMesh.castShadow = true;
            moonMesh.receiveShadow = true;
            moonMesh.scale.set(size, size, size)

            // moonMesh.scale.set(.1, .1, .1);
            moonOrbit.add(moonMesh);
            //  satellites.push(moonMesh);
            scene.add(moonOrbit);
            i++;

        }
    }

    //+++++++++++++++++++++++++
    var texture = loader.load(imageURL);
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    texture.minFilter = THREE.LinearMipmapLinearFilter;

    var heightmapTexture = loader.load(heightmap);
    //heightmapTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    heightmapTexture.minFilter = THREE.LinearFilter;

    var bumpScale = planetType == "Terrestrial" ? 1.8 : 0;
    var displacementScale = planetType == "Terrestrial" ? 8 : 1.5;

    THREE.ImageUtils.crossOrigin = 'anonymous';

    var texture = loader.load(imageURL)

    if (planetType == "Crystal") {
        var material = new THREE.MeshPhongMaterial({
            //map: texture,
            bumpMap: loader.load(heightmapTexture),
            displacementMap: heightmapTexture,
            reflectivity: 0.75,
            color: "purple",
            shininess: 10,
            refractionRatio: 0.85,
            envMap: spaceTexture
            //alphaMap:heightmapTexture,
        });
        var sphere = new THREE.SphereBufferGeometry(planetRadius, 8, 6)

    } else {
        var material = new THREE.MeshPhongMaterial({
            color: "#663926",
            map: texture,
            emissive: 0x000000,
            bumpMap: loader.load(heightmap),
            displacementMap: loader.load(heightmap),
            bumpScale: 16, displacementScale: 8,
            reflectivity: 0,
            shininess: 0
        });
        var sphere = new THREE.SphereBufferGeometry(planetRadius, 360, 360)
        let month =seedDate.getMonth()+1;
        let green = month*0.7/12
        material.color.setRGB(0.8,green,0.4);
    }




    var sphere = new THREE.SphereBufferGeometry(planetRadius, 360, 360)


    mesh = new THREE.Mesh(sphere, material);

    // mesh.material.flatShading = false;
    //mesh.geometry.computeVertexNormals(true);
    mesh.castShadow = true;
    mesh.receiveShadow = true;


    scene.add(mesh);
    if(rings=="Gyros"){
        var colors=["grey","darkgrey","lightblue","darkgreen","darkred","darkred","darkblue","black","Indigo","Maroon","DarkSlateGray"]
        var pos = Math.floor(Math.random()*colors.length)
        var color=colors[pos]

        var ring1 = createGyros(color);
        var ring2=createGyros(color);
        
        ring1.rotation.x = Math.PI * 0.9;
        
        scene.add(ring1);
        scene.add(ring2);
        ringsList.push(ring1);
        ringsList.push(ring2);

    }
    

    // create custom material from the shader code above, used to add glowing atmosphere
    //   that is within specially labeled script tags


    if (atmosphere == "Helium-Hydrogen") {
        var atmosphereColors = "( 0.5, 0, 1, 1.1 )";
        var glowRadius = 105;

    } else if (atmosphere == "Radioactive") {
        var atmosphereColors = "( 0.94, 0.25, 0.2, 1.1 )";
        var glowRadius = 105;

    }
    else if (atmosphere == "Arcane") {
        var atmosphereColors = "( 0.98, 0.21, 0.25, 1.1 )";
        var glowRadius = 92;

    }
    else if (atmosphere == "Poisonous") {
        var atmosphereColors = "( 0.44, 0.85, 0.2, 1.1 )";
        var glowRadius = 103;

    }
    else if (atmosphere == "Eldritch") {
        var atmosphereColors = "( 0.84, 0.25, 0.82, 1.1 )";
        var glowRadius = 105;

    }else if (atmosphere == "Poisonous") {
        var atmosphereColors = "( 0.44, 0.85, 0.2, 1.1 )";
        var glowRadius = 103;

    }
    else if (atmosphere == "Thaumaturgic") {
        var atmosphereColors = "( 0.1, 0.1, 0.9, 1.1 )";
        var glowRadius = 103;

    }
    else if (atmosphere == "Balanced") {
        var atmosphereColors = "( 0.0, 0.0, 0.9, 1.1 )";
        var glowRadius = 103;

    } else if(atmosphere=="Biodome"){
        var atmosphereColors = "( 0.5, 0.9, 0.8 , 0.8 )";
        var glowRadius=103;

    }
    else {
        var atmosphereColors = "(0.5,0.6,1,1)";
        var glowRadius = 105;

    }

    var fragmentShader = `varying vec3 vNormal;
                        void main() 
                        {
                        float intensity = pow( 0.7 - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) ), 4.0 ); 
                        gl_FragColor = vec4${atmosphereColors} * intensity;
                        }`;

    var customMaterial = new THREE.ShaderMaterial(
        {
            uniforms: {},
            vertexShader: document.getElementById('vertexShader').textContent,
            fragmentShader: fragmentShader,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            transparent: true
        });

    var ballGeometry = new THREE.SphereBufferGeometry(glowRadius, 360, 360);
    var ball = new THREE.Mesh(ballGeometry, customMaterial);

    scene.add(ball);

    ////------------------------

    if(atmosphere=="Eldritch"){
        atmosphereColors = "(0.8,0.1,0.1,1)";
        glowRadius = 95;
        var blending=THREE.NormalBlending;

    } else if(atmosphere=="Thaumaturgic"){
        atmosphereColors = "(0.1,0.9,0,1)";
        glowRadius = 95;
        var blending=THREE.AdditiveBlending;
    } else if(atmosphere=="Balanced"){
        atmosphereColors = "(0.8,0.1,0,1)";
        glowRadius = 95;
        var blending=THREE.NormalBlending;
    } else if(atmosphere=="Red laser shield"){
        atmosphereColors = "(0.9,0.1,0,1)";
        glowRadius = 95;
        var blending=THREE.NormalBlending;
    } else if(atmosphere=="Green laser shield"){
        atmosphereColors = "(0.1,0.9,0,1)";
        glowRadius = 95;
        var blending=THREE.NormalBlending;
    }
    else if(atmosphere=="Purple laser shield"){
        atmosphereColors = "(0.65,0.1,0.85,1)";
        glowRadius = 95;
        var blending=THREE.NormalBlending;
    } else if(atmosphere=="Biodome"){
        atmosphereColors = "(0.85,1,0.45,0.7)";
        glowRadius = 95;
        var blending=THREE.NormalBlending;
    }
    else{
        atmosphereColors = "(0,0,0,0)";
        var blending=THREE.AdditiveBlending;
    }
    
    if(atmosphere == "Red laser shield" || atmosphere=="Purple laser shield" || atmosphere=="Green laser shield"){
        var fragmentShader2 = `varying vec3 vNormal;
                        void main() 
                        {
                        float intensity = pow( 0.7 + dot( vNormal, vec3( 0.0, 0.0, 1.0 ) ), 2.0 ); 
                        gl_FragColor = vec4${atmosphereColors} * intensity;
                        }`;
    } else if(atmosphere == "Biodome"){
        var blending=THREE.AdditiveBlending;
        var fragmentShader2 = `varying vec3 vNormal;
                        void main() 
                        {
                        float intensity = pow( 0.3 + dot( vNormal, vec3( 0.0, 0.0, 1.0 ) ), 0.5 ); 
                        gl_FragColor = vec4${atmosphereColors} * intensity;
                        }`;
    } else{
        var fragmentShader2 = `varying vec3 vNormal;
                        void main() 
                        {
                        float intensity = pow( 0.7-dot( vNormal, vec3( 0.0, 0.0, 1.0 ) ),4.0 ); 
                        gl_FragColor = vec4${atmosphereColors} * intensity;
                        }`;

    }
    
    var customMaterial = new THREE.ShaderMaterial(
        {
            uniforms: {},
            vertexShader: document.getElementById('vertexShader').textContent,
            fragmentShader: fragmentShader2,
            side: THREE.BackSide,
            blending: blending,
            transparent: true
        });


    var ballGeometry = new THREE.SphereBufferGeometry(glowRadius, 360, 360);
    var ball = new THREE.Mesh(ballGeometry, customMaterial);

    scene.add(ball);



    //-------------------------------

    runAnimation(seedDate, rings, raritiesArray);

    const animationCallback = (entries, observer) => {
        entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.remove("noAni");

            runAnimation(seedDate, rings, raritiesArray);
        } else {
            entry.target.classList.add("noAni");
        }
        })
    }
    
    const options2 = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    }
    
    const animationObserver = new IntersectionObserver(animationCallback, options2)
    animationObserver.observe(hero)

}

function runAnimation(seedDate, rings, raritiesArray) {
    animate();
    function animate() {
        //time =0;
        const time = (Date.now() - seedDate.getTime()) / 16000
        satellites.forEach((obj) => {
            if (time) {
                var dist = Math.sqrt(obj.position.x * obj.position.x + obj.position.z * obj.position.z);
                obj.position.x = dist * Math.sin(time * 0.5 / Math.sqrt(dist));
                obj.position.z = dist * Math.cos(time * 0.5 / Math.sqrt(dist));
            }

        });
        let i = 1;
        ringsList.forEach((obj) => {
            let toggle = (i + 1) / 2;
            obj.rotation.y = time + toggle;
            //obj.rotation.x=time+toggle;
            obj.rotation.z = time + toggle;
            i = -i;

        });
        if (!hero.classList.contains("noAni") && !document.hidden) {
            requestAnimationFrame(animate);
        }
        //controls.update(); // not required here
        mesh.rotation.x = 0.000001;
        mesh.rotation.y = time;

        if(raritiesArray.includes("Versicoloria colony")){
            var rate = (seedDate.getMonth()+1)*50;
            var lastDigit=0.3+0.9*Math.abs(Math.sin((time%rate)/rate - 0.5));
            //console.log(lastDigit)
            mesh.material.color.setRGB(0.9*lastDigit,0.5*(1-lastDigit),0.5*(1-lastDigit));
        }

        renderer.render(scene, camera);

        render();
    }
}

function render(time) {
    renderer.render(scene, camera);
}

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}