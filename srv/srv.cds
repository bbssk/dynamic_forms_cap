using mobile.dynamicforms.db as db from '../db/schema';

service DynamicForms @(path:'DynamicFormServices')  {
    @readonly entity PersistenceForms as projection on db.PersistenceForms;
    action getBuilders();
    action getPersistenceForms() returns array of PersistenceForms;
    action getToken() returns LargeString;
}
