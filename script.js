const CONFIG = {
  API_URL: 'https://script.google.com/macros/s/YOUR_DEPLOYED_SCRIPT_ID/exec',
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

// ตั้งค่าวันต่ำสุดเป็นวันนี้
function setMinDate() {
  const today = new Date().toISOString().split('T')[0];
  dateInput.min = today;
}
setMinDate();

// ตรวจสอบฟอร์มว่าครบถ้วน
function checkFormValid() {
  const nameValid = nameInput.value.trim() !== '';
  const phoneValid = /^[0-9]{9,10}$/.test(phoneInput.value);
  const dateValid = dateInput.value !== '';
  const timeValid = timeSelect.value !== '';

  submitBtn.disabled = !(nameValid && phoneValid && dateValid && timeValid);
}

// ตรวจสอบฟอร์มเมื่อมีการเปลี่ยนแปลง
[nameInput, phoneInput, dateInput, timeSelect].forEach(el => {
  el.addEventListener('input', checkFormValid);
  el.addEventListener('change', checkFormValid);
});

// โหลดเวลาว่างจาก backend
async function loadAvailableSlots(date) {
  loader.classList.remove('hidden');
  timeSelect.innerHTML = '<option disabled>กำลังโหลดเวลาว่าง...</option>';

  try {
    const res = await fetch(`${CONFIG.API_URL}?action=getAvailableSlots&date=${date}`);
    if (!res.ok) throw new Error('HTTP error ' + res.status);
    const data = await res.json();

    if (data.status === 'success') {
      if (data.slots.length > 0) {
        timeSelect.innerHTML = '<option value="" disabled selected>เลือกเวลาที่ว่าง</option>';
        data.slots.forEach(slot => {
          const option = document.createElement('option');
          option.value = slot;
          option.textContent = slot;
          timeSelect.appendChild(option);
        });
      } else {
        timeSelect.innerHTML = '<option disabled selected>ไม่มีเวลาว่างในวันนี้</option>';
      }
    } else {
      timeSelect.innerHTML = '<option disabled selected>โหลดเวลาว่างล้มเหลว</option>';
      alert(data.message || 'โหลดเวลาว่างล้มเหลว');
    }
  } catch (error) {
    timeSelect.innerHTML = '<option disabled selected>โหลดเวลาว่างล้มเหลว</option>';
    alert('เกิดข้อผิดพลาดในการโหลดเวลาว่าง');
    console.error(error);
  } finally {
    loader.classList.add('hidden');
    checkFormValid();
  }
}

// เมื่อเลือกวันใหม่ ให้โหลดเวลาว่าง
dateInput.addEventListener('change', () => {
  if (!dateInput.value) return;
  loadAvailableSlots(dateInput.value);
});

// ส่งข้อมูลจอง
form.addEventListener('submit', async e => {
  e.preventDefault();
  submitBtn.disabled = true;
  loader.classList.remove('hidden');

  const bookingData = {
    name: nameInput.value.trim(),
    phone: phoneInput.value.trim(),
    date: dateInput.value,
    time: timeSelect.value,
  };

  try {
    const res = await fetch(CONFIG.API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData),
    });
    if (!res.ok) throw new Error('HTTP error ' + res.status);
    const data = await res.json();

    if (data.status === 'success') {
      form.classList.add('hidden');
      confirmation.classList.remove('hidden');
      confirmDetails.textContent = 
        `ชื่อ: ${bookingData.name}\n` +
        `เบอร์โทร: ${bookingData.phone}\n` +
        `วันที่: ${bookingData.date}\n` +
        `เวลา: ${bookingData.time}`;
    } else {
      alert(data.message || 'จองคิวไม่สำเร็จ');
    }
  } catch (error) {
    alert('เกิดข้อผิดพลาดในการส่งข้อมูลจองคิว');
    console.error(error);
  } finally {
    loader.classList.add('hidden');
    submitBtn.disabled = false;
  }
});

// ปุ่มจองใหม่
bookAgainBtn.addEventListener('click', () => {
  confirmation.classList.add('hidden');
  form.classList.remove('hidden');
  form.reset();
  timeSelect.innerHTML = '<option value="" disabled selected>เลือกเวลาที่ว่าง</option>';
  submitBtn.disabled = true;
});

// เริ่มต้น disable ปุ่ม submit
checkFormValid();
