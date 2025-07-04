const FORM = document.getElementById('bookingForm');
const LOADER = document.getElementById('loader');
const CONFIRM = document.getElementById('confirmation');
const CONFIRM_DETAILS = document.getElementById('confirmDetails');
const BOOK_AGAIN_BTN = document.getElementById('bookAgainBtn');
const TIME_SELECT = document.getElementById('time');
const DATE_INPUT = document.getElementById('date');
const SUBMIT_BTN = document.getElementById('submitBtn');
const NAME_INPUT = document.getElementById('name');
const PHONE_INPUT = document.getElementById('phone');

const API_BASE_URL = 'https://script.google.com/macros/s/YOUR_DEPLOY_ID/exec';

// เช็คฟอร์มครบถ้วน
function checkFormValid() {
  const nameValid = NAME_INPUT.value.trim() !== '';
  const phoneValid = /^[0-9]{9,10}$/.test(PHONE_INPUT.value);
  const dateValid = DATE_INPUT.value !== '';
  const timeValid = TIME_SELECT.value !== '';

  SUBMIT_BTN.disabled = !(nameValid && phoneValid && dateValid && timeValid);
}

// โหลดเวลาว่างจริงจาก backend
async function loadAvailableSlots(date) {
  LOADER.classList.add('visible');
  TIME_SELECT.innerHTML = '<option disabled>กำลังโหลดเวลาว่าง...</option>';

  try {
    const res = await fetch(API_BASE_URL + '?path=checkAvailable', {
      method: 'POST',
      body: JSON.stringify({ date }),
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();

    if (data.slots && data.slots.length) {
      TIME_SELECT.innerHTML = '<option value="" disabled selected>เลือกเวลาที่ว่าง</option>';
      data.slots.forEach(slot => {
        const option = document.createElement('option');
        option.value = slot;
        option.textContent = slot;
        TIME_SELECT.appendChild(option);
      });
    } else {
      TIME_SELECT.innerHTML = '<option disabled>ไม่มีเวลาว่าง</option>';
    }
  } catch (err) {
    TIME_SELECT.innerHTML = '<option disabled>โหลดเวลาว่างล้มเหลว</option>';
    console.error(err);
  } finally {
    LOADER.classList.remove('visible');
    checkFormValid();
  }
}

DATE_INPUT.addEventListener('change', () => {
  const date = DATE_INPUT.value;
  if (date) loadAvailableSlots(date);
  else {
    TIME_SELECT.innerHTML = '<option value="" disabled selected>เลือกเวลาที่ว่าง</option>';
    checkFormValid();
  }
});

// ส่งข้อมูลจองคิว
FORM.addEventListener('submit', async (e) => {
  e.preventDefault();
  SUBMIT_BTN.disabled = true;
  LOADER.classList.add('visible');

  const bookingData = {
    name: NAME_INPUT.value.trim(),
    phone: PHONE_INPUT.value.trim(),
    date: DATE_INPUT.value,
    time: TIME_SELECT.value,
  };

  try {
    const res = await fetch(API_BASE_URL + '?path=bookQueue', {
      method: 'POST',
      body: JSON.stringify(bookingData),
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();

    if (data.status === 'success') {
      FORM.style.display = 'none';
      CONFIRM.classList.add('visible');
      CONFIRM_DETAILS.textContent =
        `ชื่อ: ${bookingData.name}\n` +
        `เบอร์โทร: ${bookingData.phone}\n` +
        `วันที่: ${bookingData.date}\n` +
        `เวลา: ${bookingData.time}`;
    } else {
      alert(data.message || 'เกิดข้อผิดพลาดในการจอง');
      SUBMIT_BTN.disabled = false;
    }
  } catch (err) {
    alert('เกิดข้อผิดพลาดในการติดต่อเซิร์ฟเวอร์');
    SUBMIT_BTN.disabled = false;
  } finally {
    LOADER.classList.remove('visible');
  }
});

BOOK_AGAIN_BTN.addEventListener('click', () => {
  CONFIRM.classList.remove('visible');
  FORM.style.display = '';
  FORM.reset();
  TIME_SELECT.innerHTML = '<option value="" disabled selected>เลือกเวลาที่ว่าง</option>';
  SUBMIT_BTN.disabled = true;
});

[NAME_INPUT, PHONE_INPUT, DATE_INPUT, TIME_SELECT].forEach(el => {
  el.addEventListener('input', checkFormValid);
  el.addEventListener('change', checkFormValid);
});

checkFormValid();
