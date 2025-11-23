import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, NgZone, inject } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-three-background',
  standalone: true,
  template: '<canvas #canvas class="fixed inset-0 -z-10 h-full w-full bg-slate-950"></canvas>',
  styles: [
    `
      :host {
        display: block;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        pointer-events: none;
      }
    `
  ]
})
export class ThreeBackgroundComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') private canvasRef!: ElementRef<HTMLCanvasElement>;
  
  private readonly ngZone = inject(NgZone);
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private stars!: THREE.Points;
  private animationId: number | null = null;

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.initThree();
      this.animate();
      window.addEventListener('resize', this.onResize.bind(this));
    });
  }

  ngOnDestroy(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
    }
    window.removeEventListener('resize', this.onResize.bind(this));
    this.renderer?.dispose();
  }

  private initThree(): void {
    const canvas = this.canvasRef.nativeElement;
    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.scene = new THREE.Scene();
    // Dark background color to match the theme
    this.scene.background = new THREE.Color('#020617'); // slate-950
    this.scene.fog = new THREE.FogExp2('#020617', 0.001);

    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 1;
    this.camera.rotation.x = Math.PI / 2;

    this.createStars();
  }

  private createStars(): void {
    const starCount = 6000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const velocities = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 600;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 600;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 600;
      velocities[i] = 0;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 1));

    const material = new THREE.PointsMaterial({
      color: 0xaaaaaa,
      size: 0.7,
      transparent: true
    });

    this.stars = new THREE.Points(geometry, material);
    this.scene.add(this.stars);
  }

  private animate(): void {
    this.animationId = requestAnimationFrame(this.animate.bind(this));

    const positions = this.stars.geometry.attributes['position'].array as Float32Array;
    const velocities = this.stars.geometry.attributes['velocity'].array as Float32Array;
    
    for (let i = 0; i < 6000; i++) {
      // Update velocity
      velocities[i] += 0.02;
      
      // Move star
      positions[i * 3 + 1] -= velocities[i]; // Move along Y axis (which is depth due to camera rotation)

      // Reset if out of bounds
      if (positions[i * 3 + 1] < -200) {
        positions[i * 3 + 1] = 200;
        velocities[i] = 0;
      }
    }

    this.stars.geometry.attributes['position'].needsUpdate = true;
    this.stars.rotation.y += 0.002;

    this.renderer.render(this.scene, this.camera);
  }

  private onResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
