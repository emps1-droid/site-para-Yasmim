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

    // Desenhar um coração
    function drawHeart(x, y, size, opacity) {
        ctx.save();
        ctx.translate(x, y);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.lineWidth = 1;

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

    // Efeito de Corações - Versão Centralizada
    heartsButton.addEventListener('click', () => {
        if (isAnimating) return;

        isAnimating = true;
        heartsButton.disabled = true;

        const hearts = [];
        const numHearts = 30; // Mais corações para um efeito melhor
        let animationFrame = null;
        
        // Ponto central da tela (onde está a foto)
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        // Criar corações saindo do centro
        for (let i = 0; i < numHearts; i++) {
            hearts.push({
                x: centerX,
                y: centerY,
                vx: (Math.random() - 0.5) * 8, // Velocidade horizontal aleatória
                vy: (Math.random() - 0.5) * 8, // Velocidade vertical aleatória
                size: 10 + Math.random() * 20,
                life: 1.0,
                decay: 0.01 + Math.random() * 0.02
            });
        }

        function drawHearts() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            let allDead = true;

            hearts.forEach(heart => {
                if (heart.life > 0) {
                    allDead = false;

                    // Atualizar posição
                    heart.x += heart.vx;
                    heart.y += heart.vy;
                    
                    // Gravidade bem leve para eles caírem devagar
                    heart.vy += 0.05; 

                    // Reduzir vida (transparência)
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

    // Navegação entre páginas
    nextPageBtn.addEventListener('click', () => {
        mainPage.classList.add('hidden');
        secretPage.classList.remove('hidden');
    });

    backBtn.addEventListener('click', () => {
        secretPage.classList.add('hidden');
        mainPage.classList.remove('hidden');
    });
});
