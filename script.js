const CONFIG = {
  API_URL: 'https://script.google.com/macros/s/AKfycbwF_9FGfNK69BUztpcgj1LqN4u6SBBbqmlhEnWvEZlS0JJusHH91q-Z4rH4RaUG6BLCHg/exec',
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

// ฟังก์ชันตรวจสอบฟอร์มครบถ้วน
function checkFormValid() {
  const nameValid = nameInput.value.trim() !== '';
  const phoneValid = /^[0-9]{9,10}$/.test(phoneInput.value);
  const dateValid = dateInput.value !== '';
  const timeValid = timeSelect.value !== '';

  submitBtn.disabled = !(nameValid && phoneValid && dateValid && timeValid);
}

// ตรวจสอบฟอร์มทุกช่องเมื่อมีการพิมพ์หรือเปลี่ยนแปลง
[nameInput, phoneInput, dateInput, timeSelect].forEach(el => {
  el.addEventListener('input', checkFormValid);
  el.addEventListener('change', checkFormValid);
});

// โหลดเวลาว่างจาก API
dateInput.addEventListener('change', async () => {
  if (!dateInput.value) return;
  loader.classList.add('visible');
  timeSelect.innerHTML = '<option disabled>กำลังโหลดเวลาว่าง...</option>';

  try {
    const response = await fetch(`${CONFIG.API_URL}?action=getAvailableSlots&date=${dateInput.value}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      mode: 'cors',
    });
    const data = await response.json();

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
        timeSelect.innerHTML = '<option value="" disabled selected>ไม่มีเวลาว่างในวันนี้</option>';
      }
    } else {
      timeSelect.innerHTML = `<option value="" disabled selected>โหลดเวลาว่างล้มเหลว</option>`;
      alert(data.message || 'โหลดเวลาว่างล้มเหลว');
    }
  } catch (error) {
    timeSelect.innerHTML = `<option value="" disabled selected>โหลดเวลาว่างล้มเหลว</option>`;
    alert('เกิดข้อผิดพลาดในการโหลดเวลาว่าง');
  }
  loader.classList.remove('visible');
  checkFormValid();
});

// ส่งข้อมูลจองคิว
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  submitBtn.disabled = true;
  loader.classList.add('visible');

  const bookingData = {
    name: nameInput.value.trim(),
    phone: phoneInput.value.trim(),
    date: dateInput.value,
    time: timeSelect.value,
  };

  try {
    const response = await fetch(CONFIG.API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData),
      mode: 'cors',
    });
    const data = await response.json();

    if (data.status === 'success') {
      form.style.display = 'none';
      confirmation.classList.add('visible');
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
  }
  loader.classList.remove('visible');
  submitBtn.disabled = false;
});

// ปุ่มจองใหม่
bookAgainBtn.addEventListener('click', () => {
  confirmation.classList.remove('visible');
  form.style.display = '';
  form.reset();
  timeSelect.innerHTML = '<option value="" disabled selected>เลือกเวลาที่ว่าง</option>';
  submitBtn.disabled = true;
});

// เริ่มต้นปิดปุ่ม submit
checkFormValid();
