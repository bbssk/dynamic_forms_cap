namespace mobile.dynamicforms.db;
using { cuid, managed } from '@sap/cds/common';


entity Builder:cuid,managed{
    body: LargeString;
}
entity PersistenceForms : cuid {

    @title: 'Application Name'
    applicationName        : String;

    @title: 'Form Name'
    formName               : String;

    @title: 'Form Version'
    formVersion            : String;

    @title: 'Last Modified Time'
    lastModifiedTime       : Timestamp;

    @title: 'Last Modified By'
    lastModifiedBy         : String;

    @title: 'Created On'
    created                : Timestamp;

    @title: 'Available'
    available              : Boolean;

    @title: 'Operations'
    operations             : String;

    @title: 'Title (English)'
    title_en               : String(255);

    @title: 'Title (French)'
    title_fr               : String(255);

    @title: 'Title (German)'
    title_de               : String(255);

    @title: 'Title Text (English)'
    title_text_en          : String(255);

    @title: 'Title Text (French)'
    title_text_fr          : String(255);

    @title: 'Title Text (German)'
    title_text_de          : String(255);
    
    @title: 'Count'
    count : Integer default 1;
}
