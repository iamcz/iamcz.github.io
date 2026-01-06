// Animated background circle with figure-8 motion
class AnimatedBackground {
    static LISSAJOUS_COEFFICIENTS = [
        { A: 2, B: 1 },
        { A: 3, B: 2 },
        { A: 4, B: 3 },
        { A: 5, B: 4 },
        { A: 6, B: 5 },
        { A: 7, B: 6 },
    ]

    constructor(circleElement) {
        this.circle = circleElement;
        this.time = Math.random() * 10 * Math.PI;
        this.speed = 0.0001 + Math.random() * 0.0001; // Animation speed
        this.fadeOffset = Math.random() * 2 * Math.PI;
        this.setPositions();
        const { LISSAJOUS_COEFFICIENTS } = AnimatedBackground;
        const lissajousCoefficients =
            LISSAJOUS_COEFFICIENTS[Math.floor(Math.random() * LISSAJOUS_COEFFICIENTS.length)]
        this.lissajousCoefficient = lissajousCoefficients.A / lissajousCoefficients.B;

        this.init();
    }

    init() {
        this.updatePosition();
        this.handleResize();
    }

    updatePosition() {
        // Lissajous curve for figure-8 pattern
        // Using 2:1 frequency ratio for horizontal:vertical
        const t = this.time;

        // Calculate position using parametric equations
        const x = this.centerX + this.radiusX * Math.sin(this.lissajousCoefficient * t);
        const y = this.centerY + this.radiusY * Math.sin(t);

        // Calculate color interpolation (black to white and back)
        const colorValue = Math.floor(236 + 16 * Math.sin(t + this.fadeOffset));
        const color = `rgb(${colorValue}, ${colorValue}, ${colorValue})`;

        // Apply transformation
        this.circle.style.transform = `translate(${x}px, ${y}px)`;
        this.circle.style.background = `radial-gradient(circle, ${color}, transparent)`;
        // this.circle.style.background = `${color}`;

        // Increment time
        this.time += this.speed * 16; // Approximately 60fps

        // Continue animation
        requestAnimationFrame(() => this.updatePosition());
    }

    handleResize() {
        window.addEventListener('resize', this.setPositions);
    }

    setPositions() {
        this.centerX = window.innerWidth / 2;
        this.centerY = window.innerHeight / 2;
        this.radiusX = window.innerWidth * 0.4;
        this.radiusY = window.innerHeight * 0.4;
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    const circleElements = document.querySelectorAll('.animated-circle')
    for (let i = 0; i < circleElements.length; i++) {
        new AnimatedBackground(circleElements[i]);
    }
});
