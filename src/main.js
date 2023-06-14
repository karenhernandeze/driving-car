import * as THREE from 'three';

let camera, scene, renderer, groupCar, light;

let maxSpeed = 3;
var speed = 0;
var angle = 0;
var steering = 0;


init();
animate();

document.addEventListener('keydown', handleKeyDown);

function init() {
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x242426, 20, 600);
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        10,
        600
    );
    camera.position.z = 90;

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x242426);
    renderer.toneMapping = THREE.LinearToneMapping;

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);

    // --------------------------------------- LIGHTING -----------------------------------
    let hemiLight = new THREE.HemisphereLight(0xEBF7FD, 0xEBF7FD, 0.2);
    hemiLight.position.set(0, 20, 20);
    scene.add(hemiLight);

    // --------------------------------------- CAR GEOMETRY -----------------------------------
    const texture = new THREE.TextureLoader().load('./src/textures/mercedes.jpeg');
    texture.colorSpace = THREE.SRGBColorSpace;

    let carGeometry = new THREE.BoxGeometry(20, 10, 3);
    let carMaterial = new THREE.MeshPhongMaterial({
        map: texture,
    });
    let carTopGeometry = new THREE.BoxGeometry(12, 8, 5);
    let carTopMaterial = new THREE.MeshPhongMaterial({
        map: texture,
    });

    let wheelGeometry = new THREE.CylinderGeometry(3, 3, 1, 6);
    let wheelMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });

    let carBody = new THREE.Mesh(carGeometry, carMaterial);
    carBody.castShadow = true;
    carBody.receiveShadow = true;

    let carTop = new THREE.Mesh(carTopGeometry, carTopMaterial);
    carTop.position.x -= 2;
    carTop.position.z += 3.5;
    carTop.castShadow = true;
    carTop.receiveShadow = true;

    let wheel1 = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel1.position.y = 6
    wheel1.position.x = 6

    let wheel2 = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel2.position.y = 6
    wheel2.position.x = -6

    let wheel3 = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel3.position.y = -6
    wheel3.position.x = 6

    let wheel4 = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel4.position.y = -6
    wheel4.position.x = -6

    let light1 = new THREE.SpotLight(0xffffff);
    light1.position.x = 11;
    light1.position.y = -3;
    light1.position.z = -3;
    light1.angle = Math.PI / 3.5;
    light1.castShadow = true;
    light1.shadow.camera.near = 1;
    light1.target.position.y = -0.5;
    light1.target.position.x = 35;
    // light1.shadow.mapSize.width = 512;
    // light1.shadow.mapSize.height = 512;
    // light1.shadow.camera.far = 400;
    // light1.shadow.camera.fov = 40;

    let light2 = new THREE.SpotLight(0xffffff);
    light2.position.x = 11;
    light2.position.y = 3;
    light2.position.z = -3;
    light2.angle = Math.PI / 3.5;
    light2.castShadow = true;
    light2.shadow.camera.near = 1;
    light2.target.position.y = 0.5;
    light2.target.position.x = 35;

    // --------------------------------------- LIGHT SURROUNDING CAR -----------------------------------
    var light = new THREE.PointLight(0xFFFFFF, 1, 0);
    light.position.z = 25;
    light.position.x = 5;
    light.castShadow = true;
    light.shadow.mapSize.width = 512;
    light.shadow.mapSize.height = 512;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 50;
    light.shadow.bias = 0.1;
    light.shadow.radius = 5;
    light.power = 4; 

    // --------------------------------------- GROUP THE CAR -----------------------------------
    groupCar = new THREE.Group();
    groupCar.add(carBody);
    groupCar.add(carTop);
    groupCar.add(wheel1);
    groupCar.add(wheel2);
    groupCar.add(wheel3);
    groupCar.add(wheel4);
    groupCar.add(light1);
    groupCar.add(light2);
    groupCar.add(light1.target);
    groupCar.add(light2.target);
    groupCar.add(light)
    scene.add(groupCar)

    // --------------------------------------- GROUND -----------------------------------
    function snowyGround() {
        let width = 2000;
        let height = 2000;
        let segmentsX = 40;
        let segmentsY = 45;

        let geometry = new THREE.PlaneGeometry(width, height, segmentsX, segmentsY);
        let positionAttribute = geometry.attributes.position;
        positionAttribute.needsUpdate = true;

        for (let j = 0; j <= segmentsY; j++) {
            for (let i = 0; i <= segmentsX; i++) {
                let vertexIndex = j * (segmentsX + 1) + i;
                positionAttribute.array[vertexIndex * 3] += (Math.cos(vertexIndex * vertexIndex) + 1 / 2) * 2;
                positionAttribute.array[vertexIndex * 3 + 1] += (Math.cos(vertexIndex) + 1 / 2) * 2;
                positionAttribute.array[vertexIndex * 3 + 2] = (Math.sin(vertexIndex * vertexIndex * vertexIndex) + 1 / 2) * -4;
            }
        }

        const textureMap = new THREE.TextureLoader().load('./src/textures/sand.jpeg');
        textureMap.colorSpace = THREE.SRGBColorSpace;
        // <------- FOR REPEATING THE TEXTURE, MAYBE NOT PUT IT -------> 
        textureMap.repeat.set(20, 20);
        textureMap.wrapS = THREE.RepeatWrapping;
        textureMap.wrapT = THREE.RepeatWrapping;

        let material = new THREE.MeshPhongMaterial({
            map: textureMap,
            color: 0xFFFFFF,
            shininess: 80,
            bumpScale: 0.25,
        });

        let plane = new THREE.Mesh(geometry, material);
        plane.receiveShadow = true;
        plane.position.z = -5;
        return plane;

    }
    scene.add(snowyGround());
}


function handleKeyDown(event) {
    // Get the key code of the pressed key
    const keyCode = event.keyCode;

    var prev = {
        x: groupCar.position.x,
        y: groupCar.position.y,
        rot: groupCar.rotation.z
    }
    var steerPower = 0.0006;

    //Left and Right
    if (keyCode == 37) {
        // Left arrow key pressed
        steering -= steerPower
    } else if (keyCode === 39) {
        // Right arrow key pressed
        steering += steerPower
    } else {
        steering *= 0.92;
    }

    //Up and Dows
    if (keyCode === 38) {
        // Up arrow key pressed
        speed = maxSpeed
    } else if (keyCode === 40) {
        // Down arrow key pressed
        speed = -maxSpeed
    } else {
        speed *= 0.96;
    }

    speed *= 1 - Math.abs(steering / 2);
    angle += steering * speed;


    var xdir = speed * Math.cos(angle);
    var ydir = speed * Math.sin(angle);

    groupCar.position.x += xdir;
    groupCar.position.y += -ydir;
    groupCar.rotation.z = -angle;

    groupCar.position.x = (groupCar.position.x > 990 || groupCar.position.x < -990 ? prev.x : groupCar.position.x);
    groupCar.position.y = (groupCar.position.y > 990 || groupCar.position.y < -990 ? prev.y : groupCar.position.y);

    camera.position.x += (groupCar.position.x - camera.position.x) * 0.1;
    camera.position.y = (groupCar.position.y - 40 - (speed * 10));


    camera.lookAt(
        new THREE.Vector3(
            groupCar.position.x,
            groupCar.position.y,
            0
        )
    );
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    renderer.render(scene, camera);
}