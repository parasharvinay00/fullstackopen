const { Cron, scheduledJobs } = require('croner');

// ^ Tip: Open this file in VsCode via alias `code.cron` directly.

// Web: https://croner.56k.guru
// Docs: https://github.com/Hexagon/croner
/*
┌──────────────── (optional) second (0 - 59)
│ ┌────────────── minute (0 - 59)
│ │ ┌──────────── hour (0 - 23)
│ │ │ ┌────────── day of month (1 - 31)
│ │ │ │ ┌──────── month (1 - 12, JAN-DEC)
│ │ │ │ │ ┌────── day of week (0 - 6, SUN-Mon) 
│ │ │ │ │ │       (0 to 6 are Sunday to Saturday; 7 is Sunday, the same as 0)
│ │ │ │ │ │ ┌──── (optional) year (1 - 9999)
│ │ │ │ │ │ │
 * * * * * *

👉🏻 Optional second and year fields for enhanced precision:
- 5-field format:         MINUTE  HOUR  DAY-OF-MONTH  MONTH  DAY-OF-WEEK
- 6-field format: SECOND  MINUTE  HOUR  DAY-OF-MONTH  MONTH  DAY-OF-WEEK
- 7-field format: SECOND  MINUTE  HOUR  DAY-OF-MONTH  MONTH  DAY-OF-WEEK  YEAR
- Supported year range: 1-9999
*/
const job = new Cron('*/5 * * * * * ', { name: 'MY job 1' }, () => {
    console.log('This will run every fifth second');
});
console.log("🚀 ~ job.name?", job.name);
console.log("🚀 ~ scheduledJobs?", scheduledJobs.map(c => c.name));