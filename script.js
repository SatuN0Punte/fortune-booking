function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    const name = data.name;
    const phone = data.phone;
    const date = data.date;
    const time = data.time;

    if (!name || !phone || !date || !time) {
      return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: 'กรุณากรอกข้อมูลให้ครบทุกช่อง' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const calendarId = '68bf8ce45464dd0ac16c585452fe38477d69b76e96ba829f729ac9d59fc2aee8@group.calendar.google.com';
    const calendar = CalendarApp.getCalendarById(calendarId);

    const startDateTime = new Date(date + 'T' + time + ':00+07:00');
    const endDateTime = new Date(startDateTime.getTime() + 30 * 60000);

    // เช็คว่ามี event ซ้อนเวลาหรือไม่
    const events = calendar.getEvents(startDateTime, endDateTime);

    if (events.length > 0) {
      return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: 'เวลานี้ถูกจองแล้ว' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // สร้าง event ใหม่
    calendar.createEvent(`จองคิว: ${name}`, startDateTime, endDateTime, {
      description: `เบอร์โทร: ${phone}`
    });

    return ContentService.createTextOutput(JSON.stringify({ status: 'success', message: 'จองคิวสำเร็จ' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: 'เกิดข้อผิดพลาด: ' + error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
