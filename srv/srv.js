const cds = require('@sap/cds');
const xml2js = require('xml2js');
const PDFDocument = require("pdfkit");
const ExcelJS = require("exceljs");
const { fs, path } = cds.utils;

module.exports = cds.service.impl(async function () {


    var Dynamic_Forms_API = await cds.connect.to("Mobile.Dynamic.Forms");

    this.on('getBuilders', async (req) => {
        var x_csrf_token = await this.send('getToken', {

        });
        const body = JSON.stringify(`
                                    <?xml version="1.0" encoding="UTF-8"?>
                                    <search return-all-indexed-fields="true">
                                    <query/>
                                    <page-size>25</page-size>
                                    <page-number>1</page-number>
                                    </search>
        `);
        await Dynamic_Forms_API.send("builder_get", {
            x_csrf_token,
            body
        }).then(result => {
            console.log("API call successful:", result);
        }).catch(err => {
            console.error("API call failed:", err);
        });

    });

    this.on('getForms', async (req) => {
        await Dynamic_Forms_API.send("get_forms", {
        }).then(result => {
            console.log("API call successful:", result);
            req.reply(result);
        }).catch(err => {
            console.error("API call failed:", err);
        });

    });

    this.on('getToken', async (req) => {

        try {
            const result = await Dynamic_Forms_API.send("get_token", {
                x_csrf_token: "fetch"
            });

            console.log("Token API successful:", result);

            // return token (whatever field contains it)
            return result;

        } catch (err) {
            console.error("Token API failed:", err);

            // If token comes from error response header:
            return err.reason?.response?.headers?.["x-csrf-token"];
        }



        // const xmlFilePath = path.join(__dirname, 'data.xml');

        // // Read XML file similar to workbook.xlsx.readFile(...)
        // const xmlString = await fs.promises.readFile(xmlFilePath, 'utf8');

        // const parser = new xml2js.Parser();


        // const result = await parser.parseStringPromise(xmlString);
        // //debugger;
        // const entries = result?.feed?.entry || [];
        // const titles = [];

        // for (const entry of entries) {
        //     const title = entry?.title?.[0]?._;   // safe access

        //     if (title) {
        //         titles.push(title);
        //     }
        // }

        // //console.log("Titles:", titles);
        // const ids = titles.map(t => t.split("'")[1]);
        // console.log(ids);
        // generatePdfFromIds(ids)
        //     .then(pdfPath => console.log("PDF saved at:", pdfPath))
        //     .catch(err => console.error("PDF generation error:", err));
        // extractEntries(result)

    });
    async function generatePdfFromIds(ids) {
        // 1. Create local folder
        const tempDir = path.join(__dirname, "_out/download");
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        // 2. PDF output path
        const pdfPath = path.join(tempDir, "workorder_ids.pdf");

        // 3. Create PDF document
        const doc = new PDFDocument({ margin: 40 });
        const stream = fs.createWriteStream(pdfPath);
        doc.pipe(stream);

        // 4. PDF Title
        doc.fontSize(18).text("Extracted Work Order IDs", { underline: true });
        doc.moveDown();

        // 5. Add each ID
        doc.fontSize(12);
        ids.forEach((id, index) => {
            doc.text(`${index + 1}. ${id}`);
        });

        // 6. Finalize
        doc.end();

        // 7. Return file path after writing completes
        return new Promise((resolve, reject) => {
            stream.on("finish", () => resolve(pdfPath));
            stream.on("error", reject);
        });
    };

    async function extractEntries(result) {
        const FIELD_TAGS = [
            "d:ObjectNumber",
            "d:Phase",
            "d:Subphase",
            "d:LAMObjectType",
            "d:LAMTableKey",
            "d:OrderProcessingContext",
            "d:PlannerGroup",
            "d:PriorityType",
            "d:WorkCenterInternalId",
            "d:AccountingIndicator",
            "d:ScheduledEndDate",
            "d:ScheduledStartDate",
            "d:RequestStartDate",
            "d:DueDate",
            "d:RequestStartTime",
            "d:RequestEndTime",
            "d:ScheduledStartTime",
            "d:ScheduledEndTime",
            "d:NotificationNumber",
            "d:AddressNum",
            "d:ReferenceOrder",
            "d:Assembly",
            "d:CostCenter",
            "d:ControllingArea",
            "d:CreationDate",
            "d:CreationTime",
            "d:HeaderFunctionLocation",
            "d:LastChangeTime",
            "d:MainWorkCenter",
            "d:OrderId",
            "d:HeaderEquipment",
            "d:OrderType",
            "d:PlanningPlant",
            "d:Priority",
            "d:BusinessArea",
            "d:ObjectKey",
            "d:MaintenancePlant",
            "d:MainWorkCenterPlant",
            "d:MaintenanceActivityType",
            "d:ObjectType",
            "d:OrderCategory",
            "d:OrderCurrency",
            "d:OrderDescription"
        ];
        const entries = result?.feed?.entry || [];
        const extractedRows = [];

        for (const entry of entries) {
            const props = entry?.content?.[0]?.["m:properties"]?.[0];
            if (!props) continue;

            const row = {};

            FIELD_TAGS.forEach(tag => {
                // value = props["d:PlanningPlant"][0] etc.
                const val = props[tag]?.[0] ?? "";
                row[tag.replace("d:", "")] = val;  // Clean column name
            });

            extractedRows.push(row);
        }
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("WorkOrders");

        // Header row
        const headers = FIELD_TAGS.map(t => t.replace("d:", ""));
        sheet.addRow(headers);

        // Data rows
        extractedRows.forEach(rowObj => {
            const row = headers.map(h => rowObj[h]);
            sheet.addRow(row);
        });

        // Create directory
        const tempDir = path.join(__dirname, "_out/download");
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        const excelPath = path.join(tempDir, "workorders.xlsx");
        await workbook.xlsx.writeFile(excelPath);

    }


});
