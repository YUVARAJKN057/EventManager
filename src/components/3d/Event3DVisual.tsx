import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Eye, Box, Sparkles, RefreshCw } from 'lucide-react';
import { getTopicImageUrl } from '../../lib/eventImages';

interface Event3DVisualProps {
  category?: string;
  title?: string;
  imageUrl?: string;
  height?: string | number;
  interactive?: boolean;
  showControls?: boolean;
  defaultView?: '3d' | 'photo';
  controlsPosition?: 'top-left' | 'top-right' | 'bottom-right' | 'bottom-left';
  className?: string;
}

// Category themes with dedicated color palettes and geometric styles
const CATEGORY_STYLES: Record<string, {
  primary: number;
  secondary: number;
  ambient: number;
  wireframe: boolean;
  particleCount: number;
  shape: 'icosahedron' | 'torus' | 'octahedron' | 'ringSphere' | 'prismCluster' | 'cyberCube';
}> = {
  Tech: {
    primary: 0x6366f1,    // Indigo neon
    secondary: 0x06b6d4,  // Cyan
    ambient: 0x1e1b4b,
    wireframe: true,
    particleCount: 70,
    shape: 'cyberCube'
  },
  Music: {
    primary: 0xec4899,    // Pink / Magenta
    secondary: 0x8b5cf6,  // Purple
    ambient: 0x3b0764,
    wireframe: false,
    particleCount: 90,
    shape: 'torus'
  },
  Sports: {
    primary: 0xf97316,    // Vibrant Orange
    secondary: 0xeab308,  // Gold / Yellow
    ambient: 0x431407,
    wireframe: false,
    particleCount: 60,
    shape: 'ringSphere'
  },
  Art: {
    primary: 0x14b8a6,    // Emerald Teal
    secondary: 0xf43f5e,  // Rose
    ambient: 0x134e4a,
    wireframe: false,
    particleCount: 80,
    shape: 'octahedron'
  },
  Workshop: {
    primary: 0x3b82f6,    // Sky Blue
    secondary: 0x10b981,  // Emerald
    ambient: 0x172554,
    wireframe: true,
    particleCount: 65,
    shape: 'prismCluster'
  },
  Conference: {
    primary: 0xa855f7,    // Purple
    secondary: 0x38bdf8,  // Light Cyan
    ambient: 0x2e1065,
    wireframe: true,
    particleCount: 75,
    shape: 'icosahedron'
  },
  Social: {
    primary: 0x06b6d4,    // Cyan
    secondary: 0xf59e0b,  // Amber
    ambient: 0x083344,
    wireframe: false,
    particleCount: 80,
    shape: 'torus'
  },
  Career: {
    primary: 0x64748b,    // Slate
    secondary: 0x6366f1,  // Indigo
    ambient: 0x0f172a,
    wireframe: true,
    particleCount: 50,
    shape: 'prismCluster'
  }
};

export default function Event3DVisual({
  category = 'Tech',
  title = '',
  imageUrl,
  interactive = true,
  showControls = true,
  defaultView = 'photo',
  controlsPosition = 'bottom-right',
  className = ''
}: Event3DVisualProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<'3d' | 'photo'>(defaultView);
  const [isHovered, setIsHovered] = useState(false);
  const [isRotating, setIsRotating] = useState(true);

  // Resolved high-resolution topic-specific image
  const resolvedImage = getTopicImageUrl(title, category, imageUrl);
  const [imgSrc, setImgSrc] = useState(resolvedImage);

  useEffect(() => {
    setImgSrc(getTopicImageUrl(title, category, imageUrl));
  }, [title, category, imageUrl]);

  useEffect(() => {
    setViewMode(defaultView);
  }, [defaultView]);

  // Pick or fallback category style
  const style = CATEGORY_STYLES[category] || CATEGORY_STYLES['Tech'];

  useEffect(() => {
    if (viewMode !== '3d' || !containerRef.current) return;

    const container = containerRef.current;
    let width = container.clientWidth || 300;
    let height = container.clientHeight || 200;

    // 1. Scene & Camera setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x09090b, 0.12);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 4.8;

    // 2. WebGL Renderer with transparency & high pixel density
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 3. Dynamic Lighting
    const ambientLight = new THREE.AmbientLight(style.ambient, 2.5);
    scene.add(ambientLight);

    const primaryLight = new THREE.PointLight(style.primary, 8, 20);
    primaryLight.position.set(3, 4, 3);
    scene.add(primaryLight);

    const secondaryLight = new THREE.PointLight(style.secondary, 6, 20);
    secondaryLight.position.set(-3, -3, 2);
    scene.add(secondaryLight);

    const mouseLight = new THREE.PointLight(0xffffff, 4, 10);
    mouseLight.position.set(0, 0, 3);
    scene.add(mouseLight);

    // 4. Main 3D Object Hierarchy
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // Geometry generators based on category shape
    let coreMesh: THREE.Mesh;
    let wireMesh: THREE.Mesh | null = null;
    let ringMesh: THREE.Mesh | null = null;

    const materialConfig = {
      color: style.primary,
      metalness: 0.7,
      roughness: 0.2,
      clearcoat: 0.8,
      clearcoatRoughness: 0.1,
    };

    if (style.shape === 'cyberCube') {
      const geo = new THREE.BoxGeometry(1.5, 1.5, 1.5);
      const innerGeo = new THREE.IcosahedronGeometry(0.8, 1);
      
      const mat = new THREE.MeshPhysicalMaterial({
        ...materialConfig,
        color: style.secondary,
        transparent: true,
        opacity: 0.85
      });
      coreMesh = new THREE.Mesh(innerGeo, mat);

      const wireMat = new THREE.MeshBasicMaterial({
        color: style.primary,
        wireframe: true,
        transparent: true,
        opacity: 0.6
      });
      wireMesh = new THREE.Mesh(geo, wireMat);
      mainGroup.add(wireMesh);

      // Tech Orbit Ring
      const ringGeo = new THREE.TorusGeometry(1.6, 0.02, 16, 64);
      const ringMat = new THREE.MeshBasicMaterial({ color: style.secondary, transparent: true, opacity: 0.7 });
      ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2.5;
      mainGroup.add(ringMesh);

    } else if (style.shape === 'torus') {
      const geo = new THREE.TorusKnotGeometry(0.9, 0.28, 100, 16);
      const mat = new THREE.MeshPhysicalMaterial({
        ...materialConfig,
        emissive: style.primary,
        emissiveIntensity: 0.25
      });
      coreMesh = new THREE.Mesh(geo, mat);

      const wireGeo = new THREE.TorusKnotGeometry(0.92, 0.29, 40, 8);
      const wireMat = new THREE.MeshBasicMaterial({ color: style.secondary, wireframe: true, transparent: true, opacity: 0.25 });
      wireMesh = new THREE.Mesh(wireGeo, wireMat);
      mainGroup.add(wireMesh);

    } else if (style.shape === 'ringSphere') {
      const geo = new THREE.SphereGeometry(1.0, 32, 32);
      const mat = new THREE.MeshStandardMaterial({
        ...materialConfig,
        color: style.primary,
        roughness: 0.3
      });
      coreMesh = new THREE.Mesh(geo, mat);

      // Kinetic dynamic dual rings
      const ringGeo1 = new THREE.TorusGeometry(1.5, 0.04, 16, 64);
      const ringMat1 = new THREE.MeshBasicMaterial({ color: style.secondary });
      ringMesh = new THREE.Mesh(ringGeo1, ringMat1);
      ringMesh.rotation.x = Math.PI / 3;
      mainGroup.add(ringMesh);

      const ringGeo2 = new THREE.TorusGeometry(1.7, 0.03, 16, 64);
      const ringMat2 = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });
      const ringMesh2 = new THREE.Mesh(ringGeo2, ringMat2);
      ringMesh2.rotation.y = Math.PI / 3;
      mainGroup.add(ringMesh2);

    } else if (style.shape === 'octahedron') {
      const geo = new THREE.OctahedronGeometry(1.2, 0);
      const mat = new THREE.MeshPhysicalMaterial({
        ...materialConfig,
        color: style.primary,
        transmission: 0.5,
        thickness: 0.8
      });
      coreMesh = new THREE.Mesh(geo, mat);

      const wireGeo = new THREE.OctahedronGeometry(1.3, 0);
      const wireMat = new THREE.MeshBasicMaterial({ color: style.secondary, wireframe: true });
      wireMesh = new THREE.Mesh(wireGeo, wireMat);
      mainGroup.add(wireMesh);

    } else if (style.shape === 'prismCluster') {
      const geo = new THREE.ConeGeometry(1.1, 1.8, 6);
      const mat = new THREE.MeshStandardMaterial({
        ...materialConfig,
        color: style.primary
      });
      coreMesh = new THREE.Mesh(geo, mat);

      const ringGeo = new THREE.RingGeometry(1.2, 1.4, 6);
      const ringMat = new THREE.MeshBasicMaterial({ color: style.secondary, side: THREE.DoubleSide, wireframe: true });
      ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      mainGroup.add(ringMesh);

    } else {
      // Default Icosahedron
      const geo = new THREE.IcosahedronGeometry(1.2, 0);
      const mat = new THREE.MeshStandardMaterial({
        ...materialConfig,
        color: style.primary,
        roughness: 0.15
      });
      coreMesh = new THREE.Mesh(geo, mat);

      const wireGeo = new THREE.IcosahedronGeometry(1.3, 1);
      const wireMat = new THREE.MeshBasicMaterial({ color: style.secondary, wireframe: true, transparent: true, opacity: 0.4 });
      wireMesh = new THREE.Mesh(wireGeo, wireMat);
      mainGroup.add(wireMesh);
    }

    mainGroup.add(coreMesh);

    // 5. Orbiting Ambient Particles
    const particlesGeo = new THREE.BufferGeometry();
    const posArray = new Float32Array(style.particleCount * 3);

    for (let i = 0; i < style.particleCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 5;
      posArray[i + 1] = (Math.random() - 0.5) * 5;
      posArray[i + 2] = (Math.random() - 0.5) * 5;
    }

    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMat = new THREE.PointsMaterial({
      size: 0.04,
      color: style.secondary,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });
    const particleSystem = new THREE.Points(particlesGeo, particlesMat);
    mainGroup.add(particleSystem);

    // 6. Interactive Mouse Tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      
      targetX = x * 0.8;
      targetY = y * 0.8;

      mouseLight.position.x = x * 2.5;
      mouseLight.position.y = y * 2.5;

      if (isDragging) {
        const deltaX = e.clientX - prevMousePos.x;
        const deltaY = e.clientY - prevMousePos.y;
        mainGroup.rotation.y += deltaX * 0.015;
        mainGroup.rotation.x += deltaY * 0.015;
        prevMousePos = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = container.getBoundingClientRect();
        targetX = (((touch.clientX - rect.left) / rect.width) * 2 - 1) * 0.8;
        targetY = -((((touch.clientY - rect.top) / rect.height) * 2 - 1)) * 0.8;
      }
    };

    if (interactive) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mouseup', handleMouseUp);
      container.addEventListener('touchmove', handleTouchMove, { passive: true });
    }

    // 7. Render Loop with Visibility & Intersection Optimization
    let animationFrameId: number;
    let isVisible = true;

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0.1 });
    observer.observe(container);

    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible) return;

      const elapsedTime = clock.getElapsedTime();

      // Smooth camera / group rotation towards cursor
      mouseX += (targetX - mouseX) * 0.06;
      mouseY += (targetY - mouseY) * 0.06;

      if (isRotating && !isDragging) {
        mainGroup.rotation.y += 0.008;
        mainGroup.rotation.x += 0.003;
      }

      mainGroup.rotation.y += mouseX * 0.02;
      mainGroup.rotation.x += -mouseY * 0.02;

      // Inner object micro-animations
      if (coreMesh) {
        coreMesh.rotation.y = elapsedTime * 0.3;
        coreMesh.rotation.z = Math.sin(elapsedTime * 0.5) * 0.1;
      }

      if (wireMesh) {
        wireMesh.rotation.y = -elapsedTime * 0.2;
        wireMesh.rotation.x = Math.cos(elapsedTime * 0.3) * 0.15;
      }

      if (ringMesh) {
        ringMesh.rotation.z = elapsedTime * 0.4;
      }

      if (particleSystem) {
        particleSystem.rotation.y = elapsedTime * 0.05;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 8. Responsive Resize Handling
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newW, height: newH } = entry.contentRect;
        if (newW > 0 && newH > 0) {
          camera.aspect = newW / newH;
          camera.updateProjectionMatrix();
          renderer.setSize(newW, newH);
        }
      }
    });
    resizeObserver.observe(container);

    // 9. Clean up memory and WebGL context
    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      resizeObserver.disconnect();

      if (interactive) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mouseup', handleMouseUp);
        container.removeEventListener('touchmove', handleTouchMove);
      }

      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Points) {
          obj.geometry?.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material?.dispose();
          }
        }
      });

      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [viewMode, category, interactive, style, isRotating]);

  return (
    <div
      className={`relative w-full h-full overflow-hidden bg-gradient-to-br from-zinc-950 via-zinc-900/80 to-zinc-950 select-none ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 3D Hologram Stage Canvas or Topic Photo */}
      {viewMode === '3d' ? (
        <div
          ref={containerRef}
          className="w-full h-full cursor-grab active:cursor-grabbing transition-opacity duration-300"
        />
      ) : (
        <img
          src={imgSrc}
          alt={title || category}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={() => {
            setImgSrc(getTopicImageUrl(title, category));
          }}
        />
      )}

      {/* Cyber Grid Subtle Horizon Backdrop for 3D View */}
      {viewMode === '3d' && (
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08)_0%,transparent_70%)]" />
      )}

      {/* Status Indicator & View Switcher (Positioned cleanly) */}
      {showControls && (
        <div className={`absolute z-20 flex items-center gap-1.5 opacity-90 hover:opacity-100 transition-opacity ${
          controlsPosition === 'top-left' ? 'top-2.5 left-2.5' :
          controlsPosition === 'top-right' ? 'top-2.5 right-2.5' :
          controlsPosition === 'bottom-left' ? 'bottom-2.5 left-2.5' :
          'bottom-2.5 right-2.5'
        }`}>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setViewMode(viewMode === '3d' ? 'photo' : '3d');
            }}
            className="px-2 py-1 rounded-lg text-[10px] font-bold tracking-wider uppercase backdrop-blur-md border border-zinc-700/70 bg-zinc-900/90 text-zinc-200 hover:text-white hover:border-indigo-500 flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-black/60"
            title={viewMode === '3d' ? 'Switch to Topic Photo' : 'Explore in Interactive 3D'}
          >
            {viewMode === '3d' ? (
              <>
                <Eye className="h-3 w-3 text-indigo-400" />
                <span>Photo</span>
              </>
            ) : (
              <>
                <Box className="h-3 w-3 text-emerald-400" />
                <span>3D Mode</span>
              </>
            )}
          </button>

          {viewMode === '3d' && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsRotating(!isRotating);
              }}
              className={`p-1.5 rounded-lg backdrop-blur-md border border-zinc-700/60 text-zinc-300 hover:text-white transition-all cursor-pointer shadow-md shadow-black/40 ${
                isRotating ? 'bg-indigo-600/40 text-indigo-300 border-indigo-500/50' : 'bg-zinc-900/80'
              }`}
              title={isRotating ? 'Pause rotation' : 'Auto-rotate 3D scene'}
            >
              <RefreshCw className={`h-3 w-3 ${isRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
            </button>
          )}
        </div>
      )}

      {/* Interactive 3D Badge on Hover */}
      {viewMode === '3d' && isHovered && (
        <div className="absolute bottom-2.5 right-2.5 z-20 pointer-events-none">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-medium tracking-tight bg-black/60 text-zinc-300 border border-zinc-800 backdrop-blur-md">
            <Sparkles className="h-2.5 w-2.5 text-indigo-400" /> Drag to rotate 3D
          </span>
        </div>
      )}
    </div>
  );
}
