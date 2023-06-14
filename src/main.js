import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let camera, scene, renderer, controls, groupCar;
let speed = 0.5;

init();
animate();

document.body.appendChild(renderer.domElement);


function init() {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    // renderer.setClearColor(0x242426);
    // renderer.toneMapping = THREE.LinearToneMapping;

    // renderer.shadowMap.enabled = true;
    // renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // --------------------------------------- ADD LATER -----------------------------------
    // window.addEventListener( 'resize', function () {
    //     camera.aspect = window.innerWidth / window.innerHeight;
    //     camera.updateProjectionMatrix();
    //     renderer.setSize( window.innerWidth, window.innerHeight );
    //   }, false );

    document.body.appendChild(renderer.domElement);

    scene = new THREE.Scene();
    // scene.background = new THREE.Color(0xa0a0a0);
    // scene.fog = new THREE.Fog(0x242426, 20, 600);

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

    var light = new THREE.PointLight(0xFFFFFF, 1, 0);
    light.position.z = 25;
    light.position.x = 1;
    light.castShadow = true;
    // light.shadow.mapSize.width = 512;
    // light.shadow.mapSize.height = 512;
    // light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 50;
    light.shadow.bias = 0.1;
    // light.shadow.radius = 5;
    light.power = 4;
    scene.add(light);

    // --------------------------------------- CAR GEOMETRY -----------------------------------
    const texture = new THREE.TextureLoader().load('./src/textures/car.jpeg');
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
    let wheelMaterial2 = new THREE.MeshBasicMaterial({ color: 0x000000 });

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

    let wheel3 = new THREE.Mesh(wheelGeometry, wheelMaterial2);
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
    // light2.shadow.mapSize.width = 512;
    // light2.shadow.mapSize.height = 512;
    // light2.shadow.camera.far = 400;
    // light2.shadow.camera.fov = 40;


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
    scene.add(groupCar)


    // groupCar.rotation.y += THREE.MathUtils.degToRad(90); // Rotate by 1 degree


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

        positionAttribute.needsUpdate = true;

        const textureMap = new THREE.TextureLoader().load('./src/textures/sand2.jpeg');
        textureMap.colorSpace = THREE.SRGBColorSpace;
        // <------- FOR REPEATING THE TEXTURE, MAYBE NOT PUT IT -------> 
        textureMap.repeat.set(20, 20); 
        textureMap.wrapS = THREE.RepeatWrapping;
        textureMap.wrapT = THREE.RepeatWrapping;

        let material = new THREE.MeshPhongMaterial({
            map: textureMap,
            bumpScale: 0.5,
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
    // groupCar.position.x += speed;
    render();
}

function render() {
    renderer.render(scene, camera);
}