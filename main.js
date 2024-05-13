import * as THREE from "./node_modules/three/build/three.module.js";
import { OrbitControls } from "./node_modules/three/build/OrbitControls.js";
import { GLTFLoader } from "./node_modules/three/build/GLTFLoader.js";
import Stats from "./node_modules/stats.js/src/Stats.js";
import * as dat from './node_modules/lil-gui/dist/lil-gui.esm.js';

//////SCENE
const scene = new THREE.Scene();


const stats = new Stats();
stats.showPanel(0)
document.body.appendChild(stats.dom)

const gui = new dat.GUI()


const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

//////CAMERA
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);

camera.position.z = 15

////// RENDERER

const renderer = new THREE.WebGLRenderer({
    // alpha: true, //прозрачний фон
    antialias: true //зглажені 3д
})

const container = document.querySelector('.canvas');

container.appendChild(renderer.domElement);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(sizes.width, window.innerHeight);

////// LIGHT
const aLight = new THREE.AmbientLight(0x404040, 1.2);
scene.add(aLight);


const parameters = {
    color: 0xff000,
}
////// Group
const group = new THREE.Group();

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshPhongMaterial({
    color: 0x00ff00,
    wireframe: true, // Прозрачна фигура
});

const mesh = new THREE.Mesh(geometry, material)

scene.add(mesh)

////// GTLF MODEL
const loader = new GLTFLoader();

let mixer = null;

loader.load(
    './models/BrainStem/glTF/BrainStem.gltf',
    // '../models/Avocado/Avocado.gltf',
    // '../Headphones/Avocado/scene.gltf',


    (gltf) => {
        console.log('success');

        // ANIMATION
        // mixer = new THREE.AnimationMixer(gltf.scene);
        // const action = mixer.clipAction(gltf.animations[0])
        // action.play();


        // size
        gltf.scene.children[0].scale.set(5, 5, 5);

        // add to canvas 
        scene.add(gltf.scenes[0])
    },
    (progress) => {
        console.log('progress');
    },
    (error) => {
        console.log('error');
    }
)


////// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);

const scaleFolder = gui.addFolder('Scale'); // створюємо папку 

scaleFolder.add(mesh.scale, 'x').min(0).max(5).step(0.1).name('box scale x');
scaleFolder.add(mesh.scale, 'y').min(0).max(5).step(0.1).name('box scale y');
scaleFolder.add(mesh.scale, 'z').min(0).max(5).step(0.1).name('box scale z');

gui.add(mesh, 'visible');
gui.add(material, 'wireframe');

//колір не міняє без сет  
gui.addColor(parameters, 'color').onChange(() => material.color.set(parameters.color))

////// ANIME
const clock = new THREE.Clock();

function animate() {
    stats.begin()

    const delta = clock.getDelta();
    if (mixer) {
        mixer.update(delta)
    }

    controls.update();

    renderer.render(scene, camera); // Рендерим сцену
    stats.end();
    requestAnimationFrame(animate); // Запрашиваем следующий кадр анимации
}

animate();
