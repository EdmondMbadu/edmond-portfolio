import { Component, ElementRef, Input, ViewChild, AfterViewInit, OnDestroy, NgZone, OnChanges, SimpleChanges } from '@angular/core';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

@Component({
  selector: 'app-work-card-3d',
  standalone: true,
  template: '<canvas #canvas class="h-full w-full"></canvas>',
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
    canvas {
      display: block;
    }
  `]
})
export class WorkCard3dComponent implements AfterViewInit, OnDestroy, OnChanges {
  @Input() motif: string = '';
  @ViewChild('canvas') private canvasRef!: ElementRef<HTMLCanvasElement>;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private composer!: EffectComposer;
  private animationId: number | null = null;
  private objects: THREE.Object3D[] = [];
  private particles: THREE.Points[] = [];
  private lights: THREE.Light[] = [];

  constructor(private ngZone: NgZone) { }

  ngAfterViewInit(): void {
    this.initThree();
    this.loadScene();
    this.startAnimation();

    const resizeObserver = new ResizeObserver(() => this.onResize());
    resizeObserver.observe(this.canvasRef.nativeElement);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['motif'] && !changes['motif'].firstChange && this.scene) {
      this.loadScene();
    }
  }

  ngOnDestroy(): void {
    this.stopAnimation();
    this.renderer?.dispose();
    this.composer?.dispose();
  }

  private initThree(): void {
    const canvas = this.canvasRef.nativeElement;
    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.5; // Increased exposure for drama

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    this.camera.position.z = 10;

    // Post-Processing
    const renderScene = new RenderPass(this.scene, this.camera);

    // Bloom Pass for that "magical" glow
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(canvas.clientWidth, canvas.clientHeight), 1.5, 0.4, 0.85);
    bloomPass.threshold = 0.2; // Glow starts earlier
    bloomPass.strength = 0.8; // Stronger glow
    bloomPass.radius = 0.5;

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(renderScene);
    this.composer.addPass(bloomPass);

    // Base Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 2); // Brighter ambient
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 4); // Strong key light
    dirLight.position.set(5, 5, 5);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048; // High res shadows
    dirLight.shadow.mapSize.height = 2048;
    this.scene.add(dirLight);

    // Rim light for edge definition
    const rimLight = new THREE.SpotLight(0x3b82f6, 10);
    rimLight.position.set(-5, 5, -5);
    rimLight.lookAt(0, 0, 0);
    this.scene.add(rimLight);
  }

  private loadScene(): void {
    this.objects.forEach(obj => this.scene.remove(obj));
    this.lights.forEach(l => this.scene.remove(l));
    this.objects = [];
    this.particles = [];
    this.lights = [];

    switch (this.motif) {
      case 'orbitals':
        this.createDigitalEarthScene();
        break;
      case 'rocket':
        this.createRocketScene();
        break;
      case 'finance':
        this.createFinanceScene();
        break;
      case 'constellations':
        this.createConstellationsScene();
        break;
      case 'prism':
        this.createPrismScene();
        break;
      default:
        this.createDefaultScene();
    }
  }

  private createDigitalEarthScene(): void {
    // Digital Earth Sphere
    const geometry = new THREE.IcosahedronGeometry(2, 4); // High detail

    // Wireframe/Dot material
    const material = new THREE.MeshPhysicalMaterial({
      color: 0x1e3a8a, // Dark blue base
      emissive: 0x3b82f6,
      emissiveIntensity: 0.2,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide
    });

    const earth = new THREE.Mesh(geometry, material);
    this.scene.add(earth);
    this.objects.push(earth);

    // Glowing Dots (Cities)
    const particlesGeo = new THREE.BufferGeometry();
    const particleCount = 300;
    const posArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      // Distribute on sphere surface
      const phi = Math.acos(-1 + (2 * i) / particleCount);
      const theta = Math.sqrt(particleCount * Math.PI) * phi;
      const r = 2.05; // Slightly above surface

      posArray[i * 3] = r * Math.cos(theta) * Math.sin(phi);
      posArray[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
      posArray[i * 3 + 2] = r * Math.cos(phi);
    }

    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMat = new THREE.PointsMaterial({
      color: 0x60a5fa,
      size: 0.08,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    const cityPoints = new THREE.Points(particlesGeo, particlesMat);
    earth.add(cityPoints); // Rotate with earth

    // Atmosphere Halo
    const haloGeo = new THREE.SphereGeometry(2.2, 32, 32);
    const haloMat = new THREE.ShaderMaterial({
      uniforms: {
        c: { value: 0.5 },
        p: { value: 4.0 },
        glowColor: { value: new THREE.Color(0x3b82f6) },
        viewVector: { value: new THREE.Vector3(0, 0, 10) }
      },
      vertexShader: `
            uniform vec3 viewVector;
            varying float intensity;
            void main() {
                vec3 vNormal = normalize(normalMatrix * normal);
                vec3 vNormel = normalize(normalMatrix * viewVector);
                intensity = pow(0.6 - dot(vNormal, vNormel), 4.0);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
      fragmentShader: `
            uniform vec3 glowColor;
            varying float intensity;
            void main() {
                vec3 glow = glowColor * intensity;
                gl_FragColor = vec4(glow, 1.0);
            }
        `,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    this.scene.add(halo);
    this.objects.push(halo);
  }

  private createRocketScene(): void {
    // Advanced Rocket Body
    const points = [];
    points.push(new THREE.Vector2(0, 2.5));
    points.push(new THREE.Vector2(0.3, 1.5));
    points.push(new THREE.Vector2(0.5, 0.5));
    points.push(new THREE.Vector2(0.5, -1.5));
    points.push(new THREE.Vector2(0.4, -1.8));
    points.push(new THREE.Vector2(0.2, -2.0));
    points.push(new THREE.Vector2(0, -2.0));

    const geometry = new THREE.LatheGeometry(points, 64); // Smoother
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.2,
      metalness: 0.8,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      envMapIntensity: 2.0
    });
    const rocket = new THREE.Mesh(geometry, material);
    rocket.castShadow = true;
    rocket.receiveShadow = true;

    // Fins
    const finShape = new THREE.Shape();
    finShape.moveTo(0, 0);
    finShape.lineTo(0.6, -0.6);
    finShape.lineTo(0.6, -1.6);
    finShape.lineTo(0, -1.2);
    const finGeom = new THREE.ExtrudeGeometry(finShape, { depth: 0.05, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02 });
    const finMat = new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.6, roughness: 0.4 });

    for (let i = 0; i < 3; i++) {
      const fin = new THREE.Mesh(finGeom, finMat);
      fin.position.y = -0.5;
      fin.rotation.y = (i * Math.PI * 2) / 3;
      fin.translateZ(0.45);
      rocket.add(fin);
    }

    // Glowing Engine Core
    const engineGeo = new THREE.CylinderGeometry(0.1, 0.2, 0.5, 16);
    const engineMat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
    const engine = new THREE.Mesh(engineGeo, engineMat);
    engine.position.y = -2.0;
    rocket.add(engine);

    // Dynamic Engine Light
    const engineLight = new THREE.PointLight(0xffaa00, 5, 5);
    engineLight.position.y = -2.5;
    rocket.add(engineLight);

    rocket.rotation.z = -Math.PI / 4;
    this.scene.add(rocket);
    this.objects.push(rocket);

    // High-Fidelity Exhaust
    const pGeo = new THREE.BufferGeometry();
    const pCount = 200;
    const pPos = new Float32Array(pCount * 3);
    const pSizes = new Float32Array(pCount);

    for (let i = 0; i < pCount; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 0.5 - 1.8;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 0.5 - 1.8;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
      pSizes[i] = Math.random() * 0.3;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute('size', new THREE.BufferAttribute(pSizes, 1));

    const pMat = new THREE.PointsMaterial({
      color: 0xff5500,
      size: 0.2,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const particles = new THREE.Points(pGeo, pMat);
    this.scene.add(particles);
    this.objects.push(particles);
    this.particles.push(particles);
  }

  private createFinanceScene(): void {
    // Crystalline Bars
    const colors = [0x10b981, 0x34d399, 0x6ee7b7, 0xa7f3d0];
    for (let i = 0; i < 4; i++) {
      const height = 1 + i * 1.5;
      const geometry = new THREE.BoxGeometry(0.8, height, 0.8);
      // Emissive core for bloom
      const material = new THREE.MeshPhysicalMaterial({
        color: colors[i],
        emissive: colors[i],
        emissiveIntensity: 0.5,
        metalness: 0.1,
        roughness: 0.1,
        transmission: 0.8,
        thickness: 1.5,
        clearcoat: 1.0
      });
      const bar = new THREE.Mesh(geometry, material);
      bar.position.x = (i - 1.5) * 1.2;
      bar.position.y = height / 2 - 2;
      bar.castShadow = true;
      bar.receiveShadow = true;
      this.scene.add(bar);
      this.objects.push(bar);
    }

    // Floating Coins with high reflection
    const coinGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.05, 32);
    const coinMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 1.0,
      roughness: 0.1,
      emissive: 0xffd700,
      emissiveIntensity: 0.2
    });
    for (let i = 0; i < 5; i++) {
      const coin = new THREE.Mesh(coinGeo, coinMat);
      coin.position.set((Math.random() - 0.5) * 4, Math.random() * 3, (Math.random() - 0.5) * 2);
      coin.rotation.x = Math.PI / 2;
      this.scene.add(coin);
      this.objects.push(coin);
    }
  }

  private createConstellationsScene(): void {
    const geometry = new THREE.BufferGeometry();
    const count = 60;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    // Glowing stars
    const material = new THREE.PointsMaterial({
      color: 0xf59e0b,
      size: 0.2,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    const points = new THREE.Points(geometry, material);
    this.scene.add(points);
    this.objects.push(points);

    // Glowing connections
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending
    });
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = [];
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = positions[i * 3] - positions[j * 3];
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < 2.5) {
          linePositions.push(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
          linePositions.push(positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]);
        }
      }
    }
    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    this.scene.add(lines);
    this.objects.push(lines);
  }

  private createPrismScene(): void {
    const geometry = new THREE.ConeGeometry(2, 3, 3);
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.1,
      roughness: 0,
      transmission: 1.0,
      thickness: 3.0,
      ior: 2.4, // Diamond-like
      dispersion: 1.0, // High dispersion for rainbows
      clearcoat: 1.0
    });
    const prism = new THREE.Mesh(geometry, material);
    prism.castShadow = true;
    this.scene.add(prism);
    this.objects.push(prism);

    // Volumetric Light Beam
    const beamGeo = new THREE.CylinderGeometry(0.1, 0.8, 8, 16, 1, true);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.rotation.z = Math.PI / 2;
    this.scene.add(beam);
    this.objects.push(beam);
  }

  private createDefaultScene(): void {
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshStandardMaterial({ color: 0xcccccc });
    const cube = new THREE.Mesh(geometry, material);
    this.scene.add(cube);
    this.objects.push(cube);
  }

  private startAnimation(): void {
    this.ngZone.runOutsideAngular(() => {
      const animate = () => {
        this.animationId = requestAnimationFrame(animate);

        this.objects.forEach((obj, index) => {
          if (this.motif === 'orbitals') {
            // Digital Earth rotation
            obj.rotation.y += 0.002;
          } else if (this.motif === 'rocket') {
            if (index === 0) { // Rocket body
              obj.rotation.z = -Math.PI / 4 + Math.sin(Date.now() * 0.002) * 0.05;
              obj.position.y = Math.sin(Date.now() * 0.003) * 0.2;
            }
            // Particles update
            if (this.particles.length > 0) {
              const positions = this.particles[0].geometry.attributes['position'].array as Float32Array;
              for (let i = 0; i < positions.length / 3; i++) {
                positions[i * 3] -= 0.08; // Faster exhaust
                positions[i * 3 + 1] -= 0.08;
                if (positions[i * 3] < -3) {
                  positions[i * 3] = (Math.random() - 0.5) * 0.5 - 1.0;
                  positions[i * 3 + 1] = (Math.random() - 0.5) * 0.5 - 1.0;
                }
              }
              this.particles[0].geometry.attributes['position'].needsUpdate = true;
            }
          } else if (this.motif === 'finance') {
            if (index >= 4) { // Coins
              obj.rotation.y += 0.03;
              obj.rotation.z += 0.01;
            }
          } else if (this.motif === 'prism') {
            if (index === 0) {
              obj.rotation.y += 0.005;
              obj.rotation.x = Math.sin(Date.now() * 0.001) * 0.1;
            }
          } else {
            obj.rotation.y += 0.002;
          }
        });

        // Use composer for bloom
        this.composer.render();
      };
      animate();
    });
  }

  private stopAnimation(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  private onResize(): void {
    const canvas = this.canvasRef.nativeElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    if (canvas.width !== width || canvas.height !== height) {
      this.renderer.setSize(width, height, false);
      this.composer.setSize(width, height); // Update composer size
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    }
  }
}
