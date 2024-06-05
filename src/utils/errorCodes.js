module.exports = {
    NOT_FOUND: {
        message: "El recurso solicitado no fue encontrado.",
        statusCode: 404
    },
    INVALID_PARAM: {
        message: "El parámetro proporcionado es inválido.",
        statusCode: 400
    },
    MISSING_FIELDS: {
        message: "Hay campos faltantes.",
        statusCode: 400
    },
    UNAUTHORIZED: {
        message: "Acceso denegado. No tienes permiso para acceder a este recurso.",
        statusCode: 401
    },
    FORBIDDEN: {
        message: "Prohibido. No tienes los permisos necesarios para realizar esta acción.",
        statusCode: 403
    },
    BAD_REQUEST: {
        message: "Solicitud incorrecta. Comprueba la entrada.",
        statusCode: 400
    },
    CONFLICT: {
        message: "Conflicto. El recurso ya existe.",
        statusCode: 409
    },
    PAYLOAD_TOO_LARGE: {
        message: "La carga útil de la solicitud es demasiado grande.",
        statusCode: 413
    },
    UNSUPPORTED_MEDIA_TYPE: {
        message: "Tipo de medio no soportado.",
        statusCode: 415
    },
    TOO_MANY_REQUESTS: {
        message: "Demasiadas solicitudes. Por favor, intenta de nuevo más tarde.",
        statusCode: 429
    },
    INTERNAL_SERVER_ERROR: {
        message: "Un error interno del servidor ocurrió mientras procesábamos tu solicitud.",
        statusCode: 500
    },
    NOT_IMPLEMENTED: {
        message: "La funcionalidad solicitada no ha sido implementada.",
        statusCode: 501
    },
    SERVICE_UNAVAILABLE: {
        message: "El servicio no está disponible temporalmente. Por favor, intenta de nuevo más tarde.",
        statusCode: 503
    },
    GATEWAY_TIMEOUT: {
        message: "El servidor está sobrecargado o el servicio externo no respondió a tiempo.",
        statusCode: 504
    }
};