// js/animations.js

document.addEventListener('DOMContentLoaded', () => {
    // Ensure GSAP and ScrollTrigger are loaded
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('GSAP or ScrollTrigger not loaded. Animations disabled.');
        return;
    }
    gsap.registerPlugin(ScrollTrigger);

    // --- Hero Slider Animations ---
    function animateDealCardContent(cardIndex) {
        const dealCard = document.querySelectorAll('.deal-card')[cardIndex];
        if (!dealCard) return;

        const title = dealCard.querySelector('.deal-title');
        const description = dealCard.querySelector('.deal-description');
        const serving = dealCard.querySelector('.deal-serving');
        const price = dealCard.querySelector('.deal-price');
        const button = dealCard.querySelector('.add-to-cart-deal-btn');
        
        // Check if elements exist before animating
        if (title && description && serving && price && button) {
            gsap.fromTo([title, description, serving, price, button], 
                { opacity: 0, y: 30 }, 
                { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", stagger: 0.15 }
            );
        }
    }
    window.animateDealOnSlideChange = animateDealCardContent; // Expose to App.js

    const heroSliderContainer = document.querySelector('.hero-slider-container');
    const sliderDots = document.getElementById('slider-dots');

    if (heroSliderContainer) {
        gsap.from(heroSliderContainer, {
            opacity: .8, scale: 0.95, duration: 1.2, ease: "power3.out", delay: 0.5,
            onComplete: () => {
                animateDealCardContent(0);
                gsap.from(sliderDots, { opacity: .6, y: 20, duration: 0.5, ease: "power2.out" });
            }
        });
    }

    // --- General Section Animations ---
    gsap.from('.main-header', { y: -100, duration: 0.8, ease: "power3.out" });
    gsap.from('#shop-status-banner', { y: -50, opacity: 0, duration: 0.6, ease: "power2.out", delay: 1.5 });

    gsap.utils.toArray('.section-title, .about-text, .contact-text, .contact-info').forEach(el => {
        gsap.from(el, { y: 50, opacity: 0, duration: 1, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" } });
    });

    gsap.utils.toArray('.product-card').forEach((card, i) => {
        gsap.from(card, { opacity: 0, y: 70, scale: 0.85, duration: 0.7, ease: "back.out(1.8)", delay: i * 0.07, scrollTrigger: { trigger: card, start: "top 90%", toggleActions: "play none none reverse" } });
    });

    // --- Sidebar & Modal Animations ---
    const cartSidebar = document.getElementById('cart-sidebar');
    const tlSidebar = gsap.timeline({ paused: true, onReverseComplete: () => gsap.set(cartSidebar, { autoAlpha: 0 }) });
    tlSidebar.fromTo(cartSidebar, { right: '-400px', autoAlpha: 0 }, { right: '0px', autoAlpha: 1, duration: 0.4, ease: "power3.out" });

    window.openCartAnimation = () => { gsap.set(cartSidebar, { autoAlpha: 1 }); tlSidebar.play(); };
    window.closeCartAnimation = () => tlSidebar.reverse();

    const checkoutModalOverlay = document.getElementById('checkout-modal-overlay');
    const modalContent = document.querySelector('.modal-content');
    const tlModal = gsap.timeline({ paused: true, onReverseComplete: () => gsap.set(checkoutModalOverlay, { autoAlpha: 0 }) });
    tlModal.to(checkoutModalOverlay, { autoAlpha: 1, duration: 0.3, ease: "power2.out" })
           .from(modalContent, { scale: 0.9, y: 50, autoAlpha: 0, duration: 0.3, ease: "back.out(1.2)" }, "<0.1");

    window.openModalAnimation = () => { gsap.set(checkoutModalOverlay, { autoAlpha: 1 }); tlModal.play(); };
    window.closeModalAnimation = () => tlModal.reverse();


    // --- Interactive Three.js Background for Hero ---
    const canvas = document.getElementById('hero-3d-canvas');
    if (canvas && typeof THREE !== 'undefined') {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);

        const mouse = new THREE.Vector2(-10, -10);
        const repelRadius = 1.5;
        const repelStrength = 0.5;

        function createCircleTexture() {
            const canvas = document.createElement('canvas');
            canvas.width = 64;
            canvas.height = 64;
            const context = canvas.getContext('2d');
            context.beginPath();
            context.arc(32, 32, 30, 0, 2 * Math.PI);
            context.fillStyle = '#ffffff';
            context.fill();
            return new THREE.CanvasTexture(canvas);
        }

        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 2000;
        const posArray = new Float32Array(particlesCount * 3);
        const originalPosArray = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 20;
            originalPosArray[i] = posArray[i];
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.05,
            map: createCircleTexture(),
            color: 0xffffff,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            sizeAttenuation: true
        });

        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);

        camera.position.z = 5;

        function onMouseMove(event) {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        }
        window.addEventListener('mousemove', onMouseMove, false);

        function animate() {
            requestAnimationFrame(animate);
            const positions = particlesGeometry.attributes.position.array;
            
            const mouseWorldPos = new THREE.Vector3(mouse.x, mouse.y, 0.5);
            mouseWorldPos.unproject(camera);
            const dir = mouseWorldPos.sub(camera.position).normalize();
            const distance = -camera.position.z / dir.z;
            const pos = camera.position.clone().add(dir.multiplyScalar(distance));
            
            for (let i = 0; i < particlesCount; i++) {
                const i3 = i * 3;
                const particlePos = new THREE.Vector3(positions[i3], positions[i3 + 1], positions[i3 + 2]);
                const originalPos = new THREE.Vector3(originalPosArray[i3], originalPosArray[i3 + 1], originalPosArray[i3 + 2]);
                
                const dist = particlePos.distanceTo(pos);

                if (dist < repelRadius) {
                    const force = (repelRadius - dist) / repelRadius;
                    const repelVec = particlePos.clone().sub(pos).normalize().multiplyScalar(force * repelStrength);
                    
                    gsap.to(particlePos, {
                        x: particlePos.x + repelVec.x,
                        y: particlePos.y + repelVec.y,
                        z: particlePos.z + repelVec.z,
                        duration: 0.3,
                        ease: "power2.out",
                        onUpdate: () => {
                            positions[i3] = particlePos.x;
                            positions[i3 + 1] = particlePos.y;
                            positions[i3 + 2] = particlePos.z;
                        }
                    });
                } else if (particlePos.distanceTo(originalPos) > 0.01) {
                    gsap.to(particlePos, {
                        x: originalPos.x,
                        y: originalPos.y,
                        z: originalPos.z,
                        duration: 1.5,
                        ease: "elastic.out(1, 0.5)",
                        onUpdate: () => {
                            positions[i3] = particlePos.x;
                            positions[i3 + 1] = particlePos.y;
                            positions[i3 + 2] = particlePos.z;
                        }
                    });
                }
            }

            particlesGeometry.attributes.position.needsUpdate = true;
            particlesMesh.rotation.y += 0.0001;
            renderer.render(scene, camera);
        }
        animate();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    } else {
        console.warn('Three.js canvas or global THREE object not found. 3D animations disabled.');
    }
});