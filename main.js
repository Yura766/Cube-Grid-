import * as THREE from "./node_modules/three/build/three.module.js";
import { OrbitControls } from "./node_modules/three/build/OrbitControls.js";

//////SCENE
const scene = new THREE.Scene();

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


////// Group
const group = new THREE.Group();

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshPhongMaterial({
    color: 0x00ff00,
    wireframe: true, // Прозрачна фигура
});

let index = 0; 
let activeIndex = -1;

for (let x = -5; x <= 5; x += 5) {
    for (let y = -5; y <= 5; y += 5) {
        const cube = new THREE.Mesh(geometry, material.clone());
        cube.position.set(x, y, 0)

        cube.index = index

        group.add(cube)

        index += 1;
    }
}

scene.add(group)
////// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);



////// ANIME
const clock = new THREE.Clock();

function animate() {

    const delta = clock.getDelta();

    if(activeIndex !== -1){
        group.children[activeIndex].rotation.y += delta * 0.5;
    }

    controls.update();
    requestAnimationFrame(animate); // Запрашиваем следующий кадр анимации
    renderer.render(scene, camera); // Рендерим сцену
}

animate();

////// HANLERCLICK

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();



const resetActive = ()=>{
    group.children[activeIndex].material.color.set('gray');
    activeIndex = -1;
}
function onPointerMove(event) {

    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(pointer, camera)

    const intersects = raycaster.intersectObjects(group.children)

    if (activeIndex !== -1){
        resetActive()
    }

    for (let i = 0; i < intersects.length; i++) {

        intersects[i].object.material.color.set(0xff0000); // Устанавливаем красный цвет для объекта, на который нажали

        activeIndex = intersects[i]. object.index;
    }
}



window.addEventListener('click', onPointerMove)


////// RESIZE



window.addEventListener('resize', () => {


    sizes.width = window.innerWidth;

    sizes.height = window.innerHeight;




    camera.aspect = sizes.width / sizes.height;

    camera.updateProjectionMatrix();




    renderer.setSize(sizes.width, sizes.height);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    renderer.render(scene, camera);

});