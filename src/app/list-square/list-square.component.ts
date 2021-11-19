import { AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { Mesh } from 'three';

@Component({
  selector: 'app-list-square',
  templateUrl: './list-square.component.html',
  styleUrls: ['./list-square.component.css']
})
export class ListSquareComponent implements OnInit, AfterViewInit {

  constructor() { }

  ngOnInit(): void {
  }

  @ViewChild('canvas')
  private canvasRef!: ElementRef;


  //-- Cube Properties
  @Input() public rotationSpeedX: number = 0.01;
  @Input() public rotationSpeedY: number = 0.01;
  @Input() public size: number = 10;
  @Input() public texture: string = "/assets/neonFrame.png";
  @Input() public textureSel: string = "/assets/neonFrameSel.png";

  // Stage Properties
  @Input() public cameraZ: number = 5;
  @Input() public fieldOfView: number = 50;
  @Input('nearClipping') public nearClippingPlane: number = 1;
  @Input('farClipping') public farClippingPlane: number = 1000;

  // Scene properties
  private scene!: THREE.Scene;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private rayCaster = new THREE.Raycaster();

  private camera!: THREE.PerspectiveCamera;

  private listSquare: Mesh[] = [];
  private jsonList = {
    "name": "Server",
    "type": "container",
    "children": [
      {
        "name": "SES",
        "type": "container",
        "children": [
          {
            "name": "Overlord",
            "type": "container",
            "children": [
              {
                "name": "Master",
                "type": "container",
                "members": [
                  {
                    "name": "User1",
                  },
                  {
                    "name": "User2",
                  },
                  {
                    "name": "User3",
                  }                    
                ] 
              }               
            ]
          }
        ]
      },
      {
        "name": "DataB"
      },
      {
        "name": "QAE"
      },
      {
        "name": "Devops"
      }
    ]
  }

  

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  private getAspectRatio() {
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  private startRenderingLoop() {
    // Renderer
    // Use canvas element in template
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

    let component: ListSquareComponent = this;
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

  @HostListener('document:mousemove', ['$event']) 
  onMouseMove(e: MouseEvent) {
    this.onMouseMoved(e);
  }

  onMouseMoved(event:MouseEvent) {
    const mouse = {
      x: (event.clientX / window.innerWidth) * 2 - 1,
      y: -(event.clientY / window.innerHeight) * 2 + 1
    };

    
    this.rayCaster.setFromCamera(mouse, this.camera);
    const intersects = this.rayCaster.intersectObjects(this.scene.children, true);

    //if(intersects.length > 0) {
      const loader = new THREE.TextureLoader();    
      this.listSquare.forEach(element => {
        //element.material = new THREE.MeshBasicMaterial({ map: loader.load(this.texture), transparent: true});
        element.scale.set(1, 1, 1);
      });

      const materialSel = new THREE.MeshBasicMaterial({ map: loader.load(this.textureSel), transparent: true});

      for (let i = 0; i < intersects.length; i++) {      
        //(intersects[i].object as Mesh).material = materialSel;
        intersects[i].object.scale.set(1.1, 1.1, 1.1);
      }
    //}        
  }

  private createScene() {

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);

    const loader = new THREE.TextureLoader();    
    const material = new THREE.MeshBasicMaterial({ map: loader.load(this.texture), transparent: true});
    /*const material = new THREE.MeshBasicMaterial({
      color: 0xffffff      
    });*/
    const materialSel = new THREE.MeshBasicMaterial({ map: loader.load(this.textureSel), transparent: true});


    let index = 0;
    let initPosition = this.jsonList.children.length/2*-1;
    this.jsonList.children.forEach(element => {
      const geometry = new THREE.BoxGeometry(1, 1, 0.001);
      //const geometry = new THREE.PlaneGeometry(1, 1);
      const square = new THREE.Mesh(geometry, material);
      square.position.set(initPosition+1*index++, 0, 0);

      this.listSquare.push(square);
      this.scene.add(square);
    })

    let light1 = new THREE.PointLight(0xffffff, 1, 100);
    light1.position.set(5, 10, 10);

    this.scene.add(light1);

    // Camera    
    this.camera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      this.getAspectRatio(),
      this.nearClippingPlane,
      this.farClippingPlane
    )

    this.camera.position.z = this.cameraZ;
  }

}
