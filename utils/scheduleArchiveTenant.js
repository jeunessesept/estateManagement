const cron = require('node-cron')
const archiveTenantService = require('../services/archiveTenant.service')


const scheduleArchiveTenant = () => {

    cron.schedule('0  10 * * *', archiveTenantService.archiveExpiredTenantsByDate)   //  node-cron is an action scheduler that triggers every day at 10AM  ('0 0 * * *'  for midnight) to activate the function that checks contract end dates. 

}

module.exports = scheduleArchiveTenant