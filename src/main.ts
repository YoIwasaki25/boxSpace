import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

window.addEventListener('DOMContentLoaded', () => {
    let cerestial = new Celestial();
    // cerestial.init();
});

const CELESTIAL_PARAM = {
    clearColor: '#07001c',
};

export default class Celestial {
    renderer;
    constructor() {
        this.renderer = new THREE.WebGLRenderer();
        this.init();
    }
    init() {
        const width = 1600;
        const height = 1600;

        // レンダラーを作成
        // const renderer = new THREE.WebGLRenderer();
        // レンダラーのサイズを設定
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        // canvasをbodyに追加
        document.body.appendChild(this.renderer.domElement);

        // シーンを作成
        const scene = new THREE.Scene();

        // カメラを作成
        const camera = new THREE.PerspectiveCamera(45, 1, 1, 10000);
        camera.position.set(0, 0, 1000);

        const controls = new OrbitControls(camera, this.renderer.domElement);
        //滑らかなコントローラー制御
        controls.enableDamping = true;
        //静止までの弾性の調整
        controls.dampingFactor = 0.2;

        // 箱を作成
        const geometry = new THREE.BoxGeometry(250, 250, 250);
        const material = new THREE.MeshNormalMaterial();
        const box = new THREE.Mesh(geometry, material);
        box.position.z = -5;
        scene.add(box);

        // 平行光源を生成
        const light = new THREE.DirectionalLight(0xffffff);
        light.position.set(1, 1, 1);
        scene.add(light);

        const tick = () => {
            requestAnimationFrame(tick);
            controls.update();
            // box.rotation.x += 0.05;
            // box.rotation.y += 0.05;

            // 描画
            this.renderer.render(scene, camera);
        };
        tick();
        console.log('Hello Three.js');
    }
}
