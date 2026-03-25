document.addEventListener('DOMContentLoaded', function () {
    const surahSelect = document.getElementById('surahSelect');
    const startInput = document.querySelector('input[name="startAyah"]');
    const endInput = document.querySelector('input[name="endAyah"]');
    const dailyInput = document.querySelector('input[name="dailyCount"]');
    const planForm = document.getElementById('planForm');
    const ayahHint = document.getElementById('ayahHint');

    let maxAyahs = 0;

    // عند تغيير السورة ملئ الاختيارات بناء علي السورة المختارة
    surahSelect.addEventListener('change', function () {
        const selectedOption = this.options[this.selectedIndex];
        maxAyahs = parseInt(selectedOption.dataset.ayahs);

        startInput.value = 1;
        endInput.value = maxAyahs;

        startInput.max = maxAyahs;
        endInput.max = maxAyahs;

        ayahHint.textContent = `عدد آيات السورة: ${maxAyahs}`;
        ayahHint.classList.remove('d-none');
    });

    startInput.addEventListener('input', function () {
        const startVal = parseInt(this.value);
        endInput.min = startVal;
        if (parseInt(endInput.value) < startVal) {
            endInput.value = startVal;
        }
    });

    // التحقق من البيانات قبل الارسال
    planForm.addEventListener('submit', function (e) {
        const start = parseInt(startInput.value);
        const end = parseInt(endInput.value);
        const daily = parseInt(dailyInput.value);

        if (end > maxAyahs) {
            e.preventDefault();
            alert(`خطأ: السورة تحتوي على ${maxAyahs} آية فقط.`);
            return;
        }

        if (end < start) {
            e.preventDefault();
            alert('خطأ: آية النهاية لا يمكن أن تكون أصغر من آية البداية.');
            return;
        }

        if (daily <= 0) {
            e.preventDefault();
            alert('من فضلك أدخل مقدار يومي صحيح.');
            return;
        }
    });
});