import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { ShaderMaterial } from 'three';
import { Refractor } from 'three/addons/objects/Refractor.js';
import { WaterRefractionShader } from 'three/addons/shaders/WaterRefractionShader.js';

function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({ antialias: false, canvas });

    const fov = 75;
    const aspect = 2; // the canvas default
    const near = 0.5;
    const far = 100;

    const scene = new THREE.Scene();

    // Create a container for the camera and refractor
    const container = new THREE.Object3D();
    scene.add(container);

    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 2.8;

    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 0, 0);
    controls.update();

    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 0.1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

function makeInstance(geometry, metalness, roughness, color, x, scale) {
    const material = new ShaderMaterial(WaterRefractionShader);

    const refractor = new Refractor(geometry, {
        color: color,
        textureWidth: 2000,
        textureHeight: 2000,
        shader: WaterRefractionShader,
    });

    container.add(refractor);

    refractor.position.set(x, 0, 0); // Adjust position along the X-axis
    refractor.scale.set(scale, scale, 1); // Adjust the scale for magnification

    return refractor;
}

const refractors = [
    makeInstance(geometry, 0, 0, 0x44aa88, 0, 2.0), // You can adjust the scale value as needed
];

    {
        const loader = new THREE.TextureLoader();
        const texture = loader.load(
            'https://dl.polyhaven.org/file/ph-assets/HDRIs/extra/Tonemapped%20JPG/rosendal_mountain_midmorning.jpg',
            () => {
                texture.mapping = THREE.EquirectangularReflectionMapping;
                texture.encoding = THREE.sRGBEncoding; // Corrected attribute name
                scene.background = texture;
            }
        );
    }

    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        }

        return needResize;
    }

    function animate() {
        // Update the target position here to control the rotation point
        const rotationPoint = new THREE.Vector3(0, 0, 0); // Set the rotation point coordinates
        controls.target.copy(rotationPoint);

        // Call the controls update function to update the camera position
        controls.update();

        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        // Rotate the container based on the camera's position
        container.rotation.x = camera.rotation.x;
        container.rotation.y = camera.rotation.y;

        refractors.forEach((refractor, ndx) => {
            const speed = 0.00001 + ndx * 0.09;
            const rot = performance.now() * speed;
            refractor.rotation.x = rot;
            refractor.rotation.y = rot;
        });

        renderer.render(scene, camera);

        requestAnimationFrame(animate);
    }

    animate();
}

main();
