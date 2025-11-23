import { Component, ElementRef, Input, ViewChild, AfterViewInit, OnDestroy, NgZone, OnChanges, SimpleChanges } from '@angular/core';
import * as THREE from 'three';

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
    private animationId: number | null = null;
    private objects: THREE.Object3D[] = [];
    private particles: THREE.Points[] = [];

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
    }

    private initThree(): void {
        const canvas = this.canvasRef.nativeElement;
        this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;

        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
        this.camera.position.z = 10;

        // Lighting for PBR
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 2);
        dirLight.position.set(5, 5, 5);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 1024;
        dirLight.shadow.mapSize.height = 1024;
        this.scene.add(dirLight);

        const blueLight = new THREE.PointLight(0x3b82f6, 1, 20);
        blueLight.position.set(-5, -2, 2);
        this.scene.add(blueLight);
    }

    private loadScene(): void {
        this.objects.forEach(obj => this.scene.remove(obj));
        this.objects = [];
        this.particles = [];

        switch (this.motif) {
            case 'orbitals':
                this.createOrbitalsScene();
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

    private createOrbitalsScene(): void {
        // High-tech core
        const coreGeometry = new THREE.IcosahedronGeometry(1, 1);
        const coreMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x3b82f6,
            emissive: 0x1d4ed8,
            emissiveIntensity: 0.5,
            roughness: 0.2,
            metalness: 0.8,
            clearcoat: 1.0
        });
        const core = new THREE.Mesh(coreGeometry, coreMaterial);
        this.scene.add(core);
        this.objects.push(core);

        // Glowing Rings
        const ringCount = 3;
        for (let i = 0; i < ringCount; i++) {
            const ringGeometry = new THREE.TorusGeometry(2 + i * 1.2, 0.08, 16, 100);
            const ringMaterial = new THREE.MeshStandardMaterial({
                color: 0x93c5fd,
                roughness: 0.1,
                metalness: 0.9,
                emissive: 0x60a5fa,
                emissiveIntensity: 0.2
            });
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);

            ring.rotation.x = Math.random() * Math.PI;
            ring.rotation.y = Math.random() * Math.PI;

            this.scene.add(ring);
            this.objects.push(ring);
        }

        // Particle cloud
        const pGeo = new THREE.BufferGeometry();
        const pCount = 200;
        const pPos = new Float32Array(pCount * 3);
        for (let i = 0; i < pCount; i++) {
            const r = 4 + Math.random() * 2;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            pPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            pPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            pPos[i * 3 + 2] = r * Math.cos(phi);
        }
        pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
        const pMat = new THREE.PointsMaterial({ color: 0x60a5fa, size: 0.05, transparent: true, opacity: 0.6 });
        const points = new THREE.Points(pGeo, pMat);
        this.scene.add(points);
        this.objects.push(points);
    }

    private createRocketScene(): void {
        // Realistic Rocket Body using LatheGeometry
        const points = [];
        points.push(new THREE.Vector2(0, 2.5)); // Tip
        points.push(new THREE.Vector2(0.3, 1.5)); // Nose cone base
        points.push(new THREE.Vector2(0.5, 0.5)); // Body top
        points.push(new THREE.Vector2(0.5, -1.5)); // Body bottom
        points.push(new THREE.Vector2(0.4, -1.8)); // Nozzle start
        points.push(new THREE.Vector2(0.2, -2.0)); // Nozzle end
        points.push(new THREE.Vector2(0, -2.0)); // Close

        const geometry = new THREE.LatheGeometry(points, 32);
        const material = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.3,
            metalness: 0.6,
            envMapIntensity: 1
        });
        const rocket = new THREE.Mesh(geometry, material);
        rocket.castShadow = true;
        rocket.receiveShadow = true;

        // Fins
        const finShape = new THREE.Shape();
        finShape.moveTo(0, 0);
        finShape.lineTo(0.5, -0.5);
        finShape.lineTo(0.5, -1.5);
        finShape.lineTo(0, -1.0);
        const finGeom = new THREE.ExtrudeGeometry(finShape, { depth: 0.05, bevelEnabled: false });
        const finMat = new THREE.MeshStandardMaterial({ color: 0xff0000, metalness: 0.5, roughness: 0.5 });

        for (let i = 0; i < 3; i++) {
            const fin = new THREE.Mesh(finGeom, finMat);
            fin.position.y = -0.5;
            fin.rotation.y = (i * Math.PI * 2) / 3;
            fin.translateZ(0.45);
            rocket.add(fin);
        }

        // Window
        const windowGeom = new THREE.SphereGeometry(0.15, 16, 16);
        const windowMat = new THREE.MeshPhysicalMaterial({
            color: 0x88ccff,
            metalness: 0.9,
            roughness: 0.1,
            transmission: 0.5,
            thickness: 0.5
        });
        const win = new THREE.Mesh(windowGeom, windowMat);
        win.position.set(0, 0.8, 0.45);
        rocket.add(win);

        rocket.rotation.z = -Math.PI / 4;
        this.scene.add(rocket);
        this.objects.push(rocket);

        // Realistic Exhaust Particles
        const pGeo = new THREE.BufferGeometry();
        const pCount = 100;
        const pPos = new Float32Array(pCount * 3);
        const pSizes = new Float32Array(pCount);

        for (let i = 0; i < pCount; i++) {
            pPos[i * 3] = (Math.random() - 0.5) * 0.5 - 1.8; // Positioned behind rocket
            pPos[i * 3 + 1] = (Math.random() - 0.5) * 0.5 - 1.8;
            pPos[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
            pSizes[i] = Math.random() * 0.2;
        }
        pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
        pGeo.setAttribute('size', new THREE.BufferAttribute(pSizes, 1));

        const pMat = new THREE.PointsMaterial({
            color: 0xffaa00,
            size: 0.2,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        const particles = new THREE.Points(pGeo, pMat);
        this.scene.add(particles);
        this.objects.push(particles);
        this.particles.push(particles);
    }

    private createFinanceScene(): void {
        // Glassy Bars
        const colors = [0x10b981, 0x34d399, 0x6ee7b7, 0xa7f3d0];
        for (let i = 0; i < 4; i++) {
            const height = 1 + i * 1.5;
            const geometry = new THREE.BoxGeometry(0.8, height, 0.8);
            const material = new THREE.MeshPhysicalMaterial({
                color: colors[i],
                metalness: 0.1,
                roughness: 0.1,
                transmission: 0.6, // Glass-like
                thickness: 1.0,
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

        // Floating gold coins
        const coinGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.05, 32);
        const coinMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 1, roughness: 0.2 });
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
        const count = 40;
        const positions = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 8;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const material = new THREE.PointsMaterial({ color: 0xf59e0b, size: 0.15, sizeAttenuation: true });
        const points = new THREE.Points(geometry, material);
        this.scene.add(points);
        this.objects.push(points);

        // Glowing connections
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.2 });
        const lineGeometry = new THREE.BufferGeometry();
        const linePositions = [];
        // Connect nearby stars
        for (let i = 0; i < count; i++) {
            for (let j = i + 1; j < count; j++) {
                const dx = positions[i * 3] - positions[j * 3];
                const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
                const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
                if (dist < 3) {
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
        const geometry = new THREE.ConeGeometry(2, 3, 3); // Triangular prism
        const material = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            metalness: 0.1,
            roughness: 0,
            transmission: 0.95, // High transmission for glass
            thickness: 2.0,
            ior: 1.5, // Index of refraction for glass
            dispersion: 0.5 // Chromatic aberration
        });
        const prism = new THREE.Mesh(geometry, material);
        prism.castShadow = true;
        this.scene.add(prism);
        this.objects.push(prism);

        // Light beam
        const beamGeo = new THREE.CylinderGeometry(0.1, 0.5, 6, 8);
        const beamMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.1, blending: THREE.AdditiveBlending });
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
                        if (index === 0) { // Core
                            obj.rotation.y += 0.01;
                            obj.rotation.z += 0.005;
                        } else if (index < 4) { // Rings
                            obj.rotation.x += 0.02 * (index % 2 === 0 ? 1 : -1);
                            obj.rotation.y += 0.01;
                        } else { // Particles
                            obj.rotation.y -= 0.002;
                        }
                    } else if (this.motif === 'rocket') {
                        if (index === 0) { // Rocket body
                            obj.rotation.z = -Math.PI / 4 + Math.sin(Date.now() * 0.002) * 0.05;
                            obj.position.y = Math.sin(Date.now() * 0.003) * 0.2;
                        }
                        // Particles update
                        if (this.particles.length > 0) {
                            const positions = this.particles[0].geometry.attributes['position'].array as Float32Array;
                            for (let i = 0; i < positions.length / 3; i++) {
                                positions[i * 3] -= 0.05; // Move left/down
                                positions[i * 3 + 1] -= 0.05;
                                if (positions[i * 3] < -3) {
                                    positions[i * 3] = (Math.random() - 0.5) * 0.5 - 1.0;
                                    positions[i * 3 + 1] = (Math.random() - 0.5) * 0.5 - 1.0;
                                }
                            }
                            this.particles[0].geometry.attributes['position'].needsUpdate = true;
                        }
                    } else if (this.motif === 'finance') {
                        if (index < 4) { // Bars
                            // Subtle scaling?
                        } else { // Coins
                            obj.rotation.y += 0.02;
                            obj.position.y += Math.sin(Date.now() * 0.002 + index) * 0.01;
                        }
                    } else if (this.motif === 'prism') {
                        if (index === 0) {
                            obj.rotation.y += 0.005;
                            obj.rotation.x = Math.sin(Date.now() * 0.001) * 0.2;
                        }
                    } else {
                        obj.rotation.y += 0.002;
                    }
                });

                this.renderer.render(this.scene, this.camera);
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
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
        }
    }
}
