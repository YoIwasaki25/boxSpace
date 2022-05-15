import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
window.addEventListener('DOMContentLoaded', () => {
    const cerestial = new Celestial();
    cerestial.animate();
});

const CELESTIAL_PARAM = {
    clearColor: '#07001c',
};

export default class Celestial {
    private renderer: THREE.WebGLRenderer;
    private clearColor: THREE.Color;
    private scene: THREE.Scene;
    private camera: THREE.Camera;
    private controls: OrbitControls;
	private geometry: THREE.BoxGeometry;
	private material: THREE.MeshNormalMaterial;
	private box: THREE.Mesh;
	private light: THREE.DirectionalLight;

    constructor() {
        this.onResize = this.onResize.bind(this);
        this.animate = this.animate.bind(this);

        this.initRenderer();
        this.initScene();
        this.initCamera();
		this.initGeometry();
    }

    initRenderer = () => {
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('myCanvas'),
            powerPreference: 'high-performance',
            antialias: false,
            stencil: false,
            depth: false,
        });

        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        //background color
        this.clearColor = new THREE.Color(CELESTIAL_PARAM.clearColor);
        this.renderer.setClearColor(this.clearColor);

        if (
            this.renderer.capabilities.isWebGL2 == false &&
            this.renderer.extensions.get('ANGLE_instanced_arrays') == null
        ) {
            document.getElementById('notSupported').style.display = '';
            return false;
        }
    };

    initScene = () => {
        this.scene = new THREE.Scene();
    };

    initCamera = () => {
        this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 5000);
        this.camera.position.z = 2000;
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        // 滑らかなコントローラー制御
        this.controls.enableDamping = true;
        // 静止までの弾性の調整
        this.controls.dampingFactor = 0.2;
    };

    initGeometry = () => {
        this.geometry = new THREE.BoxGeometry(250, 250, 250);
        this.material = new THREE.MeshNormalMaterial();
        this.box = new THREE.Mesh(this.geometry, this.material);
        this.box.position.z = -5;
        this.scene.add(this.box);

        // 平行光源を生成
        this.light = new THREE.DirectionalLight(0xffffff);
        this.light.position.set(1, 1, 1);
        this.scene.add(this.light);
    };

    onResize = () => {};

    animate = () => {
        requestAnimationFrame(this.animate);
        this.renderer.render(this.scene, this.camera);
    };
}
