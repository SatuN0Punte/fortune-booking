const API_URL = "https://script.google.com/macros/s/YOUR_DEPLOYED_SCRIPT_URL/exec";

const form = document.getElementById('bookingForm');
const loader = document.getElementById('loader');
const confirmation = document.getElementById('confirmation');
const confirmDetails = document.getElementById('confirmDetails');
const bookAgainBtn = document.getElementById('bookAgainBtn');
const timeSelect = document.getElementById('time');
const dateInput = document.getElementById('date');

async function fetchAvailableTimes(date) {
  try {
    const res = await fetch(API_URL + `?action=checkAvailable&date=${date}`);
    const data = await res.json();
    if (data.success && Array.isArray(data.availableTimes)) {
      return data.availableTimes;
    } else {
      return [];
    }
  } catch (e) {
    console.error('Error fetching available times:', e);
    return [];
  }
}

dateInput.addEventListener('change', async () => {
  loader.classList.remove('hidden');
  timeSelect.innerHTML = '<option disabled selected>กำลังโหลดเวลาว่าง...</option>';

  const date = dateInput.value;
  if (!date) {
    timeSelect.innerHTML = '<option disabled selected>กรุณาเลือกวันก่อน</option>';
    loader.classList.add('hidden');
    return;
  }

  const availableTimes = await fetchAvailableTimes(date);
  if (availableTimes.length === 0) {
    timeSelect.innerHTML = '<option disabled selected>ไม่มีเวลาว่างในวันเลือก</option>';
  } else {
    timeSelect.innerHTML = '<option disabled selected>เลือกเวลาที่ว่าง</option>';
    availableTimes.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t;
      opt.textContent = t;
      timeSelect.appendChild(opt);
    });
  }

  loader.classList.add('hidden');
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = form.name.value.trim();
  const phone = form.phone.value.trim();
  const lineId = form.lineId.value.trim();
  const date = form.date.value;
  const time = form.time.value;

  if (!name || !phone || !lineId || !date || !time) {
    alert("❌ กรุณากรอกข้อมูลให้ครบก่อนกดจองคิว");
    return;
  }

  loader.classList.remove('hidden');

  const dateTime = `${date}T${time}:00+07:00`;

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "bookQueue",
        booking: {
          name,
          phone,
          lineId,
          dateTime,
          note: ""
        }
      })
    });

    const data = await res.json();

    if (data.success) {
      // แสดงหน้าคอนเฟิร์มและซ่อนฟอร์ม
      form.classList.add('hidden');
      confirmation.classList.remove('hidden');
      confirmDetails.innerHTML = `
        <p>ชื่อ: ${name}</p>
        <p>เบอร์โทร: ${phone}</p>
        <p>Line ID: ${lineId}</p>
        <p>วันที่: ${date}</p>
        <p>เวลา: ${time}</p>
        <p>ข้อความ: ${data.message || 'จองคิวสำเร็จ'}</p>
      `;
    } else {
      alert(data.message || "เกิดข้อผิดพลาดในการจองคิว");
    }

  } catch (err) {
    alert("🚫 ไม่สามารถเชื่อมต่อระบบจองได้ กรุณาลองใหม่อีกครั้ง");
    console.error(err);
  } finally {
    loader.classList.add('hidden');
  }
});

bookAgainBtn.addEventListener('click', () => {
  confirmation.classList.add('hidden');
  form.classList.remove('hidden');
  form.reset();
  // รีเซ็ตเวลาที่เลือกให้เป็นค่าเริ่มต้น
  timeSelect.innerHTML = '<option disabled selected>โปรดเลือกวันก่อน</option>';
});
