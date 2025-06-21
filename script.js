document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('bookingForm');
  const dateInput = document.getElementById('date');
  const timeSelect = document.getElementById('time');
  const priceConfirm = document.getElementById('priceConfirm');
  const submitBtn = document.getElementById('submitBtn');

  // ตั้งค่าวันปัจจุบันเป็น min date
  const today = new Date().toISOString().split('T')[0];
  dateInput.min = today;

  // เพิ่มเวลาแบบ mock (10:00 - 21:30 ทุก 30 นาที)
  const times = Array.from({length: 25}, (_, i) => {
    const h = 10 + Math.floor(i / 2);
    const m = i % 2 === 0 ? '00' : '30';
    return `${('0'+h).slice(-2)}:${m}`;
  });
  times.forEach(t => {
    const opt = document.createElement('option');
    opt.value = t;
    opt.textContent = t;
    timeSelect.appendChild(opt);
  });

  priceConfirm.addEventListener('change', () => {
    submitBtn.disabled = !priceConfirm.checked;
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    alert('📌 ระบบกำลังอยู่ระหว่างเชื่อมต่อ Google Calendar/Sheets\n📬 ขอบคุณที่ทดสอบ!');
  });
});
