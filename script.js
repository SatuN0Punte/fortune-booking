const form = document.getElementById('bookingForm');
const loader = document.getElementById('loader');
const confirmation = document.getElementById('confirmation');
const confirmDetails = document.getElementById('confirmDetails');
const bookAgainBtn = document.getElementById('bookAgainBtn');
const timeSelect = document.getElementById('time');
const dateInput = document.getElementById('date');
const submitBtn = document.getElementById('submitBtn');
const nameInput = document.getElementById('name');
const phoneInput = document.getElementById('phone');

// ฟังก์ชันตรวจสอบฟอร์มครบถ้วน
function checkFormValid() {
  const nameValid = nameInput.value.trim() !== '';
  const phoneValid = /^[0-9]{9,10}$/.test(phoneInput.value);
  const dateValid = dateInput.value !== '';
  const timeValid = timeSelect.value !== '';

  submitBtn.disabled = !(nameValid && phoneValid && dateValid && timeValid);
}

// event listeners ทุก input/เลือกเวลาตรวจสอบฟอร์ม
[nameInput, phoneInput, dateInput, timeSelect].forEach(el => {
  el.addEventListener('input', checkFormValid);
  el.addEventListener('change', checkFormValid);
});

// โหลดเวลาว่างจำลอง (แก้เป็นเรียก API จริงตามต้องการ)
dateInput.addEventListener('change', async () => {
  loader.classList.add('visible');
  timeSelect.innerHTML = '<option disabled>กำลังโหลดเวลาว่าง...</option>';
  submitBtn.disabled = true;

  // ตัวอย่างจำลองเวลาว่าง
  setTimeout(() => {
    loader.classList.remove('visible');
    timeSelect.innerHTML = `
      <option value="" disabled selected>เลือกเวลาที่ว่าง</option>
      <option value="09:30">09:30</option>
      <option value="10:00">10:00</option>
      <option value="10:30">10:30</option>
      <option value="11:00">11:00</option>
      <option value="11:30">11:30</option>
    `;
    checkFormValid(); // ตรวจสอบฟอร์มอีกครั้งหลังโหลดเวลาว่าง
  }, 1000);
});

// ส่งข้อมูลจองคิว (แก้เป็นเรียก API จริง)
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // ถ้าปุ่มถูก disable หรือฟอร์มไม่ครบ หยุดไม่ส่งข้อมูล
  if (submitBtn.disabled) {
    alert('กรุณากรอกข้อมูลให้ครบถ้วนก่อนจองคิว');
    return;
  }

  submitBtn.disabled = true;
  loader.classList.add('visible');

  // ตัวอย่างจำลองส่งข้อมูล
  setTimeout(() => {
    loader.classList.remove('visible');
    form.style.display = 'none';
    confirmation.classList.add('visible');
    confirmDetails.textContent = 
      `ชื่อ: ${nameInput.value}\n` +
      `เบอร์โทร: ${phoneInput.value}\n` +
      `วันที่: ${dateInput.value}\n` +
      `เวลา: ${timeSelect.value}`;
  }, 1500);
});

bookAgainBtn.addEventListener('click', () => {
  confirmation.classList.remove('visible');
  form.style.display = '';
  form.reset();
  timeSelect.innerHTML = '<option value="" disabled selected>เลือกเวลาที่ว่าง</option>';
  submitBtn.disabled = true;
});

// เรียกตรวจสอบสถานะฟอร์มตอนโหลดหน้า
checkFormValid();

