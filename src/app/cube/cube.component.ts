import { AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';

import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { Mesh } from 'three';

@Component({
  selector: 'app-cube',
  templateUrl: './cube.component.html',
  styleUrls: ['./cube.component.css']
})

export class CubeComponent implements OnInit, AfterViewInit {

  constructor() { }

  @ViewChild('canvas')
  private canvasRef!: ElementRef;


  //* Cube Properties
  @Input() public rotationSpeedX: number = 0.01;
  @Input() public rotationSpeedY: number = 0.01;
  @Input() public size: number = 200;
  @Input() public texture: string = "/assets/neonFrame.png";
  @Input() public textureSel: string = "/assets/neonFrameSel.png";


  //* Stage Properties
  @Input() public cameraZ: number = 5;
  @Input() public fieldOfView: number = 50;
  @Input('nearClipping') public nearClippingPlane: number = 1;
  @Input('farClipping') public farClippingPlane: number = 1000;


  //? Scene properties
  private controls!: OrbitControls;

  /*private ambientLight: THREE.AmbientLight;


  private light1: THREE.PointLight;

  private light2: THREE.PointLight;

  private light3: THREE.PointLight;

  private light4: THREE.PointLight;

  private model: THREE.Group;

  private directionalLight: THREE.DirectionalLight;*/

  private camera!: THREE.PerspectiveCamera;

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  private loader = new THREE.TextureLoader();
  private geometry = new THREE.BoxGeometry(1, 1, 0.001);
  private material = new THREE.MeshBasicMaterial({ map: this.loader.load(this.texture), transparent: true});
  private materialSel = new THREE.MeshBasicMaterial({ map: this.loader.load(this.textureSel), transparent: true});

  private cube: THREE.Mesh = new THREE.Mesh(this.geometry, this.material);
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;

  private rayCaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();

  /**
   *Animate the cube
   *
   * @private
   * @memberof CubeComponent
   */
  private animateCube() {
    this.cube.rotation.x += this.rotationSpeedX;
    this.cube.rotation.y += this.rotationSpeedY;
  }

  /**
     * Create the scene
     *
     * @private
     * @memberof CubeComponent
     */
  private createScene() {
    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);
    this.scene.add(this.cube);

    // Camera    
    this.camera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      this.getAspectRatio(),
      this.nearClippingPlane,
      this.farClippingPlane
    )

    this.camera.position.z = this.cameraZ;
  }

  private getAspectRatio() {
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  /**
  * Start the rendering loop
  *
  * @private
  * @memberof CubeComponent
  */
  private startRenderingLoop() {
    //* Renderer
    // Use canvas element in template
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

    let component: CubeComponent = this;
    (function render() {      
      requestAnimationFrame(render);
      //component.animateCube();
      component.renderer.render(component.scene, component.camera);
    }());
  }

  private createControls = () => {
    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0px';
    document.body.appendChild(labelRenderer.domElement);
    this.controls = new OrbitControls(this.camera, labelRenderer.domElement);
    this.controls.autoRotate = true;
    this.controls.enableZoom = true;
    this.controls.enablePan = false;
    this.controls.enableKeys = true;
    this.controls.update();
  };

  ngAfterViewInit(): void {
    this.createScene();
    this.startRenderingLoop();
    this.createControls();
  }

  ngOnInit(): void {

  }

  @HostListener('document:mousemove', ['$event']) 
  onMouseMove(e: MouseEvent) {
    this.onMouseMoved(e);
  }

  onMouseMoved(event:MouseEvent) {
    const mouse = {
      x: (event.clientX / window.innerWidth) * 2 - 1,
      y: -(event.clientY / window.innerHeight) * 2 + 1
    };

    this.cube.material = this.material
    
    this.rayCaster.setFromCamera(mouse, this.camera);
    const intersects = this.rayCaster.intersectObjects(this.scene.children, true);

    for (let i = 0; i < intersects.length; i++) {      
      (intersects[i].object as Mesh).material = this.materialSel;
    }
  }

}
