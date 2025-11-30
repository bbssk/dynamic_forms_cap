
const { RestRemoteService } = require("../lib/remote-service-rest");

class service_management_ext extends RestRemoteService {
    async init() {

        this.customizeHeaders = (headers) => {
            headers["accept"] = "application/xml";
            headers["content-type"] = "application/xml";
            headers["accept-language"] = "";
        };

        await super.init();
    }

}

module.exports = service_management_ext;