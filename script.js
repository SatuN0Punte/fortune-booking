document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('bookingForm');
  const dateInput = document.getElementById('date');
  const timeSelect = document.getElementById('time');
  const priceConfirm = document.getElementById('priceConfirm');
  const submitBtn = document.getElementById('submitBtn');
  const qrPopup = document.getElementById('qrPopup');
  const closeQR = document.getElementById('closeQR');
  const qrImg = document.getElementById('qrImg');
  const resultMsg = document.getElementById('resultMsg');

  // ตั้งค่า min date เป็นวันนี้
  const today = new Date().toISOString().split('T')[0];
  dateInput.min = today;

  // ตัวอย่างเวลา (ในอนาคตจะดึงจาก Google Calendar)
  const slots = ["10:00", "10:30", "11:00", "11:30", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "21:30"];
  slots.forEach(t => {
    const opt = document.createElement('option');
    opt.value = t;
    opt.textContent = t;
    timeSelect.appendChild(opt);
  });

  // เปิดปุ่มเมื่อ Checkbox ติ๊ก
  priceConfirm.addEventListener('change', () => {
    submitBtn.disabled = !priceConfirm.checked;
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    // แสดง QR Mockup (จะเปลี่ยนในอนาคต)
    qrImg.src = 'https://api.qrserver.com/v1/create-qr-code/?data=ชำระเงิน1000บาท&size=200x200';
    qrPopup.style.display = 'block';
    resultMsg.textContent = '🎉 จองสำเร็จ! กรุณาชำระเงินผ่าน QR ด้านบน';
  });

  closeQR.addEventListener('click', () => {
    qrPopup.style.display = 'none';
  });
});
