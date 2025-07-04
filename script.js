const GAS_URL = 'https://script.google.com/macros/s/AKfycbzVjgsGv5g_8zdTV_f5kEDL9yhzCkvmxD9aImMjrCaujhj0le9uA0uHTgPus_ImL1aK/exec';

const form = document.getElementById('bookingForm');
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    name: form.name.value.trim(),
    phone: form.phone.value.trim(),
    date: form.date.value,
    time: form.time.value,
  };

  if (!data.name || !data.phone || !data.date || !data.time) {
    document.getElementById('result').innerText = 'กรุณากรอกข้อมูลให้ครบทุกช่อง';
    return;
  }

  const res = await fetch(GAS_URL, {
    method: 'POST',
    body: JSON.stringify(data),
  });

  const result = await res.json();
  document.getElementById('result').innerText = result.message;
  if (result.status === 'success') {
    form.reset();
  }
});
