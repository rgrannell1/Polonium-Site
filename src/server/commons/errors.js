
const {errors} = require('@rgrannell1/utils')

errors.create({name: 'BadRequest', code: 400})
errors.create({name: 'Unauthorized', code: 401})
errors.create({name: 'PaymentRequired', code: 402})
errors.create({name: 'Forbidden', code: 403})
errors.create({name: 'NotFound', code: 404})
errors.create({name: 'MethodNotAllowed', code: 405})
errors.create({name: 'NotAcceptable', code: 406})
errors.create({name: 'ProxyAuthenticationRequired', code: 407})
errors.create({name: 'RequestTimeout', code: 408})
errors.create({name: 'Conflict', code: 409})
errors.create({name: 'Gone', code: 410})
errors.create({name: 'LengthRequired', code: 411})
errors.create({name: 'PreconditionFailed', code: 412})
errors.create({name: 'PayloadTooLarge', code: 413})
errors.create({name: 'URITooLong', code: 414})
errors.create({name: 'UnsupportedMediaType', code: 415})
errors.create({name: 'RangeNotSatisfiable', code: 416})
errors.create({name: 'ExpectationFailed', code: 417})
errors.create({name: 'ImATeapot', code: 418})
errors.create({name: 'MisdirectedRequest', code: 421})
errors.create({name: 'UnprocessableEntity', code: 422})
errors.create({name: 'Locked', code: 423})
errors.create({name: 'FailedDependency', code: 424})
errors.create({name: 'UnorderedCollection', code: 425})
errors.create({name: 'UpgradeRequired', code: 426})
errors.create({name: 'PreconditionRequired', code: 428})
errors.create({name: 'TooManyRequests', code: 429})
errors.create({name: 'RequestHeaderFieldsTooLarge', code: 431})
errors.create({name: 'UnavailableForLegalReasons', code: 451})
errors.create({name: 'InternalServerError', code: 500})
errors.create({name: 'NotImplemented', code: 501})
errors.create({name: 'BadGateway', code: 502})
errors.create({name: 'ServiceUnavailable', code: 503})
errors.create({name: 'GatewayTimeout', code: 504})
errors.create({name: 'HTTPVersionNotSupported', code: 505})
errors.create({name: 'VariantAlsoNegotiates', code: 506})
errors.create({name: 'InsufficientStorage', code: 507})
errors.create({name: 'LoopDetected', code: 508})
errors.create({name: 'BandwidthLimitExceeded', code: 509})
errors.create({name: 'NotExtended', code: 510})
errors.create({name: 'NetworkAuthenticationRequired', code: 511})
