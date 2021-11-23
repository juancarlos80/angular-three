import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';

import { Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit, AfterViewInit {

  @ViewChild('canvas') private canvasRef!: ElementRef;
  
  private canvas!: HTMLCanvasElement;

  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private controls!: OrbitControls;
  private rayCaster = new THREE.Raycaster();
  private manager = new THREE.LoadingManager();

  private pivot!: THREE.Group;

  private fontUrl = "https://threejs.org/examples/fonts/droid/droid_serif_bold.typeface.json";

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
              { "name": "Kitchen" },
              { "name": "Game room" }
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
              { "name": "Kitchen" },
              { "name": "Game room" }
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
        "name": "Category 5",
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
        "name": "Category 5",
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
        "name": "Category 5",
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
        "name": "Category 5",
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
        "name": "Category 5",
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

  constructor() { }

  ngAfterViewInit(): void {
    this.canvas = this.canvasRef.nativeElement
    this.loaderInit();
  }

  ngOnInit(): void {
  }

  private loaderInit() {
    var fontLoader = new FontLoader(this.manager);
    fontLoader.load(this.fontUrl, (response) => {
      this.createScene(response);
      this.createControls();
      this.startRenderingLoop();
    });
  }

  private animateCube() {
    this.pivot.rotation.y += 0.005;
  }

  private createScene(font: Font) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);

    //const radius = 4;
    const angulo = 360 / this.jsonList.children.length;

    const radius = this.jsonList.children.length * 0.2;
    console.log(this.jsonList.children.length);
    const tileSize = { 'w': 10, 'h': 10 };
    const tileMargin = 5;

    const circleRadius = 6.5 * tileSize.w;
	  const tileWidth = tileSize.w + tileMargin;
	  const zOffset = -900;
	  const yHeight = 45;

    this.pivot = new THREE.Group();
    //this.pivot.position.set(0, 0, 0);
    this.scene.add(this.pivot);


    const material = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const textMaterial = new THREE.MeshLambertMaterial({ color: 0x3d3d3d });
    const textparameters = {
      font: font,
      size: .1,
      height: .001,
      curveSegments: 12,
      bevelEnabled: false,
      bevelThickness: 10,
      bevelSize: 8,
      bevelOffset: 0,
      bevelSegments: 5
    }
    //const geometry = new THREE.CircleGeometry(0.7, 30, 30);
    //const geometry = new THREE.PlaneBufferGeometry(10, 10);
    //const geometry = new THREE.PlaneGeometry(1, 1);
    const geometry = new THREE.BoxGeometry(1, 1, .01);

    this.jsonList.children.forEach((element, index) => {
      let textGeo = new TextGeometry(element.name, textparameters);
      let container = new THREE.Mesh(geometry, material);
      let title = new THREE.Mesh(textGeo, textMaterial);

      const anguloRad = angulo * index * Math.PI / 180;

      const x = Math.sin(anguloRad) * radius;
      const z = Math.cos(anguloRad) * radius;

      container.position.set(x, 0, z);
      container.rotation.y = anguloRad;
      this.scene.add(container);
      
      title.position.set(x, 0, z);
      //this.scene.add(title);
      this.pivot.add(container);
    });

    let light1 = new THREE.PointLight(0xffffff, 5, 100);
    light1.position.set(5, 18, 20);
    let light2 = new THREE.PointLight(0xfe9100, 5, 100);
    light2.position.set(-5, -18, -20);

    this.scene.add(light1);
    this.scene.add(light2);

    this.camera = new THREE.PerspectiveCamera(
      20, this.canvas.clientWidth / this.canvas.clientHeight, 1, 1000
    );
    this.camera.position.set(0, 0, 10);

    // const axesHelper = new THREE.AxesHelper(5);
    // this.scene.add( axesHelper );
  }

  private createControls() {
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.autoRotate = true;
    this.controls.enableZoom = true;
    this.controls.enablePan = false;
    this.controls.enableKeys = true;
    this.controls.update();
  };

  private startRenderingLoop() {
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

    let component: CarouselComponent = this;
    (function render() {
      requestAnimationFrame(render);
      component.animateCube();
      component.renderer.render(component.scene, component.camera);
    }());
  }
}
