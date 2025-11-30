using dynamic_forms_cap.db as db from '../db/schema';

service DynamicForms @(path:'DynamicFormServices')  {
    @readonly entity Builder as projection on db.Builder;
    action getBuilders();
    action getForms() returns LargeString;
    action getToken() returns LargeString;
}
