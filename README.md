## Barbora Delivery Check

Checks for available home delivery times for specified date and creates a screenshot in screenshots/ folder when at least one is found. Default check is every 5 minutes.

### Setup

1. Create a logindetails.js file with your login details:

module.exports = {
  USERNAME: 'yourusername@gmail.com',
  PASSWORD: 'yourpassword'
}

2. Run run.bat and enter desired delivery date.

3. (Optional) If an alert is needed, run W4F25.exe and setup alarm.mp3 on File Create event in screenshots/ folder.
