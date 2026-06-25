// ============================================
// ALKIMIYA UZ - ADVANCED PARTICLE SYSTEM
// ============================================

class ParticleSystem {
    constructor() {
        this.particles = [];
        this.container = null;
        this.init();
    }

    init() {
        this.container = document.createElement('div');
        this.container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;';
        document.body.appendChild(this.container);
    }

    // Confetti - bayram
    confetti(x, y, count = 50) {
        const colors = ['#6c5ce7', '#00cec9', '#fd79a8', '#fdcb6e', '#00b894', '#e17055', '#a29bfe'];
        const shapes = ['circle', 'square', 'triangle'];

        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            const shape = shapes[Math.floor(Math.random() * shapes.length)];
            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = Math.random() * 10 + 5;

            let shapeStyle = '';
            if (shape === 'circle') {
                shapeStyle = `border-radius:50%;background:${color};`;
            } else if (shape === 'square') {
                shapeStyle = `background:${color};`;
            } else {
                particle.style.width = '0';
                particle.style.height = '0';
                particle.style.borderLeft = `${size/2}px solid transparent`;
                particle.style.borderRight = `${size/2}px solid transparent`;
                particle.style.borderBottom = `${size}px solid ${color}`;
                shapeStyle = '';
            }

            particle.style.cssText = `
                position:fixed;
                left:${x}px;top:${y}px;
                width:${size}px;height:${size}px;
                ${shapeStyle}
                pointer-events:none;
                transition:none;
            `;

            this.container.appendChild(particle);

            const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
            const velocity = 150 + Math.random() * 200;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity - 100;
            const rotation = Math.random() * 720 - 360;
            const lifetime = 1000 + Math.random() * 1000;

            this.animateParticle(particle, x, y, vx, vy, rotation, lifetime);
        }
    }

    // Sparkle - yulduzcha
    sparkle(x, y, count = 30) {
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            const size = Math.random() * 6 + 2;
            const hue = Math.random() * 60 + 40;

            particle.style.cssText = `
                position:fixed;
                left:${x}px;top:${y}px;
                width:${size}px;height:${size}px;
                background:hsl(${hue}, 100%, 70%);
                border-radius:50%;
                box-shadow:0 0 ${size*2}px hsl(${hue}, 100%, 70%);
                pointer-events:none;
            `;

            this.container.appendChild(particle);

            const angle = Math.random() * Math.PI * 2;
            const velocity = 50 + Math.random() * 100;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            const lifetime = 500 + Math.random() * 500;

            this.animateParticle(particle, x, y, vx, vy, 0, lifetime, true);
        }
    }

    // Magic trail - sehrli iz
    magicTrail(x1, y1, x2, y2) {
        const steps = 20;
        for (let i = 0; i < steps; i++) {
            setTimeout(() => {
                const t = i / steps;
                const x = x1 + (x2 - x1) * t;
                const y = y1 + (y2 - y1) * t;

                const particle = document.createElement('div');
                const size = 4 + Math.random() * 4;
                const hue = 250 + Math.random() * 40;

                particle.style.cssText = `
                    position:fixed;
                    left:${x}px;top:${y}px;
                    width:${size}px;height:${size}px;
                    background:hsl(${hue}, 80%, 60%);
                    border-radius:50%;
                    box-shadow:0 0 ${size*3}px hsl(${hue}, 80%, 60%);
                    pointer-events:none;
                    transition: all 0.5s ease-out;
                `;

                this.container.appendChild(particle);

                setTimeout(() => {
                    particle.style.opacity = '0';
                    particle.style.transform = `scale(0) translateY(-20px)`;
                    setTimeout(() => particle.remove(), 500);
                }, 100);
            }, i * 30);
        }
    }

    // Shockwave - to'lqin
    shockwave(x, y) {
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const wave = document.createElement('div');
                wave.style.cssText = `
                    position:fixed;
                    left:${x}px;top:${y}px;
                    width:10px;height:10px;
                    border:2px solid rgba(108, 92, 231, 0.8);
                    border-radius:50%;
                    transform:translate(-50%,-50%);
                    pointer-events:none;
                    animation:shockwaveExpand 0.8s ease-out forwards;
                `;
                this.container.appendChild(wave);
                setTimeout(() => wave.remove(), 800);
            }, i * 100);
        }
    }

    // Floating emoji
    floatingEmoji(x, y, emojis = ['✨', '⭐', '💫', '🌟']) {
        for (let i = 0; i < 6; i++) {
            const emoji = document.createElement('div');
            const em = emojis[Math.floor(Math.random() * emojis.length)];
            emoji.textContent = em;
            emoji.style.cssText = `
                position:fixed;
                left:${x + (Math.random()-0.5)*60}px;
                top:${y}px;
                font-size:${20 + Math.random()*20}px;
                pointer-events:none;
                animation:floatUp 1.5s ease-out forwards;
            `;
            this.container.appendChild(emoji);
            setTimeout(() => emoji.remove(), 1500);
        }
    }

    // Screen shake
    screenShake(intensity = 5, duration = 300) {
        const el = document.querySelector('.game-container') || document.body;
        const startTime = Date.now();

        const shake = () => {
            const elapsed = Date.now() - startTime;
            if (elapsed >= duration) {
                el.style.transform = '';
                return;
            }
            const progress = elapsed / duration;
            const currentIntensity = intensity * (1 - progress);
            const x = (Math.random() - 0.5) * currentIntensity * 2;
            const y = (Math.random() - 0.5) * currentIntensity * 2;
            el.style.transform = `translate(${x}px, ${y}px)`;
            requestAnimationFrame(shake);
        };
        shake();
    }

    // Flash effect
    flash(color = 'rgba(255,255,255,0.3)') {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position:fixed;top:0;left:0;width:100%;height:100%;
            background:${color};pointer-events:none;z-index:9998;
            animation:flashFade 0.3s ease-out forwards;
        `;
        this.container.appendChild(overlay);
        setTimeout(() => overlay.remove(), 300);
    }

    // Animate particle
    animateParticle(el, startX, startY, vx, vy, rotation, lifetime, fade = false) {
        const startTime = Date.now();
        const gravity = 300;

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / lifetime;

            if (progress >= 1) {
                el.remove();
                return;
            }

            const x = startX + vx * progress;
            const y = startY + vy * progress + 0.5 * gravity * progress * progress;
            const rotate = rotation * progress;
            const opacity = fade ? 1 - progress : 1;
            const scale = fade ? 1 - progress * 0.5 : 1;

            el.style.transform = `translate(${x - startX}px, ${y - startY}px) rotate(${rotate}deg) scale(${scale})`;
            el.style.opacity = opacity;

            requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }
}

// CSS animatsiyalar qo'shish
const style = document.createElement('style');
style.textContent = `
    @keyframes shockwaveExpand {
        0% { width: 10px; height: 10px; opacity: 1; }
        100% { width: 200px; height: 200px; opacity: 0; margin: -100px; }
    }
    @keyframes floatUp {
        0% { transform: translateY(0) scale(1); opacity: 1; }
        100% { transform: translateY(-100px) scale(0.5); opacity: 0; }
    }
    @keyframes flashFade {
        0% { opacity: 1; }
        100% { opacity: 0; }
    }
    @keyframes pulseGlow {
        0%, 100% { box-shadow: 0 0 5px currentColor; }
        50% { box-shadow: 0 0 25px currentColor, 0 0 50px currentColor; }
    }
    @keyframes spinSlow {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    @keyframes breathe {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
    @keyframes slideInLeft {
        from { transform: translateX(-100px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideInRight {
        from { transform: translateX(100px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideInUp {
        from { transform: translateY(50px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    @keyframes bounceIn {
        0% { transform: scale(0); }
        50% { transform: scale(1.2); }
        70% { transform: scale(0.9); }
        100% { transform: scale(1); }
    }
    @keyframes wobble {
        0%, 100% { transform: rotate(0deg); }
        25% { transform: rotate(-5deg); }
        75% { transform: rotate(5deg); }
    }
    @keyframes neonPulse {
        0%, 100% { text-shadow: 0 0 5px currentColor, 0 0 10px currentColor; }
        50% { text-shadow: 0 0 20px currentColor, 0 0 40px currentColor, 0 0 60px currentColor; }
    }
`;
document.head.appendChild(style);

window.particles = new ParticleSystem();
