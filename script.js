const CONFIG = {
  API_URL: 'https://script.google.com/macros/s/YOUR_DEPLOYED_SCRIPT_ID/exec'
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
  const valid = nameInput.value && phoneInput.value && dateInput.value && timeSelect.value;
  submitBtn.disabled = !valid;
}

[nameInput, phoneInput, dateInput, timeSelect].forEach(el => {
  el.addEventListener('input', checkFormValid);
  el.addEventListener('change', checkFormValid);
});

dateInput.addEventListener('change', async () => {
  loader.classList.add('visible');
  timeSelect.innerHTML = '<option disabled>กำลังโหลด...</option>';
  const res = await fetch(`${CONFIG.API_URL}?action=getAvailableSlots&date=${dateInput.value}`);
  const data = await res.json();
  loader.classList.remove('visible');

  if (data.status === 'success') {
    timeSelect.innerHTML = '<option value="" disabled selected>เลือกเวลาที่ว่าง</option>';
    data.slots.forEach(slot => {
      timeSelect.innerHTML += `<option value="${slot}">${slot}</option>`;
    });
  } else {
    alert('โหลดเวลาไม่สำเร็จ: ' + data.message);
  }
  checkFormValid();
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  submitBtn.disabled = true;
  loader.classList.add('visible');

  const res = await fetch(CONFIG.API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: nameInput.value,
      phone: phoneInput.value,
      date: dateInput.value,
      time: timeSelect.value
    })
  });
  const data = await res.json();
  loader.classList.remove('visible');

  if (data.status === 'success') {
    form.style.display = 'none';
    confirmation.classList.add('visible');
    confirmDetails.innerText = `ชื่อ: ${nameInput.value}\nเบอร์โทร: ${phoneInput.value}\nวันที่: ${dateInput.value}\nเวลา: ${timeSelect.value}`;
  } else {
    alert(data.message);
    submitBtn.disabled = false;
  }
});

bookAgainBtn.addEventListener('click', () => {
  form.reset();
  confirmation.classList.remove('visible');
  form.style.display = '';
  submitBtn.disabled = true;
});
