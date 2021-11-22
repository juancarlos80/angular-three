import { AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';

import { Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

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
  //@Input() public texture: string = "/assets/neonFrame.png";
  @Input() public texture: string = "/assets/neonCircular.png";
  @Input() public textureSel: string = "/assets/neonFrameSel.png";

  // Stage Properties
  @Input() public cameraZ: number = 7;
  @Input() public fieldOfView: number = 50;
  @Input('nearClipping') public nearClippingPlane: number = 1;
  @Input('farClipping') public farClippingPlane: number = 1000;

  // Scene properties
  private scene!: THREE.Scene;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private rayCaster = new THREE.Raycaster();

  private geometryCube = new THREE.BoxGeometry(1, 1, 1);
  private materialCube = new THREE.MeshLambertMaterial({ color: 0x3d3d3d });
  private cube : THREE.Mesh = new THREE.Mesh(this.geometryCube, this.materialCube);

  private manager = new THREE.LoadingManager();

  private camera!: THREE.PerspectiveCamera;

  private listSquare: Mesh[] = [];
  private jsonList = {
    "name": "Container",
    "children": [
       {
          "name": "SES",
          "children": [
             {
                "name": "Workspace Overlord",
                "children": [
                   {
                      "name": "Meeting room 1", 
                      "children": [
                         {
                            "name": "Abel", 
                            "img": "img/abel.jpg"
                         },
                         {
                            "name": "Bayron", 
                            "img": "img/bayron.jpg"
                         },
                         {
                            "name": "Alanbrito", 
                            "img": "img/alan.png"
                         }
                      ]
                   },
                   {
                      "name": "Meeting room 2"
                   },
                   {"name": "Kitchen"},
                   {"name": "Game room"}
                ]
             },
             {
                "name": "Workspace Ponctuel",
                "children": [
                   {
                      "name": "BetweennessCentrality", 
                      "children": [
                         {
                            "name": "Foto perfil", 
                            
                            "img": "img/profile.png"
                         }
                      ]
                   },
                   {"name": "LinkDistance"},
                   {"name": "MaxFlowMinCut"},
                   {"name": "SpanningTree"}
                ]
             },
             {
                "name": "Workspace C",
                "children": [
                   {"name": "AspectRatioBanker"}
                ]
             },
             {
                "name": "Workspace D",
                "children": [
                   {"name": "AspectRatioBanker"}
                ]
             }
          ]
       },
       {
          "name": "Category 2",
          "children": [
             {
                "name": "Workspace Ponctuel",
                "children": [
                   {
                      "name": "BetweennessCentrality", 
                      "children": [
                         {
                            "name": "Foto perfil", 
                            
                            "img": "img/profile.png"
                         }
                      ]
                   },
                   {"name": "LinkDistance"},
                   {"name": "MaxFlowMinCut"},
                   {"name": "SpanningTree"}
                ]
             },
             {
                "name": "Workspace C",
                "children": [
                   {"name": "AspectRatioBanker"}
                ]
             },
             {
                "name": "Workspace D",
                "children": [
                   {"name": "AspectRatioBanker"}
                ]
             }
          ]
       },
       {
          "name": "Category 3",
          "children": [
             {
                "name": "Workspace Overlord",
                "children": [
                   {
                      "name": "Meeting room 1", 
                      "children": [
                         {
                            "name": "Abel", 
                            
                            "img": "img/avatar.jpg"
                         },
                         {
                            "name": "Bayron", 
                            
                            "img": "img/profile.png"
                         },
                         {
                            "name": "Alanbrito", 
                            
                            "img": "img/profile.png"
                         }
                      ]
                   },
                   {
                      "name": "Meeting room 2"
                   },
                   {"name": "Kitchen"},
                   {"name": "Game room"}
                ]
             },
             {
                "name": "Workspace Ponctuel",
                "children": [
                   {
                      "name": "BetweennessCentrality", 
                      "children": [
                         {
                            "name": "Foto perfil", 
                            
                            "img": "img/profile.png"
                         }
                      ]
                   },
                   {"name": "LinkDistance"},
                   {"name": "MaxFlowMinCut"},
                   {"name": "SpanningTree"}
                ]
             },
             {
                "name": "Workspace C",
                "children": [
                   {"name": "AspectRatioBanker"}
                ]
             },
             {
                "name": "Workspace D",
                "children": [
                   {"name": "AspectRatioBanker"}
                ]
             }
          ]
       },
       {
          "name": "Category 4",
          "children": [
             {
                "name": "Workspace Ponctuel",
                "children": [
                   {
                      "name": "BetweennessCentrality", 
                      "children": [
                         {
                            "name": "Foto perfil", 
                            
                            "img": "img/profile.png"
                         }
                      ]
                   },
                   {"name": "LinkDistance"},
                   {"name": "MaxFlowMinCut"},
                   {"name": "SpanningTree"}
                ]
             },
             {
                "name": "Workspace C",
                "children": [
                   {"name": "AspectRatioBanker"}
                ]
             },
             {
                "name": "Workspace D",
                "children": [
                   {"name": "AspectRatioBanker"}
                ]
             }
          ]
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
      component.animateCube();
      component.renderer.render(component.scene, component.camera);
    }());
  }

  private animateCube() {
    //this.cube.rotation.x += this.rotationSpeedX;
    this.cube.rotation.y += this.rotationSpeedY;
    //this.cube.rotation.z += 0.01;
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
    //this.createScene();
    this.loaderInit();
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
        if(intersects[i].object != this.cube){
          intersects[i].object.scale.set(1.1, 1.1, 1.1);
        }
      }
    //}        
  }

  public loaderInit() {
    var fontLoader = new FontLoader(this.manager);
    fontLoader.load('https://threejs.org/examples/fonts/droid/droid_serif_bold.typeface.json', (response) => {
      console.log("response", response);
      this.createScene(response);
    });
  }

  public createScene(font: Font) {  
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);

    const loader = new THREE.TextureLoader();    
    
    /*const material = new THREE.MeshBasicMaterial({
      color: 0xffffff      
    });*/

    this.scene.add(this.cube);
    this.listSquare.push(this.cube);

    let index = 0;

    const radius = 4;
    

    let initPosition = (this.jsonList.children.length-1)/2*(-1);

    const angulo = 360/this.jsonList.children.length;

    let material = new THREE.MeshLambertMaterial({ map: loader.load(this.texture), transparent: true });

    var textMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff } );
    

    // Scene
    
    this.jsonList.children.forEach(element => {

      let textGeo = new TextGeometry(element.name, {
        font: font,
        size: .1,
        height: .001,
        curveSegments: 12,
        bevelEnabled: false,
        bevelThickness: 10,
        bevelSize: 8,
        bevelOffset: 0,
        bevelSegments: 5
      });

      console.log(element.name);

      

      // if( index == 0 ) {
      //   material = new THREE.MeshLambertMaterial({ color: 0xff00ff });
      // } else {
      //   material = new THREE.MeshLambertMaterial({ color: 0xffffff });
      // }

      //const geometry = new THREE.BoxGeometry(1, 1, 0.0001);
      //const geometry = new THREE.PlaneGeometry(1, 1);

      const geometry = new THREE.CircleGeometry(0.7, 30, 30);
      const square = new THREE.Mesh(geometry, material);
      //square.position.set(initPosition+1*index++, 0, 0);
      const x = Math.sin(angulo*index*Math.PI/180)*radius;
      const z = Math.cos(angulo*index*Math.PI/180)*radius;

    var mesh = new THREE.Mesh( textGeo, textMaterial );
    mesh.position.set( x, 0, z );

    this.scene.add( mesh );

      square.position.set(x, 0, z);
      index++;

      this.listSquare.push(square);
      this.scene.add(square);
    })

    let light1 = new THREE.PointLight(0xffffff, 5, 100);
    light1.position.set(5, 18, 20);
    let light2 = new THREE.PointLight(0xfe9100, 5, 100);
    light2.position.set(-5, -18, -20);

    this.scene.add(light1);
    this.scene.add(light2);

    // Camera    
    this.camera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      this.getAspectRatio(),
      this.nearClippingPlane,
      this.farClippingPlane
    )

    this.camera.position.set(0, 3, 10);

    const axesHelper = new THREE.AxesHelper(5);
    //this.scene.add( axesHelper );

    this.startRenderingLoop();
    this.createControls();
  }

}
