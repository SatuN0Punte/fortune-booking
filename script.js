const form = document.getElementById('bookingForm');
const loader = document.getElementById('loader');
const confirmation = document.getElementById('confirmation');
const confirmDetails = document.getElementById('confirmDetails');
const bookAgainBtn = document.getElementById('bookAgainBtn');
const timeSelect = document.getElementById('time');
const dateInput = document.getElementById('date');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  // TODO: เรียก API /bookQueue ที่นี่ พร้อมแสดง loader
  loader.classList.remove('hidden');
  try {
    // await callBookQueueAPI(...)
    // แสดงผล confirmation
  } catch (error) {
    alert('เกิดข้อผิดพลาดในการจองคิว กรุณาลองใหม่');
  } finally {
    loader.classList.add('hidden');
  }
});

bookAgainBtn.addEventListener('click', () => {
  confirmation.classList.add('hidden');
  form.classList.remove('hidden');
  form.reset();
});

// TODO: เมื่อเปลี่ยนวันที่ ให้เรียก API /checkAvailable เพื่ออัพเดตเวลาว่างใน select
dateInput.addEventListener('change', async () => {
  // loader แสดง
  loader.classList.remove('hidden');
  timeSelect.innerHTML = '<option disabled selected>กำลังโหลดเวลาว่าง...</option>';
  // ตัวอย่างฟังก์ชันสมมติ
  /*
  const availableTimes = await fetchAvailableTimes(dateInput.value);
  timeSelect.innerHTML = '<option disabled selected>เลือกเวลาที่ว่าง</option>';
  availableTimes.forEach(t => {
    const opt = document.createElement('option');
    opt.value = t;
    opt.textContent = t;
    timeSelect.appendChild(opt);
  });
  */
  loader.classList.add('hidden');
});
