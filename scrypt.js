document.addEventListener('DOMContentLoaded', () => {
    const mainPage = document.getElementById('main-page');
    const secretPage = document.getElementById('secret-page');
    const heartsButton = document.getElementById('hearts-button');
    const nextPageBtn = document.getElementById('next-page-btn');
    const backBtn = document.getElementById('back-btn');
    const canvas = document.getElementById('hearts-canvas');
    const ctx = canvas.getContext('2d');

    let isAnimating = false;

    // Ajustar tamanho do canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Navegação
    nextPageBtn.addEventListener('click', () => {
        mainPage.classList.add('hidden');
        secretPage.classList.remove('hidden');
    });

    backBtn.addEventListener('click', () => {
        secretPage.classList.add('hidden');
        mainPage.classList.remove('hidden');
    });

    // Desenhar um coração
    function drawHeart(x, y, size, opacity) {
        ctx.save();
        ctx.translate(x, y);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.lineWidth = 2;

        const s = size;
        ctx.beginPath();
        ctx.moveTo(0, -s / 2);
        ctx.bezierCurveTo(-s / 2, -s, -s, -s / 2, -s / 2, 0);
        ctx.bezierCurveTo(-s, s / 2, 0, s, 0, s);
        ctx.bezierCurveTo(0, s, s, s / 2, s / 2, 0);
        ctx.bezierCurveTo(s, -s / 2, s / 2, -s, 0, -s / 2);
        ctx.fill();
        ctx.stroke();

        ctx.restore();
    }

    // Efeito de Corações - Versão Otimizada
    heartsButton.addEventListener('click', () => {
        if (isAnimating) return;

        isAnimating = true;
        heartsButton.disabled = true;

        const hearts = [];
        const numHearts = 15;
        let animationFrame = null;
        let startTime = Date.now();
        const duration = 1500; // 1.5 segundos para animar os corações

        // Criar corações em posições aleatórias
        for (let i = 0; i < numHearts; i++) {
            hearts.push({
                x: Math.random() * canvas.width,
                y: canvas.height + 50,
                vx: (Math.random() - 0.5) * 3,
                vy: -2 - Math.random() * 3,
                size: 15 + Math.random() * 15,
                life: 1,
                decay: 0.005 + Math.random() * 0.005
            });
        }

        function drawHearts() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            let allDead = true;

            hearts.forEach(heart => {
                if (heart.life > 0) {
                    allDead = false;

                    // Atualizar posição
                    heart.x += heart.vx;
                    heart.y += heart.vy;
                    heart.vy += 0.1; // Gravidade suave

                    // Reduzir vida
                    heart.life -= heart.decay;

                    // Desenhar coração
                    drawHeart(heart.x, heart.y, heart.size, Math.max(0, heart.life));
                }
            });

            if (!allDead) {
                animationFrame = requestAnimationFrame(drawHearts);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                isAnimating = false;
                heartsButton.disabled = false;
            }
        }

        drawHearts();
    });
});