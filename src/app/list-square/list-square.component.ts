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

   private manager = new THREE.LoadingManager();

   private camera!: THREE.PerspectiveCamera;

   private font!: Font

   private listShapes: Mesh[] = [];
   private jsonList = {
      "name": "JalaSoft",
      "children": [
         {
            "name": "SES",
            "children": [
               {
                  "name": "Overlord",
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
                     { "name": "Kitchen" },
                     { "name": "Game room" }
                  ]
               },
               {
                  "name": "Ponctuel",
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
                     { "name": "LinkDistance" },
                     { "name": "MaxFlowMinCut" },
                     { "name": "SpanningTree" }
                  ]
               },
               {
                  "name": "Workspace C",
                  "children": [
                     { "name": "AspectRatioBanker" }
                  ]
               },
               {
                  "name": "Workspace D",
                  "children": [
                     { "name": "AspectRatioBanker" }
                  ]
               }
            ]
         },
         {
            "name": "DevOps",
            "children": [
               {
                  "name": "Pipeline Killers",
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
                     { "name": "LinkDistance" },
                     { "name": "MaxFlowMinCut" },
                     { "name": "SpanningTree" }
                  ]
               },
               {
                  "name": "SuperUsers",
                  "children": [
                     { "name": "AspectRatioBanker" }
                  ]
               },
               {
                  "name": "Dockers",
                  "children": [
                     { "name": "AspectRatioBanker" }
                  ]
               }
            ]
         },
         {
            "name": "QA",
            "children": [
               {
                  "name": "Detectors",
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
                     { "name": "Kitchen" },
                     { "name": "Game room" }
                  ]
               },
               {
                  "name": "Overtimeworkers",
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
                     { "name": "LinkDistance" },
                     { "name": "MaxFlowMinCut" },
                     { "name": "SpanningTree" }
                  ]
               },
               {
                  "name": "Workspace C",
                  "children": [
                     { "name": "AspectRatioBanker" }
                  ]
               },
               {
                  "name": "Workspace D",
                  "children": [
                     { "name": "AspectRatioBanker" }
                  ]
               }
            ]
         },
         {
            "name": "Category 4",
            "children": [
               {
                  "name": "Workspace A",
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
                     { "name": "LinkDistance" },
                     { "name": "MaxFlowMinCut" },
                     { "name": "SpanningTree" }
                  ]
               },
               {
                  "name": "Workspace C",
                  "children": [
                     { "name": "AspectRatioBanker" }
                  ]
               },
               {
                  "name": "Workspace D",
                  "children": [
                     { "name": "AspectRatioBanker" }
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
         //component.animateCube();
         component.renderer.render(component.scene, component.camera);
      }());
   }

   private animateCube() {
      //this.cube.rotation.x += this.rotationSpeedX;
      //this.cube.rotation.y += this.rotationSpeedY;
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
      this.controls.enablePan = true;
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

   @HostListener('document:mousedown', ['$event'])
   onMouseClick(e: MouseEvent) {
      this.onMouseClicked(e);
   }

   private onMouseClicked(event: MouseEvent) {
      const mouse = {
         x: (event.clientX / window.innerWidth) * 2 - 1,
         y: -(event.clientY / window.innerHeight) * 2 + 1
      };

      this.rayCaster.setFromCamera(mouse, this.camera);
      const intersects = this.rayCaster.intersectObjects(this.scene.children, true);
      if (intersects.length > 0) {
         console.log(intersects[0].object);         
         this.renderSolarSystem(intersects[0].object.userData, this.level*10, this.level*10, this.level*10);
         this.level++;
      }
   }

   public level = 1;

   private onMouseMoved(event: MouseEvent) {
      const mouse = {
         x: (event.clientX / window.innerWidth) * 2 - 1,
         y: -(event.clientY / window.innerHeight) * 2 + 1
      };


      this.rayCaster.setFromCamera(mouse, this.camera);
      const intersects = this.rayCaster.intersectObjects(this.scene.children, true);

      //if(intersects.length > 0) {
      const loader = new THREE.TextureLoader();
      this.listShapes.forEach(element => {
         //element.material = new THREE.MeshBasicMaterial({ map: loader.load(this.texture), transparent: true});
         element.scale.set(1, 1, 1);
      });

      const materialSel = new THREE.MeshBasicMaterial({ map: loader.load(this.textureSel), transparent: true });

      for (let i = 0; i < intersects.length; i++) {
         //(intersects[i].object as Mesh).material = materialSel;
         //if (intersects[i].object != this.cube) {
            intersects[i].object.scale.set(1.1, 1.1, 1.1);
         //}
      }
      //}        
   }

   public loaderInit() {
      var fontLoader = new FontLoader(this.manager);
      fontLoader.load('https://threejs.org/examples/fonts/droid/droid_serif_bold.typeface.json', (response) => {
         this.font = response;
         this.createScene(response);
      });
   }

   public createScene(font: Font) {

      

      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x000000);

      // Camera    
      this.camera = new THREE.PerspectiveCamera(
         this.fieldOfView,
         this.getAspectRatio(),
         this.nearClippingPlane,
         this.farClippingPlane
      )

      this.renderSolarSystem(this.jsonList, 0, 0, 0);

      let light1 = new THREE.PointLight(0xffffff, 5, 100);
      light1.position.set(5, 18, 20);

      let light2 = new THREE.PointLight(0xfe9100, 5, 100);
      light2.position.set(-5, -18, -20);

      let light3 = new THREE.PointLight(0xffffff, 5, 100);
      light3.position.set(15, 28, 40);

      let light4 = new THREE.PointLight(0xffffff, 5, 100);
      light4.position.set(25, 38, 60);

      this.scene.add(light1);
      this.scene.add(light2);
      this.scene.add(light3);
      this.scene.add(light4);

      this.camera.position.set(0, 3, 10);

      // const axesHelper = new THREE.AxesHelper(5);
      // this.scene.add(axesHelper);      
      
      this.createControls();
      this.startRenderingLoop();
   }

   private renderSolarSystem(root: any, root_x: number, root_y: number, root_z: number) {
      
      // Center element
      const geometryCube = new THREE.BoxGeometry(0.7, 0.7, 0.7);
      const materialCube = new THREE.MeshLambertMaterial({ color: 0x3d3d3d });
      const cube: THREE.Mesh = new THREE.Mesh(geometryCube, materialCube);
      
      const loader = new THREE.TextureLoader();
      var textMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
      cube.position.set(root_x, root_y, root_z);
      
      this.scene.add(cube);
      
      const centerLabel = root.name;
      let textGeo = new TextGeometry(centerLabel, {
         font: this.font,
         size: .1,
         height: .01
      });
      const centerName = new THREE.Mesh(textGeo, textMaterial);
      centerName.position.set(root_x+0, root_y+0.7, root_z+0);
      this.scene.add(centerName);

      //Prepare the children elements
      let index = 0;
      const radius = 4;
      const angulo = 360 / this.jsonList.children.length;
      let material = new THREE.MeshLambertMaterial({ map: loader.load(this.texture), transparent: true });

      // Scene of childrens   
      root.children.forEach((element: { name: string; children: { [key: string]: any; }; }) => {

         let textGeo = new TextGeometry(element.name, {
            font: this.font,
            size: .1,
            height: .01
         });

         const geometry = new THREE.CircleGeometry(0.7, 30, 30);
         const childrenShape = new THREE.Mesh(geometry, material);
         const x = Math.sin(angulo * index * Math.PI / 180) * radius;
         const z = Math.cos(angulo * index * Math.PI / 180) * radius;

         var childrenName = new THREE.Mesh(textGeo, textMaterial);
         childrenName.position.set(root_x+x, root_y+0, root_z+z);         
         this.scene.add(childrenName);

         childrenShape.position.set(root_x+x, root_y+0, root_z+z);
         childrenShape.name = element.name;
         childrenShape.userData = element;
         this.listShapes.push(childrenShape);
         this.scene.add(childrenShape);

         index++;
      })

      if( root_x > 0 ){
         this.camera.position.set(root_x+0, root_y+3, root_z+10);                     
      }
      
      if( this.controls != null) {         
         this.controls.target.set( root_x, root_y, root_z );
         this.controls.update();
      }
   }

}
