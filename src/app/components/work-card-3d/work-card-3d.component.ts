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

    constructor(private ngZone: NgZone) { }

    ngAfterViewInit(): void {
        this.initThree();
        this.loadScene();
        this.startAnimation();

        // Handle resize
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

        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
        this.camera.position.z = 10;
    }

    private loadScene(): void {
        // Clear existing objects
        this.objects.forEach(obj => this.scene.remove(obj));
        this.objects = [];

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
        // Central core
        const coreGeometry = new THREE.SphereGeometry(1, 32, 32);
        const coreMaterial = new THREE.MeshBasicMaterial({ color: 0x3b82f6 }); // brand-500
        const core = new THREE.Mesh(coreGeometry, coreMaterial);
        this.scene.add(core);
        this.objects.push(core);

        // Rings
        for (let i = 0; i < 3; i++) {
            const ringGeometry = new THREE.TorusGeometry(2 + i * 1.2, 0.05, 16, 100);
            const ringMaterial = new THREE.MeshBasicMaterial({ color: 0x93c5fd, transparent: true, opacity: 0.6 });
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);

            ring.rotation.x = Math.random() * Math.PI;
            ring.rotation.y = Math.random() * Math.PI;

            this.scene.add(ring);
            this.objects.push(ring);
        }
    }

    private createRocketScene(): void {
        // Simple rocket body
        const bodyGeometry = new THREE.CylinderGeometry(0.5, 0.5, 3, 12);
        const bodyMaterial = new THREE.MeshNormalMaterial();
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.rotation.z = -Math.PI / 4;
        this.scene.add(body);
        this.objects.push(body);

        // Cone top
        const coneGeometry = new THREE.ConeGeometry(0.5, 1, 12);
        const coneMaterial = new THREE.MeshNormalMaterial();
        const cone = new THREE.Mesh(coneGeometry, coneMaterial);
        cone.position.set(1.06, 1.06, 0); // Approximate position based on rotation
        cone.rotation.z = -Math.PI / 4;
        this.scene.add(cone);
        this.objects.push(cone);

        // Particles for exhaust
        const particlesGeometry = new THREE.BufferGeometry();
        const count = 50;
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 0.5 - 1.5;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 0.5 - 1.5;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
        }
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const particlesMaterial = new THREE.PointsMaterial({ color: 0xff5722, size: 0.1 });
        const particles = new THREE.Points(particlesGeometry, particlesMaterial);
        this.scene.add(particles);
        this.objects.push(particles);
    }

    private createFinanceScene(): void {
        // Bar chart
        const colors = [0x10b981, 0x34d399, 0x6ee7b7, 0xa7f3d0];
        for (let i = 0; i < 4; i++) {
            const height = 1 + i * 1.5;
            const geometry = new THREE.BoxGeometry(0.8, height, 0.8);
            const material = new THREE.MeshBasicMaterial({ color: colors[i] });
            const bar = new THREE.Mesh(geometry, material);
            bar.position.x = (i - 1.5) * 1.2;
            bar.position.y = height / 2 - 2;
            this.scene.add(bar);
            this.objects.push(bar);
        }
    }

    private createConstellationsScene(): void {
        const geometry = new THREE.BufferGeometry();
        const count = 30;
        const positions = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 8;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const material = new THREE.PointsMaterial({ color: 0xf59e0b, size: 0.2 });
        const points = new THREE.Points(geometry, material);
        this.scene.add(points);
        this.objects.push(points);

        // Lines connecting points could be added here for more detail
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.3 });
        // Simple loop to connect some points
        const lineGeometry = new THREE.BufferGeometry();
        const linePositions = [];
        for (let i = 0; i < count - 1; i++) {
            if (Math.random() > 0.5) {
                linePositions.push(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
                linePositions.push(positions[(i + 1) * 3], positions[(i + 1) * 3 + 1], positions[(i + 1) * 3 + 2]);
            }
        }
        lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
        const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
        this.scene.add(lines);
        this.objects.push(lines);
    }

    private createPrismScene(): void {
        const geometry = new THREE.ConeGeometry(2, 3, 4);
        const material = new THREE.MeshNormalMaterial({ wireframe: true });
        const prism = new THREE.Mesh(geometry, material);
        this.scene.add(prism);
        this.objects.push(prism);
    }

    private createDefaultScene(): void {
        const geometry = new THREE.BoxGeometry(2, 2, 2);
        const material = new THREE.MeshNormalMaterial();
        const cube = new THREE.Mesh(geometry, material);
        this.scene.add(cube);
        this.objects.push(cube);
    }

    private startAnimation(): void {
        this.ngZone.runOutsideAngular(() => {
            const animate = () => {
                this.animationId = requestAnimationFrame(animate);

                // Rotate entire scene slightly or specific objects
                this.objects.forEach((obj, index) => {
                    if (this.motif === 'orbitals' && index > 0) {
                        // Rotate rings
                        obj.rotation.x += 0.01 * (index % 2 === 0 ? 1 : -1);
                        obj.rotation.y += 0.02;
                    } else if (this.motif === 'rocket') {
                        // Wiggle rocket
                        if (index < 2) obj.rotation.z = -Math.PI / 4 + Math.sin(Date.now() * 0.005) * 0.05;
                    } else if (this.motif === 'constellations') {
                        obj.rotation.y += 0.001;
                    } else {
                        obj.rotation.y += 0.01;
                        obj.rotation.x += 0.005;
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
