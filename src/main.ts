import * as THREE from 'three';
import '../scss/styles.scss';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { BloomEffect, EffectComposer, EffectPass, RenderPass, VignetteEffect } from 'postprocessing';
import Blob from './blob';
import { Pane } from 'tweakpane';
import { initialBlobs } from './config';

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
    private camera: THREE.PerspectiveCamera;
    private controls: OrbitControls;
    private composer: EffectComposer;
    private renderPass: RenderPass;

    private blobs: Blob[];

    private gui: any;
    private guiBlobFolder: any;

    private bloomEffect: BloomEffect;
    private vignetteEffect: VignetteEffect;
    private effectPass: EffectPass;

    //不要
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
        this.initPostProcessing();
        this.initGUI();

        window.addEventListener('resize', this.onResize);

        this.blobs = [];
        initialBlobs.forEach((options) => {
            this.addBlob(options);
        });
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

    initPostProcessing = () => {
        //composerにrendererを渡してあげる。
        this.composer = new EffectComposer(this.renderer);
        this.renderPass = new RenderPass(this.scene, this.camera);

        this.bloomEffect = new BloomEffect({
            luminanceThreshold: 0.18,
            luminanceSmoothing: 0.087,
            resolutionScale: 0.5,
            intensity: 1.0,
        });

        this.vignetteEffect = new VignetteEffect({
            offset: 0,
            darkness: 0.35,
        });

        this.effectPass = new EffectPass(this.camera, this.vignetteEffect, this.bloomEffect);
        this.composer.addPass(this.renderPass);
        this.composer.addPass(this.effectPass);
    };

    initGUI = () => {
        this.gui = new Pane();

        this.gui
            .addInput(CELESTIAL_PARAM, 'clearColor', {
                label: 'background',
            })
            .on('change', (hex: any) => {
                this.clearColor.set(hex);
                this.renderer.setClearColor(this.clearColor);
            });

        const fxFolder = this.gui.addFolder({
            title: 'Post Processing',
            expanded: false,
        });

        const bloomFolder = fxFolder.addFolder({
            title: 'Bloom',
            expanded: false,
        });

        bloomFolder.addInput(this.bloomEffect, 'intensity', {
            min: 0,
            max: 5,
        });
        bloomFolder.addInput(this.bloomEffect.luminanceMaterial, 'threshold', {
            min: 0,
            max: 1,
        });
        bloomFolder.addInput(this.bloomEffect.luminanceMaterial, 'smoothing', {
            min: 0,
            max: 1,
        });

        this.guiBlobFolder = this.gui.addFolder({
            title: 'Blobs',
            expanded: false,
        });

        this.guiBlobFolder
            .addButton({
                title: 'Add Blob',
            })
            .on('click', () => {
                this.blobs.forEach((blob) => {
                    blob.killBlob();
                });
            });

        this.guiBlobFolder
            .addButton({
                title: 'Remove all blobs',
            })
            .on('click', () => {
                this.blobs.forEach((blob) => {
                    blob.killBlob();
                });
            });
    };

    initGeometry = () => {
        this.geometry = new THREE.BoxGeometry(250, 250, 250);
        this.material = new THREE.MeshNormalMaterial({
            wireframe: false,
        });
        this.box = new THREE.Mesh(this.geometry, this.material);
        this.box.position.z = -5;
        this.scene.add(this.box);

        // 平行光源を生成
        this.light = new THREE.DirectionalLight(0xffffff);
        this.light.position.set(1, 1, 1);
        this.scene.add(this.light);
    };

    onResize = () => {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.composer.setSize(window.innerWidth, window.innerHeight);
    };

    addBlob(options: any) {
        const blob = new Blob({
            gui: this.guiBlobFolder,
            id: this.blobs.length + 1,
            ...options,
        });

        this.scene.add(blob);
        this.blobs.push(blob);
    }

    animate = () => {
        requestAnimationFrame(this.animate);
        this.controls.update();
        // this.renderer.render(this.scene, this.camera);
        this.blobs.forEach((blob, i) => {
            blob.update();
            if (blob.isDead) {
                this.blobs.splice(i, 1);
            }
        });
        this.composer.render();

		console.log(this.blobs.length);
    };
}
