import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import model from './model/spartak.gltf';


const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene();
let renderer;
let camera;


init(); 
render(); 

function init() {
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.25,
    20
  );
	// Позиция камеры   
  camera.position.set(500, 500);

  new RGBELoader()
    .setDataType(THREE.UnsignedByteType)
    .load(
      "https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/textures/equirectangular/royal_esplanade_1k.hdr",
      function (texture) {
        const pmremGenerator = new THREE.PMREMGenerator(renderer);
        pmremGenerator.compileEquirectangularShader();
        const envMap = pmremGenerator.fromEquirectangular(texture).texture;

        scene.background = envMap;
        scene.environment = envMap; 

        texture.dispose();
        pmremGenerator.dispose(); 
      }
    );

  const loader = new GLTFLoader();
  loader.load(
		model,
   	 function (gltf) {
		// Размер модели 
		scene.scale.set(0.025,0.025,0.025)

		// Позиция сцены
		scene.position.set(2,0,-3.8)

		// Цвет заднего фона
		scene.background = new THREE.Color(0x00FF00)
      scene.add(gltf.scene);
      render(); 
    },
  );

  renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvas });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping; 
  renderer.toneMappingExposure = 1;
  renderer.outputEncoding = THREE.sRGBEncoding; 

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.addEventListener("change", render); 
  controls.minDistance = 2;
  controls.maxDistance = 10;
  controls.target.set(0, 0, -0.2);
  controls.update();

  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  camera.aspect = 500 / 100;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  render();
}

//

function render() {
  renderer.render(scene, camera);
}
