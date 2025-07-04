const CONFIG = {
  API_URL: 'https://script.google.com/macros/s/AKfycbxPJ4NfXjvZYBl31UarLcnHk9mnw-pR2_a9AIe4Y5HX54qK4nJc_1eOhxfu_WzEehSj0A/exec',
};

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

// ตรวจสอบความถูกต้องของฟอร์มและเปิด/ปิดปุ่ม submit
function checkFormValid() {
  const nameValid = nameInput.value.trim() !== '';
  const phoneValid = /^[0-9]{9,10}$/.test(phoneInput.value);
  const dateValid = dateInput.value !== '';
  const timeValid = timeSelect.value !== '';

  submitBtn.disabled = !(nameValid && phoneValid && dateValid && timeValid);
}

// ดึงเวลาว่างจาก API
async function loadAvailableSlots(dateStr) {
  loader.classList.add('visible');
  timeSelect.innerHTML = '<option disabled>กำลังโหลดเวลาว่าง...</option>';
  submitBtn.disabled = true;

  try {
    const url = `${CONFIG.API_URL}?action=getAvailableSlots&date=${dateStr}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('ไม่สามารถโหลดเวลาว่างได้');

    const data = await res.json();
    if (data.status !== 'success') throw new Error(data.message || 'ผิดพลาด');

    if (data.slots.length === 0) {
      timeSelect.innerHTML = '<option disabled selected>ไม่มีเวลาว่างในวันนี้</option>';
    } else {
      timeSelect.innerHTML = '<option value="" disabled selected>เลือกเวลาที่ว่าง</option>';
      data.slots.forEach(slot => {
        const option = document.createElement('option');
        option.value = slot;
        option.textContent = slot;
        timeSelect.appendChild(option);
      });
    }
  } catch (error) {
    timeSelect.innerHTML = `<option disabled selected>โหลดเวลาว่างล้มเหลว</option>`;
    alert(error.message);
  } finally {
    loader.classList.remove('visible');
    checkFormValid();
  }
}

// โหลดเวลาว่างเมื่อเปลี่ยนวันที่
dateInput.addEventListener('change', () => {
  if (dateInput.value) {
    loadAvailableSlots(dateInput.value);
  } else {
    timeSelect.innerHTML = '<option value="" disabled selected>เลือกเวลาที่ว่าง</option>';
    checkFormValid();
  }
});

// ตรวจสอบฟอร์มทุกครั้งที่ input เปลี่ยน
[nameInput, phoneInput, dateInput, timeSelect].forEach(el => {
  el.addEventListener('input', checkFormValid);
  el.addEventListener('change', checkFormValid);
});

// ส่งฟอร์มจองคิว
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  submitBtn.disabled = true;
  loader.classList.add('visible');

  const payload = {
    name: nameInput.value.trim(),
    phone: phoneInput.value.trim(),
    date: dateInput.value,
    time: timeSelect.value,
  };

  try {
    const res = await fetch(CONFIG.API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error('เกิดข้อผิดพลาดในการจองคิว');

    const data = await res.json();
    if (data.status === 'success') {
      form.style.display = 'none';
      confirmation.classList.add('visible');
      confirmDetails.textContent =
        `ชื่อ: ${payload.name}\n` +
        `เบอร์โทร: ${payload.phone}\n` +
        `วันที่: ${payload.date}\n` +
        `เวลา: ${payload.time}`;
    } else {
      alert(data.message || 'จองคิวล้มเหลว');
    }
  } catch (err) {
    alert(err.message);
  } finally {
    loader.classList.remove('visible');
    submitBtn.disabled = false;
  }
});

// ปุ่มจองคิวใหม่
bookAgainBtn.addEventListener('click', () => {
  confirmation.classList.remove('visible');
  form.style.display = 'flex';
  form.reset();
  timeSelect.innerHTML = '<option value="" disabled selected>เลือกเวลาที่ว่าง</option>';
  submitBtn.disabled = true;
  dateInput.focus();
});

// ตั้งค่า input date ให้เลือกได้ตั้งแต่วันนี้เป็นต้นไป
function setMinDate() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  dateInput.min = `${yyyy}-${mm}-${dd}`;
}
setMinDate();

checkFormValid();
