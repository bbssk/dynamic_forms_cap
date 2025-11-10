namespace dynamic_forms_cap.db;
using { cuid, managed } from '@sap/cds/common';


entity Builder:cuid,managed{
    body: LargeString;
}