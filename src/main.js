import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// let rad = Math.PI / 180;
let camera, scene, renderer, controls;
// let orbit, light;
// let renderCalls = [];

init();
animate();

document.body.appendChild(renderer.domElement);


function init() {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x242426);
    renderer.toneMapping = THREE.LinearToneMapping;

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // --------------------------------------- ADD LATER -----------------------------------
    // window.addEventListener( 'resize', function () {
    //     camera.aspect = window.innerWidth / window.innerHeight;
    //     camera.updateProjectionMatrix();
    //     renderer.setSize( window.innerWidth, window.innerHeight );
    //   }, false );

    document.body.appendChild(renderer.domElement);

    scene = new THREE.Scene();
    // scene.background = new THREE.Color(0xa0a0a0);
    scene.fog = new THREE.Fog(0x242426, 20, 600);

    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        10,
        600
    );
    camera.position.z = 90;
    // camera.rotation.set(-90 * rad, -45 * rad, -20 * rad);
    // camera.position.set(0, 60, 90);
    scene.add(camera);

    // --------------------------------------- LIGHTING -----------------------------------
    let hemiLight = new THREE.HemisphereLight(0xEBF7FD, 0xEBF7FD, 0.2);
    //hemiLight.color.setRGB(0.75,0.8,0.95);
    hemiLight.position.set(0, 20, 20);
    scene.add(hemiLight);

    // --------------------------------------- REMOVE -----------------------------------
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 0.5;
    controls.maxDistance = 1000;

    const grid = new THREE.GridHelper(
        100,
        10,
        new THREE.Color('black'),
        new THREE.Color('black')
    );
    // --------------------------------------- REMOVE GRID -----------------------------------
    // scene.add(grid);

    // --------------------------------------- CAR GEOMETRY -----------------------------------
    const texture = new THREE.TextureLoader().load( './src/textures/car.jpeg' );
    texture.colorSpace = THREE.SRGBColorSpace;
    
    let carGeometry = new THREE.BoxGeometry(20, 10, 3);
    let carMaterial = new THREE.MeshPhongMaterial({
        map: texture,
        // color: 0xB74242,
        shininess: 100,
        // emissive: 0xFF0000,
        // emissiveIntensity: 0.6,
    });
    let carTopGeometry = new THREE.BoxGeometry(12, 8, 5);
    let carTopMaterial = new THREE.MeshPhongMaterial({
        map: texture,
        // color: 0xB74242,
        shininess: 100,
        // emissive: 0x990000,
        // emissiveIntensity: 0.7
    });

    let wheelGeometry = new THREE.CylinderGeometry(3, 3, 1, 6);
    let wheelMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });

    // const geometry = new THREE.BoxGeometry( 200, 200, 200 );
    // const material = new THREE.MeshBasicMaterial();

    // const mesh = new THREE.Mesh( geometry, material );
    // scene.add( mesh );

    let carBody = new THREE.Mesh(carGeometry, carMaterial);
    carBody.castShadow = true;
    carBody.receiveShadow = true;
    scene.add(carBody);

    let carTop = new THREE.Mesh(carTopGeometry, carTopMaterial);
    carTop.position.x -= 2;
    carTop.position.z += 3.5;
    carTop.castShadow = true;
    carTop.receiveShadow = true;
    scene.add(carTop);

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

    light.power = 3;
    scene.add(light);

    const wheels = Array(4).fill(null).map((wheel, i) => {
        wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.position.y = i < 2 ? 6 : -6;
        wheel.position.x = i % 2 ? 6 : -6;
        wheel.position.z = -3;
        scene.add(wheel);
        return wheel;
    });

    const lights = Array(2).fill(null).map((light, i) => {
        light = new THREE.SpotLight(0xffffff);
        light.position.x = 11;
        light.position.y = (i < 1 ? -3 : 3); //;
        light.position.z = -3;
        light.angle = Math.PI / 3.5;
        light.castShadow = true;
        light.shadow.mapSize.width = 512;
        light.shadow.mapSize.height = 512;
        light.shadow.camera.near = 1;
        light.shadow.camera.far = 400;
        light.shadow.camera.fov = 40;
        light.target.position.y = (i < 1 ? -0.5 : 0.5);
        light.target.position.x = 35;// = Math.PI/2;
        scene.add(light.target);
        scene.add(light);
        return light;
    });



    // --------------------------------------- GROUND -----------------------------------
    function snowyGround() {
        let width = 2000;
        let height = 2000;
        let segmentsX = 40;
        let segmentsY = 45;

        let geometry = new THREE.PlaneGeometry(width, height, segmentsX, segmentsY);

        let positionAttribute = geometry.attributes.position;


        if (geometry.attributes.position.array.length === 0) {
            console.error('Error: The geometry does not have any vertices.');
            return null;
        }

        for (let j = 0; j <= segmentsY; j++) {
            for (let i = 0; i <= segmentsX; i++) {
                let vertexIndex = j * (segmentsX + 1) + i;
                if (positionAttribute.array[vertexIndex] === undefined) {
                    console.error(`Error: Vertex at index ${vertexIndex} is undefined.`);
                    continue;
                }
                positionAttribute.array[vertexIndex * 3] += (Math.cos(vertexIndex * vertexIndex) + 1 / 2) * 2;
                positionAttribute.array[vertexIndex * 3 + 1] += (Math.cos(vertexIndex) + 1 / 2) * 2;
                positionAttribute.array[vertexIndex * 3 + 2] = (Math.sin(vertexIndex * vertexIndex * vertexIndex) + 1 / 2) * -4;
            }
        }
        // for (let i = 0; i < geometry.vertices.length; i++) {
        //     geometry.vertices[i].x += (Math.cos(i * i) + 1 / 2) * 2;
        //     geometry.vertices[i].y += (Math.cos(i) + 1 / 2) * 2;
        //     geometry.vertices[i].z = (Math.sin(i * i * i) + 1 / 2) * -4;
        // }
        // geometry.verticesNeedUpdate = true;
        // geometry.normalsNeedUpdate = true;
        positionAttribute.needsUpdate = true;
        // geometry.computeFaceNormals();

        let material = new THREE.MeshPhongMaterial({
            color: 0xFFFFFF,
            shininess: 80,
            // bumpMap: noise,
            bumpScale: 0.15,
            shading: THREE.SmoothShading
        });

        let plane = new THREE.Mesh(geometry, material);
        plane.receiveShadow = true;
        plane.position.z = -5;
        return plane;
    }
    scene.add(snowyGround());


}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    render();
}

function render() {
    renderer.render(scene, camera);
}
