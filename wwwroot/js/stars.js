document.addEventListener('DOMContentLoaded', function () {
    // --- Parallax stars animation + interactive rays ---
    (function() {
        const starsBg = document.querySelector('.stars-bg');
        if (!starsBg) return;
        const starCount = 120;
        let mouseX = 0, mouseY = 0;
        let targetX = 0, targetY = 0;
        const parallaxStrength = 30;
        const stars = [];
        // Создаём звёзды с сохранением базовых позиций и скоростью
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            const size = Math.random() * 2 + 1;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.position = 'absolute';
            const top = Math.random() * 100;
            const left = Math.random() * 100;
            star.dataset.baseTop = top;
            star.dataset.baseLeft = left;
            star.dataset.speedX = (Math.random() - 0.5) * 0.04; // скорость движения
            star.dataset.speedY = (Math.random() - 0.5) * 0.04;
            star.style.top = `${top}%`;
            star.style.left = `${left}%`;
            star.style.background = 'white';
            star.style.borderRadius = '50%';
            star.style.opacity = Math.random() * 0.7 + 0.3;
            star.style.boxShadow = `0 0 ${Math.random() * 8 + 2}px #fff`;
            starsBg.appendChild(star);
            stars.push(star);
        }
        // SVG слой для лучей
        const raysSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        raysSvg.setAttribute('class', 'stars-rays-svg');
        raysSvg.style.position = 'fixed';
        raysSvg.style.top = '0';
        raysSvg.style.left = '0';
        raysSvg.style.width = '100vw';
        raysSvg.style.height = '100vh';
        raysSvg.style.pointerEvents = 'none';
        raysSvg.style.zIndex = '1';
        starsBg.appendChild(raysSvg);
        const rays = [];
        for (let i = 0; i < starCount; i++) {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('stroke', '#00eaff');
            line.setAttribute('stroke-width', '1.1');
            line.setAttribute('opacity', '0.18');
            raysSvg.appendChild(line);
            rays.push(line);
        }
        // Parallax + движение + интерактивные лучи
        function animateStars() {
            mouseX += (targetX - mouseX) * 0.08;
            mouseY += (targetY - mouseY) * 0.08;
            const w = window.innerWidth;
            const h = window.innerHeight;
            const mouseAbsX = w/2 + mouseX * w/2;
            const mouseAbsY = h/2 + mouseY * h/2;
            for (let i = 0; i < stars.length; i++) {
                const star = stars[i];
                // Движение звезды
                let baseTop = parseFloat(star.dataset.baseTop);
                let baseLeft = parseFloat(star.dataset.baseLeft);
                let speedX = parseFloat(star.dataset.speedX);
                let speedY = parseFloat(star.dataset.speedY);
                baseTop += speedY;
                baseLeft += speedX;
                // Зацикливание
                if (baseTop > 100) baseTop = 0;
                if (baseTop < 0) baseTop = 100;
                if (baseLeft > 100) baseLeft = 0;
                if (baseLeft < 0) baseLeft = 100;
                star.dataset.baseTop = baseTop;
                star.dataset.baseLeft = baseLeft;
                const depth = 1 + (parseFloat(star.style.width) - 1) / 2;
                const offsetX = mouseX * parallaxStrength / depth;
                const offsetY = mouseY * parallaxStrength / depth;
                // Позиция звезды
                const starX = w * baseLeft / 100 + offsetX;
                const starY = h * baseTop / 100 + offsetY;
                star.style.left = `calc(${baseLeft}% + ${offsetX}px)`;
                star.style.top = `calc(${baseTop}% + ${offsetY}px)`;
                // Луч только если мышка рядом (дистанция < 120px)
                const dist = Math.hypot(mouseAbsX - starX, mouseAbsY - starY);
                if (dist < 120) {
                    rays[i].setAttribute('x1', starX);
                    rays[i].setAttribute('y1', starY);
                    rays[i].setAttribute('x2', mouseAbsX);
                    rays[i].setAttribute('y2', mouseAbsY);
                    rays[i].setAttribute('opacity', Math.max(0.18, 1 - dist/120));
                } else {
                    rays[i].setAttribute('opacity', '0');
                }
            }
            requestAnimationFrame(animateStars);
        }
        // Parallax effect
        let lastMove = Date.now();
        window.addEventListener('mousemove', function(e) {
            const w = window.innerWidth;
            const h = window.innerHeight;
            targetX = ((e.clientX / w) - 0.5) * 2;
            targetY = ((e.clientY / h) - 0.5) * 2;
            lastMove = Date.now();
        });
        animateStars();
    })();
    // --- Пасхалка: анимация созвездия "Кот-сердце" ---
    // Координаты для кота и для сердечка (в процентах экрана)
    const catConstellation = [
        {top: 20, left: 30},
        {top: 25, left: 35},
        {top: 35, left: 32},
        {top: 45, left: 40},
        {top: 55, left: 50},
        {top: 60, left: 60},
        {top: 50, left: 65}
    ];
    // Сердце (7 точек, примерно)
    const heartConstellation = [
        {top: 30, left: 35},
        {top: 25, left: 40},
        {top: 30, left: 45},
        {top: 40, left: 40},
        {top: 50, left: 37},
        {top: 50, left: 43},
        {top: 40, left: 40}
    ];
    // Добавим звёзды созвездия
    const constellationStars = [];
    for (let i = 0; i < catConstellation.length; i++) {
        const s = document.createElement('div');
        s.className = 'star cat-star';
        s.style.width = '8px';
        s.style.height = '8px';
        s.style.position = 'absolute';
        s.style.top = catConstellation[i].top + '%';
        s.style.left = catConstellation[i].left + '%';
        s.style.background = '#00eaff';
        s.style.borderRadius = '50%';
        s.style.opacity = 1;
        s.style.boxShadow = '0 0 32px #00eaff, 0 0 16px #fff';
        s.style.zIndex = 10;
        s.style.border = '2px solid #fff';
        starsBg.appendChild(s);
        constellationStars.push(s);
    }
    // SVG для линий
    const constellationSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    constellationSvg.setAttribute('class', 'stars-rays-svg cat-constellation-svg');
    constellationSvg.style.zIndex = '11';
    starsBg.appendChild(constellationSvg);
    const lines = [];
    for (let i = 0; i < catConstellation.length - 1; i++) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('stroke', '#00eaff');
        line.setAttribute('stroke-width', '2.2');
        line.setAttribute('opacity', '0.7');
        constellationSvg.appendChild(line);
        lines.push(line);
    }
    // Анимация перехода кота в сердце
    let t = 0;
    let forward = true;
    function animateConstellation() {
        // t: 0..1
        t += (forward ? 0.003 : -0.003);
        if (t > 1) { t = 1; forward = false; setTimeout(()=>{forward=true;}, 2000); }
        if (t < 0) { t = 0; forward = true; setTimeout(()=>{forward=false;}, 2000); }
        for (let i = 0; i < constellationStars.length; i++) {
            const from = catConstellation[i];
            const to = heartConstellation[i];
            const top = from.top + (to.top - from.top) * t;
            const left = from.left + (to.left - from.left) * t;
            constellationStars[i].style.top = top + '%';
            constellationStars[i].style.left = left + '%';
        }
        for (let i = 0; i < lines.length; i++) {
            const s1 = constellationStars[i];
            const s2 = constellationStars[i+1];
            const x1 = parseFloat(s1.style.left) / 100 * window.innerWidth;
            const y1 = parseFloat(s1.style.top) / 100 * window.innerHeight;
            const x2 = parseFloat(s2.style.left) / 100 * window.innerWidth;
            const y2 = parseFloat(s2.style.top) / 100 * window.innerHeight;
            lines[i].setAttribute('x1', x1);
            lines[i].setAttribute('y1', y1);
            lines[i].setAttribute('x2', x2);
            lines[i].setAttribute('y2', y2);
        }
        requestAnimationFrame(animateConstellation);
    }
    animateConstellation();
});
