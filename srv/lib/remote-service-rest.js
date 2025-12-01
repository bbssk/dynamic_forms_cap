const cds = require("@sap/cds");

const DEFINITION_KIND_ACTION = "action";
//DEFINITION_KIND_FUNCTION = "function";

const
    METHOD_GET = "GET",
    METHOD_POST = "POST";

const
    OPENAPI_ANNOTATION_METHOD = "@openapi.method",
    OPENAPI_ANNOTATION_PATH = "@openapi.path",
    OPENAPI_ANNOTATION_PARAM_IN = "@openapi.in",
    OPENAPI_ANNOTATION_PARAM_NAME = "@openapi.name";

const
    PARAM_IN_BODY = "body",
    PARAM_IN_HEADER = "header",
    //PARAM_IN_PATH = "path",
    PARAM_IN_FORMDATA = "formData",
    PARAM_IN_QUERY = "query";

const PLACEHOLDER_REGEX = /(?<=\{)(.*)(?=\})/g;

/**
 * A generic service implementation for remote REST services.
 */
class RestRemoteService extends cds.RemoteService {
    async init() {
        this.before("*", "*", (req) => {
            const fullyQualifiedName = this.namespace + "." + req.event;
            const definition = this.model.definitions[fullyQualifiedName];

            req.method = this.getMethod(definition);
            req.path = this.getPath(definition, req.data);
            if (req.path == 'basic/forms/fr/service/persistence/search/orbeon/builder' && req.method == 'POST') {
                Object.assign(
                    req.headers,
                    { "accept": "application/xml", "content-type": "application/xml", "x-csrf-token": req.data.x_csrf_token, "Cookie":req.data.Cookie }
                );
            } else {
                Object.assign(
                    req.headers,
                    this.getHeaders(definition, req.data)
                );
            }
            req.data = this.getBody(definition, req.data);
            req.event = "";
        });

        await super.init();
    }

    /**
     * Add or overwrite request headers in the given object `headers`.
     * @param {object} headers
     */
    customizeHeaders(headers) { }

    /**
     * Use the given `URLSearchParams` object to add or overwrite query parameters.
     * @param {URLSearchParams} queryParams
     */
    customizeQueryParams(queryParams) { }

    getMethod(definition) {
        const method = definition[OPENAPI_ANNOTATION_METHOD];
        if (method) {
            return method;
        }
        return definition.kind === DEFINITION_KIND_ACTION ? METHOD_POST : METHOD_GET;
    }

    getHeaders(definition, data = {}, customize = (headers) => { }) {
        const headers = Object.entries(data)
            .filter(([paramName]) => this.isHeader(definition, paramName))
            .filter(([, paramValue]) => !!paramValue)
            .reduce(this.toHeaders.bind(this, definition), {});

        customize(headers);
        return headers;
    }

    isHeader(definition, paramName) {
        const param = definition.params?.[paramName];
        return param?.[OPENAPI_ANNOTATION_PARAM_IN] === PARAM_IN_HEADER;
    }

    toHeaders(definition, headers, param) {
        const [paramName, paramValue] = param;
        const paramDef = definition.params?.[paramName];
        const headerName = paramDef?.[OPENAPI_ANNOTATION_PARAM_NAME] || paramName;
        headers[headerName] = paramValue;
        return headers;
    }


    getPath(definition, data = {}) {
        const pathTemplate = definition[OPENAPI_ANNOTATION_PATH] ?? "";
        const path = pathTemplate
            .split("/")
            .map((segment) => this.replacePlaceholder(segment, data))
            .join("/");
        const queryString = this.getQueryString(definition, data);

        return path + (queryString.length ? "?" + queryString : "");
    }

    replacePlaceholder(segment, data) {
        const match = segment.match(PLACEHOLDER_REGEX);
        if (!match) {
            return segment;
        }

        const paramName = match[0].replace(/-/g, "_");
        const paramValue = data[paramName];
        if (!!paramValue) {
            return paramValue.toString();
        } else {
            throw new CapError(400, `Value for path parameter '${paramValue}' missing`);
        }
    }

    getQueryString(definition, data) {
        const queryParams = new URLSearchParams();

        if (definition.params) {
            for (const key in data) {
                const value = data[key];
                if (value === undefined || value === null) continue;

                const param = definition.params[key];
                const isDirectMatch =
                    param && param[OPENAPI_ANNOTATION_PARAM_IN] === PARAM_IN_QUERY;

                const isNameMappedMatch = Object.values(definition.params).some((p) =>
                    p?.[OPENAPI_ANNOTATION_PARAM_IN] === PARAM_IN_QUERY && p?.[OPENAPI_ANNOTATION_PARAM_NAME] === key
                );

                if (isDirectMatch) {
                    const mappedName = param[OPENAPI_ANNOTATION_PARAM_NAME] || key;
                    queryParams.set(mappedName, String(value));
                } else if (isNameMappedMatch) {
                    queryParams.set(key, String(value));
                }
            }
        }
        if (this.customize) {
            customize(queryParams);
        }
        return queryParams.toString();
    }

    getBody(definition, data) {
        if (definition.params) {
            if (this.isFormData(definition)) {
                const params = [...definition.params].filter((param) => {
                    return param[OPENAPI_ANNOTATION_PARAM_IN] === PARAM_IN_FORMDATA;
                });

                if (params.length > 0) {
                    const filteredData = {};
                    params.forEach((param) => {
                        if (param.name && data[param.name]) {
                            const key = param[OPENAPI_ANNOTATION_PARAM_NAME] ? param[OPENAPI_ANNOTATION_PARAM_NAME] : param.name;
                            filteredData[key] = data[param.name];
                        }
                    });
                    return this.getFormData(filteredData);
                }
            }

            const params = [...definition.params].filter((param) => {
                return param[OPENAPI_ANNOTATION_PARAM_IN] === PARAM_IN_BODY;
            });

            if (params.length > 0) {
                const param = params[0];
                if (param.name && Array.isArray(data)) {
                    return data;
                } else if (param.name && data[param.name]) {
                    return data[param.name];
                }
            }
        }

        return {};
    }

    isFormData(definition) {
        const params = definition.params ? [...definition.params] : [];
        return params.some((param) => {
            return param[OPENAPI_ANNOTATION_PARAM_IN] === PARAM_IN_FORMDATA;
        });
    }

    getFormData(data) {
        const formData = new FormData();
        for (const [key, value] of Object.entries(data)) {
            formData.append(key, value);
        }
        return formData;
    }
}

class CapError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

module.exports = { RestRemoteService };