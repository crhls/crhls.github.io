document.addEventListener('DOMContentLoaded', () => {
    
    // Initialize all scenes
    initHeroScene();
    initServicesScene();
    initPortfolioScene();

    // UI Interactions
    initUI();
});

// =========================================
// UI LOGIC
// =========================================
function initUI() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');

    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    });

    // Close mobile menu on link click
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileMenuBtn.querySelector('i').classList.remove('fa-xmark');
            mobileMenuBtn.querySelector('i').classList.add('fa-bars');
        });
    });

    // Contact Form Toast
    const contactForm = document.getElementById('contactForm');
    const toast = document.getElementById('toast');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        toast.className = "toast show";
        contactForm.reset();
        setTimeout(() => { 
            toast.className = toast.className.replace("show", ""); 
        }, 3000);
    });

    // Scroll Animations (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(el => observer.observe(el));
}

// =========================================
// 3D SCENE 1: HERO (Network Sphere)
// =========================================
function initHeroScene() {
    const container = document.getElementById('hero-canvas');
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Geometric Object
    const geometry = new THREE.IcosahedronGeometry(2.2, 1);
    const material = new THREE.MeshBasicMaterial({ 
        color: 0x0f172a, wireframe: true, transparent: true, opacity: 0.3 
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 70;
    const posArray = new Float32Array(particlesCount * 3);
    for(let i = 0; i < particlesCount * 3; i++) posArray[i] = (Math.random() - 0.5) * 8;
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({ size: 0.05, color: 0x10b981 });
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Animation
    const animate = () => {
        requestAnimationFrame(animate);
        mesh.rotation.z += 0.002;
        mesh.rotation.y += 0.001;
        particlesMesh.rotation.y = -mouseX * 0.0005;
        renderer.render(scene, camera);
    };

    // Mouse Interaction
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX - window.innerWidth / 2;
        mouseY = e.clientY - window.innerHeight / 2;
    });

    animate();

    // Resize
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}

// =========================================
// 3D SCENE 2: SERVICES (Floating Lattice)
// =========================================
function initServicesScene() {
    const container = document.getElementById('services-canvas');
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 10;
    camera.position.y = 2;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Create a grid of cubes
    const group = new THREE.Group();
    const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const material = new THREE.MeshPhongMaterial({ color: 0x334155, transparent: true, opacity: 0.2 });

    for (let i = 0; i < 50; i++) {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = (Math.random() - 0.5) * 20;
        mesh.position.y = (Math.random() - 0.5) * 10;
        mesh.position.z = (Math.random() - 0.5) * 10;
        mesh.rotation.x = Math.random() * Math.PI;
        group.add(mesh);
    }
    scene.add(group);

    // Lighting
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(2, 2, 5);
    scene.add(light);

    const animate = () => {
        requestAnimationFrame(animate);
        group.rotation.y += 0.001;
        // Gentle floating effect
        group.position.y = Math.sin(Date.now() * 0.0005) * 0.5;
        renderer.render(scene, camera);
    };

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}

// =========================================
// 3D SCENE 3: PORTFOLIO (Particle Wave)
// =========================================
function initPortfolioScene() {
    const container = document.getElementById('portfolio-canvas');
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 20;
    camera.position.y = 10;
    camera.lookAt(0,0,0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Create Wave
    const particleCount = 1000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    
    // Initial flat plane
    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (i % 20) - 10; // x
        positions[i * 3 + 1] = 0;         // y
        positions[i * 3 + 2] = Math.floor(i / 20) - 10; // z
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({ color: 0x10b981, size: 0.15 });
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    const animate = () => {
        requestAnimationFrame(animate);
        
        const time = Date.now() * 0.001;
        const positions = particles.geometry.attributes.position.array;

        for (let i = 0; i < particleCount; i++) {
            // Create wave effect using sine
            positions[i * 3 + 1] = Math.sin((i % 20) * 0.5 + time) * 1.5;
        }
        
        particles.geometry.attributes.position.needsUpdate = true;
        renderer.render(scene, camera);
    };

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}