function checkLocks() {
    // نبحث عن الأزرار المقفلة التي تحتوي على وقت فك القفل (data-unlock)
    const lockedBtns = document.querySelectorAll('.locked-btn');
    if (lockedBtns.length === 0) return;

    const now = new Date().getTime();
    let shouldReload = false;

    lockedBtns.forEach(btn => {
        const unlockTime = btn.getAttribute('data-unlock-ts'); // افترض أنك تضع الوقت هنا
        if (unlockTime && now >= unlockTime) {
            shouldReload = true;
        }
    });

    if (shouldReload) window.location.reload();
}

setInterval(checkLocks, 60000);

// Question of the Day
const now = new Date();
const startYear = new Date(now.getFullYear(), 0, 0);
const dayOfYear = Math.floor((now - startYear) / (1000 * 60 * 60 * 24));
const storageKey = `question_${dayOfYear}`;

window.addEventListener('load', function () {
    const saved = localStorage.getItem(storageKey);
    const card = document.getElementById('question-card');

    if (saved && card) {
        const { selected, correct } = JSON.parse(saved);
        restoreAnswer(selected, correct);

        // إذا كان قد أجاب بالفعل، قد ترغب في إخفاء الكارد فورا أو تركه للمراجعة
        card.style.display = "none";
    }
});

function answerQuestion(btn, selectedIndex, correctIndex) {
    const card = document.getElementById('question-card');
    if (!card) return;

    localStorage.setItem(storageKey, JSON.stringify({
        selected: selectedIndex,
        correct: correctIndex
    }));

    restoreAnswer(selectedIndex, correctIndex);

    س
    setTimeout(() => {
        card.style.transition = "opacity 0.8s ease, transform 0.8s ease";
        card.style.opacity = "0";
        card.style.transform = "scale(0.9)";
        setTimeout(() => {
            card.style.display = "none";
            const title = document.getElementById('question-title');
            if (title) title.style.display = "none";
        }, 800);
    }, 2500);
}

function restoreAnswer(selectedIndex, correctIndex) {
    const card = document.getElementById('question-card');
    if (!card) return;

    const resultDiv = document.getElementById('q-result');
    const allButtons = card.querySelectorAll('.option-btn');

    if (!allButtons[selectedIndex] || !allButtons[correctIndex]) return;

    allButtons.forEach(b => b.disabled = true);
    allButtons[correctIndex].classList.add('correct');

    if (selectedIndex === correctIndex) {
        resultDiv.innerHTML = "إجابة صحيحة!";
        resultDiv.className = "question-result success";
    } else {
        allButtons[selectedIndex].classList.add('wrong');
        resultDiv.innerHTML = "إجابة خاطئة.";
        resultDiv.className = "question-result fail";
    }

    resultDiv.style.display = 'block';
}

// Athkar
function startDhikrTimer() {
    const timerEl = document.getElementById('dhikr-timer');
    if (!timerEl) return;

    function update() {
        const d = new Date();
        const minLeft = 59 - d.getMinutes();
        const secLeft = 59 - d.getSeconds();
        timerEl.textContent = `يتغير بعد: ${String(minLeft).padStart(2, '0')}:${String(secLeft).padStart(2, '0')}`;
    }

    update();
    setInterval(update, 1000);

    const d = new Date();
    const msToNextHour = (3600 - (d.getMinutes() * 60 + d.getSeconds())) * 1000;
    setTimeout(() => window.location.reload(), msToNextHour);
}

startDhikrTimer();


document.addEventListener('DOMContentLoaded', function () {
    const alerts = document.querySelectorAll('.alert');

    alerts.forEach(function (alert) {
        setTimeout(function () {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }, 2000);
    });
});


function toggleSection(contentId, header) {
    const content = document.getElementById(contentId);
    const icon = header.querySelector('.toggle-icon');
    const isHidden = content.style.display === 'none';

    content.style.display = isHidden ? 'block' : 'none';
    icon.textContent = isHidden ? '−' : '+';
}
function copyDhikr() {
    const text = document.querySelector('#athkar-content h4').innerText;
    navigator.clipboard.writeText(text);
    // alert("تم نسخ الذكر");
}

function toggleSection(id, el) {
    const content = document.getElementById(id);
    const icon = el.querySelector('.toggle-icon');

    if (content.style.display === "none") {
        content.style.display = "block";
        icon.textContent = "−";
    } else {
        content.style.display = "none";
        icon.textContent = "+";
    }
}

function checkAnswer(btn, selected, correct) {
    const buttons = document.querySelectorAll('.option-btn');
    const feedback = document.getElementById('question-feedback');
    const explanation = document.getElementById('question-explanation');

    buttons.forEach(b => b.disabled = true);

    if (selected === correct) {
        btn.classList.remove('btn-outline-dark');
        btn.classList.add('btn-success');

        feedback.textContent = "إجابة صحيحة";
        feedback.className = "mt-3 fw-bold text-success text-center";

    } else {
        btn.classList.remove('btn-outline-dark');
        btn.classList.add('btn-danger');

        buttons[correct].classList.remove('btn-outline-dark');
        buttons[correct].classList.add('btn-success');

        feedback.textContent = "إجابة خاطئة";
        feedback.className = "mt-3 fw-bold text-danger text-center";
    }

    explanation.classList.remove('d-none');
}