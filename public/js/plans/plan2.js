// متاح بعد يوم
if (nextAvailableAt) {
    const target = new Date(nextAvailableAt);
    function tick() {
        const diff = target - new Date();
        if (diff <= 0) { window.location.reload(); return; }
        document.getElementById('cd-hours').textContent = String(Math.floor(diff / 3600000)).padStart(2, '0');
        document.getElementById('cd-minutes').textContent = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
        document.getElementById('cd-seconds').textContent = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
    }
    tick();
    setInterval(tick, 1000);
}

document.addEventListener('DOMContentLoaded', function () {

    let currentStep = 0;
    const steps = document.querySelectorAll('.ayah-step');
    const progressBar = document.getElementById('main-progress');
    const player = document.getElementById('player');

    // AI Function للتحقق من المدخلات بدون تشكيل
    function normalize(text) {
        return text.toString().normalize("NFKD")
            .replace(/[\u064B-\u0652\u0653-\u065F\u0670\u0640]/g, "") // الحركات
            .replace(/[\u0610-\u061A\u06D6-\u06ED]/g, "") // رموز القرآن
            .replace(/[إأآٱ]/g, "ا").replace(/ؤ/g, "و")
            .replace(/ئ/g, "ي").replace(/ى/g, "ي").replace(/ة/g, "ه")
            .replace(/[^\u0621-\u064A\s]/g, "") // غير الحروف العربية
            .replace(/\s+/g, " ").trim(); // توحيد المسافات
    }

    // AI Function بيقسم النسبة المئوية لأقرب نص صحيح
    function similarity(a, b) {
        a = normalize(a);
        b = normalize(b);

        if (a === b) return 1;

        const matrix = Array.from({ length: a.length + 1 }, () => []);
        for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
        for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

        for (let i = 1; i <= a.length; i++) {
            for (let j = 1; j <= b.length; j++) {
                const cost = a[i - 1] === b[j - 1] ? 0 : 1;
                matrix[i][j] = Math.min(
                    matrix[i - 1][j] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j - 1] + cost
                );
            }
        }

        const distance = matrix[a.length][b.length];
        return 1 - distance / Math.max(a.length, b.length);
    }

    // 🔹 عرض step
    function showStep(idx) {
        steps.forEach(s => s.classList.add('d-none'));

        if (idx < steps.length) {
            steps[idx].classList.remove('d-none');
            progressBar.style.width = ((idx) / steps.length * 100) + "%";
        } else {
            document.getElementById('quiz-container').innerHTML = '';
            document.getElementById('finish-card').classList.remove('d-none');
            progressBar.style.width = "100%";
        }
    }

    if (steps.length > 0) showStep(0);

    steps.forEach((step, index) => {

        const checkBtn = step.querySelector('.check-ayah-btn');
        const input = step.querySelector('.user-input');
        const feedback = step.querySelector('.feedback');
        const toggleAudioBtn = step.querySelector('.toggle-audio-btn');
        const toggleHintBtn = step.querySelector('.toggle-hint');
        const textDisplay = step.querySelector('.ayah-text-display');

        // تشغيل الصوت لكل اية
        toggleAudioBtn.addEventListener('click', () => {
            if (player.src !== step.dataset.audio) {
                player.src = step.dataset.audio;
                player.play();
                toggleAudioBtn.querySelector('.btn-text').textContent = "إيقاف";
                toggleAudioBtn.classList.replace('btn-success', 'btn-danger');
            } else {
                if (player.paused) {
                    player.play();
                    toggleAudioBtn.querySelector('.btn-text').textContent = "إيقاف";
                    toggleAudioBtn.classList.replace('btn-success', 'btn-danger');
                } else {
                    player.pause();
                    toggleAudioBtn.querySelector('.btn-text').textContent = "استماع";
                    toggleAudioBtn.classList.replace('btn-danger', 'btn-success');
                }
            }
        });

        player.onended = () => {
            toggleAudioBtn.querySelector('.btn-text').textContent = "استماع";
            toggleAudioBtn.classList.replace('btn-danger', 'btn-success');
        };


        toggleHintBtn.addEventListener('click', () => {
            textDisplay.classList.toggle('invisible');
            toggleHintBtn.textContent = textDisplay.classList.contains('invisible')
                ? "إظهار الآية للمراجعة"
                : "إخفاء الآية";
        });

        checkBtn.addEventListener('click', async () => {

            const original = step.dataset.original;
            const userText = input.value;

            const score = similarity(userText, original);
            const percent = Math.round(score * 100);

            if (score >= 0.75 && userText.trim() !== "") {

                player.pause();

                feedback.textContent = `صحيح`;
                feedback.className = "feedback mt-3 text-success";

                const planId = window.location.pathname.split('/').pop();
                try {
                    await fetch(`/plan/${planId}/save-progress`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ ayahIndex: index + 1 })
                    });
                } catch (e) {
                    console.error("Error saving progress", e);
                }

                setTimeout(() => {
                    currentStep++;
                    if (currentStep >= steps.length) {
                        window.location.reload();
                    } else {
                        showStep(currentStep);
                    }
                }, 800);

            } else {
                feedback.textContent = `غير مطابق`;
                feedback.className = "feedback mt-3 text-danger";
            }
        });

    });

    document.getElementById('final-submit')?.addEventListener('click', async () => {

        const planId = window.location.pathname.split('/').pop();

        try {
            const response = await fetch(`/plan/${planId}/progress`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completed: true })
            });

            if (response.ok) window.location.href = '/dashboard';

        } catch (e) {
            console.error("Error saving progress");
        }
    });

});