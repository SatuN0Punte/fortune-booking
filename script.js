const CONFIG = {
  API_URL: 'https://script.google.com/macros/s/YOUR_DEPLOYED_SCRIPT_ID/exec', // เปลี่ยนเป็น URL ของคุณ
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

function checkFormValid() {
  const nameValid = nameInput.value.trim() !== '';
  const phoneValid = /^[0-9]{9,10}$/.test(phoneInput.value);
  const dateValid = dateInput.value !== '';
  const timeValid = timeSelect.value !== '';

  submitBtn.disabled = !(nameValid && phoneValid && dateValid && timeValid);
}

[nameInput, phoneInput, dateInput, timeSelect].forEach(el => {
  el.addEventListener('input', checkFormValid);
  el.addEventListener('change', checkFormValid);
});

dateInput.addEventListener('change', async () => {
  if (!dateInput.value) return;

  loader.classList.add('visible');
  timeSelect.innerHTML = '<option disabled>กำลังโหลดเวลาว่าง...</option>';
  submitBtn.disabled = true;

  try {
    const res = await fetch(`${CONFIG.API_URL}?action=getAvailableSlots&date=${dateInput.value}`);
    const json = await res.json();

    if (json.slots && json.slots.length > 0) {
      timeSelect.innerHTML = '<option value="" disabled selected>เลือกเวลาที่ว่าง</option>';
      json.slots.forEach(time => {
        const option = document.createElement('option');
        option.value = time;
        option.textContent = time;
        timeSelect.appendChild(option);
      });
    } else {
      timeSelect.innerHTML = '<option disabled>ไม่มีเวลาว่างในวันนี้</option>';
    }
  } catch (error) {
    timeSelect.innerHTML = '<option disabled>โหลดเวลาว่างล้มเหลว</option>';
  } finally {
    loader.classList.remove('visible');
    checkFormValid();
  }
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  submitBtn.disabled = true;
  loader.classList.add('visible');

  const data = {
    name: nameInput.value.trim(),
    phone: phoneInput.value.trim(),
    date: dateInput.value,
    time: timeSelect.value,
  };

  try {
    const res = await fetch(CONFIG.API_URL, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {'Content-Type': 'application/json'}
    });
    const json = await res.json();

    if (json.status === 'success') {
      form.style.display = 'none';
      confirmation.classList.add('visible');
      confirmDetails.textContent = 
        `ชื่อ: ${data.name}\n` +
        `เบอร์โทร: ${data.phone}\n` +
        `วันที่: ${data.date}\n` +
        `เวลา: ${data.time}`;
    } else {
      alert('ไม่สามารถจองได้: ' + json.message);
      submitBtn.disabled = false;
    }
  } catch (error) {
    alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    submitBtn.disabled = false;
  } finally {
    loader.classList.remove('visible');
  }
});

bookAgainBtn.addEventListener('click', () => {
  confirmation.classList.remove('visible');
  form.style.display = '';
  form.reset();
  timeSelect.innerHTML = '<option value="" disabled selected>เลือกเวลาที่ว่าง</option>';
  submitBtn.disabled = true;
});

submitBtn.disabled = true;
