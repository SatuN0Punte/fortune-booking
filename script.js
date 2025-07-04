const API_URL = 'https://YOUR_SCRIPT_ID_HERE/exec'; // ใส่ URL Apps Script ของคุณ

const form = document.getElementById('bookingForm');
const nameInput = document.getElementById('name');
const phoneInput = document.getElementById('phone');
const dateInput = document.getElementById('date');
const timeSelect = document.getElementById('time');
const submitBtn = document.getElementById('submitBtn');
const loader = document.querySelector('.loader');
const confirmation = document.getElementById('confirmation');
const confirmDetails = document.getElementById('confirmDetails');
const bookAgainBtn = document.getElementById('bookAgainBtn');

// ตรวจ input
function checkForm() {
  submitBtn.disabled = !(
    nameInput.value.trim() &&
    /^[0-9]{9,10}$/.test(phoneInput.value) &&
    dateInput.value &&
    timeSelect.value
  );
}
[nameInput, phoneInput, dateInput, timeSelect].forEach(el => {
  el.addEventListener('input', checkForm);
  el.addEventListener('change', checkForm);
});

// โหลดเวลาว่าง
dateInput.addEventListener('change', () => {
  loader.classList.add('active');
  timeSelect.innerHTML = '<option>กำลังโหลด...</option>';

  fetch(`${API_URL}?action=getAvailableSlots&date=${dateInput.value}`)
    .then(res => res.json())
    .then(data => {
      loader.classList.remove('active');
      timeSelect.innerHTML = '<option value="">-- เลือกเวลา --</option>';
      data.slots.forEach(slot => {
        const opt = document.createElement('option');
        opt.value = slot;
        opt.textContent = slot;
        timeSelect.append(opt);
      });
      checkForm();
    })
    .catch(() => {
      loader.classList.remove('active');
      alert('โหลดเวลาว่างไม่สำเร็จ');
    });
});

// ส่งฟอร์ม
form.addEventListener('submit', e => {
  e.preventDefault();
  submitBtn.disabled = true;
  loader.classList.add('active');

  fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify({
      name: nameInput.value,
      phone: phoneInput.value,
      date: dateInput.value,
      time: timeSelect.value
    })
  })
    .then(res => res.json())
    .then(data => {
      loader.classList.remove('active');
      if (data.status === 'success') {
        form.classList.add('hidden');
        confirmation.classList.remove('hidden');
        confirmDetails.textContent = `ชื่อ: ${nameInput.value}\nเบอร์โทร: ${phoneInput.value}\nวันที่: ${dateInput.value}\nเวลา: ${timeSelect.value}`;
      } else {
        alert(data.message);
        submitBtn.disabled = false;
      }
    })
    .catch(() => {
      loader.classList.remove('active');
      alert('เกิดข้อผิดพลาด');
      submitBtn.disabled = false;
    });
});

// จองใหม่
bookAgainBtn.addEventListener('click', () => {
  confirmation.classList.add('hidden');
  form.classList.remove('hidden');
  form.reset();
  timeSelect.innerHTML = '<option value="">-- เลือกเวลา --</option>';
  submitBtn.disabled = true;
});
