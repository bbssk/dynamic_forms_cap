/* checksum : 56d18420f4c129084529aa5c82b4a2aa */
@Capabilities.BatchSupported : false
@Capabilities.KeyAsSegmentSupported : true
@Core.Description : 'FSM Service Management'
@Core.SchemaVersion : '2.34.54'
@Core.LongDescription : `Used for managing Service Calls and Activities (Create, Update, Read). There is no explicit support for Delete. 
Activities lifecycle can be managed via business actions.
`
service Mobile.Dynamic.Forms {};

@Common.Label : 'Service API V2'
@Core.Description : 'Bulk update of the Service Calls with optional Activities'
@Core.LongDescription : 'Create or update multiple Service Calls with optional Activities. Every Service Call is updated in seperated transaction and results for every operation are send in multi status response.'
@openapi.method : 'POST'
@openapi.path : 'basic/forms/fr/service/persistence/search/orbeon/builder'
action Mobile.Dynamic.Forms.builder_get(
  @description : 'Search form documents using Orbeon Builder API'
  @openapi.in : 'header'
  @openapi.required : true
  @openapi.name : 'Authorization'
  Authorization : String,

  @description : 'CSRF token fetched via prior GET request'
  @openapi.in : 'header'
  @openapi.required : true
  @openapi.name : 'x-csrf-token'
  x_csrf_token : String,

  @description : 'CSRF token fetched via prior GET request'
  @openapi.in : 'header'
  @openapi.required : true
  @openapi.name : 'Cookie'
  Cookie : String,

  @description : 'Content type must be application/xml'
  @openapi.in : 'header'
  @openapi.required : true
  @openapi.name : 'Content-Type'
  Content_Type : String,

  @description : 'Accept header, application/xml'
  @openapi.in : 'header'
  @openapi.required : true
  @openapi.name : 'Accept'
  Accept : String,

  @description : 'Search request body for Orbeon persistence'
  @openapi.in : 'body'
  body : String
) returns LargeString;

@Common.Label : 'Service API V2'
@Core.Description : 'Bulk update of the Service Calls with optional Activities'
@Core.LongDescription : 'Create or update multiple Service Calls with optional Activities. Every Service Call is updated in seperated transaction and results for every operation are send in multi status response.'
@openapi.method : 'GET'
@openapi.path : 'basic/forms/fr/service/persistence/form'
action Mobile.Dynamic.Forms.get_forms(
  
) returns LargeString;

@Common.Label : 'Service API V2'
@Core.Description : 'Bulk update of the Service Calls with optional Activities'
@Core.LongDescription : 'Create or update multiple Service Calls with optional Activities. Every Service Call is updated in seperated transaction and results for every operation are send in multi status response.'
@openapi.method : 'GET'
@openapi.path : 'basic/forms/fr/service/persistence/search/orbeon/builder'
action Mobile.Dynamic.Forms.get_token(
  @description : '**Deprecated, will be removed soon**. Use the *X-Account-ID* header instead.'
  @openapi.in : 'header'
  @openapi.name : 'x-csrf-token'
  x_csrf_token :  String default 'fetch',
) returns LargeString;