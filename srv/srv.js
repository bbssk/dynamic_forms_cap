const cds = require('@sap/cds');

module.exports = cds.service.impl(async function () {
    

    var Dynamic_Forms_API = await cds.connect.to("Mobile.Dynamic.Forms");

    this.on('getBuilders', async (req) => {

        await Dynamic_Forms_API.send("builder_get",{
        }).then(result => {
            console.log("API call successful:", result);
        }).catch(err => {
            console.error("API call failed:", err);
        });
        
    });
    this.on('getForms', async (req) => {

        await Dynamic_Forms_API.send("get_forms",{
        }).then(result => {
            console.log("API call successful:", result);
            req.reply(result);
        }).catch(err => {
            console.error("API call failed:", err);
        });
        
    });



});
