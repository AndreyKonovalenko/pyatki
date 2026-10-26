'use strict';
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res, err) =>
  function __init() {
    if (err) throw err[0];
    try {
      return (fn && (res = (0, fn[__getOwnPropNames(fn)[0]])((fn = 0))), res);
    } catch (e) {
      throw ((err = [e]), e);
    }
  };
var __commonJS = (cb, mod) =>
  function __require() {
    try {
      return (
        mod ||
          (0, cb[__getOwnPropNames(cb)[0]])(
            (mod = { exports: {} }).exports,
            mod,
          ),
        mod.exports
      );
    } catch (e) {
      throw ((mod = 0), e);
    }
  };
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if ((from && typeof from === 'object') || typeof from === 'function') {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, {
          get: () => from[key],
          enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable,
        });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (
  (target = mod != null ? __create(__getProtoOf(mod)) : {}),
  __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule
      ? __defProp(target, 'default', { value: mod, enumerable: true })
      : target,
    mod,
  )
);
var __toCommonJS = mod =>
  __copyProps(__defProp({}, '__esModule', { value: true }), mod);

// node_modules/dotenv/lib/main.js
var require_main = __commonJS({
  'node_modules/dotenv/lib/main.js'(exports2, module2) {
    var fs2 = require('fs');
    var path = require('path');
    var os = require('os');
    var crypto = require('crypto');
    var TIPS = [
      '\u25C8 encrypted .env [www.dotenvx.com]',
      '\u25C8 secrets for agents [www.dotenvx.com]',
      '\u2301 auth for agents [www.vestauth.com]',
      "\u2318 custom filepath { path: '/custom/path/.env' }",
      '\u2318 enable debugging { debug: true }',
      '\u2318 override existing { override: true }',
      '\u2318 suppress logs { quiet: true }',
      "\u2318 multiple files { path: ['.env.local', '.env'] }",
    ];
    function _getRandomTip() {
      return TIPS[Math.floor(Math.random() * TIPS.length)];
    }
    function parseBoolean(value) {
      if (typeof value === 'string') {
        return !['false', '0', 'no', 'off', ''].includes(value.toLowerCase());
      }
      return Boolean(value);
    }
    function supportsAnsi() {
      return process.stdout.isTTY;
    }
    function dim(text) {
      return supportsAnsi() ? `\x1B[2m${text}\x1B[0m` : text;
    }
    var LINE =
      /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/gm;
    function parse(src) {
      const obj = {};
      let lines = src.toString();
      lines = lines.replace(/\r\n?/gm, '\n');
      let match;
      while ((match = LINE.exec(lines)) != null) {
        const key = match[1];
        let value = match[2] || '';
        value = value.trim();
        const maybeQuote = value[0];
        value = value.replace(/^(['"`])([\s\S]*)\1$/gm, '$2');
        if (maybeQuote === '"') {
          value = value.replace(/\\n/g, '\n');
          value = value.replace(/\\r/g, '\r');
        }
        obj[key] = value;
      }
      return obj;
    }
    function _parseVault(options) {
      options = options || {};
      const vaultPath = _vaultPath(options);
      options.path = vaultPath;
      const result = DotenvModule.configDotenv(options);
      if (!result.parsed) {
        const err = new Error(
          `MISSING_DATA: Cannot parse ${vaultPath} for an unknown reason`,
        );
        err.code = 'MISSING_DATA';
        throw err;
      }
      const keys = _dotenvKey(options).split(',');
      const length = keys.length;
      let decrypted;
      for (let i = 0; i < length; i++) {
        try {
          const key = keys[i].trim();
          const attrs = _instructions(result, key);
          decrypted = DotenvModule.decrypt(attrs.ciphertext, attrs.key);
          break;
        } catch (error) {
          if (i + 1 >= length) {
            throw error;
          }
        }
      }
      return DotenvModule.parse(decrypted);
    }
    function _warn(message) {
      console.error(`\u26A0 ${message}`);
    }
    function _debug(message) {
      console.log(`\u2506 ${message}`);
    }
    function _log(message) {
      console.log(`\u25C7 ${message}`);
    }
    function _dotenvKey(options) {
      if (options && options.DOTENV_KEY && options.DOTENV_KEY.length > 0) {
        return options.DOTENV_KEY;
      }
      if (process.env.DOTENV_KEY && process.env.DOTENV_KEY.length > 0) {
        return process.env.DOTENV_KEY;
      }
      return '';
    }
    function _instructions(result, dotenvKey) {
      let uri;
      try {
        uri = new URL(dotenvKey);
      } catch (error) {
        if (error.code === 'ERR_INVALID_URL') {
          const err = new Error(
            'INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=development',
          );
          err.code = 'INVALID_DOTENV_KEY';
          throw err;
        }
        throw error;
      }
      const key = uri.password;
      if (!key) {
        const err = new Error('INVALID_DOTENV_KEY: Missing key part');
        err.code = 'INVALID_DOTENV_KEY';
        throw err;
      }
      const environment = uri.searchParams.get('environment');
      if (!environment) {
        const err = new Error('INVALID_DOTENV_KEY: Missing environment part');
        err.code = 'INVALID_DOTENV_KEY';
        throw err;
      }
      const environmentKey = `DOTENV_VAULT_${environment.toUpperCase()}`;
      const ciphertext = result.parsed[environmentKey];
      if (!ciphertext) {
        const err = new Error(
          `NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${environmentKey} in your .env.vault file.`,
        );
        err.code = 'NOT_FOUND_DOTENV_ENVIRONMENT';
        throw err;
      }
      return { ciphertext, key };
    }
    function _vaultPath(options) {
      let possibleVaultPath = null;
      if (options && options.path && options.path.length > 0) {
        if (Array.isArray(options.path)) {
          for (const filepath of options.path) {
            if (fs2.existsSync(filepath)) {
              possibleVaultPath = filepath.endsWith('.vault')
                ? filepath
                : `${filepath}.vault`;
            }
          }
        } else {
          possibleVaultPath = options.path.endsWith('.vault')
            ? options.path
            : `${options.path}.vault`;
        }
      } else {
        possibleVaultPath = path.resolve(process.cwd(), '.env.vault');
      }
      if (fs2.existsSync(possibleVaultPath)) {
        return possibleVaultPath;
      }
      return null;
    }
    function _resolveHome(envPath) {
      return envPath[0] === '~'
        ? path.join(os.homedir(), envPath.slice(1))
        : envPath;
    }
    function _configVault(options) {
      const debug = parseBoolean(
        process.env.DOTENV_CONFIG_DEBUG || (options && options.debug),
      );
      const quiet = parseBoolean(
        process.env.DOTENV_CONFIG_QUIET || (options && options.quiet),
      );
      if (debug || !quiet) {
        _log('loading env from encrypted .env.vault');
      }
      const parsed = DotenvModule._parseVault(options);
      let processEnv = process.env;
      if (options && options.processEnv != null) {
        processEnv = options.processEnv;
      }
      DotenvModule.populate(processEnv, parsed, options);
      return { parsed };
    }
    function configDotenv(options) {
      const dotenvPath = path.resolve(process.cwd(), '.env');
      let encoding = 'utf8';
      let processEnv = process.env;
      if (options && options.processEnv != null) {
        processEnv = options.processEnv;
      }
      let debug = parseBoolean(
        processEnv.DOTENV_CONFIG_DEBUG || (options && options.debug),
      );
      let quiet = parseBoolean(
        processEnv.DOTENV_CONFIG_QUIET || (options && options.quiet),
      );
      if (options && options.encoding) {
        encoding = options.encoding;
      } else {
        if (debug) {
          _debug('no encoding is specified (UTF-8 is used by default)');
        }
      }
      let optionPaths = [dotenvPath];
      if (options && options.path) {
        if (!Array.isArray(options.path)) {
          optionPaths = [_resolveHome(options.path)];
        } else {
          optionPaths = [];
          for (const filepath of options.path) {
            optionPaths.push(_resolveHome(filepath));
          }
        }
      }
      let lastError;
      const parsedAll = {};
      for (const path2 of optionPaths) {
        try {
          const parsed = DotenvModule.parse(
            fs2.readFileSync(path2, { encoding }),
          );
          DotenvModule.populate(parsedAll, parsed, options);
        } catch (e) {
          if (debug) {
            _debug(`failed to load ${path2} ${e.message}`);
          }
          lastError = e;
        }
      }
      const populated = DotenvModule.populate(processEnv, parsedAll, options);
      debug = parseBoolean(processEnv.DOTENV_CONFIG_DEBUG || debug);
      quiet = parseBoolean(processEnv.DOTENV_CONFIG_QUIET || quiet);
      if (debug || !quiet) {
        const keysCount = Object.keys(populated).length;
        const shortPaths = [];
        for (const filePath of optionPaths) {
          try {
            const relative = path.relative(process.cwd(), filePath);
            shortPaths.push(relative);
          } catch (e) {
            if (debug) {
              _debug(`failed to load ${filePath} ${e.message}`);
            }
            lastError = e;
          }
        }
        _log(
          `injected env (${keysCount}) from ${shortPaths.join(',')} ${dim(`// tip: ${_getRandomTip()}`)}`,
        );
      }
      if (lastError) {
        return { parsed: parsedAll, error: lastError };
      } else {
        return { parsed: parsedAll };
      }
    }
    function config(options) {
      if (_dotenvKey(options).length === 0) {
        return DotenvModule.configDotenv(options);
      }
      const vaultPath = _vaultPath(options);
      if (!vaultPath) {
        _warn(
          `you set DOTENV_KEY but you are missing a .env.vault file at ${vaultPath}`,
        );
        return DotenvModule.configDotenv(options);
      }
      return DotenvModule._configVault(options);
    }
    function decrypt(encrypted, keyStr) {
      const key = Buffer.from(keyStr.slice(-64), 'hex');
      let ciphertext = Buffer.from(encrypted, 'base64');
      const nonce = ciphertext.subarray(0, 12);
      const authTag = ciphertext.subarray(-16);
      ciphertext = ciphertext.subarray(12, -16);
      try {
        const aesgcm = crypto.createDecipheriv('aes-256-gcm', key, nonce);
        aesgcm.setAuthTag(authTag);
        return `${aesgcm.update(ciphertext)}${aesgcm.final()}`;
      } catch (error) {
        const isRange = error instanceof RangeError;
        const invalidKeyLength = error.message === 'Invalid key length';
        const decryptionFailed =
          error.message === 'Unsupported state or unable to authenticate data';
        if (isRange || invalidKeyLength) {
          const err = new Error(
            'INVALID_DOTENV_KEY: It must be 64 characters long (or more)',
          );
          err.code = 'INVALID_DOTENV_KEY';
          throw err;
        } else if (decryptionFailed) {
          const err = new Error(
            'DECRYPTION_FAILED: Please check your DOTENV_KEY',
          );
          err.code = 'DECRYPTION_FAILED';
          throw err;
        } else {
          throw error;
        }
      }
    }
    function populate(processEnv, parsed, options = {}) {
      const debug = Boolean(options && options.debug);
      const override = Boolean(options && options.override);
      const populated = {};
      if (typeof parsed !== 'object') {
        const err = new Error(
          'OBJECT_REQUIRED: Please check the processEnv argument being passed to populate',
        );
        err.code = 'OBJECT_REQUIRED';
        throw err;
      }
      for (const key of Object.keys(parsed)) {
        if (Object.prototype.hasOwnProperty.call(processEnv, key)) {
          if (override === true) {
            processEnv[key] = parsed[key];
            populated[key] = parsed[key];
          }
          if (debug) {
            if (override === true) {
              _debug(`"${key}" is already defined and WAS overwritten`);
            } else {
              _debug(`"${key}" is already defined and was NOT overwritten`);
            }
          }
        } else {
          processEnv[key] = parsed[key];
          populated[key] = parsed[key];
        }
      }
      return populated;
    }
    var DotenvModule = {
      configDotenv,
      _configVault,
      _parseVault,
      config,
      decrypt,
      parse,
      populate,
    };
    module2.exports.configDotenv = DotenvModule.configDotenv;
    module2.exports._configVault = DotenvModule._configVault;
    module2.exports._parseVault = DotenvModule._parseVault;
    module2.exports.config = DotenvModule.config;
    module2.exports.decrypt = DotenvModule.decrypt;
    module2.exports.parse = DotenvModule.parse;
    module2.exports.populate = DotenvModule.populate;
    module2.exports = DotenvModule;
  },
});

// dist/utils/utils.js
var require_utils = __commonJS({
  'dist/utils/utils.js'(exports2) {
    'use strict';
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.validEnv = validEnv;
    exports2.isValidInn = isValidInn;
    function validEnv(name, variableName) {
      if (!name) {
        throw new Error(
          variableName
            ? `Missing evironment variable:${variableName}`
            : 'Missing required environment variable',
        );
      }
      return name;
    }
    function isValidInn(value) {
      const INN_PATTERN = /^\d{10}$|^\d{12}$/;
      return INN_PATTERN.test(value);
    }
  },
});

// dist/config.js
var require_config = __commonJS({
  'dist/config.js'(exports2) {
    'use strict';
    var __importDefault =
      (exports2 && exports2.__importDefault) ||
      function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
      };
    Object.defineProperty(exports2, '__esModule', { value: true });
    var dotenv_1 = __importDefault(require_main());
    var utils_1 = require_utils();
    var envFound = dotenv_1.default.config({ path: '.env' });
    if (envFound.error) {
      throw new Error('no .env file found');
    }
    exports2.default = {
      nodeEnv: process.env.NODE_ENV,
      auth: {
        username: (0, utils_1.validEnv)(process.env.USERNAME),
        password: (0, utils_1.validEnv)(process.env.PASSWORD),
        tokenName: (0, utils_1.validEnv)(process.env.TOKEN_NAME),
      },
      endpoints: {
        baseURL: (0, utils_1.validEnv)(process.env.BASE_URL),
        login: (0, utils_1.validEnv)(process.env.LOGIN),
        check_balance: (0, utils_1.validEnv)(
          process.env.CHECK_BALANCE,
          'CHECK_BALANCE',
        ),
        get_company_card: (0, utils_1.validEnv)(
          process.env.GET_COMPANY_CARD,
          'GET_COMPANY_CARD',
        ),
        get_company_court_cases: (0, utils_1.validEnv)(
          process.env.GET_COMPANY_COURT_CASES,
          'GET_COMPANY_COURT_CASES',
        ),
        get_company_bailiffs: (0, utils_1.validEnv)(
          process.env.GET_COMPANY_BAILIFFS,
          'GET_COMPANY_BAILIFFS',
        ),
        get_company_owners: (0, utils_1.validEnv)(
          process.env.GET_COMPANY_OWNERS,
          'GET_COMPANY_OWNERS',
        ),
        get_company_financial_report: (0, utils_1.validEnv)(
          process.env.GET_COMPANY_FINANCIAL_REPORT,
          'GET_COMPANY_FINANCIAL_REPORT',
        ),
        get_company_suppliers_blacklist: (0, utils_1.validEnv)(
          process.env.GET_COMPANY_SUPPLIERS_BLACKLIST,
          'GET_COMPANY_SUPPLIERS_BLACKLIST',
        ),
        get_entrepreneur_card: (0, utils_1.validEnv)(
          process.env.GET_ENTERPRENEUR_CARD,
          'GET_ENTERPRENEUR_CARD',
        ),
      },
    };
  },
});

// node_modules/tough-cookie/dist/pathMatch.js
var require_pathMatch = __commonJS({
  'node_modules/tough-cookie/dist/pathMatch.js'(exports2) {
    'use strict';
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.pathMatch = pathMatch2;
    function pathMatch2(reqPath, cookiePath) {
      if (cookiePath === reqPath) {
        return true;
      }
      const idx = reqPath.indexOf(cookiePath);
      if (idx === 0) {
        if (cookiePath[cookiePath.length - 1] === '/') {
          return true;
        }
        if (
          new RegExp(`^${cookiePath}`).test(reqPath) &&
          reqPath[cookiePath.length] === '/'
        ) {
          return true;
        }
      }
      return false;
    }
  },
});

// node_modules/tldts/dist/cjs/index.js
var require_cjs = __commonJS({
  'node_modules/tldts/dist/cjs/index.js'(exports2) {
    'use strict';
    function shareSameDomainSuffix(hostname, vhost) {
      if (hostname.endsWith(vhost)) {
        return (
          hostname.length === vhost.length ||
          hostname[hostname.length - vhost.length - 1] === '.'
        );
      }
      return false;
    }
    function extractDomainWithSuffix(hostname, publicSuffix) {
      const publicSuffixIndex = hostname.length - publicSuffix.length - 2;
      const lastDotBeforeSuffixIndex = hostname.lastIndexOf(
        '.',
        publicSuffixIndex,
      );
      if (lastDotBeforeSuffixIndex === -1) {
        return hostname;
      }
      return hostname.slice(lastDotBeforeSuffixIndex + 1);
    }
    function getDomain$1(suffix, hostname, options) {
      if (options.validHosts !== null) {
        const validHosts = options.validHosts;
        for (const vhost of validHosts) {
          if (
            /*@__INLINE__*/
            shareSameDomainSuffix(hostname, vhost)
          ) {
            return vhost;
          }
        }
      }
      let numberOfLeadingDots = 0;
      if (hostname.startsWith('.')) {
        while (
          numberOfLeadingDots < hostname.length &&
          hostname[numberOfLeadingDots] === '.'
        ) {
          numberOfLeadingDots += 1;
        }
      }
      if (suffix.length === hostname.length - numberOfLeadingDots) {
        return null;
      }
      return (
        /*@__INLINE__*/
        extractDomainWithSuffix(hostname, suffix)
      );
    }
    function getDomainWithoutSuffix$1(domain, suffix) {
      return domain.slice(0, -suffix.length - 1);
    }
    function extractHostname(url, urlIsValidHostname) {
      let start = 0;
      let end = url.length;
      let hasUpper = false;
      if (!urlIsValidHostname) {
        if (url.startsWith('data:')) {
          return null;
        }
        while (start < url.length && url.charCodeAt(start) <= 32) {
          start += 1;
        }
        while (end > start + 1 && url.charCodeAt(end - 1) <= 32) {
          end -= 1;
        }
        if (url.charCodeAt(start) === 47 && url.charCodeAt(start + 1) === 47) {
          start += 2;
        } else {
          const indexOfProtocol = url.indexOf(':/', start);
          if (indexOfProtocol !== -1) {
            const protocolSize = indexOfProtocol - start;
            const c0 = url.charCodeAt(start);
            const c1 = url.charCodeAt(start + 1);
            const c2 = url.charCodeAt(start + 2);
            const c3 = url.charCodeAt(start + 3);
            const c4 = url.charCodeAt(start + 4);
            if (
              protocolSize === 5 &&
              c0 === 104 &&
              c1 === 116 &&
              c2 === 116 &&
              c3 === 112 &&
              c4 === 115
            );
            else if (
              protocolSize === 4 &&
              c0 === 104 &&
              c1 === 116 &&
              c2 === 116 &&
              c3 === 112
            );
            else if (
              protocolSize === 3 &&
              c0 === 119 &&
              c1 === 115 &&
              c2 === 115
            );
            else if (protocolSize === 2 && c0 === 119 && c1 === 115);
            else {
              for (let i = start; i < indexOfProtocol; i += 1) {
                const lowerCaseCode = url.charCodeAt(i) | 32;
                if (!(
                  (lowerCaseCode >= 97 && lowerCaseCode <= 122) || // [a, z]
                  (lowerCaseCode >= 48 && lowerCaseCode <= 57) || // [0, 9]
                  lowerCaseCode === 46 || // '.'
                  lowerCaseCode === 45 || // '-'
                  lowerCaseCode === 43
                )) {
                  return null;
                }
              }
            }
            start = indexOfProtocol + 2;
            while (url.charCodeAt(start) === 47) {
              start += 1;
            }
          }
        }
        let indexOfIdentifier = -1;
        let indexOfClosingBracket = -1;
        let indexOfPort = -1;
        for (let i = start; i < end; i += 1) {
          const code = url.charCodeAt(i);
          if (
            code === 35 || // '#'
            code === 47 || // '/'
            code === 63
          ) {
            end = i;
            break;
          } else if (code === 64) {
            indexOfIdentifier = i;
          } else if (code === 93) {
            indexOfClosingBracket = i;
          } else if (code === 58) {
            indexOfPort = i;
          } else if (code >= 65 && code <= 90) {
            hasUpper = true;
          }
        }
        if (
          indexOfIdentifier !== -1 &&
          indexOfIdentifier > start &&
          indexOfIdentifier < end
        ) {
          start = indexOfIdentifier + 1;
        }
        if (url.charCodeAt(start) === 91) {
          if (indexOfClosingBracket !== -1) {
            return url.slice(start + 1, indexOfClosingBracket).toLowerCase();
          }
          return null;
        } else if (
          indexOfPort !== -1 &&
          indexOfPort > start &&
          indexOfPort < end
        ) {
          end = indexOfPort;
        }
      }
      while (end > start + 1 && url.charCodeAt(end - 1) === 46) {
        end -= 1;
      }
      const hostname =
        start !== 0 || end !== url.length ? url.slice(start, end) : url;
      if (hasUpper) {
        return hostname.toLowerCase();
      }
      return hostname;
    }
    function isProbablyIpv4(hostname) {
      if (hostname.length < 7) {
        return false;
      }
      if (hostname.length > 15) {
        return false;
      }
      let numberOfDots = 0;
      for (let i = 0; i < hostname.length; i += 1) {
        const code = hostname.charCodeAt(i);
        if (code === 46) {
          numberOfDots += 1;
        } else if (code < 48 || code > 57) {
          return false;
        }
      }
      return (
        numberOfDots === 3 &&
        hostname.charCodeAt(0) !== 46 &&
        hostname.charCodeAt(hostname.length - 1) !== 46
      );
    }
    function isProbablyIpv6(hostname) {
      if (hostname.length < 3) {
        return false;
      }
      let start = hostname.startsWith('[') ? 1 : 0;
      let end = hostname.length;
      if (hostname[end - 1] === ']') {
        end -= 1;
      }
      if (end - start > 39) {
        return false;
      }
      let hasColon = false;
      for (; start < end; start += 1) {
        const code = hostname.charCodeAt(start);
        if (code === 58) {
          hasColon = true;
        } else if (!(
          (code >= 48 && code <= 57) || // 0-9
          (code >= 97 && code <= 102) || // a-f
          (code >= 65 && code <= 90)
        )) {
          return false;
        }
      }
      return hasColon;
    }
    function isIp(hostname) {
      return isProbablyIpv6(hostname) || isProbablyIpv4(hostname);
    }
    function isValidAscii(code) {
      return (
        (code >= 97 && code <= 122) || (code >= 48 && code <= 57) || code > 127
      );
    }
    function isValidHostname(hostname) {
      if (hostname.length > 255) {
        return false;
      }
      if (hostname.length === 0) {
        return false;
      }
      if (
        /*@__INLINE__*/
        !isValidAscii(hostname.charCodeAt(0)) &&
        hostname.charCodeAt(0) !== 46 && // '.' (dot)
        hostname.charCodeAt(0) !== 95
      ) {
        return false;
      }
      let lastDotIndex = -1;
      let lastCharCode = -1;
      const len = hostname.length;
      for (let i = 0; i < len; i += 1) {
        const code = hostname.charCodeAt(i);
        if (code === 46) {
          if (
            // Check that previous label is < 63 bytes long (64 = 63 + '.')
            i - lastDotIndex > 64 || // Check that previous character was not already a '.'
            lastCharCode === 46 || // Check that the previous label does not end with a '-' (dash)
            lastCharCode === 45 || // Check that the previous label does not end with a '_' (underscore)
            lastCharCode === 95
          ) {
            return false;
          }
          lastDotIndex = i;
        } else if (!(
          /*@__INLINE__*/
          isValidAscii(code) || code === 45 || code === 95
        )) {
          return false;
        }
        lastCharCode = code;
      }
      return (
        // Check that last label is shorter than 63 chars
        len - lastDotIndex - 1 <= 63 && // Check that the last character is an allowed trailing label character.
        // Since we already checked that the char is a valid hostname character,
        // we only need to check that it's different from '-'.
        lastCharCode !== 45
      );
    }
    function setDefaultsImpl({
      allowIcannDomains = true,
      allowPrivateDomains = false,
      detectIp = true,
      extractHostname: extractHostname2 = true,
      mixedInputs = true,
      validHosts = null,
      validateHostname = true,
    }) {
      return {
        allowIcannDomains,
        allowPrivateDomains,
        detectIp,
        extractHostname: extractHostname2,
        mixedInputs,
        validHosts,
        validateHostname,
      };
    }
    var DEFAULT_OPTIONS =
      /*@__INLINE__*/
      setDefaultsImpl({});
    function setDefaults(options) {
      if (options === void 0) {
        return DEFAULT_OPTIONS;
      }
      return (
        /*@__INLINE__*/
        setDefaultsImpl(options)
      );
    }
    function getSubdomain$1(hostname, domain) {
      if (domain.length === hostname.length) {
        return '';
      }
      return hostname.slice(0, -domain.length - 1);
    }
    function getEmptyResult() {
      return {
        domain: null,
        domainWithoutSuffix: null,
        hostname: null,
        isIcann: null,
        isIp: null,
        isPrivate: null,
        publicSuffix: null,
        subdomain: null,
      };
    }
    function resetResult(result) {
      result.domain = null;
      result.domainWithoutSuffix = null;
      result.hostname = null;
      result.isIcann = null;
      result.isIp = null;
      result.isPrivate = null;
      result.publicSuffix = null;
      result.subdomain = null;
    }
    function parseImpl(url, step, suffixLookup2, partialOptions, result) {
      const options =
        /*@__INLINE__*/
        setDefaults(partialOptions);
      if (typeof url !== 'string') {
        return result;
      }
      if (!options.extractHostname) {
        result.hostname = url;
      } else if (options.mixedInputs) {
        result.hostname = extractHostname(url, isValidHostname(url));
      } else {
        result.hostname = extractHostname(url, false);
      }
      if (step === 0 || result.hostname === null) {
        return result;
      }
      if (options.detectIp) {
        result.isIp = isIp(result.hostname);
        if (result.isIp) {
          return result;
        }
      }
      if (
        options.validateHostname &&
        options.extractHostname &&
        !isValidHostname(result.hostname)
      ) {
        result.hostname = null;
        return result;
      }
      suffixLookup2(result.hostname, options, result);
      if (step === 2 || result.publicSuffix === null) {
        return result;
      }
      result.domain = getDomain$1(
        result.publicSuffix,
        result.hostname,
        options,
      );
      if (step === 3 || result.domain === null) {
        return result;
      }
      result.subdomain = getSubdomain$1(result.hostname, result.domain);
      if (step === 4) {
        return result;
      }
      result.domainWithoutSuffix = getDomainWithoutSuffix$1(
        result.domain,
        result.publicSuffix,
      );
      return result;
    }
    function fastPathLookup(hostname, options, out) {
      if (!options.allowPrivateDomains && hostname.length > 3) {
        const last = hostname.length - 1;
        const c3 = hostname.charCodeAt(last);
        const c2 = hostname.charCodeAt(last - 1);
        const c1 = hostname.charCodeAt(last - 2);
        const c0 = hostname.charCodeAt(last - 3);
        if (c3 === 109 && c2 === 111 && c1 === 99 && c0 === 46) {
          out.isIcann = true;
          out.isPrivate = false;
          out.publicSuffix = 'com';
          return true;
        } else if (c3 === 103 && c2 === 114 && c1 === 111 && c0 === 46) {
          out.isIcann = true;
          out.isPrivate = false;
          out.publicSuffix = 'org';
          return true;
        } else if (c3 === 117 && c2 === 100 && c1 === 101 && c0 === 46) {
          out.isIcann = true;
          out.isPrivate = false;
          out.publicSuffix = 'edu';
          return true;
        } else if (c3 === 118 && c2 === 111 && c1 === 103 && c0 === 46) {
          out.isIcann = true;
          out.isPrivate = false;
          out.publicSuffix = 'gov';
          return true;
        } else if (c3 === 116 && c2 === 101 && c1 === 110 && c0 === 46) {
          out.isIcann = true;
          out.isPrivate = false;
          out.publicSuffix = 'net';
          return true;
        } else if (c3 === 101 && c2 === 100 && c1 === 46) {
          out.isIcann = true;
          out.isPrivate = false;
          out.publicSuffix = 'de';
          return true;
        }
      }
      return false;
    }
    var exceptions = /* @__PURE__ */ (function () {
      const _0 = [1, {}],
        _1 = [2, {}],
        _2 = [0, { city: _0 }];
      const exceptions2 = [
        0,
        {
          ck: [0, { www: _0 }],
          jp: [
            0,
            {
              kawasaki: _2,
              kitakyushu: _2,
              kobe: _2,
              nagoya: _2,
              sapporo: _2,
              sendai: _2,
              yokohama: _2,
            },
          ],
          dev: [
            0,
            {
              hrsn: [
                0,
                {
                  psl: [
                    0,
                    { wc: [0, { ignored: _1, sub: [0, { ignored: _1 }] }] },
                  ],
                },
              ],
            },
          ],
        },
      ];
      return exceptions2;
    })();
    var rules = /* @__PURE__ */ (function () {
      const _3 = [1, {}],
        _4 = [2, {}],
        _5 = [1, { com: _3, edu: _3, gov: _3, net: _3, org: _3 }],
        _6 = [1, { com: _3, edu: _3, gov: _3, mil: _3, net: _3, org: _3 }],
        _7 = [0, { '*': _4 }],
        _8 = [2, { s: _7 }],
        _9 = [0, { relay: _4 }],
        _10 = [2, { id: _4 }],
        _11 = [1, { gov: _3 }],
        _12 = [0, { 'transfer-webapp': _4 }],
        _13 = [0, { notebook: _4, studio: _4 }],
        _14 = [0, { labeling: _4, notebook: _4, studio: _4 }],
        _15 = [0, { notebook: _4 }],
        _16 = [
          0,
          { labeling: _4, notebook: _4, 'notebook-fips': _4, studio: _4 },
        ],
        _17 = [
          0,
          { notebook: _4, 'notebook-fips': _4, studio: _4, 'studio-fips': _4 },
        ],
        _18 = [0, { '*': _3 }],
        _19 = [1, { co: _4 }],
        _20 = [0, { objects: _4 }],
        _21 = [2, { nodes: _4 }],
        _22 = [0, { my: _7 }],
        _23 = [0, { s3: _4, 's3-accesspoint': _4, 's3-website': _4 }],
        _24 = [0, { s3: _4, 's3-accesspoint': _4 }],
        _25 = [0, { direct: _4 }],
        _26 = [0, { 'webview-assets': _4 }],
        _27 = [0, { vfs: _4, 'webview-assets': _4 }],
        _28 = [
          0,
          {
            'execute-api': _4,
            'emrappui-prod': _4,
            'emrnotebooks-prod': _4,
            'emrstudio-prod': _4,
            dualstack: _23,
            s3: _4,
            's3-accesspoint': _4,
            's3-object-lambda': _4,
            's3-website': _4,
            'aws-cloud9': _26,
            cloud9: _27,
          },
        ],
        _29 = [
          0,
          {
            'execute-api': _4,
            'emrappui-prod': _4,
            'emrnotebooks-prod': _4,
            'emrstudio-prod': _4,
            dualstack: _24,
            s3: _4,
            's3-accesspoint': _4,
            's3-object-lambda': _4,
            's3-website': _4,
            'aws-cloud9': _26,
            cloud9: _27,
          },
        ],
        _30 = [
          0,
          {
            'execute-api': _4,
            'emrappui-prod': _4,
            'emrnotebooks-prod': _4,
            'emrstudio-prod': _4,
            dualstack: _23,
            s3: _4,
            's3-accesspoint': _4,
            's3-object-lambda': _4,
            's3-website': _4,
            'analytics-gateway': _4,
            'aws-cloud9': _26,
            cloud9: _27,
          },
        ],
        _31 = [
          0,
          {
            'execute-api': _4,
            'emrappui-prod': _4,
            'emrnotebooks-prod': _4,
            'emrstudio-prod': _4,
            dualstack: _23,
            s3: _4,
            's3-accesspoint': _4,
            's3-object-lambda': _4,
            's3-website': _4,
          },
        ],
        _32 = [
          0,
          {
            s3: _4,
            's3-accesspoint': _4,
            's3-accesspoint-fips': _4,
            's3-fips': _4,
            's3-website': _4,
          },
        ],
        _33 = [
          0,
          {
            'execute-api': _4,
            'emrappui-prod': _4,
            'emrnotebooks-prod': _4,
            'emrstudio-prod': _4,
            dualstack: _32,
            s3: _4,
            's3-accesspoint': _4,
            's3-accesspoint-fips': _4,
            's3-fips': _4,
            's3-object-lambda': _4,
            's3-website': _4,
            'aws-cloud9': _26,
            cloud9: _27,
          },
        ],
        _34 = [
          0,
          {
            'execute-api': _4,
            'emrappui-prod': _4,
            'emrnotebooks-prod': _4,
            'emrstudio-prod': _4,
            dualstack: _32,
            s3: _4,
            's3-accesspoint': _4,
            's3-accesspoint-fips': _4,
            's3-deprecated': _4,
            's3-fips': _4,
            's3-object-lambda': _4,
            's3-website': _4,
            'analytics-gateway': _4,
            'aws-cloud9': _26,
            cloud9: _27,
          },
        ],
        _35 = [
          0,
          {
            s3: _4,
            's3-accesspoint': _4,
            's3-accesspoint-fips': _4,
            's3-fips': _4,
          },
        ],
        _36 = [
          0,
          {
            'execute-api': _4,
            'emrappui-prod': _4,
            'emrnotebooks-prod': _4,
            'emrstudio-prod': _4,
            dualstack: _35,
            s3: _4,
            's3-accesspoint': _4,
            's3-accesspoint-fips': _4,
            's3-fips': _4,
            's3-object-lambda': _4,
            's3-website': _4,
          },
        ],
        _37 = [0, { auth: _4 }],
        _38 = [0, { auth: _4, 'auth-fips': _4 }],
        _39 = [0, { 'auth-fips': _4 }],
        _40 = [0, { apps: _4 }],
        _41 = [0, { paas: _4 }],
        _42 = [2, { eu: _4 }],
        _43 = [0, { app: _4 }],
        _44 = [0, { site: _4 }],
        _45 = [1, { com: _3, edu: _3, net: _3, org: _3 }],
        _46 = [0, { j: _4 }],
        _47 = [0, { dyn: _4 }],
        _48 = [1, { co: _3, com: _3, edu: _3, gov: _3, net: _3, org: _3 }],
        _49 = [0, { p: _4 }],
        _50 = [0, { user: _4 }],
        _51 = [0, { shop: _4 }],
        _52 = [0, { cdn: _4 }],
        _53 = [0, { cust: _4, reservd: _4 }],
        _54 = [0, { cust: _4 }],
        _55 = [0, { s3: _4 }],
        _56 = [
          1,
          { biz: _3, com: _3, edu: _3, gov: _3, info: _3, net: _3, org: _3 },
        ],
        _57 = [0, { ipfs: _4 }],
        _58 = [1, { framer: _4 }],
        _59 = [0, { forgot: _4 }],
        _60 = [1, { gs: _3 }],
        _61 = [0, { nes: _3 }],
        _62 = [1, { k12: _3, cc: _3, lib: _3 }],
        _63 = [1, { cc: _3, lib: _3 }];
      const rules2 = [
        0,
        {
          ac: [
            1,
            {
              com: _3,
              edu: _3,
              gov: _3,
              mil: _3,
              net: _3,
              org: _3,
              drr: _4,
              feedback: _4,
              forms: _4,
            },
          ],
          ad: _3,
          ae: [
            1,
            { ac: _3, co: _3, gov: _3, mil: _3, net: _3, org: _3, sch: _3 },
          ],
          aero: [
            1,
            {
              airline: _3,
              airport: _3,
              'accident-investigation': _3,
              'accident-prevention': _3,
              aerobatic: _3,
              aeroclub: _3,
              aerodrome: _3,
              agents: _3,
              'air-surveillance': _3,
              'air-traffic-control': _3,
              aircraft: _3,
              airtraffic: _3,
              ambulance: _3,
              association: _3,
              author: _3,
              ballooning: _3,
              broker: _3,
              caa: _3,
              cargo: _3,
              catering: _3,
              certification: _3,
              championship: _3,
              charter: _3,
              civilaviation: _3,
              club: _3,
              conference: _3,
              consultant: _3,
              consulting: _3,
              control: _3,
              council: _3,
              crew: _3,
              design: _3,
              dgca: _3,
              educator: _3,
              emergency: _3,
              engine: _3,
              engineer: _3,
              entertainment: _3,
              equipment: _3,
              exchange: _3,
              express: _3,
              federation: _3,
              flight: _3,
              freight: _3,
              fuel: _3,
              gliding: _3,
              government: _3,
              groundhandling: _3,
              group: _3,
              hanggliding: _3,
              homebuilt: _3,
              insurance: _3,
              journal: _3,
              journalist: _3,
              leasing: _3,
              logistics: _3,
              magazine: _3,
              maintenance: _3,
              marketplace: _3,
              media: _3,
              microlight: _3,
              modelling: _3,
              navigation: _3,
              parachuting: _3,
              paragliding: _3,
              'passenger-association': _3,
              pilot: _3,
              press: _3,
              production: _3,
              recreation: _3,
              repbody: _3,
              res: _3,
              research: _3,
              rotorcraft: _3,
              safety: _3,
              scientist: _3,
              services: _3,
              show: _3,
              skydiving: _3,
              software: _3,
              student: _3,
              taxi: _3,
              trader: _3,
              trading: _3,
              trainer: _3,
              union: _3,
              workinggroup: _3,
              works: _3,
            },
          ],
          af: _5,
          ag: [1, { co: _3, com: _3, net: _3, nom: _3, org: _3, obj: _4 }],
          ai: [1, { com: _3, net: _3, off: _3, org: _3, uwu: _4, framer: _4 }],
          al: _6,
          am: [
            1,
            { co: _3, com: _3, commune: _3, net: _3, org: _3, radio: _4 },
          ],
          ao: [
            1,
            {
              co: _3,
              ed: _3,
              edu: _3,
              gov: _3,
              gv: _3,
              it: _3,
              og: _3,
              org: _3,
              pb: _3,
            },
          ],
          aq: _3,
          ar: [
            1,
            {
              bet: _3,
              com: _3,
              coop: _3,
              edu: _3,
              gob: _3,
              gov: _3,
              int: _3,
              mil: _3,
              musica: _3,
              mutual: _3,
              net: _3,
              org: _3,
              seg: _3,
              senasa: _3,
              tur: _3,
            },
          ],
          arpa: [
            1,
            {
              e164: _3,
              home: _3,
              'in-addr': _3,
              ip6: _3,
              iris: _3,
              uri: _3,
              urn: _3,
            },
          ],
          as: _11,
          asia: [1, { cloudns: _4, daemon: _4, dix: _4 }],
          at: [
            1,
            {
              ac: [1, { sth: _3 }],
              co: _3,
              gv: _3,
              or: _3,
              funkfeuer: [0, { wien: _4 }],
              futurecms: [0, { '*': _4, ex: _7, in: _7 }],
              futurehosting: _4,
              futuremailing: _4,
              ortsinfo: [0, { ex: _7, kunden: _7 }],
              biz: _4,
              info: _4,
              '123webseite': _4,
              priv: _4,
              myspreadshop: _4,
              '12hp': _4,
              '2ix': _4,
              '4lima': _4,
              'lima-city': _4,
            },
          ],
          au: [
            1,
            {
              asn: _3,
              com: [1, { cloudlets: [0, { mel: _4 }], myspreadshop: _4 }],
              edu: [
                1,
                {
                  act: _3,
                  catholic: _3,
                  nsw: [1, { schools: _3 }],
                  nt: _3,
                  qld: _3,
                  sa: _3,
                  tas: _3,
                  vic: _3,
                  wa: _3,
                },
              ],
              gov: [1, { qld: _3, sa: _3, tas: _3, vic: _3, wa: _3 }],
              id: _3,
              net: _3,
              org: _3,
              conf: _3,
              oz: _3,
              act: _3,
              nsw: _3,
              nt: _3,
              qld: _3,
              sa: _3,
              tas: _3,
              vic: _3,
              wa: _3,
            },
          ],
          aw: [1, { com: _3 }],
          ax: _3,
          az: [
            1,
            {
              biz: _3,
              co: _3,
              com: _3,
              edu: _3,
              gov: _3,
              info: _3,
              int: _3,
              mil: _3,
              name: _3,
              net: _3,
              org: _3,
              pp: _3,
              pro: _3,
            },
          ],
          ba: [
            1,
            { com: _3, edu: _3, gov: _3, mil: _3, net: _3, org: _3, rs: _4 },
          ],
          bb: [
            1,
            {
              biz: _3,
              co: _3,
              com: _3,
              edu: _3,
              gov: _3,
              info: _3,
              net: _3,
              org: _3,
              store: _3,
              tv: _3,
            },
          ],
          bd: _18,
          be: [
            1,
            {
              ac: _3,
              cloudns: _4,
              webhosting: _4,
              interhostsolutions: [0, { cloud: _4 }],
              kuleuven: [0, { ezproxy: _4 }],
              '123website': _4,
              myspreadshop: _4,
              transurl: _7,
            },
          ],
          bf: _11,
          bg: [
            1,
            {
              0: _3,
              1: _3,
              2: _3,
              3: _3,
              4: _3,
              5: _3,
              6: _3,
              7: _3,
              8: _3,
              9: _3,
              a: _3,
              b: _3,
              c: _3,
              d: _3,
              e: _3,
              f: _3,
              g: _3,
              h: _3,
              i: _3,
              j: _3,
              k: _3,
              l: _3,
              m: _3,
              n: _3,
              o: _3,
              p: _3,
              q: _3,
              r: _3,
              s: _3,
              t: _3,
              u: _3,
              v: _3,
              w: _3,
              x: _3,
              y: _3,
              z: _3,
              barsy: _4,
            },
          ],
          bh: _5,
          bi: [1, { co: _3, com: _3, edu: _3, or: _3, org: _3 }],
          biz: [
            1,
            {
              activetrail: _4,
              'cloud-ip': _4,
              cloudns: _4,
              jozi: _4,
              dyndns: _4,
              'for-better': _4,
              'for-more': _4,
              'for-some': _4,
              'for-the': _4,
              selfip: _4,
              webhop: _4,
              orx: _4,
              mmafan: _4,
              myftp: _4,
              'no-ip': _4,
              dscloud: _4,
            },
          ],
          bj: [
            1,
            {
              africa: _3,
              agro: _3,
              architectes: _3,
              assur: _3,
              avocats: _3,
              co: _3,
              com: _3,
              eco: _3,
              econo: _3,
              edu: _3,
              info: _3,
              loisirs: _3,
              money: _3,
              net: _3,
              org: _3,
              ote: _3,
              restaurant: _3,
              resto: _3,
              tourism: _3,
              univ: _3,
            },
          ],
          bm: _5,
          bn: [1, { com: _3, edu: _3, gov: _3, net: _3, org: _3, co: _4 }],
          bo: [
            1,
            {
              com: _3,
              edu: _3,
              gob: _3,
              int: _3,
              mil: _3,
              net: _3,
              org: _3,
              tv: _3,
              web: _3,
              academia: _3,
              agro: _3,
              arte: _3,
              blog: _3,
              bolivia: _3,
              ciencia: _3,
              cooperativa: _3,
              democracia: _3,
              deporte: _3,
              ecologia: _3,
              economia: _3,
              empresa: _3,
              indigena: _3,
              industria: _3,
              info: _3,
              medicina: _3,
              movimiento: _3,
              musica: _3,
              natural: _3,
              nombre: _3,
              noticias: _3,
              patria: _3,
              plurinacional: _3,
              politica: _3,
              profesional: _3,
              pueblo: _3,
              revista: _3,
              salud: _3,
              tecnologia: _3,
              tksat: _3,
              transporte: _3,
              wiki: _3,
            },
          ],
          br: [
            1,
            {
              '9guacu': _3,
              abc: _3,
              adm: _3,
              adv: _3,
              agr: _3,
              aju: _3,
              am: _3,
              anani: _3,
              aparecida: _3,
              app: _3,
              arq: _3,
              art: _3,
              ato: _3,
              b: _3,
              barueri: _3,
              belem: _3,
              bet: _3,
              bhz: _3,
              bib: _3,
              bio: _3,
              blog: _3,
              bmd: _3,
              boavista: _3,
              bsb: _3,
              campinagrande: _3,
              campinas: _3,
              caxias: _3,
              cim: _3,
              cng: _3,
              cnt: _3,
              com: [1, { simplesite: _4 }],
              contagem: _3,
              coop: _3,
              coz: _3,
              cri: _3,
              cuiaba: _3,
              curitiba: _3,
              def: _3,
              des: _3,
              det: _3,
              dev: _3,
              ecn: _3,
              eco: _3,
              edu: _3,
              emp: _3,
              enf: _3,
              eng: _3,
              esp: _3,
              etc: _3,
              eti: _3,
              far: _3,
              feira: _3,
              flog: _3,
              floripa: _3,
              fm: _3,
              fnd: _3,
              fortal: _3,
              fot: _3,
              foz: _3,
              fst: _3,
              g12: _3,
              geo: _3,
              ggf: _3,
              goiania: _3,
              gov: [
                1,
                {
                  ac: _3,
                  al: _3,
                  am: _3,
                  ap: _3,
                  ba: _3,
                  ce: _3,
                  df: _3,
                  es: _3,
                  go: _3,
                  ma: _3,
                  mg: _3,
                  ms: _3,
                  mt: _3,
                  pa: _3,
                  pb: _3,
                  pe: _3,
                  pi: _3,
                  pr: _3,
                  rj: _3,
                  rn: _3,
                  ro: _3,
                  rr: _3,
                  rs: _3,
                  sc: _3,
                  se: _3,
                  sp: _3,
                  to: _3,
                },
              ],
              gru: _3,
              imb: _3,
              ind: _3,
              inf: _3,
              jab: _3,
              jampa: _3,
              jdf: _3,
              joinville: _3,
              jor: _3,
              jus: _3,
              leg: [
                1,
                {
                  ac: _4,
                  al: _4,
                  am: _4,
                  ap: _4,
                  ba: _4,
                  ce: _4,
                  df: _4,
                  es: _4,
                  go: _4,
                  ma: _4,
                  mg: _4,
                  ms: _4,
                  mt: _4,
                  pa: _4,
                  pb: _4,
                  pe: _4,
                  pi: _4,
                  pr: _4,
                  rj: _4,
                  rn: _4,
                  ro: _4,
                  rr: _4,
                  rs: _4,
                  sc: _4,
                  se: _4,
                  sp: _4,
                  to: _4,
                },
              ],
              leilao: _3,
              lel: _3,
              log: _3,
              londrina: _3,
              macapa: _3,
              maceio: _3,
              manaus: _3,
              maringa: _3,
              mat: _3,
              med: _3,
              mil: _3,
              morena: _3,
              mp: _3,
              mus: _3,
              natal: _3,
              net: _3,
              niteroi: _3,
              nom: _18,
              not: _3,
              ntr: _3,
              odo: _3,
              ong: _3,
              org: _3,
              osasco: _3,
              palmas: _3,
              poa: _3,
              ppg: _3,
              pro: _3,
              psc: _3,
              psi: _3,
              pvh: _3,
              qsl: _3,
              radio: _3,
              rec: _3,
              recife: _3,
              rep: _3,
              ribeirao: _3,
              rio: _3,
              riobranco: _3,
              riopreto: _3,
              salvador: _3,
              sampa: _3,
              santamaria: _3,
              santoandre: _3,
              saobernardo: _3,
              saogonca: _3,
              seg: _3,
              sjc: _3,
              slg: _3,
              slz: _3,
              sorocaba: _3,
              srv: _3,
              taxi: _3,
              tc: _3,
              tec: _3,
              teo: _3,
              the: _3,
              tmp: _3,
              trd: _3,
              tur: _3,
              tv: _3,
              udi: _3,
              vet: _3,
              vix: _3,
              vlog: _3,
              wiki: _3,
              zlg: _3,
            },
          ],
          bs: [1, { com: _3, edu: _3, gov: _3, net: _3, org: _3, we: _4 }],
          bt: _5,
          bv: _3,
          bw: [1, { ac: _3, co: _3, gov: _3, net: _3, org: _3 }],
          by: [1, { gov: _3, mil: _3, com: _3, of: _3, mediatech: _4 }],
          bz: [
            1,
            {
              co: _3,
              com: _3,
              edu: _3,
              gov: _3,
              net: _3,
              org: _3,
              za: _4,
              mydns: _4,
              gsj: _4,
            },
          ],
          ca: [
            1,
            {
              ab: _3,
              bc: _3,
              mb: _3,
              nb: _3,
              nf: _3,
              nl: _3,
              ns: _3,
              nt: _3,
              nu: _3,
              on: _3,
              pe: _3,
              qc: _3,
              sk: _3,
              yk: _3,
              gc: _3,
              barsy: _4,
              awdev: _7,
              co: _4,
              'no-ip': _4,
              myspreadshop: _4,
              box: _4,
            },
          ],
          cat: _3,
          cc: [
            1,
            {
              cleverapps: _4,
              cloudns: _4,
              ftpaccess: _4,
              'game-server': _4,
              myphotos: _4,
              scrapping: _4,
              twmail: _4,
              csx: _4,
              fantasyleague: _4,
              spawn: [0, { instances: _4 }],
            },
          ],
          cd: _11,
          cf: _3,
          cg: _3,
          ch: [
            1,
            {
              square7: _4,
              cloudns: _4,
              cloudscale: [0, { cust: _4, lpg: _20, rma: _20 }],
              flow: [0, { ae: [0, { alp1: _4 }], appengine: _4 }],
              'linkyard-cloud': _4,
              gotdns: _4,
              dnsking: _4,
              '123website': _4,
              myspreadshop: _4,
              firenet: [0, { '*': _4, svc: _7 }],
              '12hp': _4,
              '2ix': _4,
              '4lima': _4,
              'lima-city': _4,
            },
          ],
          ci: [
            1,
            {
              ac: _3,
              'xn--aroport-bya': _3,
              'a\xE9roport': _3,
              asso: _3,
              co: _3,
              com: _3,
              ed: _3,
              edu: _3,
              go: _3,
              gouv: _3,
              int: _3,
              net: _3,
              or: _3,
              org: _3,
            },
          ],
          ck: _18,
          cl: [1, { co: _3, gob: _3, gov: _3, mil: _3, cloudns: _4 }],
          cm: [1, { co: _3, com: _3, gov: _3, net: _3 }],
          cn: [
            1,
            {
              ac: _3,
              com: [
                1,
                {
                  amazonaws: [
                    0,
                    {
                      'cn-north-1': [
                        0,
                        {
                          'execute-api': _4,
                          'emrappui-prod': _4,
                          'emrnotebooks-prod': _4,
                          'emrstudio-prod': _4,
                          dualstack: _23,
                          s3: _4,
                          's3-accesspoint': _4,
                          's3-deprecated': _4,
                          's3-object-lambda': _4,
                          's3-website': _4,
                        },
                      ],
                      'cn-northwest-1': [
                        0,
                        {
                          'execute-api': _4,
                          'emrappui-prod': _4,
                          'emrnotebooks-prod': _4,
                          'emrstudio-prod': _4,
                          dualstack: _24,
                          s3: _4,
                          's3-accesspoint': _4,
                          's3-object-lambda': _4,
                          's3-website': _4,
                        },
                      ],
                      compute: _7,
                      airflow: [0, { 'cn-north-1': _7, 'cn-northwest-1': _7 }],
                      eb: [0, { 'cn-north-1': _4, 'cn-northwest-1': _4 }],
                      elb: _7,
                    },
                  ],
                  sagemaker: [0, { 'cn-north-1': _13, 'cn-northwest-1': _13 }],
                },
              ],
              edu: _3,
              gov: _3,
              mil: _3,
              net: _3,
              org: _3,
              'xn--55qx5d': _3,
              '\u516C\u53F8': _3,
              'xn--od0alg': _3,
              '\u7DB2\u7D61': _3,
              'xn--io0a7i': _3,
              '\u7F51\u7EDC': _3,
              ah: _3,
              bj: _3,
              cq: _3,
              fj: _3,
              gd: _3,
              gs: _3,
              gx: _3,
              gz: _3,
              ha: _3,
              hb: _3,
              he: _3,
              hi: _3,
              hk: _3,
              hl: _3,
              hn: _3,
              jl: _3,
              js: _3,
              jx: _3,
              ln: _3,
              mo: _3,
              nm: _3,
              nx: _3,
              qh: _3,
              sc: _3,
              sd: _3,
              sh: [1, { as: _4 }],
              sn: _3,
              sx: _3,
              tj: _3,
              tw: _3,
              xj: _3,
              xz: _3,
              yn: _3,
              zj: _3,
              'canva-apps': _4,
              canvasite: _22,
              myqnapcloud: _4,
              quickconnect: _25,
            },
          ],
          co: [
            1,
            {
              com: _3,
              edu: _3,
              gov: _3,
              mil: _3,
              net: _3,
              nom: _3,
              org: _3,
              carrd: _4,
              crd: _4,
              otap: _7,
              leadpages: _4,
              lpages: _4,
              mypi: _4,
              xmit: _7,
              firewalledreplit: _10,
              repl: _10,
              supabase: _4,
            },
          ],
          com: [
            1,
            {
              a2hosted: _4,
              cpserver: _4,
              adobeaemcloud: [2, { dev: _7 }],
              africa: _4,
              airkitapps: _4,
              'airkitapps-au': _4,
              aivencloud: _4,
              alibabacloudcs: _4,
              kasserver: _4,
              amazonaws: [
                0,
                {
                  'af-south-1': _28,
                  'ap-east-1': _29,
                  'ap-northeast-1': _30,
                  'ap-northeast-2': _30,
                  'ap-northeast-3': _28,
                  'ap-south-1': _30,
                  'ap-south-2': _31,
                  'ap-southeast-1': _30,
                  'ap-southeast-2': _30,
                  'ap-southeast-3': _31,
                  'ap-southeast-4': _31,
                  'ap-southeast-5': [
                    0,
                    {
                      'execute-api': _4,
                      dualstack: _23,
                      s3: _4,
                      's3-accesspoint': _4,
                      's3-deprecated': _4,
                      's3-object-lambda': _4,
                      's3-website': _4,
                    },
                  ],
                  'ca-central-1': _33,
                  'ca-west-1': [
                    0,
                    {
                      'execute-api': _4,
                      'emrappui-prod': _4,
                      'emrnotebooks-prod': _4,
                      'emrstudio-prod': _4,
                      dualstack: _32,
                      s3: _4,
                      's3-accesspoint': _4,
                      's3-accesspoint-fips': _4,
                      's3-fips': _4,
                      's3-object-lambda': _4,
                      's3-website': _4,
                    },
                  ],
                  'eu-central-1': _30,
                  'eu-central-2': _31,
                  'eu-north-1': _29,
                  'eu-south-1': _28,
                  'eu-south-2': _31,
                  'eu-west-1': [
                    0,
                    {
                      'execute-api': _4,
                      'emrappui-prod': _4,
                      'emrnotebooks-prod': _4,
                      'emrstudio-prod': _4,
                      dualstack: _23,
                      s3: _4,
                      's3-accesspoint': _4,
                      's3-deprecated': _4,
                      's3-object-lambda': _4,
                      's3-website': _4,
                      'analytics-gateway': _4,
                      'aws-cloud9': _26,
                      cloud9: _27,
                    },
                  ],
                  'eu-west-2': _29,
                  'eu-west-3': _28,
                  'il-central-1': [
                    0,
                    {
                      'execute-api': _4,
                      'emrappui-prod': _4,
                      'emrnotebooks-prod': _4,
                      'emrstudio-prod': _4,
                      dualstack: _23,
                      s3: _4,
                      's3-accesspoint': _4,
                      's3-object-lambda': _4,
                      's3-website': _4,
                      'aws-cloud9': _26,
                      cloud9: [0, { vfs: _4 }],
                    },
                  ],
                  'me-central-1': _31,
                  'me-south-1': _29,
                  'sa-east-1': _28,
                  'us-east-1': [
                    2,
                    {
                      'execute-api': _4,
                      'emrappui-prod': _4,
                      'emrnotebooks-prod': _4,
                      'emrstudio-prod': _4,
                      dualstack: _32,
                      s3: _4,
                      's3-accesspoint': _4,
                      's3-accesspoint-fips': _4,
                      's3-deprecated': _4,
                      's3-fips': _4,
                      's3-object-lambda': _4,
                      's3-website': _4,
                      'analytics-gateway': _4,
                      'aws-cloud9': _26,
                      cloud9: _27,
                    },
                  ],
                  'us-east-2': _34,
                  'us-gov-east-1': _36,
                  'us-gov-west-1': _36,
                  'us-west-1': _33,
                  'us-west-2': _34,
                  compute: _7,
                  'compute-1': _7,
                  airflow: [
                    0,
                    {
                      'af-south-1': _7,
                      'ap-east-1': _7,
                      'ap-northeast-1': _7,
                      'ap-northeast-2': _7,
                      'ap-northeast-3': _7,
                      'ap-south-1': _7,
                      'ap-south-2': _7,
                      'ap-southeast-1': _7,
                      'ap-southeast-2': _7,
                      'ap-southeast-3': _7,
                      'ap-southeast-4': _7,
                      'ca-central-1': _7,
                      'ca-west-1': _7,
                      'eu-central-1': _7,
                      'eu-central-2': _7,
                      'eu-north-1': _7,
                      'eu-south-1': _7,
                      'eu-south-2': _7,
                      'eu-west-1': _7,
                      'eu-west-2': _7,
                      'eu-west-3': _7,
                      'il-central-1': _7,
                      'me-central-1': _7,
                      'me-south-1': _7,
                      'sa-east-1': _7,
                      'us-east-1': _7,
                      'us-east-2': _7,
                      'us-west-1': _7,
                      'us-west-2': _7,
                    },
                  ],
                  s3: _4,
                  's3-1': _4,
                  's3-ap-east-1': _4,
                  's3-ap-northeast-1': _4,
                  's3-ap-northeast-2': _4,
                  's3-ap-northeast-3': _4,
                  's3-ap-south-1': _4,
                  's3-ap-southeast-1': _4,
                  's3-ap-southeast-2': _4,
                  's3-ca-central-1': _4,
                  's3-eu-central-1': _4,
                  's3-eu-north-1': _4,
                  's3-eu-west-1': _4,
                  's3-eu-west-2': _4,
                  's3-eu-west-3': _4,
                  's3-external-1': _4,
                  's3-fips-us-gov-east-1': _4,
                  's3-fips-us-gov-west-1': _4,
                  's3-global': [0, { accesspoint: [0, { mrap: _4 }] }],
                  's3-me-south-1': _4,
                  's3-sa-east-1': _4,
                  's3-us-east-2': _4,
                  's3-us-gov-east-1': _4,
                  's3-us-gov-west-1': _4,
                  's3-us-west-1': _4,
                  's3-us-west-2': _4,
                  's3-website-ap-northeast-1': _4,
                  's3-website-ap-southeast-1': _4,
                  's3-website-ap-southeast-2': _4,
                  's3-website-eu-west-1': _4,
                  's3-website-sa-east-1': _4,
                  's3-website-us-east-1': _4,
                  's3-website-us-gov-west-1': _4,
                  's3-website-us-west-1': _4,
                  's3-website-us-west-2': _4,
                  elb: _7,
                },
              ],
              amazoncognito: [
                0,
                {
                  'af-south-1': _37,
                  'ap-east-1': _37,
                  'ap-northeast-1': _37,
                  'ap-northeast-2': _37,
                  'ap-northeast-3': _37,
                  'ap-south-1': _37,
                  'ap-south-2': _37,
                  'ap-southeast-1': _37,
                  'ap-southeast-2': _37,
                  'ap-southeast-3': _37,
                  'ap-southeast-4': _37,
                  'ap-southeast-5': _37,
                  'ca-central-1': _37,
                  'ca-west-1': _37,
                  'eu-central-1': _37,
                  'eu-central-2': _37,
                  'eu-north-1': _37,
                  'eu-south-1': _37,
                  'eu-south-2': _37,
                  'eu-west-1': _37,
                  'eu-west-2': _37,
                  'eu-west-3': _37,
                  'il-central-1': _37,
                  'me-central-1': _37,
                  'me-south-1': _37,
                  'sa-east-1': _37,
                  'us-east-1': _38,
                  'us-east-2': _38,
                  'us-gov-east-1': _39,
                  'us-gov-west-1': _39,
                  'us-west-1': _38,
                  'us-west-2': _38,
                },
              ],
              amplifyapp: _4,
              awsapprunner: _7,
              awsapps: _4,
              elasticbeanstalk: [
                2,
                {
                  'af-south-1': _4,
                  'ap-east-1': _4,
                  'ap-northeast-1': _4,
                  'ap-northeast-2': _4,
                  'ap-northeast-3': _4,
                  'ap-south-1': _4,
                  'ap-southeast-1': _4,
                  'ap-southeast-2': _4,
                  'ap-southeast-3': _4,
                  'ca-central-1': _4,
                  'eu-central-1': _4,
                  'eu-north-1': _4,
                  'eu-south-1': _4,
                  'eu-west-1': _4,
                  'eu-west-2': _4,
                  'eu-west-3': _4,
                  'il-central-1': _4,
                  'me-south-1': _4,
                  'sa-east-1': _4,
                  'us-east-1': _4,
                  'us-east-2': _4,
                  'us-gov-east-1': _4,
                  'us-gov-west-1': _4,
                  'us-west-1': _4,
                  'us-west-2': _4,
                },
              ],
              awsglobalaccelerator: _4,
              siiites: _4,
              appspacehosted: _4,
              appspaceusercontent: _4,
              'on-aptible': _4,
              myasustor: _4,
              'balena-devices': _4,
              boutir: _4,
              bplaced: _4,
              cafjs: _4,
              'canva-apps': _4,
              'cdn77-storage': _4,
              br: _4,
              cn: _4,
              de: _4,
              eu: _4,
              jpn: _4,
              mex: _4,
              ru: _4,
              sa: _4,
              uk: _4,
              us: _4,
              za: _4,
              'clever-cloud': [0, { services: _7 }],
              dnsabr: _4,
              'ip-ddns': _4,
              jdevcloud: _4,
              wpdevcloud: _4,
              'cf-ipfs': _4,
              'cloudflare-ipfs': _4,
              trycloudflare: _4,
              co: _4,
              devinapps: _7,
              builtwithdark: _4,
              datadetect: [0, { demo: _4, instance: _4 }],
              dattolocal: _4,
              dattorelay: _4,
              dattoweb: _4,
              mydatto: _4,
              digitaloceanspaces: _7,
              discordsays: _4,
              discordsez: _4,
              drayddns: _4,
              dreamhosters: _4,
              durumis: _4,
              mydrobo: _4,
              blogdns: _4,
              cechire: _4,
              dnsalias: _4,
              dnsdojo: _4,
              doesntexist: _4,
              dontexist: _4,
              doomdns: _4,
              'dyn-o-saur': _4,
              dynalias: _4,
              'dyndns-at-home': _4,
              'dyndns-at-work': _4,
              'dyndns-blog': _4,
              'dyndns-free': _4,
              'dyndns-home': _4,
              'dyndns-ip': _4,
              'dyndns-mail': _4,
              'dyndns-office': _4,
              'dyndns-pics': _4,
              'dyndns-remote': _4,
              'dyndns-server': _4,
              'dyndns-web': _4,
              'dyndns-wiki': _4,
              'dyndns-work': _4,
              'est-a-la-maison': _4,
              'est-a-la-masion': _4,
              'est-le-patron': _4,
              'est-mon-blogueur': _4,
              'from-ak': _4,
              'from-al': _4,
              'from-ar': _4,
              'from-ca': _4,
              'from-ct': _4,
              'from-dc': _4,
              'from-de': _4,
              'from-fl': _4,
              'from-ga': _4,
              'from-hi': _4,
              'from-ia': _4,
              'from-id': _4,
              'from-il': _4,
              'from-in': _4,
              'from-ks': _4,
              'from-ky': _4,
              'from-ma': _4,
              'from-md': _4,
              'from-mi': _4,
              'from-mn': _4,
              'from-mo': _4,
              'from-ms': _4,
              'from-mt': _4,
              'from-nc': _4,
              'from-nd': _4,
              'from-ne': _4,
              'from-nh': _4,
              'from-nj': _4,
              'from-nm': _4,
              'from-nv': _4,
              'from-oh': _4,
              'from-ok': _4,
              'from-or': _4,
              'from-pa': _4,
              'from-pr': _4,
              'from-ri': _4,
              'from-sc': _4,
              'from-sd': _4,
              'from-tn': _4,
              'from-tx': _4,
              'from-ut': _4,
              'from-va': _4,
              'from-vt': _4,
              'from-wa': _4,
              'from-wi': _4,
              'from-wv': _4,
              'from-wy': _4,
              getmyip: _4,
              gotdns: _4,
              'hobby-site': _4,
              homelinux: _4,
              homeunix: _4,
              iamallama: _4,
              'is-a-anarchist': _4,
              'is-a-blogger': _4,
              'is-a-bookkeeper': _4,
              'is-a-bulls-fan': _4,
              'is-a-caterer': _4,
              'is-a-chef': _4,
              'is-a-conservative': _4,
              'is-a-cpa': _4,
              'is-a-cubicle-slave': _4,
              'is-a-democrat': _4,
              'is-a-designer': _4,
              'is-a-doctor': _4,
              'is-a-financialadvisor': _4,
              'is-a-geek': _4,
              'is-a-green': _4,
              'is-a-guru': _4,
              'is-a-hard-worker': _4,
              'is-a-hunter': _4,
              'is-a-landscaper': _4,
              'is-a-lawyer': _4,
              'is-a-liberal': _4,
              'is-a-libertarian': _4,
              'is-a-llama': _4,
              'is-a-musician': _4,
              'is-a-nascarfan': _4,
              'is-a-nurse': _4,
              'is-a-painter': _4,
              'is-a-personaltrainer': _4,
              'is-a-photographer': _4,
              'is-a-player': _4,
              'is-a-republican': _4,
              'is-a-rockstar': _4,
              'is-a-socialist': _4,
              'is-a-student': _4,
              'is-a-teacher': _4,
              'is-a-techie': _4,
              'is-a-therapist': _4,
              'is-an-accountant': _4,
              'is-an-actor': _4,
              'is-an-actress': _4,
              'is-an-anarchist': _4,
              'is-an-artist': _4,
              'is-an-engineer': _4,
              'is-an-entertainer': _4,
              'is-certified': _4,
              'is-gone': _4,
              'is-into-anime': _4,
              'is-into-cars': _4,
              'is-into-cartoons': _4,
              'is-into-games': _4,
              'is-leet': _4,
              'is-not-certified': _4,
              'is-slick': _4,
              'is-uberleet': _4,
              'is-with-theband': _4,
              'isa-geek': _4,
              'isa-hockeynut': _4,
              issmarterthanyou: _4,
              'likes-pie': _4,
              likescandy: _4,
              'neat-url': _4,
              'saves-the-whales': _4,
              selfip: _4,
              'sells-for-less': _4,
              'sells-for-u': _4,
              servebbs: _4,
              'simple-url': _4,
              'space-to-rent': _4,
              'teaches-yoga': _4,
              writesthisblog: _4,
              ddnsfree: _4,
              ddnsgeek: _4,
              giize: _4,
              gleeze: _4,
              kozow: _4,
              loseyourip: _4,
              ooguy: _4,
              theworkpc: _4,
              mytuleap: _4,
              'tuleap-partners': _4,
              encoreapi: _4,
              evennode: [
                0,
                {
                  'eu-1': _4,
                  'eu-2': _4,
                  'eu-3': _4,
                  'eu-4': _4,
                  'us-1': _4,
                  'us-2': _4,
                  'us-3': _4,
                  'us-4': _4,
                },
              ],
              onfabrica: _4,
              'fastly-edge': _4,
              'fastly-terrarium': _4,
              'fastvps-server': _4,
              mydobiss: _4,
              firebaseapp: _4,
              fldrv: _4,
              forgeblocks: _4,
              framercanvas: _4,
              'freebox-os': _4,
              freeboxos: _4,
              freemyip: _4,
              aliases121: _4,
              gentapps: _4,
              gentlentapis: _4,
              githubusercontent: _4,
              '0emm': _7,
              appspot: [2, { r: _7 }],
              blogspot: _4,
              codespot: _4,
              googleapis: _4,
              googlecode: _4,
              pagespeedmobilizer: _4,
              withgoogle: _4,
              withyoutube: _4,
              grayjayleagues: _4,
              hatenablog: _4,
              hatenadiary: _4,
              herokuapp: _4,
              gr: _4,
              smushcdn: _4,
              wphostedmail: _4,
              wpmucdn: _4,
              pixolino: _4,
              'apps-1and1': _4,
              'live-website': _4,
              dopaas: _4,
              'hosted-by-previder': _41,
              hosteur: [0, { 'rag-cloud': _4, 'rag-cloud-ch': _4 }],
              'ik-server': [0, { jcloud: _4, 'jcloud-ver-jpc': _4 }],
              jelastic: [0, { demo: _4 }],
              massivegrid: _41,
              wafaicloud: [0, { jed: _4, ryd: _4 }],
              webadorsite: _4,
              joyent: [0, { cns: _7 }],
              lpusercontent: _4,
              linode: [0, { members: _4, nodebalancer: _7 }],
              linodeobjects: _7,
              linodeusercontent: [0, { ip: _4 }],
              localtonet: _4,
              lovableproject: _4,
              barsycenter: _4,
              barsyonline: _4,
              modelscape: _4,
              mwcloudnonprod: _4,
              polyspace: _4,
              mazeplay: _4,
              miniserver: _4,
              atmeta: _4,
              fbsbx: _40,
              meteorapp: _42,
              routingthecloud: _4,
              mydbserver: _4,
              hostedpi: _4,
              'mythic-beasts': [
                0,
                {
                  caracal: _4,
                  customer: _4,
                  fentiger: _4,
                  lynx: _4,
                  ocelot: _4,
                  oncilla: _4,
                  onza: _4,
                  sphinx: _4,
                  vs: _4,
                  x: _4,
                  yali: _4,
                },
              ],
              nospamproxy: [0, { cloud: [2, { o365: _4 }] }],
              '4u': _4,
              nfshost: _4,
              '3utilities': _4,
              blogsyte: _4,
              ciscofreak: _4,
              damnserver: _4,
              ddnsking: _4,
              ditchyourip: _4,
              dnsiskinky: _4,
              dynns: _4,
              geekgalaxy: _4,
              'health-carereform': _4,
              homesecuritymac: _4,
              homesecuritypc: _4,
              myactivedirectory: _4,
              mysecuritycamera: _4,
              myvnc: _4,
              'net-freaks': _4,
              onthewifi: _4,
              point2this: _4,
              quicksytes: _4,
              securitytactics: _4,
              servebeer: _4,
              servecounterstrike: _4,
              serveexchange: _4,
              serveftp: _4,
              servegame: _4,
              servehalflife: _4,
              servehttp: _4,
              servehumour: _4,
              serveirc: _4,
              servemp3: _4,
              servep2p: _4,
              servepics: _4,
              servequake: _4,
              servesarcasm: _4,
              stufftoread: _4,
              unusualperson: _4,
              workisboring: _4,
              myiphost: _4,
              observableusercontent: [0, { static: _4 }],
              simplesite: _4,
              orsites: _4,
              operaunite: _4,
              'customer-oci': [0, { '*': _4, oci: _7, ocp: _7, ocs: _7 }],
              oraclecloudapps: _7,
              oraclegovcloudapps: _7,
              'authgear-staging': _4,
              authgearapps: _4,
              skygearapp: _4,
              outsystemscloud: _4,
              ownprovider: _4,
              pgfog: _4,
              pagexl: _4,
              gotpantheon: _4,
              paywhirl: _7,
              upsunapp: _4,
              'postman-echo': _4,
              prgmr: [0, { xen: _4 }],
              pythonanywhere: _42,
              qa2: _4,
              'alpha-myqnapcloud': _4,
              'dev-myqnapcloud': _4,
              mycloudnas: _4,
              mynascloud: _4,
              myqnapcloud: _4,
              qualifioapp: _4,
              ladesk: _4,
              qbuser: _4,
              quipelements: _7,
              rackmaze: _4,
              'readthedocs-hosted': _4,
              rhcloud: _4,
              onrender: _4,
              render: _43,
              'subsc-pay': _4,
              '180r': _4,
              dojin: _4,
              sakuratan: _4,
              sakuraweb: _4,
              x0: _4,
              code: [0, { builder: _7, 'dev-builder': _7, 'stg-builder': _7 }],
              salesforce: [
                0,
                {
                  platform: [
                    0,
                    { 'code-builder-stg': [0, { test: [0, { '001': _7 }] }] },
                  ],
                },
              ],
              logoip: _4,
              scrysec: _4,
              'firewall-gateway': _4,
              myshopblocks: _4,
              myshopify: _4,
              shopitsite: _4,
              '1kapp': _4,
              appchizi: _4,
              applinzi: _4,
              sinaapp: _4,
              vipsinaapp: _4,
              streamlitapp: _4,
              'try-snowplow': _4,
              'playstation-cloud': _4,
              myspreadshop: _4,
              'w-corp-staticblitz': _4,
              'w-credentialless-staticblitz': _4,
              'w-staticblitz': _4,
              'stackhero-network': _4,
              stdlib: [0, { api: _4 }],
              strapiapp: [2, { media: _4 }],
              'streak-link': _4,
              streaklinks: _4,
              streakusercontent: _4,
              'temp-dns': _4,
              dsmynas: _4,
              familyds: _4,
              mytabit: _4,
              taveusercontent: _4,
              'tb-hosting': _44,
              reservd: _4,
              thingdustdata: _4,
              'townnews-staging': _4,
              typeform: [0, { pro: _4 }],
              hk: _4,
              it: _4,
              'deus-canvas': _4,
              vultrobjects: _7,
              wafflecell: _4,
              hotelwithflight: _4,
              'reserve-online': _4,
              cprapid: _4,
              pleskns: _4,
              remotewd: _4,
              wiardweb: [0, { pages: _4 }],
              wixsite: _4,
              wixstudio: _4,
              messwithdns: _4,
              'woltlab-demo': _4,
              wpenginepowered: [2, { js: _4 }],
              xnbay: [2, { u2: _4, 'u2-local': _4 }],
              yolasite: _4,
            },
          ],
          coop: _3,
          cr: [1, { ac: _3, co: _3, ed: _3, fi: _3, go: _3, or: _3, sa: _3 }],
          cu: [
            1,
            { com: _3, edu: _3, gob: _3, inf: _3, nat: _3, net: _3, org: _3 },
          ],
          cv: [
            1,
            {
              com: _3,
              edu: _3,
              id: _3,
              int: _3,
              net: _3,
              nome: _3,
              org: _3,
              publ: _3,
            },
          ],
          cw: _45,
          cx: [
            1,
            {
              gov: _3,
              cloudns: _4,
              ath: _4,
              info: _4,
              assessments: _4,
              calculators: _4,
              funnels: _4,
              paynow: _4,
              quizzes: _4,
              researched: _4,
              tests: _4,
            },
          ],
          cy: [
            1,
            {
              ac: _3,
              biz: _3,
              com: [1, { scaleforce: _46 }],
              ekloges: _3,
              gov: _3,
              ltd: _3,
              mil: _3,
              net: _3,
              org: _3,
              press: _3,
              pro: _3,
              tm: _3,
            },
          ],
          cz: [
            1,
            {
              contentproxy9: [0, { rsc: _4 }],
              realm: _4,
              e4: _4,
              co: _4,
              metacentrum: [0, { cloud: _7, custom: _4 }],
              muni: [0, { cloud: [0, { flt: _4, usr: _4 }] }],
            },
          ],
          de: [
            1,
            {
              bplaced: _4,
              square7: _4,
              com: _4,
              cosidns: _47,
              dnsupdater: _4,
              'dynamisches-dns': _4,
              'internet-dns': _4,
              'l-o-g-i-n': _4,
              ddnss: [2, { dyn: _4, dyndns: _4 }],
              'dyn-ip24': _4,
              dyndns1: _4,
              'home-webserver': [2, { dyn: _4 }],
              'myhome-server': _4,
              dnshome: _4,
              fuettertdasnetz: _4,
              isteingeek: _4,
              istmein: _4,
              lebtimnetz: _4,
              leitungsen: _4,
              traeumtgerade: _4,
              frusky: _7,
              goip: _4,
              'xn--gnstigbestellen-zvb': _4,
              'g\xFCnstigbestellen': _4,
              'xn--gnstigliefern-wob': _4,
              'g\xFCnstigliefern': _4,
              'hs-heilbronn': [
                0,
                { it: [0, { pages: _4, 'pages-research': _4 }] },
              ],
              'dyn-berlin': _4,
              'in-berlin': _4,
              'in-brb': _4,
              'in-butter': _4,
              'in-dsl': _4,
              'in-vpn': _4,
              iservschule: _4,
              'mein-iserv': _4,
              schulplattform: _4,
              schulserver: _4,
              'test-iserv': _4,
              keymachine: _4,
              'git-repos': _4,
              'lcube-server': _4,
              'svn-repos': _4,
              barsy: _4,
              webspaceconfig: _4,
              '123webseite': _4,
              rub: _4,
              'ruhr-uni-bochum': [2, { noc: [0, { io: _4 }] }],
              logoip: _4,
              'firewall-gateway': _4,
              'my-gateway': _4,
              'my-router': _4,
              spdns: _4,
              speedpartner: [0, { customer: _4 }],
              myspreadshop: _4,
              'taifun-dns': _4,
              '12hp': _4,
              '2ix': _4,
              '4lima': _4,
              'lima-city': _4,
              'dd-dns': _4,
              'dray-dns': _4,
              draydns: _4,
              'dyn-vpn': _4,
              dynvpn: _4,
              'mein-vigor': _4,
              'my-vigor': _4,
              'my-wan': _4,
              'syno-ds': _4,
              'synology-diskstation': _4,
              'synology-ds': _4,
              uberspace: _7,
              'virtual-user': _4,
              virtualuser: _4,
              'community-pro': _4,
              diskussionsbereich: _4,
            },
          ],
          dj: _3,
          dk: [
            1,
            {
              biz: _4,
              co: _4,
              firm: _4,
              reg: _4,
              store: _4,
              '123hjemmeside': _4,
              myspreadshop: _4,
            },
          ],
          dm: _48,
          do: [
            1,
            {
              art: _3,
              com: _3,
              edu: _3,
              gob: _3,
              gov: _3,
              mil: _3,
              net: _3,
              org: _3,
              sld: _3,
              web: _3,
            },
          ],
          dz: [
            1,
            {
              art: _3,
              asso: _3,
              com: _3,
              edu: _3,
              gov: _3,
              net: _3,
              org: _3,
              pol: _3,
              soc: _3,
              tm: _3,
            },
          ],
          ec: [
            1,
            {
              com: _3,
              edu: _3,
              fin: _3,
              gob: _3,
              gov: _3,
              info: _3,
              k12: _3,
              med: _3,
              mil: _3,
              net: _3,
              org: _3,
              pro: _3,
              base: _4,
              official: _4,
            },
          ],
          edu: [1, { rit: [0, { 'git-pages': _4 }] }],
          ee: [
            1,
            {
              aip: _3,
              com: _3,
              edu: _3,
              fie: _3,
              gov: _3,
              lib: _3,
              med: _3,
              org: _3,
              pri: _3,
              riik: _3,
            },
          ],
          eg: [
            1,
            {
              ac: _3,
              com: _3,
              edu: _3,
              eun: _3,
              gov: _3,
              info: _3,
              me: _3,
              mil: _3,
              name: _3,
              net: _3,
              org: _3,
              sci: _3,
              sport: _3,
              tv: _3,
            },
          ],
          er: _18,
          es: [
            1,
            {
              com: _3,
              edu: _3,
              gob: _3,
              nom: _3,
              org: _3,
              '123miweb': _4,
              myspreadshop: _4,
            },
          ],
          et: [
            1,
            {
              biz: _3,
              com: _3,
              edu: _3,
              gov: _3,
              info: _3,
              name: _3,
              net: _3,
              org: _3,
            },
          ],
          eu: [
            1,
            {
              airkitapps: _4,
              cloudns: _4,
              dogado: [0, { jelastic: _4 }],
              barsy: _4,
              spdns: _4,
              transurl: _7,
              diskstation: _4,
            },
          ],
          fi: [
            1,
            {
              aland: _3,
              dy: _4,
              'xn--hkkinen-5wa': _4,
              'h\xE4kkinen': _4,
              iki: _4,
              cloudplatform: [0, { fi: _4 }],
              datacenter: [0, { demo: _4, paas: _4 }],
              kapsi: _4,
              '123kotisivu': _4,
              myspreadshop: _4,
            },
          ],
          fj: [
            1,
            {
              ac: _3,
              biz: _3,
              com: _3,
              gov: _3,
              info: _3,
              mil: _3,
              name: _3,
              net: _3,
              org: _3,
              pro: _3,
            },
          ],
          fk: _18,
          fm: [1, { com: _3, edu: _3, net: _3, org: _3, radio: _4, user: _7 }],
          fo: _3,
          fr: [
            1,
            {
              asso: _3,
              com: _3,
              gouv: _3,
              nom: _3,
              prd: _3,
              tm: _3,
              avoues: _3,
              cci: _3,
              greta: _3,
              'huissier-justice': _3,
              'en-root': _4,
              'fbx-os': _4,
              fbxos: _4,
              'freebox-os': _4,
              freeboxos: _4,
              goupile: _4,
              '123siteweb': _4,
              'on-web': _4,
              'chirurgiens-dentistes-en-france': _4,
              dedibox: _4,
              aeroport: _4,
              avocat: _4,
              chambagri: _4,
              'chirurgiens-dentistes': _4,
              'experts-comptables': _4,
              medecin: _4,
              notaires: _4,
              pharmacien: _4,
              port: _4,
              veterinaire: _4,
              myspreadshop: _4,
              ynh: _4,
            },
          ],
          ga: _3,
          gb: _3,
          gd: [1, { edu: _3, gov: _3 }],
          ge: [
            1,
            {
              com: _3,
              edu: _3,
              gov: _3,
              net: _3,
              org: _3,
              pvt: _3,
              school: _3,
            },
          ],
          gf: _3,
          gg: [
            1,
            {
              co: _3,
              net: _3,
              org: _3,
              botdash: _4,
              kaas: _4,
              stackit: _4,
              panel: [2, { daemon: _4 }],
            },
          ],
          gh: [1, { com: _3, edu: _3, gov: _3, mil: _3, org: _3 }],
          gi: [1, { com: _3, edu: _3, gov: _3, ltd: _3, mod: _3, org: _3 }],
          gl: [1, { co: _3, com: _3, edu: _3, net: _3, org: _3, biz: _4 }],
          gm: _3,
          gn: [1, { ac: _3, com: _3, edu: _3, gov: _3, net: _3, org: _3 }],
          gov: _3,
          gp: [1, { asso: _3, com: _3, edu: _3, mobi: _3, net: _3, org: _3 }],
          gq: _3,
          gr: [
            1,
            {
              com: _3,
              edu: _3,
              gov: _3,
              net: _3,
              org: _3,
              barsy: _4,
              simplesite: _4,
            },
          ],
          gs: _3,
          gt: [
            1,
            { com: _3, edu: _3, gob: _3, ind: _3, mil: _3, net: _3, org: _3 },
          ],
          gu: [
            1,
            {
              com: _3,
              edu: _3,
              gov: _3,
              guam: _3,
              info: _3,
              net: _3,
              org: _3,
              web: _3,
            },
          ],
          gw: _3,
          gy: _48,
          hk: [
            1,
            {
              com: _3,
              edu: _3,
              gov: _3,
              idv: _3,
              net: _3,
              org: _3,
              'xn--ciqpn': _3,
              '\u4E2A\u4EBA': _3,
              'xn--gmqw5a': _3,
              '\u500B\u4EBA': _3,
              'xn--55qx5d': _3,
              '\u516C\u53F8': _3,
              'xn--mxtq1m': _3,
              '\u653F\u5E9C': _3,
              'xn--lcvr32d': _3,
              '\u654E\u80B2': _3,
              'xn--wcvs22d': _3,
              '\u6559\u80B2': _3,
              'xn--gmq050i': _3,
              '\u7B87\u4EBA': _3,
              'xn--uc0atv': _3,
              '\u7D44\u7E54': _3,
              'xn--uc0ay4a': _3,
              '\u7D44\u7EC7': _3,
              'xn--od0alg': _3,
              '\u7DB2\u7D61': _3,
              'xn--zf0avx': _3,
              '\u7DB2\u7EDC': _3,
              'xn--mk0axi': _3,
              '\u7EC4\u7E54': _3,
              'xn--tn0ag': _3,
              '\u7EC4\u7EC7': _3,
              'xn--od0aq3b': _3,
              '\u7F51\u7D61': _3,
              'xn--io0a7i': _3,
              '\u7F51\u7EDC': _3,
              inc: _4,
              ltd: _4,
            },
          ],
          hm: _3,
          hn: [1, { com: _3, edu: _3, gob: _3, mil: _3, net: _3, org: _3 }],
          hr: [1, { com: _3, from: _3, iz: _3, name: _3, brendly: _51 }],
          ht: [
            1,
            {
              adult: _3,
              art: _3,
              asso: _3,
              com: _3,
              coop: _3,
              edu: _3,
              firm: _3,
              gouv: _3,
              info: _3,
              med: _3,
              net: _3,
              org: _3,
              perso: _3,
              pol: _3,
              pro: _3,
              rel: _3,
              shop: _3,
              rt: _4,
            },
          ],
          hu: [
            1,
            {
              2000: _3,
              agrar: _3,
              bolt: _3,
              casino: _3,
              city: _3,
              co: _3,
              erotica: _3,
              erotika: _3,
              film: _3,
              forum: _3,
              games: _3,
              hotel: _3,
              info: _3,
              ingatlan: _3,
              jogasz: _3,
              konyvelo: _3,
              lakas: _3,
              media: _3,
              news: _3,
              org: _3,
              priv: _3,
              reklam: _3,
              sex: _3,
              shop: _3,
              sport: _3,
              suli: _3,
              szex: _3,
              tm: _3,
              tozsde: _3,
              utazas: _3,
              video: _3,
            },
          ],
          id: [
            1,
            {
              ac: _3,
              biz: _3,
              co: _3,
              desa: _3,
              go: _3,
              mil: _3,
              my: _3,
              net: _3,
              or: _3,
              ponpes: _3,
              sch: _3,
              web: _3,
              zone: _4,
            },
          ],
          ie: [1, { gov: _3, myspreadshop: _4 }],
          il: [
            1,
            {
              ac: _3,
              co: [1, { ravpage: _4, mytabit: _4, tabitorder: _4 }],
              gov: _3,
              idf: _3,
              k12: _3,
              muni: _3,
              net: _3,
              org: _3,
            },
          ],
          'xn--4dbrk0ce': [
            1,
            {
              'xn--4dbgdty6c': _3,
              'xn--5dbhl8d': _3,
              'xn--8dbq2a': _3,
              'xn--hebda8b': _3,
            },
          ],
          '\u05D9\u05E9\u05E8\u05D0\u05DC': [
            1,
            {
              '\u05D0\u05E7\u05D3\u05DE\u05D9\u05D4': _3,
              '\u05D9\u05E9\u05D5\u05D1': _3,
              '\u05E6\u05D4\u05DC': _3,
              '\u05DE\u05DE\u05E9\u05DC': _3,
            },
          ],
          im: [
            1,
            {
              ac: _3,
              co: [1, { ltd: _3, plc: _3 }],
              com: _3,
              net: _3,
              org: _3,
              tt: _3,
              tv: _3,
            },
          ],
          in: [
            1,
            {
              '5g': _3,
              '6g': _3,
              ac: _3,
              ai: _3,
              am: _3,
              bihar: _3,
              biz: _3,
              business: _3,
              ca: _3,
              cn: _3,
              co: _3,
              com: _3,
              coop: _3,
              cs: _3,
              delhi: _3,
              dr: _3,
              edu: _3,
              er: _3,
              firm: _3,
              gen: _3,
              gov: _3,
              gujarat: _3,
              ind: _3,
              info: _3,
              int: _3,
              internet: _3,
              io: _3,
              me: _3,
              mil: _3,
              net: _3,
              nic: _3,
              org: _3,
              pg: _3,
              post: _3,
              pro: _3,
              res: _3,
              travel: _3,
              tv: _3,
              uk: _3,
              up: _3,
              us: _3,
              cloudns: _4,
              barsy: _4,
              web: _4,
              supabase: _4,
            },
          ],
          info: [
            1,
            {
              cloudns: _4,
              'dynamic-dns': _4,
              'barrel-of-knowledge': _4,
              'barrell-of-knowledge': _4,
              dyndns: _4,
              'for-our': _4,
              'groks-the': _4,
              'groks-this': _4,
              'here-for-more': _4,
              knowsitall: _4,
              selfip: _4,
              webhop: _4,
              barsy: _4,
              mayfirst: _4,
              mittwald: _4,
              mittwaldserver: _4,
              typo3server: _4,
              dvrcam: _4,
              ilovecollege: _4,
              'no-ip': _4,
              forumz: _4,
              nsupdate: _4,
              dnsupdate: _4,
              'v-info': _4,
            },
          ],
          int: [1, { eu: _3 }],
          io: [
            1,
            {
              2038: _4,
              co: _3,
              com: _3,
              edu: _3,
              gov: _3,
              mil: _3,
              net: _3,
              nom: _3,
              org: _3,
              'on-acorn': _7,
              myaddr: _4,
              apigee: _4,
              'b-data': _4,
              beagleboard: _4,
              bitbucket: _4,
              bluebite: _4,
              boxfuse: _4,
              brave: _8,
              browsersafetymark: _4,
              bubble: _52,
              bubbleapps: _4,
              bigv: [0, { uk0: _4 }],
              cleverapps: _4,
              cloudbeesusercontent: _4,
              dappnode: [0, { dyndns: _4 }],
              darklang: _4,
              definima: _4,
              dedyn: _4,
              'fh-muenster': _4,
              shw: _4,
              forgerock: [0, { id: _4 }],
              github: _4,
              gitlab: _4,
              lolipop: _4,
              'hasura-app': _4,
              hostyhosting: _4,
              hypernode: _4,
              moonscale: _7,
              beebyte: _41,
              beebyteapp: [0, { sekd1: _4 }],
              jele: _4,
              webthings: _4,
              loginline: _4,
              barsy: _4,
              azurecontainer: _7,
              ngrok: [
                2,
                { ap: _4, au: _4, eu: _4, in: _4, jp: _4, sa: _4, us: _4 },
              ],
              nodeart: [0, { stage: _4 }],
              pantheonsite: _4,
              pstmn: [2, { mock: _4 }],
              protonet: _4,
              qcx: [2, { sys: _7 }],
              qoto: _4,
              vaporcloud: _4,
              myrdbx: _4,
              'rb-hosting': _44,
              'on-k3s': _7,
              'on-rio': _7,
              readthedocs: _4,
              resindevice: _4,
              resinstaging: [0, { devices: _4 }],
              hzc: _4,
              sandcats: _4,
              scrypted: [0, { client: _4 }],
              'mo-siemens': _4,
              lair: _40,
              stolos: _7,
              musician: _4,
              utwente: _4,
              edugit: _4,
              telebit: _4,
              thingdust: [
                0,
                { dev: _53, disrec: _53, prod: _54, testing: _53 },
              ],
              tickets: _4,
              webflow: _4,
              webflowtest: _4,
              editorx: _4,
              wixstudio: _4,
              basicserver: _4,
              virtualserver: _4,
            },
          ],
          iq: _6,
          ir: [
            1,
            {
              ac: _3,
              co: _3,
              gov: _3,
              id: _3,
              net: _3,
              org: _3,
              sch: _3,
              'xn--mgba3a4f16a': _3,
              '\u0627\u06CC\u0631\u0627\u0646': _3,
              'xn--mgba3a4fra': _3,
              '\u0627\u064A\u0631\u0627\u0646': _3,
              arvanedge: _4,
            },
          ],
          is: _3,
          it: [
            1,
            {
              edu: _3,
              gov: _3,
              abr: _3,
              abruzzo: _3,
              'aosta-valley': _3,
              aostavalley: _3,
              bas: _3,
              basilicata: _3,
              cal: _3,
              calabria: _3,
              cam: _3,
              campania: _3,
              'emilia-romagna': _3,
              emiliaromagna: _3,
              emr: _3,
              'friuli-v-giulia': _3,
              'friuli-ve-giulia': _3,
              'friuli-vegiulia': _3,
              'friuli-venezia-giulia': _3,
              'friuli-veneziagiulia': _3,
              'friuli-vgiulia': _3,
              'friuliv-giulia': _3,
              'friulive-giulia': _3,
              friulivegiulia: _3,
              'friulivenezia-giulia': _3,
              friuliveneziagiulia: _3,
              friulivgiulia: _3,
              fvg: _3,
              laz: _3,
              lazio: _3,
              lig: _3,
              liguria: _3,
              lom: _3,
              lombardia: _3,
              lombardy: _3,
              lucania: _3,
              mar: _3,
              marche: _3,
              mol: _3,
              molise: _3,
              piedmont: _3,
              piemonte: _3,
              pmn: _3,
              pug: _3,
              puglia: _3,
              sar: _3,
              sardegna: _3,
              sardinia: _3,
              sic: _3,
              sicilia: _3,
              sicily: _3,
              taa: _3,
              tos: _3,
              toscana: _3,
              'trentin-sud-tirol': _3,
              'xn--trentin-sd-tirol-rzb': _3,
              'trentin-s\xFCd-tirol': _3,
              'trentin-sudtirol': _3,
              'xn--trentin-sdtirol-7vb': _3,
              'trentin-s\xFCdtirol': _3,
              'trentin-sued-tirol': _3,
              'trentin-suedtirol': _3,
              trentino: _3,
              'trentino-a-adige': _3,
              'trentino-aadige': _3,
              'trentino-alto-adige': _3,
              'trentino-altoadige': _3,
              'trentino-s-tirol': _3,
              'trentino-stirol': _3,
              'trentino-sud-tirol': _3,
              'xn--trentino-sd-tirol-c3b': _3,
              'trentino-s\xFCd-tirol': _3,
              'trentino-sudtirol': _3,
              'xn--trentino-sdtirol-szb': _3,
              'trentino-s\xFCdtirol': _3,
              'trentino-sued-tirol': _3,
              'trentino-suedtirol': _3,
              'trentinoa-adige': _3,
              trentinoaadige: _3,
              'trentinoalto-adige': _3,
              trentinoaltoadige: _3,
              'trentinos-tirol': _3,
              trentinostirol: _3,
              'trentinosud-tirol': _3,
              'xn--trentinosd-tirol-rzb': _3,
              'trentinos\xFCd-tirol': _3,
              trentinosudtirol: _3,
              'xn--trentinosdtirol-7vb': _3,
              'trentinos\xFCdtirol': _3,
              'trentinosued-tirol': _3,
              trentinosuedtirol: _3,
              'trentinsud-tirol': _3,
              'xn--trentinsd-tirol-6vb': _3,
              'trentins\xFCd-tirol': _3,
              trentinsudtirol: _3,
              'xn--trentinsdtirol-nsb': _3,
              'trentins\xFCdtirol': _3,
              'trentinsued-tirol': _3,
              trentinsuedtirol: _3,
              tuscany: _3,
              umb: _3,
              umbria: _3,
              'val-d-aosta': _3,
              'val-daosta': _3,
              'vald-aosta': _3,
              valdaosta: _3,
              'valle-aosta': _3,
              'valle-d-aosta': _3,
              'valle-daosta': _3,
              valleaosta: _3,
              'valled-aosta': _3,
              valledaosta: _3,
              'vallee-aoste': _3,
              'xn--valle-aoste-ebb': _3,
              'vall\xE9e-aoste': _3,
              'vallee-d-aoste': _3,
              'xn--valle-d-aoste-ehb': _3,
              'vall\xE9e-d-aoste': _3,
              valleeaoste: _3,
              'xn--valleaoste-e7a': _3,
              'vall\xE9eaoste': _3,
              valleedaoste: _3,
              'xn--valledaoste-ebb': _3,
              'vall\xE9edaoste': _3,
              vao: _3,
              vda: _3,
              ven: _3,
              veneto: _3,
              ag: _3,
              agrigento: _3,
              al: _3,
              alessandria: _3,
              'alto-adige': _3,
              altoadige: _3,
              an: _3,
              ancona: _3,
              'andria-barletta-trani': _3,
              'andria-trani-barletta': _3,
              andriabarlettatrani: _3,
              andriatranibarletta: _3,
              ao: _3,
              aosta: _3,
              aoste: _3,
              ap: _3,
              aq: _3,
              aquila: _3,
              ar: _3,
              arezzo: _3,
              'ascoli-piceno': _3,
              ascolipiceno: _3,
              asti: _3,
              at: _3,
              av: _3,
              avellino: _3,
              ba: _3,
              balsan: _3,
              'balsan-sudtirol': _3,
              'xn--balsan-sdtirol-nsb': _3,
              'balsan-s\xFCdtirol': _3,
              'balsan-suedtirol': _3,
              bari: _3,
              'barletta-trani-andria': _3,
              barlettatraniandria: _3,
              belluno: _3,
              benevento: _3,
              bergamo: _3,
              bg: _3,
              bi: _3,
              biella: _3,
              bl: _3,
              bn: _3,
              bo: _3,
              bologna: _3,
              bolzano: _3,
              'bolzano-altoadige': _3,
              bozen: _3,
              'bozen-sudtirol': _3,
              'xn--bozen-sdtirol-2ob': _3,
              'bozen-s\xFCdtirol': _3,
              'bozen-suedtirol': _3,
              br: _3,
              brescia: _3,
              brindisi: _3,
              bs: _3,
              bt: _3,
              bulsan: _3,
              'bulsan-sudtirol': _3,
              'xn--bulsan-sdtirol-nsb': _3,
              'bulsan-s\xFCdtirol': _3,
              'bulsan-suedtirol': _3,
              bz: _3,
              ca: _3,
              cagliari: _3,
              caltanissetta: _3,
              'campidano-medio': _3,
              campidanomedio: _3,
              campobasso: _3,
              'carbonia-iglesias': _3,
              carboniaiglesias: _3,
              'carrara-massa': _3,
              carraramassa: _3,
              caserta: _3,
              catania: _3,
              catanzaro: _3,
              cb: _3,
              ce: _3,
              'cesena-forli': _3,
              'xn--cesena-forl-mcb': _3,
              'cesena-forl\xEC': _3,
              cesenaforli: _3,
              'xn--cesenaforl-i8a': _3,
              'cesenaforl\xEC': _3,
              ch: _3,
              chieti: _3,
              ci: _3,
              cl: _3,
              cn: _3,
              co: _3,
              como: _3,
              cosenza: _3,
              cr: _3,
              cremona: _3,
              crotone: _3,
              cs: _3,
              ct: _3,
              cuneo: _3,
              cz: _3,
              'dell-ogliastra': _3,
              dellogliastra: _3,
              en: _3,
              enna: _3,
              fc: _3,
              fe: _3,
              fermo: _3,
              ferrara: _3,
              fg: _3,
              fi: _3,
              firenze: _3,
              florence: _3,
              fm: _3,
              foggia: _3,
              'forli-cesena': _3,
              'xn--forl-cesena-fcb': _3,
              'forl\xEC-cesena': _3,
              forlicesena: _3,
              'xn--forlcesena-c8a': _3,
              'forl\xECcesena': _3,
              fr: _3,
              frosinone: _3,
              ge: _3,
              genoa: _3,
              genova: _3,
              go: _3,
              gorizia: _3,
              gr: _3,
              grosseto: _3,
              'iglesias-carbonia': _3,
              iglesiascarbonia: _3,
              im: _3,
              imperia: _3,
              is: _3,
              isernia: _3,
              kr: _3,
              'la-spezia': _3,
              laquila: _3,
              laspezia: _3,
              latina: _3,
              lc: _3,
              le: _3,
              lecce: _3,
              lecco: _3,
              li: _3,
              livorno: _3,
              lo: _3,
              lodi: _3,
              lt: _3,
              lu: _3,
              lucca: _3,
              macerata: _3,
              mantova: _3,
              'massa-carrara': _3,
              massacarrara: _3,
              matera: _3,
              mb: _3,
              mc: _3,
              me: _3,
              'medio-campidano': _3,
              mediocampidano: _3,
              messina: _3,
              mi: _3,
              milan: _3,
              milano: _3,
              mn: _3,
              mo: _3,
              modena: _3,
              monza: _3,
              'monza-brianza': _3,
              'monza-e-della-brianza': _3,
              monzabrianza: _3,
              monzaebrianza: _3,
              monzaedellabrianza: _3,
              ms: _3,
              mt: _3,
              na: _3,
              naples: _3,
              napoli: _3,
              no: _3,
              novara: _3,
              nu: _3,
              nuoro: _3,
              og: _3,
              ogliastra: _3,
              'olbia-tempio': _3,
              olbiatempio: _3,
              or: _3,
              oristano: _3,
              ot: _3,
              pa: _3,
              padova: _3,
              padua: _3,
              palermo: _3,
              parma: _3,
              pavia: _3,
              pc: _3,
              pd: _3,
              pe: _3,
              perugia: _3,
              'pesaro-urbino': _3,
              pesarourbino: _3,
              pescara: _3,
              pg: _3,
              pi: _3,
              piacenza: _3,
              pisa: _3,
              pistoia: _3,
              pn: _3,
              po: _3,
              pordenone: _3,
              potenza: _3,
              pr: _3,
              prato: _3,
              pt: _3,
              pu: _3,
              pv: _3,
              pz: _3,
              ra: _3,
              ragusa: _3,
              ravenna: _3,
              rc: _3,
              re: _3,
              'reggio-calabria': _3,
              'reggio-emilia': _3,
              reggiocalabria: _3,
              reggioemilia: _3,
              rg: _3,
              ri: _3,
              rieti: _3,
              rimini: _3,
              rm: _3,
              rn: _3,
              ro: _3,
              roma: _3,
              rome: _3,
              rovigo: _3,
              sa: _3,
              salerno: _3,
              sassari: _3,
              savona: _3,
              si: _3,
              siena: _3,
              siracusa: _3,
              so: _3,
              sondrio: _3,
              sp: _3,
              sr: _3,
              ss: _3,
              'xn--sdtirol-n2a': _3,
              's\xFCdtirol': _3,
              suedtirol: _3,
              sv: _3,
              ta: _3,
              taranto: _3,
              te: _3,
              'tempio-olbia': _3,
              tempioolbia: _3,
              teramo: _3,
              terni: _3,
              tn: _3,
              to: _3,
              torino: _3,
              tp: _3,
              tr: _3,
              'trani-andria-barletta': _3,
              'trani-barletta-andria': _3,
              traniandriabarletta: _3,
              tranibarlettaandria: _3,
              trapani: _3,
              trento: _3,
              treviso: _3,
              trieste: _3,
              ts: _3,
              turin: _3,
              tv: _3,
              ud: _3,
              udine: _3,
              'urbino-pesaro': _3,
              urbinopesaro: _3,
              va: _3,
              varese: _3,
              vb: _3,
              vc: _3,
              ve: _3,
              venezia: _3,
              venice: _3,
              verbania: _3,
              vercelli: _3,
              verona: _3,
              vi: _3,
              'vibo-valentia': _3,
              vibovalentia: _3,
              vicenza: _3,
              viterbo: _3,
              vr: _3,
              vs: _3,
              vt: _3,
              vv: _3,
              '12chars': _4,
              ibxos: _4,
              iliadboxos: _4,
              neen: [0, { jc: _4 }],
              '123homepage': _4,
              '16-b': _4,
              '32-b': _4,
              '64-b': _4,
              myspreadshop: _4,
              syncloud: _4,
            },
          ],
          je: [1, { co: _3, net: _3, org: _3, of: _4 }],
          jm: _18,
          jo: [
            1,
            {
              agri: _3,
              ai: _3,
              com: _3,
              edu: _3,
              eng: _3,
              fm: _3,
              gov: _3,
              mil: _3,
              net: _3,
              org: _3,
              per: _3,
              phd: _3,
              sch: _3,
              tv: _3,
            },
          ],
          jobs: _3,
          jp: [
            1,
            {
              ac: _3,
              ad: _3,
              co: _3,
              ed: _3,
              go: _3,
              gr: _3,
              lg: _3,
              ne: [
                1,
                {
                  aseinet: _50,
                  gehirn: _4,
                  ivory: _4,
                  'mail-box': _4,
                  mints: _4,
                  mokuren: _4,
                  opal: _4,
                  sakura: _4,
                  sumomo: _4,
                  topaz: _4,
                },
              ],
              or: _3,
              aichi: [
                1,
                {
                  aisai: _3,
                  ama: _3,
                  anjo: _3,
                  asuke: _3,
                  chiryu: _3,
                  chita: _3,
                  fuso: _3,
                  gamagori: _3,
                  handa: _3,
                  hazu: _3,
                  hekinan: _3,
                  higashiura: _3,
                  ichinomiya: _3,
                  inazawa: _3,
                  inuyama: _3,
                  isshiki: _3,
                  iwakura: _3,
                  kanie: _3,
                  kariya: _3,
                  kasugai: _3,
                  kira: _3,
                  kiyosu: _3,
                  komaki: _3,
                  konan: _3,
                  kota: _3,
                  mihama: _3,
                  miyoshi: _3,
                  nishio: _3,
                  nisshin: _3,
                  obu: _3,
                  oguchi: _3,
                  oharu: _3,
                  okazaki: _3,
                  owariasahi: _3,
                  seto: _3,
                  shikatsu: _3,
                  shinshiro: _3,
                  shitara: _3,
                  tahara: _3,
                  takahama: _3,
                  tobishima: _3,
                  toei: _3,
                  togo: _3,
                  tokai: _3,
                  tokoname: _3,
                  toyoake: _3,
                  toyohashi: _3,
                  toyokawa: _3,
                  toyone: _3,
                  toyota: _3,
                  tsushima: _3,
                  yatomi: _3,
                },
              ],
              akita: [
                1,
                {
                  akita: _3,
                  daisen: _3,
                  fujisato: _3,
                  gojome: _3,
                  hachirogata: _3,
                  happou: _3,
                  higashinaruse: _3,
                  honjo: _3,
                  honjyo: _3,
                  ikawa: _3,
                  kamikoani: _3,
                  kamioka: _3,
                  katagami: _3,
                  kazuno: _3,
                  kitaakita: _3,
                  kosaka: _3,
                  kyowa: _3,
                  misato: _3,
                  mitane: _3,
                  moriyoshi: _3,
                  nikaho: _3,
                  noshiro: _3,
                  odate: _3,
                  oga: _3,
                  ogata: _3,
                  semboku: _3,
                  yokote: _3,
                  yurihonjo: _3,
                },
              ],
              aomori: [
                1,
                {
                  aomori: _3,
                  gonohe: _3,
                  hachinohe: _3,
                  hashikami: _3,
                  hiranai: _3,
                  hirosaki: _3,
                  itayanagi: _3,
                  kuroishi: _3,
                  misawa: _3,
                  mutsu: _3,
                  nakadomari: _3,
                  noheji: _3,
                  oirase: _3,
                  owani: _3,
                  rokunohe: _3,
                  sannohe: _3,
                  shichinohe: _3,
                  shingo: _3,
                  takko: _3,
                  towada: _3,
                  tsugaru: _3,
                  tsuruta: _3,
                },
              ],
              chiba: [
                1,
                {
                  abiko: _3,
                  asahi: _3,
                  chonan: _3,
                  chosei: _3,
                  choshi: _3,
                  chuo: _3,
                  funabashi: _3,
                  futtsu: _3,
                  hanamigawa: _3,
                  ichihara: _3,
                  ichikawa: _3,
                  ichinomiya: _3,
                  inzai: _3,
                  isumi: _3,
                  kamagaya: _3,
                  kamogawa: _3,
                  kashiwa: _3,
                  katori: _3,
                  katsuura: _3,
                  kimitsu: _3,
                  kisarazu: _3,
                  kozaki: _3,
                  kujukuri: _3,
                  kyonan: _3,
                  matsudo: _3,
                  midori: _3,
                  mihama: _3,
                  minamiboso: _3,
                  mobara: _3,
                  mutsuzawa: _3,
                  nagara: _3,
                  nagareyama: _3,
                  narashino: _3,
                  narita: _3,
                  noda: _3,
                  oamishirasato: _3,
                  omigawa: _3,
                  onjuku: _3,
                  otaki: _3,
                  sakae: _3,
                  sakura: _3,
                  shimofusa: _3,
                  shirako: _3,
                  shiroi: _3,
                  shisui: _3,
                  sodegaura: _3,
                  sosa: _3,
                  tako: _3,
                  tateyama: _3,
                  togane: _3,
                  tohnosho: _3,
                  tomisato: _3,
                  urayasu: _3,
                  yachimata: _3,
                  yachiyo: _3,
                  yokaichiba: _3,
                  yokoshibahikari: _3,
                  yotsukaido: _3,
                },
              ],
              ehime: [
                1,
                {
                  ainan: _3,
                  honai: _3,
                  ikata: _3,
                  imabari: _3,
                  iyo: _3,
                  kamijima: _3,
                  kihoku: _3,
                  kumakogen: _3,
                  masaki: _3,
                  matsuno: _3,
                  matsuyama: _3,
                  namikata: _3,
                  niihama: _3,
                  ozu: _3,
                  saijo: _3,
                  seiyo: _3,
                  shikokuchuo: _3,
                  tobe: _3,
                  toon: _3,
                  uchiko: _3,
                  uwajima: _3,
                  yawatahama: _3,
                },
              ],
              fukui: [
                1,
                {
                  echizen: _3,
                  eiheiji: _3,
                  fukui: _3,
                  ikeda: _3,
                  katsuyama: _3,
                  mihama: _3,
                  minamiechizen: _3,
                  obama: _3,
                  ohi: _3,
                  ono: _3,
                  sabae: _3,
                  sakai: _3,
                  takahama: _3,
                  tsuruga: _3,
                  wakasa: _3,
                },
              ],
              fukuoka: [
                1,
                {
                  ashiya: _3,
                  buzen: _3,
                  chikugo: _3,
                  chikuho: _3,
                  chikujo: _3,
                  chikushino: _3,
                  chikuzen: _3,
                  chuo: _3,
                  dazaifu: _3,
                  fukuchi: _3,
                  hakata: _3,
                  higashi: _3,
                  hirokawa: _3,
                  hisayama: _3,
                  iizuka: _3,
                  inatsuki: _3,
                  kaho: _3,
                  kasuga: _3,
                  kasuya: _3,
                  kawara: _3,
                  keisen: _3,
                  koga: _3,
                  kurate: _3,
                  kurogi: _3,
                  kurume: _3,
                  minami: _3,
                  miyako: _3,
                  miyama: _3,
                  miyawaka: _3,
                  mizumaki: _3,
                  munakata: _3,
                  nakagawa: _3,
                  nakama: _3,
                  nishi: _3,
                  nogata: _3,
                  ogori: _3,
                  okagaki: _3,
                  okawa: _3,
                  oki: _3,
                  omuta: _3,
                  onga: _3,
                  onojo: _3,
                  oto: _3,
                  saigawa: _3,
                  sasaguri: _3,
                  shingu: _3,
                  shinyoshitomi: _3,
                  shonai: _3,
                  soeda: _3,
                  sue: _3,
                  tachiarai: _3,
                  tagawa: _3,
                  takata: _3,
                  toho: _3,
                  toyotsu: _3,
                  tsuiki: _3,
                  ukiha: _3,
                  umi: _3,
                  usui: _3,
                  yamada: _3,
                  yame: _3,
                  yanagawa: _3,
                  yukuhashi: _3,
                },
              ],
              fukushima: [
                1,
                {
                  aizubange: _3,
                  aizumisato: _3,
                  aizuwakamatsu: _3,
                  asakawa: _3,
                  bandai: _3,
                  date: _3,
                  fukushima: _3,
                  furudono: _3,
                  futaba: _3,
                  hanawa: _3,
                  higashi: _3,
                  hirata: _3,
                  hirono: _3,
                  iitate: _3,
                  inawashiro: _3,
                  ishikawa: _3,
                  iwaki: _3,
                  izumizaki: _3,
                  kagamiishi: _3,
                  kaneyama: _3,
                  kawamata: _3,
                  kitakata: _3,
                  kitashiobara: _3,
                  koori: _3,
                  koriyama: _3,
                  kunimi: _3,
                  miharu: _3,
                  mishima: _3,
                  namie: _3,
                  nango: _3,
                  nishiaizu: _3,
                  nishigo: _3,
                  okuma: _3,
                  omotego: _3,
                  ono: _3,
                  otama: _3,
                  samegawa: _3,
                  shimogo: _3,
                  shirakawa: _3,
                  showa: _3,
                  soma: _3,
                  sukagawa: _3,
                  taishin: _3,
                  tamakawa: _3,
                  tanagura: _3,
                  tenei: _3,
                  yabuki: _3,
                  yamato: _3,
                  yamatsuri: _3,
                  yanaizu: _3,
                  yugawa: _3,
                },
              ],
              gifu: [
                1,
                {
                  anpachi: _3,
                  ena: _3,
                  gifu: _3,
                  ginan: _3,
                  godo: _3,
                  gujo: _3,
                  hashima: _3,
                  hichiso: _3,
                  hida: _3,
                  higashishirakawa: _3,
                  ibigawa: _3,
                  ikeda: _3,
                  kakamigahara: _3,
                  kani: _3,
                  kasahara: _3,
                  kasamatsu: _3,
                  kawaue: _3,
                  kitagata: _3,
                  mino: _3,
                  minokamo: _3,
                  mitake: _3,
                  mizunami: _3,
                  motosu: _3,
                  nakatsugawa: _3,
                  ogaki: _3,
                  sakahogi: _3,
                  seki: _3,
                  sekigahara: _3,
                  shirakawa: _3,
                  tajimi: _3,
                  takayama: _3,
                  tarui: _3,
                  toki: _3,
                  tomika: _3,
                  wanouchi: _3,
                  yamagata: _3,
                  yaotsu: _3,
                  yoro: _3,
                },
              ],
              gunma: [
                1,
                {
                  annaka: _3,
                  chiyoda: _3,
                  fujioka: _3,
                  higashiagatsuma: _3,
                  isesaki: _3,
                  itakura: _3,
                  kanna: _3,
                  kanra: _3,
                  katashina: _3,
                  kawaba: _3,
                  kiryu: _3,
                  kusatsu: _3,
                  maebashi: _3,
                  meiwa: _3,
                  midori: _3,
                  minakami: _3,
                  naganohara: _3,
                  nakanojo: _3,
                  nanmoku: _3,
                  numata: _3,
                  oizumi: _3,
                  ora: _3,
                  ota: _3,
                  shibukawa: _3,
                  shimonita: _3,
                  shinto: _3,
                  showa: _3,
                  takasaki: _3,
                  takayama: _3,
                  tamamura: _3,
                  tatebayashi: _3,
                  tomioka: _3,
                  tsukiyono: _3,
                  tsumagoi: _3,
                  ueno: _3,
                  yoshioka: _3,
                },
              ],
              hiroshima: [
                1,
                {
                  asaminami: _3,
                  daiwa: _3,
                  etajima: _3,
                  fuchu: _3,
                  fukuyama: _3,
                  hatsukaichi: _3,
                  higashihiroshima: _3,
                  hongo: _3,
                  jinsekikogen: _3,
                  kaita: _3,
                  kui: _3,
                  kumano: _3,
                  kure: _3,
                  mihara: _3,
                  miyoshi: _3,
                  naka: _3,
                  onomichi: _3,
                  osakikamijima: _3,
                  otake: _3,
                  saka: _3,
                  sera: _3,
                  seranishi: _3,
                  shinichi: _3,
                  shobara: _3,
                  takehara: _3,
                },
              ],
              hokkaido: [
                1,
                {
                  abashiri: _3,
                  abira: _3,
                  aibetsu: _3,
                  akabira: _3,
                  akkeshi: _3,
                  asahikawa: _3,
                  ashibetsu: _3,
                  ashoro: _3,
                  assabu: _3,
                  atsuma: _3,
                  bibai: _3,
                  biei: _3,
                  bifuka: _3,
                  bihoro: _3,
                  biratori: _3,
                  chippubetsu: _3,
                  chitose: _3,
                  date: _3,
                  ebetsu: _3,
                  embetsu: _3,
                  eniwa: _3,
                  erimo: _3,
                  esan: _3,
                  esashi: _3,
                  fukagawa: _3,
                  fukushima: _3,
                  furano: _3,
                  furubira: _3,
                  haboro: _3,
                  hakodate: _3,
                  hamatonbetsu: _3,
                  hidaka: _3,
                  higashikagura: _3,
                  higashikawa: _3,
                  hiroo: _3,
                  hokuryu: _3,
                  hokuto: _3,
                  honbetsu: _3,
                  horokanai: _3,
                  horonobe: _3,
                  ikeda: _3,
                  imakane: _3,
                  ishikari: _3,
                  iwamizawa: _3,
                  iwanai: _3,
                  kamifurano: _3,
                  kamikawa: _3,
                  kamishihoro: _3,
                  kamisunagawa: _3,
                  kamoenai: _3,
                  kayabe: _3,
                  kembuchi: _3,
                  kikonai: _3,
                  kimobetsu: _3,
                  kitahiroshima: _3,
                  kitami: _3,
                  kiyosato: _3,
                  koshimizu: _3,
                  kunneppu: _3,
                  kuriyama: _3,
                  kuromatsunai: _3,
                  kushiro: _3,
                  kutchan: _3,
                  kyowa: _3,
                  mashike: _3,
                  matsumae: _3,
                  mikasa: _3,
                  minamifurano: _3,
                  mombetsu: _3,
                  moseushi: _3,
                  mukawa: _3,
                  muroran: _3,
                  naie: _3,
                  nakagawa: _3,
                  nakasatsunai: _3,
                  nakatombetsu: _3,
                  nanae: _3,
                  nanporo: _3,
                  nayoro: _3,
                  nemuro: _3,
                  niikappu: _3,
                  niki: _3,
                  nishiokoppe: _3,
                  noboribetsu: _3,
                  numata: _3,
                  obihiro: _3,
                  obira: _3,
                  oketo: _3,
                  okoppe: _3,
                  otaru: _3,
                  otobe: _3,
                  otofuke: _3,
                  otoineppu: _3,
                  oumu: _3,
                  ozora: _3,
                  pippu: _3,
                  rankoshi: _3,
                  rebun: _3,
                  rikubetsu: _3,
                  rishiri: _3,
                  rishirifuji: _3,
                  saroma: _3,
                  sarufutsu: _3,
                  shakotan: _3,
                  shari: _3,
                  shibecha: _3,
                  shibetsu: _3,
                  shikabe: _3,
                  shikaoi: _3,
                  shimamaki: _3,
                  shimizu: _3,
                  shimokawa: _3,
                  shinshinotsu: _3,
                  shintoku: _3,
                  shiranuka: _3,
                  shiraoi: _3,
                  shiriuchi: _3,
                  sobetsu: _3,
                  sunagawa: _3,
                  taiki: _3,
                  takasu: _3,
                  takikawa: _3,
                  takinoue: _3,
                  teshikaga: _3,
                  tobetsu: _3,
                  tohma: _3,
                  tomakomai: _3,
                  tomari: _3,
                  toya: _3,
                  toyako: _3,
                  toyotomi: _3,
                  toyoura: _3,
                  tsubetsu: _3,
                  tsukigata: _3,
                  urakawa: _3,
                  urausu: _3,
                  uryu: _3,
                  utashinai: _3,
                  wakkanai: _3,
                  wassamu: _3,
                  yakumo: _3,
                  yoichi: _3,
                },
              ],
              hyogo: [
                1,
                {
                  aioi: _3,
                  akashi: _3,
                  ako: _3,
                  amagasaki: _3,
                  aogaki: _3,
                  asago: _3,
                  ashiya: _3,
                  awaji: _3,
                  fukusaki: _3,
                  goshiki: _3,
                  harima: _3,
                  himeji: _3,
                  ichikawa: _3,
                  inagawa: _3,
                  itami: _3,
                  kakogawa: _3,
                  kamigori: _3,
                  kamikawa: _3,
                  kasai: _3,
                  kasuga: _3,
                  kawanishi: _3,
                  miki: _3,
                  minamiawaji: _3,
                  nishinomiya: _3,
                  nishiwaki: _3,
                  ono: _3,
                  sanda: _3,
                  sannan: _3,
                  sasayama: _3,
                  sayo: _3,
                  shingu: _3,
                  shinonsen: _3,
                  shiso: _3,
                  sumoto: _3,
                  taishi: _3,
                  taka: _3,
                  takarazuka: _3,
                  takasago: _3,
                  takino: _3,
                  tamba: _3,
                  tatsuno: _3,
                  toyooka: _3,
                  yabu: _3,
                  yashiro: _3,
                  yoka: _3,
                  yokawa: _3,
                },
              ],
              ibaraki: [
                1,
                {
                  ami: _3,
                  asahi: _3,
                  bando: _3,
                  chikusei: _3,
                  daigo: _3,
                  fujishiro: _3,
                  hitachi: _3,
                  hitachinaka: _3,
                  hitachiomiya: _3,
                  hitachiota: _3,
                  ibaraki: _3,
                  ina: _3,
                  inashiki: _3,
                  itako: _3,
                  iwama: _3,
                  joso: _3,
                  kamisu: _3,
                  kasama: _3,
                  kashima: _3,
                  kasumigaura: _3,
                  koga: _3,
                  miho: _3,
                  mito: _3,
                  moriya: _3,
                  naka: _3,
                  namegata: _3,
                  oarai: _3,
                  ogawa: _3,
                  omitama: _3,
                  ryugasaki: _3,
                  sakai: _3,
                  sakuragawa: _3,
                  shimodate: _3,
                  shimotsuma: _3,
                  shirosato: _3,
                  sowa: _3,
                  suifu: _3,
                  takahagi: _3,
                  tamatsukuri: _3,
                  tokai: _3,
                  tomobe: _3,
                  tone: _3,
                  toride: _3,
                  tsuchiura: _3,
                  tsukuba: _3,
                  uchihara: _3,
                  ushiku: _3,
                  yachiyo: _3,
                  yamagata: _3,
                  yawara: _3,
                  yuki: _3,
                },
              ],
              ishikawa: [
                1,
                {
                  anamizu: _3,
                  hakui: _3,
                  hakusan: _3,
                  kaga: _3,
                  kahoku: _3,
                  kanazawa: _3,
                  kawakita: _3,
                  komatsu: _3,
                  nakanoto: _3,
                  nanao: _3,
                  nomi: _3,
                  nonoichi: _3,
                  noto: _3,
                  shika: _3,
                  suzu: _3,
                  tsubata: _3,
                  tsurugi: _3,
                  uchinada: _3,
                  wajima: _3,
                },
              ],
              iwate: [
                1,
                {
                  fudai: _3,
                  fujisawa: _3,
                  hanamaki: _3,
                  hiraizumi: _3,
                  hirono: _3,
                  ichinohe: _3,
                  ichinoseki: _3,
                  iwaizumi: _3,
                  iwate: _3,
                  joboji: _3,
                  kamaishi: _3,
                  kanegasaki: _3,
                  karumai: _3,
                  kawai: _3,
                  kitakami: _3,
                  kuji: _3,
                  kunohe: _3,
                  kuzumaki: _3,
                  miyako: _3,
                  mizusawa: _3,
                  morioka: _3,
                  ninohe: _3,
                  noda: _3,
                  ofunato: _3,
                  oshu: _3,
                  otsuchi: _3,
                  rikuzentakata: _3,
                  shiwa: _3,
                  shizukuishi: _3,
                  sumita: _3,
                  tanohata: _3,
                  tono: _3,
                  yahaba: _3,
                  yamada: _3,
                },
              ],
              kagawa: [
                1,
                {
                  ayagawa: _3,
                  higashikagawa: _3,
                  kanonji: _3,
                  kotohira: _3,
                  manno: _3,
                  marugame: _3,
                  mitoyo: _3,
                  naoshima: _3,
                  sanuki: _3,
                  tadotsu: _3,
                  takamatsu: _3,
                  tonosho: _3,
                  uchinomi: _3,
                  utazu: _3,
                  zentsuji: _3,
                },
              ],
              kagoshima: [
                1,
                {
                  akune: _3,
                  amami: _3,
                  hioki: _3,
                  isa: _3,
                  isen: _3,
                  izumi: _3,
                  kagoshima: _3,
                  kanoya: _3,
                  kawanabe: _3,
                  kinko: _3,
                  kouyama: _3,
                  makurazaki: _3,
                  matsumoto: _3,
                  minamitane: _3,
                  nakatane: _3,
                  nishinoomote: _3,
                  satsumasendai: _3,
                  soo: _3,
                  tarumizu: _3,
                  yusui: _3,
                },
              ],
              kanagawa: [
                1,
                {
                  aikawa: _3,
                  atsugi: _3,
                  ayase: _3,
                  chigasaki: _3,
                  ebina: _3,
                  fujisawa: _3,
                  hadano: _3,
                  hakone: _3,
                  hiratsuka: _3,
                  isehara: _3,
                  kaisei: _3,
                  kamakura: _3,
                  kiyokawa: _3,
                  matsuda: _3,
                  minamiashigara: _3,
                  miura: _3,
                  nakai: _3,
                  ninomiya: _3,
                  odawara: _3,
                  oi: _3,
                  oiso: _3,
                  sagamihara: _3,
                  samukawa: _3,
                  tsukui: _3,
                  yamakita: _3,
                  yamato: _3,
                  yokosuka: _3,
                  yugawara: _3,
                  zama: _3,
                  zushi: _3,
                },
              ],
              kochi: [
                1,
                {
                  aki: _3,
                  geisei: _3,
                  hidaka: _3,
                  higashitsuno: _3,
                  ino: _3,
                  kagami: _3,
                  kami: _3,
                  kitagawa: _3,
                  kochi: _3,
                  mihara: _3,
                  motoyama: _3,
                  muroto: _3,
                  nahari: _3,
                  nakamura: _3,
                  nankoku: _3,
                  nishitosa: _3,
                  niyodogawa: _3,
                  ochi: _3,
                  okawa: _3,
                  otoyo: _3,
                  otsuki: _3,
                  sakawa: _3,
                  sukumo: _3,
                  susaki: _3,
                  tosa: _3,
                  tosashimizu: _3,
                  toyo: _3,
                  tsuno: _3,
                  umaji: _3,
                  yasuda: _3,
                  yusuhara: _3,
                },
              ],
              kumamoto: [
                1,
                {
                  amakusa: _3,
                  arao: _3,
                  aso: _3,
                  choyo: _3,
                  gyokuto: _3,
                  kamiamakusa: _3,
                  kikuchi: _3,
                  kumamoto: _3,
                  mashiki: _3,
                  mifune: _3,
                  minamata: _3,
                  minamioguni: _3,
                  nagasu: _3,
                  nishihara: _3,
                  oguni: _3,
                  ozu: _3,
                  sumoto: _3,
                  takamori: _3,
                  uki: _3,
                  uto: _3,
                  yamaga: _3,
                  yamato: _3,
                  yatsushiro: _3,
                },
              ],
              kyoto: [
                1,
                {
                  ayabe: _3,
                  fukuchiyama: _3,
                  higashiyama: _3,
                  ide: _3,
                  ine: _3,
                  joyo: _3,
                  kameoka: _3,
                  kamo: _3,
                  kita: _3,
                  kizu: _3,
                  kumiyama: _3,
                  kyotamba: _3,
                  kyotanabe: _3,
                  kyotango: _3,
                  maizuru: _3,
                  minami: _3,
                  minamiyamashiro: _3,
                  miyazu: _3,
                  muko: _3,
                  nagaokakyo: _3,
                  nakagyo: _3,
                  nantan: _3,
                  oyamazaki: _3,
                  sakyo: _3,
                  seika: _3,
                  tanabe: _3,
                  uji: _3,
                  ujitawara: _3,
                  wazuka: _3,
                  yamashina: _3,
                  yawata: _3,
                },
              ],
              mie: [
                1,
                {
                  asahi: _3,
                  inabe: _3,
                  ise: _3,
                  kameyama: _3,
                  kawagoe: _3,
                  kiho: _3,
                  kisosaki: _3,
                  kiwa: _3,
                  komono: _3,
                  kumano: _3,
                  kuwana: _3,
                  matsusaka: _3,
                  meiwa: _3,
                  mihama: _3,
                  minamiise: _3,
                  misugi: _3,
                  miyama: _3,
                  nabari: _3,
                  shima: _3,
                  suzuka: _3,
                  tado: _3,
                  taiki: _3,
                  taki: _3,
                  tamaki: _3,
                  toba: _3,
                  tsu: _3,
                  udono: _3,
                  ureshino: _3,
                  watarai: _3,
                  yokkaichi: _3,
                },
              ],
              miyagi: [
                1,
                {
                  furukawa: _3,
                  higashimatsushima: _3,
                  ishinomaki: _3,
                  iwanuma: _3,
                  kakuda: _3,
                  kami: _3,
                  kawasaki: _3,
                  marumori: _3,
                  matsushima: _3,
                  minamisanriku: _3,
                  misato: _3,
                  murata: _3,
                  natori: _3,
                  ogawara: _3,
                  ohira: _3,
                  onagawa: _3,
                  osaki: _3,
                  rifu: _3,
                  semine: _3,
                  shibata: _3,
                  shichikashuku: _3,
                  shikama: _3,
                  shiogama: _3,
                  shiroishi: _3,
                  tagajo: _3,
                  taiwa: _3,
                  tome: _3,
                  tomiya: _3,
                  wakuya: _3,
                  watari: _3,
                  yamamoto: _3,
                  zao: _3,
                },
              ],
              miyazaki: [
                1,
                {
                  aya: _3,
                  ebino: _3,
                  gokase: _3,
                  hyuga: _3,
                  kadogawa: _3,
                  kawaminami: _3,
                  kijo: _3,
                  kitagawa: _3,
                  kitakata: _3,
                  kitaura: _3,
                  kobayashi: _3,
                  kunitomi: _3,
                  kushima: _3,
                  mimata: _3,
                  miyakonojo: _3,
                  miyazaki: _3,
                  morotsuka: _3,
                  nichinan: _3,
                  nishimera: _3,
                  nobeoka: _3,
                  saito: _3,
                  shiiba: _3,
                  shintomi: _3,
                  takaharu: _3,
                  takanabe: _3,
                  takazaki: _3,
                  tsuno: _3,
                },
              ],
              nagano: [
                1,
                {
                  achi: _3,
                  agematsu: _3,
                  anan: _3,
                  aoki: _3,
                  asahi: _3,
                  azumino: _3,
                  chikuhoku: _3,
                  chikuma: _3,
                  chino: _3,
                  fujimi: _3,
                  hakuba: _3,
                  hara: _3,
                  hiraya: _3,
                  iida: _3,
                  iijima: _3,
                  iiyama: _3,
                  iizuna: _3,
                  ikeda: _3,
                  ikusaka: _3,
                  ina: _3,
                  karuizawa: _3,
                  kawakami: _3,
                  kiso: _3,
                  kisofukushima: _3,
                  kitaaiki: _3,
                  komagane: _3,
                  komoro: _3,
                  matsukawa: _3,
                  matsumoto: _3,
                  miasa: _3,
                  minamiaiki: _3,
                  minamimaki: _3,
                  minamiminowa: _3,
                  minowa: _3,
                  miyada: _3,
                  miyota: _3,
                  mochizuki: _3,
                  nagano: _3,
                  nagawa: _3,
                  nagiso: _3,
                  nakagawa: _3,
                  nakano: _3,
                  nozawaonsen: _3,
                  obuse: _3,
                  ogawa: _3,
                  okaya: _3,
                  omachi: _3,
                  omi: _3,
                  ookuwa: _3,
                  ooshika: _3,
                  otaki: _3,
                  otari: _3,
                  sakae: _3,
                  sakaki: _3,
                  saku: _3,
                  sakuho: _3,
                  shimosuwa: _3,
                  shinanomachi: _3,
                  shiojiri: _3,
                  suwa: _3,
                  suzaka: _3,
                  takagi: _3,
                  takamori: _3,
                  takayama: _3,
                  tateshina: _3,
                  tatsuno: _3,
                  togakushi: _3,
                  togura: _3,
                  tomi: _3,
                  ueda: _3,
                  wada: _3,
                  yamagata: _3,
                  yamanouchi: _3,
                  yasaka: _3,
                  yasuoka: _3,
                },
              ],
              nagasaki: [
                1,
                {
                  chijiwa: _3,
                  futsu: _3,
                  goto: _3,
                  hasami: _3,
                  hirado: _3,
                  iki: _3,
                  isahaya: _3,
                  kawatana: _3,
                  kuchinotsu: _3,
                  matsuura: _3,
                  nagasaki: _3,
                  obama: _3,
                  omura: _3,
                  oseto: _3,
                  saikai: _3,
                  sasebo: _3,
                  seihi: _3,
                  shimabara: _3,
                  shinkamigoto: _3,
                  togitsu: _3,
                  tsushima: _3,
                  unzen: _3,
                },
              ],
              nara: [
                1,
                {
                  ando: _3,
                  gose: _3,
                  heguri: _3,
                  higashiyoshino: _3,
                  ikaruga: _3,
                  ikoma: _3,
                  kamikitayama: _3,
                  kanmaki: _3,
                  kashiba: _3,
                  kashihara: _3,
                  katsuragi: _3,
                  kawai: _3,
                  kawakami: _3,
                  kawanishi: _3,
                  koryo: _3,
                  kurotaki: _3,
                  mitsue: _3,
                  miyake: _3,
                  nara: _3,
                  nosegawa: _3,
                  oji: _3,
                  ouda: _3,
                  oyodo: _3,
                  sakurai: _3,
                  sango: _3,
                  shimoichi: _3,
                  shimokitayama: _3,
                  shinjo: _3,
                  soni: _3,
                  takatori: _3,
                  tawaramoto: _3,
                  tenkawa: _3,
                  tenri: _3,
                  uda: _3,
                  yamatokoriyama: _3,
                  yamatotakada: _3,
                  yamazoe: _3,
                  yoshino: _3,
                },
              ],
              niigata: [
                1,
                {
                  aga: _3,
                  agano: _3,
                  gosen: _3,
                  itoigawa: _3,
                  izumozaki: _3,
                  joetsu: _3,
                  kamo: _3,
                  kariwa: _3,
                  kashiwazaki: _3,
                  minamiuonuma: _3,
                  mitsuke: _3,
                  muika: _3,
                  murakami: _3,
                  myoko: _3,
                  nagaoka: _3,
                  niigata: _3,
                  ojiya: _3,
                  omi: _3,
                  sado: _3,
                  sanjo: _3,
                  seiro: _3,
                  seirou: _3,
                  sekikawa: _3,
                  shibata: _3,
                  tagami: _3,
                  tainai: _3,
                  tochio: _3,
                  tokamachi: _3,
                  tsubame: _3,
                  tsunan: _3,
                  uonuma: _3,
                  yahiko: _3,
                  yoita: _3,
                  yuzawa: _3,
                },
              ],
              oita: [
                1,
                {
                  beppu: _3,
                  bungoono: _3,
                  bungotakada: _3,
                  hasama: _3,
                  hiji: _3,
                  himeshima: _3,
                  hita: _3,
                  kamitsue: _3,
                  kokonoe: _3,
                  kuju: _3,
                  kunisaki: _3,
                  kusu: _3,
                  oita: _3,
                  saiki: _3,
                  taketa: _3,
                  tsukumi: _3,
                  usa: _3,
                  usuki: _3,
                  yufu: _3,
                },
              ],
              okayama: [
                1,
                {
                  akaiwa: _3,
                  asakuchi: _3,
                  bizen: _3,
                  hayashima: _3,
                  ibara: _3,
                  kagamino: _3,
                  kasaoka: _3,
                  kibichuo: _3,
                  kumenan: _3,
                  kurashiki: _3,
                  maniwa: _3,
                  misaki: _3,
                  nagi: _3,
                  niimi: _3,
                  nishiawakura: _3,
                  okayama: _3,
                  satosho: _3,
                  setouchi: _3,
                  shinjo: _3,
                  shoo: _3,
                  soja: _3,
                  takahashi: _3,
                  tamano: _3,
                  tsuyama: _3,
                  wake: _3,
                  yakage: _3,
                },
              ],
              okinawa: [
                1,
                {
                  aguni: _3,
                  ginowan: _3,
                  ginoza: _3,
                  gushikami: _3,
                  haebaru: _3,
                  higashi: _3,
                  hirara: _3,
                  iheya: _3,
                  ishigaki: _3,
                  ishikawa: _3,
                  itoman: _3,
                  izena: _3,
                  kadena: _3,
                  kin: _3,
                  kitadaito: _3,
                  kitanakagusuku: _3,
                  kumejima: _3,
                  kunigami: _3,
                  minamidaito: _3,
                  motobu: _3,
                  nago: _3,
                  naha: _3,
                  nakagusuku: _3,
                  nakijin: _3,
                  nanjo: _3,
                  nishihara: _3,
                  ogimi: _3,
                  okinawa: _3,
                  onna: _3,
                  shimoji: _3,
                  taketomi: _3,
                  tarama: _3,
                  tokashiki: _3,
                  tomigusuku: _3,
                  tonaki: _3,
                  urasoe: _3,
                  uruma: _3,
                  yaese: _3,
                  yomitan: _3,
                  yonabaru: _3,
                  yonaguni: _3,
                  zamami: _3,
                },
              ],
              osaka: [
                1,
                {
                  abeno: _3,
                  chihayaakasaka: _3,
                  chuo: _3,
                  daito: _3,
                  fujiidera: _3,
                  habikino: _3,
                  hannan: _3,
                  higashiosaka: _3,
                  higashisumiyoshi: _3,
                  higashiyodogawa: _3,
                  hirakata: _3,
                  ibaraki: _3,
                  ikeda: _3,
                  izumi: _3,
                  izumiotsu: _3,
                  izumisano: _3,
                  kadoma: _3,
                  kaizuka: _3,
                  kanan: _3,
                  kashiwara: _3,
                  katano: _3,
                  kawachinagano: _3,
                  kishiwada: _3,
                  kita: _3,
                  kumatori: _3,
                  matsubara: _3,
                  minato: _3,
                  minoh: _3,
                  misaki: _3,
                  moriguchi: _3,
                  neyagawa: _3,
                  nishi: _3,
                  nose: _3,
                  osakasayama: _3,
                  sakai: _3,
                  sayama: _3,
                  sennan: _3,
                  settsu: _3,
                  shijonawate: _3,
                  shimamoto: _3,
                  suita: _3,
                  tadaoka: _3,
                  taishi: _3,
                  tajiri: _3,
                  takaishi: _3,
                  takatsuki: _3,
                  tondabayashi: _3,
                  toyonaka: _3,
                  toyono: _3,
                  yao: _3,
                },
              ],
              saga: [
                1,
                {
                  ariake: _3,
                  arita: _3,
                  fukudomi: _3,
                  genkai: _3,
                  hamatama: _3,
                  hizen: _3,
                  imari: _3,
                  kamimine: _3,
                  kanzaki: _3,
                  karatsu: _3,
                  kashima: _3,
                  kitagata: _3,
                  kitahata: _3,
                  kiyama: _3,
                  kouhoku: _3,
                  kyuragi: _3,
                  nishiarita: _3,
                  ogi: _3,
                  omachi: _3,
                  ouchi: _3,
                  saga: _3,
                  shiroishi: _3,
                  taku: _3,
                  tara: _3,
                  tosu: _3,
                  yoshinogari: _3,
                },
              ],
              saitama: [
                1,
                {
                  arakawa: _3,
                  asaka: _3,
                  chichibu: _3,
                  fujimi: _3,
                  fujimino: _3,
                  fukaya: _3,
                  hanno: _3,
                  hanyu: _3,
                  hasuda: _3,
                  hatogaya: _3,
                  hatoyama: _3,
                  hidaka: _3,
                  higashichichibu: _3,
                  higashimatsuyama: _3,
                  honjo: _3,
                  ina: _3,
                  iruma: _3,
                  iwatsuki: _3,
                  kamiizumi: _3,
                  kamikawa: _3,
                  kamisato: _3,
                  kasukabe: _3,
                  kawagoe: _3,
                  kawaguchi: _3,
                  kawajima: _3,
                  kazo: _3,
                  kitamoto: _3,
                  koshigaya: _3,
                  kounosu: _3,
                  kuki: _3,
                  kumagaya: _3,
                  matsubushi: _3,
                  minano: _3,
                  misato: _3,
                  miyashiro: _3,
                  miyoshi: _3,
                  moroyama: _3,
                  nagatoro: _3,
                  namegawa: _3,
                  niiza: _3,
                  ogano: _3,
                  ogawa: _3,
                  ogose: _3,
                  okegawa: _3,
                  omiya: _3,
                  otaki: _3,
                  ranzan: _3,
                  ryokami: _3,
                  saitama: _3,
                  sakado: _3,
                  satte: _3,
                  sayama: _3,
                  shiki: _3,
                  shiraoka: _3,
                  soka: _3,
                  sugito: _3,
                  toda: _3,
                  tokigawa: _3,
                  tokorozawa: _3,
                  tsurugashima: _3,
                  urawa: _3,
                  warabi: _3,
                  yashio: _3,
                  yokoze: _3,
                  yono: _3,
                  yorii: _3,
                  yoshida: _3,
                  yoshikawa: _3,
                  yoshimi: _3,
                },
              ],
              shiga: [
                1,
                {
                  aisho: _3,
                  gamo: _3,
                  higashiomi: _3,
                  hikone: _3,
                  koka: _3,
                  konan: _3,
                  kosei: _3,
                  koto: _3,
                  kusatsu: _3,
                  maibara: _3,
                  moriyama: _3,
                  nagahama: _3,
                  nishiazai: _3,
                  notogawa: _3,
                  omihachiman: _3,
                  otsu: _3,
                  ritto: _3,
                  ryuoh: _3,
                  takashima: _3,
                  takatsuki: _3,
                  torahime: _3,
                  toyosato: _3,
                  yasu: _3,
                },
              ],
              shimane: [
                1,
                {
                  akagi: _3,
                  ama: _3,
                  gotsu: _3,
                  hamada: _3,
                  higashiizumo: _3,
                  hikawa: _3,
                  hikimi: _3,
                  izumo: _3,
                  kakinoki: _3,
                  masuda: _3,
                  matsue: _3,
                  misato: _3,
                  nishinoshima: _3,
                  ohda: _3,
                  okinoshima: _3,
                  okuizumo: _3,
                  shimane: _3,
                  tamayu: _3,
                  tsuwano: _3,
                  unnan: _3,
                  yakumo: _3,
                  yasugi: _3,
                  yatsuka: _3,
                },
              ],
              shizuoka: [
                1,
                {
                  arai: _3,
                  atami: _3,
                  fuji: _3,
                  fujieda: _3,
                  fujikawa: _3,
                  fujinomiya: _3,
                  fukuroi: _3,
                  gotemba: _3,
                  haibara: _3,
                  hamamatsu: _3,
                  higashiizu: _3,
                  ito: _3,
                  iwata: _3,
                  izu: _3,
                  izunokuni: _3,
                  kakegawa: _3,
                  kannami: _3,
                  kawanehon: _3,
                  kawazu: _3,
                  kikugawa: _3,
                  kosai: _3,
                  makinohara: _3,
                  matsuzaki: _3,
                  minamiizu: _3,
                  mishima: _3,
                  morimachi: _3,
                  nishiizu: _3,
                  numazu: _3,
                  omaezaki: _3,
                  shimada: _3,
                  shimizu: _3,
                  shimoda: _3,
                  shizuoka: _3,
                  susono: _3,
                  yaizu: _3,
                  yoshida: _3,
                },
              ],
              tochigi: [
                1,
                {
                  ashikaga: _3,
                  bato: _3,
                  haga: _3,
                  ichikai: _3,
                  iwafune: _3,
                  kaminokawa: _3,
                  kanuma: _3,
                  karasuyama: _3,
                  kuroiso: _3,
                  mashiko: _3,
                  mibu: _3,
                  moka: _3,
                  motegi: _3,
                  nasu: _3,
                  nasushiobara: _3,
                  nikko: _3,
                  nishikata: _3,
                  nogi: _3,
                  ohira: _3,
                  ohtawara: _3,
                  oyama: _3,
                  sakura: _3,
                  sano: _3,
                  shimotsuke: _3,
                  shioya: _3,
                  takanezawa: _3,
                  tochigi: _3,
                  tsuga: _3,
                  ujiie: _3,
                  utsunomiya: _3,
                  yaita: _3,
                },
              ],
              tokushima: [
                1,
                {
                  aizumi: _3,
                  anan: _3,
                  ichiba: _3,
                  itano: _3,
                  kainan: _3,
                  komatsushima: _3,
                  matsushige: _3,
                  mima: _3,
                  minami: _3,
                  miyoshi: _3,
                  mugi: _3,
                  nakagawa: _3,
                  naruto: _3,
                  sanagochi: _3,
                  shishikui: _3,
                  tokushima: _3,
                  wajiki: _3,
                },
              ],
              tokyo: [
                1,
                {
                  adachi: _3,
                  akiruno: _3,
                  akishima: _3,
                  aogashima: _3,
                  arakawa: _3,
                  bunkyo: _3,
                  chiyoda: _3,
                  chofu: _3,
                  chuo: _3,
                  edogawa: _3,
                  fuchu: _3,
                  fussa: _3,
                  hachijo: _3,
                  hachioji: _3,
                  hamura: _3,
                  higashikurume: _3,
                  higashimurayama: _3,
                  higashiyamato: _3,
                  hino: _3,
                  hinode: _3,
                  hinohara: _3,
                  inagi: _3,
                  itabashi: _3,
                  katsushika: _3,
                  kita: _3,
                  kiyose: _3,
                  kodaira: _3,
                  koganei: _3,
                  kokubunji: _3,
                  komae: _3,
                  koto: _3,
                  kouzushima: _3,
                  kunitachi: _3,
                  machida: _3,
                  meguro: _3,
                  minato: _3,
                  mitaka: _3,
                  mizuho: _3,
                  musashimurayama: _3,
                  musashino: _3,
                  nakano: _3,
                  nerima: _3,
                  ogasawara: _3,
                  okutama: _3,
                  ome: _3,
                  oshima: _3,
                  ota: _3,
                  setagaya: _3,
                  shibuya: _3,
                  shinagawa: _3,
                  shinjuku: _3,
                  suginami: _3,
                  sumida: _3,
                  tachikawa: _3,
                  taito: _3,
                  tama: _3,
                  toshima: _3,
                },
              ],
              tottori: [
                1,
                {
                  chizu: _3,
                  hino: _3,
                  kawahara: _3,
                  koge: _3,
                  kotoura: _3,
                  misasa: _3,
                  nanbu: _3,
                  nichinan: _3,
                  sakaiminato: _3,
                  tottori: _3,
                  wakasa: _3,
                  yazu: _3,
                  yonago: _3,
                },
              ],
              toyama: [
                1,
                {
                  asahi: _3,
                  fuchu: _3,
                  fukumitsu: _3,
                  funahashi: _3,
                  himi: _3,
                  imizu: _3,
                  inami: _3,
                  johana: _3,
                  kamiichi: _3,
                  kurobe: _3,
                  nakaniikawa: _3,
                  namerikawa: _3,
                  nanto: _3,
                  nyuzen: _3,
                  oyabe: _3,
                  taira: _3,
                  takaoka: _3,
                  tateyama: _3,
                  toga: _3,
                  tonami: _3,
                  toyama: _3,
                  unazuki: _3,
                  uozu: _3,
                  yamada: _3,
                },
              ],
              wakayama: [
                1,
                {
                  arida: _3,
                  aridagawa: _3,
                  gobo: _3,
                  hashimoto: _3,
                  hidaka: _3,
                  hirogawa: _3,
                  inami: _3,
                  iwade: _3,
                  kainan: _3,
                  kamitonda: _3,
                  katsuragi: _3,
                  kimino: _3,
                  kinokawa: _3,
                  kitayama: _3,
                  koya: _3,
                  koza: _3,
                  kozagawa: _3,
                  kudoyama: _3,
                  kushimoto: _3,
                  mihama: _3,
                  misato: _3,
                  nachikatsuura: _3,
                  shingu: _3,
                  shirahama: _3,
                  taiji: _3,
                  tanabe: _3,
                  wakayama: _3,
                  yuasa: _3,
                  yura: _3,
                },
              ],
              yamagata: [
                1,
                {
                  asahi: _3,
                  funagata: _3,
                  higashine: _3,
                  iide: _3,
                  kahoku: _3,
                  kaminoyama: _3,
                  kaneyama: _3,
                  kawanishi: _3,
                  mamurogawa: _3,
                  mikawa: _3,
                  murayama: _3,
                  nagai: _3,
                  nakayama: _3,
                  nanyo: _3,
                  nishikawa: _3,
                  obanazawa: _3,
                  oe: _3,
                  oguni: _3,
                  ohkura: _3,
                  oishida: _3,
                  sagae: _3,
                  sakata: _3,
                  sakegawa: _3,
                  shinjo: _3,
                  shirataka: _3,
                  shonai: _3,
                  takahata: _3,
                  tendo: _3,
                  tozawa: _3,
                  tsuruoka: _3,
                  yamagata: _3,
                  yamanobe: _3,
                  yonezawa: _3,
                  yuza: _3,
                },
              ],
              yamaguchi: [
                1,
                {
                  abu: _3,
                  hagi: _3,
                  hikari: _3,
                  hofu: _3,
                  iwakuni: _3,
                  kudamatsu: _3,
                  mitou: _3,
                  nagato: _3,
                  oshima: _3,
                  shimonoseki: _3,
                  shunan: _3,
                  tabuse: _3,
                  tokuyama: _3,
                  toyota: _3,
                  ube: _3,
                  yuu: _3,
                },
              ],
              yamanashi: [
                1,
                {
                  chuo: _3,
                  doshi: _3,
                  fuefuki: _3,
                  fujikawa: _3,
                  fujikawaguchiko: _3,
                  fujiyoshida: _3,
                  hayakawa: _3,
                  hokuto: _3,
                  ichikawamisato: _3,
                  kai: _3,
                  kofu: _3,
                  koshu: _3,
                  kosuge: _3,
                  'minami-alps': _3,
                  minobu: _3,
                  nakamichi: _3,
                  nanbu: _3,
                  narusawa: _3,
                  nirasaki: _3,
                  nishikatsura: _3,
                  oshino: _3,
                  otsuki: _3,
                  showa: _3,
                  tabayama: _3,
                  tsuru: _3,
                  uenohara: _3,
                  yamanakako: _3,
                  yamanashi: _3,
                },
              ],
              'xn--ehqz56n': _3,
              '\u4E09\u91CD': _3,
              'xn--1lqs03n': _3,
              '\u4EAC\u90FD': _3,
              'xn--qqqt11m': _3,
              '\u4F50\u8CC0': _3,
              'xn--f6qx53a': _3,
              '\u5175\u5EAB': _3,
              'xn--djrs72d6uy': _3,
              '\u5317\u6D77\u9053': _3,
              'xn--mkru45i': _3,
              '\u5343\u8449': _3,
              'xn--0trq7p7nn': _3,
              '\u548C\u6B4C\u5C71': _3,
              'xn--5js045d': _3,
              '\u57FC\u7389': _3,
              'xn--kbrq7o': _3,
              '\u5927\u5206': _3,
              'xn--pssu33l': _3,
              '\u5927\u962A': _3,
              'xn--ntsq17g': _3,
              '\u5948\u826F': _3,
              'xn--uisz3g': _3,
              '\u5BAE\u57CE': _3,
              'xn--6btw5a': _3,
              '\u5BAE\u5D0E': _3,
              'xn--1ctwo': _3,
              '\u5BCC\u5C71': _3,
              'xn--6orx2r': _3,
              '\u5C71\u53E3': _3,
              'xn--rht61e': _3,
              '\u5C71\u5F62': _3,
              'xn--rht27z': _3,
              '\u5C71\u68A8': _3,
              'xn--nit225k': _3,
              '\u5C90\u961C': _3,
              'xn--rht3d': _3,
              '\u5CA1\u5C71': _3,
              'xn--djty4k': _3,
              '\u5CA9\u624B': _3,
              'xn--klty5x': _3,
              '\u5CF6\u6839': _3,
              'xn--kltx9a': _3,
              '\u5E83\u5CF6': _3,
              'xn--kltp7d': _3,
              '\u5FB3\u5CF6': _3,
              'xn--c3s14m': _3,
              '\u611B\u5A9B': _3,
              'xn--vgu402c': _3,
              '\u611B\u77E5': _3,
              'xn--efvn9s': _3,
              '\u65B0\u6F5F': _3,
              'xn--1lqs71d': _3,
              '\u6771\u4EAC': _3,
              'xn--4pvxs': _3,
              '\u6803\u6728': _3,
              'xn--uuwu58a': _3,
              '\u6C96\u7E04': _3,
              'xn--zbx025d': _3,
              '\u6ECB\u8CC0': _3,
              'xn--8pvr4u': _3,
              '\u718A\u672C': _3,
              'xn--5rtp49c': _3,
              '\u77F3\u5DDD': _3,
              'xn--ntso0iqx3a': _3,
              '\u795E\u5948\u5DDD': _3,
              'xn--elqq16h': _3,
              '\u798F\u4E95': _3,
              'xn--4it168d': _3,
              '\u798F\u5CA1': _3,
              'xn--klt787d': _3,
              '\u798F\u5CF6': _3,
              'xn--rny31h': _3,
              '\u79CB\u7530': _3,
              'xn--7t0a264c': _3,
              '\u7FA4\u99AC': _3,
              'xn--uist22h': _3,
              '\u8328\u57CE': _3,
              'xn--8ltr62k': _3,
              '\u9577\u5D0E': _3,
              'xn--2m4a15e': _3,
              '\u9577\u91CE': _3,
              'xn--32vp30h': _3,
              '\u9752\u68EE': _3,
              'xn--4it797k': _3,
              '\u9759\u5CA1': _3,
              'xn--5rtq34k': _3,
              '\u9999\u5DDD': _3,
              'xn--k7yn95e': _3,
              '\u9AD8\u77E5': _3,
              'xn--tor131o': _3,
              '\u9CE5\u53D6': _3,
              'xn--d5qv7z876c': _3,
              '\u9E7F\u5150\u5CF6': _3,
              kawasaki: _18,
              kitakyushu: _18,
              kobe: _18,
              nagoya: _18,
              sapporo: _18,
              sendai: _18,
              yokohama: _18,
              buyshop: _4,
              fashionstore: _4,
              handcrafted: _4,
              kawaiishop: _4,
              supersale: _4,
              theshop: _4,
              '0am': _4,
              '0g0': _4,
              '0j0': _4,
              '0t0': _4,
              mydns: _4,
              pgw: _4,
              wjg: _4,
              usercontent: _4,
              angry: _4,
              babyblue: _4,
              babymilk: _4,
              backdrop: _4,
              bambina: _4,
              bitter: _4,
              blush: _4,
              boo: _4,
              boy: _4,
              boyfriend: _4,
              but: _4,
              candypop: _4,
              capoo: _4,
              catfood: _4,
              cheap: _4,
              chicappa: _4,
              chillout: _4,
              chips: _4,
              chowder: _4,
              chu: _4,
              ciao: _4,
              cocotte: _4,
              coolblog: _4,
              cranky: _4,
              cutegirl: _4,
              daa: _4,
              deca: _4,
              deci: _4,
              digick: _4,
              egoism: _4,
              fakefur: _4,
              fem: _4,
              flier: _4,
              floppy: _4,
              fool: _4,
              frenchkiss: _4,
              girlfriend: _4,
              girly: _4,
              gloomy: _4,
              gonna: _4,
              greater: _4,
              hacca: _4,
              heavy: _4,
              her: _4,
              hiho: _4,
              hippy: _4,
              holy: _4,
              hungry: _4,
              icurus: _4,
              itigo: _4,
              jellybean: _4,
              kikirara: _4,
              kill: _4,
              kilo: _4,
              kuron: _4,
              littlestar: _4,
              lolipopmc: _4,
              lolitapunk: _4,
              lomo: _4,
              lovepop: _4,
              lovesick: _4,
              main: _4,
              mods: _4,
              mond: _4,
              mongolian: _4,
              moo: _4,
              namaste: _4,
              nikita: _4,
              nobushi: _4,
              noor: _4,
              oops: _4,
              parallel: _4,
              parasite: _4,
              pecori: _4,
              peewee: _4,
              penne: _4,
              pepper: _4,
              perma: _4,
              pigboat: _4,
              pinoko: _4,
              punyu: _4,
              pupu: _4,
              pussycat: _4,
              pya: _4,
              raindrop: _4,
              readymade: _4,
              sadist: _4,
              schoolbus: _4,
              secret: _4,
              staba: _4,
              stripper: _4,
              sub: _4,
              sunnyday: _4,
              thick: _4,
              tonkotsu: _4,
              under: _4,
              upper: _4,
              velvet: _4,
              verse: _4,
              versus: _4,
              vivian: _4,
              watson: _4,
              weblike: _4,
              whitesnow: _4,
              zombie: _4,
              hateblo: _4,
              hatenablog: _4,
              hatenadiary: _4,
              '2-d': _4,
              bona: _4,
              crap: _4,
              daynight: _4,
              eek: _4,
              flop: _4,
              halfmoon: _4,
              jeez: _4,
              matrix: _4,
              mimoza: _4,
              netgamers: _4,
              nyanta: _4,
              o0o0: _4,
              rdy: _4,
              rgr: _4,
              rulez: _4,
              sakurastorage: [0, { isk01: _55, isk02: _55 }],
              saloon: _4,
              sblo: _4,
              skr: _4,
              tank: _4,
              'uh-oh': _4,
              undo: _4,
              webaccel: [0, { rs: _4, user: _4 }],
              websozai: _4,
              xii: _4,
            },
          ],
          ke: [
            1,
            {
              ac: _3,
              co: _3,
              go: _3,
              info: _3,
              me: _3,
              mobi: _3,
              ne: _3,
              or: _3,
              sc: _3,
            },
          ],
          kg: [
            1,
            { com: _3, edu: _3, gov: _3, mil: _3, net: _3, org: _3, us: _4 },
          ],
          kh: _18,
          ki: _56,
          km: [
            1,
            {
              ass: _3,
              com: _3,
              edu: _3,
              gov: _3,
              mil: _3,
              nom: _3,
              org: _3,
              prd: _3,
              tm: _3,
              asso: _3,
              coop: _3,
              gouv: _3,
              medecin: _3,
              notaires: _3,
              pharmaciens: _3,
              presse: _3,
              veterinaire: _3,
            },
          ],
          kn: [1, { edu: _3, gov: _3, net: _3, org: _3 }],
          kp: [1, { com: _3, edu: _3, gov: _3, org: _3, rep: _3, tra: _3 }],
          kr: [
            1,
            {
              ac: _3,
              ai: _3,
              co: _3,
              es: _3,
              go: _3,
              hs: _3,
              io: _3,
              it: _3,
              kg: _3,
              me: _3,
              mil: _3,
              ms: _3,
              ne: _3,
              or: _3,
              pe: _3,
              re: _3,
              sc: _3,
              busan: _3,
              chungbuk: _3,
              chungnam: _3,
              daegu: _3,
              daejeon: _3,
              gangwon: _3,
              gwangju: _3,
              gyeongbuk: _3,
              gyeonggi: _3,
              gyeongnam: _3,
              incheon: _3,
              jeju: _3,
              jeonbuk: _3,
              jeonnam: _3,
              seoul: _3,
              ulsan: _3,
              c01: _4,
              'eliv-dns': _4,
            },
          ],
          kw: [
            1,
            { com: _3, edu: _3, emb: _3, gov: _3, ind: _3, net: _3, org: _3 },
          ],
          ky: _45,
          kz: [
            1,
            {
              com: _3,
              edu: _3,
              gov: _3,
              mil: _3,
              net: _3,
              org: _3,
              jcloud: _4,
            },
          ],
          la: [
            1,
            {
              com: _3,
              edu: _3,
              gov: _3,
              info: _3,
              int: _3,
              net: _3,
              org: _3,
              per: _3,
              bnr: _4,
            },
          ],
          lb: _5,
          lc: [
            1,
            { co: _3, com: _3, edu: _3, gov: _3, net: _3, org: _3, oy: _4 },
          ],
          li: _3,
          lk: [
            1,
            {
              ac: _3,
              assn: _3,
              com: _3,
              edu: _3,
              gov: _3,
              grp: _3,
              hotel: _3,
              int: _3,
              ltd: _3,
              net: _3,
              ngo: _3,
              org: _3,
              sch: _3,
              soc: _3,
              web: _3,
            },
          ],
          lr: _5,
          ls: [
            1,
            {
              ac: _3,
              biz: _3,
              co: _3,
              edu: _3,
              gov: _3,
              info: _3,
              net: _3,
              org: _3,
              sc: _3,
            },
          ],
          lt: _11,
          lu: [1, { '123website': _4 }],
          lv: [
            1,
            {
              asn: _3,
              com: _3,
              conf: _3,
              edu: _3,
              gov: _3,
              id: _3,
              mil: _3,
              net: _3,
              org: _3,
            },
          ],
          ly: [
            1,
            {
              com: _3,
              edu: _3,
              gov: _3,
              id: _3,
              med: _3,
              net: _3,
              org: _3,
              plc: _3,
              sch: _3,
            },
          ],
          ma: [1, { ac: _3, co: _3, gov: _3, net: _3, org: _3, press: _3 }],
          mc: [1, { asso: _3, tm: _3 }],
          md: [1, { ir: _4 }],
          me: [
            1,
            {
              ac: _3,
              co: _3,
              edu: _3,
              gov: _3,
              its: _3,
              net: _3,
              org: _3,
              priv: _3,
              c66: _4,
              craft: _4,
              edgestack: _4,
              filegear: _4,
              glitch: _4,
              'filegear-sg': _4,
              lohmus: _4,
              barsy: _4,
              mcdir: _4,
              brasilia: _4,
              ddns: _4,
              dnsfor: _4,
              hopto: _4,
              loginto: _4,
              noip: _4,
              webhop: _4,
              soundcast: _4,
              tcp4: _4,
              vp4: _4,
              diskstation: _4,
              dscloud: _4,
              i234: _4,
              myds: _4,
              synology: _4,
              transip: _44,
              nohost: _4,
            },
          ],
          mg: [
            1,
            {
              co: _3,
              com: _3,
              edu: _3,
              gov: _3,
              mil: _3,
              nom: _3,
              org: _3,
              prd: _3,
            },
          ],
          mh: _3,
          mil: _3,
          mk: [
            1,
            { com: _3, edu: _3, gov: _3, inf: _3, name: _3, net: _3, org: _3 },
          ],
          ml: [
            1,
            {
              ac: _3,
              art: _3,
              asso: _3,
              com: _3,
              edu: _3,
              gouv: _3,
              gov: _3,
              info: _3,
              inst: _3,
              net: _3,
              org: _3,
              pr: _3,
              presse: _3,
            },
          ],
          mm: _18,
          mn: [1, { edu: _3, gov: _3, org: _3, nyc: _4 }],
          mo: _5,
          mobi: [1, { barsy: _4, dscloud: _4 }],
          mp: [1, { ju: _4 }],
          mq: _3,
          mr: _11,
          ms: [
            1,
            { com: _3, edu: _3, gov: _3, net: _3, org: _3, minisite: _4 },
          ],
          mt: _45,
          mu: [
            1,
            { ac: _3, co: _3, com: _3, gov: _3, net: _3, or: _3, org: _3 },
          ],
          museum: _3,
          mv: [
            1,
            {
              aero: _3,
              biz: _3,
              com: _3,
              coop: _3,
              edu: _3,
              gov: _3,
              info: _3,
              int: _3,
              mil: _3,
              museum: _3,
              name: _3,
              net: _3,
              org: _3,
              pro: _3,
            },
          ],
          mw: [
            1,
            {
              ac: _3,
              biz: _3,
              co: _3,
              com: _3,
              coop: _3,
              edu: _3,
              gov: _3,
              int: _3,
              net: _3,
              org: _3,
            },
          ],
          mx: [1, { com: _3, edu: _3, gob: _3, net: _3, org: _3 }],
          my: [
            1,
            {
              biz: _3,
              com: _3,
              edu: _3,
              gov: _3,
              mil: _3,
              name: _3,
              net: _3,
              org: _3,
            },
          ],
          mz: [
            1,
            {
              ac: _3,
              adv: _3,
              co: _3,
              edu: _3,
              gov: _3,
              mil: _3,
              net: _3,
              org: _3,
            },
          ],
          na: [1, { alt: _3, co: _3, com: _3, gov: _3, net: _3, org: _3 }],
          name: [1, { her: _59, his: _59 }],
          nc: [1, { asso: _3, nom: _3 }],
          ne: _3,
          net: [
            1,
            {
              adobeaemcloud: _4,
              'adobeio-static': _4,
              adobeioruntime: _4,
              akadns: _4,
              akamai: _4,
              'akamai-staging': _4,
              akamaiedge: _4,
              'akamaiedge-staging': _4,
              akamaihd: _4,
              'akamaihd-staging': _4,
              akamaiorigin: _4,
              'akamaiorigin-staging': _4,
              akamaized: _4,
              'akamaized-staging': _4,
              edgekey: _4,
              'edgekey-staging': _4,
              edgesuite: _4,
              'edgesuite-staging': _4,
              alwaysdata: _4,
              myamaze: _4,
              cloudfront: _4,
              appudo: _4,
              'atlassian-dev': [0, { prod: _52 }],
              myfritz: _4,
              onavstack: _4,
              shopselect: _4,
              blackbaudcdn: _4,
              boomla: _4,
              bplaced: _4,
              square7: _4,
              cdn77: [0, { r: _4 }],
              'cdn77-ssl': _4,
              gb: _4,
              hu: _4,
              jp: _4,
              se: _4,
              uk: _4,
              clickrising: _4,
              'ddns-ip': _4,
              'dns-cloud': _4,
              'dns-dynamic': _4,
              cloudaccess: _4,
              cloudflare: [2, { cdn: _4 }],
              cloudflareanycast: _52,
              cloudflarecn: _52,
              cloudflareglobal: _52,
              ctfcloud: _4,
              'feste-ip': _4,
              'knx-server': _4,
              'static-access': _4,
              cryptonomic: _7,
              dattolocal: _4,
              mydatto: _4,
              debian: _4,
              definima: _4,
              deno: _4,
              'at-band-camp': _4,
              blogdns: _4,
              'broke-it': _4,
              buyshouses: _4,
              dnsalias: _4,
              dnsdojo: _4,
              'does-it': _4,
              dontexist: _4,
              dynalias: _4,
              dynathome: _4,
              endofinternet: _4,
              'from-az': _4,
              'from-co': _4,
              'from-la': _4,
              'from-ny': _4,
              'gets-it': _4,
              'ham-radio-op': _4,
              homeftp: _4,
              homeip: _4,
              homelinux: _4,
              homeunix: _4,
              'in-the-band': _4,
              'is-a-chef': _4,
              'is-a-geek': _4,
              'isa-geek': _4,
              'kicks-ass': _4,
              'office-on-the': _4,
              podzone: _4,
              'scrapper-site': _4,
              selfip: _4,
              'sells-it': _4,
              servebbs: _4,
              serveftp: _4,
              thruhere: _4,
              webhop: _4,
              casacam: _4,
              dynu: _4,
              dynv6: _4,
              twmail: _4,
              ru: _4,
              channelsdvr: [2, { u: _4 }],
              fastly: [
                0,
                {
                  freetls: _4,
                  map: _4,
                  prod: [0, { a: _4, global: _4 }],
                  ssl: [0, { a: _4, b: _4, global: _4 }],
                },
              ],
              fastlylb: [2, { map: _4 }],
              edgeapp: _4,
              'keyword-on': _4,
              'live-on': _4,
              'server-on': _4,
              'cdn-edges': _4,
              heteml: _4,
              cloudfunctions: _4,
              'grafana-dev': _4,
              iobb: _4,
              moonscale: _4,
              'in-dsl': _4,
              'in-vpn': _4,
              oninferno: _4,
              botdash: _4,
              'apps-1and1': _4,
              ipifony: _4,
              cloudjiffy: [2, { 'fra1-de': _4, 'west1-us': _4 }],
              elastx: [0, { 'jls-sto1': _4, 'jls-sto2': _4, 'jls-sto3': _4 }],
              massivegrid: [
                0,
                {
                  paas: [
                    0,
                    {
                      'fr-1': _4,
                      'lon-1': _4,
                      'lon-2': _4,
                      'ny-1': _4,
                      'ny-2': _4,
                      'sg-1': _4,
                    },
                  ],
                },
              ],
              saveincloud: [0, { jelastic: _4, 'nordeste-idc': _4 }],
              scaleforce: _46,
              kinghost: _4,
              uni5: _4,
              krellian: _4,
              ggff: _4,
              localcert: _4,
              localhostcert: _4,
              localto: _7,
              barsy: _4,
              memset: _4,
              'azure-api': _4,
              'azure-mobile': _4,
              azureedge: _4,
              azurefd: _4,
              azurestaticapps: [
                2,
                {
                  1: _4,
                  2: _4,
                  3: _4,
                  4: _4,
                  5: _4,
                  6: _4,
                  7: _4,
                  centralus: _4,
                  eastasia: _4,
                  eastus2: _4,
                  westeurope: _4,
                  westus2: _4,
                },
              ],
              azurewebsites: _4,
              cloudapp: _4,
              trafficmanager: _4,
              windows: [0, { core: [0, { blob: _4 }], servicebus: _4 }],
              mynetname: [0, { sn: _4 }],
              routingthecloud: _4,
              bounceme: _4,
              ddns: _4,
              'eating-organic': _4,
              mydissent: _4,
              myeffect: _4,
              mymediapc: _4,
              mypsx: _4,
              mysecuritycamera: _4,
              nhlfan: _4,
              'no-ip': _4,
              pgafan: _4,
              privatizehealthinsurance: _4,
              redirectme: _4,
              serveblog: _4,
              serveminecraft: _4,
              sytes: _4,
              dnsup: _4,
              hicam: _4,
              'now-dns': _4,
              ownip: _4,
              vpndns: _4,
              cloudycluster: _4,
              ovh: [0, { hosting: _7, webpaas: _7 }],
              rackmaze: _4,
              myradweb: _4,
              in: _4,
              'subsc-pay': _4,
              squares: _4,
              schokokeks: _4,
              'firewall-gateway': _4,
              seidat: _4,
              senseering: _4,
              siteleaf: _4,
              mafelo: _4,
              myspreadshop: _4,
              'vps-host': [2, { jelastic: [0, { atl: _4, njs: _4, ric: _4 }] }],
              srcf: [0, { soc: _4, user: _4 }],
              supabase: _4,
              dsmynas: _4,
              familyds: _4,
              ts: [2, { c: _7 }],
              torproject: [2, { pages: _4 }],
              vusercontent: _4,
              'reserve-online': _4,
              'community-pro': _4,
              meinforum: _4,
              yandexcloud: [2, { storage: _4, website: _4 }],
              za: _4,
            },
          ],
          nf: [
            1,
            {
              arts: _3,
              com: _3,
              firm: _3,
              info: _3,
              net: _3,
              other: _3,
              per: _3,
              rec: _3,
              store: _3,
              web: _3,
            },
          ],
          ng: [
            1,
            {
              com: _3,
              edu: _3,
              gov: _3,
              i: _3,
              mil: _3,
              mobi: _3,
              name: _3,
              net: _3,
              org: _3,
              sch: _3,
              biz: [2, { co: _4, dl: _4, go: _4, lg: _4, on: _4 }],
              col: _4,
              firm: _4,
              gen: _4,
              ltd: _4,
              ngo: _4,
              plc: _4,
            },
          ],
          ni: [
            1,
            {
              ac: _3,
              biz: _3,
              co: _3,
              com: _3,
              edu: _3,
              gob: _3,
              in: _3,
              info: _3,
              int: _3,
              mil: _3,
              net: _3,
              nom: _3,
              org: _3,
              web: _3,
            },
          ],
          nl: [
            1,
            {
              co: _4,
              'hosting-cluster': _4,
              gov: _4,
              khplay: _4,
              '123website': _4,
              myspreadshop: _4,
              transurl: _7,
              cistron: _4,
              demon: _4,
            },
          ],
          no: [
            1,
            {
              fhs: _3,
              folkebibl: _3,
              fylkesbibl: _3,
              idrett: _3,
              museum: _3,
              priv: _3,
              vgs: _3,
              dep: _3,
              herad: _3,
              kommune: _3,
              mil: _3,
              stat: _3,
              aa: _60,
              ah: _60,
              bu: _60,
              fm: _60,
              hl: _60,
              hm: _60,
              'jan-mayen': _60,
              mr: _60,
              nl: _60,
              nt: _60,
              of: _60,
              ol: _60,
              oslo: _60,
              rl: _60,
              sf: _60,
              st: _60,
              svalbard: _60,
              tm: _60,
              tr: _60,
              va: _60,
              vf: _60,
              akrehamn: _3,
              'xn--krehamn-dxa': _3,
              '\xE5krehamn': _3,
              algard: _3,
              'xn--lgrd-poac': _3,
              '\xE5lg\xE5rd': _3,
              arna: _3,
              bronnoysund: _3,
              'xn--brnnysund-m8ac': _3,
              'br\xF8nn\xF8ysund': _3,
              brumunddal: _3,
              bryne: _3,
              drobak: _3,
              'xn--drbak-wua': _3,
              'dr\xF8bak': _3,
              egersund: _3,
              fetsund: _3,
              floro: _3,
              'xn--flor-jra': _3,
              'flor\xF8': _3,
              fredrikstad: _3,
              hokksund: _3,
              honefoss: _3,
              'xn--hnefoss-q1a': _3,
              'h\xF8nefoss': _3,
              jessheim: _3,
              jorpeland: _3,
              'xn--jrpeland-54a': _3,
              'j\xF8rpeland': _3,
              kirkenes: _3,
              kopervik: _3,
              krokstadelva: _3,
              langevag: _3,
              'xn--langevg-jxa': _3,
              'langev\xE5g': _3,
              leirvik: _3,
              mjondalen: _3,
              'xn--mjndalen-64a': _3,
              'mj\xF8ndalen': _3,
              'mo-i-rana': _3,
              mosjoen: _3,
              'xn--mosjen-eya': _3,
              'mosj\xF8en': _3,
              nesoddtangen: _3,
              orkanger: _3,
              osoyro: _3,
              'xn--osyro-wua': _3,
              'os\xF8yro': _3,
              raholt: _3,
              'xn--rholt-mra': _3,
              'r\xE5holt': _3,
              sandnessjoen: _3,
              'xn--sandnessjen-ogb': _3,
              'sandnessj\xF8en': _3,
              skedsmokorset: _3,
              slattum: _3,
              spjelkavik: _3,
              stathelle: _3,
              stavern: _3,
              stjordalshalsen: _3,
              'xn--stjrdalshalsen-sqb': _3,
              'stj\xF8rdalshalsen': _3,
              tananger: _3,
              tranby: _3,
              vossevangen: _3,
              aarborte: _3,
              aejrie: _3,
              afjord: _3,
              'xn--fjord-lra': _3,
              '\xE5fjord': _3,
              agdenes: _3,
              akershus: _61,
              aknoluokta: _3,
              'xn--koluokta-7ya57h': _3,
              '\xE1k\u014Boluokta': _3,
              al: _3,
              'xn--l-1fa': _3,
              '\xE5l': _3,
              alaheadju: _3,
              'xn--laheadju-7ya': _3,
              '\xE1laheadju': _3,
              alesund: _3,
              'xn--lesund-hua': _3,
              '\xE5lesund': _3,
              alstahaug: _3,
              alta: _3,
              'xn--lt-liac': _3,
              '\xE1lt\xE1': _3,
              alvdal: _3,
              amli: _3,
              'xn--mli-tla': _3,
              '\xE5mli': _3,
              amot: _3,
              'xn--mot-tla': _3,
              '\xE5mot': _3,
              andasuolo: _3,
              andebu: _3,
              andoy: _3,
              'xn--andy-ira': _3,
              'and\xF8y': _3,
              ardal: _3,
              'xn--rdal-poa': _3,
              '\xE5rdal': _3,
              aremark: _3,
              arendal: _3,
              'xn--s-1fa': _3,
              '\xE5s': _3,
              aseral: _3,
              'xn--seral-lra': _3,
              '\xE5seral': _3,
              asker: _3,
              askim: _3,
              askoy: _3,
              'xn--asky-ira': _3,
              'ask\xF8y': _3,
              askvoll: _3,
              asnes: _3,
              'xn--snes-poa': _3,
              '\xE5snes': _3,
              audnedaln: _3,
              aukra: _3,
              aure: _3,
              aurland: _3,
              'aurskog-holand': _3,
              'xn--aurskog-hland-jnb': _3,
              'aurskog-h\xF8land': _3,
              austevoll: _3,
              austrheim: _3,
              averoy: _3,
              'xn--avery-yua': _3,
              'aver\xF8y': _3,
              badaddja: _3,
              'xn--bdddj-mrabd': _3,
              'b\xE5d\xE5ddj\xE5': _3,
              'xn--brum-voa': _3,
              'b\xE6rum': _3,
              bahcavuotna: _3,
              'xn--bhcavuotna-s4a': _3,
              'b\xE1hcavuotna': _3,
              bahccavuotna: _3,
              'xn--bhccavuotna-k7a': _3,
              'b\xE1hccavuotna': _3,
              baidar: _3,
              'xn--bidr-5nac': _3,
              'b\xE1id\xE1r': _3,
              bajddar: _3,
              'xn--bjddar-pta': _3,
              'b\xE1jddar': _3,
              balat: _3,
              'xn--blt-elab': _3,
              'b\xE1l\xE1t': _3,
              balestrand: _3,
              ballangen: _3,
              balsfjord: _3,
              bamble: _3,
              bardu: _3,
              barum: _3,
              batsfjord: _3,
              'xn--btsfjord-9za': _3,
              'b\xE5tsfjord': _3,
              bearalvahki: _3,
              'xn--bearalvhki-y4a': _3,
              'bearalv\xE1hki': _3,
              beardu: _3,
              beiarn: _3,
              berg: _3,
              bergen: _3,
              berlevag: _3,
              'xn--berlevg-jxa': _3,
              'berlev\xE5g': _3,
              bievat: _3,
              'xn--bievt-0qa': _3,
              'biev\xE1t': _3,
              bindal: _3,
              birkenes: _3,
              bjarkoy: _3,
              'xn--bjarky-fya': _3,
              'bjark\xF8y': _3,
              bjerkreim: _3,
              bjugn: _3,
              bodo: _3,
              'xn--bod-2na': _3,
              'bod\xF8': _3,
              bokn: _3,
              bomlo: _3,
              'xn--bmlo-gra': _3,
              'b\xF8mlo': _3,
              bremanger: _3,
              bronnoy: _3,
              'xn--brnny-wuac': _3,
              'br\xF8nn\xF8y': _3,
              budejju: _3,
              buskerud: _61,
              bygland: _3,
              bykle: _3,
              cahcesuolo: _3,
              'xn--hcesuolo-7ya35b': _3,
              '\u010D\xE1hcesuolo': _3,
              davvenjarga: _3,
              'xn--davvenjrga-y4a': _3,
              'davvenj\xE1rga': _3,
              davvesiida: _3,
              deatnu: _3,
              dielddanuorri: _3,
              divtasvuodna: _3,
              divttasvuotna: _3,
              donna: _3,
              'xn--dnna-gra': _3,
              'd\xF8nna': _3,
              dovre: _3,
              drammen: _3,
              drangedal: _3,
              dyroy: _3,
              'xn--dyry-ira': _3,
              'dyr\xF8y': _3,
              eid: _3,
              eidfjord: _3,
              eidsberg: _3,
              eidskog: _3,
              eidsvoll: _3,
              eigersund: _3,
              elverum: _3,
              enebakk: _3,
              engerdal: _3,
              etne: _3,
              etnedal: _3,
              evenassi: _3,
              'xn--eveni-0qa01ga': _3,
              'even\xE1\u0161\u0161i': _3,
              evenes: _3,
              'evje-og-hornnes': _3,
              farsund: _3,
              fauske: _3,
              fedje: _3,
              fet: _3,
              finnoy: _3,
              'xn--finny-yua': _3,
              'finn\xF8y': _3,
              fitjar: _3,
              fjaler: _3,
              fjell: _3,
              fla: _3,
              'xn--fl-zia': _3,
              'fl\xE5': _3,
              flakstad: _3,
              flatanger: _3,
              flekkefjord: _3,
              flesberg: _3,
              flora: _3,
              folldal: _3,
              forde: _3,
              'xn--frde-gra': _3,
              'f\xF8rde': _3,
              forsand: _3,
              fosnes: _3,
              'xn--frna-woa': _3,
              'fr\xE6na': _3,
              frana: _3,
              frei: _3,
              frogn: _3,
              froland: _3,
              frosta: _3,
              froya: _3,
              'xn--frya-hra': _3,
              'fr\xF8ya': _3,
              fuoisku: _3,
              fuossko: _3,
              fusa: _3,
              fyresdal: _3,
              gaivuotna: _3,
              'xn--givuotna-8ya': _3,
              'g\xE1ivuotna': _3,
              galsa: _3,
              'xn--gls-elac': _3,
              'g\xE1ls\xE1': _3,
              gamvik: _3,
              gangaviika: _3,
              'xn--ggaviika-8ya47h': _3,
              'g\xE1\u014Bgaviika': _3,
              gaular: _3,
              gausdal: _3,
              giehtavuoatna: _3,
              gildeskal: _3,
              'xn--gildeskl-g0a': _3,
              'gildesk\xE5l': _3,
              giske: _3,
              gjemnes: _3,
              gjerdrum: _3,
              gjerstad: _3,
              gjesdal: _3,
              gjovik: _3,
              'xn--gjvik-wua': _3,
              'gj\xF8vik': _3,
              gloppen: _3,
              gol: _3,
              gran: _3,
              grane: _3,
              granvin: _3,
              gratangen: _3,
              grimstad: _3,
              grong: _3,
              grue: _3,
              gulen: _3,
              guovdageaidnu: _3,
              ha: _3,
              'xn--h-2fa': _3,
              'h\xE5': _3,
              habmer: _3,
              'xn--hbmer-xqa': _3,
              'h\xE1bmer': _3,
              hadsel: _3,
              'xn--hgebostad-g3a': _3,
              'h\xE6gebostad': _3,
              hagebostad: _3,
              halden: _3,
              halsa: _3,
              hamar: _3,
              hamaroy: _3,
              hammarfeasta: _3,
              'xn--hmmrfeasta-s4ac': _3,
              'h\xE1mm\xE1rfeasta': _3,
              hammerfest: _3,
              hapmir: _3,
              'xn--hpmir-xqa': _3,
              'h\xE1pmir': _3,
              haram: _3,
              hareid: _3,
              harstad: _3,
              hasvik: _3,
              hattfjelldal: _3,
              haugesund: _3,
              hedmark: [
                0,
                { os: _3, valer: _3, 'xn--vler-qoa': _3, 'v\xE5ler': _3 },
              ],
              hemne: _3,
              hemnes: _3,
              hemsedal: _3,
              hitra: _3,
              hjartdal: _3,
              hjelmeland: _3,
              hobol: _3,
              'xn--hobl-ira': _3,
              'hob\xF8l': _3,
              hof: _3,
              hol: _3,
              hole: _3,
              holmestrand: _3,
              holtalen: _3,
              'xn--holtlen-hxa': _3,
              'holt\xE5len': _3,
              hordaland: [0, { os: _3 }],
              hornindal: _3,
              horten: _3,
              hoyanger: _3,
              'xn--hyanger-q1a': _3,
              'h\xF8yanger': _3,
              hoylandet: _3,
              'xn--hylandet-54a': _3,
              'h\xF8ylandet': _3,
              hurdal: _3,
              hurum: _3,
              hvaler: _3,
              hyllestad: _3,
              ibestad: _3,
              inderoy: _3,
              'xn--indery-fya': _3,
              'inder\xF8y': _3,
              iveland: _3,
              ivgu: _3,
              jevnaker: _3,
              jolster: _3,
              'xn--jlster-bya': _3,
              'j\xF8lster': _3,
              jondal: _3,
              kafjord: _3,
              'xn--kfjord-iua': _3,
              'k\xE5fjord': _3,
              karasjohka: _3,
              'xn--krjohka-hwab49j': _3,
              'k\xE1r\xE1\u0161johka': _3,
              karasjok: _3,
              karlsoy: _3,
              karmoy: _3,
              'xn--karmy-yua': _3,
              'karm\xF8y': _3,
              kautokeino: _3,
              klabu: _3,
              'xn--klbu-woa': _3,
              'kl\xE6bu': _3,
              klepp: _3,
              kongsberg: _3,
              kongsvinger: _3,
              kraanghke: _3,
              'xn--kranghke-b0a': _3,
              'kr\xE5anghke': _3,
              kragero: _3,
              'xn--krager-gya': _3,
              'krager\xF8': _3,
              kristiansand: _3,
              kristiansund: _3,
              krodsherad: _3,
              'xn--krdsherad-m8a': _3,
              'kr\xF8dsherad': _3,
              'xn--kvfjord-nxa': _3,
              'kv\xE6fjord': _3,
              'xn--kvnangen-k0a': _3,
              'kv\xE6nangen': _3,
              kvafjord: _3,
              kvalsund: _3,
              kvam: _3,
              kvanangen: _3,
              kvinesdal: _3,
              kvinnherad: _3,
              kviteseid: _3,
              kvitsoy: _3,
              'xn--kvitsy-fya': _3,
              'kvits\xF8y': _3,
              laakesvuemie: _3,
              'xn--lrdal-sra': _3,
              'l\xE6rdal': _3,
              lahppi: _3,
              'xn--lhppi-xqa': _3,
              'l\xE1hppi': _3,
              lardal: _3,
              larvik: _3,
              lavagis: _3,
              lavangen: _3,
              leangaviika: _3,
              'xn--leagaviika-52b': _3,
              'lea\u014Bgaviika': _3,
              lebesby: _3,
              leikanger: _3,
              leirfjord: _3,
              leka: _3,
              leksvik: _3,
              lenvik: _3,
              lerdal: _3,
              lesja: _3,
              levanger: _3,
              lier: _3,
              lierne: _3,
              lillehammer: _3,
              lillesand: _3,
              lindas: _3,
              'xn--linds-pra': _3,
              'lind\xE5s': _3,
              lindesnes: _3,
              loabat: _3,
              'xn--loabt-0qa': _3,
              'loab\xE1t': _3,
              lodingen: _3,
              'xn--ldingen-q1a': _3,
              'l\xF8dingen': _3,
              lom: _3,
              loppa: _3,
              lorenskog: _3,
              'xn--lrenskog-54a': _3,
              'l\xF8renskog': _3,
              loten: _3,
              'xn--lten-gra': _3,
              'l\xF8ten': _3,
              lund: _3,
              lunner: _3,
              luroy: _3,
              'xn--lury-ira': _3,
              'lur\xF8y': _3,
              luster: _3,
              lyngdal: _3,
              lyngen: _3,
              malatvuopmi: _3,
              'xn--mlatvuopmi-s4a': _3,
              'm\xE1latvuopmi': _3,
              malselv: _3,
              'xn--mlselv-iua': _3,
              'm\xE5lselv': _3,
              malvik: _3,
              mandal: _3,
              marker: _3,
              marnardal: _3,
              masfjorden: _3,
              masoy: _3,
              'xn--msy-ula0h': _3,
              'm\xE5s\xF8y': _3,
              'matta-varjjat': _3,
              'xn--mtta-vrjjat-k7af': _3,
              'm\xE1tta-v\xE1rjjat': _3,
              meland: _3,
              meldal: _3,
              melhus: _3,
              meloy: _3,
              'xn--mely-ira': _3,
              'mel\xF8y': _3,
              meraker: _3,
              'xn--merker-kua': _3,
              'mer\xE5ker': _3,
              midsund: _3,
              'midtre-gauldal': _3,
              moareke: _3,
              'xn--moreke-jua': _3,
              'mo\xE5reke': _3,
              modalen: _3,
              modum: _3,
              molde: _3,
              'more-og-romsdal': [0, { heroy: _3, sande: _3 }],
              'xn--mre-og-romsdal-qqb': [0, { 'xn--hery-ira': _3, sande: _3 }],
              'm\xF8re-og-romsdal': [0, { 'her\xF8y': _3, sande: _3 }],
              moskenes: _3,
              moss: _3,
              mosvik: _3,
              muosat: _3,
              'xn--muost-0qa': _3,
              'muos\xE1t': _3,
              naamesjevuemie: _3,
              'xn--nmesjevuemie-tcba': _3,
              'n\xE5\xE5mesjevuemie': _3,
              'xn--nry-yla5g': _3,
              'n\xE6r\xF8y': _3,
              namdalseid: _3,
              namsos: _3,
              namsskogan: _3,
              nannestad: _3,
              naroy: _3,
              narviika: _3,
              narvik: _3,
              naustdal: _3,
              navuotna: _3,
              'xn--nvuotna-hwa': _3,
              'n\xE1vuotna': _3,
              'nedre-eiker': _3,
              nesna: _3,
              nesodden: _3,
              nesseby: _3,
              nesset: _3,
              nissedal: _3,
              nittedal: _3,
              'nord-aurdal': _3,
              'nord-fron': _3,
              'nord-odal': _3,
              norddal: _3,
              nordkapp: _3,
              nordland: [
                0,
                {
                  bo: _3,
                  'xn--b-5ga': _3,
                  'b\xF8': _3,
                  heroy: _3,
                  'xn--hery-ira': _3,
                  'her\xF8y': _3,
                },
              ],
              'nordre-land': _3,
              nordreisa: _3,
              'nore-og-uvdal': _3,
              notodden: _3,
              notteroy: _3,
              'xn--nttery-byae': _3,
              'n\xF8tter\xF8y': _3,
              odda: _3,
              oksnes: _3,
              'xn--ksnes-uua': _3,
              '\xF8ksnes': _3,
              omasvuotna: _3,
              oppdal: _3,
              oppegard: _3,
              'xn--oppegrd-ixa': _3,
              'oppeg\xE5rd': _3,
              orkdal: _3,
              orland: _3,
              'xn--rland-uua': _3,
              '\xF8rland': _3,
              orskog: _3,
              'xn--rskog-uua': _3,
              '\xF8rskog': _3,
              orsta: _3,
              'xn--rsta-fra': _3,
              '\xF8rsta': _3,
              osen: _3,
              osteroy: _3,
              'xn--ostery-fya': _3,
              'oster\xF8y': _3,
              ostfold: [0, { valer: _3 }],
              'xn--stfold-9xa': [0, { 'xn--vler-qoa': _3 }],
              '\xF8stfold': [0, { 'v\xE5ler': _3 }],
              'ostre-toten': _3,
              'xn--stre-toten-zcb': _3,
              '\xF8stre-toten': _3,
              overhalla: _3,
              'ovre-eiker': _3,
              'xn--vre-eiker-k8a': _3,
              '\xF8vre-eiker': _3,
              oyer: _3,
              'xn--yer-zna': _3,
              '\xF8yer': _3,
              oygarden: _3,
              'xn--ygarden-p1a': _3,
              '\xF8ygarden': _3,
              'oystre-slidre': _3,
              'xn--ystre-slidre-ujb': _3,
              '\xF8ystre-slidre': _3,
              porsanger: _3,
              porsangu: _3,
              'xn--porsgu-sta26f': _3,
              'pors\xE1\u014Bgu': _3,
              porsgrunn: _3,
              rade: _3,
              'xn--rde-ula': _3,
              'r\xE5de': _3,
              radoy: _3,
              'xn--rady-ira': _3,
              'rad\xF8y': _3,
              'xn--rlingen-mxa': _3,
              'r\xE6lingen': _3,
              rahkkeravju: _3,
              'xn--rhkkervju-01af': _3,
              'r\xE1hkker\xE1vju': _3,
              raisa: _3,
              'xn--risa-5na': _3,
              'r\xE1isa': _3,
              rakkestad: _3,
              ralingen: _3,
              rana: _3,
              randaberg: _3,
              rauma: _3,
              rendalen: _3,
              rennebu: _3,
              rennesoy: _3,
              'xn--rennesy-v1a': _3,
              'rennes\xF8y': _3,
              rindal: _3,
              ringebu: _3,
              ringerike: _3,
              ringsaker: _3,
              risor: _3,
              'xn--risr-ira': _3,
              'ris\xF8r': _3,
              rissa: _3,
              roan: _3,
              rodoy: _3,
              'xn--rdy-0nab': _3,
              'r\xF8d\xF8y': _3,
              rollag: _3,
              romsa: _3,
              romskog: _3,
              'xn--rmskog-bya': _3,
              'r\xF8mskog': _3,
              roros: _3,
              'xn--rros-gra': _3,
              'r\xF8ros': _3,
              rost: _3,
              'xn--rst-0na': _3,
              'r\xF8st': _3,
              royken: _3,
              'xn--ryken-vua': _3,
              'r\xF8yken': _3,
              royrvik: _3,
              'xn--ryrvik-bya': _3,
              'r\xF8yrvik': _3,
              ruovat: _3,
              rygge: _3,
              salangen: _3,
              salat: _3,
              'xn--slat-5na': _3,
              's\xE1lat': _3,
              'xn--slt-elab': _3,
              's\xE1l\xE1t': _3,
              saltdal: _3,
              samnanger: _3,
              sandefjord: _3,
              sandnes: _3,
              sandoy: _3,
              'xn--sandy-yua': _3,
              'sand\xF8y': _3,
              sarpsborg: _3,
              sauda: _3,
              sauherad: _3,
              sel: _3,
              selbu: _3,
              selje: _3,
              seljord: _3,
              siellak: _3,
              sigdal: _3,
              siljan: _3,
              sirdal: _3,
              skanit: _3,
              'xn--sknit-yqa': _3,
              'sk\xE1nit': _3,
              skanland: _3,
              'xn--sknland-fxa': _3,
              'sk\xE5nland': _3,
              skaun: _3,
              skedsmo: _3,
              ski: _3,
              skien: _3,
              skierva: _3,
              'xn--skierv-uta': _3,
              'skierv\xE1': _3,
              skiptvet: _3,
              skjak: _3,
              'xn--skjk-soa': _3,
              'skj\xE5k': _3,
              skjervoy: _3,
              'xn--skjervy-v1a': _3,
              'skjerv\xF8y': _3,
              skodje: _3,
              smola: _3,
              'xn--smla-hra': _3,
              'sm\xF8la': _3,
              snaase: _3,
              'xn--snase-nra': _3,
              'sn\xE5ase': _3,
              snasa: _3,
              'xn--snsa-roa': _3,
              'sn\xE5sa': _3,
              snillfjord: _3,
              snoasa: _3,
              sogndal: _3,
              sogne: _3,
              'xn--sgne-gra': _3,
              's\xF8gne': _3,
              sokndal: _3,
              sola: _3,
              solund: _3,
              somna: _3,
              'xn--smna-gra': _3,
              's\xF8mna': _3,
              'sondre-land': _3,
              'xn--sndre-land-0cb': _3,
              's\xF8ndre-land': _3,
              songdalen: _3,
              'sor-aurdal': _3,
              'xn--sr-aurdal-l8a': _3,
              's\xF8r-aurdal': _3,
              'sor-fron': _3,
              'xn--sr-fron-q1a': _3,
              's\xF8r-fron': _3,
              'sor-odal': _3,
              'xn--sr-odal-q1a': _3,
              's\xF8r-odal': _3,
              'sor-varanger': _3,
              'xn--sr-varanger-ggb': _3,
              's\xF8r-varanger': _3,
              sorfold: _3,
              'xn--srfold-bya': _3,
              's\xF8rfold': _3,
              sorreisa: _3,
              'xn--srreisa-q1a': _3,
              's\xF8rreisa': _3,
              sortland: _3,
              sorum: _3,
              'xn--srum-gra': _3,
              's\xF8rum': _3,
              spydeberg: _3,
              stange: _3,
              stavanger: _3,
              steigen: _3,
              steinkjer: _3,
              stjordal: _3,
              'xn--stjrdal-s1a': _3,
              'stj\xF8rdal': _3,
              stokke: _3,
              'stor-elvdal': _3,
              stord: _3,
              stordal: _3,
              storfjord: _3,
              strand: _3,
              stranda: _3,
              stryn: _3,
              sula: _3,
              suldal: _3,
              sund: _3,
              sunndal: _3,
              surnadal: _3,
              sveio: _3,
              svelvik: _3,
              sykkylven: _3,
              tana: _3,
              telemark: [0, { bo: _3, 'xn--b-5ga': _3, 'b\xF8': _3 }],
              time: _3,
              tingvoll: _3,
              tinn: _3,
              tjeldsund: _3,
              tjome: _3,
              'xn--tjme-hra': _3,
              'tj\xF8me': _3,
              tokke: _3,
              tolga: _3,
              tonsberg: _3,
              'xn--tnsberg-q1a': _3,
              't\xF8nsberg': _3,
              torsken: _3,
              'xn--trna-woa': _3,
              'tr\xE6na': _3,
              trana: _3,
              tranoy: _3,
              'xn--trany-yua': _3,
              'tran\xF8y': _3,
              troandin: _3,
              trogstad: _3,
              'xn--trgstad-r1a': _3,
              'tr\xF8gstad': _3,
              tromsa: _3,
              tromso: _3,
              'xn--troms-zua': _3,
              'troms\xF8': _3,
              trondheim: _3,
              trysil: _3,
              tvedestrand: _3,
              tydal: _3,
              tynset: _3,
              tysfjord: _3,
              tysnes: _3,
              'xn--tysvr-vra': _3,
              'tysv\xE6r': _3,
              tysvar: _3,
              ullensaker: _3,
              ullensvang: _3,
              ulvik: _3,
              unjarga: _3,
              'xn--unjrga-rta': _3,
              'unj\xE1rga': _3,
              utsira: _3,
              vaapste: _3,
              vadso: _3,
              'xn--vads-jra': _3,
              'vads\xF8': _3,
              'xn--vry-yla5g': _3,
              'v\xE6r\xF8y': _3,
              vaga: _3,
              'xn--vg-yiab': _3,
              'v\xE5g\xE5': _3,
              vagan: _3,
              'xn--vgan-qoa': _3,
              'v\xE5gan': _3,
              vagsoy: _3,
              'xn--vgsy-qoa0j': _3,
              'v\xE5gs\xF8y': _3,
              vaksdal: _3,
              valle: _3,
              vang: _3,
              vanylven: _3,
              vardo: _3,
              'xn--vard-jra': _3,
              'vard\xF8': _3,
              varggat: _3,
              'xn--vrggt-xqad': _3,
              'v\xE1rgg\xE1t': _3,
              varoy: _3,
              vefsn: _3,
              vega: _3,
              vegarshei: _3,
              'xn--vegrshei-c0a': _3,
              'veg\xE5rshei': _3,
              vennesla: _3,
              verdal: _3,
              verran: _3,
              vestby: _3,
              vestfold: [0, { sande: _3 }],
              vestnes: _3,
              'vestre-slidre': _3,
              'vestre-toten': _3,
              vestvagoy: _3,
              'xn--vestvgy-ixa6o': _3,
              'vestv\xE5g\xF8y': _3,
              vevelstad: _3,
              vik: _3,
              vikna: _3,
              vindafjord: _3,
              voagat: _3,
              volda: _3,
              voss: _3,
              co: _4,
              '123hjemmeside': _4,
              myspreadshop: _4,
            },
          ],
          np: _18,
          nr: _56,
          nu: [
            1,
            { merseine: _4, mine: _4, shacknet: _4, enterprisecloud: _4 },
          ],
          nz: [
            1,
            {
              ac: _3,
              co: _3,
              cri: _3,
              geek: _3,
              gen: _3,
              govt: _3,
              health: _3,
              iwi: _3,
              kiwi: _3,
              maori: _3,
              'xn--mori-qsa': _3,
              'm\u0101ori': _3,
              mil: _3,
              net: _3,
              org: _3,
              parliament: _3,
              school: _3,
              cloudns: _4,
            },
          ],
          om: [
            1,
            {
              co: _3,
              com: _3,
              edu: _3,
              gov: _3,
              med: _3,
              museum: _3,
              net: _3,
              org: _3,
              pro: _3,
            },
          ],
          onion: _3,
          org: [
            1,
            {
              altervista: _4,
              pimienta: _4,
              poivron: _4,
              potager: _4,
              sweetpepper: _4,
              cdn77: [0, { c: _4, rsc: _4 }],
              'cdn77-secure': [0, { origin: [0, { ssl: _4 }] }],
              ae: _4,
              cloudns: _4,
              'ip-dynamic': _4,
              ddnss: _4,
              dpdns: _4,
              duckdns: _4,
              tunk: _4,
              blogdns: _4,
              blogsite: _4,
              boldlygoingnowhere: _4,
              dnsalias: _4,
              dnsdojo: _4,
              doesntexist: _4,
              dontexist: _4,
              doomdns: _4,
              dvrdns: _4,
              dynalias: _4,
              dyndns: [2, { go: _4, home: _4 }],
              endofinternet: _4,
              endoftheinternet: _4,
              'from-me': _4,
              'game-host': _4,
              gotdns: _4,
              'hobby-site': _4,
              homedns: _4,
              homeftp: _4,
              homelinux: _4,
              homeunix: _4,
              'is-a-bruinsfan': _4,
              'is-a-candidate': _4,
              'is-a-celticsfan': _4,
              'is-a-chef': _4,
              'is-a-geek': _4,
              'is-a-knight': _4,
              'is-a-linux-user': _4,
              'is-a-patsfan': _4,
              'is-a-soxfan': _4,
              'is-found': _4,
              'is-lost': _4,
              'is-saved': _4,
              'is-very-bad': _4,
              'is-very-evil': _4,
              'is-very-good': _4,
              'is-very-nice': _4,
              'is-very-sweet': _4,
              'isa-geek': _4,
              'kicks-ass': _4,
              misconfused: _4,
              podzone: _4,
              readmyblog: _4,
              selfip: _4,
              sellsyourhome: _4,
              servebbs: _4,
              serveftp: _4,
              servegame: _4,
              'stuff-4-sale': _4,
              webhop: _4,
              accesscam: _4,
              camdvr: _4,
              freeddns: _4,
              mywire: _4,
              webredirect: _4,
              twmail: _4,
              eu: [
                2,
                {
                  al: _4,
                  asso: _4,
                  at: _4,
                  au: _4,
                  be: _4,
                  bg: _4,
                  ca: _4,
                  cd: _4,
                  ch: _4,
                  cn: _4,
                  cy: _4,
                  cz: _4,
                  de: _4,
                  dk: _4,
                  edu: _4,
                  ee: _4,
                  es: _4,
                  fi: _4,
                  fr: _4,
                  gr: _4,
                  hr: _4,
                  hu: _4,
                  ie: _4,
                  il: _4,
                  in: _4,
                  int: _4,
                  is: _4,
                  it: _4,
                  jp: _4,
                  kr: _4,
                  lt: _4,
                  lu: _4,
                  lv: _4,
                  me: _4,
                  mk: _4,
                  mt: _4,
                  my: _4,
                  net: _4,
                  ng: _4,
                  nl: _4,
                  no: _4,
                  nz: _4,
                  pl: _4,
                  pt: _4,
                  ro: _4,
                  ru: _4,
                  se: _4,
                  si: _4,
                  sk: _4,
                  tr: _4,
                  uk: _4,
                  us: _4,
                },
              ],
              fedorainfracloud: _4,
              fedorapeople: _4,
              fedoraproject: [0, { cloud: _4, os: _43, stg: [0, { os: _43 }] }],
              freedesktop: _4,
              hatenadiary: _4,
              hepforge: _4,
              'in-dsl': _4,
              'in-vpn': _4,
              js: _4,
              barsy: _4,
              mayfirst: _4,
              routingthecloud: _4,
              bmoattachments: _4,
              'cable-modem': _4,
              collegefan: _4,
              couchpotatofries: _4,
              hopto: _4,
              mlbfan: _4,
              myftp: _4,
              mysecuritycamera: _4,
              nflfan: _4,
              'no-ip': _4,
              'read-books': _4,
              ufcfan: _4,
              zapto: _4,
              dynserv: _4,
              'now-dns': _4,
              'is-local': _4,
              httpbin: _4,
              pubtls: _4,
              jpn: _4,
              'my-firewall': _4,
              myfirewall: _4,
              spdns: _4,
              'small-web': _4,
              dsmynas: _4,
              familyds: _4,
              teckids: _55,
              tuxfamily: _4,
              diskstation: _4,
              hk: _4,
              us: _4,
              toolforge: _4,
              wmcloud: _4,
              wmflabs: _4,
              za: _4,
            },
          ],
          pa: [
            1,
            {
              abo: _3,
              ac: _3,
              com: _3,
              edu: _3,
              gob: _3,
              ing: _3,
              med: _3,
              net: _3,
              nom: _3,
              org: _3,
              sld: _3,
            },
          ],
          pe: [
            1,
            { com: _3, edu: _3, gob: _3, mil: _3, net: _3, nom: _3, org: _3 },
          ],
          pf: [1, { com: _3, edu: _3, org: _3 }],
          pg: _18,
          ph: [
            1,
            {
              com: _3,
              edu: _3,
              gov: _3,
              i: _3,
              mil: _3,
              net: _3,
              ngo: _3,
              org: _3,
              cloudns: _4,
            },
          ],
          pk: [
            1,
            {
              ac: _3,
              biz: _3,
              com: _3,
              edu: _3,
              fam: _3,
              gkp: _3,
              gob: _3,
              gog: _3,
              gok: _3,
              gop: _3,
              gos: _3,
              gov: _3,
              net: _3,
              org: _3,
              web: _3,
            },
          ],
          pl: [
            1,
            {
              com: _3,
              net: _3,
              org: _3,
              agro: _3,
              aid: _3,
              atm: _3,
              auto: _3,
              biz: _3,
              edu: _3,
              gmina: _3,
              gsm: _3,
              info: _3,
              mail: _3,
              media: _3,
              miasta: _3,
              mil: _3,
              nieruchomosci: _3,
              nom: _3,
              pc: _3,
              powiat: _3,
              priv: _3,
              realestate: _3,
              rel: _3,
              sex: _3,
              shop: _3,
              sklep: _3,
              sos: _3,
              szkola: _3,
              targi: _3,
              tm: _3,
              tourism: _3,
              travel: _3,
              turystyka: _3,
              gov: [
                1,
                {
                  ap: _3,
                  griw: _3,
                  ic: _3,
                  is: _3,
                  kmpsp: _3,
                  konsulat: _3,
                  kppsp: _3,
                  kwp: _3,
                  kwpsp: _3,
                  mup: _3,
                  mw: _3,
                  oia: _3,
                  oirm: _3,
                  oke: _3,
                  oow: _3,
                  oschr: _3,
                  oum: _3,
                  pa: _3,
                  pinb: _3,
                  piw: _3,
                  po: _3,
                  pr: _3,
                  psp: _3,
                  psse: _3,
                  pup: _3,
                  rzgw: _3,
                  sa: _3,
                  sdn: _3,
                  sko: _3,
                  so: _3,
                  sr: _3,
                  starostwo: _3,
                  ug: _3,
                  ugim: _3,
                  um: _3,
                  umig: _3,
                  upow: _3,
                  uppo: _3,
                  us: _3,
                  uw: _3,
                  uzs: _3,
                  wif: _3,
                  wiih: _3,
                  winb: _3,
                  wios: _3,
                  witd: _3,
                  wiw: _3,
                  wkz: _3,
                  wsa: _3,
                  wskr: _3,
                  wsse: _3,
                  wuoz: _3,
                  wzmiuw: _3,
                  zp: _3,
                  zpisdn: _3,
                },
              ],
              augustow: _3,
              'babia-gora': _3,
              bedzin: _3,
              beskidy: _3,
              bialowieza: _3,
              bialystok: _3,
              bielawa: _3,
              bieszczady: _3,
              boleslawiec: _3,
              bydgoszcz: _3,
              bytom: _3,
              cieszyn: _3,
              czeladz: _3,
              czest: _3,
              dlugoleka: _3,
              elblag: _3,
              elk: _3,
              glogow: _3,
              gniezno: _3,
              gorlice: _3,
              grajewo: _3,
              ilawa: _3,
              jaworzno: _3,
              'jelenia-gora': _3,
              jgora: _3,
              kalisz: _3,
              karpacz: _3,
              kartuzy: _3,
              kaszuby: _3,
              katowice: _3,
              'kazimierz-dolny': _3,
              kepno: _3,
              ketrzyn: _3,
              klodzko: _3,
              kobierzyce: _3,
              kolobrzeg: _3,
              konin: _3,
              konskowola: _3,
              kutno: _3,
              lapy: _3,
              lebork: _3,
              legnica: _3,
              lezajsk: _3,
              limanowa: _3,
              lomza: _3,
              lowicz: _3,
              lubin: _3,
              lukow: _3,
              malbork: _3,
              malopolska: _3,
              mazowsze: _3,
              mazury: _3,
              mielec: _3,
              mielno: _3,
              mragowo: _3,
              naklo: _3,
              nowaruda: _3,
              nysa: _3,
              olawa: _3,
              olecko: _3,
              olkusz: _3,
              olsztyn: _3,
              opoczno: _3,
              opole: _3,
              ostroda: _3,
              ostroleka: _3,
              ostrowiec: _3,
              ostrowwlkp: _3,
              pila: _3,
              pisz: _3,
              podhale: _3,
              podlasie: _3,
              polkowice: _3,
              pomorskie: _3,
              pomorze: _3,
              prochowice: _3,
              pruszkow: _3,
              przeworsk: _3,
              pulawy: _3,
              radom: _3,
              'rawa-maz': _3,
              rybnik: _3,
              rzeszow: _3,
              sanok: _3,
              sejny: _3,
              skoczow: _3,
              slask: _3,
              slupsk: _3,
              sosnowiec: _3,
              'stalowa-wola': _3,
              starachowice: _3,
              stargard: _3,
              suwalki: _3,
              swidnica: _3,
              swiebodzin: _3,
              swinoujscie: _3,
              szczecin: _3,
              szczytno: _3,
              tarnobrzeg: _3,
              tgory: _3,
              turek: _3,
              tychy: _3,
              ustka: _3,
              walbrzych: _3,
              warmia: _3,
              warszawa: _3,
              waw: _3,
              wegrow: _3,
              wielun: _3,
              wlocl: _3,
              wloclawek: _3,
              wodzislaw: _3,
              wolomin: _3,
              wroclaw: _3,
              zachpomor: _3,
              zagan: _3,
              zarow: _3,
              zgora: _3,
              zgorzelec: _3,
              art: _4,
              gliwice: _4,
              krakow: _4,
              poznan: _4,
              wroc: _4,
              zakopane: _4,
              beep: _4,
              'ecommerce-shop': _4,
              cfolks: _4,
              dfirma: _4,
              dkonto: _4,
              you2: _4,
              shoparena: _4,
              homesklep: _4,
              sdscloud: _4,
              unicloud: _4,
              lodz: _4,
              pabianice: _4,
              plock: _4,
              sieradz: _4,
              skierniewice: _4,
              zgierz: _4,
              krasnik: _4,
              leczna: _4,
              lubartow: _4,
              lublin: _4,
              poniatowa: _4,
              swidnik: _4,
              co: _4,
              torun: _4,
              simplesite: _4,
              myspreadshop: _4,
              gda: _4,
              gdansk: _4,
              gdynia: _4,
              med: _4,
              sopot: _4,
              bielsko: _4,
            },
          ],
          pm: [1, { own: _4, name: _4 }],
          pn: [1, { co: _3, edu: _3, gov: _3, net: _3, org: _3 }],
          post: _3,
          pr: [
            1,
            {
              biz: _3,
              com: _3,
              edu: _3,
              gov: _3,
              info: _3,
              isla: _3,
              name: _3,
              net: _3,
              org: _3,
              pro: _3,
              ac: _3,
              est: _3,
              prof: _3,
            },
          ],
          pro: [
            1,
            {
              aaa: _3,
              aca: _3,
              acct: _3,
              avocat: _3,
              bar: _3,
              cpa: _3,
              eng: _3,
              jur: _3,
              law: _3,
              med: _3,
              recht: _3,
              '12chars': _4,
              cloudns: _4,
              barsy: _4,
              ngrok: _4,
            },
          ],
          ps: [
            1,
            { com: _3, edu: _3, gov: _3, net: _3, org: _3, plo: _3, sec: _3 },
          ],
          pt: [
            1,
            {
              com: _3,
              edu: _3,
              gov: _3,
              int: _3,
              net: _3,
              nome: _3,
              org: _3,
              publ: _3,
              '123paginaweb': _4,
            },
          ],
          pw: [1, { gov: _3, cloudns: _4, x443: _4 }],
          py: [
            1,
            { com: _3, coop: _3, edu: _3, gov: _3, mil: _3, net: _3, org: _3 },
          ],
          qa: [
            1,
            {
              com: _3,
              edu: _3,
              gov: _3,
              mil: _3,
              name: _3,
              net: _3,
              org: _3,
              sch: _3,
            },
          ],
          re: [1, { asso: _3, com: _3, netlib: _4, can: _4 }],
          ro: [
            1,
            {
              arts: _3,
              com: _3,
              firm: _3,
              info: _3,
              nom: _3,
              nt: _3,
              org: _3,
              rec: _3,
              store: _3,
              tm: _3,
              www: _3,
              co: _4,
              shop: _4,
              barsy: _4,
            },
          ],
          rs: [
            1,
            {
              ac: _3,
              co: _3,
              edu: _3,
              gov: _3,
              in: _3,
              org: _3,
              brendly: _51,
              barsy: _4,
              ox: _4,
            },
          ],
          ru: [
            1,
            {
              ac: _4,
              edu: _4,
              gov: _4,
              int: _4,
              mil: _4,
              eurodir: _4,
              adygeya: _4,
              bashkiria: _4,
              bir: _4,
              cbg: _4,
              com: _4,
              dagestan: _4,
              grozny: _4,
              kalmykia: _4,
              kustanai: _4,
              marine: _4,
              mordovia: _4,
              msk: _4,
              mytis: _4,
              nalchik: _4,
              nov: _4,
              pyatigorsk: _4,
              spb: _4,
              vladikavkaz: _4,
              vladimir: _4,
              na4u: _4,
              mircloud: _4,
              myjino: [2, { hosting: _7, landing: _7, spectrum: _7, vps: _7 }],
              cldmail: [0, { hb: _4 }],
              mcdir: [2, { vps: _4 }],
              mcpre: _4,
              net: _4,
              org: _4,
              pp: _4,
              lk3: _4,
              ras: _4,
            },
          ],
          rw: [
            1,
            { ac: _3, co: _3, coop: _3, gov: _3, mil: _3, net: _3, org: _3 },
          ],
          sa: [
            1,
            {
              com: _3,
              edu: _3,
              gov: _3,
              med: _3,
              net: _3,
              org: _3,
              pub: _3,
              sch: _3,
            },
          ],
          sb: _5,
          sc: _5,
          sd: [
            1,
            {
              com: _3,
              edu: _3,
              gov: _3,
              info: _3,
              med: _3,
              net: _3,
              org: _3,
              tv: _3,
            },
          ],
          se: [
            1,
            {
              a: _3,
              ac: _3,
              b: _3,
              bd: _3,
              brand: _3,
              c: _3,
              d: _3,
              e: _3,
              f: _3,
              fh: _3,
              fhsk: _3,
              fhv: _3,
              g: _3,
              h: _3,
              i: _3,
              k: _3,
              komforb: _3,
              kommunalforbund: _3,
              komvux: _3,
              l: _3,
              lanbib: _3,
              m: _3,
              n: _3,
              naturbruksgymn: _3,
              o: _3,
              org: _3,
              p: _3,
              parti: _3,
              pp: _3,
              press: _3,
              r: _3,
              s: _3,
              t: _3,
              tm: _3,
              u: _3,
              w: _3,
              x: _3,
              y: _3,
              z: _3,
              com: _4,
              iopsys: _4,
              '123minsida': _4,
              itcouldbewor: _4,
              myspreadshop: _4,
            },
          ],
          sg: [
            1,
            { com: _3, edu: _3, gov: _3, net: _3, org: _3, enscaled: _4 },
          ],
          sh: [
            1,
            {
              com: _3,
              gov: _3,
              mil: _3,
              net: _3,
              org: _3,
              hashbang: _4,
              botda: _4,
              platform: [0, { ent: _4, eu: _4, us: _4 }],
              now: _4,
            },
          ],
          si: [1, { f5: _4, gitapp: _4, gitpage: _4 }],
          sj: _3,
          sk: _3,
          sl: _5,
          sm: _3,
          sn: [
            1,
            {
              art: _3,
              com: _3,
              edu: _3,
              gouv: _3,
              org: _3,
              perso: _3,
              univ: _3,
            },
          ],
          so: [
            1,
            {
              com: _3,
              edu: _3,
              gov: _3,
              me: _3,
              net: _3,
              org: _3,
              surveys: _4,
            },
          ],
          sr: _3,
          ss: [
            1,
            {
              biz: _3,
              co: _3,
              com: _3,
              edu: _3,
              gov: _3,
              me: _3,
              net: _3,
              org: _3,
              sch: _3,
            },
          ],
          st: [
            1,
            {
              co: _3,
              com: _3,
              consulado: _3,
              edu: _3,
              embaixada: _3,
              mil: _3,
              net: _3,
              org: _3,
              principe: _3,
              saotome: _3,
              store: _3,
              helioho: _4,
              kirara: _4,
              noho: _4,
            },
          ],
          su: [
            1,
            {
              abkhazia: _4,
              adygeya: _4,
              aktyubinsk: _4,
              arkhangelsk: _4,
              armenia: _4,
              ashgabad: _4,
              azerbaijan: _4,
              balashov: _4,
              bashkiria: _4,
              bryansk: _4,
              bukhara: _4,
              chimkent: _4,
              dagestan: _4,
              'east-kazakhstan': _4,
              exnet: _4,
              georgia: _4,
              grozny: _4,
              ivanovo: _4,
              jambyl: _4,
              kalmykia: _4,
              kaluga: _4,
              karacol: _4,
              karaganda: _4,
              karelia: _4,
              khakassia: _4,
              krasnodar: _4,
              kurgan: _4,
              kustanai: _4,
              lenug: _4,
              mangyshlak: _4,
              mordovia: _4,
              msk: _4,
              murmansk: _4,
              nalchik: _4,
              navoi: _4,
              'north-kazakhstan': _4,
              nov: _4,
              obninsk: _4,
              penza: _4,
              pokrovsk: _4,
              sochi: _4,
              spb: _4,
              tashkent: _4,
              termez: _4,
              togliatti: _4,
              troitsk: _4,
              tselinograd: _4,
              tula: _4,
              tuva: _4,
              vladikavkaz: _4,
              vladimir: _4,
              vologda: _4,
            },
          ],
          sv: [1, { com: _3, edu: _3, gob: _3, org: _3, red: _3 }],
          sx: _11,
          sy: _6,
          sz: [1, { ac: _3, co: _3, org: _3 }],
          tc: _3,
          td: _3,
          tel: _3,
          tf: [1, { sch: _4 }],
          tg: _3,
          th: [
            1,
            {
              ac: _3,
              co: _3,
              go: _3,
              in: _3,
              mi: _3,
              net: _3,
              or: _3,
              online: _4,
              shop: _4,
            },
          ],
          tj: [
            1,
            {
              ac: _3,
              biz: _3,
              co: _3,
              com: _3,
              edu: _3,
              go: _3,
              gov: _3,
              int: _3,
              mil: _3,
              name: _3,
              net: _3,
              nic: _3,
              org: _3,
              test: _3,
              web: _3,
            },
          ],
          tk: _3,
          tl: _11,
          tm: [
            1,
            {
              co: _3,
              com: _3,
              edu: _3,
              gov: _3,
              mil: _3,
              net: _3,
              nom: _3,
              org: _3,
            },
          ],
          tn: [
            1,
            {
              com: _3,
              ens: _3,
              fin: _3,
              gov: _3,
              ind: _3,
              info: _3,
              intl: _3,
              mincom: _3,
              nat: _3,
              net: _3,
              org: _3,
              perso: _3,
              tourism: _3,
              orangecloud: _4,
            },
          ],
          to: [
            1,
            {
              611: _4,
              com: _3,
              edu: _3,
              gov: _3,
              mil: _3,
              net: _3,
              org: _3,
              oya: _4,
              x0: _4,
              quickconnect: _25,
              vpnplus: _4,
            },
          ],
          tr: [
            1,
            {
              av: _3,
              bbs: _3,
              bel: _3,
              biz: _3,
              com: _3,
              dr: _3,
              edu: _3,
              gen: _3,
              gov: _3,
              info: _3,
              k12: _3,
              kep: _3,
              mil: _3,
              name: _3,
              net: _3,
              org: _3,
              pol: _3,
              tel: _3,
              tsk: _3,
              tv: _3,
              web: _3,
              nc: _11,
            },
          ],
          tt: [
            1,
            {
              biz: _3,
              co: _3,
              com: _3,
              edu: _3,
              gov: _3,
              info: _3,
              mil: _3,
              name: _3,
              net: _3,
              org: _3,
              pro: _3,
            },
          ],
          tv: [
            1,
            {
              'better-than': _4,
              dyndns: _4,
              'on-the-web': _4,
              'worse-than': _4,
              from: _4,
              sakura: _4,
            },
          ],
          tw: [
            1,
            {
              club: _3,
              com: [1, { mymailer: _4 }],
              ebiz: _3,
              edu: _3,
              game: _3,
              gov: _3,
              idv: _3,
              mil: _3,
              net: _3,
              org: _3,
              url: _4,
              mydns: _4,
            },
          ],
          tz: [
            1,
            {
              ac: _3,
              co: _3,
              go: _3,
              hotel: _3,
              info: _3,
              me: _3,
              mil: _3,
              mobi: _3,
              ne: _3,
              or: _3,
              sc: _3,
              tv: _3,
            },
          ],
          ua: [
            1,
            {
              com: _3,
              edu: _3,
              gov: _3,
              in: _3,
              net: _3,
              org: _3,
              cherkassy: _3,
              cherkasy: _3,
              chernigov: _3,
              chernihiv: _3,
              chernivtsi: _3,
              chernovtsy: _3,
              ck: _3,
              cn: _3,
              cr: _3,
              crimea: _3,
              cv: _3,
              dn: _3,
              dnepropetrovsk: _3,
              dnipropetrovsk: _3,
              donetsk: _3,
              dp: _3,
              if: _3,
              'ivano-frankivsk': _3,
              kh: _3,
              kharkiv: _3,
              kharkov: _3,
              kherson: _3,
              khmelnitskiy: _3,
              khmelnytskyi: _3,
              kiev: _3,
              kirovograd: _3,
              km: _3,
              kr: _3,
              kropyvnytskyi: _3,
              krym: _3,
              ks: _3,
              kv: _3,
              kyiv: _3,
              lg: _3,
              lt: _3,
              lugansk: _3,
              luhansk: _3,
              lutsk: _3,
              lv: _3,
              lviv: _3,
              mk: _3,
              mykolaiv: _3,
              nikolaev: _3,
              od: _3,
              odesa: _3,
              odessa: _3,
              pl: _3,
              poltava: _3,
              rivne: _3,
              rovno: _3,
              rv: _3,
              sb: _3,
              sebastopol: _3,
              sevastopol: _3,
              sm: _3,
              sumy: _3,
              te: _3,
              ternopil: _3,
              uz: _3,
              uzhgorod: _3,
              uzhhorod: _3,
              vinnica: _3,
              vinnytsia: _3,
              vn: _3,
              volyn: _3,
              yalta: _3,
              zakarpattia: _3,
              zaporizhzhe: _3,
              zaporizhzhia: _3,
              zhitomir: _3,
              zhytomyr: _3,
              zp: _3,
              zt: _3,
              cc: _4,
              inf: _4,
              ltd: _4,
              cx: _4,
              ie: _4,
              biz: _4,
              co: _4,
              pp: _4,
              v: _4,
            },
          ],
          ug: [
            1,
            {
              ac: _3,
              co: _3,
              com: _3,
              edu: _3,
              go: _3,
              gov: _3,
              mil: _3,
              ne: _3,
              or: _3,
              org: _3,
              sc: _3,
              us: _3,
            },
          ],
          uk: [
            1,
            {
              ac: _3,
              co: [
                1,
                {
                  bytemark: [0, { dh: _4, vm: _4 }],
                  layershift: _46,
                  barsy: _4,
                  barsyonline: _4,
                  retrosnub: _54,
                  'nh-serv': _4,
                  'no-ip': _4,
                  adimo: _4,
                  myspreadshop: _4,
                },
              ],
              gov: [1, { api: _4, campaign: _4, service: _4 }],
              ltd: _3,
              me: _3,
              net: _3,
              nhs: _3,
              org: [
                1,
                {
                  glug: _4,
                  lug: _4,
                  lugs: _4,
                  affinitylottery: _4,
                  raffleentry: _4,
                  weeklylottery: _4,
                },
              ],
              plc: _3,
              police: _3,
              sch: _18,
              conn: _4,
              copro: _4,
              hosp: _4,
              'independent-commission': _4,
              'independent-inquest': _4,
              'independent-inquiry': _4,
              'independent-panel': _4,
              'independent-review': _4,
              'public-inquiry': _4,
              'royal-commission': _4,
              pymnt: _4,
              barsy: _4,
              nimsite: _4,
              oraclegovcloudapps: _7,
            },
          ],
          us: [
            1,
            {
              dni: _3,
              isa: _3,
              nsn: _3,
              ak: _62,
              al: _62,
              ar: _62,
              as: _62,
              az: _62,
              ca: _62,
              co: _62,
              ct: _62,
              dc: _62,
              de: [1, { cc: _3, lib: _4 }],
              fl: _62,
              ga: _62,
              gu: _62,
              hi: _63,
              ia: _62,
              id: _62,
              il: _62,
              in: _62,
              ks: _62,
              ky: _62,
              la: _62,
              ma: [
                1,
                {
                  k12: [1, { chtr: _3, paroch: _3, pvt: _3 }],
                  cc: _3,
                  lib: _3,
                },
              ],
              md: _62,
              me: _62,
              mi: [
                1,
                {
                  k12: _3,
                  cc: _3,
                  lib: _3,
                  'ann-arbor': _3,
                  cog: _3,
                  dst: _3,
                  eaton: _3,
                  gen: _3,
                  mus: _3,
                  tec: _3,
                  washtenaw: _3,
                },
              ],
              mn: _62,
              mo: _62,
              ms: _62,
              mt: _62,
              nc: _62,
              nd: _63,
              ne: _62,
              nh: _62,
              nj: _62,
              nm: _62,
              nv: _62,
              ny: _62,
              oh: _62,
              ok: _62,
              or: _62,
              pa: _62,
              pr: _62,
              ri: _63,
              sc: _62,
              sd: _63,
              tn: _62,
              tx: _62,
              ut: _62,
              va: _62,
              vi: _62,
              vt: _62,
              wa: _62,
              wi: _62,
              wv: [1, { cc: _3 }],
              wy: _62,
              cloudns: _4,
              'is-by': _4,
              'land-4-sale': _4,
              'stuff-4-sale': _4,
              heliohost: _4,
              enscaled: [0, { phx: _4 }],
              mircloud: _4,
              ngo: _4,
              golffan: _4,
              noip: _4,
              pointto: _4,
              freeddns: _4,
              srv: [2, { gh: _4, gl: _4 }],
              platterp: _4,
              servername: _4,
            },
          ],
          uy: [1, { com: _3, edu: _3, gub: _3, mil: _3, net: _3, org: _3 }],
          uz: [1, { co: _3, com: _3, net: _3, org: _3 }],
          va: _3,
          vc: [
            1,
            {
              com: _3,
              edu: _3,
              gov: _3,
              mil: _3,
              net: _3,
              org: _3,
              gv: [2, { d: _4 }],
              '0e': _7,
              mydns: _4,
            },
          ],
          ve: [
            1,
            {
              arts: _3,
              bib: _3,
              co: _3,
              com: _3,
              e12: _3,
              edu: _3,
              emprende: _3,
              firm: _3,
              gob: _3,
              gov: _3,
              info: _3,
              int: _3,
              mil: _3,
              net: _3,
              nom: _3,
              org: _3,
              rar: _3,
              rec: _3,
              store: _3,
              tec: _3,
              web: _3,
            },
          ],
          vg: [1, { edu: _3 }],
          vi: [1, { co: _3, com: _3, k12: _3, net: _3, org: _3 }],
          vn: [
            1,
            {
              ac: _3,
              ai: _3,
              biz: _3,
              com: _3,
              edu: _3,
              gov: _3,
              health: _3,
              id: _3,
              info: _3,
              int: _3,
              io: _3,
              name: _3,
              net: _3,
              org: _3,
              pro: _3,
              angiang: _3,
              bacgiang: _3,
              backan: _3,
              baclieu: _3,
              bacninh: _3,
              'baria-vungtau': _3,
              bentre: _3,
              binhdinh: _3,
              binhduong: _3,
              binhphuoc: _3,
              binhthuan: _3,
              camau: _3,
              cantho: _3,
              caobang: _3,
              daklak: _3,
              daknong: _3,
              danang: _3,
              dienbien: _3,
              dongnai: _3,
              dongthap: _3,
              gialai: _3,
              hagiang: _3,
              haiduong: _3,
              haiphong: _3,
              hanam: _3,
              hanoi: _3,
              hatinh: _3,
              haugiang: _3,
              hoabinh: _3,
              hungyen: _3,
              khanhhoa: _3,
              kiengiang: _3,
              kontum: _3,
              laichau: _3,
              lamdong: _3,
              langson: _3,
              laocai: _3,
              longan: _3,
              namdinh: _3,
              nghean: _3,
              ninhbinh: _3,
              ninhthuan: _3,
              phutho: _3,
              phuyen: _3,
              quangbinh: _3,
              quangnam: _3,
              quangngai: _3,
              quangninh: _3,
              quangtri: _3,
              soctrang: _3,
              sonla: _3,
              tayninh: _3,
              thaibinh: _3,
              thainguyen: _3,
              thanhhoa: _3,
              thanhphohochiminh: _3,
              thuathienhue: _3,
              tiengiang: _3,
              travinh: _3,
              tuyenquang: _3,
              vinhlong: _3,
              vinhphuc: _3,
              yenbai: _3,
            },
          ],
          vu: _45,
          wf: [1, { biz: _4, sch: _4 }],
          ws: [
            1,
            {
              com: _3,
              edu: _3,
              gov: _3,
              net: _3,
              org: _3,
              advisor: _7,
              cloud66: _4,
              dyndns: _4,
              mypets: _4,
            },
          ],
          yt: [1, { org: _4 }],
          'xn--mgbaam7a8h': _3,
          '\u0627\u0645\u0627\u0631\u0627\u062A': _3,
          'xn--y9a3aq': _3,
          '\u0570\u0561\u0575': _3,
          'xn--54b7fta0cc': _3,
          '\u09AC\u09BE\u0982\u09B2\u09BE': _3,
          'xn--90ae': _3,
          '\u0431\u0433': _3,
          'xn--mgbcpq6gpa1a': _3,
          '\u0627\u0644\u0628\u062D\u0631\u064A\u0646': _3,
          'xn--90ais': _3,
          '\u0431\u0435\u043B': _3,
          'xn--fiqs8s': _3,
          '\u4E2D\u56FD': _3,
          'xn--fiqz9s': _3,
          '\u4E2D\u570B': _3,
          'xn--lgbbat1ad8j': _3,
          '\u0627\u0644\u062C\u0632\u0627\u0626\u0631': _3,
          'xn--wgbh1c': _3,
          '\u0645\u0635\u0631': _3,
          'xn--e1a4c': _3,
          '\u0435\u044E': _3,
          'xn--qxa6a': _3,
          '\u03B5\u03C5': _3,
          'xn--mgbah1a3hjkrd': _3,
          '\u0645\u0648\u0631\u064A\u062A\u0627\u0646\u064A\u0627': _3,
          'xn--node': _3,
          '\u10D2\u10D4': _3,
          'xn--qxam': _3,
          '\u03B5\u03BB': _3,
          'xn--j6w193g': [
            1,
            {
              'xn--gmqw5a': _3,
              'xn--55qx5d': _3,
              'xn--mxtq1m': _3,
              'xn--wcvs22d': _3,
              'xn--uc0atv': _3,
              'xn--od0alg': _3,
            },
          ],
          '\u9999\u6E2F': [
            1,
            {
              '\u500B\u4EBA': _3,
              '\u516C\u53F8': _3,
              '\u653F\u5E9C': _3,
              '\u6559\u80B2': _3,
              '\u7D44\u7E54': _3,
              '\u7DB2\u7D61': _3,
            },
          ],
          'xn--2scrj9c': _3,
          '\u0CAD\u0CBE\u0CB0\u0CA4': _3,
          'xn--3hcrj9c': _3,
          '\u0B2D\u0B3E\u0B30\u0B24': _3,
          'xn--45br5cyl': _3,
          '\u09AD\u09BE\u09F0\u09A4': _3,
          'xn--h2breg3eve': _3,
          '\u092D\u093E\u0930\u0924\u092E\u094D': _3,
          'xn--h2brj9c8c': _3,
          '\u092D\u093E\u0930\u094B\u0924': _3,
          'xn--mgbgu82a': _3,
          '\u0680\u0627\u0631\u062A': _3,
          'xn--rvc1e0am3e': _3,
          '\u0D2D\u0D3E\u0D30\u0D24\u0D02': _3,
          'xn--h2brj9c': _3,
          '\u092D\u093E\u0930\u0924': _3,
          'xn--mgbbh1a': _3,
          '\u0628\u0627\u0631\u062A': _3,
          'xn--mgbbh1a71e': _3,
          '\u0628\u06BE\u0627\u0631\u062A': _3,
          'xn--fpcrj9c3d': _3,
          '\u0C2D\u0C3E\u0C30\u0C24\u0C4D': _3,
          'xn--gecrj9c': _3,
          '\u0AAD\u0ABE\u0AB0\u0AA4': _3,
          'xn--s9brj9c': _3,
          '\u0A2D\u0A3E\u0A30\u0A24': _3,
          'xn--45brj9c': _3,
          '\u09AD\u09BE\u09B0\u09A4': _3,
          'xn--xkc2dl3a5ee0h': _3,
          '\u0B87\u0BA8\u0BCD\u0BA4\u0BBF\u0BAF\u0BBE': _3,
          'xn--mgba3a4f16a': _3,
          '\u0627\u06CC\u0631\u0627\u0646': _3,
          'xn--mgba3a4fra': _3,
          '\u0627\u064A\u0631\u0627\u0646': _3,
          'xn--mgbtx2b': _3,
          '\u0639\u0631\u0627\u0642': _3,
          'xn--mgbayh7gpa': _3,
          '\u0627\u0644\u0627\u0631\u062F\u0646': _3,
          'xn--3e0b707e': _3,
          '\uD55C\uAD6D': _3,
          'xn--80ao21a': _3,
          '\u049B\u0430\u0437': _3,
          'xn--q7ce6a': _3,
          '\u0EA5\u0EB2\u0EA7': _3,
          'xn--fzc2c9e2c': _3,
          '\u0DBD\u0D82\u0D9A\u0DCF': _3,
          'xn--xkc2al3hye2a': _3,
          '\u0B87\u0BB2\u0B99\u0BCD\u0B95\u0BC8': _3,
          'xn--mgbc0a9azcg': _3,
          '\u0627\u0644\u0645\u063A\u0631\u0628': _3,
          'xn--d1alf': _3,
          '\u043C\u043A\u0434': _3,
          'xn--l1acc': _3,
          '\u043C\u043E\u043D': _3,
          'xn--mix891f': _3,
          '\u6FB3\u9580': _3,
          'xn--mix082f': _3,
          '\u6FB3\u95E8': _3,
          'xn--mgbx4cd0ab': _3,
          '\u0645\u0644\u064A\u0633\u064A\u0627': _3,
          'xn--mgb9awbf': _3,
          '\u0639\u0645\u0627\u0646': _3,
          'xn--mgbai9azgqp6j': _3,
          '\u067E\u0627\u06A9\u0633\u062A\u0627\u0646': _3,
          'xn--mgbai9a5eva00b': _3,
          '\u067E\u0627\u0643\u0633\u062A\u0627\u0646': _3,
          'xn--ygbi2ammx': _3,
          '\u0641\u0644\u0633\u0637\u064A\u0646': _3,
          'xn--90a3ac': [
            1,
            {
              'xn--80au': _3,
              'xn--90azh': _3,
              'xn--d1at': _3,
              'xn--c1avg': _3,
              'xn--o1ac': _3,
              'xn--o1ach': _3,
            },
          ],
          '\u0441\u0440\u0431': [
            1,
            {
              '\u0430\u043A': _3,
              '\u043E\u0431\u0440': _3,
              '\u043E\u0434': _3,
              '\u043E\u0440\u0433': _3,
              '\u043F\u0440': _3,
              '\u0443\u043F\u0440': _3,
            },
          ],
          'xn--p1ai': _3,
          '\u0440\u0444': _3,
          'xn--wgbl6a': _3,
          '\u0642\u0637\u0631': _3,
          'xn--mgberp4a5d4ar': _3,
          '\u0627\u0644\u0633\u0639\u0648\u062F\u064A\u0629': _3,
          'xn--mgberp4a5d4a87g': _3,
          '\u0627\u0644\u0633\u0639\u0648\u062F\u06CC\u0629': _3,
          'xn--mgbqly7c0a67fbc': _3,
          '\u0627\u0644\u0633\u0639\u0648\u062F\u06CC\u06C3': _3,
          'xn--mgbqly7cvafr': _3,
          '\u0627\u0644\u0633\u0639\u0648\u062F\u064A\u0647': _3,
          'xn--mgbpl2fh': _3,
          '\u0633\u0648\u062F\u0627\u0646': _3,
          'xn--yfro4i67o': _3,
          '\u65B0\u52A0\u5761': _3,
          'xn--clchc0ea0b2g2a9gcd': _3,
          '\u0B9A\u0BBF\u0B99\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0BC2\u0BB0\u0BCD':
            _3,
          'xn--ogbpf8fl': _3,
          '\u0633\u0648\u0631\u064A\u0629': _3,
          'xn--mgbtf8fl': _3,
          '\u0633\u0648\u0631\u064A\u0627': _3,
          'xn--o3cw4h': [
            1,
            {
              'xn--o3cyx2a': _3,
              'xn--12co0c3b4eva': _3,
              'xn--m3ch0j3a': _3,
              'xn--h3cuzk1di': _3,
              'xn--12c1fe0br': _3,
              'xn--12cfi8ixb8l': _3,
            },
          ],
          '\u0E44\u0E17\u0E22': [
            1,
            {
              '\u0E17\u0E2B\u0E32\u0E23': _3,
              '\u0E18\u0E38\u0E23\u0E01\u0E34\u0E08': _3,
              '\u0E40\u0E19\u0E47\u0E15': _3,
              '\u0E23\u0E31\u0E10\u0E1A\u0E32\u0E25': _3,
              '\u0E28\u0E36\u0E01\u0E29\u0E32': _3,
              '\u0E2D\u0E07\u0E04\u0E4C\u0E01\u0E23': _3,
            },
          ],
          'xn--pgbs0dh': _3,
          '\u062A\u0648\u0646\u0633': _3,
          'xn--kpry57d': _3,
          '\u53F0\u7063': _3,
          'xn--kprw13d': _3,
          '\u53F0\u6E7E': _3,
          'xn--nnx388a': _3,
          '\u81FA\u7063': _3,
          'xn--j1amh': _3,
          '\u0443\u043A\u0440': _3,
          'xn--mgb2ddes': _3,
          '\u0627\u0644\u064A\u0645\u0646': _3,
          xxx: _3,
          ye: _6,
          za: [
            0,
            {
              ac: _3,
              agric: _3,
              alt: _3,
              co: _3,
              edu: _3,
              gov: _3,
              grondar: _3,
              law: _3,
              mil: _3,
              net: _3,
              ngo: _3,
              nic: _3,
              nis: _3,
              nom: _3,
              org: _3,
              school: _3,
              tm: _3,
              web: _3,
            },
          ],
          zm: [
            1,
            {
              ac: _3,
              biz: _3,
              co: _3,
              com: _3,
              edu: _3,
              gov: _3,
              info: _3,
              mil: _3,
              net: _3,
              org: _3,
              sch: _3,
            },
          ],
          zw: [1, { ac: _3, co: _3, gov: _3, mil: _3, org: _3 }],
          aaa: _3,
          aarp: _3,
          abb: _3,
          abbott: _3,
          abbvie: _3,
          abc: _3,
          able: _3,
          abogado: _3,
          abudhabi: _3,
          academy: [1, { official: _4 }],
          accenture: _3,
          accountant: _3,
          accountants: _3,
          aco: _3,
          actor: _3,
          ads: _3,
          adult: _3,
          aeg: _3,
          aetna: _3,
          afl: _3,
          africa: _3,
          agakhan: _3,
          agency: _3,
          aig: _3,
          airbus: _3,
          airforce: _3,
          airtel: _3,
          akdn: _3,
          alibaba: _3,
          alipay: _3,
          allfinanz: _3,
          allstate: _3,
          ally: _3,
          alsace: _3,
          alstom: _3,
          amazon: _3,
          americanexpress: _3,
          americanfamily: _3,
          amex: _3,
          amfam: _3,
          amica: _3,
          amsterdam: _3,
          analytics: _3,
          android: _3,
          anquan: _3,
          anz: _3,
          aol: _3,
          apartments: _3,
          app: [
            1,
            {
              adaptable: _4,
              aiven: _4,
              beget: _7,
              brave: _8,
              clerk: _4,
              clerkstage: _4,
              wnext: _4,
              csb: [2, { preview: _4 }],
              convex: _4,
              deta: _4,
              ondigitalocean: _4,
              easypanel: _4,
              encr: _4,
              evervault: _9,
              expo: [2, { staging: _4 }],
              edgecompute: _4,
              'on-fleek': _4,
              flutterflow: _4,
              e2b: _4,
              framer: _4,
              hosted: _7,
              run: _7,
              web: _4,
              hasura: _4,
              botdash: _4,
              loginline: _4,
              lovable: _4,
              medusajs: _4,
              messerli: _4,
              netfy: _4,
              netlify: _4,
              ngrok: _4,
              'ngrok-free': _4,
              developer: _7,
              noop: _4,
              northflank: _7,
              upsun: _7,
              replit: _10,
              nyat: _4,
              snowflake: [0, { '*': _4, privatelink: _7 }],
              streamlit: _4,
              storipress: _4,
              telebit: _4,
              typedream: _4,
              vercel: _4,
              bookonline: _4,
              wdh: _4,
              windsurf: _4,
              zeabur: _4,
              zerops: _7,
            },
          ],
          apple: _3,
          aquarelle: _3,
          arab: _3,
          aramco: _3,
          archi: _3,
          army: _3,
          art: _3,
          arte: _3,
          asda: _3,
          associates: _3,
          athleta: _3,
          attorney: _3,
          auction: _3,
          audi: _3,
          audible: _3,
          audio: _3,
          auspost: _3,
          author: _3,
          auto: _3,
          autos: _3,
          aws: [
            1,
            {
              sagemaker: [
                0,
                {
                  'ap-northeast-1': _14,
                  'ap-northeast-2': _14,
                  'ap-south-1': _14,
                  'ap-southeast-1': _14,
                  'ap-southeast-2': _14,
                  'ca-central-1': _16,
                  'eu-central-1': _14,
                  'eu-west-1': _14,
                  'eu-west-2': _14,
                  'us-east-1': _16,
                  'us-east-2': _16,
                  'us-west-2': _16,
                  'af-south-1': _13,
                  'ap-east-1': _13,
                  'ap-northeast-3': _13,
                  'ap-south-2': _15,
                  'ap-southeast-3': _13,
                  'ap-southeast-4': _15,
                  'ca-west-1': [0, { notebook: _4, 'notebook-fips': _4 }],
                  'eu-central-2': _13,
                  'eu-north-1': _13,
                  'eu-south-1': _13,
                  'eu-south-2': _13,
                  'eu-west-3': _13,
                  'il-central-1': _13,
                  'me-central-1': _13,
                  'me-south-1': _13,
                  'sa-east-1': _13,
                  'us-gov-east-1': _17,
                  'us-gov-west-1': _17,
                  'us-west-1': [
                    0,
                    { notebook: _4, 'notebook-fips': _4, studio: _4 },
                  ],
                  experiments: _7,
                },
              ],
              repost: [0, { private: _7 }],
              on: [
                0,
                {
                  'ap-northeast-1': _12,
                  'ap-southeast-1': _12,
                  'ap-southeast-2': _12,
                  'eu-central-1': _12,
                  'eu-north-1': _12,
                  'eu-west-1': _12,
                  'us-east-1': _12,
                  'us-east-2': _12,
                  'us-west-2': _12,
                },
              ],
            },
          ],
          axa: _3,
          azure: _3,
          baby: _3,
          baidu: _3,
          banamex: _3,
          band: _3,
          bank: _3,
          bar: _3,
          barcelona: _3,
          barclaycard: _3,
          barclays: _3,
          barefoot: _3,
          bargains: _3,
          baseball: _3,
          basketball: [1, { aus: _4, nz: _4 }],
          bauhaus: _3,
          bayern: _3,
          bbc: _3,
          bbt: _3,
          bbva: _3,
          bcg: _3,
          bcn: _3,
          beats: _3,
          beauty: _3,
          beer: _3,
          bentley: _3,
          berlin: _3,
          best: _3,
          bestbuy: _3,
          bet: _3,
          bharti: _3,
          bible: _3,
          bid: _3,
          bike: _3,
          bing: _3,
          bingo: _3,
          bio: _3,
          black: _3,
          blackfriday: _3,
          blockbuster: _3,
          blog: _3,
          bloomberg: _3,
          blue: _3,
          bms: _3,
          bmw: _3,
          bnpparibas: _3,
          boats: _3,
          boehringer: _3,
          bofa: _3,
          bom: _3,
          bond: _3,
          boo: _3,
          book: _3,
          booking: _3,
          bosch: _3,
          bostik: _3,
          boston: _3,
          bot: _3,
          boutique: _3,
          box: _3,
          bradesco: _3,
          bridgestone: _3,
          broadway: _3,
          broker: _3,
          brother: _3,
          brussels: _3,
          build: [1, { v0: _4, windsurf: _4 }],
          builders: [1, { cloudsite: _4 }],
          business: _19,
          buy: _3,
          buzz: _3,
          bzh: _3,
          cab: _3,
          cafe: _3,
          cal: _3,
          call: _3,
          calvinklein: _3,
          cam: _3,
          camera: _3,
          camp: [1, { emf: [0, { at: _4 }] }],
          canon: _3,
          capetown: _3,
          capital: _3,
          capitalone: _3,
          car: _3,
          caravan: _3,
          cards: _3,
          care: _3,
          career: _3,
          careers: _3,
          cars: _3,
          casa: [1, { nabu: [0, { ui: _4 }] }],
          case: _3,
          cash: _3,
          casino: _3,
          catering: _3,
          catholic: _3,
          cba: _3,
          cbn: _3,
          cbre: _3,
          center: _3,
          ceo: _3,
          cern: _3,
          cfa: _3,
          cfd: _3,
          chanel: _3,
          channel: _3,
          charity: _3,
          chase: _3,
          chat: _3,
          cheap: _3,
          chintai: _3,
          christmas: _3,
          chrome: _3,
          church: _3,
          cipriani: _3,
          circle: _3,
          cisco: _3,
          citadel: _3,
          citi: _3,
          citic: _3,
          city: _3,
          claims: _3,
          cleaning: _3,
          click: _3,
          clinic: _3,
          clinique: _3,
          clothing: _3,
          cloud: [
            1,
            {
              convex: _4,
              elementor: _4,
              encoway: [0, { eu: _4 }],
              statics: _7,
              ravendb: _4,
              axarnet: [0, { 'es-1': _4 }],
              diadem: _4,
              jelastic: [0, { vip: _4 }],
              jele: _4,
              'jenv-aruba': [
                0,
                { aruba: [0, { eur: [0, { it1: _4 }] }], it1: _4 },
              ],
              keliweb: [2, { cs: _4 }],
              oxa: [2, { tn: _4, uk: _4 }],
              primetel: [2, { uk: _4 }],
              reclaim: [0, { ca: _4, uk: _4, us: _4 }],
              trendhosting: [0, { ch: _4, de: _4 }],
              jotelulu: _4,
              kuleuven: _4,
              laravel: _4,
              linkyard: _4,
              magentosite: _7,
              matlab: _4,
              observablehq: _4,
              perspecta: _4,
              vapor: _4,
              'on-rancher': _7,
              scw: [
                0,
                {
                  baremetal: [
                    0,
                    { 'fr-par-1': _4, 'fr-par-2': _4, 'nl-ams-1': _4 },
                  ],
                  'fr-par': [
                    0,
                    {
                      cockpit: _4,
                      fnc: [2, { functions: _4 }],
                      k8s: _21,
                      s3: _4,
                      's3-website': _4,
                      whm: _4,
                    },
                  ],
                  instances: [0, { priv: _4, pub: _4 }],
                  k8s: _4,
                  'nl-ams': [
                    0,
                    {
                      cockpit: _4,
                      k8s: _21,
                      s3: _4,
                      's3-website': _4,
                      whm: _4,
                    },
                  ],
                  'pl-waw': [
                    0,
                    { cockpit: _4, k8s: _21, s3: _4, 's3-website': _4 },
                  ],
                  scalebook: _4,
                  smartlabeling: _4,
                },
              ],
              servebolt: _4,
              onstackit: [0, { runs: _4 }],
              trafficplex: _4,
              'unison-services': _4,
              urown: _4,
              voorloper: _4,
              zap: _4,
            },
          ],
          club: [1, { cloudns: _4, jele: _4, barsy: _4 }],
          clubmed: _3,
          coach: _3,
          codes: [1, { owo: _7 }],
          coffee: _3,
          college: _3,
          cologne: _3,
          commbank: _3,
          community: [1, { nog: _4, ravendb: _4, myforum: _4 }],
          company: _3,
          compare: _3,
          computer: _3,
          comsec: _3,
          condos: _3,
          construction: _3,
          consulting: _3,
          contact: _3,
          contractors: _3,
          cooking: _3,
          cool: [1, { elementor: _4, de: _4 }],
          corsica: _3,
          country: _3,
          coupon: _3,
          coupons: _3,
          courses: _3,
          cpa: _3,
          credit: _3,
          creditcard: _3,
          creditunion: _3,
          cricket: _3,
          crown: _3,
          crs: _3,
          cruise: _3,
          cruises: _3,
          cuisinella: _3,
          cymru: _3,
          cyou: _3,
          dad: _3,
          dance: _3,
          data: _3,
          date: _3,
          dating: _3,
          datsun: _3,
          day: _3,
          dclk: _3,
          dds: _3,
          deal: _3,
          dealer: _3,
          deals: _3,
          degree: _3,
          delivery: _3,
          dell: _3,
          deloitte: _3,
          delta: _3,
          democrat: _3,
          dental: _3,
          dentist: _3,
          desi: _3,
          design: [1, { graphic: _4, bss: _4 }],
          dev: [
            1,
            {
              '12chars': _4,
              myaddr: _4,
              panel: _4,
              lcl: _7,
              lclstage: _7,
              stg: _7,
              stgstage: _7,
              pages: _4,
              r2: _4,
              workers: _4,
              deno: _4,
              'deno-staging': _4,
              deta: _4,
              evervault: _9,
              fly: _4,
              githubpreview: _4,
              gateway: _7,
              hrsn: [
                2,
                { psl: [0, { sub: _4, wc: [0, { '*': _4, sub: _7 }] }] },
              ],
              botdash: _4,
              inbrowser: _7,
              'is-a-good': _4,
              'is-a': _4,
              iserv: _4,
              runcontainers: _4,
              localcert: [0, { user: _7 }],
              loginline: _4,
              barsy: _4,
              mediatech: _4,
              modx: _4,
              ngrok: _4,
              'ngrok-free': _4,
              'is-a-fullstack': _4,
              'is-cool': _4,
              'is-not-a': _4,
              localplayer: _4,
              xmit: _4,
              'platter-app': _4,
              replit: [
                2,
                {
                  archer: _4,
                  bones: _4,
                  canary: _4,
                  global: _4,
                  hacker: _4,
                  id: _4,
                  janeway: _4,
                  kim: _4,
                  kira: _4,
                  kirk: _4,
                  odo: _4,
                  paris: _4,
                  picard: _4,
                  pike: _4,
                  prerelease: _4,
                  reed: _4,
                  riker: _4,
                  sisko: _4,
                  spock: _4,
                  staging: _4,
                  sulu: _4,
                  tarpit: _4,
                  teams: _4,
                  tucker: _4,
                  wesley: _4,
                  worf: _4,
                },
              ],
              crm: [
                0,
                {
                  d: _7,
                  w: _7,
                  wa: _7,
                  wb: _7,
                  wc: _7,
                  wd: _7,
                  we: _7,
                  wf: _7,
                },
              ],
              vercel: _4,
              webhare: _7,
            },
          ],
          dhl: _3,
          diamonds: _3,
          diet: _3,
          digital: [1, { cloudapps: [2, { london: _4 }] }],
          direct: [1, { libp2p: _4 }],
          directory: _3,
          discount: _3,
          discover: _3,
          dish: _3,
          diy: _3,
          dnp: _3,
          docs: _3,
          doctor: _3,
          dog: _3,
          domains: _3,
          dot: _3,
          download: _3,
          drive: _3,
          dtv: _3,
          dubai: _3,
          dunlop: _3,
          dupont: _3,
          durban: _3,
          dvag: _3,
          dvr: _3,
          earth: _3,
          eat: _3,
          eco: _3,
          edeka: _3,
          education: _19,
          email: [1, { crisp: [0, { on: _4 }], tawk: _49, tawkto: _49 }],
          emerck: _3,
          energy: _3,
          engineer: _3,
          engineering: _3,
          enterprises: _3,
          epson: _3,
          equipment: _3,
          ericsson: _3,
          erni: _3,
          esq: _3,
          estate: [1, { compute: _7 }],
          eurovision: _3,
          eus: [1, { party: _50 }],
          events: [1, { koobin: _4, co: _4 }],
          exchange: _3,
          expert: _3,
          exposed: _3,
          express: _3,
          extraspace: _3,
          fage: _3,
          fail: _3,
          fairwinds: _3,
          faith: _3,
          family: _3,
          fan: _3,
          fans: _3,
          farm: [1, { storj: _4 }],
          farmers: _3,
          fashion: _3,
          fast: _3,
          fedex: _3,
          feedback: _3,
          ferrari: _3,
          ferrero: _3,
          fidelity: _3,
          fido: _3,
          film: _3,
          final: _3,
          finance: _3,
          financial: _19,
          fire: _3,
          firestone: _3,
          firmdale: _3,
          fish: _3,
          fishing: _3,
          fit: _3,
          fitness: _3,
          flickr: _3,
          flights: _3,
          flir: _3,
          florist: _3,
          flowers: _3,
          fly: _3,
          foo: _3,
          food: _3,
          football: _3,
          ford: _3,
          forex: _3,
          forsale: _3,
          forum: _3,
          foundation: _3,
          fox: _3,
          free: _3,
          fresenius: _3,
          frl: _3,
          frogans: _3,
          frontier: _3,
          ftr: _3,
          fujitsu: _3,
          fun: _3,
          fund: _3,
          furniture: _3,
          futbol: _3,
          fyi: _3,
          gal: _3,
          gallery: _3,
          gallo: _3,
          gallup: _3,
          game: _3,
          games: [1, { pley: _4, sheezy: _4 }],
          gap: _3,
          garden: _3,
          gay: [1, { pages: _4 }],
          gbiz: _3,
          gdn: [1, { cnpy: _4 }],
          gea: _3,
          gent: _3,
          genting: _3,
          george: _3,
          ggee: _3,
          gift: _3,
          gifts: _3,
          gives: _3,
          giving: _3,
          glass: _3,
          gle: _3,
          global: [1, { appwrite: _4 }],
          globo: _3,
          gmail: _3,
          gmbh: _3,
          gmo: _3,
          gmx: _3,
          godaddy: _3,
          gold: _3,
          goldpoint: _3,
          golf: _3,
          goo: _3,
          goodyear: _3,
          goog: [1, { cloud: _4, translate: _4, usercontent: _7 }],
          google: _3,
          gop: _3,
          got: _3,
          grainger: _3,
          graphics: _3,
          gratis: _3,
          green: _3,
          gripe: _3,
          grocery: _3,
          group: [1, { discourse: _4 }],
          gucci: _3,
          guge: _3,
          guide: _3,
          guitars: _3,
          guru: _3,
          hair: _3,
          hamburg: _3,
          hangout: _3,
          haus: _3,
          hbo: _3,
          hdfc: _3,
          hdfcbank: _3,
          health: [1, { hra: _4 }],
          healthcare: _3,
          help: _3,
          helsinki: _3,
          here: _3,
          hermes: _3,
          hiphop: _3,
          hisamitsu: _3,
          hitachi: _3,
          hiv: _3,
          hkt: _3,
          hockey: _3,
          holdings: _3,
          holiday: _3,
          homedepot: _3,
          homegoods: _3,
          homes: _3,
          homesense: _3,
          honda: _3,
          horse: _3,
          hospital: _3,
          host: [
            1,
            {
              cloudaccess: _4,
              freesite: _4,
              easypanel: _4,
              fastvps: _4,
              myfast: _4,
              tempurl: _4,
              wpmudev: _4,
              jele: _4,
              mircloud: _4,
              wp2: _4,
              half: _4,
            },
          ],
          hosting: [1, { opencraft: _4 }],
          hot: _3,
          hotels: _3,
          hotmail: _3,
          house: _3,
          how: _3,
          hsbc: _3,
          hughes: _3,
          hyatt: _3,
          hyundai: _3,
          ibm: _3,
          icbc: _3,
          ice: _3,
          icu: _3,
          ieee: _3,
          ifm: _3,
          ikano: _3,
          imamat: _3,
          imdb: _3,
          immo: _3,
          immobilien: _3,
          inc: _3,
          industries: _3,
          infiniti: _3,
          ing: _3,
          ink: _3,
          institute: _3,
          insurance: _3,
          insure: _3,
          international: _3,
          intuit: _3,
          investments: _3,
          ipiranga: _3,
          irish: _3,
          ismaili: _3,
          ist: _3,
          istanbul: _3,
          itau: _3,
          itv: _3,
          jaguar: _3,
          java: _3,
          jcb: _3,
          jeep: _3,
          jetzt: _3,
          jewelry: _3,
          jio: _3,
          jll: _3,
          jmp: _3,
          jnj: _3,
          joburg: _3,
          jot: _3,
          joy: _3,
          jpmorgan: _3,
          jprs: _3,
          juegos: _3,
          juniper: _3,
          kaufen: _3,
          kddi: _3,
          kerryhotels: _3,
          kerryproperties: _3,
          kfh: _3,
          kia: _3,
          kids: _3,
          kim: _3,
          kindle: _3,
          kitchen: _3,
          kiwi: _3,
          koeln: _3,
          komatsu: _3,
          kosher: _3,
          kpmg: _3,
          kpn: _3,
          krd: [1, { co: _4, edu: _4 }],
          kred: _3,
          kuokgroup: _3,
          kyoto: _3,
          lacaixa: _3,
          lamborghini: _3,
          lamer: _3,
          lancaster: _3,
          land: _3,
          landrover: _3,
          lanxess: _3,
          lasalle: _3,
          lat: _3,
          latino: _3,
          latrobe: _3,
          law: _3,
          lawyer: _3,
          lds: _3,
          lease: _3,
          leclerc: _3,
          lefrak: _3,
          legal: _3,
          lego: _3,
          lexus: _3,
          lgbt: _3,
          lidl: _3,
          life: _3,
          lifeinsurance: _3,
          lifestyle: _3,
          lighting: _3,
          like: _3,
          lilly: _3,
          limited: _3,
          limo: _3,
          lincoln: _3,
          link: [
            1,
            {
              myfritz: _4,
              cyon: _4,
              dweb: _7,
              inbrowser: _7,
              nftstorage: _57,
              mypep: _4,
              storacha: _57,
              w3s: _57,
            },
          ],
          live: [1, { aem: _4, hlx: _4, ewp: _7 }],
          living: _3,
          llc: _3,
          llp: _3,
          loan: _3,
          loans: _3,
          locker: _3,
          locus: _3,
          lol: [1, { omg: _4 }],
          london: _3,
          lotte: _3,
          lotto: _3,
          love: _3,
          lpl: _3,
          lplfinancial: _3,
          ltd: _3,
          ltda: _3,
          lundbeck: _3,
          luxe: _3,
          luxury: _3,
          madrid: _3,
          maif: _3,
          maison: _3,
          makeup: _3,
          man: _3,
          management: _3,
          mango: _3,
          map: _3,
          market: _3,
          marketing: _3,
          markets: _3,
          marriott: _3,
          marshalls: _3,
          mattel: _3,
          mba: _3,
          mckinsey: _3,
          med: _3,
          media: _58,
          meet: _3,
          melbourne: _3,
          meme: _3,
          memorial: _3,
          men: _3,
          menu: [1, { barsy: _4, barsyonline: _4 }],
          merck: _3,
          merckmsd: _3,
          miami: _3,
          microsoft: _3,
          mini: _3,
          mint: _3,
          mit: _3,
          mitsubishi: _3,
          mlb: _3,
          mls: _3,
          mma: _3,
          mobile: _3,
          moda: _3,
          moe: _3,
          moi: _3,
          mom: [1, { ind: _4 }],
          monash: _3,
          money: _3,
          monster: _3,
          mormon: _3,
          mortgage: _3,
          moscow: _3,
          moto: _3,
          motorcycles: _3,
          mov: _3,
          movie: _3,
          msd: _3,
          mtn: _3,
          mtr: _3,
          music: _3,
          nab: _3,
          nagoya: _3,
          navy: _3,
          nba: _3,
          nec: _3,
          netbank: _3,
          netflix: _3,
          network: [1, { alces: _7, co: _4, arvo: _4, azimuth: _4, tlon: _4 }],
          neustar: _3,
          new: _3,
          news: [1, { noticeable: _4 }],
          next: _3,
          nextdirect: _3,
          nexus: _3,
          nfl: _3,
          ngo: _3,
          nhk: _3,
          nico: _3,
          nike: _3,
          nikon: _3,
          ninja: _3,
          nissan: _3,
          nissay: _3,
          nokia: _3,
          norton: _3,
          now: _3,
          nowruz: _3,
          nowtv: _3,
          nra: _3,
          nrw: _3,
          ntt: _3,
          nyc: _3,
          obi: _3,
          observer: _3,
          office: _3,
          okinawa: _3,
          olayan: _3,
          olayangroup: _3,
          ollo: _3,
          omega: _3,
          one: [1, { kin: _7, service: _4 }],
          ong: [1, { obl: _4 }],
          onl: _3,
          online: [
            1,
            { eero: _4, 'eero-stage': _4, websitebuilder: _4, barsy: _4 },
          ],
          ooo: _3,
          open: _3,
          oracle: _3,
          orange: [1, { tech: _4 }],
          organic: _3,
          origins: _3,
          osaka: _3,
          otsuka: _3,
          ott: _3,
          ovh: [1, { nerdpol: _4 }],
          page: [
            1,
            {
              aem: _4,
              hlx: _4,
              hlx3: _4,
              translated: _4,
              codeberg: _4,
              heyflow: _4,
              prvcy: _4,
              rocky: _4,
              pdns: _4,
              plesk: _4,
            },
          ],
          panasonic: _3,
          paris: _3,
          pars: _3,
          partners: _3,
          parts: _3,
          party: _3,
          pay: _3,
          pccw: _3,
          pet: _3,
          pfizer: _3,
          pharmacy: _3,
          phd: _3,
          philips: _3,
          phone: _3,
          photo: _3,
          photography: _3,
          photos: _58,
          physio: _3,
          pics: _3,
          pictet: _3,
          pictures: [1, { 1337: _4 }],
          pid: _3,
          pin: _3,
          ping: _3,
          pink: _3,
          pioneer: _3,
          pizza: [1, { ngrok: _4 }],
          place: _19,
          play: _3,
          playstation: _3,
          plumbing: _3,
          plus: _3,
          pnc: _3,
          pohl: _3,
          poker: _3,
          politie: _3,
          porn: _3,
          pramerica: _3,
          praxi: _3,
          press: _3,
          prime: _3,
          prod: _3,
          productions: _3,
          prof: _3,
          progressive: _3,
          promo: _3,
          properties: _3,
          property: _3,
          protection: _3,
          pru: _3,
          prudential: _3,
          pub: [1, { id: _7, kin: _7, barsy: _4 }],
          pwc: _3,
          qpon: _3,
          quebec: _3,
          quest: _3,
          racing: _3,
          radio: _3,
          read: _3,
          realestate: _3,
          realtor: _3,
          realty: _3,
          recipes: _3,
          red: _3,
          redstone: _3,
          redumbrella: _3,
          rehab: _3,
          reise: _3,
          reisen: _3,
          reit: _3,
          reliance: _3,
          ren: _3,
          rent: _3,
          rentals: _3,
          repair: _3,
          report: _3,
          republican: _3,
          rest: _3,
          restaurant: _3,
          review: _3,
          reviews: _3,
          rexroth: _3,
          rich: _3,
          richardli: _3,
          ricoh: _3,
          ril: _3,
          rio: _3,
          rip: [1, { clan: _4 }],
          rocks: [
            1,
            { myddns: _4, stackit: _4, 'lima-city': _4, webspace: _4 },
          ],
          rodeo: _3,
          rogers: _3,
          room: _3,
          rsvp: _3,
          rugby: _3,
          ruhr: _3,
          run: [
            1,
            {
              appwrite: _7,
              development: _4,
              ravendb: _4,
              liara: [2, { iran: _4 }],
              servers: _4,
              build: _7,
              code: _7,
              database: _7,
              migration: _7,
              onporter: _4,
              repl: _4,
              stackit: _4,
              val: [0, { express: _4, web: _4 }],
              wix: _4,
            },
          ],
          rwe: _3,
          ryukyu: _3,
          saarland: _3,
          safe: _3,
          safety: _3,
          sakura: _3,
          sale: _3,
          salon: _3,
          samsclub: _3,
          samsung: _3,
          sandvik: _3,
          sandvikcoromant: _3,
          sanofi: _3,
          sap: _3,
          sarl: _3,
          sas: _3,
          save: _3,
          saxo: _3,
          sbi: _3,
          sbs: _3,
          scb: _3,
          schaeffler: _3,
          schmidt: _3,
          scholarships: _3,
          school: _3,
          schule: _3,
          schwarz: _3,
          science: _3,
          scot: [1, { gov: [2, { service: _4 }] }],
          search: _3,
          seat: _3,
          secure: _3,
          security: _3,
          seek: _3,
          select: _3,
          sener: _3,
          services: [1, { loginline: _4 }],
          seven: _3,
          sew: _3,
          sex: _3,
          sexy: _3,
          sfr: _3,
          shangrila: _3,
          sharp: _3,
          shell: _3,
          shia: _3,
          shiksha: _3,
          shoes: _3,
          shop: [
            1,
            { base: _4, hoplix: _4, barsy: _4, barsyonline: _4, shopware: _4 },
          ],
          shopping: _3,
          shouji: _3,
          show: _3,
          silk: _3,
          sina: _3,
          singles: _3,
          site: [
            1,
            {
              square: _4,
              canva: _22,
              cloudera: _7,
              convex: _4,
              cyon: _4,
              fastvps: _4,
              figma: _4,
              heyflow: _4,
              jele: _4,
              jouwweb: _4,
              loginline: _4,
              barsy: _4,
              notion: _4,
              omniwe: _4,
              opensocial: _4,
              madethis: _4,
              platformsh: _7,
              tst: _7,
              byen: _4,
              srht: _4,
              novecore: _4,
              cpanel: _4,
              wpsquared: _4,
            },
          ],
          ski: _3,
          skin: _3,
          sky: _3,
          skype: _3,
          sling: _3,
          smart: _3,
          smile: _3,
          sncf: _3,
          soccer: _3,
          social: _3,
          softbank: _3,
          software: _3,
          sohu: _3,
          solar: _3,
          solutions: _3,
          song: _3,
          sony: _3,
          soy: _3,
          spa: _3,
          space: [
            1,
            {
              myfast: _4,
              heiyu: _4,
              hf: [2, { static: _4 }],
              'app-ionos': _4,
              project: _4,
              uber: _4,
              xs4all: _4,
            },
          ],
          sport: _3,
          spot: _3,
          srl: _3,
          stada: _3,
          staples: _3,
          star: _3,
          statebank: _3,
          statefarm: _3,
          stc: _3,
          stcgroup: _3,
          stockholm: _3,
          storage: _3,
          store: [1, { barsy: _4, sellfy: _4, shopware: _4, storebase: _4 }],
          stream: _3,
          studio: _3,
          study: _3,
          style: _3,
          sucks: _3,
          supplies: _3,
          supply: _3,
          support: [1, { barsy: _4 }],
          surf: _3,
          surgery: _3,
          suzuki: _3,
          swatch: _3,
          swiss: _3,
          sydney: _3,
          systems: [1, { knightpoint: _4 }],
          tab: _3,
          taipei: _3,
          talk: _3,
          taobao: _3,
          target: _3,
          tatamotors: _3,
          tatar: _3,
          tattoo: _3,
          tax: _3,
          taxi: _3,
          tci: _3,
          tdk: _3,
          team: [1, { discourse: _4, jelastic: _4 }],
          tech: [1, { cleverapps: _4 }],
          technology: _19,
          temasek: _3,
          tennis: _3,
          teva: _3,
          thd: _3,
          theater: _3,
          theatre: _3,
          tiaa: _3,
          tickets: _3,
          tienda: _3,
          tips: _3,
          tires: _3,
          tirol: _3,
          tjmaxx: _3,
          tjx: _3,
          tkmaxx: _3,
          tmall: _3,
          today: [1, { prequalifyme: _4 }],
          tokyo: _3,
          tools: [1, { addr: _47, myaddr: _4 }],
          top: [1, { ntdll: _4, wadl: _7 }],
          toray: _3,
          toshiba: _3,
          total: _3,
          tours: _3,
          town: _3,
          toyota: _3,
          toys: _3,
          trade: _3,
          trading: _3,
          training: _3,
          travel: _3,
          travelers: _3,
          travelersinsurance: _3,
          trust: _3,
          trv: _3,
          tube: _3,
          tui: _3,
          tunes: _3,
          tushu: _3,
          tvs: _3,
          ubank: _3,
          ubs: _3,
          unicom: _3,
          university: _3,
          uno: _3,
          uol: _3,
          ups: _3,
          vacations: _3,
          vana: _3,
          vanguard: _3,
          vegas: _3,
          ventures: _3,
          verisign: _3,
          versicherung: _3,
          vet: _3,
          viajes: _3,
          video: _3,
          vig: _3,
          viking: _3,
          villas: _3,
          vin: _3,
          vip: _3,
          virgin: _3,
          visa: _3,
          vision: _3,
          viva: _3,
          vivo: _3,
          vlaanderen: _3,
          vodka: _3,
          volvo: _3,
          vote: _3,
          voting: _3,
          voto: _3,
          voyage: _3,
          wales: _3,
          walmart: _3,
          walter: _3,
          wang: _3,
          wanggou: _3,
          watch: _3,
          watches: _3,
          weather: _3,
          weatherchannel: _3,
          webcam: _3,
          weber: _3,
          website: _58,
          wed: _3,
          wedding: _3,
          weibo: _3,
          weir: _3,
          whoswho: _3,
          wien: _3,
          wiki: _58,
          williamhill: _3,
          win: _3,
          windows: _3,
          wine: _3,
          winners: _3,
          wme: _3,
          wolterskluwer: _3,
          woodside: _3,
          work: _3,
          works: _3,
          world: _3,
          wow: _3,
          wtc: _3,
          wtf: _3,
          xbox: _3,
          xerox: _3,
          xihuan: _3,
          xin: _3,
          'xn--11b4c3d': _3,
          '\u0915\u0949\u092E': _3,
          'xn--1ck2e1b': _3,
          '\u30BB\u30FC\u30EB': _3,
          'xn--1qqw23a': _3,
          '\u4F5B\u5C71': _3,
          'xn--30rr7y': _3,
          '\u6148\u5584': _3,
          'xn--3bst00m': _3,
          '\u96C6\u56E2': _3,
          'xn--3ds443g': _3,
          '\u5728\u7EBF': _3,
          'xn--3pxu8k': _3,
          '\u70B9\u770B': _3,
          'xn--42c2d9a': _3,
          '\u0E04\u0E2D\u0E21': _3,
          'xn--45q11c': _3,
          '\u516B\u5366': _3,
          'xn--4gbrim': _3,
          '\u0645\u0648\u0642\u0639': _3,
          'xn--55qw42g': _3,
          '\u516C\u76CA': _3,
          'xn--55qx5d': _3,
          '\u516C\u53F8': _3,
          'xn--5su34j936bgsg': _3,
          '\u9999\u683C\u91CC\u62C9': _3,
          'xn--5tzm5g': _3,
          '\u7F51\u7AD9': _3,
          'xn--6frz82g': _3,
          '\u79FB\u52A8': _3,
          'xn--6qq986b3xl': _3,
          '\u6211\u7231\u4F60': _3,
          'xn--80adxhks': _3,
          '\u043C\u043E\u0441\u043A\u0432\u0430': _3,
          'xn--80aqecdr1a': _3,
          '\u043A\u0430\u0442\u043E\u043B\u0438\u043A': _3,
          'xn--80asehdb': _3,
          '\u043E\u043D\u043B\u0430\u0439\u043D': _3,
          'xn--80aswg': _3,
          '\u0441\u0430\u0439\u0442': _3,
          'xn--8y0a063a': _3,
          '\u8054\u901A': _3,
          'xn--9dbq2a': _3,
          '\u05E7\u05D5\u05DD': _3,
          'xn--9et52u': _3,
          '\u65F6\u5C1A': _3,
          'xn--9krt00a': _3,
          '\u5FAE\u535A': _3,
          'xn--b4w605ferd': _3,
          '\u6DE1\u9A6C\u9521': _3,
          'xn--bck1b9a5dre4c': _3,
          '\u30D5\u30A1\u30C3\u30B7\u30E7\u30F3': _3,
          'xn--c1avg': _3,
          '\u043E\u0440\u0433': _3,
          'xn--c2br7g': _3,
          '\u0928\u0947\u091F': _3,
          'xn--cck2b3b': _3,
          '\u30B9\u30C8\u30A2': _3,
          'xn--cckwcxetd': _3,
          '\u30A2\u30DE\u30BE\u30F3': _3,
          'xn--cg4bki': _3,
          '\uC0BC\uC131': _3,
          'xn--czr694b': _3,
          '\u5546\u6807': _3,
          'xn--czrs0t': _3,
          '\u5546\u5E97': _3,
          'xn--czru2d': _3,
          '\u5546\u57CE': _3,
          'xn--d1acj3b': _3,
          '\u0434\u0435\u0442\u0438': _3,
          'xn--eckvdtc9d': _3,
          '\u30DD\u30A4\u30F3\u30C8': _3,
          'xn--efvy88h': _3,
          '\u65B0\u95FB': _3,
          'xn--fct429k': _3,
          '\u5BB6\u96FB': _3,
          'xn--fhbei': _3,
          '\u0643\u0648\u0645': _3,
          'xn--fiq228c5hs': _3,
          '\u4E2D\u6587\u7F51': _3,
          'xn--fiq64b': _3,
          '\u4E2D\u4FE1': _3,
          'xn--fjq720a': _3,
          '\u5A31\u4E50': _3,
          'xn--flw351e': _3,
          '\u8C37\u6B4C': _3,
          'xn--fzys8d69uvgm': _3,
          '\u96FB\u8A0A\u76C8\u79D1': _3,
          'xn--g2xx48c': _3,
          '\u8D2D\u7269': _3,
          'xn--gckr3f0f': _3,
          '\u30AF\u30E9\u30A6\u30C9': _3,
          'xn--gk3at1e': _3,
          '\u901A\u8CA9': _3,
          'xn--hxt814e': _3,
          '\u7F51\u5E97': _3,
          'xn--i1b6b1a6a2e': _3,
          '\u0938\u0902\u0917\u0920\u0928': _3,
          'xn--imr513n': _3,
          '\u9910\u5385': _3,
          'xn--io0a7i': _3,
          '\u7F51\u7EDC': _3,
          'xn--j1aef': _3,
          '\u043A\u043E\u043C': _3,
          'xn--jlq480n2rg': _3,
          '\u4E9A\u9A6C\u900A': _3,
          'xn--jvr189m': _3,
          '\u98DF\u54C1': _3,
          'xn--kcrx77d1x4a': _3,
          '\u98DE\u5229\u6D66': _3,
          'xn--kput3i': _3,
          '\u624B\u673A': _3,
          'xn--mgba3a3ejt': _3,
          '\u0627\u0631\u0627\u0645\u0643\u0648': _3,
          'xn--mgba7c0bbn0a': _3,
          '\u0627\u0644\u0639\u0644\u064A\u0627\u0646': _3,
          'xn--mgbab2bd': _3,
          '\u0628\u0627\u0632\u0627\u0631': _3,
          'xn--mgbca7dzdo': _3,
          '\u0627\u0628\u0648\u0638\u0628\u064A': _3,
          'xn--mgbi4ecexp': _3,
          '\u0643\u0627\u062B\u0648\u0644\u064A\u0643': _3,
          'xn--mgbt3dhd': _3,
          '\u0647\u0645\u0631\u0627\u0647': _3,
          'xn--mk1bu44c': _3,
          '\uB2F7\uCEF4': _3,
          'xn--mxtq1m': _3,
          '\u653F\u5E9C': _3,
          'xn--ngbc5azd': _3,
          '\u0634\u0628\u0643\u0629': _3,
          'xn--ngbe9e0a': _3,
          '\u0628\u064A\u062A\u0643': _3,
          'xn--ngbrx': _3,
          '\u0639\u0631\u0628': _3,
          'xn--nqv7f': _3,
          '\u673A\u6784': _3,
          'xn--nqv7fs00ema': _3,
          '\u7EC4\u7EC7\u673A\u6784': _3,
          'xn--nyqy26a': _3,
          '\u5065\u5EB7': _3,
          'xn--otu796d': _3,
          '\u62DB\u8058': _3,
          'xn--p1acf': [
            1,
            {
              'xn--90amc': _4,
              'xn--j1aef': _4,
              'xn--j1ael8b': _4,
              'xn--h1ahn': _4,
              'xn--j1adp': _4,
              'xn--c1avg': _4,
              'xn--80aaa0cvac': _4,
              'xn--h1aliz': _4,
              'xn--90a1af': _4,
              'xn--41a': _4,
            },
          ],
          '\u0440\u0443\u0441': [
            1,
            {
              '\u0431\u0438\u0437': _4,
              '\u043A\u043E\u043C': _4,
              '\u043A\u0440\u044B\u043C': _4,
              '\u043C\u0438\u0440': _4,
              '\u043C\u0441\u043A': _4,
              '\u043E\u0440\u0433': _4,
              '\u0441\u0430\u043C\u0430\u0440\u0430': _4,
              '\u0441\u043E\u0447\u0438': _4,
              '\u0441\u043F\u0431': _4,
              '\u044F': _4,
            },
          ],
          'xn--pssy2u': _3,
          '\u5927\u62FF': _3,
          'xn--q9jyb4c': _3,
          '\u307F\u3093\u306A': _3,
          'xn--qcka1pmc': _3,
          '\u30B0\u30FC\u30B0\u30EB': _3,
          'xn--rhqv96g': _3,
          '\u4E16\u754C': _3,
          'xn--rovu88b': _3,
          '\u66F8\u7C4D': _3,
          'xn--ses554g': _3,
          '\u7F51\u5740': _3,
          'xn--t60b56a': _3,
          '\uB2F7\uB137': _3,
          'xn--tckwe': _3,
          '\u30B3\u30E0': _3,
          'xn--tiq49xqyj': _3,
          '\u5929\u4E3B\u6559': _3,
          'xn--unup4y': _3,
          '\u6E38\u620F': _3,
          'xn--vermgensberater-ctb': _3,
          'verm\xF6gensberater': _3,
          'xn--vermgensberatung-pwb': _3,
          'verm\xF6gensberatung': _3,
          'xn--vhquv': _3,
          '\u4F01\u4E1A': _3,
          'xn--vuq861b': _3,
          '\u4FE1\u606F': _3,
          'xn--w4r85el8fhu5dnra': _3,
          '\u5609\u91CC\u5927\u9152\u5E97': _3,
          'xn--w4rs40l': _3,
          '\u5609\u91CC': _3,
          'xn--xhq521b': _3,
          '\u5E7F\u4E1C': _3,
          'xn--zfr164b': _3,
          '\u653F\u52A1': _3,
          xyz: [1, { botdash: _4, telebit: _7 }],
          yachts: _3,
          yahoo: _3,
          yamaxun: _3,
          yandex: _3,
          yodobashi: _3,
          yoga: _3,
          yokohama: _3,
          you: _3,
          youtube: _3,
          yun: _3,
          zappos: _3,
          zara: _3,
          zero: _3,
          zip: _3,
          zone: [1, { cloud66: _4, triton: _7, stackit: _4, lima: _4 }],
          zuerich: _3,
        },
      ];
      return rules2;
    })();
    function lookupInTrie(parts, trie, index, allowedMask) {
      let result = null;
      let node = trie;
      while (node !== void 0) {
        if ((node[0] & allowedMask) !== 0) {
          result = {
            index: index + 1,
            isIcann: node[0] === 1,
            isPrivate: node[0] === 2,
          };
        }
        if (index === -1) {
          break;
        }
        const succ = node[1];
        node = Object.prototype.hasOwnProperty.call(succ, parts[index])
          ? succ[parts[index]]
          : succ['*'];
        index -= 1;
      }
      return result;
    }
    function suffixLookup(hostname, options, out) {
      var _a;
      if (fastPathLookup(hostname, options, out)) {
        return;
      }
      const hostnameParts = hostname.split('.');
      const allowedMask =
        (options.allowPrivateDomains ? 2 : 0) |
        (options.allowIcannDomains ? 1 : 0);
      const exceptionMatch = lookupInTrie(
        hostnameParts,
        exceptions,
        hostnameParts.length - 1,
        allowedMask,
      );
      if (exceptionMatch !== null) {
        out.isIcann = exceptionMatch.isIcann;
        out.isPrivate = exceptionMatch.isPrivate;
        out.publicSuffix = hostnameParts
          .slice(exceptionMatch.index + 1)
          .join('.');
        return;
      }
      const rulesMatch = lookupInTrie(
        hostnameParts,
        rules,
        hostnameParts.length - 1,
        allowedMask,
      );
      if (rulesMatch !== null) {
        out.isIcann = rulesMatch.isIcann;
        out.isPrivate = rulesMatch.isPrivate;
        out.publicSuffix = hostnameParts.slice(rulesMatch.index).join('.');
        return;
      }
      out.isIcann = false;
      out.isPrivate = false;
      out.publicSuffix =
        (_a = hostnameParts[hostnameParts.length - 1]) !== null && _a !== void 0
          ? _a
          : null;
    }
    var RESULT = getEmptyResult();
    function parse(url, options = {}) {
      return parseImpl(url, 5, suffixLookup, options, getEmptyResult());
    }
    function getHostname(url, options = {}) {
      resetResult(RESULT);
      return parseImpl(url, 0, suffixLookup, options, RESULT).hostname;
    }
    function getPublicSuffix(url, options = {}) {
      resetResult(RESULT);
      return parseImpl(url, 2, suffixLookup, options, RESULT).publicSuffix;
    }
    function getDomain(url, options = {}) {
      resetResult(RESULT);
      return parseImpl(url, 3, suffixLookup, options, RESULT).domain;
    }
    function getSubdomain(url, options = {}) {
      resetResult(RESULT);
      return parseImpl(url, 4, suffixLookup, options, RESULT).subdomain;
    }
    function getDomainWithoutSuffix(url, options = {}) {
      resetResult(RESULT);
      return parseImpl(url, 5, suffixLookup, options, RESULT)
        .domainWithoutSuffix;
    }
    exports2.getDomain = getDomain;
    exports2.getDomainWithoutSuffix = getDomainWithoutSuffix;
    exports2.getHostname = getHostname;
    exports2.getPublicSuffix = getPublicSuffix;
    exports2.getSubdomain = getSubdomain;
    exports2.parse = parse;
  },
});

// node_modules/tough-cookie/dist/getPublicSuffix.js
var require_getPublicSuffix = __commonJS({
  'node_modules/tough-cookie/dist/getPublicSuffix.js'(exports2) {
    'use strict';
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.getPublicSuffix = getPublicSuffix;
    var tldts_1 = require_cjs();
    var SPECIAL_USE_DOMAINS = [
      'local',
      'example',
      'invalid',
      'localhost',
      'test',
    ];
    var SPECIAL_TREATMENT_DOMAINS = ['localhost', 'invalid'];
    var defaultGetPublicSuffixOptions = {
      allowSpecialUseDomain: false,
      ignoreError: false,
    };
    function getPublicSuffix(domain, options = {}) {
      options = { ...defaultGetPublicSuffixOptions, ...options };
      const domainParts = domain.split('.');
      const topLevelDomain = domainParts[domainParts.length - 1];
      const allowSpecialUseDomain = !!options.allowSpecialUseDomain;
      const ignoreError = !!options.ignoreError;
      if (
        allowSpecialUseDomain &&
        topLevelDomain !== void 0 &&
        SPECIAL_USE_DOMAINS.includes(topLevelDomain)
      ) {
        if (domainParts.length > 1) {
          const secondLevelDomain = domainParts[domainParts.length - 2];
          return `${secondLevelDomain}.${topLevelDomain}`;
        } else if (SPECIAL_TREATMENT_DOMAINS.includes(topLevelDomain)) {
          return topLevelDomain;
        }
      }
      if (
        !ignoreError &&
        topLevelDomain !== void 0 &&
        SPECIAL_USE_DOMAINS.includes(topLevelDomain)
      ) {
        throw new Error(
          `Cookie has domain set to the public suffix "${topLevelDomain}" which is a special use domain. To allow this, configure your CookieJar with {allowSpecialUseDomain: true, rejectPublicSuffixes: false}.`,
        );
      }
      const publicSuffix = (0, tldts_1.getDomain)(domain, {
        allowIcannDomains: true,
        allowPrivateDomains: true,
      });
      if (publicSuffix) return publicSuffix;
    }
  },
});

// node_modules/tough-cookie/dist/permuteDomain.js
var require_permuteDomain = __commonJS({
  'node_modules/tough-cookie/dist/permuteDomain.js'(exports2) {
    'use strict';
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.permuteDomain = permuteDomain2;
    var getPublicSuffix_1 = require_getPublicSuffix();
    function permuteDomain2(domain, allowSpecialUseDomain) {
      const pubSuf = (0, getPublicSuffix_1.getPublicSuffix)(domain, {
        allowSpecialUseDomain,
      });
      if (!pubSuf) {
        return void 0;
      }
      if (pubSuf == domain) {
        return [domain];
      }
      if (domain.slice(-1) == '.') {
        domain = domain.slice(0, -1);
      }
      const prefix = domain.slice(0, -(pubSuf.length + 1));
      const parts = prefix.split('.').reverse();
      let cur = pubSuf;
      const permutations = [cur];
      while (parts.length) {
        const part = parts.shift();
        cur = `${part}.${cur}`;
        permutations.push(cur);
      }
      return permutations;
    }
  },
});

// node_modules/tough-cookie/dist/store.js
var require_store = __commonJS({
  'node_modules/tough-cookie/dist/store.js'(exports2) {
    'use strict';
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.Store = void 0;
    var Store2 = class {
      constructor() {
        this.synchronous = false;
      }
      /**
       * @internal No doc because this is an overload that supports the implementation
       */
      findCookie(_domain, _path, _key, _callback) {
        throw new Error('findCookie is not implemented');
      }
      /**
       * @internal No doc because this is an overload that supports the implementation
       */
      findCookies(_domain, _path, _allowSpecialUseDomain = false, _callback) {
        throw new Error('findCookies is not implemented');
      }
      /**
       * @internal No doc because this is an overload that supports the implementation
       */
      putCookie(_cookie, _callback) {
        throw new Error('putCookie is not implemented');
      }
      /**
       * @internal No doc because this is an overload that supports the implementation
       */
      updateCookie(_oldCookie, _newCookie, _callback) {
        throw new Error('updateCookie is not implemented');
      }
      /**
       * @internal No doc because this is an overload that supports the implementation
       */
      removeCookie(_domain, _path, _key, _callback) {
        throw new Error('removeCookie is not implemented');
      }
      /**
       * @internal No doc because this is an overload that supports the implementation
       */
      removeCookies(_domain, _path, _callback) {
        throw new Error('removeCookies is not implemented');
      }
      /**
       * @internal No doc because this is an overload that supports the implementation
       */
      removeAllCookies(_callback) {
        throw new Error('removeAllCookies is not implemented');
      }
      /**
       * @internal No doc because this is an overload that supports the implementation
       */
      getAllCookies(_callback) {
        throw new Error(
          'getAllCookies is not implemented (therefore jar cannot be serialized)',
        );
      }
    };
    exports2.Store = Store2;
  },
});

// node_modules/tough-cookie/dist/utils.js
var require_utils2 = __commonJS({
  'node_modules/tough-cookie/dist/utils.js'(exports2) {
    'use strict';
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.safeToString = exports2.objectToString = void 0;
    exports2.createPromiseCallback = createPromiseCallback;
    exports2.inOperator = inOperator;
    var objectToString = obj => Object.prototype.toString.call(obj);
    exports2.objectToString = objectToString;
    var safeArrayToString = (arr, seenArrays) => {
      if (typeof arr.join !== 'function')
        return (0, exports2.objectToString)(arr);
      seenArrays.add(arr);
      const mapped = arr.map(val =>
        val === null || val === void 0 || seenArrays.has(val)
          ? ''
          : safeToStringImpl(val, seenArrays),
      );
      return mapped.join();
    };
    var safeToStringImpl = (
      val,
      seenArrays = /* @__PURE__ */ new WeakSet(),
    ) => {
      if (typeof val !== 'object' || val === null) {
        return String(val);
      } else if (typeof val.toString === 'function') {
        return Array.isArray(val)
          ? // Arrays have a weird custom toString that we need to replicate
            safeArrayToString(val, seenArrays)
          : String(val);
      } else {
        return (0, exports2.objectToString)(val);
      }
    };
    var safeToString = val => safeToStringImpl(val);
    exports2.safeToString = safeToString;
    function createPromiseCallback(cb) {
      let callback;
      let resolve;
      let reject;
      const promise = new Promise((_resolve, _reject) => {
        resolve = _resolve;
        reject = _reject;
      });
      if (typeof cb === 'function') {
        callback = (err, result) => {
          try {
            if (err) cb(err);
            else cb(null, result);
          } catch (e) {
            reject(e instanceof Error ? e : new Error());
          }
        };
      } else {
        callback = (err, result) => {
          try {
            if (err) reject(err);
            else resolve(result);
          } catch (e) {
            reject(e instanceof Error ? e : new Error());
          }
        };
      }
      return {
        promise,
        callback,
        resolve: value => {
          callback(null, value);
          return promise;
        },
        reject: error => {
          callback(error);
          return promise;
        },
      };
    }
    function inOperator(k, o) {
      return k in o;
    }
  },
});

// node_modules/tough-cookie/dist/memstore.js
var require_memstore = __commonJS({
  'node_modules/tough-cookie/dist/memstore.js'(exports2) {
    'use strict';
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.MemoryCookieStore = void 0;
    var pathMatch_1 = require_pathMatch();
    var permuteDomain_1 = require_permuteDomain();
    var store_1 = require_store();
    var utils_1 = require_utils2();
    var MemoryCookieStore = class extends store_1.Store {
      /**
       * Create a new {@link MemoryCookieStore}.
       */
      constructor() {
        super();
        this.synchronous = true;
        this.idx = /* @__PURE__ */ Object.create(null);
      }
      /**
       * @internal No doc because this is an overload that supports the implementation
       */
      findCookie(domain, path, key, callback) {
        const promiseCallback = (0, utils_1.createPromiseCallback)(callback);
        if (domain == null || path == null || key == null) {
          return promiseCallback.resolve(void 0);
        }
        const result = this.idx[domain]?.[path]?.[key];
        return promiseCallback.resolve(result);
      }
      /**
       * @internal No doc because this is an overload that supports the implementation
       */
      findCookies(domain, path, allowSpecialUseDomain = false, callback) {
        if (typeof allowSpecialUseDomain === 'function') {
          callback = allowSpecialUseDomain;
          allowSpecialUseDomain = true;
        }
        const results = [];
        const promiseCallback = (0, utils_1.createPromiseCallback)(callback);
        if (!domain) {
          return promiseCallback.resolve([]);
        }
        let pathMatcher;
        if (!path) {
          pathMatcher = function matchAll(domainIndex) {
            for (const curPath in domainIndex) {
              const pathIndex = domainIndex[curPath];
              for (const key in pathIndex) {
                const value = pathIndex[key];
                if (value) {
                  results.push(value);
                }
              }
            }
          };
        } else {
          pathMatcher = function matchRFC(domainIndex) {
            for (const cookiePath in domainIndex) {
              if ((0, pathMatch_1.pathMatch)(path, cookiePath)) {
                const pathIndex = domainIndex[cookiePath];
                for (const key in pathIndex) {
                  const value = pathIndex[key];
                  if (value) {
                    results.push(value);
                  }
                }
              }
            }
          };
        }
        const domains = (0, permuteDomain_1.permuteDomain)(
          domain,
          allowSpecialUseDomain,
        ) || [domain];
        const idx = this.idx;
        domains.forEach(curDomain => {
          const domainIndex = idx[curDomain];
          if (!domainIndex) {
            return;
          }
          pathMatcher(domainIndex);
        });
        return promiseCallback.resolve(results);
      }
      /**
       * @internal No doc because this is an overload that supports the implementation
       */
      putCookie(cookie, callback) {
        const promiseCallback = (0, utils_1.createPromiseCallback)(callback);
        const { domain, path, key } = cookie;
        if (domain == null || path == null || key == null) {
          return promiseCallback.resolve(void 0);
        }
        const domainEntry =
          this.idx[domain] ?? /* @__PURE__ */ Object.create(null);
        this.idx[domain] = domainEntry;
        const pathEntry =
          domainEntry[path] ?? /* @__PURE__ */ Object.create(null);
        domainEntry[path] = pathEntry;
        pathEntry[key] = cookie;
        return promiseCallback.resolve(void 0);
      }
      /**
       * @internal No doc because this is an overload that supports the implementation
       */
      updateCookie(_oldCookie, newCookie, callback) {
        if (callback) this.putCookie(newCookie, callback);
        else return this.putCookie(newCookie);
      }
      /**
       * @internal No doc because this is an overload that supports the implementation
       */
      removeCookie(domain, path, key, callback) {
        const promiseCallback = (0, utils_1.createPromiseCallback)(callback);
        delete this.idx[domain]?.[path]?.[key];
        return promiseCallback.resolve(void 0);
      }
      /**
       * @internal No doc because this is an overload that supports the implementation
       */
      removeCookies(domain, path, callback) {
        const promiseCallback = (0, utils_1.createPromiseCallback)(callback);
        const domainEntry = this.idx[domain];
        if (domainEntry) {
          if (path) {
            delete domainEntry[path];
          } else {
            delete this.idx[domain];
          }
        }
        return promiseCallback.resolve(void 0);
      }
      /**
       * @internal No doc because this is an overload that supports the implementation
       */
      removeAllCookies(callback) {
        const promiseCallback = (0, utils_1.createPromiseCallback)(callback);
        this.idx = /* @__PURE__ */ Object.create(null);
        return promiseCallback.resolve(void 0);
      }
      /**
       * @internal No doc because this is an overload that supports the implementation
       */
      getAllCookies(callback) {
        const promiseCallback = (0, utils_1.createPromiseCallback)(callback);
        const cookies = [];
        const idx = this.idx;
        const domains = Object.keys(idx);
        domains.forEach(domain => {
          const domainEntry = idx[domain] ?? {};
          const paths = Object.keys(domainEntry);
          paths.forEach(path => {
            const pathEntry = domainEntry[path] ?? {};
            const keys = Object.keys(pathEntry);
            keys.forEach(key => {
              const keyEntry = pathEntry[key];
              if (keyEntry != null) {
                cookies.push(keyEntry);
              }
            });
          });
        });
        cookies.sort((a, b) => {
          return (a.creationIndex || 0) - (b.creationIndex || 0);
        });
        return promiseCallback.resolve(cookies);
      }
    };
    exports2.MemoryCookieStore = MemoryCookieStore;
  },
});

// node_modules/tough-cookie/dist/validators.js
var require_validators = __commonJS({
  'node_modules/tough-cookie/dist/validators.js'(exports2) {
    'use strict';
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.ParameterError = void 0;
    exports2.isNonEmptyString = isNonEmptyString;
    exports2.isDate = isDate;
    exports2.isEmptyString = isEmptyString;
    exports2.isString = isString;
    exports2.isObject = isObject;
    exports2.isInteger = isInteger;
    exports2.validate = validate;
    var utils_1 = require_utils2();
    function isNonEmptyString(data) {
      return isString(data) && data !== '';
    }
    function isDate(data) {
      return data instanceof Date && isInteger(data.getTime());
    }
    function isEmptyString(data) {
      return data === '' || (data instanceof String && data.toString() === '');
    }
    function isString(data) {
      return typeof data === 'string' || data instanceof String;
    }
    function isObject(data) {
      return (0, utils_1.objectToString)(data) === '[object Object]';
    }
    function isInteger(data) {
      return typeof data === 'number' && data % 1 === 0;
    }
    function validate(bool, cbOrMessage, message) {
      if (bool) return;
      const cb = typeof cbOrMessage === 'function' ? cbOrMessage : void 0;
      let options = typeof cbOrMessage === 'function' ? message : cbOrMessage;
      if (!isObject(options)) options = '[object Object]';
      const err = new ParameterError((0, utils_1.safeToString)(options));
      if (cb) cb(err);
      else throw err;
    }
    var ParameterError = class extends Error {};
    exports2.ParameterError = ParameterError;
  },
});

// node_modules/tough-cookie/dist/version.js
var require_version = __commonJS({
  'node_modules/tough-cookie/dist/version.js'(exports2) {
    'use strict';
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.version = void 0;
    exports2.version = '5.0.0';
  },
});

// node_modules/tough-cookie/dist/cookie/constants.js
var require_constants = __commonJS({
  'node_modules/tough-cookie/dist/cookie/constants.js'(exports2) {
    'use strict';
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.IP_V6_REGEX_OBJECT = exports2.PrefixSecurityEnum = void 0;
    exports2.PrefixSecurityEnum = Object.freeze({
      SILENT: 'silent',
      STRICT: 'strict',
      DISABLED: 'unsafe-disabled',
    });
    var IP_V6_REGEX = `
\\[?(?:
(?:[a-fA-F\\d]{1,4}:){7}(?:[a-fA-F\\d]{1,4}|:)|
(?:[a-fA-F\\d]{1,4}:){6}(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|:[a-fA-F\\d]{1,4}|:)|
(?:[a-fA-F\\d]{1,4}:){5}(?::(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|(?::[a-fA-F\\d]{1,4}){1,2}|:)|
(?:[a-fA-F\\d]{1,4}:){4}(?:(?::[a-fA-F\\d]{1,4}){0,1}:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|(?::[a-fA-F\\d]{1,4}){1,3}|:)|
(?:[a-fA-F\\d]{1,4}:){3}(?:(?::[a-fA-F\\d]{1,4}){0,2}:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|(?::[a-fA-F\\d]{1,4}){1,4}|:)|
(?:[a-fA-F\\d]{1,4}:){2}(?:(?::[a-fA-F\\d]{1,4}){0,3}:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|(?::[a-fA-F\\d]{1,4}){1,5}|:)|
(?:[a-fA-F\\d]{1,4}:){1}(?:(?::[a-fA-F\\d]{1,4}){0,4}:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|(?::[a-fA-F\\d]{1,4}){1,6}|:)|
(?::(?:(?::[a-fA-F\\d]{1,4}){0,5}:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|(?::[a-fA-F\\d]{1,4}){1,7}|:))
)(?:%[0-9a-zA-Z]{1,})?\\]?
`
      .replace(/\s*\/\/.*$/gm, '')
      .replace(/\n/g, '')
      .trim();
    exports2.IP_V6_REGEX_OBJECT = new RegExp(`^${IP_V6_REGEX}$`);
  },
});

// node_modules/tough-cookie/dist/cookie/canonicalDomain.js
var require_canonicalDomain = __commonJS({
  'node_modules/tough-cookie/dist/cookie/canonicalDomain.js'(exports2) {
    'use strict';
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.canonicalDomain = canonicalDomain3;
    var constants_1 = require_constants();
    var node_url_1 = require('node:url');
    function canonicalDomain3(domainName) {
      if (domainName == null) {
        return void 0;
      }
      let str = domainName.trim().replace(/^\./, '');
      if (constants_1.IP_V6_REGEX_OBJECT.test(str)) {
        if (!str.startsWith('[')) {
          str = '[' + str;
        }
        if (!str.endsWith(']')) {
          str = str + ']';
        }
        return (0, node_url_1.domainToASCII)(str).slice(1, -1);
      }
      if (/[^\u0001-\u007f]/.test(str)) {
        return (0, node_url_1.domainToASCII)(str);
      }
      return str.toLowerCase();
    }
  },
});

// node_modules/tough-cookie/dist/cookie/formatDate.js
var require_formatDate = __commonJS({
  'node_modules/tough-cookie/dist/cookie/formatDate.js'(exports2) {
    'use strict';
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.formatDate = formatDate;
    function formatDate(date) {
      return date.toUTCString();
    }
  },
});

// node_modules/tough-cookie/dist/cookie/parseDate.js
var require_parseDate = __commonJS({
  'node_modules/tough-cookie/dist/cookie/parseDate.js'(exports2) {
    'use strict';
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.parseDate = parseDate;
    var DATE_DELIM = /[\x09\x20-\x2F\x3B-\x40\x5B-\x60\x7B-\x7E]/;
    var MONTH_TO_NUM = {
      jan: 0,
      feb: 1,
      mar: 2,
      apr: 3,
      may: 4,
      jun: 5,
      jul: 6,
      aug: 7,
      sep: 8,
      oct: 9,
      nov: 10,
      dec: 11,
    };
    function parseDigits(token, minDigits, maxDigits, trailingOK) {
      let count = 0;
      while (count < token.length) {
        const c = token.charCodeAt(count);
        if (c <= 47 || c >= 58) {
          break;
        }
        count++;
      }
      if (count < minDigits || count > maxDigits) {
        return;
      }
      if (!trailingOK && count != token.length) {
        return;
      }
      return parseInt(token.slice(0, count), 10);
    }
    function parseTime(token) {
      const parts = token.split(':');
      const result = [0, 0, 0];
      if (parts.length !== 3) {
        return;
      }
      for (let i = 0; i < 3; i++) {
        const trailingOK = i == 2;
        const numPart = parts[i];
        if (numPart === void 0) {
          return;
        }
        const num = parseDigits(numPart, 1, 2, trailingOK);
        if (num === void 0) {
          return;
        }
        result[i] = num;
      }
      return result;
    }
    function parseMonth(token) {
      token = String(token).slice(0, 3).toLowerCase();
      switch (token) {
        case 'jan':
          return MONTH_TO_NUM.jan;
        case 'feb':
          return MONTH_TO_NUM.feb;
        case 'mar':
          return MONTH_TO_NUM.mar;
        case 'apr':
          return MONTH_TO_NUM.apr;
        case 'may':
          return MONTH_TO_NUM.may;
        case 'jun':
          return MONTH_TO_NUM.jun;
        case 'jul':
          return MONTH_TO_NUM.jul;
        case 'aug':
          return MONTH_TO_NUM.aug;
        case 'sep':
          return MONTH_TO_NUM.sep;
        case 'oct':
          return MONTH_TO_NUM.oct;
        case 'nov':
          return MONTH_TO_NUM.nov;
        case 'dec':
          return MONTH_TO_NUM.dec;
        default:
          return;
      }
    }
    function parseDate(cookieDate) {
      if (!cookieDate) {
        return;
      }
      const tokens = cookieDate.split(DATE_DELIM);
      let hour;
      let minute;
      let second;
      let dayOfMonth;
      let month;
      let year;
      for (let i = 0; i < tokens.length; i++) {
        const token = (tokens[i] ?? '').trim();
        if (!token.length) {
          continue;
        }
        if (second === void 0) {
          const result = parseTime(token);
          if (result) {
            hour = result[0];
            minute = result[1];
            second = result[2];
            continue;
          }
        }
        if (dayOfMonth === void 0) {
          const result = parseDigits(token, 1, 2, true);
          if (result !== void 0) {
            dayOfMonth = result;
            continue;
          }
        }
        if (month === void 0) {
          const result = parseMonth(token);
          if (result !== void 0) {
            month = result;
            continue;
          }
        }
        if (year === void 0) {
          const result = parseDigits(token, 2, 4, true);
          if (result !== void 0) {
            year = result;
            if (year >= 70 && year <= 99) {
              year += 1900;
            } else if (year >= 0 && year <= 69) {
              year += 2e3;
            }
          }
        }
      }
      if (
        dayOfMonth === void 0 ||
        month === void 0 ||
        year === void 0 ||
        hour === void 0 ||
        minute === void 0 ||
        second === void 0 ||
        dayOfMonth < 1 ||
        dayOfMonth > 31 ||
        year < 1601 ||
        hour > 23 ||
        minute > 59 ||
        second > 59
      ) {
        return;
      }
      return new Date(Date.UTC(year, month, dayOfMonth, hour, minute, second));
    }
  },
});

// node_modules/tough-cookie/dist/cookie/cookie.js
var require_cookie = __commonJS({
  'node_modules/tough-cookie/dist/cookie/cookie.js'(exports2) {
    'use strict';
    var __createBinding =
      (exports2 && exports2.__createBinding) ||
      (Object.create
        ? function (o, m, k, k2) {
            if (k2 === void 0) k2 = k;
            var desc = Object.getOwnPropertyDescriptor(m, k);
            if (
              !desc ||
              ('get' in desc
                ? !m.__esModule
                : desc.writable || desc.configurable)
            ) {
              desc = {
                enumerable: true,
                get: function () {
                  return m[k];
                },
              };
            }
            Object.defineProperty(o, k2, desc);
          }
        : function (o, m, k, k2) {
            if (k2 === void 0) k2 = k;
            o[k2] = m[k];
          });
    var __setModuleDefault =
      (exports2 && exports2.__setModuleDefault) ||
      (Object.create
        ? function (o, v) {
            Object.defineProperty(o, 'default', { enumerable: true, value: v });
          }
        : function (o, v) {
            o['default'] = v;
          });
    var __importStar =
      (exports2 && exports2.__importStar) ||
      function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
          for (var k in mod)
            if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k))
              __createBinding(result, mod, k);
        }
        __setModuleDefault(result, mod);
        return result;
      };
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.Cookie = void 0;
    var getPublicSuffix_1 = require_getPublicSuffix();
    var validators = __importStar(require_validators());
    var utils_1 = require_utils2();
    var formatDate_1 = require_formatDate();
    var parseDate_1 = require_parseDate();
    var canonicalDomain_1 = require_canonicalDomain();
    var COOKIE_OCTETS = /^[\x21\x23-\x2B\x2D-\x3A\x3C-\x5B\x5D-\x7E]+$/;
    var PATH_VALUE = /[\x20-\x3A\x3C-\x7E]+/;
    var CONTROL_CHARS = /[\x00-\x1F]/;
    var TERMINATORS = ['\n', '\r', '\0'];
    function trimTerminator(str) {
      if (validators.isEmptyString(str)) return str;
      for (let t = 0; t < TERMINATORS.length; t++) {
        const terminator = TERMINATORS[t];
        const terminatorIdx = terminator ? str.indexOf(terminator) : -1;
        if (terminatorIdx !== -1) {
          str = str.slice(0, terminatorIdx);
        }
      }
      return str;
    }
    function parseCookiePair(cookiePair, looseMode) {
      cookiePair = trimTerminator(cookiePair);
      let firstEq = cookiePair.indexOf('=');
      if (looseMode) {
        if (firstEq === 0) {
          cookiePair = cookiePair.substring(1);
          firstEq = cookiePair.indexOf('=');
        }
      } else {
        if (firstEq <= 0) {
          return void 0;
        }
      }
      let cookieName, cookieValue;
      if (firstEq <= 0) {
        cookieName = '';
        cookieValue = cookiePair.trim();
      } else {
        cookieName = cookiePair.slice(0, firstEq).trim();
        cookieValue = cookiePair.slice(firstEq + 1).trim();
      }
      if (CONTROL_CHARS.test(cookieName) || CONTROL_CHARS.test(cookieValue)) {
        return void 0;
      }
      const c = new Cookie3();
      c.key = cookieName;
      c.value = cookieValue;
      return c;
    }
    function parse(str, options) {
      if (validators.isEmptyString(str) || !validators.isString(str)) {
        return void 0;
      }
      str = str.trim();
      const firstSemi = str.indexOf(';');
      const cookiePair = firstSemi === -1 ? str : str.slice(0, firstSemi);
      const c = parseCookiePair(cookiePair, options?.loose ?? false);
      if (!c) {
        return void 0;
      }
      if (firstSemi === -1) {
        return c;
      }
      const unparsed = str.slice(firstSemi + 1).trim();
      if (unparsed.length === 0) {
        return c;
      }
      const cookie_avs = unparsed.split(';');
      while (cookie_avs.length) {
        const av = (cookie_avs.shift() ?? '').trim();
        if (av.length === 0) {
          continue;
        }
        const av_sep = av.indexOf('=');
        let av_key, av_value;
        if (av_sep === -1) {
          av_key = av;
          av_value = null;
        } else {
          av_key = av.slice(0, av_sep);
          av_value = av.slice(av_sep + 1);
        }
        av_key = av_key.trim().toLowerCase();
        if (av_value) {
          av_value = av_value.trim();
        }
        switch (av_key) {
          case 'expires':
            if (av_value) {
              const exp = (0, parseDate_1.parseDate)(av_value);
              if (exp) {
                c.expires = exp;
              }
            }
            break;
          case 'max-age':
            if (av_value) {
              if (/^-?[0-9]+$/.test(av_value)) {
                const delta = parseInt(av_value, 10);
                c.setMaxAge(delta);
              }
            }
            break;
          case 'domain':
            if (av_value) {
              const domain = av_value.trim().replace(/^\./, '');
              if (domain) {
                c.domain = domain.toLowerCase();
              }
            }
            break;
          case 'path':
            c.path = av_value && av_value[0] === '/' ? av_value : null;
            break;
          case 'secure':
            c.secure = true;
            break;
          case 'httponly':
            c.httpOnly = true;
            break;
          case 'samesite':
            switch (av_value ? av_value.toLowerCase() : '') {
              case 'strict':
                c.sameSite = 'strict';
                break;
              case 'lax':
                c.sameSite = 'lax';
                break;
              case 'none':
                c.sameSite = 'none';
                break;
              default:
                c.sameSite = void 0;
                break;
            }
            break;
          default:
            c.extensions = c.extensions || [];
            c.extensions.push(av);
            break;
        }
      }
      return c;
    }
    function fromJSON(str) {
      if (!str || validators.isEmptyString(str)) {
        return void 0;
      }
      let obj;
      if (typeof str === 'string') {
        try {
          obj = JSON.parse(str);
        } catch {
          return void 0;
        }
      } else {
        obj = str;
      }
      const c = new Cookie3();
      Cookie3.serializableProperties.forEach(prop => {
        if (
          obj &&
          typeof obj === 'object' &&
          (0, utils_1.inOperator)(prop, obj)
        ) {
          const val = obj[prop];
          if (val === void 0) {
            return;
          }
          if (
            (0, utils_1.inOperator)(prop, cookieDefaults) &&
            val === cookieDefaults[prop]
          ) {
            return;
          }
          switch (prop) {
            case 'key':
            case 'value':
            case 'sameSite':
              if (typeof val === 'string') {
                c[prop] = val;
              }
              break;
            case 'expires':
            case 'creation':
            case 'lastAccessed':
              if (
                typeof val === 'number' ||
                typeof val === 'string' ||
                val instanceof Date
              ) {
                c[prop] = obj[prop] == 'Infinity' ? 'Infinity' : new Date(val);
              } else if (val === null) {
                c[prop] = null;
              }
              break;
            case 'maxAge':
              if (
                typeof val === 'number' ||
                val === 'Infinity' ||
                val === '-Infinity'
              ) {
                c[prop] = val;
              }
              break;
            case 'domain':
            case 'path':
              if (typeof val === 'string' || val === null) {
                c[prop] = val;
              }
              break;
            case 'secure':
            case 'httpOnly':
              if (typeof val === 'boolean') {
                c[prop] = val;
              }
              break;
            case 'extensions':
              if (
                Array.isArray(val) &&
                val.every(item => typeof item === 'string')
              ) {
                c[prop] = val;
              }
              break;
            case 'hostOnly':
            case 'pathIsDefault':
              if (typeof val === 'boolean' || val === null) {
                c[prop] = val;
              }
              break;
          }
        }
      });
      return c;
    }
    var cookieDefaults = {
      // the order in which the RFC has them:
      key: '',
      value: '',
      expires: 'Infinity',
      maxAge: null,
      domain: null,
      path: null,
      secure: false,
      httpOnly: false,
      extensions: null,
      // set by the CookieJar:
      hostOnly: null,
      pathIsDefault: null,
      creation: null,
      lastAccessed: null,
      sameSite: void 0,
    };
    var Cookie3 = class _Cookie {
      /**
       * Create a new Cookie instance.
       * @public
       * @param options - The attributes to set on the cookie
       */
      constructor(options = {}) {
        this.key = options.key ?? cookieDefaults.key;
        this.value = options.value ?? cookieDefaults.value;
        this.expires = options.expires ?? cookieDefaults.expires;
        this.maxAge = options.maxAge ?? cookieDefaults.maxAge;
        this.domain = options.domain ?? cookieDefaults.domain;
        this.path = options.path ?? cookieDefaults.path;
        this.secure = options.secure ?? cookieDefaults.secure;
        this.httpOnly = options.httpOnly ?? cookieDefaults.httpOnly;
        this.extensions = options.extensions ?? cookieDefaults.extensions;
        this.creation = options.creation ?? cookieDefaults.creation;
        this.hostOnly = options.hostOnly ?? cookieDefaults.hostOnly;
        this.pathIsDefault =
          options.pathIsDefault ?? cookieDefaults.pathIsDefault;
        this.lastAccessed = options.lastAccessed ?? cookieDefaults.lastAccessed;
        this.sameSite = options.sameSite ?? cookieDefaults.sameSite;
        this.creation = options.creation ?? /* @__PURE__ */ new Date();
        Object.defineProperty(this, 'creationIndex', {
          configurable: false,
          enumerable: false,
          // important for assert.deepEqual checks
          writable: true,
          value: ++_Cookie.cookiesCreated,
        });
        this.creationIndex = _Cookie.cookiesCreated;
      }
      [/* @__PURE__ */ Symbol.for('nodejs.util.inspect.custom')]() {
        const now = Date.now();
        const hostOnly = this.hostOnly != null ? this.hostOnly.toString() : '?';
        const createAge =
          this.creation && this.creation !== 'Infinity'
            ? `${String(now - this.creation.getTime())}ms`
            : '?';
        const accessAge =
          this.lastAccessed && this.lastAccessed !== 'Infinity'
            ? `${String(now - this.lastAccessed.getTime())}ms`
            : '?';
        return `Cookie="${this.toString()}; hostOnly=${hostOnly}; aAge=${accessAge}; cAge=${createAge}"`;
      }
      /**
       * For convenience in using `JSON.stringify(cookie)`. Returns a plain-old Object that can be JSON-serialized.
       *
       * @remarks
       * - Any `Date` properties (such as {@link Cookie.expires}, {@link Cookie.creation}, and {@link Cookie.lastAccessed}) are exported in ISO format (`Date.toISOString()`).
       *
       *  - Custom Cookie properties are discarded. In tough-cookie 1.x, since there was no {@link Cookie.toJSON} method explicitly defined, all enumerable properties were captured.
       *      If you want a property to be serialized, add the property name to {@link Cookie.serializableProperties}.
       */
      toJSON() {
        const obj = {};
        for (const prop of _Cookie.serializableProperties) {
          const val = this[prop];
          if (val === cookieDefaults[prop]) {
            continue;
          }
          switch (prop) {
            case 'key':
            case 'value':
            case 'sameSite':
              if (typeof val === 'string') {
                obj[prop] = val;
              }
              break;
            case 'expires':
            case 'creation':
            case 'lastAccessed':
              if (
                typeof val === 'number' ||
                typeof val === 'string' ||
                val instanceof Date
              ) {
                obj[prop] =
                  val == 'Infinity' ? 'Infinity' : new Date(val).toISOString();
              } else if (val === null) {
                obj[prop] = null;
              }
              break;
            case 'maxAge':
              if (
                typeof val === 'number' ||
                val === 'Infinity' ||
                val === '-Infinity'
              ) {
                obj[prop] = val;
              }
              break;
            case 'domain':
            case 'path':
              if (typeof val === 'string' || val === null) {
                obj[prop] = val;
              }
              break;
            case 'secure':
            case 'httpOnly':
              if (typeof val === 'boolean') {
                obj[prop] = val;
              }
              break;
            case 'extensions':
              if (Array.isArray(val)) {
                obj[prop] = val;
              }
              break;
            case 'hostOnly':
            case 'pathIsDefault':
              if (typeof val === 'boolean' || val === null) {
                obj[prop] = val;
              }
              break;
          }
        }
        return obj;
      }
      /**
       * Does a deep clone of this cookie, implemented exactly as `Cookie.fromJSON(cookie.toJSON())`.
       * @public
       */
      clone() {
        return fromJSON(this.toJSON());
      }
      /**
       * Validates cookie attributes for semantic correctness. Useful for "lint" checking any `Set-Cookie` headers you generate.
       * For now, it returns a boolean, but eventually could return a reason string.
       *
       * @remarks
       * Works for a few things, but is by no means comprehensive.
       *
       * @beta
       */
      validate() {
        if (!this.value || !COOKIE_OCTETS.test(this.value)) {
          return false;
        }
        if (
          this.expires != 'Infinity' &&
          !(this.expires instanceof Date) &&
          !(0, parseDate_1.parseDate)(this.expires)
        ) {
          return false;
        }
        if (
          this.maxAge != null &&
          this.maxAge !== 'Infinity' &&
          (this.maxAge === '-Infinity' || this.maxAge <= 0)
        ) {
          return false;
        }
        if (this.path != null && !PATH_VALUE.test(this.path)) {
          return false;
        }
        const cdomain = this.cdomain();
        if (cdomain) {
          if (cdomain.match(/\.$/)) {
            return false;
          }
          const suffix = (0, getPublicSuffix_1.getPublicSuffix)(cdomain);
          if (suffix == null) {
            return false;
          }
        }
        return true;
      }
      /**
       * Sets the 'Expires' attribute on a cookie.
       *
       * @remarks
       * When given a `string` value it will be parsed with {@link parseDate}. If the value can't be parsed as a cookie date
       * then the 'Expires' attribute will be set to `"Infinity"`.
       *
       * @param exp - the new value for the 'Expires' attribute of the cookie.
       */
      setExpires(exp) {
        if (exp instanceof Date) {
          this.expires = exp;
        } else {
          this.expires = (0, parseDate_1.parseDate)(exp) || 'Infinity';
        }
      }
      /**
       * Sets the 'Max-Age' attribute (in seconds) on a cookie.
       *
       * @remarks
       * Coerces `-Infinity` to `"-Infinity"` and `Infinity` to `"Infinity"` so it can be serialized to JSON.
       *
       * @param age - the new value for the 'Max-Age' attribute (in seconds).
       */
      setMaxAge(age) {
        if (age === Infinity) {
          this.maxAge = 'Infinity';
        } else if (age === -Infinity) {
          this.maxAge = '-Infinity';
        } else {
          this.maxAge = age;
        }
      }
      /**
       * Encodes to a `Cookie` header value (specifically, the {@link Cookie.key} and {@link Cookie.value} properties joined with "=").
       * @public
       */
      cookieString() {
        const val = this.value || '';
        if (this.key) {
          return `${this.key}=${val}`;
        }
        return val;
      }
      /**
       * Encodes to a `Set-Cookie header` value.
       * @public
       */
      toString() {
        let str = this.cookieString();
        if (this.expires != 'Infinity') {
          if (this.expires instanceof Date) {
            str += `; Expires=${(0, formatDate_1.formatDate)(this.expires)}`;
          }
        }
        if (this.maxAge != null && this.maxAge != Infinity) {
          str += `; Max-Age=${String(this.maxAge)}`;
        }
        if (this.domain && !this.hostOnly) {
          str += `; Domain=${this.domain}`;
        }
        if (this.path) {
          str += `; Path=${this.path}`;
        }
        if (this.secure) {
          str += '; Secure';
        }
        if (this.httpOnly) {
          str += '; HttpOnly';
        }
        if (this.sameSite && this.sameSite !== 'none') {
          if (
            this.sameSite.toLowerCase() ===
            _Cookie.sameSiteCanonical.lax.toLowerCase()
          ) {
            str += `; SameSite=${_Cookie.sameSiteCanonical.lax}`;
          } else if (
            this.sameSite.toLowerCase() ===
            _Cookie.sameSiteCanonical.strict.toLowerCase()
          ) {
            str += `; SameSite=${_Cookie.sameSiteCanonical.strict}`;
          } else {
            str += `; SameSite=${this.sameSite}`;
          }
        }
        if (this.extensions) {
          this.extensions.forEach(ext => {
            str += `; ${ext}`;
          });
        }
        return str;
      }
      /**
       * Computes the TTL relative to now (milliseconds).
       *
       * @remarks
       * - `Infinity` is returned for cookies without an explicit expiry
       *
       * - `0` is returned if the cookie is expired.
       *
       * - Otherwise a time-to-live in milliseconds is returned.
       *
       * @param now - passing an explicit value is mostly used for testing purposes since this defaults to the `Date.now()`
       * @public
       */
      TTL(now = Date.now()) {
        if (this.maxAge != null && typeof this.maxAge === 'number') {
          return this.maxAge <= 0 ? 0 : this.maxAge * 1e3;
        }
        const expires = this.expires;
        if (expires === 'Infinity') {
          return Infinity;
        }
        return (expires?.getTime() ?? now) - (now || Date.now());
      }
      /**
       * Computes the absolute unix-epoch milliseconds that this cookie expires.
       *
       * The "Max-Age" attribute takes precedence over "Expires" (as per the RFC). The {@link Cookie.lastAccessed} attribute
       * (or the `now` parameter if given) is used to offset the {@link Cookie.maxAge} attribute.
       *
       * If Expires ({@link Cookie.expires}) is set, that's returned.
       *
       * @param now - can be used to provide a time offset (instead of {@link Cookie.lastAccessed}) to use when calculating the "Max-Age" value
       */
      expiryTime(now) {
        if (this.maxAge != null) {
          const relativeTo =
            now || this.lastAccessed || /* @__PURE__ */ new Date();
          const maxAge =
            typeof this.maxAge === 'number' ? this.maxAge : -Infinity;
          const age = maxAge <= 0 ? -Infinity : maxAge * 1e3;
          if (relativeTo === 'Infinity') {
            return Infinity;
          }
          return relativeTo.getTime() + age;
        }
        if (this.expires == 'Infinity') {
          return Infinity;
        }
        return this.expires ? this.expires.getTime() : void 0;
      }
      /**
       * Indicates if the cookie has been persisted to a store or not.
       * @public
       */
      isPersistent() {
        return this.maxAge != null || this.expires != 'Infinity';
      }
      /**
       * Calls {@link canonicalDomain} with the {@link Cookie.domain} property.
       * @public
       */
      canonicalizedDomain() {
        return (0, canonicalDomain_1.canonicalDomain)(this.domain);
      }
      /**
       * Alias for {@link Cookie.canonicalizedDomain}
       * @public
       */
      cdomain() {
        return (0, canonicalDomain_1.canonicalDomain)(this.domain);
      }
      /**
       * Parses a string into a Cookie object.
       *
       * @remarks
       * Note: when parsing a `Cookie` header it must be split by ';' before each Cookie string can be parsed.
       *
       * @example
       * ```
       * // parse a `Set-Cookie` header
       * const setCookieHeader = 'a=bcd; Expires=Tue, 18 Oct 2011 07:05:03 GMT'
       * const cookie = Cookie.parse(setCookieHeader)
       * cookie.key === 'a'
       * cookie.value === 'bcd'
       * cookie.expires === new Date(Date.parse('Tue, 18 Oct 2011 07:05:03 GMT'))
       * ```
       *
       * @example
       * ```
       * // parse a `Cookie` header
       * const cookieHeader = 'name=value; name2=value2; name3=value3'
       * const cookies = cookieHeader.split(';').map(Cookie.parse)
       * cookies[0].name === 'name'
       * cookies[0].value === 'value'
       * cookies[1].name === 'name2'
       * cookies[1].value === 'value2'
       * cookies[2].name === 'name3'
       * cookies[2].value === 'value3'
       * ```
       *
       * @param str - The `Set-Cookie` header or a Cookie string to parse.
       * @param options - Configures `strict` or `loose` mode for cookie parsing
       */
      static parse(str, options) {
        return parse(str, options);
      }
      /**
       * Does the reverse of {@link Cookie.toJSON}.
       *
       * @remarks
       * Any Date properties (such as .expires, .creation, and .lastAccessed) are parsed via Date.parse, not tough-cookie's parseDate, since ISO timestamps are being handled at this layer.
       *
       * @example
       * ```
       * const json = JSON.stringify({
       *   key: 'alpha',
       *   value: 'beta',
       *   domain: 'example.com',
       *   path: '/foo',
       *   expires: '2038-01-19T03:14:07.000Z',
       * })
       * const cookie = Cookie.fromJSON(json)
       * cookie.key === 'alpha'
       * cookie.value === 'beta'
       * cookie.domain === 'example.com'
       * cookie.path === '/foo'
       * cookie.expires === new Date(Date.parse('2038-01-19T03:14:07.000Z'))
       * ```
       *
       * @param str - An unparsed JSON string or a value that has already been parsed as JSON
       */
      static fromJSON(str) {
        return fromJSON(str);
      }
    };
    exports2.Cookie = Cookie3;
    Cookie3.cookiesCreated = 0;
    Cookie3.sameSiteLevel = {
      strict: 3,
      lax: 2,
      none: 1,
    };
    Cookie3.sameSiteCanonical = {
      strict: 'Strict',
      lax: 'Lax',
    };
    Cookie3.serializableProperties = [
      'key',
      'value',
      'expires',
      'maxAge',
      'domain',
      'path',
      'secure',
      'httpOnly',
      'extensions',
      'hostOnly',
      'pathIsDefault',
      'creation',
      'lastAccessed',
      'sameSite',
    ];
  },
});

// node_modules/tough-cookie/dist/cookie/cookieCompare.js
var require_cookieCompare = __commonJS({
  'node_modules/tough-cookie/dist/cookie/cookieCompare.js'(exports2) {
    'use strict';
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.cookieCompare = cookieCompare;
    var MAX_TIME = 2147483647e3;
    function cookieCompare(a, b) {
      let cmp;
      const aPathLen = a.path ? a.path.length : 0;
      const bPathLen = b.path ? b.path.length : 0;
      cmp = bPathLen - aPathLen;
      if (cmp !== 0) {
        return cmp;
      }
      const aTime =
        a.creation && a.creation instanceof Date
          ? a.creation.getTime()
          : MAX_TIME;
      const bTime =
        b.creation && b.creation instanceof Date
          ? b.creation.getTime()
          : MAX_TIME;
      cmp = aTime - bTime;
      if (cmp !== 0) {
        return cmp;
      }
      cmp = (a.creationIndex || 0) - (b.creationIndex || 0);
      return cmp;
    }
  },
});

// node_modules/tough-cookie/dist/cookie/defaultPath.js
var require_defaultPath = __commonJS({
  'node_modules/tough-cookie/dist/cookie/defaultPath.js'(exports2) {
    'use strict';
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.defaultPath = defaultPath;
    function defaultPath(path) {
      if (!path || path.slice(0, 1) !== '/') {
        return '/';
      }
      if (path === '/') {
        return path;
      }
      const rightSlash = path.lastIndexOf('/');
      if (rightSlash === 0) {
        return '/';
      }
      return path.slice(0, rightSlash);
    }
  },
});

// node_modules/tough-cookie/dist/cookie/domainMatch.js
var require_domainMatch = __commonJS({
  'node_modules/tough-cookie/dist/cookie/domainMatch.js'(exports2) {
    'use strict';
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.domainMatch = domainMatch;
    var canonicalDomain_1 = require_canonicalDomain();
    var IP_REGEX_LOWERCASE =
      /(?:^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}$)|(?:^(?:(?:[a-f\d]{1,4}:){7}(?:[a-f\d]{1,4}|:)|(?:[a-f\d]{1,4}:){6}(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|:[a-f\d]{1,4}|:)|(?:[a-f\d]{1,4}:){5}(?::(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-f\d]{1,4}){1,2}|:)|(?:[a-f\d]{1,4}:){4}(?:(?::[a-f\d]{1,4}){0,1}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-f\d]{1,4}){1,3}|:)|(?:[a-f\d]{1,4}:){3}(?:(?::[a-f\d]{1,4}){0,2}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-f\d]{1,4}){1,4}|:)|(?:[a-f\d]{1,4}:){2}(?:(?::[a-f\d]{1,4}){0,3}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-f\d]{1,4}){1,5}|:)|(?:[a-f\d]{1,4}:){1}(?:(?::[a-f\d]{1,4}){0,4}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-f\d]{1,4}){1,6}|:)|(?::(?:(?::[a-f\d]{1,4}){0,5}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-f\d]{1,4}){1,7}|:)))$)/;
    function domainMatch(domain, cookieDomain, canonicalize) {
      if (domain == null || cookieDomain == null) {
        return void 0;
      }
      let _str;
      let _domStr;
      if (canonicalize !== false) {
        _str = (0, canonicalDomain_1.canonicalDomain)(domain);
        _domStr = (0, canonicalDomain_1.canonicalDomain)(cookieDomain);
      } else {
        _str = domain;
        _domStr = cookieDomain;
      }
      if (_str == null || _domStr == null) {
        return void 0;
      }
      if (_str == _domStr) {
        return true;
      }
      const idx = _str.lastIndexOf(cookieDomain);
      if (idx <= 0) {
        return false;
      }
      if (_str.length !== _domStr.length + idx) {
        return false;
      }
      if (_str.substring(idx - 1, idx) !== '.') {
        return false;
      }
      return !IP_REGEX_LOWERCASE.test(_str);
    }
  },
});

// node_modules/tough-cookie/dist/cookie/cookieJar.js
var require_cookieJar = __commonJS({
  'node_modules/tough-cookie/dist/cookie/cookieJar.js'(exports2) {
    'use strict';
    var __createBinding =
      (exports2 && exports2.__createBinding) ||
      (Object.create
        ? function (o, m, k, k2) {
            if (k2 === void 0) k2 = k;
            var desc = Object.getOwnPropertyDescriptor(m, k);
            if (
              !desc ||
              ('get' in desc
                ? !m.__esModule
                : desc.writable || desc.configurable)
            ) {
              desc = {
                enumerable: true,
                get: function () {
                  return m[k];
                },
              };
            }
            Object.defineProperty(o, k2, desc);
          }
        : function (o, m, k, k2) {
            if (k2 === void 0) k2 = k;
            o[k2] = m[k];
          });
    var __setModuleDefault =
      (exports2 && exports2.__setModuleDefault) ||
      (Object.create
        ? function (o, v) {
            Object.defineProperty(o, 'default', { enumerable: true, value: v });
          }
        : function (o, v) {
            o['default'] = v;
          });
    var __importStar =
      (exports2 && exports2.__importStar) ||
      function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
          for (var k in mod)
            if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k))
              __createBinding(result, mod, k);
        }
        __setModuleDefault(result, mod);
        return result;
      };
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.CookieJar = void 0;
    var getPublicSuffix_1 = require_getPublicSuffix();
    var validators = __importStar(require_validators());
    var validators_1 = require_validators();
    var store_1 = require_store();
    var memstore_1 = require_memstore();
    var pathMatch_1 = require_pathMatch();
    var cookie_1 = require_cookie();
    var utils_1 = require_utils2();
    var canonicalDomain_1 = require_canonicalDomain();
    var constants_1 = require_constants();
    var defaultPath_1 = require_defaultPath();
    var domainMatch_1 = require_domainMatch();
    var cookieCompare_1 = require_cookieCompare();
    var version_1 = require_version();
    var defaultSetCookieOptions = {
      loose: false,
      sameSiteContext: void 0,
      ignoreError: false,
      http: true,
    };
    var defaultGetCookieOptions = {
      http: true,
      expire: true,
      allPaths: false,
      sameSiteContext: void 0,
      sort: void 0,
    };
    var SAME_SITE_CONTEXT_VAL_ERR =
      'Invalid sameSiteContext option for getCookies(); expected one of "strict", "lax", or "none"';
    function getCookieContext(url) {
      if (
        url &&
        typeof url === 'object' &&
        'hostname' in url &&
        typeof url.hostname === 'string' &&
        'pathname' in url &&
        typeof url.pathname === 'string' &&
        'protocol' in url &&
        typeof url.protocol === 'string'
      ) {
        return {
          hostname: url.hostname,
          pathname: url.pathname,
          protocol: url.protocol,
        };
      } else if (typeof url === 'string') {
        try {
          return new URL(decodeURI(url));
        } catch {
          return new URL(url);
        }
      } else {
        throw new validators_1.ParameterError(
          '`url` argument is not a string or URL.',
        );
      }
    }
    function checkSameSiteContext(value) {
      const context = String(value).toLowerCase();
      if (context === 'none' || context === 'lax' || context === 'strict') {
        return context;
      } else {
        return void 0;
      }
    }
    function isSecurePrefixConditionMet(cookie) {
      const startsWithSecurePrefix =
        typeof cookie.key === 'string' && cookie.key.startsWith('__Secure-');
      return !startsWithSecurePrefix || cookie.secure;
    }
    function isHostPrefixConditionMet(cookie) {
      const startsWithHostPrefix =
        typeof cookie.key === 'string' && cookie.key.startsWith('__Host-');
      return (
        !startsWithHostPrefix ||
        Boolean(
          cookie.secure &&
          cookie.hostOnly &&
          cookie.path != null &&
          cookie.path === '/',
        )
      );
    }
    function getNormalizedPrefixSecurity(prefixSecurity) {
      const normalizedPrefixSecurity = prefixSecurity.toLowerCase();
      switch (normalizedPrefixSecurity) {
        case constants_1.PrefixSecurityEnum.STRICT:
        case constants_1.PrefixSecurityEnum.SILENT:
        case constants_1.PrefixSecurityEnum.DISABLED:
          return normalizedPrefixSecurity;
        default:
          return constants_1.PrefixSecurityEnum.SILENT;
      }
    }
    var CookieJar = class _CookieJar {
      /**
       * Creates a new `CookieJar` instance.
       *
       * @remarks
       * - If a custom store is not passed to the constructor, an in-memory store ({@link MemoryCookieStore} will be created and used.
       * - If a boolean value is passed as the `options` parameter, this is equivalent to passing `{ rejectPublicSuffixes: <value> }`
       *
       * @param store - a custom {@link Store} implementation (defaults to {@link MemoryCookieStore})
       * @param options - configures how cookies are processed by the cookie jar
       */
      constructor(store, options) {
        if (typeof options === 'boolean') {
          options = { rejectPublicSuffixes: options };
        }
        this.rejectPublicSuffixes = options?.rejectPublicSuffixes ?? true;
        this.enableLooseMode = options?.looseMode ?? false;
        this.allowSpecialUseDomain = options?.allowSpecialUseDomain ?? true;
        this.prefixSecurity = getNormalizedPrefixSecurity(
          options?.prefixSecurity ?? 'silent',
        );
        this.store = store ?? new memstore_1.MemoryCookieStore();
      }
      callSync(fn) {
        if (!this.store.synchronous) {
          throw new Error(
            'CookieJar store is not synchronous; use async API instead.',
          );
        }
        let syncErr = null;
        let syncResult = void 0;
        try {
          fn.call(this, (error, result) => {
            syncErr = error;
            syncResult = result;
          });
        } catch (err) {
          syncErr = err;
        }
        if (syncErr) throw syncErr;
        return syncResult;
      }
      /**
       * @internal No doc because this is the overload implementation
       */
      setCookie(cookie, url, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = void 0;
        }
        const promiseCallback = (0, utils_1.createPromiseCallback)(callback);
        const cb = promiseCallback.callback;
        let context;
        try {
          if (typeof url === 'string') {
            validators.validate(
              validators.isNonEmptyString(url),
              callback,
              (0, utils_1.safeToString)(options),
            );
          }
          context = getCookieContext(url);
          if (typeof url === 'function') {
            return promiseCallback.reject(new Error('No URL was specified'));
          }
          if (typeof options === 'function') {
            options = defaultSetCookieOptions;
          }
          validators.validate(typeof cb === 'function', cb);
          if (
            !validators.isNonEmptyString(cookie) &&
            !validators.isObject(cookie) &&
            cookie instanceof String &&
            cookie.length == 0
          ) {
            return promiseCallback.resolve(void 0);
          }
        } catch (err) {
          return promiseCallback.reject(err);
        }
        const host =
          (0, canonicalDomain_1.canonicalDomain)(context.hostname) ?? null;
        const loose = options?.loose || this.enableLooseMode;
        let sameSiteContext = null;
        if (options?.sameSiteContext) {
          sameSiteContext = checkSameSiteContext(options.sameSiteContext);
          if (!sameSiteContext) {
            return promiseCallback.reject(new Error(SAME_SITE_CONTEXT_VAL_ERR));
          }
        }
        if (typeof cookie === 'string' || cookie instanceof String) {
          const parsedCookie = cookie_1.Cookie.parse(cookie.toString(), {
            loose,
          });
          if (!parsedCookie) {
            const err = new Error('Cookie failed to parse');
            return options?.ignoreError
              ? promiseCallback.resolve(void 0)
              : promiseCallback.reject(err);
          }
          cookie = parsedCookie;
        } else if (!(cookie instanceof cookie_1.Cookie)) {
          const err = new Error(
            'First argument to setCookie must be a Cookie object or string',
          );
          return options?.ignoreError
            ? promiseCallback.resolve(void 0)
            : promiseCallback.reject(err);
        }
        const now = options?.now || /* @__PURE__ */ new Date();
        if (this.rejectPublicSuffixes && cookie.domain) {
          try {
            const cdomain = cookie.cdomain();
            const suffix =
              typeof cdomain === 'string'
                ? (0, getPublicSuffix_1.getPublicSuffix)(cdomain, {
                    allowSpecialUseDomain: this.allowSpecialUseDomain,
                    ignoreError: options?.ignoreError,
                  })
                : null;
            if (
              suffix == null &&
              !constants_1.IP_V6_REGEX_OBJECT.test(cookie.domain)
            ) {
              const err = new Error('Cookie has domain set to a public suffix');
              return options?.ignoreError
                ? promiseCallback.resolve(void 0)
                : promiseCallback.reject(err);
            }
          } catch (err) {
            return options?.ignoreError
              ? promiseCallback.resolve(void 0)
              : // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                promiseCallback.reject(err);
          }
        }
        if (cookie.domain) {
          if (
            !(0, domainMatch_1.domainMatch)(
              host ?? void 0,
              cookie.cdomain() ?? void 0,
              false,
            )
          ) {
            const err = new Error(
              `Cookie not in this host's domain. Cookie:${cookie.cdomain() ?? 'null'} Request:${host ?? 'null'}`,
            );
            return options?.ignoreError
              ? promiseCallback.resolve(void 0)
              : promiseCallback.reject(err);
          }
          if (cookie.hostOnly == null) {
            cookie.hostOnly = false;
          }
        } else {
          cookie.hostOnly = true;
          cookie.domain = host;
        }
        if (!cookie.path || cookie.path[0] !== '/') {
          cookie.path = (0, defaultPath_1.defaultPath)(context.pathname);
          cookie.pathIsDefault = true;
        }
        if (options?.http === false && cookie.httpOnly) {
          const err = new Error(
            "Cookie is HttpOnly and this isn't an HTTP API",
          );
          return options.ignoreError
            ? promiseCallback.resolve(void 0)
            : promiseCallback.reject(err);
        }
        if (
          cookie.sameSite !== 'none' &&
          cookie.sameSite !== void 0 &&
          sameSiteContext
        ) {
          if (sameSiteContext === 'none') {
            const err = new Error(
              'Cookie is SameSite but this is a cross-origin request',
            );
            return options?.ignoreError
              ? promiseCallback.resolve(void 0)
              : promiseCallback.reject(err);
          }
        }
        const ignoreErrorForPrefixSecurity =
          this.prefixSecurity === constants_1.PrefixSecurityEnum.SILENT;
        const prefixSecurityDisabled =
          this.prefixSecurity === constants_1.PrefixSecurityEnum.DISABLED;
        if (!prefixSecurityDisabled) {
          let errorFound = false;
          let errorMsg;
          if (!isSecurePrefixConditionMet(cookie)) {
            errorFound = true;
            errorMsg =
              'Cookie has __Secure prefix but Secure attribute is not set';
          } else if (!isHostPrefixConditionMet(cookie)) {
            errorFound = true;
            errorMsg =
              "Cookie has __Host prefix but either Secure or HostOnly attribute is not set or Path is not '/'";
          }
          if (errorFound) {
            return options?.ignoreError || ignoreErrorForPrefixSecurity
              ? promiseCallback.resolve(void 0)
              : promiseCallback.reject(new Error(errorMsg));
          }
        }
        const store = this.store;
        if (!store.updateCookie) {
          store.updateCookie = async function (_oldCookie, newCookie, cb2) {
            return this.putCookie(newCookie).then(
              () => cb2?.(null),
              error => cb2?.(error),
            );
          };
        }
        const withCookie = function withCookie2(err, oldCookie) {
          if (err) {
            cb(err);
            return;
          }
          const next = function (err2) {
            if (err2) {
              cb(err2);
            } else if (typeof cookie === 'string') {
              cb(null, void 0);
            } else {
              cb(null, cookie);
            }
          };
          if (oldCookie) {
            if (
              options &&
              'http' in options &&
              options.http === false &&
              oldCookie.httpOnly
            ) {
              err = new Error(
                "old Cookie is HttpOnly and this isn't an HTTP API",
              );
              if (options.ignoreError) cb(null, void 0);
              else cb(err);
              return;
            }
            if (cookie instanceof cookie_1.Cookie) {
              cookie.creation = oldCookie.creation;
              cookie.creationIndex = oldCookie.creationIndex;
              cookie.lastAccessed = now;
              store.updateCookie(oldCookie, cookie, next);
            }
          } else {
            if (cookie instanceof cookie_1.Cookie) {
              cookie.creation = cookie.lastAccessed = now;
              store.putCookie(cookie, next);
            }
          }
        };
        store.findCookie(cookie.domain, cookie.path, cookie.key, withCookie);
        return promiseCallback.promise;
      }
      /**
       * Synchronously attempt to set the {@link Cookie} in the {@link CookieJar}.
       *
       * <strong>Note:</strong> Only works if the configured {@link Store} is also synchronous.
       *
       * @remarks
       * - If successfully persisted, the {@link Cookie} will have updated
       *     {@link Cookie.creation}, {@link Cookie.lastAccessed} and {@link Cookie.hostOnly}
       *     properties.
       *
       * - As per the RFC, the {@link Cookie.hostOnly} flag is set if there was no `Domain={value}`
       *     atttribute on the cookie string. The {@link Cookie.domain} property is set to the
       *     fully-qualified hostname of `currentUrl` in this case. Matching this cookie requires an
       *     exact hostname match (not a {@link domainMatch} as per usual)
       *
       * @param cookie - The cookie object or cookie string to store. A string value will be parsed into a cookie using {@link Cookie.parse}.
       * @param url - The domain to store the cookie with.
       * @param options - Configuration settings to use when storing the cookie.
       * @public
       */
      setCookieSync(cookie, url, options) {
        const setCookieFn = options
          ? this.setCookie.bind(this, cookie, url, options)
          : this.setCookie.bind(this, cookie, url);
        return this.callSync(setCookieFn);
      }
      /**
       * @internal No doc because this is the overload implementation
       */
      getCookies(url, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = defaultGetCookieOptions;
        } else if (options === void 0) {
          options = defaultGetCookieOptions;
        }
        const promiseCallback = (0, utils_1.createPromiseCallback)(callback);
        const cb = promiseCallback.callback;
        let context;
        try {
          if (typeof url === 'string') {
            validators.validate(validators.isNonEmptyString(url), cb, url);
          }
          context = getCookieContext(url);
          validators.validate(
            validators.isObject(options),
            cb,
            (0, utils_1.safeToString)(options),
          );
          validators.validate(typeof cb === 'function', cb);
        } catch (parameterError) {
          return promiseCallback.reject(parameterError);
        }
        const host = (0, canonicalDomain_1.canonicalDomain)(context.hostname);
        const path = context.pathname || '/';
        const secure =
          context.protocol &&
          (context.protocol == 'https:' || context.protocol == 'wss:');
        let sameSiteLevel = 0;
        if (options.sameSiteContext) {
          const sameSiteContext = checkSameSiteContext(options.sameSiteContext);
          if (sameSiteContext == null) {
            return promiseCallback.reject(new Error(SAME_SITE_CONTEXT_VAL_ERR));
          }
          sameSiteLevel = cookie_1.Cookie.sameSiteLevel[sameSiteContext];
          if (!sameSiteLevel) {
            return promiseCallback.reject(new Error(SAME_SITE_CONTEXT_VAL_ERR));
          }
        }
        const http3 = options.http ?? true;
        const now = Date.now();
        const expireCheck = options.expire ?? true;
        const allPaths = options.allPaths ?? false;
        const store = this.store;
        function matchingCookie(c) {
          if (c.hostOnly) {
            if (c.domain != host) {
              return false;
            }
          } else {
            if (
              !(0, domainMatch_1.domainMatch)(
                host ?? void 0,
                c.domain ?? void 0,
                false,
              )
            ) {
              return false;
            }
          }
          if (
            !allPaths &&
            typeof c.path === 'string' &&
            !(0, pathMatch_1.pathMatch)(path, c.path)
          ) {
            return false;
          }
          if (c.secure && !secure) {
            return false;
          }
          if (c.httpOnly && !http3) {
            return false;
          }
          if (sameSiteLevel) {
            let cookieLevel;
            if (c.sameSite === 'lax') {
              cookieLevel = cookie_1.Cookie.sameSiteLevel.lax;
            } else if (c.sameSite === 'strict') {
              cookieLevel = cookie_1.Cookie.sameSiteLevel.strict;
            } else {
              cookieLevel = cookie_1.Cookie.sameSiteLevel.none;
            }
            if (cookieLevel > sameSiteLevel) {
              return false;
            }
          }
          const expiryTime = c.expiryTime();
          if (expireCheck && expiryTime && expiryTime <= now) {
            store.removeCookie(c.domain, c.path, c.key, () => {});
            return false;
          }
          return true;
        }
        store.findCookies(
          host,
          allPaths ? null : path,
          this.allowSpecialUseDomain,
          (err, cookies) => {
            if (err) {
              cb(err);
              return;
            }
            if (cookies == null) {
              cb(null, []);
              return;
            }
            cookies = cookies.filter(matchingCookie);
            if ('sort' in options && options.sort !== false) {
              cookies = cookies.sort(cookieCompare_1.cookieCompare);
            }
            const now2 = /* @__PURE__ */ new Date();
            for (const cookie of cookies) {
              cookie.lastAccessed = now2;
            }
            cb(null, cookies);
          },
        );
        return promiseCallback.promise;
      }
      /**
       * Synchronously retrieve the list of cookies that can be sent in a Cookie header for the
       * current URL.
       *
       * <strong>Note</strong>: Only works if the configured Store is also synchronous.
       *
       * @remarks
       * - The array of cookies returned will be sorted according to {@link cookieCompare}.
       *
       * - The {@link Cookie.lastAccessed} property will be updated on all returned cookies.
       *
       * @param url - The domain to store the cookie with.
       * @param options - Configuration settings to use when retrieving the cookies.
       */
      getCookiesSync(url, options) {
        return this.callSync(this.getCookies.bind(this, url, options)) ?? [];
      }
      /**
       * @internal No doc because this is the overload implementation
       */
      getCookieString(url, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = void 0;
        }
        const promiseCallback = (0, utils_1.createPromiseCallback)(callback);
        const next = function (err, cookies) {
          if (err) {
            promiseCallback.callback(err);
          } else {
            promiseCallback.callback(
              null,
              cookies
                ?.sort(cookieCompare_1.cookieCompare)
                .map(c => c.cookieString())
                .join('; '),
            );
          }
        };
        this.getCookies(url, options, next);
        return promiseCallback.promise;
      }
      /**
       * Synchronous version of `.getCookieString()`. Accepts the same options as `.getCookies()` but returns a string suitable for a
       * `Cookie` header rather than an Array.
       *
       * <strong>Note</strong>: Only works if the configured Store is also synchronous.
       *
       * @param url - The domain to store the cookie with.
       * @param options - Configuration settings to use when retrieving the cookies.
       */
      getCookieStringSync(url, options) {
        return (
          this.callSync(
            options
              ? this.getCookieString.bind(this, url, options)
              : this.getCookieString.bind(this, url),
          ) ?? ''
        );
      }
      /**
       * @internal No doc because this is the overload implementation
       */
      getSetCookieStrings(url, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = void 0;
        }
        const promiseCallback = (0, utils_1.createPromiseCallback)(callback);
        const next = function (err, cookies) {
          if (err) {
            promiseCallback.callback(err);
          } else {
            promiseCallback.callback(
              null,
              cookies?.map(c => {
                return c.toString();
              }),
            );
          }
        };
        this.getCookies(url, options, next);
        return promiseCallback.promise;
      }
      /**
       * Synchronous version of `.getSetCookieStrings()`. Returns an array of strings suitable for `Set-Cookie` headers.
       * Accepts the same options as `.getCookies()`.
       *
       * <strong>Note</strong>: Only works if the configured Store is also synchronous.
       *
       * @param url - The domain to store the cookie with.
       * @param options - Configuration settings to use when retrieving the cookies.
       */
      getSetCookieStringsSync(url, options = {}) {
        return (
          this.callSync(this.getSetCookieStrings.bind(this, url, options)) ?? []
        );
      }
      /**
       * @internal No doc because this is the overload implementation
       */
      serialize(callback) {
        const promiseCallback = (0, utils_1.createPromiseCallback)(callback);
        let type = this.store.constructor.name;
        if (validators.isObject(type)) {
          type = null;
        }
        const serialized = {
          // The version of tough-cookie that serialized this jar. Generally a good
          // practice since future versions can make data import decisions based on
          // known past behavior. When/if this matters, use `semver`.
          version: `tough-cookie@${version_1.version}`,
          // add the store type, to make humans happy:
          storeType: type,
          // CookieJar configuration:
          rejectPublicSuffixes: this.rejectPublicSuffixes,
          enableLooseMode: this.enableLooseMode,
          allowSpecialUseDomain: this.allowSpecialUseDomain,
          prefixSecurity: getNormalizedPrefixSecurity(this.prefixSecurity),
          // this gets filled from getAllCookies:
          cookies: [],
        };
        if (typeof this.store.getAllCookies !== 'function') {
          return promiseCallback.reject(
            new Error(
              'store does not support getAllCookies and cannot be serialized',
            ),
          );
        }
        this.store.getAllCookies((err, cookies) => {
          if (err) {
            promiseCallback.callback(err);
            return;
          }
          if (cookies == null) {
            promiseCallback.callback(null, serialized);
            return;
          }
          serialized.cookies = cookies.map(cookie => {
            const serializedCookie = cookie.toJSON();
            delete serializedCookie.creationIndex;
            return serializedCookie;
          });
          promiseCallback.callback(null, serialized);
        });
        return promiseCallback.promise;
      }
      /**
       * Serialize the CookieJar if the underlying store supports `.getAllCookies`.
       *
       * <strong>Note</strong>: Only works if the configured Store is also synchronous.
       */
      serializeSync() {
        return this.callSync(callback => {
          this.serialize(callback);
        });
      }
      /**
       * Alias of {@link CookieJar.serializeSync}. Allows the cookie to be serialized
       * with `JSON.stringify(cookieJar)`.
       */
      toJSON() {
        return this.serializeSync();
      }
      /**
       * Use the class method CookieJar.deserialize instead of calling this directly
       * @internal
       */
      _importCookies(serialized, callback) {
        let cookies = void 0;
        if (
          serialized &&
          typeof serialized === 'object' &&
          (0, utils_1.inOperator)('cookies', serialized) &&
          Array.isArray(serialized.cookies)
        ) {
          cookies = serialized.cookies;
        }
        if (!cookies) {
          callback(new Error('serialized jar has no cookies array'), void 0);
          return;
        }
        cookies = cookies.slice();
        const putNext = err => {
          if (err) {
            callback(err, void 0);
            return;
          }
          if (Array.isArray(cookies)) {
            if (!cookies.length) {
              callback(err, this);
              return;
            }
            let cookie;
            try {
              cookie = cookie_1.Cookie.fromJSON(cookies.shift());
            } catch (e) {
              callback(e instanceof Error ? e : new Error(), void 0);
              return;
            }
            if (cookie === void 0) {
              putNext(null);
              return;
            }
            this.store.putCookie(cookie, putNext);
          }
        };
        putNext(null);
      }
      /**
       * @internal
       */
      _importCookiesSync(serialized) {
        this.callSync(this._importCookies.bind(this, serialized));
      }
      /**
       * @internal No doc because this is the overload implementation
       */
      clone(newStore, callback) {
        if (typeof newStore === 'function') {
          callback = newStore;
          newStore = void 0;
        }
        const promiseCallback = (0, utils_1.createPromiseCallback)(callback);
        const cb = promiseCallback.callback;
        this.serialize((err, serialized) => {
          if (err) {
            return promiseCallback.reject(err);
          }
          return _CookieJar.deserialize(serialized ?? '', newStore, cb);
        });
        return promiseCallback.promise;
      }
      /**
       * @internal
       */
      _cloneSync(newStore) {
        const cloneFn =
          newStore && typeof newStore !== 'function'
            ? this.clone.bind(this, newStore)
            : this.clone.bind(this);
        return this.callSync(callback => {
          cloneFn(callback);
        });
      }
      /**
       * Produces a deep clone of this CookieJar. Modifications to the original do
       * not affect the clone, and vice versa.
       *
       * <strong>Note</strong>: Only works if both the configured Store and destination
       * Store are synchronous.
       *
       * @remarks
       * - When no {@link Store} is provided, a new {@link MemoryCookieStore} will be used.
       *
       * - Transferring between store types is supported so long as the source
       *     implements `.getAllCookies()` and the destination implements `.putCookie()`.
       *
       * @param newStore - The target {@link Store} to clone cookies into.
       */
      cloneSync(newStore) {
        if (!newStore) {
          return this._cloneSync();
        }
        if (!newStore.synchronous) {
          throw new Error(
            'CookieJar clone destination store is not synchronous; use async API instead.',
          );
        }
        return this._cloneSync(newStore);
      }
      /**
       * @internal No doc because this is the overload implementation
       */
      removeAllCookies(callback) {
        const promiseCallback = (0, utils_1.createPromiseCallback)(callback);
        const cb = promiseCallback.callback;
        const store = this.store;
        if (
          typeof store.removeAllCookies === 'function' &&
          store.removeAllCookies !== store_1.Store.prototype.removeAllCookies
        ) {
          store.removeAllCookies(cb);
          return promiseCallback.promise;
        }
        store.getAllCookies((err, cookies) => {
          if (err) {
            cb(err);
            return;
          }
          if (!cookies) {
            cookies = [];
          }
          if (cookies.length === 0) {
            cb(null, void 0);
            return;
          }
          let completedCount = 0;
          const removeErrors = [];
          const removeCookieCb = function removeCookieCb2(removeErr) {
            if (removeErr) {
              removeErrors.push(removeErr);
            }
            completedCount++;
            if (completedCount === cookies.length) {
              if (removeErrors[0]) cb(removeErrors[0]);
              else cb(null, void 0);
              return;
            }
          };
          cookies.forEach(cookie => {
            store.removeCookie(
              cookie.domain,
              cookie.path,
              cookie.key,
              removeCookieCb,
            );
          });
        });
        return promiseCallback.promise;
      }
      /**
       * Removes all cookies from the CookieJar.
       *
       * <strong>Note</strong>: Only works if the configured Store is also synchronous.
       *
       * @remarks
       * - This is a new backwards-compatible feature of tough-cookie version 2.5,
       *     so not all Stores will implement it efficiently. For Stores that do not
       *     implement `removeAllCookies`, the fallback is to call `removeCookie` after
       *     `getAllCookies`.
       *
       * - If `getAllCookies` fails or isn't implemented in the Store, an error is returned.
       *
       * - If one or more of the `removeCookie` calls fail, only the first error is returned.
       */
      removeAllCookiesSync() {
        this.callSync(callback => {
          this.removeAllCookies(callback);
        });
      }
      /**
       * @internal No doc because this is the overload implementation
       */
      static deserialize(strOrObj, store, callback) {
        if (typeof store === 'function') {
          callback = store;
          store = void 0;
        }
        const promiseCallback = (0, utils_1.createPromiseCallback)(callback);
        let serialized;
        if (typeof strOrObj === 'string') {
          try {
            serialized = JSON.parse(strOrObj);
          } catch (e) {
            return promiseCallback.reject(e instanceof Error ? e : new Error());
          }
        } else {
          serialized = strOrObj;
        }
        const readSerializedProperty = property => {
          return serialized &&
            typeof serialized === 'object' &&
            (0, utils_1.inOperator)(property, serialized)
            ? serialized[property]
            : void 0;
        };
        const readSerializedBoolean = property => {
          const value = readSerializedProperty(property);
          return typeof value === 'boolean' ? value : void 0;
        };
        const readSerializedString = property => {
          const value = readSerializedProperty(property);
          return typeof value === 'string' ? value : void 0;
        };
        const jar = new _CookieJar(store, {
          rejectPublicSuffixes: readSerializedBoolean('rejectPublicSuffixes'),
          looseMode: readSerializedBoolean('enableLooseMode'),
          allowSpecialUseDomain: readSerializedBoolean('allowSpecialUseDomain'),
          prefixSecurity: getNormalizedPrefixSecurity(
            readSerializedString('prefixSecurity') ?? 'silent',
          ),
        });
        jar._importCookies(serialized, err => {
          if (err) {
            promiseCallback.callback(err);
            return;
          }
          promiseCallback.callback(null, jar);
        });
        return promiseCallback.promise;
      }
      /**
       * A new CookieJar is created and the serialized {@link Cookie} values are added to
       * the underlying store. Each {@link Cookie} is added via `store.putCookie(...)` in
       * the order in which they appear in the serialization.
       *
       * <strong>Note</strong>: Only works if the configured Store is also synchronous.
       *
       * @remarks
       * - When no {@link Store} is provided, a new {@link MemoryCookieStore} will be used.
       *
       * - As a convenience, if `strOrObj` is a string, it is passed through `JSON.parse` first.
       *
       * @param strOrObj - A JSON string or object representing the deserialized cookies.
       * @param store - The underlying store to persist the deserialized cookies into.
       */
      static deserializeSync(strOrObj, store) {
        const serialized =
          typeof strOrObj === 'string' ? JSON.parse(strOrObj) : strOrObj;
        const readSerializedProperty = property => {
          return serialized &&
            typeof serialized === 'object' &&
            (0, utils_1.inOperator)(property, serialized)
            ? serialized[property]
            : void 0;
        };
        const readSerializedBoolean = property => {
          const value = readSerializedProperty(property);
          return typeof value === 'boolean' ? value : void 0;
        };
        const readSerializedString = property => {
          const value = readSerializedProperty(property);
          return typeof value === 'string' ? value : void 0;
        };
        const jar = new _CookieJar(store, {
          rejectPublicSuffixes: readSerializedBoolean('rejectPublicSuffixes'),
          looseMode: readSerializedBoolean('enableLooseMode'),
          allowSpecialUseDomain: readSerializedBoolean('allowSpecialUseDomain'),
          prefixSecurity: getNormalizedPrefixSecurity(
            readSerializedString('prefixSecurity') ?? 'silent',
          ),
        });
        if (!jar.store.synchronous) {
          throw new Error(
            'CookieJar store is not synchronous; use async API instead.',
          );
        }
        jar._importCookiesSync(serialized);
        return jar;
      }
      /**
       * Alias of {@link CookieJar.deserializeSync}.
       *
       * @remarks
       * - When no {@link Store} is provided, a new {@link MemoryCookieStore} will be used.
       *
       * - As a convenience, if `strOrObj` is a string, it is passed through `JSON.parse` first.
       *
       * @param jsonString - A JSON string or object representing the deserialized cookies.
       * @param store - The underlying store to persist the deserialized cookies into.
       */
      static fromJSON(jsonString, store) {
        return _CookieJar.deserializeSync(jsonString, store);
      }
    };
    exports2.CookieJar = CookieJar;
  },
});

// node_modules/tough-cookie/dist/cookie/permutePath.js
var require_permutePath = __commonJS({
  'node_modules/tough-cookie/dist/cookie/permutePath.js'(exports2) {
    'use strict';
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.permutePath = permutePath;
    function permutePath(path) {
      if (path === '/') {
        return ['/'];
      }
      const permutations = [path];
      while (path.length > 1) {
        const lindex = path.lastIndexOf('/');
        if (lindex === 0) {
          break;
        }
        path = path.slice(0, lindex);
        permutations.push(path);
      }
      permutations.push('/');
      return permutations;
    }
  },
});

// node_modules/tough-cookie/dist/cookie/index.js
var require_cookie2 = __commonJS({
  'node_modules/tough-cookie/dist/cookie/index.js'(exports2) {
    'use strict';
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.permutePath =
      exports2.parseDate =
      exports2.formatDate =
      exports2.domainMatch =
      exports2.defaultPath =
      exports2.CookieJar =
      exports2.cookieCompare =
      exports2.Cookie =
      exports2.PrefixSecurityEnum =
      exports2.canonicalDomain =
      exports2.version =
      exports2.ParameterError =
      exports2.Store =
      exports2.getPublicSuffix =
      exports2.permuteDomain =
      exports2.pathMatch =
      exports2.MemoryCookieStore =
        void 0;
    exports2.parse = parse;
    exports2.fromJSON = fromJSON;
    var memstore_1 = require_memstore();
    Object.defineProperty(exports2, 'MemoryCookieStore', {
      enumerable: true,
      get: function () {
        return memstore_1.MemoryCookieStore;
      },
    });
    var pathMatch_1 = require_pathMatch();
    Object.defineProperty(exports2, 'pathMatch', {
      enumerable: true,
      get: function () {
        return pathMatch_1.pathMatch;
      },
    });
    var permuteDomain_1 = require_permuteDomain();
    Object.defineProperty(exports2, 'permuteDomain', {
      enumerable: true,
      get: function () {
        return permuteDomain_1.permuteDomain;
      },
    });
    var getPublicSuffix_1 = require_getPublicSuffix();
    Object.defineProperty(exports2, 'getPublicSuffix', {
      enumerable: true,
      get: function () {
        return getPublicSuffix_1.getPublicSuffix;
      },
    });
    var store_1 = require_store();
    Object.defineProperty(exports2, 'Store', {
      enumerable: true,
      get: function () {
        return store_1.Store;
      },
    });
    var validators_1 = require_validators();
    Object.defineProperty(exports2, 'ParameterError', {
      enumerable: true,
      get: function () {
        return validators_1.ParameterError;
      },
    });
    var version_1 = require_version();
    Object.defineProperty(exports2, 'version', {
      enumerable: true,
      get: function () {
        return version_1.version;
      },
    });
    var canonicalDomain_1 = require_canonicalDomain();
    Object.defineProperty(exports2, 'canonicalDomain', {
      enumerable: true,
      get: function () {
        return canonicalDomain_1.canonicalDomain;
      },
    });
    var constants_1 = require_constants();
    Object.defineProperty(exports2, 'PrefixSecurityEnum', {
      enumerable: true,
      get: function () {
        return constants_1.PrefixSecurityEnum;
      },
    });
    var cookie_1 = require_cookie();
    Object.defineProperty(exports2, 'Cookie', {
      enumerable: true,
      get: function () {
        return cookie_1.Cookie;
      },
    });
    var cookieCompare_1 = require_cookieCompare();
    Object.defineProperty(exports2, 'cookieCompare', {
      enumerable: true,
      get: function () {
        return cookieCompare_1.cookieCompare;
      },
    });
    var cookieJar_1 = require_cookieJar();
    Object.defineProperty(exports2, 'CookieJar', {
      enumerable: true,
      get: function () {
        return cookieJar_1.CookieJar;
      },
    });
    var defaultPath_1 = require_defaultPath();
    Object.defineProperty(exports2, 'defaultPath', {
      enumerable: true,
      get: function () {
        return defaultPath_1.defaultPath;
      },
    });
    var domainMatch_1 = require_domainMatch();
    Object.defineProperty(exports2, 'domainMatch', {
      enumerable: true,
      get: function () {
        return domainMatch_1.domainMatch;
      },
    });
    var formatDate_1 = require_formatDate();
    Object.defineProperty(exports2, 'formatDate', {
      enumerable: true,
      get: function () {
        return formatDate_1.formatDate;
      },
    });
    var parseDate_1 = require_parseDate();
    Object.defineProperty(exports2, 'parseDate', {
      enumerable: true,
      get: function () {
        return parseDate_1.parseDate;
      },
    });
    var permutePath_1 = require_permutePath();
    Object.defineProperty(exports2, 'permutePath', {
      enumerable: true,
      get: function () {
        return permutePath_1.permutePath;
      },
    });
    var cookie_2 = require_cookie();
    function parse(str, options) {
      return cookie_2.Cookie.parse(str, options);
    }
    function fromJSON(str) {
      return cookie_2.Cookie.fromJSON(str);
    }
  },
});

// node_modules/tough-cookie-file-store/dist/formats/cookies-json.js
function parseCookiesJson(data, options) {
  if (!data) {
    return {};
  }
  let dataJson = null;
  try {
    dataJson = JSON.parse(data);
  } catch (_a) {
    const filePathStr = (
      options === null || options === void 0 ? void 0 : options.filePath
    )
      ? ` ${options.filePath}`
      : '';
    throw new Error(
      `Could not parse cookie file${filePathStr}. Please ensure it is not corrupted.`,
    );
  }
  return parseCookiesJsonObject(dataJson);
}
function parseCookiesJsonObject(data) {
  if (!data || typeof data !== 'object' || data instanceof Array) {
    throw new Error('Invalid cookies file');
  }
  for (const d of Object.keys(data)) {
    const dVal = data[d];
    for (const p of Object.keys(dVal)) {
      const pVal = dVal[p];
      for (const k of Object.keys(pVal)) {
        const valJson = JSON.stringify(pVal[k]);
        const cookie = tough.Cookie.fromJSON(valJson);
        if (cookie) {
          pVal[k] = cookie;
        } else if (valJson) {
          console.warn(`Failed to parse cookie object ${valJson}`);
        }
      }
    }
  }
  return data;
}
function stringifyCookiesJson(cookies) {
  return JSON.stringify(cookies);
}
var tough;
var init_cookies_json = __esm({
  'node_modules/tough-cookie-file-store/dist/formats/cookies-json.js'() {
    tough = __toESM(require_cookie2(), 1);
  },
});

// node_modules/tough-cookie-file-store/dist/formats/netscape-cookies-txt.js
function* parseNetscapeCookiesTxtLineByLine(data, options) {
  var _a, _b;
  if (!data) {
    return;
  }
  const lines = data.split(/\r\n|\n/);
  const magic = lines[0];
  if (
    (!magic || !/^#(?: Netscape)? HTTP Cookie File/.test(magic)) &&
    !(options === null || options === void 0 ? void 0 : options.forceParse)
  ) {
    throw new Error(
      `${(options === null || options === void 0 ? void 0 : options.filePath) || 'File'} does not look like a netscape cookies file`,
    );
  }
  const httpOnlyExtension =
    (_a =
      options === null || options === void 0
        ? void 0
        : options.httpOnlyExtension) !== null && _a !== void 0
      ? _a
      : true;
  let lineNum = 0;
  for (let line of lines) {
    lineNum++;
    if (AllWhitespaceRegex.test(line)) {
      continue;
    }
    const httpOnly = line.startsWith(HttpOnlyPrefix);
    if (CommentRegex.test(line) && (!httpOnly || !httpOnlyExtension)) {
      continue;
    }
    if (httpOnly) {
      line = line.substring(HttpOnlyPrefix.length);
    }
    const parsed = line.split(/\t/);
    if (parsed.length !== 7) {
      if (
        !(options === null || options === void 0 ? void 0 : options.forceParse)
      ) {
        const filePathDescr = (
          options === null || options === void 0 ? void 0 : options.filePath
        )
          ? ` in cookies file ${options.filePath}`
          : '';
        throw new Error(`Line ${lineNum} is not valid${filePathDescr}`);
      } else {
        (_b = options.onLineError) === null || _b === void 0
          ? void 0
          : _b.call(options, line, lineNum);
        continue;
      }
    }
    const domain = parsed[0];
    const canDomain = tough2.canonicalDomain(domain);
    if (!canDomain) {
      console.warn(`Empty canonical domain for ${domain}`);
      continue;
    }
    const expireSeconds = parseInt(parsed[4]);
    const cookie = new tough2.Cookie({
      httpOnly,
      domain: canDomain,
      hostOnly: !LeadingDotRegex.test(domain),
      path: parsed[2],
      secure: parsed[3].toUpperCase() === 'TRUE',
      expires: expireSeconds ? new Date(expireSeconds * 1e3) : 'Infinity',
      key: decodeURIComponent(parsed[5]),
      value: decodeURIComponent(parsed[6]),
    });
    yield cookie;
  }
}
function parseNetscapeCookiesTxtToIndex(data, options) {
  const cookies = {};
  for (const cookie of parseNetscapeCookiesTxtLineByLine(data, options)) {
    if (cookie.domain && cookie.path && cookie.key) {
      let domainVal = cookies[cookie.domain];
      if (!domainVal) {
        domainVal = {};
        cookies[cookie.domain] = domainVal;
      }
      let pathVal = domainVal[cookie.path];
      if (!pathVal) {
        pathVal = {};
        domainVal[cookie.path] = pathVal;
      }
      pathVal[cookie.key] = cookie;
    }
  }
  return cookies;
}
function stringifyNetscapeCookiesTxt(cookies, options) {
  const lines = [
    '# Netscape HTTP Cookie File\n',
    '# http://www.netscape.com/newsref/std/cookie_spec.html\n',
    '# This is a generated file!  Do not edit.\n\n',
  ];
  for (const domain of Object.keys(cookies)) {
    const domainVal = cookies[domain];
    for (const path of Object.keys(domainVal)) {
      const pathVal = domainVal[path];
      for (const key of Object.keys(pathVal)) {
        const cookie = pathVal[key];
        if (cookie) {
          lines.push(stringifyNetscapeCookiesTxtLine(cookie, options) + '\n');
        }
      }
    }
  }
  return lines.join('');
}
function stringifyNetscapeCookiesTxtLine(cookie, options) {
  let cookieDomain = cookie.domain;
  if (!cookie.hostOnly) {
    cookieDomain = '.' + cookieDomain;
  }
  return [
    // domain
    (options === null || options === void 0
      ? void 0
      : options.httpOnlyExtension) && cookie.httpOnly
      ? `${HttpOnlyPrefix}${cookieDomain}`
      : cookieDomain,
    // flag
    cookieDomain && LeadingDotRegex.test(cookieDomain) ? 'TRUE' : 'FALSE',
    // hostOnly is legacy and should be determined from the domain
    // path
    cookie.path,
    // secure
    cookie.secure ? 'TRUE' : 'FALSE',
    // expires
    cookie.expires && cookie.expires !== 'Infinity'
      ? Math.round(cookie.expires.getTime() / 1e3)
      : 0,
    // key
    encodeURIComponent(cookie.key),
    // value
    encodeURIComponent(cookie.value),
  ].join('	');
}
var tough2, HttpOnlyPrefix, AllWhitespaceRegex, CommentRegex, LeadingDotRegex;
var init_netscape_cookies_txt = __esm({
  'node_modules/tough-cookie-file-store/dist/formats/netscape-cookies-txt.js'() {
    tough2 = __toESM(require_cookie2(), 1);
    HttpOnlyPrefix = '#HttpOnly_';
    AllWhitespaceRegex = /^\s*$/;
    CommentRegex = /^\s*#/;
    LeadingDotRegex = /^\./;
  },
});

// node_modules/tough-cookie-file-store/dist/cookie-file-store.js
var cookie_file_store_exports = {};
__export(cookie_file_store_exports, {
  DefaultFileFormat: () => DefaultFileFormat,
  FileFormat: () => FileFormat,
  default: () => cookie_file_store_default,
});
var tough3,
  fs,
  util,
  FileFormat,
  DefaultFileFormat,
  FileCookieStore,
  cookie_file_store_default;
var init_cookie_file_store = __esm({
  'node_modules/tough-cookie-file-store/dist/cookie-file-store.js'() {
    tough3 = __toESM(require_cookie2(), 1);
    fs = __toESM(require('fs'), 1);
    util = __toESM(require('util'), 1);
    init_cookies_json();
    init_netscape_cookies_txt();
    (function (FileFormat2) {
      FileFormat2['json'] = 'json';
      FileFormat2['txt'] = 'txt';
    })(FileFormat || (FileFormat = {}));
    DefaultFileFormat = FileFormat.json;
    FileCookieStore = class extends tough3.Store {
      /**
       * Creates a new JSON file store in the specified file.
       *
       * @param {string} filePath - The file in which the store will be created.
       * @param {object} options - Options for initializing the store.
       * @param {boolean} options.async - Whether to write the file asynchronously.
       * @param {boolean} options.loadAsync - Whether to read the file asynchronously.
       * @param {FileFormat} options.fileFormat - The format of the file. If not specified, the format will be auto-detected. If not specified and the file doesn't exist, the format will default to txt.
       * @param {boolean} options.forceParse - Continue parse file and don't throw exception if a bad line was found. This only applies to the txt format.
       * @param {boolean} options.httpOnlyExtension - Detect the #HttpOnly_ prefix for http only cookies. Defaults to true.
       * @param {Function} options.onLoad - Called when the file successfuly loads asynchronously. Unused if `loadAsync` is false.
       * @param {Function} options.onLoadError - Optional callback for any async file-load error. Unused if `loadAsync` is false.
       */
      constructor(filePath, options) {
        var _a, _b;
        super();
        this.idx = {};
        this.synchronous = !(options === null || options === void 0
          ? void 0
          : options.async);
        this.filePath = filePath;
        this.fileFormat =
          (options === null || options === void 0
            ? void 0
            : options.fileFormat) || void 0;
        this.idx = {};
        this.httpOnlyExtension =
          (_a =
            options === null || options === void 0
              ? void 0
              : options.httpOnlyExtension) !== null && _a !== void 0
            ? _a
            : true;
        if (util.inspect.custom) {
          this[util.inspect.custom] = this._inspect;
        }
        if (!filePath) {
          throw new Error('Unknown file for read/write cookies');
        }
        const loadOptions = {
          forceParse:
            (_b =
              options === null || options === void 0
                ? void 0
                : options.forceParse) !== null && _b !== void 0
              ? _b
              : false,
          onLineError:
            options === null || options === void 0
              ? void 0
              : options.onLoadLineError,
        };
        if (
          options === null || options === void 0 ? void 0 : options.loadAsync
        ) {
          const promise = this._loadFromFileAsync(this.filePath, loadOptions);
          this._readPromise = promise;
          promise
            .then(
              exists => {
                var _a2;
                delete this._readPromise;
                (_a2 =
                  options === null || options === void 0
                    ? void 0
                    : options.onLoad) === null || _a2 === void 0
                  ? void 0
                  : _a2.call(options, exists);
              },
              error => {
                delete this._readPromise;
                if (
                  options === null || options === void 0
                    ? void 0
                    : options.onLoadError
                ) {
                  options.onLoadError(error);
                } else {
                  console.error(error);
                }
              },
            )
            .catch(
              // istanbul ignore next
              error => {
                console.error(error);
              },
            );
        } else {
          this._loadFromFileSync(this.filePath, loadOptions);
        }
      }
      /**
       * Waits for the initial load to finish if unfinished, and then performs the given synchronous read action.
       * Afterwards, the callback will be called with an error or a result. If no callback is passed, a promise
       * will be returned instead.
       * @param {Function} action - The synchronous read action to execute
       * @param {Function} cb - The callback to call with the error or result
       * @returns {Promise} a promise if no callback was passed.
       */
      _doSyncReadAsAsync(action, cb) {
        if (this._readPromise) {
          const promise = this._readPromise;
          if (typeof cb === 'function') {
            const continueFunc = () => {
              try {
                let result;
                try {
                  result = action();
                } catch (error) {
                  cb(error, void 0);
                  return;
                }
                cb(null, result);
              } catch (error) {
                console.error(error);
              }
            };
            promise.then(continueFunc, continueFunc);
          } else {
            const continueFunc = () => action();
            return promise.then(continueFunc, continueFunc);
          }
        } else {
          if (typeof cb === 'function') {
            let result;
            try {
              result = action();
            } catch (error) {
              cb(error, void 0);
              return;
            }
            cb(null, result);
          } else {
            return (async () => action())();
          }
        }
      }
      /**
       * Waits for the initial load to finish if unfinished, and then performs the given synchronous write action.
       * Afterwards, if the store has changed, then changes to the store will be saved to its file, and then
       * the callback will be called with an error if any, or `null` if no error. If no callback is passed, a
       * promise will be returned instead.
       * @param {Function} action - The synchronous write action to execute. This should return a boolean indicating whether the store has changed.
       * @param {Function} cb - The callback to call with the error or result
       * @returns {Promise} a promise if no callback was passed.
       */
      _doSyncWriteAsAsync(action, cb) {
        if (this._readPromise) {
          const promise = this._readPromise;
          if (typeof cb === 'function') {
            const continueFunc = () => {
              let done = false;
              try {
                if (action()) {
                  this._saveAsync(error => {
                    if (!done) {
                      done = true;
                      cb(error);
                    } else {
                      console.error(error);
                    }
                  });
                } else {
                  done = true;
                  cb(null);
                }
              } catch (error) {
                if (!done) {
                  done = true;
                  cb(error);
                } else {
                  console.error(error);
                }
              }
            };
            promise.then(continueFunc, continueFunc);
          } else {
            const continueFunc = () => {
              if (action()) {
                return this._saveAsync();
              }
            };
            return promise.then(continueFunc, continueFunc);
          }
        } else {
          let changed;
          try {
            changed = action();
          } catch (error) {
            if (typeof cb === 'function') {
              cb(error);
              return;
            } else {
              return Promise.reject(error);
            }
          }
          if (changed) {
            return this._saveAsync(cb);
          } else {
            if (typeof cb === 'function') {
              cb(null);
            } else {
              return Promise.resolve();
            }
          }
        }
      }
      /** @inheritdoc */
      findCookie(domain, path, key, cb) {
        if (this.synchronous) {
          if (typeof cb === 'function') {
            let cookie;
            try {
              cookie = this._findCookieSync(domain, path, key);
            } catch (error) {
              cb(error, void 0);
              return;
            }
            cb(null, cookie);
          } else {
            return (async () => this._findCookieSync(domain, path, key))();
          }
        } else {
          return this._findCookieAsync(domain, path, key, cb);
        }
      }
      /**
       * Searches for a cookie after waiting for the initial read to finish.
       * @see _doSyncReadAsAsync
       * @param {string} domain - The cookie domain.
       * @param {string} path - The cookie path.
       * @param {string} key - The cookie key.
       * @param {Function} cb - The callback that will be called with the result.
       * @returns {Promise<tough.Cookie>} a promise if no callback was passed.
       */
      _findCookieAsync(domain, path, key, cb) {
        return this._doSyncReadAsAsync(
          () => this._findCookieSync(domain, path, key),
          cb,
        );
      }
      /**
       * Searches for a cookie and returns it or null.
       * @param {string} domain - The cookie domain.
       * @param {string} path - The cookie path.
       * @param {string} key - The cookie key.
       * @returns {Cookie} the matching cookie if found.
       */
      _findCookieSync(domain, path, key) {
        var _a, _b;
        if (domain == null || path == null || key == null) {
          return void 0;
        }
        return (_b =
          (_a = this.idx[domain]) === null || _a === void 0
            ? void 0
            : _a[path]) === null || _b === void 0
          ? void 0
          : _b[key];
      }
      /** @inheritdoc */
      findCookies(domain, path, allowSpecialUseDomain, cb) {
        if (typeof allowSpecialUseDomain === 'function') {
          cb = allowSpecialUseDomain;
          allowSpecialUseDomain = void 0;
        }
        allowSpecialUseDomain !== null && allowSpecialUseDomain !== void 0
          ? allowSpecialUseDomain
          : (allowSpecialUseDomain = false);
        if (this.synchronous) {
          if (typeof cb === 'function') {
            let cookies;
            try {
              cookies = this._findCookiesSync(
                domain,
                path,
                allowSpecialUseDomain,
              );
            } catch (error) {
              cb(error, void 0);
              return;
            }
            cb(null, cookies);
          } else {
            return (async () =>
              this._findCookiesSync(domain, path, allowSpecialUseDomain))();
          }
        } else {
          return this._findCookiesAsync(
            domain,
            path,
            allowSpecialUseDomain,
            cb,
          );
        }
      }
      /**
       * Searches for cookies after waiting for the initial read to finish
       * @see _doSyncReadAsAsync
       * @param {string} domain - The cookies domain.
       * @param {string} path - The cookies path.
       * @param {boolean} allowSpecialUseDomain - If `true` then special-use domain suffixes will be allowed in matches. Defaults to `false`.
       * @param {Function} cb - The callback that will be called with the result.
       * @returns {Promise<tough.Cookie[]>} a promise if no callback was passed.
       */
      _findCookiesAsync(domain, path, allowSpecialUseDomain, cb) {
        return this._doSyncReadAsAsync(
          () => this._findCookiesSync(domain, path, allowSpecialUseDomain),
          cb,
        );
      }
      /**
       * Searches for matching cookies and returns them.
       * @param {string} domain - The cookies domain.
       * @param {string} path - The cookies path.
       * @param {boolean} allowSpecialUseDomain - If `true` then special-use domain suffixes will be allowed in matches. Defaults to `false`.
       * @returns {Cookie[]} the matching cookies if any were found.
       */
      _findCookiesSync(domain, path, allowSpecialUseDomain) {
        const results = [];
        if (!domain) {
          return results;
        }
        let pathMatcher;
        if (!path) {
          pathMatcher = function matchAll(domainIndex) {
            for (const curPath of Object.keys(domainIndex)) {
              const pathIndex = domainIndex[curPath];
              for (const key of Object.keys(pathIndex)) {
                results.push(pathIndex[key]);
              }
            }
          };
        } else {
          pathMatcher = function matchRFC(domainIndex) {
            for (const cookiePath of Object.keys(domainIndex)) {
              if (tough3.pathMatch(path, cookiePath)) {
                const pathIndex = domainIndex[cookiePath];
                for (const key of Object.keys(pathIndex)) {
                  results.push(pathIndex[key]);
                }
              }
            }
          };
        }
        const domains = tough3.permuteDomain(domain, allowSpecialUseDomain) || [
          domain,
        ];
        const idx = this.idx;
        for (const curDomain of domains) {
          const domainIndex = idx[curDomain];
          if (!domainIndex) {
            continue;
          }
          pathMatcher(domainIndex);
        }
        return results;
      }
      /** @inheritdoc */
      putCookie(cookie, cb) {
        if (this.synchronous) {
          if (typeof cb === 'function') {
            try {
              this._putCookieSync(cookie);
            } catch (error) {
              cb(error);
              return;
            }
            cb(null);
          } else {
            return (async () => this._putCookieSync(cookie))();
          }
        } else {
          return this._putCookieAsync(cookie, cb);
        }
      }
      /**
       * Puts a cookie in the store after waiting for the initial read to finish, then saves the store to its file.
       * @see _doSyncReadAsAsync
       * @param {Cookie} cookie - The cookie to add to the store.
       * @param {Function} cb - The callback to be called when finished.
       * @returns {Promise} a promise if no callback was passed.
       */
      _putCookieAsync(cookie, cb) {
        return this._doSyncWriteAsAsync(() => {
          return this._putCookieSyncInternal(cookie);
        }, cb);
      }
      /**
       * Puts a cookie in the store without saving to a file.
       * @param {Cookie} cookie - The cookie to add to the store.
       * @returns {boolean} true if the store was changed, or false if the store was not changed.
       */
      _putCookieSyncInternal(cookie) {
        const { domain, path, key } = cookie;
        const canDomain = tough3.canonicalDomain(domain);
        if (canDomain == null || path == null || key == null) {
          return false;
        }
        let domainVal = this.idx[canDomain];
        if (!domainVal) {
          domainVal = {};
          this.idx[canDomain] = domainVal;
        }
        let pathVal = domainVal[path];
        if (!pathVal) {
          pathVal = {};
          domainVal[path] = pathVal;
        }
        pathVal[key] = cookie;
        return true;
      }
      /**
       * Puts a cookie in the store, then saves synchronously.
       * @param {Cookie} cookie - The cookie to add to the store.
       */
      _putCookieSync(cookie) {
        if (this._putCookieSyncInternal(cookie)) {
          this._saveSync();
        }
      }
      /** @inheritdoc */
      updateCookie(oldCookie, newCookie, cb) {
        if (cb) {
          return this.putCookie(newCookie, cb);
        } else {
          return this.putCookie(newCookie);
        }
      }
      /** @inheritdoc */
      removeCookie(domain, path, key, cb) {
        if (this.synchronous) {
          if (typeof cb === 'function') {
            try {
              this._removeCookieSync(domain, path, key);
            } catch (error) {
              cb(error);
              return;
            }
            cb(null);
          } else {
            return (async () => this._removeCookieSync(domain, path, key))();
          }
        } else {
          return this._removeCookieAsync(domain, path, key, cb);
        }
      }
      /**
       * Removes a cookie from the store after waiting for the initial read to finish, then saves the store to its file if removed.
       * @see _doSyncReadAsAsync
       * @param {string} domain - The domain of the cookie to remove.
       * @param {string} path - The path of the cookie to remove.
       * @param {string} key - The key of the cookie to remove.
       * @param {Function} cb - The callback to be called when finished.
       * @returns {Promise} a promise if no callback was passed.
       */
      _removeCookieAsync(domain, path, key, cb) {
        return this._doSyncWriteAsAsync(() => {
          return this._removeCookieSyncInternal(domain, path, key);
        }, cb);
      }
      /**
       * Removes a cookie from the store without saving to a file.
       * @param {string} domain - The domain of the cookie to remove.
       * @param {string} path - The path of the cookie to remove.
       * @param {string} key - The key of the cookie to remove.
       * @returns {boolean} true if a cookie was removed, or false if no change occured.
       */
      _removeCookieSyncInternal(domain, path, key) {
        const domainVal = this.idx[domain];
        if (!domainVal) {
          return false;
        }
        const pathVal = domainVal[path];
        if (!pathVal) {
          return false;
        }
        const deleted = delete pathVal[key];
        if (deleted && Object.keys(pathVal).length === 0) {
          delete domainVal[path];
          if (Object.keys(domainVal).length === 0) {
            delete this.idx[domain];
          }
        }
        return deleted;
      }
      /**
       * Removes a cookie from the store, then saves synchronously if removed.
       * @param {string} domain - The domain of the cookie to remove.
       * @param {string} path - The path of the cookie to remove.
       * @param {string} key - The key of the cookie to remove.
       */
      _removeCookieSync(domain, path, key) {
        if (this._removeCookieSyncInternal(domain, path, key)) {
          this._saveSync();
        }
      }
      /** @inheritdoc */
      removeCookies(domain, path, cb) {
        if (this.synchronous) {
          if (typeof cb === 'function') {
            try {
              this._removeCookiesSync(domain, path);
            } catch (error) {
              cb(error);
              return;
            }
            cb(null);
          } else {
            return (async () => this._removeCookiesSync(domain, path))();
          }
        } else {
          return this._removeCookiesAsync(domain, path, cb);
        }
      }
      /**
       * Removes cookies from the store after waiting for the initial read to finish, then saves the store to its file if any were removed.
       * @see _doSyncReadAsAsync
       * @param {string} domain - The domain of the cookies to remove.
       * @param {string} path - The path of the cookies to remove.
       * @param {Function} cb - The callback to be called when finished.
       * @returns {Promise} a promise if no callback was passed.
       */
      _removeCookiesAsync(domain, path, cb) {
        return this._doSyncWriteAsAsync(() => {
          return this._removeCookiesSyncInternal(domain, path);
        }, cb);
      }
      /**
       * Removes cookies from the store without saving to a file.
       * @param {string} domain - The domain of the cookies to remove.
       * @param {string} path - The path of the cookies to remove.
       * @returns {boolean} true if any cookies were removed, or false if no change occured
       */
      _removeCookiesSyncInternal(domain, path) {
        if (path != null) {
          const domainVal = this.idx[domain];
          if (domainVal) {
            const deleted = delete domainVal[path];
            if (deleted && Object.keys(domainVal).length === 0) {
              delete this.idx[domain];
            }
            return deleted;
          }
          return false;
        } else {
          const deleted = delete this.idx[domain];
          return deleted;
        }
      }
      /**
       * Removes cookies from the store, then saves synchronously if any were removed.
       * @param {string} domain - The domain of the cookies to remove.
       * @param {string} path - The path of the cookies to remove.
       */
      _removeCookiesSync(domain, path) {
        if (this._removeCookiesSyncInternal(domain, path)) {
          this._saveSync();
        }
      }
      /** @inheritdoc */
      removeAllCookies(cb) {
        if (this.synchronous) {
          if (typeof cb === 'function') {
            try {
              this._removeAllCookiesSync();
            } catch (error) {
              cb(error);
              return;
            }
            cb(null);
          } else {
            return (async () => this._removeAllCookiesSync())();
          }
        } else {
          return this._removeAllCookiesAsync(cb);
        }
      }
      /**
       * Removes all cookies after waiting for the initial read to finish, then saves the store to its file if any were removed.
       * @param {Function} cb - The callback to be called when finished.
       * @returns {Promise} a promise if no callback was passed.
       */
      _removeAllCookiesAsync(cb) {
        return this._doSyncWriteAsAsync(() => {
          return this._removeAllCookiesSyncInternal();
        }, cb);
      }
      /**
       * Removes all cookies from the store without saving to a file.
       * @returns {boolean} true if any cookies were removed, or false if no change occured
       */
      _removeAllCookiesSyncInternal() {
        if (Object.keys(this.idx).length === 0) {
          return false;
        }
        this.idx = {};
        return true;
      }
      /**
       * Removes all cookies from the store, then saves synchronously if any were removed.
       */
      _removeAllCookiesSync() {
        if (this._removeAllCookiesSyncInternal()) {
          this._saveSync();
        }
      }
      /** @inheritdoc */
      getAllCookies(cb) {
        if (this.synchronous) {
          if (typeof cb === 'function') {
            let cookies;
            try {
              cookies = this._getAllCookiesSync();
            } catch (error) {
              cb(error, void 0);
              return;
            }
            cb(null, cookies);
          } else {
            return (async () => this._getAllCookiesSync())();
          }
        } else {
          return this._getAllCookiesAsync(cb);
        }
      }
      /**
       * Gets all the cookies after waiting for the initial read to finish.
       * @param {Function} cb - The callback to be called with the results.
       * @returns {Promise<tough.Cookie[]>} a promise if no callback was passed.
       */
      _getAllCookiesAsync(cb) {
        return this._doSyncReadAsAsync(() => this._getAllCookiesSync(), cb);
      }
      /**
       * Gets all the cookies in the store and returns them.
       * @returns {Cookie[]} an array of all the cookies in the store.
       */
      _getAllCookiesSync() {
        const cookies = [];
        for (const domain of Object.keys(this.idx)) {
          const domainVal = this.idx[domain];
          for (const p of Object.keys(domainVal)) {
            const pVal = domainVal[p];
            for (const key of Object.keys(pVal)) {
              const cookie = pVal[key];
              if (key != null) {
                cookies.push(cookie);
              }
            }
          }
        }
        cookies.sort((a, b) => {
          return (a.creationIndex || 0) - (b.creationIndex || 0);
        });
        return cookies;
      }
      /**
       * Returns a string representation of the store object for debugging purposes.
       *
       * @returns {string} - The string representation of the store.
       */
      _inspect() {
        return `{ idx: ${util.inspect(this.idx, false, 2)} }`;
      }
      /**
       * Load the store from a file asynchronously.
       *
       * @param {string} filePath - The file to load the store from.
       * @param {object} options - Options for loading the file
       * @returns {Promise<CookiesIndex>} a promise that resolves with the parsed data from the file.
       */
      async _loadFromFileAsync(filePath, options) {
        try {
          await fs.promises.access(filePath, fs.constants.F_OK);
        } catch (_a) {
          if (!this.fileFormat) {
            this.fileFormat = DefaultFileFormat;
          }
          return false;
        }
        const data = await fs.promises.readFile(filePath, 'utf8');
        return this._loadFromStringSync(data, filePath, options);
      }
      /**
       * Load the store from a file synchronously.
       *
       * @param {string} filePath - The file to load the store from.
       * @param {object} options - Options for loading the file
       * @returns {CookiesIndex} the parsed data from the file
       */
      _loadFromFileSync(filePath, options) {
        if (!fs.existsSync(this.filePath)) {
          if (!this.fileFormat) {
            this.fileFormat = DefaultFileFormat;
          }
          return false;
        }
        const data = fs.readFileSync(filePath, 'utf8');
        return this._loadFromStringSync(data, filePath, options);
      }
      /**
       * Loads the store from a json string.
       * @param {string} data - The string data that was loaded from a file.
       * @param {string} filePath - The path of the file that the string data was loaded from.
       * @param {object} options - Options for loading the file.
       * @returns {CookiesIndex} the parsed data
       */
      _loadFromStringSync(data, filePath, options) {
        let jsonData;
        let fileFormat = this.fileFormat;
        if (!fileFormat) {
          try {
            jsonData = JSON.parse(data);
            fileFormat = FileFormat.json;
          } catch (_a) {
            fileFormat = FileFormat.txt;
          }
        }
        let cookies;
        switch (fileFormat) {
          case FileFormat.json:
            if (jsonData !== void 0) {
              cookies = parseCookiesJsonObject(jsonData);
            } else {
              cookies = parseCookiesJson(
                data,
                Object.assign(Object.assign({}, options), { filePath }),
              );
            }
            break;
          case FileFormat.txt:
            cookies = parseNetscapeCookiesTxtToIndex(
              data,
              Object.assign(Object.assign({}, options), {
                filePath,
                httpOnlyExtension: this.httpOnlyExtension,
              }),
            );
            break;
          default:
            throw new Error(`Unknown cookies file format ${fileFormat}`);
        }
        this.fileFormat = fileFormat;
        if (cookies) {
          this.idx = cookies;
        }
        return cookies !== void 0;
      }
      /**
       * Saves the store to its file asynchronously.
       * @param {Function} cb - The callback to be called when finished.
       * @returns {Promise} a promise if no callback was passed.
       */
      _saveAsync(cb) {
        if (!this._nextWritePromise) {
          this._nextWritePromise = (async () => {
            if (this._writePromise) {
              try {
                await this._writePromise;
              } catch (_a) {}
            } else {
              await Promise.resolve();
            }
            this._writePromise = this._nextWritePromise;
            this._nextWritePromise = void 0;
            try {
              await this._saveToFileAsync(this.filePath, this.idx);
            } finally {
              this._writePromise = void 0;
            }
          })();
        }
        if (typeof cb === 'function') {
          this._nextWritePromise
            .then(
              () => {
                cb(null);
              },
              // istanbul ignore next
              error => {
                cb(error);
              },
            )
            .catch(
              // istanbul ignore next
              error => {
                console.error(error);
              },
            );
        } else {
          return this._nextWritePromise;
        }
      }
      /**
       * Saves the store to its file synchronously.
       */
      _saveSync() {
        this._saveToFileSync(this.filePath, this.idx);
        if (this._writePromise) {
          this._saveAsync(error => {
            if (error) {
              console.error(error);
            }
          });
        }
      }
      /**
       * Saves the store to a file asynchronously.
       * @param {string} filePath - The file path to save the store to.
       * @param {CookiesIndex} data - The cookies to save to the file.
       * @returns {Promise} a promise for the write task
       */
      _saveToFileAsync(filePath, data) {
        const dataString = this._saveToStringSync(data);
        return fs.promises.writeFile(filePath, dataString);
      }
      /**
       * Saves the store to a file synchronously.
       * @param {string} filePath - The file path to save the store to.
       * @param {CookiesIndex} data - The cookies to save to the file.
       */
      _saveToFileSync(filePath, data) {
        const dataString = this._saveToStringSync(data);
        fs.writeFileSync(filePath, dataString);
      }
      /**
       * Serializes the cookies data to a string
       * @param {CookiesIndex} data - The cookies data to serialize
       * @returns {string} the serialized cookies data
       */
      _saveToStringSync(data) {
        if (!this.fileFormat) {
          throw new Error('File format has not been determined');
        }
        switch (this.fileFormat) {
          case FileFormat.json:
            return stringifyCookiesJson(data);
          case FileFormat.txt:
            return stringifyNetscapeCookiesTxt(data, {
              httpOnlyExtension: this.httpOnlyExtension,
            });
          default:
            throw new Error(`Unknown cookies file format ${this.fileFormat}`);
        }
      }
    };
    util.inspect.custom;
    cookie_file_store_default = FileCookieStore;
  },
});

// dist/adapters/cookie-store.js
var require_cookie_store = __commonJS({
  'dist/adapters/cookie-store.js'(exports2) {
    'use strict';
    var __importDefault =
      (exports2 && exports2.__importDefault) ||
      function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
      };
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.ToughCookieStore = void 0;
    var fs_1 = __importDefault(require('fs'));
    var path_1 = __importDefault(require('path'));
    var tough_cookie_1 = require_cookie2();
    var tough_cookie_file_store_1 = __importDefault(
      (init_cookie_file_store(), __toCommonJS(cookie_file_store_exports)),
    );
    var ToughCookieStore = class {
      constructor(filePath) {
        this.filePath = filePath;
        fs_1.default.mkdirSync(path_1.default.dirname(filePath), {
          recursive: true,
        });
        this.jar = new tough_cookie_1.CookieJar(
          new tough_cookie_file_store_1.default(filePath),
        );
      }
      getJar() {
        return this.jar;
      }
      hasFile() {
        return fs_1.default.existsSync(this.filePath);
      }
      async getCookies(baseURL) {
        const cookies = await this.jar.getCookies(baseURL);
        return cookies.map(c => {
          var _a;
          return {
            key: c.key,
            value: c.value,
            expires: c.expires instanceof Date ? c.expires : void 0,
            domain: (_a = c.domain) !== null && _a !== void 0 ? _a : void 0,
          };
        });
      }
      async clear() {
        this.jar.removeAllCookiesSync();
        if (this.hasFile()) fs_1.default.unlinkSync(this.filePath);
      }
    };
    exports2.ToughCookieStore = ToughCookieStore;
  },
});

// node_modules/axios/lib/helpers/bind.js
var require_bind = __commonJS({
  'node_modules/axios/lib/helpers/bind.js'(exports2, module2) {
    'use strict';
    module2.exports = function bind(fn, thisArg) {
      return function wrap() {
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i];
        }
        return fn.apply(thisArg, args);
      };
    };
  },
});

// node_modules/axios/lib/utils.js
var require_utils3 = __commonJS({
  'node_modules/axios/lib/utils.js'(exports2, module2) {
    'use strict';
    var bind = require_bind();
    var toString = Object.prototype.toString;
    var kindOf = /* @__PURE__ */ (function (cache) {
      return function (thing) {
        var str = toString.call(thing);
        return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
      };
    })(/* @__PURE__ */ Object.create(null));
    function kindOfTest(type) {
      type = type.toLowerCase();
      return function isKindOf(thing) {
        return kindOf(thing) === type;
      };
    }
    function isArray(val) {
      return Array.isArray(val);
    }
    function isUndefined(val) {
      return typeof val === 'undefined';
    }
    function isBuffer(val) {
      return (
        val !== null &&
        !isUndefined(val) &&
        val.constructor !== null &&
        !isUndefined(val.constructor) &&
        typeof val.constructor.isBuffer === 'function' &&
        val.constructor.isBuffer(val)
      );
    }
    var isArrayBuffer = kindOfTest('ArrayBuffer');
    function isArrayBufferView(val) {
      var result;
      if (typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView) {
        result = ArrayBuffer.isView(val);
      } else {
        result = val && val.buffer && isArrayBuffer(val.buffer);
      }
      return result;
    }
    function isString(val) {
      return typeof val === 'string';
    }
    function isNumber(val) {
      return typeof val === 'number';
    }
    function isObject(val) {
      return val !== null && typeof val === 'object';
    }
    function isPlainObject(val) {
      if (kindOf(val) !== 'object') {
        return false;
      }
      var prototype = Object.getPrototypeOf(val);
      return prototype === null || prototype === Object.prototype;
    }
    var isDate = kindOfTest('Date');
    var isFile = kindOfTest('File');
    var isBlob = kindOfTest('Blob');
    var isFileList = kindOfTest('FileList');
    function isFunction(val) {
      return toString.call(val) === '[object Function]';
    }
    function isStream(val) {
      return isObject(val) && isFunction(val.pipe);
    }
    function isFormData(thing) {
      var pattern = '[object FormData]';
      return (
        thing &&
        ((typeof FormData === 'function' && thing instanceof FormData) ||
          toString.call(thing) === pattern ||
          (isFunction(thing.toString) && thing.toString() === pattern))
      );
    }
    var isURLSearchParams = kindOfTest('URLSearchParams');
    function trim(str) {
      return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
    }
    function isStandardBrowserEnv() {
      if (
        typeof navigator !== 'undefined' &&
        (navigator.product === 'ReactNative' ||
          navigator.product === 'NativeScript' ||
          navigator.product === 'NS')
      ) {
        return false;
      }
      return typeof window !== 'undefined' && typeof document !== 'undefined';
    }
    function forEach(obj, fn) {
      if (obj === null || typeof obj === 'undefined') {
        return;
      }
      if (typeof obj !== 'object') {
        obj = [obj];
      }
      if (isArray(obj)) {
        for (var i = 0, l = obj.length; i < l; i++) {
          fn.call(null, obj[i], i, obj);
        }
      } else {
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            fn.call(null, obj[key], key, obj);
          }
        }
      }
    }
    function merge() {
      var result = {};
      function assignValue(val, key) {
        if (isPlainObject(result[key]) && isPlainObject(val)) {
          result[key] = merge(result[key], val);
        } else if (isPlainObject(val)) {
          result[key] = merge({}, val);
        } else if (isArray(val)) {
          result[key] = val.slice();
        } else {
          result[key] = val;
        }
      }
      for (var i = 0, l = arguments.length; i < l; i++) {
        forEach(arguments[i], assignValue);
      }
      return result;
    }
    function extend(a, b, thisArg) {
      forEach(b, function assignValue(val, key) {
        if (thisArg && typeof val === 'function') {
          a[key] = bind(val, thisArg);
        } else {
          a[key] = val;
        }
      });
      return a;
    }
    function stripBOM(content) {
      if (content.charCodeAt(0) === 65279) {
        content = content.slice(1);
      }
      return content;
    }
    function inherits(constructor, superConstructor, props, descriptors) {
      constructor.prototype = Object.create(
        superConstructor.prototype,
        descriptors,
      );
      constructor.prototype.constructor = constructor;
      props && Object.assign(constructor.prototype, props);
    }
    function toFlatObject(sourceObj, destObj, filter) {
      var props;
      var i;
      var prop;
      var merged = {};
      destObj = destObj || {};
      do {
        props = Object.getOwnPropertyNames(sourceObj);
        i = props.length;
        while (i-- > 0) {
          prop = props[i];
          if (!merged[prop]) {
            destObj[prop] = sourceObj[prop];
            merged[prop] = true;
          }
        }
        sourceObj = Object.getPrototypeOf(sourceObj);
      } while (
        sourceObj &&
        (!filter || filter(sourceObj, destObj)) &&
        sourceObj !== Object.prototype
      );
      return destObj;
    }
    function endsWith(str, searchString, position) {
      str = String(str);
      if (position === void 0 || position > str.length) {
        position = str.length;
      }
      position -= searchString.length;
      var lastIndex = str.indexOf(searchString, position);
      return lastIndex !== -1 && lastIndex === position;
    }
    function toArray(thing) {
      if (!thing) return null;
      var i = thing.length;
      if (isUndefined(i)) return null;
      var arr = new Array(i);
      while (i-- > 0) {
        arr[i] = thing[i];
      }
      return arr;
    }
    var isTypedArray = /* @__PURE__ */ (function (TypedArray) {
      return function (thing) {
        return TypedArray && thing instanceof TypedArray;
      };
    })(typeof Uint8Array !== 'undefined' && Object.getPrototypeOf(Uint8Array));
    module2.exports = {
      isArray,
      isArrayBuffer,
      isBuffer,
      isFormData,
      isArrayBufferView,
      isString,
      isNumber,
      isObject,
      isPlainObject,
      isUndefined,
      isDate,
      isFile,
      isBlob,
      isFunction,
      isStream,
      isURLSearchParams,
      isStandardBrowserEnv,
      forEach,
      merge,
      extend,
      trim,
      stripBOM,
      inherits,
      toFlatObject,
      kindOf,
      kindOfTest,
      endsWith,
      toArray,
      isTypedArray,
      isFileList,
    };
  },
});

// node_modules/axios/lib/helpers/buildURL.js
var require_buildURL = __commonJS({
  'node_modules/axios/lib/helpers/buildURL.js'(exports2, module2) {
    'use strict';
    var utils = require_utils3();
    function encode(val) {
      return encodeURIComponent(val)
        .replace(/%3A/gi, ':')
        .replace(/%24/g, '$')
        .replace(/%2C/gi, ',')
        .replace(/%20/g, '+')
        .replace(/%5B/gi, '[')
        .replace(/%5D/gi, ']');
    }
    module2.exports = function buildURL(url, params, paramsSerializer) {
      if (!params) {
        return url;
      }
      var serializedParams;
      if (paramsSerializer) {
        serializedParams = paramsSerializer(params);
      } else if (utils.isURLSearchParams(params)) {
        serializedParams = params.toString();
      } else {
        var parts = [];
        utils.forEach(params, function serialize(val, key) {
          if (val === null || typeof val === 'undefined') {
            return;
          }
          if (utils.isArray(val)) {
            key = key + '[]';
          } else {
            val = [val];
          }
          utils.forEach(val, function parseValue(v) {
            if (utils.isDate(v)) {
              v = v.toISOString();
            } else if (utils.isObject(v)) {
              v = JSON.stringify(v);
            }
            parts.push(encode(key) + '=' + encode(v));
          });
        });
        serializedParams = parts.join('&');
      }
      if (serializedParams) {
        var hashmarkIndex = url.indexOf('#');
        if (hashmarkIndex !== -1) {
          url = url.slice(0, hashmarkIndex);
        }
        url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
      }
      return url;
    };
  },
});

// node_modules/axios/lib/core/InterceptorManager.js
var require_InterceptorManager = __commonJS({
  'node_modules/axios/lib/core/InterceptorManager.js'(exports2, module2) {
    'use strict';
    var utils = require_utils3();
    function InterceptorManager() {
      this.handlers = [];
    }
    InterceptorManager.prototype.use = function use(
      fulfilled,
      rejected,
      options,
    ) {
      this.handlers.push({
        fulfilled,
        rejected,
        synchronous: options ? options.synchronous : false,
        runWhen: options ? options.runWhen : null,
      });
      return this.handlers.length - 1;
    };
    InterceptorManager.prototype.eject = function eject(id) {
      if (this.handlers[id]) {
        this.handlers[id] = null;
      }
    };
    InterceptorManager.prototype.forEach = function forEach(fn) {
      utils.forEach(this.handlers, function forEachHandler(h) {
        if (h !== null) {
          fn(h);
        }
      });
    };
    module2.exports = InterceptorManager;
  },
});

// node_modules/axios/lib/helpers/normalizeHeaderName.js
var require_normalizeHeaderName = __commonJS({
  'node_modules/axios/lib/helpers/normalizeHeaderName.js'(exports2, module2) {
    'use strict';
    var utils = require_utils3();
    module2.exports = function normalizeHeaderName(headers, normalizedName) {
      utils.forEach(headers, function processHeader(value, name) {
        if (
          name !== normalizedName &&
          name.toUpperCase() === normalizedName.toUpperCase()
        ) {
          headers[normalizedName] = value;
          delete headers[name];
        }
      });
    };
  },
});

// node_modules/axios/lib/core/AxiosError.js
var require_AxiosError = __commonJS({
  'node_modules/axios/lib/core/AxiosError.js'(exports2, module2) {
    'use strict';
    var utils = require_utils3();
    function AxiosError(message, code, config, request, response) {
      Error.call(this);
      this.message = message;
      this.name = 'AxiosError';
      code && (this.code = code);
      config && (this.config = config);
      request && (this.request = request);
      response && (this.response = response);
    }
    utils.inherits(AxiosError, Error, {
      toJSON: function toJSON() {
        return {
          // Standard
          message: this.message,
          name: this.name,
          // Microsoft
          description: this.description,
          number: this.number,
          // Mozilla
          fileName: this.fileName,
          lineNumber: this.lineNumber,
          columnNumber: this.columnNumber,
          stack: this.stack,
          // Axios
          config: this.config,
          code: this.code,
          status:
            this.response && this.response.status ? this.response.status : null,
        };
      },
    });
    var prototype = AxiosError.prototype;
    var descriptors = {};
    [
      'ERR_BAD_OPTION_VALUE',
      'ERR_BAD_OPTION',
      'ECONNABORTED',
      'ETIMEDOUT',
      'ERR_NETWORK',
      'ERR_FR_TOO_MANY_REDIRECTS',
      'ERR_DEPRECATED',
      'ERR_BAD_RESPONSE',
      'ERR_BAD_REQUEST',
      'ERR_CANCELED',
      // eslint-disable-next-line func-names
    ].forEach(function (code) {
      descriptors[code] = { value: code };
    });
    Object.defineProperties(AxiosError, descriptors);
    Object.defineProperty(prototype, 'isAxiosError', { value: true });
    AxiosError.from = function (
      error,
      code,
      config,
      request,
      response,
      customProps,
    ) {
      var axiosError = Object.create(prototype);
      utils.toFlatObject(error, axiosError, function filter(obj) {
        return obj !== Error.prototype;
      });
      AxiosError.call(
        axiosError,
        error.message,
        code,
        config,
        request,
        response,
      );
      axiosError.name = error.name;
      customProps && Object.assign(axiosError, customProps);
      return axiosError;
    };
    module2.exports = AxiosError;
  },
});

// node_modules/axios/lib/defaults/transitional.js
var require_transitional = __commonJS({
  'node_modules/axios/lib/defaults/transitional.js'(exports2, module2) {
    'use strict';
    module2.exports = {
      silentJSONParsing: true,
      forcedJSONParsing: true,
      clarifyTimeoutError: false,
    };
  },
});

// node_modules/axios/lib/helpers/toFormData.js
var require_toFormData = __commonJS({
  'node_modules/axios/lib/helpers/toFormData.js'(exports2, module2) {
    'use strict';
    var utils = require_utils3();
    function toFormData(obj, formData) {
      formData = formData || new FormData();
      var stack = [];
      function convertValue(value) {
        if (value === null) return '';
        if (utils.isDate(value)) {
          return value.toISOString();
        }
        if (utils.isArrayBuffer(value) || utils.isTypedArray(value)) {
          return typeof Blob === 'function'
            ? new Blob([value])
            : Buffer.from(value);
        }
        return value;
      }
      function build(data, parentKey) {
        if (utils.isPlainObject(data) || utils.isArray(data)) {
          if (stack.indexOf(data) !== -1) {
            throw Error('Circular reference detected in ' + parentKey);
          }
          stack.push(data);
          utils.forEach(data, function each(value, key) {
            if (utils.isUndefined(value)) return;
            var fullKey = parentKey ? parentKey + '.' + key : key;
            var arr;
            if (value && !parentKey && typeof value === 'object') {
              if (utils.endsWith(key, '{}')) {
                value = JSON.stringify(value);
              } else if (
                utils.endsWith(key, '[]') &&
                (arr = utils.toArray(value))
              ) {
                arr.forEach(function (el) {
                  !utils.isUndefined(el) &&
                    formData.append(fullKey, convertValue(el));
                });
                return;
              }
            }
            build(value, fullKey);
          });
          stack.pop();
        } else {
          formData.append(parentKey, convertValue(data));
        }
      }
      build(obj);
      return formData;
    }
    module2.exports = toFormData;
  },
});

// node_modules/axios/lib/core/settle.js
var require_settle = __commonJS({
  'node_modules/axios/lib/core/settle.js'(exports2, module2) {
    'use strict';
    var AxiosError = require_AxiosError();
    module2.exports = function settle(resolve, reject, response) {
      var validateStatus = response.config.validateStatus;
      if (
        !response.status ||
        !validateStatus ||
        validateStatus(response.status)
      ) {
        resolve(response);
      } else {
        reject(
          new AxiosError(
            'Request failed with status code ' + response.status,
            [AxiosError.ERR_BAD_REQUEST, AxiosError.ERR_BAD_RESPONSE][
              Math.floor(response.status / 100) - 4
            ],
            response.config,
            response.request,
            response,
          ),
        );
      }
    };
  },
});

// node_modules/axios/lib/helpers/cookies.js
var require_cookies = __commonJS({
  'node_modules/axios/lib/helpers/cookies.js'(exports2, module2) {
    'use strict';
    var utils = require_utils3();
    module2.exports = utils.isStandardBrowserEnv()
      ? // Standard browser envs support document.cookie
        /* @__PURE__ */ (function standardBrowserEnv() {
          return {
            write: function write(name, value, expires, path, domain, secure) {
              var cookie = [];
              cookie.push(name + '=' + encodeURIComponent(value));
              if (utils.isNumber(expires)) {
                cookie.push('expires=' + new Date(expires).toGMTString());
              }
              if (utils.isString(path)) {
                cookie.push('path=' + path);
              }
              if (utils.isString(domain)) {
                cookie.push('domain=' + domain);
              }
              if (secure === true) {
                cookie.push('secure');
              }
              document.cookie = cookie.join('; ');
            },
            read: function read(name) {
              var match = document.cookie.match(
                new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'),
              );
              return match ? decodeURIComponent(match[3]) : null;
            },
            remove: function remove(name) {
              this.write(name, '', Date.now() - 864e5);
            },
          };
        })()
      : // Non standard browser env (web workers, react-native) lack needed support.
        /* @__PURE__ */ (function nonStandardBrowserEnv() {
          return {
            write: function write() {},
            read: function read() {
              return null;
            },
            remove: function remove() {},
          };
        })();
  },
});

// node_modules/axios/lib/helpers/isAbsoluteURL.js
var require_isAbsoluteURL = __commonJS({
  'node_modules/axios/lib/helpers/isAbsoluteURL.js'(exports2, module2) {
    'use strict';
    module2.exports = function isAbsoluteURL(url) {
      return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
    };
  },
});

// node_modules/axios/lib/helpers/combineURLs.js
var require_combineURLs = __commonJS({
  'node_modules/axios/lib/helpers/combineURLs.js'(exports2, module2) {
    'use strict';
    module2.exports = function combineURLs(baseURL, relativeURL) {
      return relativeURL
        ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
        : baseURL;
    };
  },
});

// node_modules/axios/lib/core/buildFullPath.js
var require_buildFullPath = __commonJS({
  'node_modules/axios/lib/core/buildFullPath.js'(exports2, module2) {
    'use strict';
    var isAbsoluteURL = require_isAbsoluteURL();
    var combineURLs = require_combineURLs();
    module2.exports = function buildFullPath(baseURL, requestedURL) {
      if (baseURL && !isAbsoluteURL(requestedURL)) {
        return combineURLs(baseURL, requestedURL);
      }
      return requestedURL;
    };
  },
});

// node_modules/axios/lib/helpers/parseHeaders.js
var require_parseHeaders = __commonJS({
  'node_modules/axios/lib/helpers/parseHeaders.js'(exports2, module2) {
    'use strict';
    var utils = require_utils3();
    var ignoreDuplicateOf = [
      'age',
      'authorization',
      'content-length',
      'content-type',
      'etag',
      'expires',
      'from',
      'host',
      'if-modified-since',
      'if-unmodified-since',
      'last-modified',
      'location',
      'max-forwards',
      'proxy-authorization',
      'referer',
      'retry-after',
      'user-agent',
    ];
    module2.exports = function parseHeaders(headers) {
      var parsed = {};
      var key;
      var val;
      var i;
      if (!headers) {
        return parsed;
      }
      utils.forEach(headers.split('\n'), function parser(line) {
        i = line.indexOf(':');
        key = utils.trim(line.substr(0, i)).toLowerCase();
        val = utils.trim(line.substr(i + 1));
        if (key) {
          if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
            return;
          }
          if (key === 'set-cookie') {
            parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
          } else {
            parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
          }
        }
      });
      return parsed;
    };
  },
});

// node_modules/axios/lib/helpers/isURLSameOrigin.js
var require_isURLSameOrigin = __commonJS({
  'node_modules/axios/lib/helpers/isURLSameOrigin.js'(exports2, module2) {
    'use strict';
    var utils = require_utils3();
    module2.exports = utils.isStandardBrowserEnv()
      ? // Standard browser envs have full support of the APIs needed to test
        // whether the request URL is of the same origin as current location.
        (function standardBrowserEnv() {
          var msie = /(msie|trident)/i.test(navigator.userAgent);
          var urlParsingNode = document.createElement('a');
          var originURL;
          function resolveURL(url) {
            var href = url;
            if (msie) {
              urlParsingNode.setAttribute('href', href);
              href = urlParsingNode.href;
            }
            urlParsingNode.setAttribute('href', href);
            return {
              href: urlParsingNode.href,
              protocol: urlParsingNode.protocol
                ? urlParsingNode.protocol.replace(/:$/, '')
                : '',
              host: urlParsingNode.host,
              search: urlParsingNode.search
                ? urlParsingNode.search.replace(/^\?/, '')
                : '',
              hash: urlParsingNode.hash
                ? urlParsingNode.hash.replace(/^#/, '')
                : '',
              hostname: urlParsingNode.hostname,
              port: urlParsingNode.port,
              pathname:
                urlParsingNode.pathname.charAt(0) === '/'
                  ? urlParsingNode.pathname
                  : '/' + urlParsingNode.pathname,
            };
          }
          originURL = resolveURL(window.location.href);
          return function isURLSameOrigin(requestURL) {
            var parsed = utils.isString(requestURL)
              ? resolveURL(requestURL)
              : requestURL;
            return (
              parsed.protocol === originURL.protocol &&
              parsed.host === originURL.host
            );
          };
        })()
      : // Non standard browser envs (web workers, react-native) lack needed support.
        /* @__PURE__ */ (function nonStandardBrowserEnv() {
          return function isURLSameOrigin() {
            return true;
          };
        })();
  },
});

// node_modules/axios/lib/cancel/CanceledError.js
var require_CanceledError = __commonJS({
  'node_modules/axios/lib/cancel/CanceledError.js'(exports2, module2) {
    'use strict';
    var AxiosError = require_AxiosError();
    var utils = require_utils3();
    function CanceledError(message) {
      AxiosError.call(
        this,
        message == null ? 'canceled' : message,
        AxiosError.ERR_CANCELED,
      );
      this.name = 'CanceledError';
    }
    utils.inherits(CanceledError, AxiosError, {
      __CANCEL__: true,
    });
    module2.exports = CanceledError;
  },
});

// node_modules/axios/lib/helpers/parseProtocol.js
var require_parseProtocol = __commonJS({
  'node_modules/axios/lib/helpers/parseProtocol.js'(exports2, module2) {
    'use strict';
    module2.exports = function parseProtocol(url) {
      var match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
      return (match && match[1]) || '';
    };
  },
});

// node_modules/axios/lib/adapters/xhr.js
var require_xhr = __commonJS({
  'node_modules/axios/lib/adapters/xhr.js'(exports2, module2) {
    'use strict';
    var utils = require_utils3();
    var settle = require_settle();
    var cookies = require_cookies();
    var buildURL = require_buildURL();
    var buildFullPath = require_buildFullPath();
    var parseHeaders = require_parseHeaders();
    var isURLSameOrigin = require_isURLSameOrigin();
    var transitionalDefaults = require_transitional();
    var AxiosError = require_AxiosError();
    var CanceledError = require_CanceledError();
    var parseProtocol = require_parseProtocol();
    module2.exports = function xhrAdapter(config) {
      return new Promise(function dispatchXhrRequest(resolve, reject) {
        var requestData = config.data;
        var requestHeaders = config.headers;
        var responseType = config.responseType;
        var onCanceled;
        function done() {
          if (config.cancelToken) {
            config.cancelToken.unsubscribe(onCanceled);
          }
          if (config.signal) {
            config.signal.removeEventListener('abort', onCanceled);
          }
        }
        if (utils.isFormData(requestData) && utils.isStandardBrowserEnv()) {
          delete requestHeaders['Content-Type'];
        }
        var request = new XMLHttpRequest();
        if (config.auth) {
          var username = config.auth.username || '';
          var password = config.auth.password
            ? unescape(encodeURIComponent(config.auth.password))
            : '';
          requestHeaders.Authorization =
            'Basic ' + btoa(username + ':' + password);
        }
        var fullPath = buildFullPath(config.baseURL, config.url);
        request.open(
          config.method.toUpperCase(),
          buildURL(fullPath, config.params, config.paramsSerializer),
          true,
        );
        request.timeout = config.timeout;
        function onloadend() {
          if (!request) {
            return;
          }
          var responseHeaders =
            'getAllResponseHeaders' in request
              ? parseHeaders(request.getAllResponseHeaders())
              : null;
          var responseData =
            !responseType || responseType === 'text' || responseType === 'json'
              ? request.responseText
              : request.response;
          var response = {
            data: responseData,
            status: request.status,
            statusText: request.statusText,
            headers: responseHeaders,
            config,
            request,
          };
          settle(
            function _resolve(value) {
              resolve(value);
              done();
            },
            function _reject(err) {
              reject(err);
              done();
            },
            response,
          );
          request = null;
        }
        if ('onloadend' in request) {
          request.onloadend = onloadend;
        } else {
          request.onreadystatechange = function handleLoad() {
            if (!request || request.readyState !== 4) {
              return;
            }
            if (
              request.status === 0 &&
              !(
                request.responseURL &&
                request.responseURL.indexOf('file:') === 0
              )
            ) {
              return;
            }
            setTimeout(onloadend);
          };
        }
        request.onabort = function handleAbort() {
          if (!request) {
            return;
          }
          reject(
            new AxiosError(
              'Request aborted',
              AxiosError.ECONNABORTED,
              config,
              request,
            ),
          );
          request = null;
        };
        request.onerror = function handleError() {
          reject(
            new AxiosError(
              'Network Error',
              AxiosError.ERR_NETWORK,
              config,
              request,
              request,
            ),
          );
          request = null;
        };
        request.ontimeout = function handleTimeout() {
          var timeoutErrorMessage = config.timeout
            ? 'timeout of ' + config.timeout + 'ms exceeded'
            : 'timeout exceeded';
          var transitional = config.transitional || transitionalDefaults;
          if (config.timeoutErrorMessage) {
            timeoutErrorMessage = config.timeoutErrorMessage;
          }
          reject(
            new AxiosError(
              timeoutErrorMessage,
              transitional.clarifyTimeoutError
                ? AxiosError.ETIMEDOUT
                : AxiosError.ECONNABORTED,
              config,
              request,
            ),
          );
          request = null;
        };
        if (utils.isStandardBrowserEnv()) {
          var xsrfValue =
            (config.withCredentials || isURLSameOrigin(fullPath)) &&
            config.xsrfCookieName
              ? cookies.read(config.xsrfCookieName)
              : void 0;
          if (xsrfValue) {
            requestHeaders[config.xsrfHeaderName] = xsrfValue;
          }
        }
        if ('setRequestHeader' in request) {
          utils.forEach(requestHeaders, function setRequestHeader(val, key) {
            if (
              typeof requestData === 'undefined' &&
              key.toLowerCase() === 'content-type'
            ) {
              delete requestHeaders[key];
            } else {
              request.setRequestHeader(key, val);
            }
          });
        }
        if (!utils.isUndefined(config.withCredentials)) {
          request.withCredentials = !!config.withCredentials;
        }
        if (responseType && responseType !== 'json') {
          request.responseType = config.responseType;
        }
        if (typeof config.onDownloadProgress === 'function') {
          request.addEventListener('progress', config.onDownloadProgress);
        }
        if (typeof config.onUploadProgress === 'function' && request.upload) {
          request.upload.addEventListener('progress', config.onUploadProgress);
        }
        if (config.cancelToken || config.signal) {
          onCanceled = function (cancel) {
            if (!request) {
              return;
            }
            reject(
              !cancel || (cancel && cancel.type) ? new CanceledError() : cancel,
            );
            request.abort();
            request = null;
          };
          config.cancelToken && config.cancelToken.subscribe(onCanceled);
          if (config.signal) {
            config.signal.aborted
              ? onCanceled()
              : config.signal.addEventListener('abort', onCanceled);
          }
        }
        if (!requestData) {
          requestData = null;
        }
        var protocol = parseProtocol(fullPath);
        if (protocol && ['http', 'https', 'file'].indexOf(protocol) === -1) {
          reject(
            new AxiosError(
              'Unsupported protocol ' + protocol + ':',
              AxiosError.ERR_BAD_REQUEST,
              config,
            ),
          );
          return;
        }
        request.send(requestData);
      });
    };
  },
});

// node_modules/ms/index.js
var require_ms = __commonJS({
  'node_modules/ms/index.js'(exports2, module2) {
    var s = 1e3;
    var m = s * 60;
    var h = m * 60;
    var d = h * 24;
    var w = d * 7;
    var y = d * 365.25;
    module2.exports = function (val, options) {
      options = options || {};
      var type = typeof val;
      if (type === 'string' && val.length > 0) {
        return parse(val);
      } else if (type === 'number' && isFinite(val)) {
        return options.long ? fmtLong(val) : fmtShort(val);
      }
      throw new Error(
        'val is not a non-empty string or a valid number. val=' +
          JSON.stringify(val),
      );
    };
    function parse(str) {
      str = String(str);
      if (str.length > 100) {
        return;
      }
      var match =
        /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
          str,
        );
      if (!match) {
        return;
      }
      var n = parseFloat(match[1]);
      var type = (match[2] || 'ms').toLowerCase();
      switch (type) {
        case 'years':
        case 'year':
        case 'yrs':
        case 'yr':
        case 'y':
          return n * y;
        case 'weeks':
        case 'week':
        case 'w':
          return n * w;
        case 'days':
        case 'day':
        case 'd':
          return n * d;
        case 'hours':
        case 'hour':
        case 'hrs':
        case 'hr':
        case 'h':
          return n * h;
        case 'minutes':
        case 'minute':
        case 'mins':
        case 'min':
        case 'm':
          return n * m;
        case 'seconds':
        case 'second':
        case 'secs':
        case 'sec':
        case 's':
          return n * s;
        case 'milliseconds':
        case 'millisecond':
        case 'msecs':
        case 'msec':
        case 'ms':
          return n;
        default:
          return void 0;
      }
    }
    function fmtShort(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return Math.round(ms / d) + 'd';
      }
      if (msAbs >= h) {
        return Math.round(ms / h) + 'h';
      }
      if (msAbs >= m) {
        return Math.round(ms / m) + 'm';
      }
      if (msAbs >= s) {
        return Math.round(ms / s) + 's';
      }
      return ms + 'ms';
    }
    function fmtLong(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return plural(ms, msAbs, d, 'day');
      }
      if (msAbs >= h) {
        return plural(ms, msAbs, h, 'hour');
      }
      if (msAbs >= m) {
        return plural(ms, msAbs, m, 'minute');
      }
      if (msAbs >= s) {
        return plural(ms, msAbs, s, 'second');
      }
      return ms + ' ms';
    }
    function plural(ms, msAbs, n, name) {
      var isPlural = msAbs >= n * 1.5;
      return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
    }
  },
});

// node_modules/debug/src/common.js
var require_common = __commonJS({
  'node_modules/debug/src/common.js'(exports2, module2) {
    function setup(env) {
      createDebug.debug = createDebug;
      createDebug.default = createDebug;
      createDebug.coerce = coerce;
      createDebug.disable = disable;
      createDebug.enable = enable;
      createDebug.enabled = enabled;
      createDebug.humanize = require_ms();
      createDebug.destroy = destroy;
      Object.keys(env).forEach(key => {
        createDebug[key] = env[key];
      });
      createDebug.names = [];
      createDebug.skips = [];
      createDebug.formatters = {};
      function selectColor(namespace) {
        let hash = 0;
        for (let i = 0; i < namespace.length; i++) {
          hash = (hash << 5) - hash + namespace.charCodeAt(i);
          hash |= 0;
        }
        return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
      }
      createDebug.selectColor = selectColor;
      function createDebug(namespace) {
        let prevTime;
        let enableOverride = null;
        let namespacesCache;
        let enabledCache;
        function debug(...args) {
          if (!debug.enabled) {
            return;
          }
          const self = debug;
          const curr = Number(/* @__PURE__ */ new Date());
          const ms = curr - (prevTime || curr);
          self.diff = ms;
          self.prev = prevTime;
          self.curr = curr;
          prevTime = curr;
          args[0] = createDebug.coerce(args[0]);
          if (typeof args[0] !== 'string') {
            args.unshift('%O');
          }
          let index = 0;
          args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
            if (match === '%%') {
              return '%';
            }
            index++;
            const formatter = createDebug.formatters[format];
            if (typeof formatter === 'function') {
              const val = args[index];
              match = formatter.call(self, val);
              args.splice(index, 1);
              index--;
            }
            return match;
          });
          createDebug.formatArgs.call(self, args);
          const logFn = self.log || createDebug.log;
          logFn.apply(self, args);
        }
        debug.namespace = namespace;
        debug.useColors = createDebug.useColors();
        debug.color = createDebug.selectColor(namespace);
        debug.extend = extend;
        debug.destroy = createDebug.destroy;
        Object.defineProperty(debug, 'enabled', {
          enumerable: true,
          configurable: false,
          get: () => {
            if (enableOverride !== null) {
              return enableOverride;
            }
            if (namespacesCache !== createDebug.namespaces) {
              namespacesCache = createDebug.namespaces;
              enabledCache = createDebug.enabled(namespace);
            }
            return enabledCache;
          },
          set: v => {
            enableOverride = v;
          },
        });
        if (typeof createDebug.init === 'function') {
          createDebug.init(debug);
        }
        return debug;
      }
      function extend(namespace, delimiter) {
        const newDebug = createDebug(
          this.namespace +
            (typeof delimiter === 'undefined' ? ':' : delimiter) +
            namespace,
        );
        newDebug.log = this.log;
        return newDebug;
      }
      function enable(namespaces) {
        createDebug.save(namespaces);
        createDebug.namespaces = namespaces;
        createDebug.names = [];
        createDebug.skips = [];
        const split = (typeof namespaces === 'string' ? namespaces : '')
          .trim()
          .replace(/\s+/g, ',')
          .split(',')
          .filter(Boolean);
        for (const ns of split) {
          if (ns[0] === '-') {
            createDebug.skips.push(ns.slice(1));
          } else {
            createDebug.names.push(ns);
          }
        }
      }
      function matchesTemplate(search, template) {
        let searchIndex = 0;
        let templateIndex = 0;
        let starIndex = -1;
        let matchIndex = 0;
        while (searchIndex < search.length) {
          if (
            templateIndex < template.length &&
            (template[templateIndex] === search[searchIndex] ||
              template[templateIndex] === '*')
          ) {
            if (template[templateIndex] === '*') {
              starIndex = templateIndex;
              matchIndex = searchIndex;
              templateIndex++;
            } else {
              searchIndex++;
              templateIndex++;
            }
          } else if (starIndex !== -1) {
            templateIndex = starIndex + 1;
            matchIndex++;
            searchIndex = matchIndex;
          } else {
            return false;
          }
        }
        while (
          templateIndex < template.length &&
          template[templateIndex] === '*'
        ) {
          templateIndex++;
        }
        return templateIndex === template.length;
      }
      function disable() {
        const namespaces = [
          ...createDebug.names,
          ...createDebug.skips.map(namespace => '-' + namespace),
        ].join(',');
        createDebug.enable('');
        return namespaces;
      }
      function enabled(name) {
        for (const skip of createDebug.skips) {
          if (matchesTemplate(name, skip)) {
            return false;
          }
        }
        for (const ns of createDebug.names) {
          if (matchesTemplate(name, ns)) {
            return true;
          }
        }
        return false;
      }
      function coerce(val) {
        if (val instanceof Error) {
          return val.stack || val.message;
        }
        return val;
      }
      function destroy() {
        console.warn(
          'Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.',
        );
      }
      createDebug.enable(createDebug.load());
      return createDebug;
    }
    module2.exports = setup;
  },
});

// node_modules/debug/src/browser.js
var require_browser = __commonJS({
  'node_modules/debug/src/browser.js'(exports2, module2) {
    exports2.formatArgs = formatArgs;
    exports2.save = save;
    exports2.load = load;
    exports2.useColors = useColors;
    exports2.storage = localstorage();
    exports2.destroy = /* @__PURE__ */ (() => {
      let warned = false;
      return () => {
        if (!warned) {
          warned = true;
          console.warn(
            'Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.',
          );
        }
      };
    })();
    exports2.colors = [
      '#0000CC',
      '#0000FF',
      '#0033CC',
      '#0033FF',
      '#0066CC',
      '#0066FF',
      '#0099CC',
      '#0099FF',
      '#00CC00',
      '#00CC33',
      '#00CC66',
      '#00CC99',
      '#00CCCC',
      '#00CCFF',
      '#3300CC',
      '#3300FF',
      '#3333CC',
      '#3333FF',
      '#3366CC',
      '#3366FF',
      '#3399CC',
      '#3399FF',
      '#33CC00',
      '#33CC33',
      '#33CC66',
      '#33CC99',
      '#33CCCC',
      '#33CCFF',
      '#6600CC',
      '#6600FF',
      '#6633CC',
      '#6633FF',
      '#66CC00',
      '#66CC33',
      '#9900CC',
      '#9900FF',
      '#9933CC',
      '#9933FF',
      '#99CC00',
      '#99CC33',
      '#CC0000',
      '#CC0033',
      '#CC0066',
      '#CC0099',
      '#CC00CC',
      '#CC00FF',
      '#CC3300',
      '#CC3333',
      '#CC3366',
      '#CC3399',
      '#CC33CC',
      '#CC33FF',
      '#CC6600',
      '#CC6633',
      '#CC9900',
      '#CC9933',
      '#CCCC00',
      '#CCCC33',
      '#FF0000',
      '#FF0033',
      '#FF0066',
      '#FF0099',
      '#FF00CC',
      '#FF00FF',
      '#FF3300',
      '#FF3333',
      '#FF3366',
      '#FF3399',
      '#FF33CC',
      '#FF33FF',
      '#FF6600',
      '#FF6633',
      '#FF9900',
      '#FF9933',
      '#FFCC00',
      '#FFCC33',
    ];
    function useColors() {
      if (
        typeof window !== 'undefined' &&
        window.process &&
        (window.process.type === 'renderer' || window.process.__nwjs)
      ) {
        return true;
      }
      if (
        typeof navigator !== 'undefined' &&
        navigator.userAgent &&
        navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)
      ) {
        return false;
      }
      let m;
      return (
        (typeof document !== 'undefined' &&
          document.documentElement &&
          document.documentElement.style &&
          document.documentElement.style.WebkitAppearance) || // Is firebug? http://stackoverflow.com/a/398120/376773
        (typeof window !== 'undefined' &&
          window.console &&
          (window.console.firebug ||
            (window.console.exception && window.console.table))) || // Is firefox >= v31?
        // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
        (typeof navigator !== 'undefined' &&
          navigator.userAgent &&
          (m = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) &&
          parseInt(m[1], 10) >= 31) || // Double check webkit in userAgent just in case we are in a worker
        (typeof navigator !== 'undefined' &&
          navigator.userAgent &&
          navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/))
      );
    }
    function formatArgs(args) {
      args[0] =
        (this.useColors ? '%c' : '') +
        this.namespace +
        (this.useColors ? ' %c' : ' ') +
        args[0] +
        (this.useColors ? '%c ' : ' ') +
        '+' +
        module2.exports.humanize(this.diff);
      if (!this.useColors) {
        return;
      }
      const c = 'color: ' + this.color;
      args.splice(1, 0, c, 'color: inherit');
      let index = 0;
      let lastC = 0;
      args[0].replace(/%[a-zA-Z%]/g, match => {
        if (match === '%%') {
          return;
        }
        index++;
        if (match === '%c') {
          lastC = index;
        }
      });
      args.splice(lastC, 0, c);
    }
    exports2.log = console.debug || console.log || (() => {});
    function save(namespaces) {
      try {
        if (namespaces) {
          exports2.storage.setItem('debug', namespaces);
        } else {
          exports2.storage.removeItem('debug');
        }
      } catch (error) {}
    }
    function load() {
      let r;
      try {
        r =
          exports2.storage.getItem('debug') ||
          exports2.storage.getItem('DEBUG');
      } catch (error) {}
      if (!r && typeof process !== 'undefined' && 'env' in process) {
        r = process.env.DEBUG;
      }
      return r;
    }
    function localstorage() {
      try {
        return localStorage;
      } catch (error) {}
    }
    module2.exports = require_common()(exports2);
    var { formatters } = module2.exports;
    formatters.j = function (v) {
      try {
        return JSON.stringify(v);
      } catch (error) {
        return '[UnexpectedJSONParseError]: ' + error.message;
      }
    };
  },
});

// node_modules/debug/src/node.js
var require_node = __commonJS({
  'node_modules/debug/src/node.js'(exports2, module2) {
    var tty = require('tty');
    var util2 = require('util');
    exports2.init = init;
    exports2.log = log;
    exports2.formatArgs = formatArgs;
    exports2.save = save;
    exports2.load = load;
    exports2.useColors = useColors;
    exports2.destroy = util2.deprecate(
      () => {},
      'Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.',
    );
    exports2.colors = [6, 2, 3, 4, 5, 1];
    try {
      const supportsColor = require('supports-color');
      if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
        exports2.colors = [
          20, 21, 26, 27, 32, 33, 38, 39, 40, 41, 42, 43, 44, 45, 56, 57, 62,
          63, 68, 69, 74, 75, 76, 77, 78, 79, 80, 81, 92, 93, 98, 99, 112, 113,
          128, 129, 134, 135, 148, 149, 160, 161, 162, 163, 164, 165, 166, 167,
          168, 169, 170, 171, 172, 173, 178, 179, 184, 185, 196, 197, 198, 199,
          200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 214, 215, 220, 221,
        ];
      }
    } catch (error) {}
    exports2.inspectOpts = Object.keys(process.env)
      .filter(key => {
        return /^debug_/i.test(key);
      })
      .reduce((obj, key) => {
        const prop = key
          .substring(6)
          .toLowerCase()
          .replace(/_([a-z])/g, (_, k) => {
            return k.toUpperCase();
          });
        let val = process.env[key];
        if (/^(yes|on|true|enabled)$/i.test(val)) {
          val = true;
        } else if (/^(no|off|false|disabled)$/i.test(val)) {
          val = false;
        } else if (val === 'null') {
          val = null;
        } else {
          val = Number(val);
        }
        obj[prop] = val;
        return obj;
      }, {});
    function useColors() {
      return 'colors' in exports2.inspectOpts
        ? Boolean(exports2.inspectOpts.colors)
        : tty.isatty(process.stderr.fd);
    }
    function formatArgs(args) {
      const { namespace: name, useColors: useColors2 } = this;
      if (useColors2) {
        const c = this.color;
        const colorCode = '\x1B[3' + (c < 8 ? c : '8;5;' + c);
        const prefix = `  ${colorCode};1m${name} \x1B[0m`;
        args[0] = prefix + args[0].split('\n').join('\n' + prefix);
        args.push(
          colorCode + 'm+' + module2.exports.humanize(this.diff) + '\x1B[0m',
        );
      } else {
        args[0] = getDate() + name + ' ' + args[0];
      }
    }
    function getDate() {
      if (exports2.inspectOpts.hideDate) {
        return '';
      }
      return /* @__PURE__ */ new Date().toISOString() + ' ';
    }
    function log(...args) {
      return process.stderr.write(
        util2.formatWithOptions(exports2.inspectOpts, ...args) + '\n',
      );
    }
    function save(namespaces) {
      if (namespaces) {
        process.env.DEBUG = namespaces;
      } else {
        delete process.env.DEBUG;
      }
    }
    function load() {
      return process.env.DEBUG;
    }
    function init(debug) {
      debug.inspectOpts = {};
      const keys = Object.keys(exports2.inspectOpts);
      for (let i = 0; i < keys.length; i++) {
        debug.inspectOpts[keys[i]] = exports2.inspectOpts[keys[i]];
      }
    }
    module2.exports = require_common()(exports2);
    var { formatters } = module2.exports;
    formatters.o = function (v) {
      this.inspectOpts.colors = this.useColors;
      return util2
        .inspect(v, this.inspectOpts)
        .split('\n')
        .map(str => str.trim())
        .join(' ');
    };
    formatters.O = function (v) {
      this.inspectOpts.colors = this.useColors;
      return util2.inspect(v, this.inspectOpts);
    };
  },
});

// node_modules/debug/src/index.js
var require_src = __commonJS({
  'node_modules/debug/src/index.js'(exports2, module2) {
    if (
      typeof process === 'undefined' ||
      process.type === 'renderer' ||
      process.browser === true ||
      process.__nwjs
    ) {
      module2.exports = require_browser();
    } else {
      module2.exports = require_node();
    }
  },
});

// node_modules/follow-redirects/debug.js
var require_debug = __commonJS({
  'node_modules/follow-redirects/debug.js'(exports2, module2) {
    var debug;
    module2.exports = function () {
      if (!debug) {
        try {
          debug = require_src()('follow-redirects');
        } catch (error) {}
        if (typeof debug !== 'function') {
          debug = function () {};
        }
      }
      debug.apply(null, arguments);
    };
  },
});

// node_modules/follow-redirects/index.js
var require_follow_redirects = __commonJS({
  'node_modules/follow-redirects/index.js'(exports2, module2) {
    var url = require('url');
    var URL2 = url.URL;
    var http3 = require('http');
    var https2 = require('https');
    var Writable = require('stream').Writable;
    var assert = require('assert');
    var debug = require_debug();
    (function detectUnsupportedEnvironment() {
      var looksLikeNode = typeof process !== 'undefined';
      var looksLikeBrowser =
        typeof window !== 'undefined' && typeof document !== 'undefined';
      var looksLikeV8 = isFunction(Error.captureStackTrace);
      if (!looksLikeNode && (looksLikeBrowser || !looksLikeV8)) {
        console.warn(
          'The follow-redirects package should be excluded from browser builds.',
        );
      }
    })();
    var useNativeURL = false;
    try {
      assert(new URL2(''));
    } catch (error) {
      useNativeURL = error.code === 'ERR_INVALID_URL';
    }
    var sensitiveHeaders = ['Authorization', 'Proxy-Authorization', 'Cookie'];
    var preservedUrlFields = [
      'auth',
      'host',
      'hostname',
      'href',
      'path',
      'pathname',
      'port',
      'protocol',
      'query',
      'search',
      'hash',
    ];
    var events = ['abort', 'aborted', 'connect', 'error', 'socket', 'timeout'];
    var eventHandlers = /* @__PURE__ */ Object.create(null);
    events.forEach(function (event) {
      eventHandlers[event] = function (arg1, arg2, arg3) {
        this._redirectable.emit(event, arg1, arg2, arg3);
      };
    });
    var InvalidUrlError = createErrorType(
      'ERR_INVALID_URL',
      'Invalid URL',
      TypeError,
    );
    var RedirectionError = createErrorType(
      'ERR_FR_REDIRECTION_FAILURE',
      'Redirected request failed',
    );
    var TooManyRedirectsError = createErrorType(
      'ERR_FR_TOO_MANY_REDIRECTS',
      'Maximum number of redirects exceeded',
      RedirectionError,
    );
    var MaxBodyLengthExceededError = createErrorType(
      'ERR_FR_MAX_BODY_LENGTH_EXCEEDED',
      'Request body larger than maxBodyLength limit',
    );
    var WriteAfterEndError = createErrorType(
      'ERR_STREAM_WRITE_AFTER_END',
      'write after end',
    );
    var destroy = Writable.prototype.destroy || noop;
    function RedirectableRequest(options, responseCallback) {
      Writable.call(this);
      this._sanitizeOptions(options);
      this._options = options;
      this._ended = false;
      this._ending = false;
      this._redirectCount = 0;
      this._redirects = [];
      this._requestBodyLength = 0;
      this._requestBodyBuffers = [];
      if (responseCallback) {
        this.on('response', responseCallback);
      }
      var self = this;
      this._onNativeResponse = function (response) {
        try {
          self._processResponse(response);
        } catch (cause) {
          self.emit(
            'error',
            cause instanceof RedirectionError
              ? cause
              : new RedirectionError({ cause }),
          );
        }
      };
      this._headerFilter = new RegExp(
        '^(?:' +
          sensitiveHeaders
            .concat(options.sensitiveHeaders)
            .map(escapeRegex)
            .join('|') +
          ')$',
        'i',
      );
      this._performRequest();
    }
    RedirectableRequest.prototype = Object.create(Writable.prototype);
    RedirectableRequest.prototype.abort = function () {
      destroyRequest(this._currentRequest);
      this._currentRequest.abort();
      this.emit('abort');
    };
    RedirectableRequest.prototype.destroy = function (error) {
      destroyRequest(this._currentRequest, error);
      destroy.call(this, error);
      return this;
    };
    RedirectableRequest.prototype.write = function (data, encoding, callback) {
      if (this._ending) {
        throw new WriteAfterEndError();
      }
      if (!isString(data) && !isBuffer(data)) {
        throw new TypeError('data should be a string, Buffer or Uint8Array');
      }
      if (isFunction(encoding)) {
        callback = encoding;
        encoding = null;
      }
      if (data.length === 0) {
        if (callback) {
          callback();
        }
        return;
      }
      if (
        this._requestBodyLength + data.length <=
        this._options.maxBodyLength
      ) {
        this._requestBodyLength += data.length;
        this._requestBodyBuffers.push({ data, encoding });
        this._currentRequest.write(data, encoding, callback);
      } else {
        this.emit('error', new MaxBodyLengthExceededError());
        this.abort();
      }
    };
    RedirectableRequest.prototype.end = function (data, encoding, callback) {
      if (isFunction(data)) {
        callback = data;
        data = encoding = null;
      } else if (isFunction(encoding)) {
        callback = encoding;
        encoding = null;
      }
      if (!data) {
        this._ended = this._ending = true;
        this._currentRequest.end(null, null, callback);
      } else {
        var self = this;
        var currentRequest = this._currentRequest;
        this.write(data, encoding, function () {
          self._ended = true;
          currentRequest.end(null, null, callback);
        });
        this._ending = true;
      }
    };
    RedirectableRequest.prototype.setHeader = function (name, value) {
      this._options.headers[name] = value;
      this._currentRequest.setHeader(name, value);
    };
    RedirectableRequest.prototype.removeHeader = function (name) {
      delete this._options.headers[name];
      this._currentRequest.removeHeader(name);
    };
    RedirectableRequest.prototype.setTimeout = function (msecs, callback) {
      var self = this;
      function destroyOnTimeout(socket) {
        socket.setTimeout(msecs);
        socket.removeListener('timeout', socket.destroy);
        socket.addListener('timeout', socket.destroy);
      }
      function startTimer(socket) {
        if (self._timeout) {
          clearTimeout(self._timeout);
        }
        self._timeout = setTimeout(function () {
          self.emit('timeout');
          clearTimer();
        }, msecs);
        destroyOnTimeout(socket);
      }
      function clearTimer() {
        if (self._timeout) {
          clearTimeout(self._timeout);
          self._timeout = null;
        }
        self.removeListener('abort', clearTimer);
        self.removeListener('error', clearTimer);
        self.removeListener('response', clearTimer);
        self.removeListener('close', clearTimer);
        if (callback) {
          self.removeListener('timeout', callback);
        }
        if (!self.socket) {
          self._currentRequest.removeListener('socket', startTimer);
        }
      }
      if (callback) {
        this.on('timeout', callback);
      }
      if (this.socket) {
        startTimer(this.socket);
      } else {
        this._currentRequest.once('socket', startTimer);
      }
      this.on('socket', destroyOnTimeout);
      this.on('abort', clearTimer);
      this.on('error', clearTimer);
      this.on('response', clearTimer);
      this.on('close', clearTimer);
      return this;
    };
    ['flushHeaders', 'getHeader', 'setNoDelay', 'setSocketKeepAlive'].forEach(
      function (method) {
        RedirectableRequest.prototype[method] = function (a, b) {
          return this._currentRequest[method](a, b);
        };
      },
    );
    ['aborted', 'connection', 'socket'].forEach(function (property) {
      Object.defineProperty(RedirectableRequest.prototype, property, {
        get: function () {
          return this._currentRequest[property];
        },
      });
    });
    RedirectableRequest.prototype._sanitizeOptions = function (options) {
      if (!options.headers) {
        options.headers = {};
      }
      if (!isArray(options.sensitiveHeaders)) {
        options.sensitiveHeaders = [];
      }
      if (options.host) {
        if (!options.hostname) {
          options.hostname = options.host;
        }
        delete options.host;
      }
      if (!options.pathname && options.path) {
        var searchPos = options.path.indexOf('?');
        if (searchPos < 0) {
          options.pathname = options.path;
        } else {
          options.pathname = options.path.substring(0, searchPos);
          options.search = options.path.substring(searchPos);
        }
      }
    };
    RedirectableRequest.prototype._performRequest = function () {
      var protocol = this._options.protocol;
      var nativeProtocol = this._options.nativeProtocols[protocol];
      if (!nativeProtocol) {
        throw new TypeError('Unsupported protocol ' + protocol);
      }
      if (this._options.agents) {
        var scheme = protocol.slice(0, -1);
        this._options.agent = this._options.agents[scheme];
      }
      var request = (this._currentRequest = nativeProtocol.request(
        this._options,
        this._onNativeResponse,
      ));
      request._redirectable = this;
      for (var event of events) {
        request.on(event, eventHandlers[event]);
      }
      this._currentUrl = /^\//.test(this._options.path)
        ? url.format(this._options)
        : // When making a request to a proxy, […]
          // a client MUST send the target URI in absolute-form […].
          this._options.path;
      if (this._isRedirect) {
        var i = 0;
        var self = this;
        var buffers = this._requestBodyBuffers;
        (function writeNext(error) {
          if (request === self._currentRequest) {
            if (error) {
              self.emit('error', error);
            } else if (i < buffers.length) {
              var buffer = buffers[i++];
              if (!request.finished) {
                request.write(buffer.data, buffer.encoding, writeNext);
              }
            } else if (self._ended) {
              request.end();
            }
          }
        })();
      }
    };
    RedirectableRequest.prototype._processResponse = function (response) {
      var statusCode = response.statusCode;
      if (this._options.trackRedirects) {
        this._redirects.push({
          url: this._currentUrl,
          headers: response.headers,
          statusCode,
        });
      }
      var location = response.headers.location;
      if (
        !location ||
        this._options.followRedirects === false ||
        statusCode < 300 ||
        statusCode >= 400
      ) {
        response.responseUrl = this._currentUrl;
        response.redirects = this._redirects;
        this.emit('response', response);
        this._requestBodyBuffers = [];
        return;
      }
      destroyRequest(this._currentRequest);
      response.destroy();
      if (++this._redirectCount > this._options.maxRedirects) {
        throw new TooManyRedirectsError();
      }
      var requestHeaders;
      var beforeRedirect = this._options.beforeRedirect;
      if (beforeRedirect) {
        requestHeaders = Object.assign(
          {
            // The Host header was set by nativeProtocol.request
            Host: response.req.getHeader('host'),
          },
          this._options.headers,
        );
      }
      var method = this._options.method;
      if (
        ((statusCode === 301 || statusCode === 302) &&
          this._options.method === 'POST') || // RFC7231§6.4.4: The 303 (See Other) status code indicates that
        // the server is redirecting the user agent to a different resource […]
        // A user agent can perform a retrieval request targeting that URI
        // (a GET or HEAD request if using HTTP) […]
        (statusCode === 303 && !/^(?:GET|HEAD)$/.test(this._options.method))
      ) {
        this._options.method = 'GET';
        this._requestBodyBuffers = [];
        removeMatchingHeaders(/^content-/i, this._options.headers);
      }
      var currentHostHeader = removeMatchingHeaders(
        /^host$/i,
        this._options.headers,
      );
      var currentUrlParts = parseUrl(this._currentUrl);
      var currentHost = currentHostHeader || currentUrlParts.host;
      var currentUrl = /^\w+:/.test(location)
        ? this._currentUrl
        : url.format(Object.assign(currentUrlParts, { host: currentHost }));
      var redirectUrl = resolveUrl(location, currentUrl);
      debug('redirecting to', redirectUrl.href);
      this._isRedirect = true;
      spreadUrlObject(redirectUrl, this._options);
      if (
        (redirectUrl.protocol !== currentUrlParts.protocol &&
          redirectUrl.protocol !== 'https:') ||
        (redirectUrl.host !== currentHost &&
          !isSubdomain(redirectUrl.host, currentHost))
      ) {
        removeMatchingHeaders(this._headerFilter, this._options.headers);
      }
      if (isFunction(beforeRedirect)) {
        var responseDetails = {
          headers: response.headers,
          statusCode,
        };
        var requestDetails = {
          url: currentUrl,
          method,
          headers: requestHeaders,
        };
        beforeRedirect(this._options, responseDetails, requestDetails);
        this._sanitizeOptions(this._options);
      }
      this._performRequest();
    };
    function wrap(protocols) {
      var exports3 = {
        maxRedirects: 21,
        maxBodyLength: 10 * 1024 * 1024,
      };
      var nativeProtocols = {};
      Object.keys(protocols).forEach(function (scheme) {
        var protocol = scheme + ':';
        var nativeProtocol = (nativeProtocols[protocol] = protocols[scheme]);
        var wrappedProtocol = (exports3[scheme] =
          Object.create(nativeProtocol));
        function request(input, options, callback) {
          if (isURL(input)) {
            input = spreadUrlObject(input);
          } else if (isString(input)) {
            input = spreadUrlObject(parseUrl(input));
          } else {
            callback = options;
            options = validateUrl(input);
            input = { protocol };
          }
          if (isFunction(options)) {
            callback = options;
            options = null;
          }
          options = Object.assign(
            {
              maxRedirects: exports3.maxRedirects,
              maxBodyLength: exports3.maxBodyLength,
            },
            input,
            options,
          );
          options.nativeProtocols = nativeProtocols;
          if (!isString(options.host) && !isString(options.hostname)) {
            options.hostname = '::1';
          }
          assert.equal(options.protocol, protocol, 'protocol mismatch');
          debug('options', options);
          return new RedirectableRequest(options, callback);
        }
        function get(input, options, callback) {
          var wrappedRequest = wrappedProtocol.request(
            input,
            options,
            callback,
          );
          wrappedRequest.end();
          return wrappedRequest;
        }
        Object.defineProperties(wrappedProtocol, {
          request: {
            value: request,
            configurable: true,
            enumerable: true,
            writable: true,
          },
          get: {
            value: get,
            configurable: true,
            enumerable: true,
            writable: true,
          },
        });
      });
      return exports3;
    }
    function noop() {}
    function parseUrl(input) {
      var parsed;
      if (useNativeURL) {
        parsed = new URL2(input);
      } else {
        parsed = validateUrl(url.parse(input));
        if (!isString(parsed.protocol)) {
          throw new InvalidUrlError({ input });
        }
      }
      return parsed;
    }
    function resolveUrl(relative, base) {
      return useNativeURL
        ? new URL2(relative, base)
        : parseUrl(url.resolve(base, relative));
    }
    function validateUrl(input) {
      if (
        /^\[/.test(input.hostname) &&
        !/^\[[:0-9a-f]+\]$/i.test(input.hostname)
      ) {
        throw new InvalidUrlError({ input: input.href || input });
      }
      if (
        /^\[/.test(input.host) &&
        !/^\[[:0-9a-f]+\](:\d+)?$/i.test(input.host)
      ) {
        throw new InvalidUrlError({ input: input.href || input });
      }
      return input;
    }
    function spreadUrlObject(urlObject, target) {
      var spread = target || {};
      for (var key of preservedUrlFields) {
        spread[key] = urlObject[key];
      }
      if (spread.hostname.startsWith('[')) {
        spread.hostname = spread.hostname.slice(1, -1);
      }
      if (spread.port !== '') {
        spread.port = Number(spread.port);
      }
      spread.path = spread.search
        ? spread.pathname + spread.search
        : spread.pathname;
      return spread;
    }
    function removeMatchingHeaders(regex, headers) {
      var lastValue;
      for (var header in headers) {
        if (regex.test(header)) {
          lastValue = headers[header];
          delete headers[header];
        }
      }
      return lastValue === null || typeof lastValue === 'undefined'
        ? void 0
        : String(lastValue).trim();
    }
    function createErrorType(code, message, baseClass) {
      function CustomError(properties) {
        if (isFunction(Error.captureStackTrace)) {
          Error.captureStackTrace(this, this.constructor);
        }
        Object.assign(this, properties || {});
        this.code = code;
        this.message = this.cause
          ? message + ': ' + this.cause.message
          : message;
      }
      CustomError.prototype = new (baseClass || Error)();
      Object.defineProperties(CustomError.prototype, {
        constructor: {
          value: CustomError,
          enumerable: false,
        },
        name: {
          value: 'Error [' + code + ']',
          enumerable: false,
        },
      });
      return CustomError;
    }
    function destroyRequest(request, error) {
      for (var event of events) {
        request.removeListener(event, eventHandlers[event]);
      }
      request.on('error', noop);
      request.destroy(error);
    }
    function isSubdomain(subdomain, domain) {
      assert(isString(subdomain) && isString(domain));
      var dot = subdomain.length - domain.length - 1;
      return dot > 0 && subdomain[dot] === '.' && subdomain.endsWith(domain);
    }
    function isArray(value) {
      return value instanceof Array;
    }
    function isString(value) {
      return typeof value === 'string' || value instanceof String;
    }
    function isFunction(value) {
      return typeof value === 'function';
    }
    function isBuffer(value) {
      return typeof value === 'object' && 'length' in value;
    }
    function isURL(value) {
      return URL2 && value instanceof URL2;
    }
    function escapeRegex(regex) {
      return regex.replace(/[\]\\/()*+?.$]/g, '\\$&');
    }
    module2.exports = wrap({ http: http3, https: https2 });
    module2.exports.wrap = wrap;
  },
});

// node_modules/axios/lib/env/data.js
var require_data = __commonJS({
  'node_modules/axios/lib/env/data.js'(exports2, module2) {
    module2.exports = {
      version: '0.27.2',
    };
  },
});

// node_modules/axios/lib/adapters/http.js
var require_http = __commonJS({
  'node_modules/axios/lib/adapters/http.js'(exports2, module2) {
    'use strict';
    var utils = require_utils3();
    var settle = require_settle();
    var buildFullPath = require_buildFullPath();
    var buildURL = require_buildURL();
    var http3 = require('http');
    var https2 = require('https');
    var httpFollow = require_follow_redirects().http;
    var httpsFollow = require_follow_redirects().https;
    var url = require('url');
    var zlib = require('zlib');
    var VERSION = require_data().version;
    var transitionalDefaults = require_transitional();
    var AxiosError = require_AxiosError();
    var CanceledError = require_CanceledError();
    var isHttps = /https:?/;
    var supportedProtocols = ['http:', 'https:', 'file:'];
    function setProxy(options, proxy, location) {
      options.hostname = proxy.host;
      options.host = proxy.host;
      options.port = proxy.port;
      options.path = location;
      if (proxy.auth) {
        var base64 = Buffer.from(
          proxy.auth.username + ':' + proxy.auth.password,
          'utf8',
        ).toString('base64');
        options.headers['Proxy-Authorization'] = 'Basic ' + base64;
      }
      options.beforeRedirect = function beforeRedirect(redirection) {
        redirection.headers.host = redirection.host;
        setProxy(redirection, proxy, redirection.href);
      };
    }
    module2.exports = function httpAdapter(config) {
      return new Promise(function dispatchHttpRequest(
        resolvePromise,
        rejectPromise,
      ) {
        var onCanceled;
        function done() {
          if (config.cancelToken) {
            config.cancelToken.unsubscribe(onCanceled);
          }
          if (config.signal) {
            config.signal.removeEventListener('abort', onCanceled);
          }
        }
        var resolve = function resolve2(value) {
          done();
          resolvePromise(value);
        };
        var rejected = false;
        var reject = function reject2(value) {
          done();
          rejected = true;
          rejectPromise(value);
        };
        var data = config.data;
        var headers = config.headers;
        var headerNames = {};
        Object.keys(headers).forEach(function storeLowerName(name) {
          headerNames[name.toLowerCase()] = name;
        });
        if ('user-agent' in headerNames) {
          if (!headers[headerNames['user-agent']]) {
            delete headers[headerNames['user-agent']];
          }
        } else {
          headers['User-Agent'] = 'axios/' + VERSION;
        }
        if (utils.isFormData(data) && utils.isFunction(data.getHeaders)) {
          Object.assign(headers, data.getHeaders());
        } else if (data && !utils.isStream(data)) {
          if (Buffer.isBuffer(data)) {
          } else if (utils.isArrayBuffer(data)) {
            data = Buffer.from(new Uint8Array(data));
          } else if (utils.isString(data)) {
            data = Buffer.from(data, 'utf-8');
          } else {
            return reject(
              new AxiosError(
                'Data after transformation must be a string, an ArrayBuffer, a Buffer, or a Stream',
                AxiosError.ERR_BAD_REQUEST,
                config,
              ),
            );
          }
          if (config.maxBodyLength > -1 && data.length > config.maxBodyLength) {
            return reject(
              new AxiosError(
                'Request body larger than maxBodyLength limit',
                AxiosError.ERR_BAD_REQUEST,
                config,
              ),
            );
          }
          if (!headerNames['content-length']) {
            headers['Content-Length'] = data.length;
          }
        }
        var auth = void 0;
        if (config.auth) {
          var username = config.auth.username || '';
          var password = config.auth.password || '';
          auth = username + ':' + password;
        }
        var fullPath = buildFullPath(config.baseURL, config.url);
        var parsed = url.parse(fullPath);
        var protocol = parsed.protocol || supportedProtocols[0];
        if (supportedProtocols.indexOf(protocol) === -1) {
          return reject(
            new AxiosError(
              'Unsupported protocol ' + protocol,
              AxiosError.ERR_BAD_REQUEST,
              config,
            ),
          );
        }
        if (!auth && parsed.auth) {
          var urlAuth = parsed.auth.split(':');
          var urlUsername = urlAuth[0] || '';
          var urlPassword = urlAuth[1] || '';
          auth = urlUsername + ':' + urlPassword;
        }
        if (auth && headerNames.authorization) {
          delete headers[headerNames.authorization];
        }
        var isHttpsRequest = isHttps.test(protocol);
        var agent = isHttpsRequest ? config.httpsAgent : config.httpAgent;
        try {
          buildURL(parsed.path, config.params, config.paramsSerializer).replace(
            /^\?/,
            '',
          );
        } catch (err) {
          var customErr = new Error(err.message);
          customErr.config = config;
          customErr.url = config.url;
          customErr.exists = true;
          reject(customErr);
        }
        var options = {
          path: buildURL(
            parsed.path,
            config.params,
            config.paramsSerializer,
          ).replace(/^\?/, ''),
          method: config.method.toUpperCase(),
          headers,
          agent,
          agents: { http: config.httpAgent, https: config.httpsAgent },
          auth,
        };
        if (config.socketPath) {
          options.socketPath = config.socketPath;
        } else {
          options.hostname = parsed.hostname;
          options.port = parsed.port;
        }
        var proxy = config.proxy;
        if (!proxy && proxy !== false) {
          var proxyEnv = protocol.slice(0, -1) + '_proxy';
          var proxyUrl =
            process.env[proxyEnv] || process.env[proxyEnv.toUpperCase()];
          if (proxyUrl) {
            var parsedProxyUrl = url.parse(proxyUrl);
            var noProxyEnv = process.env.no_proxy || process.env.NO_PROXY;
            var shouldProxy = true;
            if (noProxyEnv) {
              var noProxy = noProxyEnv.split(',').map(function trim(s) {
                return s.trim();
              });
              shouldProxy = !noProxy.some(function proxyMatch(proxyElement) {
                if (!proxyElement) {
                  return false;
                }
                if (proxyElement === '*') {
                  return true;
                }
                if (
                  proxyElement[0] === '.' &&
                  parsed.hostname.substr(
                    parsed.hostname.length - proxyElement.length,
                  ) === proxyElement
                ) {
                  return true;
                }
                return parsed.hostname === proxyElement;
              });
            }
            if (shouldProxy) {
              proxy = {
                host: parsedProxyUrl.hostname,
                port: parsedProxyUrl.port,
                protocol: parsedProxyUrl.protocol,
              };
              if (parsedProxyUrl.auth) {
                var proxyUrlAuth = parsedProxyUrl.auth.split(':');
                proxy.auth = {
                  username: proxyUrlAuth[0],
                  password: proxyUrlAuth[1],
                };
              }
            }
          }
        }
        if (proxy) {
          options.headers.host =
            parsed.hostname + (parsed.port ? ':' + parsed.port : '');
          setProxy(
            options,
            proxy,
            protocol +
              '//' +
              parsed.hostname +
              (parsed.port ? ':' + parsed.port : '') +
              options.path,
          );
        }
        var transport;
        var isHttpsProxy =
          isHttpsRequest && (proxy ? isHttps.test(proxy.protocol) : true);
        if (config.transport) {
          transport = config.transport;
        } else if (config.maxRedirects === 0) {
          transport = isHttpsProxy ? https2 : http3;
        } else {
          if (config.maxRedirects) {
            options.maxRedirects = config.maxRedirects;
          }
          if (config.beforeRedirect) {
            options.beforeRedirect = config.beforeRedirect;
          }
          transport = isHttpsProxy ? httpsFollow : httpFollow;
        }
        if (config.maxBodyLength > -1) {
          options.maxBodyLength = config.maxBodyLength;
        }
        if (config.insecureHTTPParser) {
          options.insecureHTTPParser = config.insecureHTTPParser;
        }
        var req2 = transport.request(options, function handleResponse(res) {
          if (req2.aborted) return;
          var stream = res;
          var lastRequest = res.req || req2;
          if (
            res.statusCode !== 204 &&
            lastRequest.method !== 'HEAD' &&
            config.decompress !== false
          ) {
            switch (res.headers['content-encoding']) {
              /*eslint default-case:0*/
              case 'gzip':
              case 'compress':
              case 'deflate':
                stream = stream.pipe(zlib.createUnzip());
                delete res.headers['content-encoding'];
                break;
            }
          }
          var response = {
            status: res.statusCode,
            statusText: res.statusMessage,
            headers: res.headers,
            config,
            request: lastRequest,
          };
          if (config.responseType === 'stream') {
            response.data = stream;
            settle(resolve, reject, response);
          } else {
            var responseBuffer = [];
            var totalResponseBytes = 0;
            stream.on('data', function handleStreamData(chunk) {
              responseBuffer.push(chunk);
              totalResponseBytes += chunk.length;
              if (
                config.maxContentLength > -1 &&
                totalResponseBytes > config.maxContentLength
              ) {
                rejected = true;
                stream.destroy();
                reject(
                  new AxiosError(
                    'maxContentLength size of ' +
                      config.maxContentLength +
                      ' exceeded',
                    AxiosError.ERR_BAD_RESPONSE,
                    config,
                    lastRequest,
                  ),
                );
              }
            });
            stream.on('aborted', function handlerStreamAborted() {
              if (rejected) {
                return;
              }
              stream.destroy();
              reject(
                new AxiosError(
                  'maxContentLength size of ' +
                    config.maxContentLength +
                    ' exceeded',
                  AxiosError.ERR_BAD_RESPONSE,
                  config,
                  lastRequest,
                ),
              );
            });
            stream.on('error', function handleStreamError(err) {
              if (req2.aborted) return;
              reject(AxiosError.from(err, null, config, lastRequest));
            });
            stream.on('end', function handleStreamEnd() {
              try {
                var responseData =
                  responseBuffer.length === 1
                    ? responseBuffer[0]
                    : Buffer.concat(responseBuffer);
                if (config.responseType !== 'arraybuffer') {
                  responseData = responseData.toString(config.responseEncoding);
                  if (
                    !config.responseEncoding ||
                    config.responseEncoding === 'utf8'
                  ) {
                    responseData = utils.stripBOM(responseData);
                  }
                }
                response.data = responseData;
              } catch (err) {
                reject(
                  AxiosError.from(
                    err,
                    null,
                    config,
                    response.request,
                    response,
                  ),
                );
              }
              settle(resolve, reject, response);
            });
          }
        });
        req2.on('error', function handleRequestError(err) {
          reject(AxiosError.from(err, null, config, req2));
        });
        req2.on('socket', function handleRequestSocket(socket) {
          socket.setKeepAlive(true, 1e3 * 60);
        });
        if (config.timeout) {
          var timeout = parseInt(config.timeout, 10);
          if (isNaN(timeout)) {
            reject(
              new AxiosError(
                'error trying to parse `config.timeout` to int',
                AxiosError.ERR_BAD_OPTION_VALUE,
                config,
                req2,
              ),
            );
            return;
          }
          req2.setTimeout(timeout, function handleRequestTimeout() {
            req2.abort();
            var transitional = config.transitional || transitionalDefaults;
            reject(
              new AxiosError(
                'timeout of ' + timeout + 'ms exceeded',
                transitional.clarifyTimeoutError
                  ? AxiosError.ETIMEDOUT
                  : AxiosError.ECONNABORTED,
                config,
                req2,
              ),
            );
          });
        }
        if (config.cancelToken || config.signal) {
          onCanceled = function (cancel) {
            if (req2.aborted) return;
            req2.abort();
            reject(
              !cancel || (cancel && cancel.type) ? new CanceledError() : cancel,
            );
          };
          config.cancelToken && config.cancelToken.subscribe(onCanceled);
          if (config.signal) {
            config.signal.aborted
              ? onCanceled()
              : config.signal.addEventListener('abort', onCanceled);
          }
        }
        if (utils.isStream(data)) {
          data
            .on('error', function handleStreamError(err) {
              reject(AxiosError.from(err, config, null, req2));
            })
            .pipe(req2);
        } else {
          req2.end(data);
        }
      });
    };
  },
});

// node_modules/delayed-stream/lib/delayed_stream.js
var require_delayed_stream = __commonJS({
  'node_modules/delayed-stream/lib/delayed_stream.js'(exports2, module2) {
    var Stream = require('stream').Stream;
    var util2 = require('util');
    module2.exports = DelayedStream;
    function DelayedStream() {
      this.source = null;
      this.dataSize = 0;
      this.maxDataSize = 1024 * 1024;
      this.pauseStream = true;
      this._maxDataSizeExceeded = false;
      this._released = false;
      this._bufferedEvents = [];
    }
    util2.inherits(DelayedStream, Stream);
    DelayedStream.create = function (source, options) {
      var delayedStream = new this();
      options = options || {};
      for (var option in options) {
        delayedStream[option] = options[option];
      }
      delayedStream.source = source;
      var realEmit = source.emit;
      source.emit = function () {
        delayedStream._handleEmit(arguments);
        return realEmit.apply(source, arguments);
      };
      source.on('error', function () {});
      if (delayedStream.pauseStream) {
        source.pause();
      }
      return delayedStream;
    };
    Object.defineProperty(DelayedStream.prototype, 'readable', {
      configurable: true,
      enumerable: true,
      get: function () {
        return this.source.readable;
      },
    });
    DelayedStream.prototype.setEncoding = function () {
      return this.source.setEncoding.apply(this.source, arguments);
    };
    DelayedStream.prototype.resume = function () {
      if (!this._released) {
        this.release();
      }
      this.source.resume();
    };
    DelayedStream.prototype.pause = function () {
      this.source.pause();
    };
    DelayedStream.prototype.release = function () {
      this._released = true;
      this._bufferedEvents.forEach(
        function (args) {
          this.emit.apply(this, args);
        }.bind(this),
      );
      this._bufferedEvents = [];
    };
    DelayedStream.prototype.pipe = function () {
      var r = Stream.prototype.pipe.apply(this, arguments);
      this.resume();
      return r;
    };
    DelayedStream.prototype._handleEmit = function (args) {
      if (this._released) {
        this.emit.apply(this, args);
        return;
      }
      if (args[0] === 'data') {
        this.dataSize += args[1].length;
        this._checkIfMaxDataSizeExceeded();
      }
      this._bufferedEvents.push(args);
    };
    DelayedStream.prototype._checkIfMaxDataSizeExceeded = function () {
      if (this._maxDataSizeExceeded) {
        return;
      }
      if (this.dataSize <= this.maxDataSize) {
        return;
      }
      this._maxDataSizeExceeded = true;
      var message =
        'DelayedStream#maxDataSize of ' + this.maxDataSize + ' bytes exceeded.';
      this.emit('error', new Error(message));
    };
  },
});

// node_modules/combined-stream/lib/combined_stream.js
var require_combined_stream = __commonJS({
  'node_modules/combined-stream/lib/combined_stream.js'(exports2, module2) {
    var util2 = require('util');
    var Stream = require('stream').Stream;
    var DelayedStream = require_delayed_stream();
    module2.exports = CombinedStream;
    function CombinedStream() {
      this.writable = false;
      this.readable = true;
      this.dataSize = 0;
      this.maxDataSize = 2 * 1024 * 1024;
      this.pauseStreams = true;
      this._released = false;
      this._streams = [];
      this._currentStream = null;
      this._insideLoop = false;
      this._pendingNext = false;
    }
    util2.inherits(CombinedStream, Stream);
    CombinedStream.create = function (options) {
      var combinedStream = new this();
      options = options || {};
      for (var option in options) {
        combinedStream[option] = options[option];
      }
      return combinedStream;
    };
    CombinedStream.isStreamLike = function (stream) {
      return (
        typeof stream !== 'function' &&
        typeof stream !== 'string' &&
        typeof stream !== 'boolean' &&
        typeof stream !== 'number' &&
        !Buffer.isBuffer(stream)
      );
    };
    CombinedStream.prototype.append = function (stream) {
      var isStreamLike = CombinedStream.isStreamLike(stream);
      if (isStreamLike) {
        if (!(stream instanceof DelayedStream)) {
          var newStream = DelayedStream.create(stream, {
            maxDataSize: Infinity,
            pauseStream: this.pauseStreams,
          });
          stream.on('data', this._checkDataSize.bind(this));
          stream = newStream;
        }
        this._handleErrors(stream);
        if (this.pauseStreams) {
          stream.pause();
        }
      }
      this._streams.push(stream);
      return this;
    };
    CombinedStream.prototype.pipe = function (dest, options) {
      Stream.prototype.pipe.call(this, dest, options);
      this.resume();
      return dest;
    };
    CombinedStream.prototype._getNext = function () {
      this._currentStream = null;
      if (this._insideLoop) {
        this._pendingNext = true;
        return;
      }
      this._insideLoop = true;
      try {
        do {
          this._pendingNext = false;
          this._realGetNext();
        } while (this._pendingNext);
      } finally {
        this._insideLoop = false;
      }
    };
    CombinedStream.prototype._realGetNext = function () {
      var stream = this._streams.shift();
      if (typeof stream == 'undefined') {
        this.end();
        return;
      }
      if (typeof stream !== 'function') {
        this._pipeNext(stream);
        return;
      }
      var getStream = stream;
      getStream(
        function (stream2) {
          var isStreamLike = CombinedStream.isStreamLike(stream2);
          if (isStreamLike) {
            stream2.on('data', this._checkDataSize.bind(this));
            this._handleErrors(stream2);
          }
          this._pipeNext(stream2);
        }.bind(this),
      );
    };
    CombinedStream.prototype._pipeNext = function (stream) {
      this._currentStream = stream;
      var isStreamLike = CombinedStream.isStreamLike(stream);
      if (isStreamLike) {
        stream.on('end', this._getNext.bind(this));
        stream.pipe(this, { end: false });
        return;
      }
      var value = stream;
      this.write(value);
      this._getNext();
    };
    CombinedStream.prototype._handleErrors = function (stream) {
      var self = this;
      stream.on('error', function (err) {
        self._emitError(err);
      });
    };
    CombinedStream.prototype.write = function (data) {
      this.emit('data', data);
    };
    CombinedStream.prototype.pause = function () {
      if (!this.pauseStreams) {
        return;
      }
      if (
        this.pauseStreams &&
        this._currentStream &&
        typeof this._currentStream.pause == 'function'
      )
        this._currentStream.pause();
      this.emit('pause');
    };
    CombinedStream.prototype.resume = function () {
      if (!this._released) {
        this._released = true;
        this.writable = true;
        this._getNext();
      }
      if (
        this.pauseStreams &&
        this._currentStream &&
        typeof this._currentStream.resume == 'function'
      )
        this._currentStream.resume();
      this.emit('resume');
    };
    CombinedStream.prototype.end = function () {
      this._reset();
      this.emit('end');
    };
    CombinedStream.prototype.destroy = function () {
      this._reset();
      this.emit('close');
    };
    CombinedStream.prototype._reset = function () {
      this.writable = false;
      this._streams = [];
      this._currentStream = null;
    };
    CombinedStream.prototype._checkDataSize = function () {
      this._updateDataSize();
      if (this.dataSize <= this.maxDataSize) {
        return;
      }
      var message =
        'DelayedStream#maxDataSize of ' + this.maxDataSize + ' bytes exceeded.';
      this._emitError(new Error(message));
    };
    CombinedStream.prototype._updateDataSize = function () {
      this.dataSize = 0;
      var self = this;
      this._streams.forEach(function (stream) {
        if (!stream.dataSize) {
          return;
        }
        self.dataSize += stream.dataSize;
      });
      if (this._currentStream && this._currentStream.dataSize) {
        this.dataSize += this._currentStream.dataSize;
      }
    };
    CombinedStream.prototype._emitError = function (err) {
      this._reset();
      this.emit('error', err);
    };
  },
});

// node_modules/mime-db/db.json
var require_db = __commonJS({
  'node_modules/mime-db/db.json'(exports2, module2) {
    module2.exports = {
      'application/1d-interleaved-parityfec': {
        source: 'iana',
      },
      'application/3gpdash-qoe-report+xml': {
        source: 'iana',
        charset: 'UTF-8',
        compressible: true,
      },
      'application/3gpp-ims+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/3gpphal+json': {
        source: 'iana',
        compressible: true,
      },
      'application/3gpphalforms+json': {
        source: 'iana',
        compressible: true,
      },
      'application/a2l': {
        source: 'iana',
      },
      'application/ace+cbor': {
        source: 'iana',
      },
      'application/activemessage': {
        source: 'iana',
      },
      'application/activity+json': {
        source: 'iana',
        compressible: true,
      },
      'application/alto-costmap+json': {
        source: 'iana',
        compressible: true,
      },
      'application/alto-costmapfilter+json': {
        source: 'iana',
        compressible: true,
      },
      'application/alto-directory+json': {
        source: 'iana',
        compressible: true,
      },
      'application/alto-endpointcost+json': {
        source: 'iana',
        compressible: true,
      },
      'application/alto-endpointcostparams+json': {
        source: 'iana',
        compressible: true,
      },
      'application/alto-endpointprop+json': {
        source: 'iana',
        compressible: true,
      },
      'application/alto-endpointpropparams+json': {
        source: 'iana',
        compressible: true,
      },
      'application/alto-error+json': {
        source: 'iana',
        compressible: true,
      },
      'application/alto-networkmap+json': {
        source: 'iana',
        compressible: true,
      },
      'application/alto-networkmapfilter+json': {
        source: 'iana',
        compressible: true,
      },
      'application/alto-updatestreamcontrol+json': {
        source: 'iana',
        compressible: true,
      },
      'application/alto-updatestreamparams+json': {
        source: 'iana',
        compressible: true,
      },
      'application/aml': {
        source: 'iana',
      },
      'application/andrew-inset': {
        source: 'iana',
        extensions: ['ez'],
      },
      'application/applefile': {
        source: 'iana',
      },
      'application/applixware': {
        source: 'apache',
        extensions: ['aw'],
      },
      'application/at+jwt': {
        source: 'iana',
      },
      'application/atf': {
        source: 'iana',
      },
      'application/atfx': {
        source: 'iana',
      },
      'application/atom+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['atom'],
      },
      'application/atomcat+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['atomcat'],
      },
      'application/atomdeleted+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['atomdeleted'],
      },
      'application/atomicmail': {
        source: 'iana',
      },
      'application/atomsvc+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['atomsvc'],
      },
      'application/atsc-dwd+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['dwd'],
      },
      'application/atsc-dynamic-event-message': {
        source: 'iana',
      },
      'application/atsc-held+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['held'],
      },
      'application/atsc-rdt+json': {
        source: 'iana',
        compressible: true,
      },
      'application/atsc-rsat+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['rsat'],
      },
      'application/atxml': {
        source: 'iana',
      },
      'application/auth-policy+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/bacnet-xdd+zip': {
        source: 'iana',
        compressible: false,
      },
      'application/batch-smtp': {
        source: 'iana',
      },
      'application/bdoc': {
        compressible: false,
        extensions: ['bdoc'],
      },
      'application/beep+xml': {
        source: 'iana',
        charset: 'UTF-8',
        compressible: true,
      },
      'application/calendar+json': {
        source: 'iana',
        compressible: true,
      },
      'application/calendar+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['xcs'],
      },
      'application/call-completion': {
        source: 'iana',
      },
      'application/cals-1840': {
        source: 'iana',
      },
      'application/captive+json': {
        source: 'iana',
        compressible: true,
      },
      'application/cbor': {
        source: 'iana',
      },
      'application/cbor-seq': {
        source: 'iana',
      },
      'application/cccex': {
        source: 'iana',
      },
      'application/ccmp+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/ccxml+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['ccxml'],
      },
      'application/cdfx+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['cdfx'],
      },
      'application/cdmi-capability': {
        source: 'iana',
        extensions: ['cdmia'],
      },
      'application/cdmi-container': {
        source: 'iana',
        extensions: ['cdmic'],
      },
      'application/cdmi-domain': {
        source: 'iana',
        extensions: ['cdmid'],
      },
      'application/cdmi-object': {
        source: 'iana',
        extensions: ['cdmio'],
      },
      'application/cdmi-queue': {
        source: 'iana',
        extensions: ['cdmiq'],
      },
      'application/cdni': {
        source: 'iana',
      },
      'application/cea': {
        source: 'iana',
      },
      'application/cea-2018+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/cellml+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/cfw': {
        source: 'iana',
      },
      'application/city+json': {
        source: 'iana',
        compressible: true,
      },
      'application/clr': {
        source: 'iana',
      },
      'application/clue+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/clue_info+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/cms': {
        source: 'iana',
      },
      'application/cnrp+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/coap-group+json': {
        source: 'iana',
        compressible: true,
      },
      'application/coap-payload': {
        source: 'iana',
      },
      'application/commonground': {
        source: 'iana',
      },
      'application/conference-info+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/cose': {
        source: 'iana',
      },
      'application/cose-key': {
        source: 'iana',
      },
      'application/cose-key-set': {
        source: 'iana',
      },
      'application/cpl+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['cpl'],
      },
      'application/csrattrs': {
        source: 'iana',
      },
      'application/csta+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/cstadata+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/csvm+json': {
        source: 'iana',
        compressible: true,
      },
      'application/cu-seeme': {
        source: 'apache',
        extensions: ['cu'],
      },
      'application/cwt': {
        source: 'iana',
      },
      'application/cybercash': {
        source: 'iana',
      },
      'application/dart': {
        compressible: true,
      },
      'application/dash+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['mpd'],
      },
      'application/dash-patch+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['mpp'],
      },
      'application/dashdelta': {
        source: 'iana',
      },
      'application/davmount+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['davmount'],
      },
      'application/dca-rft': {
        source: 'iana',
      },
      'application/dcd': {
        source: 'iana',
      },
      'application/dec-dx': {
        source: 'iana',
      },
      'application/dialog-info+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/dicom': {
        source: 'iana',
      },
      'application/dicom+json': {
        source: 'iana',
        compressible: true,
      },
      'application/dicom+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/dii': {
        source: 'iana',
      },
      'application/dit': {
        source: 'iana',
      },
      'application/dns': {
        source: 'iana',
      },
      'application/dns+json': {
        source: 'iana',
        compressible: true,
      },
      'application/dns-message': {
        source: 'iana',
      },
      'application/docbook+xml': {
        source: 'apache',
        compressible: true,
        extensions: ['dbk'],
      },
      'application/dots+cbor': {
        source: 'iana',
      },
      'application/dskpp+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/dssc+der': {
        source: 'iana',
        extensions: ['dssc'],
      },
      'application/dssc+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['xdssc'],
      },
      'application/dvcs': {
        source: 'iana',
      },
      'application/ecmascript': {
        source: 'iana',
        compressible: true,
        extensions: ['es', 'ecma'],
      },
      'application/edi-consent': {
        source: 'iana',
      },
      'application/edi-x12': {
        source: 'iana',
        compressible: false,
      },
      'application/edifact': {
        source: 'iana',
        compressible: false,
      },
      'application/efi': {
        source: 'iana',
      },
      'application/elm+json': {
        source: 'iana',
        charset: 'UTF-8',
        compressible: true,
      },
      'application/elm+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/emergencycalldata.cap+xml': {
        source: 'iana',
        charset: 'UTF-8',
        compressible: true,
      },
      'application/emergencycalldata.comment+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/emergencycalldata.control+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/emergencycalldata.deviceinfo+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/emergencycalldata.ecall.msd': {
        source: 'iana',
      },
      'application/emergencycalldata.providerinfo+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/emergencycalldata.serviceinfo+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/emergencycalldata.subscriberinfo+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/emergencycalldata.veds+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/emma+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['emma'],
      },
      'application/emotionml+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['emotionml'],
      },
      'application/encaprtp': {
        source: 'iana',
      },
      'application/epp+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/epub+zip': {
        source: 'iana',
        compressible: false,
        extensions: ['epub'],
      },
      'application/eshop': {
        source: 'iana',
      },
      'application/exi': {
        source: 'iana',
        extensions: ['exi'],
      },
      'application/expect-ct-report+json': {
        source: 'iana',
        compressible: true,
      },
      'application/express': {
        source: 'iana',
        extensions: ['exp'],
      },
      'application/fastinfoset': {
        source: 'iana',
      },
      'application/fastsoap': {
        source: 'iana',
      },
      'application/fdt+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['fdt'],
      },
      'application/fhir+json': {
        source: 'iana',
        charset: 'UTF-8',
        compressible: true,
      },
      'application/fhir+xml': {
        source: 'iana',
        charset: 'UTF-8',
        compressible: true,
      },
      'application/fido.trusted-apps+json': {
        compressible: true,
      },
      'application/fits': {
        source: 'iana',
      },
      'application/flexfec': {
        source: 'iana',
      },
      'application/font-sfnt': {
        source: 'iana',
      },
      'application/font-tdpfr': {
        source: 'iana',
        extensions: ['pfr'],
      },
      'application/font-woff': {
        source: 'iana',
        compressible: false,
      },
      'application/framework-attributes+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/geo+json': {
        source: 'iana',
        compressible: true,
        extensions: ['geojson'],
      },
      'application/geo+json-seq': {
        source: 'iana',
      },
      'application/geopackage+sqlite3': {
        source: 'iana',
      },
      'application/geoxacml+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/gltf-buffer': {
        source: 'iana',
      },
      'application/gml+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['gml'],
      },
      'application/gpx+xml': {
        source: 'apache',
        compressible: true,
        extensions: ['gpx'],
      },
      'application/gxf': {
        source: 'apache',
        extensions: ['gxf'],
      },
      'application/gzip': {
        source: 'iana',
        compressible: false,
        extensions: ['gz'],
      },
      'application/h224': {
        source: 'iana',
      },
      'application/held+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/hjson': {
        extensions: ['hjson'],
      },
      'application/http': {
        source: 'iana',
      },
      'application/hyperstudio': {
        source: 'iana',
        extensions: ['stk'],
      },
      'application/ibe-key-request+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/ibe-pkg-reply+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/ibe-pp-data': {
        source: 'iana',
      },
      'application/iges': {
        source: 'iana',
      },
      'application/im-iscomposing+xml': {
        source: 'iana',
        charset: 'UTF-8',
        compressible: true,
      },
      'application/index': {
        source: 'iana',
      },
      'application/index.cmd': {
        source: 'iana',
      },
      'application/index.obj': {
        source: 'iana',
      },
      'application/index.response': {
        source: 'iana',
      },
      'application/index.vnd': {
        source: 'iana',
      },
      'application/inkml+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['ink', 'inkml'],
      },
      'application/iotp': {
        source: 'iana',
      },
      'application/ipfix': {
        source: 'iana',
        extensions: ['ipfix'],
      },
      'application/ipp': {
        source: 'iana',
      },
      'application/isup': {
        source: 'iana',
      },
      'application/its+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['its'],
      },
      'application/java-archive': {
        source: 'apache',
        compressible: false,
        extensions: ['jar', 'war', 'ear'],
      },
      'application/java-serialized-object': {
        source: 'apache',
        compressible: false,
        extensions: ['ser'],
      },
      'application/java-vm': {
        source: 'apache',
        compressible: false,
        extensions: ['class'],
      },
      'application/javascript': {
        source: 'iana',
        charset: 'UTF-8',
        compressible: true,
        extensions: ['js', 'mjs'],
      },
      'application/jf2feed+json': {
        source: 'iana',
        compressible: true,
      },
      'application/jose': {
        source: 'iana',
      },
      'application/jose+json': {
        source: 'iana',
        compressible: true,
      },
      'application/jrd+json': {
        source: 'iana',
        compressible: true,
      },
      'application/jscalendar+json': {
        source: 'iana',
        compressible: true,
      },
      'application/json': {
        source: 'iana',
        charset: 'UTF-8',
        compressible: true,
        extensions: ['json', 'map'],
      },
      'application/json-patch+json': {
        source: 'iana',
        compressible: true,
      },
      'application/json-seq': {
        source: 'iana',
      },
      'application/json5': {
        extensions: ['json5'],
      },
      'application/jsonml+json': {
        source: 'apache',
        compressible: true,
        extensions: ['jsonml'],
      },
      'application/jwk+json': {
        source: 'iana',
        compressible: true,
      },
      'application/jwk-set+json': {
        source: 'iana',
        compressible: true,
      },
      'application/jwt': {
        source: 'iana',
      },
      'application/kpml-request+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/kpml-response+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/ld+json': {
        source: 'iana',
        compressible: true,
        extensions: ['jsonld'],
      },
      'application/lgr+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['lgr'],
      },
      'application/link-format': {
        source: 'iana',
      },
      'application/load-control+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/lost+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['lostxml'],
      },
      'application/lostsync+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/lpf+zip': {
        source: 'iana',
        compressible: false,
      },
      'application/lxf': {
        source: 'iana',
      },
      'application/mac-binhex40': {
        source: 'iana',
        extensions: ['hqx'],
      },
      'application/mac-compactpro': {
        source: 'apache',
        extensions: ['cpt'],
      },
      'application/macwriteii': {
        source: 'iana',
      },
      'application/mads+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['mads'],
      },
      'application/manifest+json': {
        source: 'iana',
        charset: 'UTF-8',
        compressible: true,
        extensions: ['webmanifest'],
      },
      'application/marc': {
        source: 'iana',
        extensions: ['mrc'],
      },
      'application/marcxml+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['mrcx'],
      },
      'application/mathematica': {
        source: 'iana',
        extensions: ['ma', 'nb', 'mb'],
      },
      'application/mathml+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['mathml'],
      },
      'application/mathml-content+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/mathml-presentation+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/mbms-associated-procedure-description+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/mbms-deregister+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/mbms-envelope+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/mbms-msk+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/mbms-msk-response+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/mbms-protection-description+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/mbms-reception-report+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/mbms-register+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/mbms-register-response+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/mbms-schedule+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/mbms-user-service-description+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/mbox': {
        source: 'iana',
        extensions: ['mbox'],
      },
      'application/media-policy-dataset+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['mpf'],
      },
      'application/media_control+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/mediaservercontrol+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['mscml'],
      },
      'application/merge-patch+json': {
        source: 'iana',
        compressible: true,
      },
      'application/metalink+xml': {
        source: 'apache',
        compressible: true,
        extensions: ['metalink'],
      },
      'application/metalink4+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['meta4'],
      },
      'application/mets+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['mets'],
      },
      'application/mf4': {
        source: 'iana',
      },
      'application/mikey': {
        source: 'iana',
      },
      'application/mipc': {
        source: 'iana',
      },
      'application/missing-blocks+cbor-seq': {
        source: 'iana',
      },
      'application/mmt-aei+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['maei'],
      },
      'application/mmt-usd+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['musd'],
      },
      'application/mods+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['mods'],
      },
      'application/moss-keys': {
        source: 'iana',
      },
      'application/moss-signature': {
        source: 'iana',
      },
      'application/mosskey-data': {
        source: 'iana',
      },
      'application/mosskey-request': {
        source: 'iana',
      },
      'application/mp21': {
        source: 'iana',
        extensions: ['m21', 'mp21'],
      },
      'application/mp4': {
        source: 'iana',
        extensions: ['mp4s', 'm4p'],
      },
      'application/mpeg4-generic': {
        source: 'iana',
      },
      'application/mpeg4-iod': {
        source: 'iana',
      },
      'application/mpeg4-iod-xmt': {
        source: 'iana',
      },
      'application/mrb-consumer+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/mrb-publish+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/msc-ivr+xml': {
        source: 'iana',
        charset: 'UTF-8',
        compressible: true,
      },
      'application/msc-mixer+xml': {
        source: 'iana',
        charset: 'UTF-8',
        compressible: true,
      },
      'application/msword': {
        source: 'iana',
        compressible: false,
        extensions: ['doc', 'dot'],
      },
      'application/mud+json': {
        source: 'iana',
        compressible: true,
      },
      'application/multipart-core': {
        source: 'iana',
      },
      'application/mxf': {
        source: 'iana',
        extensions: ['mxf'],
      },
      'application/n-quads': {
        source: 'iana',
        extensions: ['nq'],
      },
      'application/n-triples': {
        source: 'iana',
        extensions: ['nt'],
      },
      'application/nasdata': {
        source: 'iana',
      },
      'application/news-checkgroups': {
        source: 'iana',
        charset: 'US-ASCII',
      },
      'application/news-groupinfo': {
        source: 'iana',
        charset: 'US-ASCII',
      },
      'application/news-transmission': {
        source: 'iana',
      },
      'application/nlsml+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/node': {
        source: 'iana',
        extensions: ['cjs'],
      },
      'application/nss': {
        source: 'iana',
      },
      'application/oauth-authz-req+jwt': {
        source: 'iana',
      },
      'application/oblivious-dns-message': {
        source: 'iana',
      },
      'application/ocsp-request': {
        source: 'iana',
      },
      'application/ocsp-response': {
        source: 'iana',
      },
      'application/octet-stream': {
        source: 'iana',
        compressible: false,
        extensions: [
          'bin',
          'dms',
          'lrf',
          'mar',
          'so',
          'dist',
          'distz',
          'pkg',
          'bpk',
          'dump',
          'elc',
          'deploy',
          'exe',
          'dll',
          'deb',
          'dmg',
          'iso',
          'img',
          'msi',
          'msp',
          'msm',
          'buffer',
        ],
      },
      'application/oda': {
        source: 'iana',
        extensions: ['oda'],
      },
      'application/odm+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/odx': {
        source: 'iana',
      },
      'application/oebps-package+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['opf'],
      },
      'application/ogg': {
        source: 'iana',
        compressible: false,
        extensions: ['ogx'],
      },
      'application/omdoc+xml': {
        source: 'apache',
        compressible: true,
        extensions: ['omdoc'],
      },
      'application/onenote': {
        source: 'apache',
        extensions: ['onetoc', 'onetoc2', 'onetmp', 'onepkg'],
      },
      'application/opc-nodeset+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/oscore': {
        source: 'iana',
      },
      'application/oxps': {
        source: 'iana',
        extensions: ['oxps'],
      },
      'application/p21': {
        source: 'iana',
      },
      'application/p21+zip': {
        source: 'iana',
        compressible: false,
      },
      'application/p2p-overlay+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['relo'],
      },
      'application/parityfec': {
        source: 'iana',
      },
      'application/passport': {
        source: 'iana',
      },
      'application/patch-ops-error+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['xer'],
      },
      'application/pdf': {
        source: 'iana',
        compressible: false,
        extensions: ['pdf'],
      },
      'application/pdx': {
        source: 'iana',
      },
      'application/pem-certificate-chain': {
        source: 'iana',
      },
      'application/pgp-encrypted': {
        source: 'iana',
        compressible: false,
        extensions: ['pgp'],
      },
      'application/pgp-keys': {
        source: 'iana',
        extensions: ['asc'],
      },
      'application/pgp-signature': {
        source: 'iana',
        extensions: ['asc', 'sig'],
      },
      'application/pics-rules': {
        source: 'apache',
        extensions: ['prf'],
      },
      'application/pidf+xml': {
        source: 'iana',
        charset: 'UTF-8',
        compressible: true,
      },
      'application/pidf-diff+xml': {
        source: 'iana',
        charset: 'UTF-8',
        compressible: true,
      },
      'application/pkcs10': {
        source: 'iana',
        extensions: ['p10'],
      },
      'application/pkcs12': {
        source: 'iana',
      },
      'application/pkcs7-mime': {
        source: 'iana',
        extensions: ['p7m', 'p7c'],
      },
      'application/pkcs7-signature': {
        source: 'iana',
        extensions: ['p7s'],
      },
      'application/pkcs8': {
        source: 'iana',
        extensions: ['p8'],
      },
      'application/pkcs8-encrypted': {
        source: 'iana',
      },
      'application/pkix-attr-cert': {
        source: 'iana',
        extensions: ['ac'],
      },
      'application/pkix-cert': {
        source: 'iana',
        extensions: ['cer'],
      },
      'application/pkix-crl': {
        source: 'iana',
        extensions: ['crl'],
      },
      'application/pkix-pkipath': {
        source: 'iana',
        extensions: ['pkipath'],
      },
      'application/pkixcmp': {
        source: 'iana',
        extensions: ['pki'],
      },
      'application/pls+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['pls'],
      },
      'application/poc-settings+xml': {
        source: 'iana',
        charset: 'UTF-8',
        compressible: true,
      },
      'application/postscript': {
        source: 'iana',
        compressible: true,
        extensions: ['ai', 'eps', 'ps'],
      },
      'application/ppsp-tracker+json': {
        source: 'iana',
        compressible: true,
      },
      'application/problem+json': {
        source: 'iana',
        compressible: true,
      },
      'application/problem+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/provenance+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['provx'],
      },
      'application/prs.alvestrand.titrax-sheet': {
        source: 'iana',
      },
      'application/prs.cww': {
        source: 'iana',
        extensions: ['cww'],
      },
      'application/prs.cyn': {
        source: 'iana',
        charset: '7-BIT',
      },
      'application/prs.hpub+zip': {
        source: 'iana',
        compressible: false,
      },
      'application/prs.nprend': {
        source: 'iana',
      },
      'application/prs.plucker': {
        source: 'iana',
      },
      'application/prs.rdf-xml-crypt': {
        source: 'iana',
      },
      'application/prs.xsf+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/pskc+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['pskcxml'],
      },
      'application/pvd+json': {
        source: 'iana',
        compressible: true,
      },
      'application/qsig': {
        source: 'iana',
      },
      'application/raml+yaml': {
        compressible: true,
        extensions: ['raml'],
      },
      'application/raptorfec': {
        source: 'iana',
      },
      'application/rdap+json': {
        source: 'iana',
        compressible: true,
      },
      'application/rdf+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['rdf', 'owl'],
      },
      'application/reginfo+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['rif'],
      },
      'application/relax-ng-compact-syntax': {
        source: 'iana',
        extensions: ['rnc'],
      },
      'application/remote-printing': {
        source: 'iana',
      },
      'application/reputon+json': {
        source: 'iana',
        compressible: true,
      },
      'application/resource-lists+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['rl'],
      },
      'application/resource-lists-diff+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['rld'],
      },
      'application/rfc+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/riscos': {
        source: 'iana',
      },
      'application/rlmi+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/rls-services+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['rs'],
      },
      'application/route-apd+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['rapd'],
      },
      'application/route-s-tsid+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['sls'],
      },
      'application/route-usd+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['rusd'],
      },
      'application/rpki-ghostbusters': {
        source: 'iana',
        extensions: ['gbr'],
      },
      'application/rpki-manifest': {
        source: 'iana',
        extensions: ['mft'],
      },
      'application/rpki-publication': {
        source: 'iana',
      },
      'application/rpki-roa': {
        source: 'iana',
        extensions: ['roa'],
      },
      'application/rpki-updown': {
        source: 'iana',
      },
      'application/rsd+xml': {
        source: 'apache',
        compressible: true,
        extensions: ['rsd'],
      },
      'application/rss+xml': {
        source: 'apache',
        compressible: true,
        extensions: ['rss'],
      },
      'application/rtf': {
        source: 'iana',
        compressible: true,
        extensions: ['rtf'],
      },
      'application/rtploopback': {
        source: 'iana',
      },
      'application/rtx': {
        source: 'iana',
      },
      'application/samlassertion+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/samlmetadata+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/sarif+json': {
        source: 'iana',
        compressible: true,
      },
      'application/sarif-external-properties+json': {
        source: 'iana',
        compressible: true,
      },
      'application/sbe': {
        source: 'iana',
      },
      'application/sbml+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['sbml'],
      },
      'application/scaip+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/scim+json': {
        source: 'iana',
        compressible: true,
      },
      'application/scvp-cv-request': {
        source: 'iana',
        extensions: ['scq'],
      },
      'application/scvp-cv-response': {
        source: 'iana',
        extensions: ['scs'],
      },
      'application/scvp-vp-request': {
        source: 'iana',
        extensions: ['spq'],
      },
      'application/scvp-vp-response': {
        source: 'iana',
        extensions: ['spp'],
      },
      'application/sdp': {
        source: 'iana',
        extensions: ['sdp'],
      },
      'application/secevent+jwt': {
        source: 'iana',
      },
      'application/senml+cbor': {
        source: 'iana',
      },
      'application/senml+json': {
        source: 'iana',
        compressible: true,
      },
      'application/senml+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['senmlx'],
      },
      'application/senml-etch+cbor': {
        source: 'iana',
      },
      'application/senml-etch+json': {
        source: 'iana',
        compressible: true,
      },
      'application/senml-exi': {
        source: 'iana',
      },
      'application/sensml+cbor': {
        source: 'iana',
      },
      'application/sensml+json': {
        source: 'iana',
        compressible: true,
      },
      'application/sensml+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['sensmlx'],
      },
      'application/sensml-exi': {
        source: 'iana',
      },
      'application/sep+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/sep-exi': {
        source: 'iana',
      },
      'application/session-info': {
        source: 'iana',
      },
      'application/set-payment': {
        source: 'iana',
      },
      'application/set-payment-initiation': {
        source: 'iana',
        extensions: ['setpay'],
      },
      'application/set-registration': {
        source: 'iana',
      },
      'application/set-registration-initiation': {
        source: 'iana',
        extensions: ['setreg'],
      },
      'application/sgml': {
        source: 'iana',
      },
      'application/sgml-open-catalog': {
        source: 'iana',
      },
      'application/shf+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['shf'],
      },
      'application/sieve': {
        source: 'iana',
        extensions: ['siv', 'sieve'],
      },
      'application/simple-filter+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/simple-message-summary': {
        source: 'iana',
      },
      'application/simplesymbolcontainer': {
        source: 'iana',
      },
      'application/sipc': {
        source: 'iana',
      },
      'application/slate': {
        source: 'iana',
      },
      'application/smil': {
        source: 'iana',
      },
      'application/smil+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['smi', 'smil'],
      },
      'application/smpte336m': {
        source: 'iana',
      },
      'application/soap+fastinfoset': {
        source: 'iana',
      },
      'application/soap+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/sparql-query': {
        source: 'iana',
        extensions: ['rq'],
      },
      'application/sparql-results+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['srx'],
      },
      'application/spdx+json': {
        source: 'iana',
        compressible: true,
      },
      'application/spirits-event+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/sql': {
        source: 'iana',
      },
      'application/srgs': {
        source: 'iana',
        extensions: ['gram'],
      },
      'application/srgs+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['grxml'],
      },
      'application/sru+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['sru'],
      },
      'application/ssdl+xml': {
        source: 'apache',
        compressible: true,
        extensions: ['ssdl'],
      },
      'application/ssml+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['ssml'],
      },
      'application/stix+json': {
        source: 'iana',
        compressible: true,
      },
      'application/swid+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['swidtag'],
      },
      'application/tamp-apex-update': {
        source: 'iana',
      },
      'application/tamp-apex-update-confirm': {
        source: 'iana',
      },
      'application/tamp-community-update': {
        source: 'iana',
      },
      'application/tamp-community-update-confirm': {
        source: 'iana',
      },
      'application/tamp-error': {
        source: 'iana',
      },
      'application/tamp-sequence-adjust': {
        source: 'iana',
      },
      'application/tamp-sequence-adjust-confirm': {
        source: 'iana',
      },
      'application/tamp-status-query': {
        source: 'iana',
      },
      'application/tamp-status-response': {
        source: 'iana',
      },
      'application/tamp-update': {
        source: 'iana',
      },
      'application/tamp-update-confirm': {
        source: 'iana',
      },
      'application/tar': {
        compressible: true,
      },
      'application/taxii+json': {
        source: 'iana',
        compressible: true,
      },
      'application/td+json': {
        source: 'iana',
        compressible: true,
      },
      'application/tei+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['tei', 'teicorpus'],
      },
      'application/tetra_isi': {
        source: 'iana',
      },
      'application/thraud+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['tfi'],
      },
      'application/timestamp-query': {
        source: 'iana',
      },
      'application/timestamp-reply': {
        source: 'iana',
      },
      'application/timestamped-data': {
        source: 'iana',
        extensions: ['tsd'],
      },
      'application/tlsrpt+gzip': {
        source: 'iana',
      },
      'application/tlsrpt+json': {
        source: 'iana',
        compressible: true,
      },
      'application/tnauthlist': {
        source: 'iana',
      },
      'application/token-introspection+jwt': {
        source: 'iana',
      },
      'application/toml': {
        compressible: true,
        extensions: ['toml'],
      },
      'application/trickle-ice-sdpfrag': {
        source: 'iana',
      },
      'application/trig': {
        source: 'iana',
        extensions: ['trig'],
      },
      'application/ttml+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['ttml'],
      },
      'application/tve-trigger': {
        source: 'iana',
      },
      'application/tzif': {
        source: 'iana',
      },
      'application/tzif-leap': {
        source: 'iana',
      },
      'application/ubjson': {
        compressible: false,
        extensions: ['ubj'],
      },
      'application/ulpfec': {
        source: 'iana',
      },
      'application/urc-grpsheet+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/urc-ressheet+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['rsheet'],
      },
      'application/urc-targetdesc+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['td'],
      },
      'application/urc-uisocketdesc+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vcard+json': {
        source: 'iana',
        compressible: true,
      },
      'application/vcard+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vemmi': {
        source: 'iana',
      },
      'application/vividence.scriptfile': {
        source: 'apache',
      },
      'application/vnd.1000minds.decision-model+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['1km'],
      },
      'application/vnd.3gpp-prose+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.3gpp-prose-pc3ch+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.3gpp-v2x-local-service-information': {
        source: 'iana',
      },
      'application/vnd.3gpp.5gnas': {
        source: 'iana',
      },
      'application/vnd.3gpp.access-transfer-events+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.3gpp.bsf+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.3gpp.gmop+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.3gpp.gtpc': {
        source: 'iana',
      },
      'application/vnd.3gpp.interworking-data': {
        source: 'iana',
      },
      'application/vnd.3gpp.lpp': {
        source: 'iana',
      },
      'application/vnd.3gpp.mc-signalling-ear': {
        source: 'iana',
      },
      'application/vnd.3gpp.mcdata-affiliation-command+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.3gpp.mcdata-info+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.3gpp.mcdata-payload': {
        source: 'iana',
      },
      'application/vnd.3gpp.mcdata-service-config+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.3gpp.mcdata-signalling': {
        source: 'iana',
      },
      'application/vnd.3gpp.mcdata-ue-config+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.3gpp.mcdata-user-profile+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.3gpp.mcptt-affiliation-command+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.3gpp.mcptt-floor-request+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.3gpp.mcptt-info+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.3gpp.mcptt-location-info+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.3gpp.mcptt-mbms-usage-info+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.3gpp.mcptt-service-config+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.3gpp.mcptt-signed+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.3gpp.mcptt-ue-config+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.3gpp.mcptt-ue-init-config+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.3gpp.mcptt-user-profile+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.3gpp.mcvideo-affiliation-command+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.3gpp.mcvideo-affiliation-info+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.3gpp.mcvideo-info+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.3gpp.mcvideo-location-info+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.3gpp.mcvideo-mbms-usage-info+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.3gpp.mcvideo-service-config+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.3gpp.mcvideo-transmission-request+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.3gpp.mcvideo-ue-config+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.3gpp.mcvideo-user-profile+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.3gpp.mid-call+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.3gpp.ngap': {
        source: 'iana',
      },
      'application/vnd.3gpp.pfcp': {
        source: 'iana',
      },
      'application/vnd.3gpp.pic-bw-large': {
        source: 'iana',
        extensions: ['plb'],
      },
      'application/vnd.3gpp.pic-bw-small': {
        source: 'iana',
        extensions: ['psb'],
      },
      'application/vnd.3gpp.pic-bw-var': {
        source: 'iana',
        extensions: ['pvb'],
      },
      'application/vnd.3gpp.s1ap': {
        source: 'iana',
      },
      'application/vnd.3gpp.sms': {
        source: 'iana',
      },
      'application/vnd.3gpp.sms+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.3gpp.srvcc-ext+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.3gpp.srvcc-info+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.3gpp.state-and-event-info+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.3gpp.ussd+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.3gpp2.bcmcsinfo+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.3gpp2.sms': {
        source: 'iana',
      },
      'application/vnd.3gpp2.tcap': {
        source: 'iana',
        extensions: ['tcap'],
      },
      'application/vnd.3lightssoftware.imagescal': {
        source: 'iana',
      },
      'application/vnd.3m.post-it-notes': {
        source: 'iana',
        extensions: ['pwn'],
      },
      'application/vnd.accpac.simply.aso': {
        source: 'iana',
        extensions: ['aso'],
      },
      'application/vnd.accpac.simply.imp': {
        source: 'iana',
        extensions: ['imp'],
      },
      'application/vnd.acucobol': {
        source: 'iana',
        extensions: ['acu'],
      },
      'application/vnd.acucorp': {
        source: 'iana',
        extensions: ['atc', 'acutc'],
      },
      'application/vnd.adobe.air-application-installer-package+zip': {
        source: 'apache',
        compressible: false,
        extensions: ['air'],
      },
      'application/vnd.adobe.flash.movie': {
        source: 'iana',
      },
      'application/vnd.adobe.formscentral.fcdt': {
        source: 'iana',
        extensions: ['fcdt'],
      },
      'application/vnd.adobe.fxp': {
        source: 'iana',
        extensions: ['fxp', 'fxpl'],
      },
      'application/vnd.adobe.partial-upload': {
        source: 'iana',
      },
      'application/vnd.adobe.xdp+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['xdp'],
      },
      'application/vnd.adobe.xfdf': {
        source: 'iana',
        extensions: ['xfdf'],
      },
      'application/vnd.aether.imp': {
        source: 'iana',
      },
      'application/vnd.afpc.afplinedata': {
        source: 'iana',
      },
      'application/vnd.afpc.afplinedata-pagedef': {
        source: 'iana',
      },
      'application/vnd.afpc.cmoca-cmresource': {
        source: 'iana',
      },
      'application/vnd.afpc.foca-charset': {
        source: 'iana',
      },
      'application/vnd.afpc.foca-codedfont': {
        source: 'iana',
      },
      'application/vnd.afpc.foca-codepage': {
        source: 'iana',
      },
      'application/vnd.afpc.modca': {
        source: 'iana',
      },
      'application/vnd.afpc.modca-cmtable': {
        source: 'iana',
      },
      'application/vnd.afpc.modca-formdef': {
        source: 'iana',
      },
      'application/vnd.afpc.modca-mediummap': {
        source: 'iana',
      },
      'application/vnd.afpc.modca-objectcontainer': {
        source: 'iana',
      },
      'application/vnd.afpc.modca-overlay': {
        source: 'iana',
      },
      'application/vnd.afpc.modca-pagesegment': {
        source: 'iana',
      },
      'application/vnd.age': {
        source: 'iana',
        extensions: ['age'],
      },
      'application/vnd.ah-barcode': {
        source: 'iana',
      },
      'application/vnd.ahead.space': {
        source: 'iana',
        extensions: ['ahead'],
      },
      'application/vnd.airzip.filesecure.azf': {
        source: 'iana',
        extensions: ['azf'],
      },
      'application/vnd.airzip.filesecure.azs': {
        source: 'iana',
        extensions: ['azs'],
      },
      'application/vnd.amadeus+json': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.amazon.ebook': {
        source: 'apache',
        extensions: ['azw'],
      },
      'application/vnd.amazon.mobi8-ebook': {
        source: 'iana',
      },
      'application/vnd.americandynamics.acc': {
        source: 'iana',
        extensions: ['acc'],
      },
      'application/vnd.amiga.ami': {
        source: 'iana',
        extensions: ['ami'],
      },
      'application/vnd.amundsen.maze+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.android.ota': {
        source: 'iana',
      },
      'application/vnd.android.package-archive': {
        source: 'apache',
        compressible: false,
        extensions: ['apk'],
      },
      'application/vnd.anki': {
        source: 'iana',
      },
      'application/vnd.anser-web-certificate-issue-initiation': {
        source: 'iana',
        extensions: ['cii'],
      },
      'application/vnd.anser-web-funds-transfer-initiation': {
        source: 'apache',
        extensions: ['fti'],
      },
      'application/vnd.antix.game-component': {
        source: 'iana',
        extensions: ['atx'],
      },
      'application/vnd.apache.arrow.file': {
        source: 'iana',
      },
      'application/vnd.apache.arrow.stream': {
        source: 'iana',
      },
      'application/vnd.apache.thrift.binary': {
        source: 'iana',
      },
      'application/vnd.apache.thrift.compact': {
        source: 'iana',
      },
      'application/vnd.apache.thrift.json': {
        source: 'iana',
      },
      'application/vnd.api+json': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.aplextor.warrp+json': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.apothekende.reservation+json': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.apple.installer+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['mpkg'],
      },
      'application/vnd.apple.keynote': {
        source: 'iana',
        extensions: ['key'],
      },
      'application/vnd.apple.mpegurl': {
        source: 'iana',
        extensions: ['m3u8'],
      },
      'application/vnd.apple.numbers': {
        source: 'iana',
        extensions: ['numbers'],
      },
      'application/vnd.apple.pages': {
        source: 'iana',
        extensions: ['pages'],
      },
      'application/vnd.apple.pkpass': {
        compressible: false,
        extensions: ['pkpass'],
      },
      'application/vnd.arastra.swi': {
        source: 'iana',
      },
      'application/vnd.aristanetworks.swi': {
        source: 'iana',
        extensions: ['swi'],
      },
      'application/vnd.artisan+json': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.artsquare': {
        source: 'iana',
      },
      'application/vnd.astraea-software.iota': {
        source: 'iana',
        extensions: ['iota'],
      },
      'application/vnd.audiograph': {
        source: 'iana',
        extensions: ['aep'],
      },
      'application/vnd.autopackage': {
        source: 'iana',
      },
      'application/vnd.avalon+json': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.avistar+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.balsamiq.bmml+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['bmml'],
      },
      'application/vnd.balsamiq.bmpr': {
        source: 'iana',
      },
      'application/vnd.banana-accounting': {
        source: 'iana',
      },
      'application/vnd.bbf.usp.error': {
        source: 'iana',
      },
      'application/vnd.bbf.usp.msg': {
        source: 'iana',
      },
      'application/vnd.bbf.usp.msg+json': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.bekitzur-stech+json': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.bint.med-content': {
        source: 'iana',
      },
      'application/vnd.biopax.rdf+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.blink-idb-value-wrapper': {
        source: 'iana',
      },
      'application/vnd.blueice.multipass': {
        source: 'iana',
        extensions: ['mpm'],
      },
      'application/vnd.bluetooth.ep.oob': {
        source: 'iana',
      },
      'application/vnd.bluetooth.le.oob': {
        source: 'iana',
      },
      'application/vnd.bmi': {
        source: 'iana',
        extensions: ['bmi'],
      },
      'application/vnd.bpf': {
        source: 'iana',
      },
      'application/vnd.bpf3': {
        source: 'iana',
      },
      'application/vnd.businessobjects': {
        source: 'iana',
        extensions: ['rep'],
      },
      'application/vnd.byu.uapi+json': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.cab-jscript': {
        source: 'iana',
      },
      'application/vnd.canon-cpdl': {
        source: 'iana',
      },
      'application/vnd.canon-lips': {
        source: 'iana',
      },
      'application/vnd.capasystems-pg+json': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.cendio.thinlinc.clientconf': {
        source: 'iana',
      },
      'application/vnd.century-systems.tcp_stream': {
        source: 'iana',
      },
      'application/vnd.chemdraw+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['cdxml'],
      },
      'application/vnd.chess-pgn': {
        source: 'iana',
      },
      'application/vnd.chipnuts.karaoke-mmd': {
        source: 'iana',
        extensions: ['mmd'],
      },
      'application/vnd.ciedi': {
        source: 'iana',
      },
      'application/vnd.cinderella': {
        source: 'iana',
        extensions: ['cdy'],
      },
      'application/vnd.cirpack.isdn-ext': {
        source: 'iana',
      },
      'application/vnd.citationstyles.style+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['csl'],
      },
      'application/vnd.claymore': {
        source: 'iana',
        extensions: ['cla'],
      },
      'application/vnd.cloanto.rp9': {
        source: 'iana',
        extensions: ['rp9'],
      },
      'application/vnd.clonk.c4group': {
        source: 'iana',
        extensions: ['c4g', 'c4d', 'c4f', 'c4p', 'c4u'],
      },
      'application/vnd.cluetrust.cartomobile-config': {
        source: 'iana',
        extensions: ['c11amc'],
      },
      'application/vnd.cluetrust.cartomobile-config-pkg': {
        source: 'iana',
        extensions: ['c11amz'],
      },
      'application/vnd.coffeescript': {
        source: 'iana',
      },
      'application/vnd.collabio.xodocuments.document': {
        source: 'iana',
      },
      'application/vnd.collabio.xodocuments.document-template': {
        source: 'iana',
      },
      'application/vnd.collabio.xodocuments.presentation': {
        source: 'iana',
      },
      'application/vnd.collabio.xodocuments.presentation-template': {
        source: 'iana',
      },
      'application/vnd.collabio.xodocuments.spreadsheet': {
        source: 'iana',
      },
      'application/vnd.collabio.xodocuments.spreadsheet-template': {
        source: 'iana',
      },
      'application/vnd.collection+json': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.collection.doc+json': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.collection.next+json': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.comicbook+zip': {
        source: 'iana',
        compressible: false,
      },
      'application/vnd.comicbook-rar': {
        source: 'iana',
      },
      'application/vnd.commerce-battelle': {
        source: 'iana',
      },
      'application/vnd.commonspace': {
        source: 'iana',
        extensions: ['csp'],
      },
      'application/vnd.contact.cmsg': {
        source: 'iana',
        extensions: ['cdbcmsg'],
      },
      'application/vnd.coreos.ignition+json': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.cosmocaller': {
        source: 'iana',
        extensions: ['cmc'],
      },
      'application/vnd.crick.clicker': {
        source: 'iana',
        extensions: ['clkx'],
      },
      'application/vnd.crick.clicker.keyboard': {
        source: 'iana',
        extensions: ['clkk'],
      },
      'application/vnd.crick.clicker.palette': {
        source: 'iana',
        extensions: ['clkp'],
      },
      'application/vnd.crick.clicker.template': {
        source: 'iana',
        extensions: ['clkt'],
      },
      'application/vnd.crick.clicker.wordbank': {
        source: 'iana',
        extensions: ['clkw'],
      },
      'application/vnd.criticaltools.wbs+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['wbs'],
      },
      'application/vnd.cryptii.pipe+json': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.crypto-shade-file': {
        source: 'iana',
      },
      'application/vnd.cryptomator.encrypted': {
        source: 'iana',
      },
      'application/vnd.cryptomator.vault': {
        source: 'iana',
      },
      'application/vnd.ctc-posml': {
        source: 'iana',
        extensions: ['pml'],
      },
      'application/vnd.ctct.ws+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.cups-pdf': {
        source: 'iana',
      },
      'application/vnd.cups-postscript': {
        source: 'iana',
      },
      'application/vnd.cups-ppd': {
        source: 'iana',
        extensions: ['ppd'],
      },
      'application/vnd.cups-raster': {
        source: 'iana',
      },
      'application/vnd.cups-raw': {
        source: 'iana',
      },
      'application/vnd.curl': {
        source: 'iana',
      },
      'application/vnd.curl.car': {
        source: 'apache',
        extensions: ['car'],
      },
      'application/vnd.curl.pcurl': {
        source: 'apache',
        extensions: ['pcurl'],
      },
      'application/vnd.cyan.dean.root+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.cybank': {
        source: 'iana',
      },
      'application/vnd.cyclonedx+json': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.cyclonedx+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.d2l.coursepackage1p0+zip': {
        source: 'iana',
        compressible: false,
      },
      'application/vnd.d3m-dataset': {
        source: 'iana',
      },
      'application/vnd.d3m-problem': {
        source: 'iana',
      },
      'application/vnd.dart': {
        source: 'iana',
        compressible: true,
        extensions: ['dart'],
      },
      'application/vnd.data-vision.rdz': {
        source: 'iana',
        extensions: ['rdz'],
      },
      'application/vnd.datapackage+json': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.dataresource+json': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.dbf': {
        source: 'iana',
        extensions: ['dbf'],
      },
      'application/vnd.debian.binary-package': {
        source: 'iana',
      },
      'application/vnd.dece.data': {
        source: 'iana',
        extensions: ['uvf', 'uvvf', 'uvd', 'uvvd'],
      },
      'application/vnd.dece.ttml+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['uvt', 'uvvt'],
      },
      'application/vnd.dece.unspecified': {
        source: 'iana',
        extensions: ['uvx', 'uvvx'],
      },
      'application/vnd.dece.zip': {
        source: 'iana',
        extensions: ['uvz', 'uvvz'],
      },
      'application/vnd.denovo.fcselayout-link': {
        source: 'iana',
        extensions: ['fe_launch'],
      },
      'application/vnd.desmume.movie': {
        source: 'iana',
      },
      'application/vnd.dir-bi.plate-dl-nosuffix': {
        source: 'iana',
      },
      'application/vnd.dm.delegation+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.dna': {
        source: 'iana',
        extensions: ['dna'],
      },
      'application/vnd.document+json': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.dolby.mlp': {
        source: 'apache',
        extensions: ['mlp'],
      },
      'application/vnd.dolby.mobile.1': {
        source: 'iana',
      },
      'application/vnd.dolby.mobile.2': {
        source: 'iana',
      },
      'application/vnd.doremir.scorecloud-binary-document': {
        source: 'iana',
      },
      'application/vnd.dpgraph': {
        source: 'iana',
        extensions: ['dpg'],
      },
      'application/vnd.dreamfactory': {
        source: 'iana',
        extensions: ['dfac'],
      },
      'application/vnd.drive+json': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.ds-keypoint': {
        source: 'apache',
        extensions: ['kpxx'],
      },
      'application/vnd.dtg.local': {
        source: 'iana',
      },
      'application/vnd.dtg.local.flash': {
        source: 'iana',
      },
      'application/vnd.dtg.local.html': {
        source: 'iana',
      },
      'application/vnd.dvb.ait': {
        source: 'iana',
        extensions: ['ait'],
      },
      'application/vnd.dvb.dvbisl+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.dvb.dvbj': {
        source: 'iana',
      },
      'application/vnd.dvb.esgcontainer': {
        source: 'iana',
      },
      'application/vnd.dvb.ipdcdftnotifaccess': {
        source: 'iana',
      },
      'application/vnd.dvb.ipdcesgaccess': {
        source: 'iana',
      },
      'application/vnd.dvb.ipdcesgaccess2': {
        source: 'iana',
      },
      'application/vnd.dvb.ipdcesgpdd': {
        source: 'iana',
      },
      'application/vnd.dvb.ipdcroaming': {
        source: 'iana',
      },
      'application/vnd.dvb.iptv.alfec-base': {
        source: 'iana',
      },
      'application/vnd.dvb.iptv.alfec-enhancement': {
        source: 'iana',
      },
      'application/vnd.dvb.notif-aggregate-root+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.dvb.notif-container+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.dvb.notif-generic+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.dvb.notif-ia-msglist+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.dvb.notif-ia-registration-request+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.dvb.notif-ia-registration-response+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.dvb.notif-init+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.dvb.pfr': {
        source: 'iana',
      },
      'application/vnd.dvb.service': {
        source: 'iana',
        extensions: ['svc'],
      },
      'application/vnd.dxr': {
        source: 'iana',
      },
      'application/vnd.dynageo': {
        source: 'iana',
        extensions: ['geo'],
      },
      'application/vnd.dzr': {
        source: 'iana',
      },
      'application/vnd.easykaraoke.cdgdownload': {
        source: 'iana',
      },
      'application/vnd.ecdis-update': {
        source: 'iana',
      },
      'application/vnd.ecip.rlp': {
        source: 'iana',
      },
      'application/vnd.eclipse.ditto+json': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.ecowin.chart': {
        source: 'iana',
        extensions: ['mag'],
      },
      'application/vnd.ecowin.filerequest': {
        source: 'iana',
      },
      'application/vnd.ecowin.fileupdate': {
        source: 'iana',
      },
      'application/vnd.ecowin.series': {
        source: 'iana',
      },
      'application/vnd.ecowin.seriesrequest': {
        source: 'iana',
      },
      'application/vnd.ecowin.seriesupdate': {
        source: 'iana',
      },
      'application/vnd.efi.img': {
        source: 'iana',
      },
      'application/vnd.efi.iso': {
        source: 'iana',
      },
      'application/vnd.emclient.accessrequest+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.enliven': {
        source: 'iana',
        extensions: ['nml'],
      },
      'application/vnd.enphase.envoy': {
        source: 'iana',
      },
      'application/vnd.eprints.data+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.epson.esf': {
        source: 'iana',
        extensions: ['esf'],
      },
      'application/vnd.epson.msf': {
        source: 'iana',
        extensions: ['msf'],
      },
      'application/vnd.epson.quickanime': {
        source: 'iana',
        extensions: ['qam'],
      },
      'application/vnd.epson.salt': {
        source: 'iana',
        extensions: ['slt'],
      },
      'application/vnd.epson.ssf': {
        source: 'iana',
        extensions: ['ssf'],
      },
      'application/vnd.ericsson.quickcall': {
        source: 'iana',
      },
      'application/vnd.espass-espass+zip': {
        source: 'iana',
        compressible: false,
      },
      'application/vnd.eszigno3+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['es3', 'et3'],
      },
      'application/vnd.etsi.aoc+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.etsi.asic-e+zip': {
        source: 'iana',
        compressible: false,
      },
      'application/vnd.etsi.asic-s+zip': {
        source: 'iana',
        compressible: false,
      },
      'application/vnd.etsi.cug+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.etsi.iptvcommand+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.etsi.iptvdiscovery+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.etsi.iptvprofile+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.etsi.iptvsad-bc+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.etsi.iptvsad-cod+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.etsi.iptvsad-npvr+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.etsi.iptvservice+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.etsi.iptvsync+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.etsi.iptvueprofile+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.etsi.mcid+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.etsi.mheg5': {
        source: 'iana',
      },
      'application/vnd.etsi.overload-control-policy-dataset+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.etsi.pstn+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.etsi.sci+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.etsi.simservs+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.etsi.timestamp-token': {
        source: 'iana',
      },
      'application/vnd.etsi.tsl+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.etsi.tsl.der': {
        source: 'iana',
      },
      'application/vnd.eu.kasparian.car+json': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.eudora.data': {
        source: 'iana',
      },
      'application/vnd.evolv.ecig.profile': {
        source: 'iana',
      },
      'application/vnd.evolv.ecig.settings': {
        source: 'iana',
      },
      'application/vnd.evolv.ecig.theme': {
        source: 'iana',
      },
      'application/vnd.exstream-empower+zip': {
        source: 'iana',
        compressible: false,
      },
      'application/vnd.exstream-package': {
        source: 'iana',
      },
      'application/vnd.ezpix-album': {
        source: 'iana',
        extensions: ['ez2'],
      },
      'application/vnd.ezpix-package': {
        source: 'iana',
        extensions: ['ez3'],
      },
      'application/vnd.f-secure.mobile': {
        source: 'iana',
      },
      'application/vnd.familysearch.gedcom+zip': {
        source: 'iana',
        compressible: false,
      },
      'application/vnd.fastcopy-disk-image': {
        source: 'iana',
      },
      'application/vnd.fdf': {
        source: 'iana',
        extensions: ['fdf'],
      },
      'application/vnd.fdsn.mseed': {
        source: 'iana',
        extensions: ['mseed'],
      },
      'application/vnd.fdsn.seed': {
        source: 'iana',
        extensions: ['seed', 'dataless'],
      },
      'application/vnd.ffsns': {
        source: 'iana',
      },
      'application/vnd.ficlab.flb+zip': {
        source: 'iana',
        compressible: false,
      },
      'application/vnd.filmit.zfc': {
        source: 'iana',
      },
      'application/vnd.fints': {
        source: 'iana',
      },
      'application/vnd.firemonkeys.cloudcell': {
        source: 'iana',
      },
      'application/vnd.flographit': {
        source: 'iana',
        extensions: ['gph'],
      },
      'application/vnd.fluxtime.clip': {
        source: 'iana',
        extensions: ['ftc'],
      },
      'application/vnd.font-fontforge-sfd': {
        source: 'iana',
      },
      'application/vnd.framemaker': {
        source: 'iana',
        extensions: ['fm', 'frame', 'maker', 'book'],
      },
      'application/vnd.frogans.fnc': {
        source: 'iana',
        extensions: ['fnc'],
      },
      'application/vnd.frogans.ltf': {
        source: 'iana',
        extensions: ['ltf'],
      },
      'application/vnd.fsc.weblaunch': {
        source: 'iana',
        extensions: ['fsc'],
      },
      'application/vnd.fujifilm.fb.docuworks': {
        source: 'iana',
      },
      'application/vnd.fujifilm.fb.docuworks.binder': {
        source: 'iana',
      },
      'application/vnd.fujifilm.fb.docuworks.container': {
        source: 'iana',
      },
      'application/vnd.fujifilm.fb.jfi+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.fujitsu.oasys': {
        source: 'iana',
        extensions: ['oas'],
      },
      'application/vnd.fujitsu.oasys2': {
        source: 'iana',
        extensions: ['oa2'],
      },
      'application/vnd.fujitsu.oasys3': {
        source: 'iana',
        extensions: ['oa3'],
      },
      'application/vnd.fujitsu.oasysgp': {
        source: 'iana',
        extensions: ['fg5'],
      },
      'application/vnd.fujitsu.oasysprs': {
        source: 'iana',
        extensions: ['bh2'],
      },
      'application/vnd.fujixerox.art-ex': {
        source: 'iana',
      },
      'application/vnd.fujixerox.art4': {
        source: 'iana',
      },
      'application/vnd.fujixerox.ddd': {
        source: 'iana',
        extensions: ['ddd'],
      },
      'application/vnd.fujixerox.docuworks': {
        source: 'iana',
        extensions: ['xdw'],
      },
      'application/vnd.fujixerox.docuworks.binder': {
        source: 'iana',
        extensions: ['xbd'],
      },
      'application/vnd.fujixerox.docuworks.container': {
        source: 'iana',
      },
      'application/vnd.fujixerox.hbpl': {
        source: 'iana',
      },
      'application/vnd.fut-misnet': {
        source: 'iana',
      },
      'application/vnd.futoin+cbor': {
        source: 'iana',
      },
      'application/vnd.futoin+json': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.fuzzysheet': {
        source: 'iana',
        extensions: ['fzs'],
      },
      'application/vnd.genomatix.tuxedo': {
        source: 'iana',
        extensions: ['txd'],
      },
      'application/vnd.gentics.grd+json': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.geo+json': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.geocube+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.geogebra.file': {
        source: 'iana',
        extensions: ['ggb'],
      },
      'application/vnd.geogebra.slides': {
        source: 'iana',
      },
      'application/vnd.geogebra.tool': {
        source: 'iana',
        extensions: ['ggt'],
      },
      'application/vnd.geometry-explorer': {
        source: 'iana',
        extensions: ['gex', 'gre'],
      },
      'application/vnd.geonext': {
        source: 'iana',
        extensions: ['gxt'],
      },
      'application/vnd.geoplan': {
        source: 'iana',
        extensions: ['g2w'],
      },
      'application/vnd.geospace': {
        source: 'iana',
        extensions: ['g3w'],
      },
      'application/vnd.gerber': {
        source: 'iana',
      },
      'application/vnd.globalplatform.card-content-mgt': {
        source: 'iana',
      },
      'application/vnd.globalplatform.card-content-mgt-response': {
        source: 'iana',
      },
      'application/vnd.gmx': {
        source: 'iana',
        extensions: ['gmx'],
      },
      'application/vnd.google-apps.document': {
        compressible: false,
        extensions: ['gdoc'],
      },
      'application/vnd.google-apps.presentation': {
        compressible: false,
        extensions: ['gslides'],
      },
      'application/vnd.google-apps.spreadsheet': {
        compressible: false,
        extensions: ['gsheet'],
      },
      'application/vnd.google-earth.kml+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['kml'],
      },
      'application/vnd.google-earth.kmz': {
        source: 'iana',
        compressible: false,
        extensions: ['kmz'],
      },
      'application/vnd.gov.sk.e-form+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.gov.sk.e-form+zip': {
        source: 'iana',
        compressible: false,
      },
      'application/vnd.gov.sk.xmldatacontainer+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.grafeq': {
        source: 'iana',
        extensions: ['gqf', 'gqs'],
      },
      'application/vnd.gridmp': {
        source: 'iana',
      },
      'application/vnd.groove-account': {
        source: 'iana',
        extensions: ['gac'],
      },
      'application/vnd.groove-help': {
        source: 'iana',
        extensions: ['ghf'],
      },
      'application/vnd.groove-identity-message': {
        source: 'iana',
        extensions: ['gim'],
      },
      'application/vnd.groove-injector': {
        source: 'iana',
        extensions: ['grv'],
      },
      'application/vnd.groove-tool-message': {
        source: 'iana',
        extensions: ['gtm'],
      },
      'application/vnd.groove-tool-template': {
        source: 'iana',
        extensions: ['tpl'],
      },
      'application/vnd.groove-vcard': {
        source: 'iana',
        extensions: ['vcg'],
      },
      'application/vnd.hal+json': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.hal+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['hal'],
      },
      'application/vnd.handheld-entertainment+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['zmm'],
      },
      'application/vnd.hbci': {
        source: 'iana',
        extensions: ['hbci'],
      },
      'application/vnd.hc+json': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.hcl-bireports': {
        source: 'iana',
      },
      'application/vnd.hdt': {
        source: 'iana',
      },
      'application/vnd.heroku+json': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.hhe.lesson-player': {
        source: 'iana',
        extensions: ['les'],
      },
      'application/vnd.hl7cda+xml': {
        source: 'iana',
        charset: 'UTF-8',
        compressible: true,
      },
      'application/vnd.hl7v2+xml': {
        source: 'iana',
        charset: 'UTF-8',
        compressible: true,
      },
      'application/vnd.hp-hpgl': {
        source: 'iana',
        extensions: ['hpgl'],
      },
      'application/vnd.hp-hpid': {
        source: 'iana',
        extensions: ['hpid'],
      },
      'application/vnd.hp-hps': {
        source: 'iana',
        extensions: ['hps'],
      },
      'application/vnd.hp-jlyt': {
        source: 'iana',
        extensions: ['jlt'],
      },
      'application/vnd.hp-pcl': {
        source: 'iana',
        extensions: ['pcl'],
      },
      'application/vnd.hp-pclxl': {
        source: 'iana',
        extensions: ['pclxl'],
      },
      'application/vnd.httphone': {
        source: 'iana',
      },
      'application/vnd.hydrostatix.sof-data': {
        source: 'iana',
        extensions: ['sfd-hdstx'],
      },
      'application/vnd.hyper+json': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.hyper-item+json': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.hyperdrive+json': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.hzn-3d-crossword': {
        source: 'iana',
      },
      'application/vnd.ibm.afplinedata': {
        source: 'iana',
      },
      'application/vnd.ibm.electronic-media': {
        source: 'iana',
      },
      'application/vnd.ibm.minipay': {
        source: 'iana',
        extensions: ['mpy'],
      },
      'application/vnd.ibm.modcap': {
        source: 'iana',
        extensions: ['afp', 'listafp', 'list3820'],
      },
      'application/vnd.ibm.rights-management': {
        source: 'iana',
        extensions: ['irm'],
      },
      'application/vnd.ibm.secure-container': {
        source: 'iana',
        extensions: ['sc'],
      },
      'application/vnd.iccprofile': {
        source: 'iana',
        extensions: ['icc', 'icm'],
      },
      'application/vnd.ieee.1905': {
        source: 'iana',
      },
      'application/vnd.igloader': {
        source: 'iana',
        extensions: ['igl'],
      },
      'application/vnd.imagemeter.folder+zip': {
        source: 'iana',
        compressible: false,
      },
      'application/vnd.imagemeter.image+zip': {
        source: 'iana',
        compressible: false,
      },
      'application/vnd.immervision-ivp': {
        source: 'iana',
        extensions: ['ivp'],
      },
      'application/vnd.immervision-ivu': {
        source: 'iana',
        extensions: ['ivu'],
      },
      'application/vnd.ims.imsccv1p1': {
        source: 'iana',
      },
      'application/vnd.ims.imsccv1p2': {
        source: 'iana',
      },
      'application/vnd.ims.imsccv1p3': {
        source: 'iana',
      },
      'application/vnd.ims.lis.v2.result+json': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.ims.lti.v2.toolconsumerprofile+json': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.ims.lti.v2.toolproxy+json': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.ims.lti.v2.toolproxy.id+json': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.ims.lti.v2.toolsettings+json': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.ims.lti.v2.toolsettings.simple+json': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.informedcontrol.rms+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.informix-visionary': {
        source: 'iana',
      },
      'application/vnd.infotech.project': {
        source: 'iana',
      },
      'application/vnd.infotech.project+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.innopath.wamp.notification': {
        source: 'iana',
      },
      'application/vnd.insors.igm': {
        source: 'iana',
        extensions: ['igm'],
      },
      'application/vnd.intercon.formnet': {
        source: 'iana',
        extensions: ['xpw', 'xpx'],
      },
      'application/vnd.intergeo': {
        source: 'iana',
        extensions: ['i2g'],
      },
      'application/vnd.intertrust.digibox': {
        source: 'iana',
      },
      'application/vnd.intertrust.nncp': {
        source: 'iana',
      },
      'application/vnd.intu.qbo': {
        source: 'iana',
        extensions: ['qbo'],
      },
      'application/vnd.intu.qfx': {
        source: 'iana',
        extensions: ['qfx'],
      },
      'application/vnd.iptc.g2.catalogitem+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.iptc.g2.conceptitem+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.iptc.g2.knowledgeitem+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.iptc.g2.newsitem+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.iptc.g2.newsmessage+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.iptc.g2.packageitem+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.iptc.g2.planningitem+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.ipunplugged.rcprofile': {
        source: 'iana',
        extensions: ['rcprofile'],
      },
      'application/vnd.irepository.package+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['irp'],
      },
      'application/vnd.is-xpr': {
        source: 'iana',
        extensions: ['xpr'],
      },
      'application/vnd.isac.fcs': {
        source: 'iana',
        extensions: ['fcs'],
      },
      'application/vnd.iso11783-10+zip': {
        source: 'iana',
        compressible: false,
      },
      'application/vnd.jam': {
        source: 'iana',
        extensions: ['jam'],
      },
      'application/vnd.japannet-directory-service': {
        source: 'iana',
      },
      'application/vnd.japannet-jpnstore-wakeup': {
        source: 'iana',
      },
      'application/vnd.japannet-payment-wakeup': {
        source: 'iana',
      },
      'application/vnd.japannet-registration': {
        source: 'iana',
      },
      'application/vnd.japannet-registration-wakeup': {
        source: 'iana',
      },
      'application/vnd.japannet-setstore-wakeup': {
        source: 'iana',
      },
      'application/vnd.japannet-verification': {
        source: 'iana',
      },
      'application/vnd.japannet-verification-wakeup': {
        source: 'iana',
      },
      'application/vnd.jcp.javame.midlet-rms': {
        source: 'iana',
        extensions: ['rms'],
      },
      'application/vnd.jisp': {
        source: 'iana',
        extensions: ['jisp'],
      },
      'application/vnd.joost.joda-archive': {
        source: 'iana',
        extensions: ['joda'],
      },
      'application/vnd.jsk.isdn-ngn': {
        source: 'iana',
      },
      'application/vnd.kahootz': {
        source: 'iana',
        extensions: ['ktz', 'ktr'],
      },
      'application/vnd.kde.karbon': {
        source: 'iana',
        extensions: ['karbon'],
      },
      'application/vnd.kde.kchart': {
        source: 'iana',
        extensions: ['chrt'],
      },
      'application/vnd.kde.kformula': {
        source: 'iana',
        extensions: ['kfo'],
      },
      'application/vnd.kde.kivio': {
        source: 'iana',
        extensions: ['flw'],
      },
      'application/vnd.kde.kontour': {
        source: 'iana',
        extensions: ['kon'],
      },
      'application/vnd.kde.kpresenter': {
        source: 'iana',
        extensions: ['kpr', 'kpt'],
      },
      'application/vnd.kde.kspread': {
        source: 'iana',
        extensions: ['ksp'],
      },
      'application/vnd.kde.kword': {
        source: 'iana',
        extensions: ['kwd', 'kwt'],
      },
      'application/vnd.kenameaapp': {
        source: 'iana',
        extensions: ['htke'],
      },
      'application/vnd.kidspiration': {
        source: 'iana',
        extensions: ['kia'],
      },
      'application/vnd.kinar': {
        source: 'iana',
        extensions: ['kne', 'knp'],
      },
      'application/vnd.koan': {
        source: 'iana',
        extensions: ['skp', 'skd', 'skt', 'skm'],
      },
      'application/vnd.kodak-descriptor': {
        source: 'iana',
        extensions: ['sse'],
      },
      'application/vnd.las': {
        source: 'iana',
      },
      'application/vnd.las.las+json': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.las.las+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['lasxml'],
      },
      'application/vnd.laszip': {
        source: 'iana',
      },
      'application/vnd.leap+json': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.liberty-request+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.llamagraphics.life-balance.desktop': {
        source: 'iana',
        extensions: ['lbd'],
      },
      'application/vnd.llamagraphics.life-balance.exchange+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['lbe'],
      },
      'application/vnd.logipipe.circuit+zip': {
        source: 'iana',
        compressible: false,
      },
      'application/vnd.loom': {
        source: 'iana',
      },
      'application/vnd.lotus-1-2-3': {
        source: 'iana',
        extensions: ['123'],
      },
      'application/vnd.lotus-approach': {
        source: 'iana',
        extensions: ['apr'],
      },
      'application/vnd.lotus-freelance': {
        source: 'iana',
        extensions: ['pre'],
      },
      'application/vnd.lotus-notes': {
        source: 'iana',
        extensions: ['nsf'],
      },
      'application/vnd.lotus-organizer': {
        source: 'iana',
        extensions: ['org'],
      },
      'application/vnd.lotus-screencam': {
        source: 'iana',
        extensions: ['scm'],
      },
      'application/vnd.lotus-wordpro': {
        source: 'iana',
        extensions: ['lwp'],
      },
      'application/vnd.macports.portpkg': {
        source: 'iana',
        extensions: ['portpkg'],
      },
      'application/vnd.mapbox-vector-tile': {
        source: 'iana',
        extensions: ['mvt'],
      },
      'application/vnd.marlin.drm.actiontoken+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.marlin.drm.conftoken+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.marlin.drm.license+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.marlin.drm.mdcf': {
        source: 'iana',
      },
      'application/vnd.mason+json': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.maxar.archive.3tz+zip': {
        source: 'iana',
        compressible: false,
      },
      'application/vnd.maxmind.maxmind-db': {
        source: 'iana',
      },
      'application/vnd.mcd': {
        source: 'iana',
        extensions: ['mcd'],
      },
      'application/vnd.medcalcdata': {
        source: 'iana',
        extensions: ['mc1'],
      },
      'application/vnd.mediastation.cdkey': {
        source: 'iana',
        extensions: ['cdkey'],
      },
      'application/vnd.meridian-slingshot': {
        source: 'iana',
      },
      'application/vnd.mfer': {
        source: 'iana',
        extensions: ['mwf'],
      },
      'application/vnd.mfmp': {
        source: 'iana',
        extensions: ['mfm'],
      },
      'application/vnd.micro+json': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.micrografx.flo': {
        source: 'iana',
        extensions: ['flo'],
      },
      'application/vnd.micrografx.igx': {
        source: 'iana',
        extensions: ['igx'],
      },
      'application/vnd.microsoft.portable-executable': {
        source: 'iana',
      },
      'application/vnd.microsoft.windows.thumbnail-cache': {
        source: 'iana',
      },
      'application/vnd.miele+json': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.mif': {
        source: 'iana',
        extensions: ['mif'],
      },
      'application/vnd.minisoft-hp3000-save': {
        source: 'iana',
      },
      'application/vnd.mitsubishi.misty-guard.trustweb': {
        source: 'iana',
      },
      'application/vnd.mobius.daf': {
        source: 'iana',
        extensions: ['daf'],
      },
      'application/vnd.mobius.dis': {
        source: 'iana',
        extensions: ['dis'],
      },
      'application/vnd.mobius.mbk': {
        source: 'iana',
        extensions: ['mbk'],
      },
      'application/vnd.mobius.mqy': {
        source: 'iana',
        extensions: ['mqy'],
      },
      'application/vnd.mobius.msl': {
        source: 'iana',
        extensions: ['msl'],
      },
      'application/vnd.mobius.plc': {
        source: 'iana',
        extensions: ['plc'],
      },
      'application/vnd.mobius.txf': {
        source: 'iana',
        extensions: ['txf'],
      },
      'application/vnd.mophun.application': {
        source: 'iana',
        extensions: ['mpn'],
      },
      'application/vnd.mophun.certificate': {
        source: 'iana',
        extensions: ['mpc'],
      },
      'application/vnd.motorola.flexsuite': {
        source: 'iana',
      },
      'application/vnd.motorola.flexsuite.adsi': {
        source: 'iana',
      },
      'application/vnd.motorola.flexsuite.fis': {
        source: 'iana',
      },
      'application/vnd.motorola.flexsuite.gotap': {
        source: 'iana',
      },
      'application/vnd.motorola.flexsuite.kmr': {
        source: 'iana',
      },
      'application/vnd.motorola.flexsuite.ttc': {
        source: 'iana',
      },
      'application/vnd.motorola.flexsuite.wem': {
        source: 'iana',
      },
      'application/vnd.motorola.iprm': {
        source: 'iana',
      },
      'application/vnd.mozilla.xul+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['xul'],
      },
      'application/vnd.ms-3mfdocument': {
        source: 'iana',
      },
      'application/vnd.ms-artgalry': {
        source: 'iana',
        extensions: ['cil'],
      },
      'application/vnd.ms-asf': {
        source: 'iana',
      },
      'application/vnd.ms-cab-compressed': {
        source: 'iana',
        extensions: ['cab'],
      },
      'application/vnd.ms-color.iccprofile': {
        source: 'apache',
      },
      'application/vnd.ms-excel': {
        source: 'iana',
        compressible: false,
        extensions: ['xls', 'xlm', 'xla', 'xlc', 'xlt', 'xlw'],
      },
      'application/vnd.ms-excel.addin.macroenabled.12': {
        source: 'iana',
        extensions: ['xlam'],
      },
      'application/vnd.ms-excel.sheet.binary.macroenabled.12': {
        source: 'iana',
        extensions: ['xlsb'],
      },
      'application/vnd.ms-excel.sheet.macroenabled.12': {
        source: 'iana',
        extensions: ['xlsm'],
      },
      'application/vnd.ms-excel.template.macroenabled.12': {
        source: 'iana',
        extensions: ['xltm'],
      },
      'application/vnd.ms-fontobject': {
        source: 'iana',
        compressible: true,
        extensions: ['eot'],
      },
      'application/vnd.ms-htmlhelp': {
        source: 'iana',
        extensions: ['chm'],
      },
      'application/vnd.ms-ims': {
        source: 'iana',
        extensions: ['ims'],
      },
      'application/vnd.ms-lrm': {
        source: 'iana',
        extensions: ['lrm'],
      },
      'application/vnd.ms-office.activex+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.ms-officetheme': {
        source: 'iana',
        extensions: ['thmx'],
      },
      'application/vnd.ms-opentype': {
        source: 'apache',
        compressible: true,
      },
      'application/vnd.ms-outlook': {
        compressible: false,
        extensions: ['msg'],
      },
      'application/vnd.ms-package.obfuscated-opentype': {
        source: 'apache',
      },
      'application/vnd.ms-pki.seccat': {
        source: 'apache',
        extensions: ['cat'],
      },
      'application/vnd.ms-pki.stl': {
        source: 'apache',
        extensions: ['stl'],
      },
      'application/vnd.ms-playready.initiator+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.ms-powerpoint': {
        source: 'iana',
        compressible: false,
        extensions: ['ppt', 'pps', 'pot'],
      },
      'application/vnd.ms-powerpoint.addin.macroenabled.12': {
        source: 'iana',
        extensions: ['ppam'],
      },
      'application/vnd.ms-powerpoint.presentation.macroenabled.12': {
        source: 'iana',
        extensions: ['pptm'],
      },
      'application/vnd.ms-powerpoint.slide.macroenabled.12': {
        source: 'iana',
        extensions: ['sldm'],
      },
      'application/vnd.ms-powerpoint.slideshow.macroenabled.12': {
        source: 'iana',
        extensions: ['ppsm'],
      },
      'application/vnd.ms-powerpoint.template.macroenabled.12': {
        source: 'iana',
        extensions: ['potm'],
      },
      'application/vnd.ms-printdevicecapabilities+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.ms-printing.printticket+xml': {
        source: 'apache',
        compressible: true,
      },
      'application/vnd.ms-printschematicket+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.ms-project': {
        source: 'iana',
        extensions: ['mpp', 'mpt'],
      },
      'application/vnd.ms-tnef': {
        source: 'iana',
      },
      'application/vnd.ms-windows.devicepairing': {
        source: 'iana',
      },
      'application/vnd.ms-windows.nwprinting.oob': {
        source: 'iana',
      },
      'application/vnd.ms-windows.printerpairing': {
        source: 'iana',
      },
      'application/vnd.ms-windows.wsd.oob': {
        source: 'iana',
      },
      'application/vnd.ms-wmdrm.lic-chlg-req': {
        source: 'iana',
      },
      'application/vnd.ms-wmdrm.lic-resp': {
        source: 'iana',
      },
      'application/vnd.ms-wmdrm.meter-chlg-req': {
        source: 'iana',
      },
      'application/vnd.ms-wmdrm.meter-resp': {
        source: 'iana',
      },
      'application/vnd.ms-word.document.macroenabled.12': {
        source: 'iana',
        extensions: ['docm'],
      },
      'application/vnd.ms-word.template.macroenabled.12': {
        source: 'iana',
        extensions: ['dotm'],
      },
      'application/vnd.ms-works': {
        source: 'iana',
        extensions: ['wps', 'wks', 'wcm', 'wdb'],
      },
      'application/vnd.ms-wpl': {
        source: 'iana',
        extensions: ['wpl'],
      },
      'application/vnd.ms-xpsdocument': {
        source: 'iana',
        compressible: false,
        extensions: ['xps'],
      },
      'application/vnd.msa-disk-image': {
        source: 'iana',
      },
      'application/vnd.mseq': {
        source: 'iana',
        extensions: ['mseq'],
      },
      'application/vnd.msign': {
        source: 'iana',
      },
      'application/vnd.multiad.creator': {
        source: 'iana',
      },
      'application/vnd.multiad.creator.cif': {
        source: 'iana',
      },
      'application/vnd.music-niff': {
        source: 'iana',
      },
      'application/vnd.musician': {
        source: 'iana',
        extensions: ['mus'],
      },
      'application/vnd.muvee.style': {
        source: 'iana',
        extensions: ['msty'],
      },
      'application/vnd.mynfc': {
        source: 'iana',
        extensions: ['taglet'],
      },
      'application/vnd.nacamar.ybrid+json': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.ncd.control': {
        source: 'iana',
      },
      'application/vnd.ncd.reference': {
        source: 'iana',
      },
      'application/vnd.nearst.inv+json': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.nebumind.line': {
        source: 'iana',
      },
      'application/vnd.nervana': {
        source: 'iana',
      },
      'application/vnd.netfpx': {
        source: 'iana',
      },
      'application/vnd.neurolanguage.nlu': {
        source: 'iana',
        extensions: ['nlu'],
      },
      'application/vnd.nimn': {
        source: 'iana',
      },
      'application/vnd.nintendo.nitro.rom': {
        source: 'iana',
      },
      'application/vnd.nintendo.snes.rom': {
        source: 'iana',
      },
      'application/vnd.nitf': {
        source: 'iana',
        extensions: ['ntf', 'nitf'],
      },
      'application/vnd.noblenet-directory': {
        source: 'iana',
        extensions: ['nnd'],
      },
      'application/vnd.noblenet-sealer': {
        source: 'iana',
        extensions: ['nns'],
      },
      'application/vnd.noblenet-web': {
        source: 'iana',
        extensions: ['nnw'],
      },
      'application/vnd.nokia.catalogs': {
        source: 'iana',
      },
      'application/vnd.nokia.conml+wbxml': {
        source: 'iana',
      },
      'application/vnd.nokia.conml+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.nokia.iptv.config+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.nokia.isds-radio-presets': {
        source: 'iana',
      },
      'application/vnd.nokia.landmark+wbxml': {
        source: 'iana',
      },
      'application/vnd.nokia.landmark+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.nokia.landmarkcollection+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.nokia.n-gage.ac+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['ac'],
      },
      'application/vnd.nokia.n-gage.data': {
        source: 'iana',
        extensions: ['ngdat'],
      },
      'application/vnd.nokia.n-gage.symbian.install': {
        source: 'iana',
        extensions: ['n-gage'],
      },
      'application/vnd.nokia.ncd': {
        source: 'iana',
      },
      'application/vnd.nokia.pcd+wbxml': {
        source: 'iana',
      },
      'application/vnd.nokia.pcd+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.nokia.radio-preset': {
        source: 'iana',
        extensions: ['rpst'],
      },
      'application/vnd.nokia.radio-presets': {
        source: 'iana',
        extensions: ['rpss'],
      },
      'application/vnd.novadigm.edm': {
        source: 'iana',
        extensions: ['edm'],
      },
      'application/vnd.novadigm.edx': {
        source: 'iana',
        extensions: ['edx'],
      },
      'application/vnd.novadigm.ext': {
        source: 'iana',
        extensions: ['ext'],
      },
      'application/vnd.ntt-local.content-share': {
        source: 'iana',
      },
      'application/vnd.ntt-local.file-transfer': {
        source: 'iana',
      },
      'application/vnd.ntt-local.ogw_remote-access': {
        source: 'iana',
      },
      'application/vnd.ntt-local.sip-ta_remote': {
        source: 'iana',
      },
      'application/vnd.ntt-local.sip-ta_tcp_stream': {
        source: 'iana',
      },
      'application/vnd.oasis.opendocument.chart': {
        source: 'iana',
        extensions: ['odc'],
      },
      'application/vnd.oasis.opendocument.chart-template': {
        source: 'iana',
        extensions: ['otc'],
      },
      'application/vnd.oasis.opendocument.database': {
        source: 'iana',
        extensions: ['odb'],
      },
      'application/vnd.oasis.opendocument.formula': {
        source: 'iana',
        extensions: ['odf'],
      },
      'application/vnd.oasis.opendocument.formula-template': {
        source: 'iana',
        extensions: ['odft'],
      },
      'application/vnd.oasis.opendocument.graphics': {
        source: 'iana',
        compressible: false,
        extensions: ['odg'],
      },
      'application/vnd.oasis.opendocument.graphics-template': {
        source: 'iana',
        extensions: ['otg'],
      },
      'application/vnd.oasis.opendocument.image': {
        source: 'iana',
        extensions: ['odi'],
      },
      'application/vnd.oasis.opendocument.image-template': {
        source: 'iana',
        extensions: ['oti'],
      },
      'application/vnd.oasis.opendocument.presentation': {
        source: 'iana',
        compressible: false,
        extensions: ['odp'],
      },
      'application/vnd.oasis.opendocument.presentation-template': {
        source: 'iana',
        extensions: ['otp'],
      },
      'application/vnd.oasis.opendocument.spreadsheet': {
        source: 'iana',
        compressible: false,
        extensions: ['ods'],
      },
      'application/vnd.oasis.opendocument.spreadsheet-template': {
        source: 'iana',
        extensions: ['ots'],
      },
      'application/vnd.oasis.opendocument.text': {
        source: 'iana',
        compressible: false,
        extensions: ['odt'],
      },
      'application/vnd.oasis.opendocument.text-master': {
        source: 'iana',
        extensions: ['odm'],
      },
      'application/vnd.oasis.opendocument.text-template': {
        source: 'iana',
        extensions: ['ott'],
      },
      'application/vnd.oasis.opendocument.text-web': {
        source: 'iana',
        extensions: ['oth'],
      },
      'application/vnd.obn': {
        source: 'iana',
      },
      'application/vnd.ocf+cbor': {
        source: 'iana',
      },
      'application/vnd.oci.image.manifest.v1+json': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.oftn.l10n+json': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.oipf.contentaccessdownload+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.oipf.contentaccessstreaming+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.oipf.cspg-hexbinary': {
        source: 'iana',
      },
      'application/vnd.oipf.dae.svg+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.oipf.dae.xhtml+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.oipf.mippvcontrolmessage+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.oipf.pae.gem': {
        source: 'iana',
      },
      'application/vnd.oipf.spdiscovery+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.oipf.spdlist+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.oipf.ueprofile+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.oipf.userprofile+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.olpc-sugar': {
        source: 'iana',
        extensions: ['xo'],
      },
      'application/vnd.oma-scws-config': {
        source: 'iana',
      },
      'application/vnd.oma-scws-http-request': {
        source: 'iana',
      },
      'application/vnd.oma-scws-http-response': {
        source: 'iana',
      },
      'application/vnd.oma.bcast.associated-procedure-parameter+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.oma.bcast.drm-trigger+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.oma.bcast.imd+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.oma.bcast.ltkm': {
        source: 'iana',
      },
      'application/vnd.oma.bcast.notification+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.oma.bcast.provisioningtrigger': {
        source: 'iana',
      },
      'application/vnd.oma.bcast.sgboot': {
        source: 'iana',
      },
      'application/vnd.oma.bcast.sgdd+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.oma.bcast.sgdu': {
        source: 'iana',
      },
      'application/vnd.oma.bcast.simple-symbol-container': {
        source: 'iana',
      },
      'application/vnd.oma.bcast.smartcard-trigger+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.oma.bcast.sprov+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.oma.bcast.stkm': {
        source: 'iana',
      },
      'application/vnd.oma.cab-address-book+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.oma.cab-feature-handler+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.oma.cab-pcc+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.oma.cab-subs-invite+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.oma.cab-user-prefs+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.oma.dcd': {
        source: 'iana',
      },
      'application/vnd.oma.dcdc': {
        source: 'iana',
      },
      'application/vnd.oma.dd2+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['dd2'],
      },
      'application/vnd.oma.drm.risd+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.oma.group-usage-list+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.oma.lwm2m+cbor': {
        source: 'iana',
      },
      'application/vnd.oma.lwm2m+json': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.oma.lwm2m+tlv': {
        source: 'iana',
      },
      'application/vnd.oma.pal+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.oma.poc.detailed-progress-report+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.oma.poc.final-report+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.oma.poc.groups+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.oma.poc.invocation-descriptor+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.oma.poc.optimized-progress-report+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.oma.push': {
        source: 'iana',
      },
      'application/vnd.oma.scidm.messages+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.oma.xcap-directory+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.omads-email+xml': {
        source: 'iana',
        charset: 'UTF-8',
        compressible: true,
      },
      'application/vnd.omads-file+xml': {
        source: 'iana',
        charset: 'UTF-8',
        compressible: true,
      },
      'application/vnd.omads-folder+xml': {
        source: 'iana',
        charset: 'UTF-8',
        compressible: true,
      },
      'application/vnd.omaloc-supl-init': {
        source: 'iana',
      },
      'application/vnd.onepager': {
        source: 'iana',
      },
      'application/vnd.onepagertamp': {
        source: 'iana',
      },
      'application/vnd.onepagertamx': {
        source: 'iana',
      },
      'application/vnd.onepagertat': {
        source: 'iana',
      },
      'application/vnd.onepagertatp': {
        source: 'iana',
      },
      'application/vnd.onepagertatx': {
        source: 'iana',
      },
      'application/vnd.openblox.game+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['obgx'],
      },
      'application/vnd.openblox.game-binary': {
        source: 'iana',
      },
      'application/vnd.openeye.oeb': {
        source: 'iana',
      },
      'application/vnd.openofficeorg.extension': {
        source: 'apache',
        extensions: ['oxt'],
      },
      'application/vnd.openstreetmap.data+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['osm'],
      },
      'application/vnd.opentimestamps.ots': {
        source: 'iana',
      },
      'application/vnd.openxmlformats-officedocument.custom-properties+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.openxmlformats-officedocument.customxmlproperties+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.openxmlformats-officedocument.drawing+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.openxmlformats-officedocument.drawingml.chart+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.openxmlformats-officedocument.drawingml.chartshapes+xml':
        {
          source: 'iana',
          compressible: true,
        },
      'application/vnd.openxmlformats-officedocument.drawingml.diagramcolors+xml':
        {
          source: 'iana',
          compressible: true,
        },
      'application/vnd.openxmlformats-officedocument.drawingml.diagramdata+xml':
        {
          source: 'iana',
          compressible: true,
        },
      'application/vnd.openxmlformats-officedocument.drawingml.diagramlayout+xml':
        {
          source: 'iana',
          compressible: true,
        },
      'application/vnd.openxmlformats-officedocument.drawingml.diagramstyle+xml':
        {
          source: 'iana',
          compressible: true,
        },
      'application/vnd.openxmlformats-officedocument.extended-properties+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.openxmlformats-officedocument.presentationml.commentauthors+xml':
        {
          source: 'iana',
          compressible: true,
        },
      'application/vnd.openxmlformats-officedocument.presentationml.comments+xml':
        {
          source: 'iana',
          compressible: true,
        },
      'application/vnd.openxmlformats-officedocument.presentationml.handoutmaster+xml':
        {
          source: 'iana',
          compressible: true,
        },
      'application/vnd.openxmlformats-officedocument.presentationml.notesmaster+xml':
        {
          source: 'iana',
          compressible: true,
        },
      'application/vnd.openxmlformats-officedocument.presentationml.notesslide+xml':
        {
          source: 'iana',
          compressible: true,
        },
      'application/vnd.openxmlformats-officedocument.presentationml.presentation':
        {
          source: 'iana',
          compressible: false,
          extensions: ['pptx'],
        },
      'application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml':
        {
          source: 'iana',
          compressible: true,
        },
      'application/vnd.openxmlformats-officedocument.presentationml.presprops+xml':
        {
          source: 'iana',
          compressible: true,
        },
      'application/vnd.openxmlformats-officedocument.presentationml.slide': {
        source: 'iana',
        extensions: ['sldx'],
      },
      'application/vnd.openxmlformats-officedocument.presentationml.slide+xml':
        {
          source: 'iana',
          compressible: true,
        },
      'application/vnd.openxmlformats-officedocument.presentationml.slidelayout+xml':
        {
          source: 'iana',
          compressible: true,
        },
      'application/vnd.openxmlformats-officedocument.presentationml.slidemaster+xml':
        {
          source: 'iana',
          compressible: true,
        },
      'application/vnd.openxmlformats-officedocument.presentationml.slideshow':
        {
          source: 'iana',
          extensions: ['ppsx'],
        },
      'application/vnd.openxmlformats-officedocument.presentationml.slideshow.main+xml':
        {
          source: 'iana',
          compressible: true,
        },
      'application/vnd.openxmlformats-officedocument.presentationml.slideupdateinfo+xml':
        {
          source: 'iana',
          compressible: true,
        },
      'application/vnd.openxmlformats-officedocument.presentationml.tablestyles+xml':
        {
          source: 'iana',
          compressible: true,
        },
      'application/vnd.openxmlformats-officedocument.presentationml.tags+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.openxmlformats-officedocument.presentationml.template': {
        source: 'iana',
        extensions: ['potx'],
      },
      'application/vnd.openxmlformats-officedocument.presentationml.template.main+xml':
        {
          source: 'iana',
          compressible: true,
        },
      'application/vnd.openxmlformats-officedocument.presentationml.viewprops+xml':
        {
          source: 'iana',
          compressible: true,
        },
      'application/vnd.openxmlformats-officedocument.spreadsheetml.calcchain+xml':
        {
          source: 'iana',
          compressible: true,
        },
      'application/vnd.openxmlformats-officedocument.spreadsheetml.chartsheet+xml':
        {
          source: 'iana',
          compressible: true,
        },
      'application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml':
        {
          source: 'iana',
          compressible: true,
        },
      'application/vnd.openxmlformats-officedocument.spreadsheetml.connections+xml':
        {
          source: 'iana',
          compressible: true,
        },
      'application/vnd.openxmlformats-officedocument.spreadsheetml.dialogsheet+xml':
        {
          source: 'iana',
          compressible: true,
        },
      'application/vnd.openxmlformats-officedocument.spreadsheetml.externallink+xml':
        {
          source: 'iana',
          compressible: true,
        },
      'application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcachedefinition+xml':
        {
          source: 'iana',
          compressible: true,
        },
      'application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcacherecords+xml':
        {
          source: 'iana',
          compressible: true,
        },
      'application/vnd.openxmlformats-officedocument.spreadsheetml.pivottable+xml':
        {
          source: 'iana',
          compressible: true,
        },
      'application/vnd.openxmlformats-officedocument.spreadsheetml.querytable+xml':
        {
          source: 'iana',
          compressible: true,
        },
      'application/vnd.openxmlformats-officedocument.spreadsheetml.revisionheaders+xml':
        {
          source: 'iana',
          compressible: true,
        },
      'application/vnd.openxmlformats-officedocument.spreadsheetml.revisionlog+xml':
        {
          source: 'iana',
          compressible: true,
        },
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sharedstrings+xml':
        {
          source: 'iana',
          compressible: true,
        },
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
        source: 'iana',
        compressible: false,
        extensions: ['xlsx'],
      },
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml':
        {
          source: 'iana',
          compressible: true,
        },
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheetmetadata+xml':
        {
          source: 'iana',
          compressible: true,
        },
      'application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml':
        {
          source: 'iana',
          compressible: true,
        },
      'application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.openxmlformats-officedocument.spreadsheetml.tablesinglecells+xml':
        {
          source: 'iana',
          compressible: true,
        },
      'application/vnd.openxmlformats-officedocument.spreadsheetml.template': {
        source: 'iana',
        extensions: ['xltx'],
      },
      'application/vnd.openxmlformats-officedocument.spreadsheetml.template.main+xml':
        {
          source: 'iana',
          compressible: true,
        },
      'application/vnd.openxmlformats-officedocument.spreadsheetml.usernames+xml':
        {
          source: 'iana',
          compressible: true,
        },
      'application/vnd.openxmlformats-officedocument.spreadsheetml.volatiledependencies+xml':
        {
          source: 'iana',
          compressible: true,
        },
      'application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml':
        {
          source: 'iana',
          compressible: true,
        },
      'application/vnd.openxmlformats-officedocument.theme+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.openxmlformats-officedocument.themeoverride+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.openxmlformats-officedocument.vmldrawing': {
        source: 'iana',
      },
      'application/vnd.openxmlformats-officedocument.wordprocessingml.comments+xml':
        {
          source: 'iana',
          compressible: true,
        },
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        {
          source: 'iana',
          compressible: false,
          extensions: ['docx'],
        },
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document.glossary+xml':
        {
          source: 'iana',
          compressible: true,
        },
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml':
        {
          source: 'iana',
          compressible: true,
        },
      'application/vnd.openxmlformats-officedocument.wordprocessingml.endnotes+xml':
        {
          source: 'iana',
          compressible: true,
        },
      'application/vnd.openxmlformats-officedocument.wordprocessingml.fonttable+xml':
        {
          source: 'iana',
          compressible: true,
        },
      'application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml':
        {
          source: 'iana',
          compressible: true,
        },
      'application/vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml':
        {
          source: 'iana',
          compressible: true,
        },
      'application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml':
        {
          source: 'iana',
          compressible: true,
        },
      'application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml':
        {
          source: 'iana',
          compressible: true,
        },
      'application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml':
        {
          source: 'iana',
          compressible: true,
        },
      'application/vnd.openxmlformats-officedocument.wordprocessingml.template':
        {
          source: 'iana',
          extensions: ['dotx'],
        },
      'application/vnd.openxmlformats-officedocument.wordprocessingml.template.main+xml':
        {
          source: 'iana',
          compressible: true,
        },
      'application/vnd.openxmlformats-officedocument.wordprocessingml.websettings+xml':
        {
          source: 'iana',
          compressible: true,
        },
      'application/vnd.openxmlformats-package.core-properties+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.openxmlformats-package.digital-signature-xmlsignature+xml':
        {
          source: 'iana',
          compressible: true,
        },
      'application/vnd.openxmlformats-package.relationships+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.oracle.resource+json': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.orange.indata': {
        source: 'iana',
      },
      'application/vnd.osa.netdeploy': {
        source: 'iana',
      },
      'application/vnd.osgeo.mapguide.package': {
        source: 'iana',
        extensions: ['mgp'],
      },
      'application/vnd.osgi.bundle': {
        source: 'iana',
      },
      'application/vnd.osgi.dp': {
        source: 'iana',
        extensions: ['dp'],
      },
      'application/vnd.osgi.subsystem': {
        source: 'iana',
        extensions: ['esa'],
      },
      'application/vnd.otps.ct-kip+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.oxli.countgraph': {
        source: 'iana',
      },
      'application/vnd.pagerduty+json': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.palm': {
        source: 'iana',
        extensions: ['pdb', 'pqa', 'oprc'],
      },
      'application/vnd.panoply': {
        source: 'iana',
      },
      'application/vnd.paos.xml': {
        source: 'iana',
      },
      'application/vnd.patentdive': {
        source: 'iana',
      },
      'application/vnd.patientecommsdoc': {
        source: 'iana',
      },
      'application/vnd.pawaafile': {
        source: 'iana',
        extensions: ['paw'],
      },
      'application/vnd.pcos': {
        source: 'iana',
      },
      'application/vnd.pg.format': {
        source: 'iana',
        extensions: ['str'],
      },
      'application/vnd.pg.osasli': {
        source: 'iana',
        extensions: ['ei6'],
      },
      'application/vnd.piaccess.application-licence': {
        source: 'iana',
      },
      'application/vnd.picsel': {
        source: 'iana',
        extensions: ['efif'],
      },
      'application/vnd.pmi.widget': {
        source: 'iana',
        extensions: ['wg'],
      },
      'application/vnd.poc.group-advertisement+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.pocketlearn': {
        source: 'iana',
        extensions: ['plf'],
      },
      'application/vnd.powerbuilder6': {
        source: 'iana',
        extensions: ['pbd'],
      },
      'application/vnd.powerbuilder6-s': {
        source: 'iana',
      },
      'application/vnd.powerbuilder7': {
        source: 'iana',
      },
      'application/vnd.powerbuilder7-s': {
        source: 'iana',
      },
      'application/vnd.powerbuilder75': {
        source: 'iana',
      },
      'application/vnd.powerbuilder75-s': {
        source: 'iana',
      },
      'application/vnd.preminet': {
        source: 'iana',
      },
      'application/vnd.previewsystems.box': {
        source: 'iana',
        extensions: ['box'],
      },
      'application/vnd.proteus.magazine': {
        source: 'iana',
        extensions: ['mgz'],
      },
      'application/vnd.psfs': {
        source: 'iana',
      },
      'application/vnd.publishare-delta-tree': {
        source: 'iana',
        extensions: ['qps'],
      },
      'application/vnd.pvi.ptid1': {
        source: 'iana',
        extensions: ['ptid'],
      },
      'application/vnd.pwg-multiplexed': {
        source: 'iana',
      },
      'application/vnd.pwg-xhtml-print+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.qualcomm.brew-app-res': {
        source: 'iana',
      },
      'application/vnd.quarantainenet': {
        source: 'iana',
      },
      'application/vnd.quark.quarkxpress': {
        source: 'iana',
        extensions: ['qxd', 'qxt', 'qwd', 'qwt', 'qxl', 'qxb'],
      },
      'application/vnd.quobject-quoxdocument': {
        source: 'iana',
      },
      'application/vnd.radisys.moml+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.radisys.msml+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.radisys.msml-audit+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.radisys.msml-audit-conf+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.radisys.msml-audit-conn+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.radisys.msml-audit-dialog+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.radisys.msml-audit-stream+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.radisys.msml-conf+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.radisys.msml-dialog+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.radisys.msml-dialog-base+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.radisys.msml-dialog-fax-detect+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.radisys.msml-dialog-fax-sendrecv+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.radisys.msml-dialog-group+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.radisys.msml-dialog-speech+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.radisys.msml-dialog-transform+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.rainstor.data': {
        source: 'iana',
      },
      'application/vnd.rapid': {
        source: 'iana',
      },
      'application/vnd.rar': {
        source: 'iana',
        extensions: ['rar'],
      },
      'application/vnd.realvnc.bed': {
        source: 'iana',
        extensions: ['bed'],
      },
      'application/vnd.recordare.musicxml': {
        source: 'iana',
        extensions: ['mxl'],
      },
      'application/vnd.recordare.musicxml+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['musicxml'],
      },
      'application/vnd.renlearn.rlprint': {
        source: 'iana',
      },
      'application/vnd.resilient.logic': {
        source: 'iana',
      },
      'application/vnd.restful+json': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.rig.cryptonote': {
        source: 'iana',
        extensions: ['cryptonote'],
      },
      'application/vnd.rim.cod': {
        source: 'apache',
        extensions: ['cod'],
      },
      'application/vnd.rn-realmedia': {
        source: 'apache',
        extensions: ['rm'],
      },
      'application/vnd.rn-realmedia-vbr': {
        source: 'apache',
        extensions: ['rmvb'],
      },
      'application/vnd.route66.link66+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['link66'],
      },
      'application/vnd.rs-274x': {
        source: 'iana',
      },
      'application/vnd.ruckus.download': {
        source: 'iana',
      },
      'application/vnd.s3sms': {
        source: 'iana',
      },
      'application/vnd.sailingtracker.track': {
        source: 'iana',
        extensions: ['st'],
      },
      'application/vnd.sar': {
        source: 'iana',
      },
      'application/vnd.sbm.cid': {
        source: 'iana',
      },
      'application/vnd.sbm.mid2': {
        source: 'iana',
      },
      'application/vnd.scribus': {
        source: 'iana',
      },
      'application/vnd.sealed.3df': {
        source: 'iana',
      },
      'application/vnd.sealed.csf': {
        source: 'iana',
      },
      'application/vnd.sealed.doc': {
        source: 'iana',
      },
      'application/vnd.sealed.eml': {
        source: 'iana',
      },
      'application/vnd.sealed.mht': {
        source: 'iana',
      },
      'application/vnd.sealed.net': {
        source: 'iana',
      },
      'application/vnd.sealed.ppt': {
        source: 'iana',
      },
      'application/vnd.sealed.tiff': {
        source: 'iana',
      },
      'application/vnd.sealed.xls': {
        source: 'iana',
      },
      'application/vnd.sealedmedia.softseal.html': {
        source: 'iana',
      },
      'application/vnd.sealedmedia.softseal.pdf': {
        source: 'iana',
      },
      'application/vnd.seemail': {
        source: 'iana',
        extensions: ['see'],
      },
      'application/vnd.seis+json': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.sema': {
        source: 'iana',
        extensions: ['sema'],
      },
      'application/vnd.semd': {
        source: 'iana',
        extensions: ['semd'],
      },
      'application/vnd.semf': {
        source: 'iana',
        extensions: ['semf'],
      },
      'application/vnd.shade-save-file': {
        source: 'iana',
      },
      'application/vnd.shana.informed.formdata': {
        source: 'iana',
        extensions: ['ifm'],
      },
      'application/vnd.shana.informed.formtemplate': {
        source: 'iana',
        extensions: ['itp'],
      },
      'application/vnd.shana.informed.interchange': {
        source: 'iana',
        extensions: ['iif'],
      },
      'application/vnd.shana.informed.package': {
        source: 'iana',
        extensions: ['ipk'],
      },
      'application/vnd.shootproof+json': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.shopkick+json': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.shp': {
        source: 'iana',
      },
      'application/vnd.shx': {
        source: 'iana',
      },
      'application/vnd.sigrok.session': {
        source: 'iana',
      },
      'application/vnd.simtech-mindmapper': {
        source: 'iana',
        extensions: ['twd', 'twds'],
      },
      'application/vnd.siren+json': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.smaf': {
        source: 'iana',
        extensions: ['mmf'],
      },
      'application/vnd.smart.notebook': {
        source: 'iana',
      },
      'application/vnd.smart.teacher': {
        source: 'iana',
        extensions: ['teacher'],
      },
      'application/vnd.snesdev-page-table': {
        source: 'iana',
      },
      'application/vnd.software602.filler.form+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['fo'],
      },
      'application/vnd.software602.filler.form-xml-zip': {
        source: 'iana',
      },
      'application/vnd.solent.sdkm+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['sdkm', 'sdkd'],
      },
      'application/vnd.spotfire.dxp': {
        source: 'iana',
        extensions: ['dxp'],
      },
      'application/vnd.spotfire.sfs': {
        source: 'iana',
        extensions: ['sfs'],
      },
      'application/vnd.sqlite3': {
        source: 'iana',
      },
      'application/vnd.sss-cod': {
        source: 'iana',
      },
      'application/vnd.sss-dtf': {
        source: 'iana',
      },
      'application/vnd.sss-ntf': {
        source: 'iana',
      },
      'application/vnd.stardivision.calc': {
        source: 'apache',
        extensions: ['sdc'],
      },
      'application/vnd.stardivision.draw': {
        source: 'apache',
        extensions: ['sda'],
      },
      'application/vnd.stardivision.impress': {
        source: 'apache',
        extensions: ['sdd'],
      },
      'application/vnd.stardivision.math': {
        source: 'apache',
        extensions: ['smf'],
      },
      'application/vnd.stardivision.writer': {
        source: 'apache',
        extensions: ['sdw', 'vor'],
      },
      'application/vnd.stardivision.writer-global': {
        source: 'apache',
        extensions: ['sgl'],
      },
      'application/vnd.stepmania.package': {
        source: 'iana',
        extensions: ['smzip'],
      },
      'application/vnd.stepmania.stepchart': {
        source: 'iana',
        extensions: ['sm'],
      },
      'application/vnd.street-stream': {
        source: 'iana',
      },
      'application/vnd.sun.wadl+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['wadl'],
      },
      'application/vnd.sun.xml.calc': {
        source: 'apache',
        extensions: ['sxc'],
      },
      'application/vnd.sun.xml.calc.template': {
        source: 'apache',
        extensions: ['stc'],
      },
      'application/vnd.sun.xml.draw': {
        source: 'apache',
        extensions: ['sxd'],
      },
      'application/vnd.sun.xml.draw.template': {
        source: 'apache',
        extensions: ['std'],
      },
      'application/vnd.sun.xml.impress': {
        source: 'apache',
        extensions: ['sxi'],
      },
      'application/vnd.sun.xml.impress.template': {
        source: 'apache',
        extensions: ['sti'],
      },
      'application/vnd.sun.xml.math': {
        source: 'apache',
        extensions: ['sxm'],
      },
      'application/vnd.sun.xml.writer': {
        source: 'apache',
        extensions: ['sxw'],
      },
      'application/vnd.sun.xml.writer.global': {
        source: 'apache',
        extensions: ['sxg'],
      },
      'application/vnd.sun.xml.writer.template': {
        source: 'apache',
        extensions: ['stw'],
      },
      'application/vnd.sus-calendar': {
        source: 'iana',
        extensions: ['sus', 'susp'],
      },
      'application/vnd.svd': {
        source: 'iana',
        extensions: ['svd'],
      },
      'application/vnd.swiftview-ics': {
        source: 'iana',
      },
      'application/vnd.sycle+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.syft+json': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.symbian.install': {
        source: 'apache',
        extensions: ['sis', 'sisx'],
      },
      'application/vnd.syncml+xml': {
        source: 'iana',
        charset: 'UTF-8',
        compressible: true,
        extensions: ['xsm'],
      },
      'application/vnd.syncml.dm+wbxml': {
        source: 'iana',
        charset: 'UTF-8',
        extensions: ['bdm'],
      },
      'application/vnd.syncml.dm+xml': {
        source: 'iana',
        charset: 'UTF-8',
        compressible: true,
        extensions: ['xdm'],
      },
      'application/vnd.syncml.dm.notification': {
        source: 'iana',
      },
      'application/vnd.syncml.dmddf+wbxml': {
        source: 'iana',
      },
      'application/vnd.syncml.dmddf+xml': {
        source: 'iana',
        charset: 'UTF-8',
        compressible: true,
        extensions: ['ddf'],
      },
      'application/vnd.syncml.dmtnds+wbxml': {
        source: 'iana',
      },
      'application/vnd.syncml.dmtnds+xml': {
        source: 'iana',
        charset: 'UTF-8',
        compressible: true,
      },
      'application/vnd.syncml.ds.notification': {
        source: 'iana',
      },
      'application/vnd.tableschema+json': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.tao.intent-module-archive': {
        source: 'iana',
        extensions: ['tao'],
      },
      'application/vnd.tcpdump.pcap': {
        source: 'iana',
        extensions: ['pcap', 'cap', 'dmp'],
      },
      'application/vnd.think-cell.ppttc+json': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.tmd.mediaflex.api+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.tml': {
        source: 'iana',
      },
      'application/vnd.tmobile-livetv': {
        source: 'iana',
        extensions: ['tmo'],
      },
      'application/vnd.tri.onesource': {
        source: 'iana',
      },
      'application/vnd.trid.tpt': {
        source: 'iana',
        extensions: ['tpt'],
      },
      'application/vnd.triscape.mxs': {
        source: 'iana',
        extensions: ['mxs'],
      },
      'application/vnd.trueapp': {
        source: 'iana',
        extensions: ['tra'],
      },
      'application/vnd.truedoc': {
        source: 'iana',
      },
      'application/vnd.ubisoft.webplayer': {
        source: 'iana',
      },
      'application/vnd.ufdl': {
        source: 'iana',
        extensions: ['ufd', 'ufdl'],
      },
      'application/vnd.uiq.theme': {
        source: 'iana',
        extensions: ['utz'],
      },
      'application/vnd.umajin': {
        source: 'iana',
        extensions: ['umj'],
      },
      'application/vnd.unity': {
        source: 'iana',
        extensions: ['unityweb'],
      },
      'application/vnd.uoml+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['uoml'],
      },
      'application/vnd.uplanet.alert': {
        source: 'iana',
      },
      'application/vnd.uplanet.alert-wbxml': {
        source: 'iana',
      },
      'application/vnd.uplanet.bearer-choice': {
        source: 'iana',
      },
      'application/vnd.uplanet.bearer-choice-wbxml': {
        source: 'iana',
      },
      'application/vnd.uplanet.cacheop': {
        source: 'iana',
      },
      'application/vnd.uplanet.cacheop-wbxml': {
        source: 'iana',
      },
      'application/vnd.uplanet.channel': {
        source: 'iana',
      },
      'application/vnd.uplanet.channel-wbxml': {
        source: 'iana',
      },
      'application/vnd.uplanet.list': {
        source: 'iana',
      },
      'application/vnd.uplanet.list-wbxml': {
        source: 'iana',
      },
      'application/vnd.uplanet.listcmd': {
        source: 'iana',
      },
      'application/vnd.uplanet.listcmd-wbxml': {
        source: 'iana',
      },
      'application/vnd.uplanet.signal': {
        source: 'iana',
      },
      'application/vnd.uri-map': {
        source: 'iana',
      },
      'application/vnd.valve.source.material': {
        source: 'iana',
      },
      'application/vnd.vcx': {
        source: 'iana',
        extensions: ['vcx'],
      },
      'application/vnd.vd-study': {
        source: 'iana',
      },
      'application/vnd.vectorworks': {
        source: 'iana',
      },
      'application/vnd.vel+json': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.verimatrix.vcas': {
        source: 'iana',
      },
      'application/vnd.veritone.aion+json': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.veryant.thin': {
        source: 'iana',
      },
      'application/vnd.ves.encrypted': {
        source: 'iana',
      },
      'application/vnd.vidsoft.vidconference': {
        source: 'iana',
      },
      'application/vnd.visio': {
        source: 'iana',
        extensions: ['vsd', 'vst', 'vss', 'vsw'],
      },
      'application/vnd.visionary': {
        source: 'iana',
        extensions: ['vis'],
      },
      'application/vnd.vividence.scriptfile': {
        source: 'iana',
      },
      'application/vnd.vsf': {
        source: 'iana',
        extensions: ['vsf'],
      },
      'application/vnd.wap.sic': {
        source: 'iana',
      },
      'application/vnd.wap.slc': {
        source: 'iana',
      },
      'application/vnd.wap.wbxml': {
        source: 'iana',
        charset: 'UTF-8',
        extensions: ['wbxml'],
      },
      'application/vnd.wap.wmlc': {
        source: 'iana',
        extensions: ['wmlc'],
      },
      'application/vnd.wap.wmlscriptc': {
        source: 'iana',
        extensions: ['wmlsc'],
      },
      'application/vnd.webturbo': {
        source: 'iana',
        extensions: ['wtb'],
      },
      'application/vnd.wfa.dpp': {
        source: 'iana',
      },
      'application/vnd.wfa.p2p': {
        source: 'iana',
      },
      'application/vnd.wfa.wsc': {
        source: 'iana',
      },
      'application/vnd.windows.devicepairing': {
        source: 'iana',
      },
      'application/vnd.wmc': {
        source: 'iana',
      },
      'application/vnd.wmf.bootstrap': {
        source: 'iana',
      },
      'application/vnd.wolfram.mathematica': {
        source: 'iana',
      },
      'application/vnd.wolfram.mathematica.package': {
        source: 'iana',
      },
      'application/vnd.wolfram.player': {
        source: 'iana',
        extensions: ['nbp'],
      },
      'application/vnd.wordperfect': {
        source: 'iana',
        extensions: ['wpd'],
      },
      'application/vnd.wqd': {
        source: 'iana',
        extensions: ['wqd'],
      },
      'application/vnd.wrq-hp3000-labelled': {
        source: 'iana',
      },
      'application/vnd.wt.stf': {
        source: 'iana',
        extensions: ['stf'],
      },
      'application/vnd.wv.csp+wbxml': {
        source: 'iana',
      },
      'application/vnd.wv.csp+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.wv.ssp+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.xacml+json': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.xara': {
        source: 'iana',
        extensions: ['xar'],
      },
      'application/vnd.xfdl': {
        source: 'iana',
        extensions: ['xfdl'],
      },
      'application/vnd.xfdl.webform': {
        source: 'iana',
      },
      'application/vnd.xmi+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/vnd.xmpie.cpkg': {
        source: 'iana',
      },
      'application/vnd.xmpie.dpkg': {
        source: 'iana',
      },
      'application/vnd.xmpie.plan': {
        source: 'iana',
      },
      'application/vnd.xmpie.ppkg': {
        source: 'iana',
      },
      'application/vnd.xmpie.xlim': {
        source: 'iana',
      },
      'application/vnd.yamaha.hv-dic': {
        source: 'iana',
        extensions: ['hvd'],
      },
      'application/vnd.yamaha.hv-script': {
        source: 'iana',
        extensions: ['hvs'],
      },
      'application/vnd.yamaha.hv-voice': {
        source: 'iana',
        extensions: ['hvp'],
      },
      'application/vnd.yamaha.openscoreformat': {
        source: 'iana',
        extensions: ['osf'],
      },
      'application/vnd.yamaha.openscoreformat.osfpvg+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['osfpvg'],
      },
      'application/vnd.yamaha.remote-setup': {
        source: 'iana',
      },
      'application/vnd.yamaha.smaf-audio': {
        source: 'iana',
        extensions: ['saf'],
      },
      'application/vnd.yamaha.smaf-phrase': {
        source: 'iana',
        extensions: ['spf'],
      },
      'application/vnd.yamaha.through-ngn': {
        source: 'iana',
      },
      'application/vnd.yamaha.tunnel-udpencap': {
        source: 'iana',
      },
      'application/vnd.yaoweme': {
        source: 'iana',
      },
      'application/vnd.yellowriver-custom-menu': {
        source: 'iana',
        extensions: ['cmp'],
      },
      'application/vnd.youtube.yt': {
        source: 'iana',
      },
      'application/vnd.zul': {
        source: 'iana',
        extensions: ['zir', 'zirz'],
      },
      'application/vnd.zzazz.deck+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['zaz'],
      },
      'application/voicexml+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['vxml'],
      },
      'application/voucher-cms+json': {
        source: 'iana',
        compressible: true,
      },
      'application/vq-rtcpxr': {
        source: 'iana',
      },
      'application/wasm': {
        source: 'iana',
        compressible: true,
        extensions: ['wasm'],
      },
      'application/watcherinfo+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['wif'],
      },
      'application/webpush-options+json': {
        source: 'iana',
        compressible: true,
      },
      'application/whoispp-query': {
        source: 'iana',
      },
      'application/whoispp-response': {
        source: 'iana',
      },
      'application/widget': {
        source: 'iana',
        extensions: ['wgt'],
      },
      'application/winhlp': {
        source: 'apache',
        extensions: ['hlp'],
      },
      'application/wita': {
        source: 'iana',
      },
      'application/wordperfect5.1': {
        source: 'iana',
      },
      'application/wsdl+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['wsdl'],
      },
      'application/wspolicy+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['wspolicy'],
      },
      'application/x-7z-compressed': {
        source: 'apache',
        compressible: false,
        extensions: ['7z'],
      },
      'application/x-abiword': {
        source: 'apache',
        extensions: ['abw'],
      },
      'application/x-ace-compressed': {
        source: 'apache',
        extensions: ['ace'],
      },
      'application/x-amf': {
        source: 'apache',
      },
      'application/x-apple-diskimage': {
        source: 'apache',
        extensions: ['dmg'],
      },
      'application/x-arj': {
        compressible: false,
        extensions: ['arj'],
      },
      'application/x-authorware-bin': {
        source: 'apache',
        extensions: ['aab', 'x32', 'u32', 'vox'],
      },
      'application/x-authorware-map': {
        source: 'apache',
        extensions: ['aam'],
      },
      'application/x-authorware-seg': {
        source: 'apache',
        extensions: ['aas'],
      },
      'application/x-bcpio': {
        source: 'apache',
        extensions: ['bcpio'],
      },
      'application/x-bdoc': {
        compressible: false,
        extensions: ['bdoc'],
      },
      'application/x-bittorrent': {
        source: 'apache',
        extensions: ['torrent'],
      },
      'application/x-blorb': {
        source: 'apache',
        extensions: ['blb', 'blorb'],
      },
      'application/x-bzip': {
        source: 'apache',
        compressible: false,
        extensions: ['bz'],
      },
      'application/x-bzip2': {
        source: 'apache',
        compressible: false,
        extensions: ['bz2', 'boz'],
      },
      'application/x-cbr': {
        source: 'apache',
        extensions: ['cbr', 'cba', 'cbt', 'cbz', 'cb7'],
      },
      'application/x-cdlink': {
        source: 'apache',
        extensions: ['vcd'],
      },
      'application/x-cfs-compressed': {
        source: 'apache',
        extensions: ['cfs'],
      },
      'application/x-chat': {
        source: 'apache',
        extensions: ['chat'],
      },
      'application/x-chess-pgn': {
        source: 'apache',
        extensions: ['pgn'],
      },
      'application/x-chrome-extension': {
        extensions: ['crx'],
      },
      'application/x-cocoa': {
        source: 'nginx',
        extensions: ['cco'],
      },
      'application/x-compress': {
        source: 'apache',
      },
      'application/x-conference': {
        source: 'apache',
        extensions: ['nsc'],
      },
      'application/x-cpio': {
        source: 'apache',
        extensions: ['cpio'],
      },
      'application/x-csh': {
        source: 'apache',
        extensions: ['csh'],
      },
      'application/x-deb': {
        compressible: false,
      },
      'application/x-debian-package': {
        source: 'apache',
        extensions: ['deb', 'udeb'],
      },
      'application/x-dgc-compressed': {
        source: 'apache',
        extensions: ['dgc'],
      },
      'application/x-director': {
        source: 'apache',
        extensions: [
          'dir',
          'dcr',
          'dxr',
          'cst',
          'cct',
          'cxt',
          'w3d',
          'fgd',
          'swa',
        ],
      },
      'application/x-doom': {
        source: 'apache',
        extensions: ['wad'],
      },
      'application/x-dtbncx+xml': {
        source: 'apache',
        compressible: true,
        extensions: ['ncx'],
      },
      'application/x-dtbook+xml': {
        source: 'apache',
        compressible: true,
        extensions: ['dtb'],
      },
      'application/x-dtbresource+xml': {
        source: 'apache',
        compressible: true,
        extensions: ['res'],
      },
      'application/x-dvi': {
        source: 'apache',
        compressible: false,
        extensions: ['dvi'],
      },
      'application/x-envoy': {
        source: 'apache',
        extensions: ['evy'],
      },
      'application/x-eva': {
        source: 'apache',
        extensions: ['eva'],
      },
      'application/x-font-bdf': {
        source: 'apache',
        extensions: ['bdf'],
      },
      'application/x-font-dos': {
        source: 'apache',
      },
      'application/x-font-framemaker': {
        source: 'apache',
      },
      'application/x-font-ghostscript': {
        source: 'apache',
        extensions: ['gsf'],
      },
      'application/x-font-libgrx': {
        source: 'apache',
      },
      'application/x-font-linux-psf': {
        source: 'apache',
        extensions: ['psf'],
      },
      'application/x-font-pcf': {
        source: 'apache',
        extensions: ['pcf'],
      },
      'application/x-font-snf': {
        source: 'apache',
        extensions: ['snf'],
      },
      'application/x-font-speedo': {
        source: 'apache',
      },
      'application/x-font-sunos-news': {
        source: 'apache',
      },
      'application/x-font-type1': {
        source: 'apache',
        extensions: ['pfa', 'pfb', 'pfm', 'afm'],
      },
      'application/x-font-vfont': {
        source: 'apache',
      },
      'application/x-freearc': {
        source: 'apache',
        extensions: ['arc'],
      },
      'application/x-futuresplash': {
        source: 'apache',
        extensions: ['spl'],
      },
      'application/x-gca-compressed': {
        source: 'apache',
        extensions: ['gca'],
      },
      'application/x-glulx': {
        source: 'apache',
        extensions: ['ulx'],
      },
      'application/x-gnumeric': {
        source: 'apache',
        extensions: ['gnumeric'],
      },
      'application/x-gramps-xml': {
        source: 'apache',
        extensions: ['gramps'],
      },
      'application/x-gtar': {
        source: 'apache',
        extensions: ['gtar'],
      },
      'application/x-gzip': {
        source: 'apache',
      },
      'application/x-hdf': {
        source: 'apache',
        extensions: ['hdf'],
      },
      'application/x-httpd-php': {
        compressible: true,
        extensions: ['php'],
      },
      'application/x-install-instructions': {
        source: 'apache',
        extensions: ['install'],
      },
      'application/x-iso9660-image': {
        source: 'apache',
        extensions: ['iso'],
      },
      'application/x-iwork-keynote-sffkey': {
        extensions: ['key'],
      },
      'application/x-iwork-numbers-sffnumbers': {
        extensions: ['numbers'],
      },
      'application/x-iwork-pages-sffpages': {
        extensions: ['pages'],
      },
      'application/x-java-archive-diff': {
        source: 'nginx',
        extensions: ['jardiff'],
      },
      'application/x-java-jnlp-file': {
        source: 'apache',
        compressible: false,
        extensions: ['jnlp'],
      },
      'application/x-javascript': {
        compressible: true,
      },
      'application/x-keepass2': {
        extensions: ['kdbx'],
      },
      'application/x-latex': {
        source: 'apache',
        compressible: false,
        extensions: ['latex'],
      },
      'application/x-lua-bytecode': {
        extensions: ['luac'],
      },
      'application/x-lzh-compressed': {
        source: 'apache',
        extensions: ['lzh', 'lha'],
      },
      'application/x-makeself': {
        source: 'nginx',
        extensions: ['run'],
      },
      'application/x-mie': {
        source: 'apache',
        extensions: ['mie'],
      },
      'application/x-mobipocket-ebook': {
        source: 'apache',
        extensions: ['prc', 'mobi'],
      },
      'application/x-mpegurl': {
        compressible: false,
      },
      'application/x-ms-application': {
        source: 'apache',
        extensions: ['application'],
      },
      'application/x-ms-shortcut': {
        source: 'apache',
        extensions: ['lnk'],
      },
      'application/x-ms-wmd': {
        source: 'apache',
        extensions: ['wmd'],
      },
      'application/x-ms-wmz': {
        source: 'apache',
        extensions: ['wmz'],
      },
      'application/x-ms-xbap': {
        source: 'apache',
        extensions: ['xbap'],
      },
      'application/x-msaccess': {
        source: 'apache',
        extensions: ['mdb'],
      },
      'application/x-msbinder': {
        source: 'apache',
        extensions: ['obd'],
      },
      'application/x-mscardfile': {
        source: 'apache',
        extensions: ['crd'],
      },
      'application/x-msclip': {
        source: 'apache',
        extensions: ['clp'],
      },
      'application/x-msdos-program': {
        extensions: ['exe'],
      },
      'application/x-msdownload': {
        source: 'apache',
        extensions: ['exe', 'dll', 'com', 'bat', 'msi'],
      },
      'application/x-msmediaview': {
        source: 'apache',
        extensions: ['mvb', 'm13', 'm14'],
      },
      'application/x-msmetafile': {
        source: 'apache',
        extensions: ['wmf', 'wmz', 'emf', 'emz'],
      },
      'application/x-msmoney': {
        source: 'apache',
        extensions: ['mny'],
      },
      'application/x-mspublisher': {
        source: 'apache',
        extensions: ['pub'],
      },
      'application/x-msschedule': {
        source: 'apache',
        extensions: ['scd'],
      },
      'application/x-msterminal': {
        source: 'apache',
        extensions: ['trm'],
      },
      'application/x-mswrite': {
        source: 'apache',
        extensions: ['wri'],
      },
      'application/x-netcdf': {
        source: 'apache',
        extensions: ['nc', 'cdf'],
      },
      'application/x-ns-proxy-autoconfig': {
        compressible: true,
        extensions: ['pac'],
      },
      'application/x-nzb': {
        source: 'apache',
        extensions: ['nzb'],
      },
      'application/x-perl': {
        source: 'nginx',
        extensions: ['pl', 'pm'],
      },
      'application/x-pilot': {
        source: 'nginx',
        extensions: ['prc', 'pdb'],
      },
      'application/x-pkcs12': {
        source: 'apache',
        compressible: false,
        extensions: ['p12', 'pfx'],
      },
      'application/x-pkcs7-certificates': {
        source: 'apache',
        extensions: ['p7b', 'spc'],
      },
      'application/x-pkcs7-certreqresp': {
        source: 'apache',
        extensions: ['p7r'],
      },
      'application/x-pki-message': {
        source: 'iana',
      },
      'application/x-rar-compressed': {
        source: 'apache',
        compressible: false,
        extensions: ['rar'],
      },
      'application/x-redhat-package-manager': {
        source: 'nginx',
        extensions: ['rpm'],
      },
      'application/x-research-info-systems': {
        source: 'apache',
        extensions: ['ris'],
      },
      'application/x-sea': {
        source: 'nginx',
        extensions: ['sea'],
      },
      'application/x-sh': {
        source: 'apache',
        compressible: true,
        extensions: ['sh'],
      },
      'application/x-shar': {
        source: 'apache',
        extensions: ['shar'],
      },
      'application/x-shockwave-flash': {
        source: 'apache',
        compressible: false,
        extensions: ['swf'],
      },
      'application/x-silverlight-app': {
        source: 'apache',
        extensions: ['xap'],
      },
      'application/x-sql': {
        source: 'apache',
        extensions: ['sql'],
      },
      'application/x-stuffit': {
        source: 'apache',
        compressible: false,
        extensions: ['sit'],
      },
      'application/x-stuffitx': {
        source: 'apache',
        extensions: ['sitx'],
      },
      'application/x-subrip': {
        source: 'apache',
        extensions: ['srt'],
      },
      'application/x-sv4cpio': {
        source: 'apache',
        extensions: ['sv4cpio'],
      },
      'application/x-sv4crc': {
        source: 'apache',
        extensions: ['sv4crc'],
      },
      'application/x-t3vm-image': {
        source: 'apache',
        extensions: ['t3'],
      },
      'application/x-tads': {
        source: 'apache',
        extensions: ['gam'],
      },
      'application/x-tar': {
        source: 'apache',
        compressible: true,
        extensions: ['tar'],
      },
      'application/x-tcl': {
        source: 'apache',
        extensions: ['tcl', 'tk'],
      },
      'application/x-tex': {
        source: 'apache',
        extensions: ['tex'],
      },
      'application/x-tex-tfm': {
        source: 'apache',
        extensions: ['tfm'],
      },
      'application/x-texinfo': {
        source: 'apache',
        extensions: ['texinfo', 'texi'],
      },
      'application/x-tgif': {
        source: 'apache',
        extensions: ['obj'],
      },
      'application/x-ustar': {
        source: 'apache',
        extensions: ['ustar'],
      },
      'application/x-virtualbox-hdd': {
        compressible: true,
        extensions: ['hdd'],
      },
      'application/x-virtualbox-ova': {
        compressible: true,
        extensions: ['ova'],
      },
      'application/x-virtualbox-ovf': {
        compressible: true,
        extensions: ['ovf'],
      },
      'application/x-virtualbox-vbox': {
        compressible: true,
        extensions: ['vbox'],
      },
      'application/x-virtualbox-vbox-extpack': {
        compressible: false,
        extensions: ['vbox-extpack'],
      },
      'application/x-virtualbox-vdi': {
        compressible: true,
        extensions: ['vdi'],
      },
      'application/x-virtualbox-vhd': {
        compressible: true,
        extensions: ['vhd'],
      },
      'application/x-virtualbox-vmdk': {
        compressible: true,
        extensions: ['vmdk'],
      },
      'application/x-wais-source': {
        source: 'apache',
        extensions: ['src'],
      },
      'application/x-web-app-manifest+json': {
        compressible: true,
        extensions: ['webapp'],
      },
      'application/x-www-form-urlencoded': {
        source: 'iana',
        compressible: true,
      },
      'application/x-x509-ca-cert': {
        source: 'iana',
        extensions: ['der', 'crt', 'pem'],
      },
      'application/x-x509-ca-ra-cert': {
        source: 'iana',
      },
      'application/x-x509-next-ca-cert': {
        source: 'iana',
      },
      'application/x-xfig': {
        source: 'apache',
        extensions: ['fig'],
      },
      'application/x-xliff+xml': {
        source: 'apache',
        compressible: true,
        extensions: ['xlf'],
      },
      'application/x-xpinstall': {
        source: 'apache',
        compressible: false,
        extensions: ['xpi'],
      },
      'application/x-xz': {
        source: 'apache',
        extensions: ['xz'],
      },
      'application/x-zmachine': {
        source: 'apache',
        extensions: ['z1', 'z2', 'z3', 'z4', 'z5', 'z6', 'z7', 'z8'],
      },
      'application/x400-bp': {
        source: 'iana',
      },
      'application/xacml+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/xaml+xml': {
        source: 'apache',
        compressible: true,
        extensions: ['xaml'],
      },
      'application/xcap-att+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['xav'],
      },
      'application/xcap-caps+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['xca'],
      },
      'application/xcap-diff+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['xdf'],
      },
      'application/xcap-el+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['xel'],
      },
      'application/xcap-error+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/xcap-ns+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['xns'],
      },
      'application/xcon-conference-info+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/xcon-conference-info-diff+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/xenc+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['xenc'],
      },
      'application/xhtml+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['xhtml', 'xht'],
      },
      'application/xhtml-voice+xml': {
        source: 'apache',
        compressible: true,
      },
      'application/xliff+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['xlf'],
      },
      'application/xml': {
        source: 'iana',
        compressible: true,
        extensions: ['xml', 'xsl', 'xsd', 'rng'],
      },
      'application/xml-dtd': {
        source: 'iana',
        compressible: true,
        extensions: ['dtd'],
      },
      'application/xml-external-parsed-entity': {
        source: 'iana',
      },
      'application/xml-patch+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/xmpp+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/xop+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['xop'],
      },
      'application/xproc+xml': {
        source: 'apache',
        compressible: true,
        extensions: ['xpl'],
      },
      'application/xslt+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['xsl', 'xslt'],
      },
      'application/xspf+xml': {
        source: 'apache',
        compressible: true,
        extensions: ['xspf'],
      },
      'application/xv+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['mxml', 'xhvml', 'xvml', 'xvm'],
      },
      'application/yang': {
        source: 'iana',
        extensions: ['yang'],
      },
      'application/yang-data+json': {
        source: 'iana',
        compressible: true,
      },
      'application/yang-data+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/yang-patch+json': {
        source: 'iana',
        compressible: true,
      },
      'application/yang-patch+xml': {
        source: 'iana',
        compressible: true,
      },
      'application/yin+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['yin'],
      },
      'application/zip': {
        source: 'iana',
        compressible: false,
        extensions: ['zip'],
      },
      'application/zlib': {
        source: 'iana',
      },
      'application/zstd': {
        source: 'iana',
      },
      'audio/1d-interleaved-parityfec': {
        source: 'iana',
      },
      'audio/32kadpcm': {
        source: 'iana',
      },
      'audio/3gpp': {
        source: 'iana',
        compressible: false,
        extensions: ['3gpp'],
      },
      'audio/3gpp2': {
        source: 'iana',
      },
      'audio/aac': {
        source: 'iana',
      },
      'audio/ac3': {
        source: 'iana',
      },
      'audio/adpcm': {
        source: 'apache',
        extensions: ['adp'],
      },
      'audio/amr': {
        source: 'iana',
        extensions: ['amr'],
      },
      'audio/amr-wb': {
        source: 'iana',
      },
      'audio/amr-wb+': {
        source: 'iana',
      },
      'audio/aptx': {
        source: 'iana',
      },
      'audio/asc': {
        source: 'iana',
      },
      'audio/atrac-advanced-lossless': {
        source: 'iana',
      },
      'audio/atrac-x': {
        source: 'iana',
      },
      'audio/atrac3': {
        source: 'iana',
      },
      'audio/basic': {
        source: 'iana',
        compressible: false,
        extensions: ['au', 'snd'],
      },
      'audio/bv16': {
        source: 'iana',
      },
      'audio/bv32': {
        source: 'iana',
      },
      'audio/clearmode': {
        source: 'iana',
      },
      'audio/cn': {
        source: 'iana',
      },
      'audio/dat12': {
        source: 'iana',
      },
      'audio/dls': {
        source: 'iana',
      },
      'audio/dsr-es201108': {
        source: 'iana',
      },
      'audio/dsr-es202050': {
        source: 'iana',
      },
      'audio/dsr-es202211': {
        source: 'iana',
      },
      'audio/dsr-es202212': {
        source: 'iana',
      },
      'audio/dv': {
        source: 'iana',
      },
      'audio/dvi4': {
        source: 'iana',
      },
      'audio/eac3': {
        source: 'iana',
      },
      'audio/encaprtp': {
        source: 'iana',
      },
      'audio/evrc': {
        source: 'iana',
      },
      'audio/evrc-qcp': {
        source: 'iana',
      },
      'audio/evrc0': {
        source: 'iana',
      },
      'audio/evrc1': {
        source: 'iana',
      },
      'audio/evrcb': {
        source: 'iana',
      },
      'audio/evrcb0': {
        source: 'iana',
      },
      'audio/evrcb1': {
        source: 'iana',
      },
      'audio/evrcnw': {
        source: 'iana',
      },
      'audio/evrcnw0': {
        source: 'iana',
      },
      'audio/evrcnw1': {
        source: 'iana',
      },
      'audio/evrcwb': {
        source: 'iana',
      },
      'audio/evrcwb0': {
        source: 'iana',
      },
      'audio/evrcwb1': {
        source: 'iana',
      },
      'audio/evs': {
        source: 'iana',
      },
      'audio/flexfec': {
        source: 'iana',
      },
      'audio/fwdred': {
        source: 'iana',
      },
      'audio/g711-0': {
        source: 'iana',
      },
      'audio/g719': {
        source: 'iana',
      },
      'audio/g722': {
        source: 'iana',
      },
      'audio/g7221': {
        source: 'iana',
      },
      'audio/g723': {
        source: 'iana',
      },
      'audio/g726-16': {
        source: 'iana',
      },
      'audio/g726-24': {
        source: 'iana',
      },
      'audio/g726-32': {
        source: 'iana',
      },
      'audio/g726-40': {
        source: 'iana',
      },
      'audio/g728': {
        source: 'iana',
      },
      'audio/g729': {
        source: 'iana',
      },
      'audio/g7291': {
        source: 'iana',
      },
      'audio/g729d': {
        source: 'iana',
      },
      'audio/g729e': {
        source: 'iana',
      },
      'audio/gsm': {
        source: 'iana',
      },
      'audio/gsm-efr': {
        source: 'iana',
      },
      'audio/gsm-hr-08': {
        source: 'iana',
      },
      'audio/ilbc': {
        source: 'iana',
      },
      'audio/ip-mr_v2.5': {
        source: 'iana',
      },
      'audio/isac': {
        source: 'apache',
      },
      'audio/l16': {
        source: 'iana',
      },
      'audio/l20': {
        source: 'iana',
      },
      'audio/l24': {
        source: 'iana',
        compressible: false,
      },
      'audio/l8': {
        source: 'iana',
      },
      'audio/lpc': {
        source: 'iana',
      },
      'audio/melp': {
        source: 'iana',
      },
      'audio/melp1200': {
        source: 'iana',
      },
      'audio/melp2400': {
        source: 'iana',
      },
      'audio/melp600': {
        source: 'iana',
      },
      'audio/mhas': {
        source: 'iana',
      },
      'audio/midi': {
        source: 'apache',
        extensions: ['mid', 'midi', 'kar', 'rmi'],
      },
      'audio/mobile-xmf': {
        source: 'iana',
        extensions: ['mxmf'],
      },
      'audio/mp3': {
        compressible: false,
        extensions: ['mp3'],
      },
      'audio/mp4': {
        source: 'iana',
        compressible: false,
        extensions: ['m4a', 'mp4a'],
      },
      'audio/mp4a-latm': {
        source: 'iana',
      },
      'audio/mpa': {
        source: 'iana',
      },
      'audio/mpa-robust': {
        source: 'iana',
      },
      'audio/mpeg': {
        source: 'iana',
        compressible: false,
        extensions: ['mpga', 'mp2', 'mp2a', 'mp3', 'm2a', 'm3a'],
      },
      'audio/mpeg4-generic': {
        source: 'iana',
      },
      'audio/musepack': {
        source: 'apache',
      },
      'audio/ogg': {
        source: 'iana',
        compressible: false,
        extensions: ['oga', 'ogg', 'spx', 'opus'],
      },
      'audio/opus': {
        source: 'iana',
      },
      'audio/parityfec': {
        source: 'iana',
      },
      'audio/pcma': {
        source: 'iana',
      },
      'audio/pcma-wb': {
        source: 'iana',
      },
      'audio/pcmu': {
        source: 'iana',
      },
      'audio/pcmu-wb': {
        source: 'iana',
      },
      'audio/prs.sid': {
        source: 'iana',
      },
      'audio/qcelp': {
        source: 'iana',
      },
      'audio/raptorfec': {
        source: 'iana',
      },
      'audio/red': {
        source: 'iana',
      },
      'audio/rtp-enc-aescm128': {
        source: 'iana',
      },
      'audio/rtp-midi': {
        source: 'iana',
      },
      'audio/rtploopback': {
        source: 'iana',
      },
      'audio/rtx': {
        source: 'iana',
      },
      'audio/s3m': {
        source: 'apache',
        extensions: ['s3m'],
      },
      'audio/scip': {
        source: 'iana',
      },
      'audio/silk': {
        source: 'apache',
        extensions: ['sil'],
      },
      'audio/smv': {
        source: 'iana',
      },
      'audio/smv-qcp': {
        source: 'iana',
      },
      'audio/smv0': {
        source: 'iana',
      },
      'audio/sofa': {
        source: 'iana',
      },
      'audio/sp-midi': {
        source: 'iana',
      },
      'audio/speex': {
        source: 'iana',
      },
      'audio/t140c': {
        source: 'iana',
      },
      'audio/t38': {
        source: 'iana',
      },
      'audio/telephone-event': {
        source: 'iana',
      },
      'audio/tetra_acelp': {
        source: 'iana',
      },
      'audio/tetra_acelp_bb': {
        source: 'iana',
      },
      'audio/tone': {
        source: 'iana',
      },
      'audio/tsvcis': {
        source: 'iana',
      },
      'audio/uemclip': {
        source: 'iana',
      },
      'audio/ulpfec': {
        source: 'iana',
      },
      'audio/usac': {
        source: 'iana',
      },
      'audio/vdvi': {
        source: 'iana',
      },
      'audio/vmr-wb': {
        source: 'iana',
      },
      'audio/vnd.3gpp.iufp': {
        source: 'iana',
      },
      'audio/vnd.4sb': {
        source: 'iana',
      },
      'audio/vnd.audiokoz': {
        source: 'iana',
      },
      'audio/vnd.celp': {
        source: 'iana',
      },
      'audio/vnd.cisco.nse': {
        source: 'iana',
      },
      'audio/vnd.cmles.radio-events': {
        source: 'iana',
      },
      'audio/vnd.cns.anp1': {
        source: 'iana',
      },
      'audio/vnd.cns.inf1': {
        source: 'iana',
      },
      'audio/vnd.dece.audio': {
        source: 'iana',
        extensions: ['uva', 'uvva'],
      },
      'audio/vnd.digital-winds': {
        source: 'iana',
        extensions: ['eol'],
      },
      'audio/vnd.dlna.adts': {
        source: 'iana',
      },
      'audio/vnd.dolby.heaac.1': {
        source: 'iana',
      },
      'audio/vnd.dolby.heaac.2': {
        source: 'iana',
      },
      'audio/vnd.dolby.mlp': {
        source: 'iana',
      },
      'audio/vnd.dolby.mps': {
        source: 'iana',
      },
      'audio/vnd.dolby.pl2': {
        source: 'iana',
      },
      'audio/vnd.dolby.pl2x': {
        source: 'iana',
      },
      'audio/vnd.dolby.pl2z': {
        source: 'iana',
      },
      'audio/vnd.dolby.pulse.1': {
        source: 'iana',
      },
      'audio/vnd.dra': {
        source: 'iana',
        extensions: ['dra'],
      },
      'audio/vnd.dts': {
        source: 'iana',
        extensions: ['dts'],
      },
      'audio/vnd.dts.hd': {
        source: 'iana',
        extensions: ['dtshd'],
      },
      'audio/vnd.dts.uhd': {
        source: 'iana',
      },
      'audio/vnd.dvb.file': {
        source: 'iana',
      },
      'audio/vnd.everad.plj': {
        source: 'iana',
      },
      'audio/vnd.hns.audio': {
        source: 'iana',
      },
      'audio/vnd.lucent.voice': {
        source: 'iana',
        extensions: ['lvp'],
      },
      'audio/vnd.ms-playready.media.pya': {
        source: 'iana',
        extensions: ['pya'],
      },
      'audio/vnd.nokia.mobile-xmf': {
        source: 'iana',
      },
      'audio/vnd.nortel.vbk': {
        source: 'iana',
      },
      'audio/vnd.nuera.ecelp4800': {
        source: 'iana',
        extensions: ['ecelp4800'],
      },
      'audio/vnd.nuera.ecelp7470': {
        source: 'iana',
        extensions: ['ecelp7470'],
      },
      'audio/vnd.nuera.ecelp9600': {
        source: 'iana',
        extensions: ['ecelp9600'],
      },
      'audio/vnd.octel.sbc': {
        source: 'iana',
      },
      'audio/vnd.presonus.multitrack': {
        source: 'iana',
      },
      'audio/vnd.qcelp': {
        source: 'iana',
      },
      'audio/vnd.rhetorex.32kadpcm': {
        source: 'iana',
      },
      'audio/vnd.rip': {
        source: 'iana',
        extensions: ['rip'],
      },
      'audio/vnd.rn-realaudio': {
        compressible: false,
      },
      'audio/vnd.sealedmedia.softseal.mpeg': {
        source: 'iana',
      },
      'audio/vnd.vmx.cvsd': {
        source: 'iana',
      },
      'audio/vnd.wave': {
        compressible: false,
      },
      'audio/vorbis': {
        source: 'iana',
        compressible: false,
      },
      'audio/vorbis-config': {
        source: 'iana',
      },
      'audio/wav': {
        compressible: false,
        extensions: ['wav'],
      },
      'audio/wave': {
        compressible: false,
        extensions: ['wav'],
      },
      'audio/webm': {
        source: 'apache',
        compressible: false,
        extensions: ['weba'],
      },
      'audio/x-aac': {
        source: 'apache',
        compressible: false,
        extensions: ['aac'],
      },
      'audio/x-aiff': {
        source: 'apache',
        extensions: ['aif', 'aiff', 'aifc'],
      },
      'audio/x-caf': {
        source: 'apache',
        compressible: false,
        extensions: ['caf'],
      },
      'audio/x-flac': {
        source: 'apache',
        extensions: ['flac'],
      },
      'audio/x-m4a': {
        source: 'nginx',
        extensions: ['m4a'],
      },
      'audio/x-matroska': {
        source: 'apache',
        extensions: ['mka'],
      },
      'audio/x-mpegurl': {
        source: 'apache',
        extensions: ['m3u'],
      },
      'audio/x-ms-wax': {
        source: 'apache',
        extensions: ['wax'],
      },
      'audio/x-ms-wma': {
        source: 'apache',
        extensions: ['wma'],
      },
      'audio/x-pn-realaudio': {
        source: 'apache',
        extensions: ['ram', 'ra'],
      },
      'audio/x-pn-realaudio-plugin': {
        source: 'apache',
        extensions: ['rmp'],
      },
      'audio/x-realaudio': {
        source: 'nginx',
        extensions: ['ra'],
      },
      'audio/x-tta': {
        source: 'apache',
      },
      'audio/x-wav': {
        source: 'apache',
        extensions: ['wav'],
      },
      'audio/xm': {
        source: 'apache',
        extensions: ['xm'],
      },
      'chemical/x-cdx': {
        source: 'apache',
        extensions: ['cdx'],
      },
      'chemical/x-cif': {
        source: 'apache',
        extensions: ['cif'],
      },
      'chemical/x-cmdf': {
        source: 'apache',
        extensions: ['cmdf'],
      },
      'chemical/x-cml': {
        source: 'apache',
        extensions: ['cml'],
      },
      'chemical/x-csml': {
        source: 'apache',
        extensions: ['csml'],
      },
      'chemical/x-pdb': {
        source: 'apache',
      },
      'chemical/x-xyz': {
        source: 'apache',
        extensions: ['xyz'],
      },
      'font/collection': {
        source: 'iana',
        extensions: ['ttc'],
      },
      'font/otf': {
        source: 'iana',
        compressible: true,
        extensions: ['otf'],
      },
      'font/sfnt': {
        source: 'iana',
      },
      'font/ttf': {
        source: 'iana',
        compressible: true,
        extensions: ['ttf'],
      },
      'font/woff': {
        source: 'iana',
        extensions: ['woff'],
      },
      'font/woff2': {
        source: 'iana',
        extensions: ['woff2'],
      },
      'image/aces': {
        source: 'iana',
        extensions: ['exr'],
      },
      'image/apng': {
        compressible: false,
        extensions: ['apng'],
      },
      'image/avci': {
        source: 'iana',
        extensions: ['avci'],
      },
      'image/avcs': {
        source: 'iana',
        extensions: ['avcs'],
      },
      'image/avif': {
        source: 'iana',
        compressible: false,
        extensions: ['avif'],
      },
      'image/bmp': {
        source: 'iana',
        compressible: true,
        extensions: ['bmp'],
      },
      'image/cgm': {
        source: 'iana',
        extensions: ['cgm'],
      },
      'image/dicom-rle': {
        source: 'iana',
        extensions: ['drle'],
      },
      'image/emf': {
        source: 'iana',
        extensions: ['emf'],
      },
      'image/fits': {
        source: 'iana',
        extensions: ['fits'],
      },
      'image/g3fax': {
        source: 'iana',
        extensions: ['g3'],
      },
      'image/gif': {
        source: 'iana',
        compressible: false,
        extensions: ['gif'],
      },
      'image/heic': {
        source: 'iana',
        extensions: ['heic'],
      },
      'image/heic-sequence': {
        source: 'iana',
        extensions: ['heics'],
      },
      'image/heif': {
        source: 'iana',
        extensions: ['heif'],
      },
      'image/heif-sequence': {
        source: 'iana',
        extensions: ['heifs'],
      },
      'image/hej2k': {
        source: 'iana',
        extensions: ['hej2'],
      },
      'image/hsj2': {
        source: 'iana',
        extensions: ['hsj2'],
      },
      'image/ief': {
        source: 'iana',
        extensions: ['ief'],
      },
      'image/jls': {
        source: 'iana',
        extensions: ['jls'],
      },
      'image/jp2': {
        source: 'iana',
        compressible: false,
        extensions: ['jp2', 'jpg2'],
      },
      'image/jpeg': {
        source: 'iana',
        compressible: false,
        extensions: ['jpeg', 'jpg', 'jpe'],
      },
      'image/jph': {
        source: 'iana',
        extensions: ['jph'],
      },
      'image/jphc': {
        source: 'iana',
        extensions: ['jhc'],
      },
      'image/jpm': {
        source: 'iana',
        compressible: false,
        extensions: ['jpm'],
      },
      'image/jpx': {
        source: 'iana',
        compressible: false,
        extensions: ['jpx', 'jpf'],
      },
      'image/jxr': {
        source: 'iana',
        extensions: ['jxr'],
      },
      'image/jxra': {
        source: 'iana',
        extensions: ['jxra'],
      },
      'image/jxrs': {
        source: 'iana',
        extensions: ['jxrs'],
      },
      'image/jxs': {
        source: 'iana',
        extensions: ['jxs'],
      },
      'image/jxsc': {
        source: 'iana',
        extensions: ['jxsc'],
      },
      'image/jxsi': {
        source: 'iana',
        extensions: ['jxsi'],
      },
      'image/jxss': {
        source: 'iana',
        extensions: ['jxss'],
      },
      'image/ktx': {
        source: 'iana',
        extensions: ['ktx'],
      },
      'image/ktx2': {
        source: 'iana',
        extensions: ['ktx2'],
      },
      'image/naplps': {
        source: 'iana',
      },
      'image/pjpeg': {
        compressible: false,
      },
      'image/png': {
        source: 'iana',
        compressible: false,
        extensions: ['png'],
      },
      'image/prs.btif': {
        source: 'iana',
        extensions: ['btif'],
      },
      'image/prs.pti': {
        source: 'iana',
        extensions: ['pti'],
      },
      'image/pwg-raster': {
        source: 'iana',
      },
      'image/sgi': {
        source: 'apache',
        extensions: ['sgi'],
      },
      'image/svg+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['svg', 'svgz'],
      },
      'image/t38': {
        source: 'iana',
        extensions: ['t38'],
      },
      'image/tiff': {
        source: 'iana',
        compressible: false,
        extensions: ['tif', 'tiff'],
      },
      'image/tiff-fx': {
        source: 'iana',
        extensions: ['tfx'],
      },
      'image/vnd.adobe.photoshop': {
        source: 'iana',
        compressible: true,
        extensions: ['psd'],
      },
      'image/vnd.airzip.accelerator.azv': {
        source: 'iana',
        extensions: ['azv'],
      },
      'image/vnd.cns.inf2': {
        source: 'iana',
      },
      'image/vnd.dece.graphic': {
        source: 'iana',
        extensions: ['uvi', 'uvvi', 'uvg', 'uvvg'],
      },
      'image/vnd.djvu': {
        source: 'iana',
        extensions: ['djvu', 'djv'],
      },
      'image/vnd.dvb.subtitle': {
        source: 'iana',
        extensions: ['sub'],
      },
      'image/vnd.dwg': {
        source: 'iana',
        extensions: ['dwg'],
      },
      'image/vnd.dxf': {
        source: 'iana',
        extensions: ['dxf'],
      },
      'image/vnd.fastbidsheet': {
        source: 'iana',
        extensions: ['fbs'],
      },
      'image/vnd.fpx': {
        source: 'iana',
        extensions: ['fpx'],
      },
      'image/vnd.fst': {
        source: 'iana',
        extensions: ['fst'],
      },
      'image/vnd.fujixerox.edmics-mmr': {
        source: 'iana',
        extensions: ['mmr'],
      },
      'image/vnd.fujixerox.edmics-rlc': {
        source: 'iana',
        extensions: ['rlc'],
      },
      'image/vnd.globalgraphics.pgb': {
        source: 'iana',
      },
      'image/vnd.microsoft.icon': {
        source: 'iana',
        compressible: true,
        extensions: ['ico'],
      },
      'image/vnd.mix': {
        source: 'iana',
      },
      'image/vnd.mozilla.apng': {
        source: 'iana',
      },
      'image/vnd.ms-dds': {
        compressible: true,
        extensions: ['dds'],
      },
      'image/vnd.ms-modi': {
        source: 'iana',
        extensions: ['mdi'],
      },
      'image/vnd.ms-photo': {
        source: 'apache',
        extensions: ['wdp'],
      },
      'image/vnd.net-fpx': {
        source: 'iana',
        extensions: ['npx'],
      },
      'image/vnd.pco.b16': {
        source: 'iana',
        extensions: ['b16'],
      },
      'image/vnd.radiance': {
        source: 'iana',
      },
      'image/vnd.sealed.png': {
        source: 'iana',
      },
      'image/vnd.sealedmedia.softseal.gif': {
        source: 'iana',
      },
      'image/vnd.sealedmedia.softseal.jpg': {
        source: 'iana',
      },
      'image/vnd.svf': {
        source: 'iana',
      },
      'image/vnd.tencent.tap': {
        source: 'iana',
        extensions: ['tap'],
      },
      'image/vnd.valve.source.texture': {
        source: 'iana',
        extensions: ['vtf'],
      },
      'image/vnd.wap.wbmp': {
        source: 'iana',
        extensions: ['wbmp'],
      },
      'image/vnd.xiff': {
        source: 'iana',
        extensions: ['xif'],
      },
      'image/vnd.zbrush.pcx': {
        source: 'iana',
        extensions: ['pcx'],
      },
      'image/webp': {
        source: 'apache',
        extensions: ['webp'],
      },
      'image/wmf': {
        source: 'iana',
        extensions: ['wmf'],
      },
      'image/x-3ds': {
        source: 'apache',
        extensions: ['3ds'],
      },
      'image/x-cmu-raster': {
        source: 'apache',
        extensions: ['ras'],
      },
      'image/x-cmx': {
        source: 'apache',
        extensions: ['cmx'],
      },
      'image/x-freehand': {
        source: 'apache',
        extensions: ['fh', 'fhc', 'fh4', 'fh5', 'fh7'],
      },
      'image/x-icon': {
        source: 'apache',
        compressible: true,
        extensions: ['ico'],
      },
      'image/x-jng': {
        source: 'nginx',
        extensions: ['jng'],
      },
      'image/x-mrsid-image': {
        source: 'apache',
        extensions: ['sid'],
      },
      'image/x-ms-bmp': {
        source: 'nginx',
        compressible: true,
        extensions: ['bmp'],
      },
      'image/x-pcx': {
        source: 'apache',
        extensions: ['pcx'],
      },
      'image/x-pict': {
        source: 'apache',
        extensions: ['pic', 'pct'],
      },
      'image/x-portable-anymap': {
        source: 'apache',
        extensions: ['pnm'],
      },
      'image/x-portable-bitmap': {
        source: 'apache',
        extensions: ['pbm'],
      },
      'image/x-portable-graymap': {
        source: 'apache',
        extensions: ['pgm'],
      },
      'image/x-portable-pixmap': {
        source: 'apache',
        extensions: ['ppm'],
      },
      'image/x-rgb': {
        source: 'apache',
        extensions: ['rgb'],
      },
      'image/x-tga': {
        source: 'apache',
        extensions: ['tga'],
      },
      'image/x-xbitmap': {
        source: 'apache',
        extensions: ['xbm'],
      },
      'image/x-xcf': {
        compressible: false,
      },
      'image/x-xpixmap': {
        source: 'apache',
        extensions: ['xpm'],
      },
      'image/x-xwindowdump': {
        source: 'apache',
        extensions: ['xwd'],
      },
      'message/cpim': {
        source: 'iana',
      },
      'message/delivery-status': {
        source: 'iana',
      },
      'message/disposition-notification': {
        source: 'iana',
        extensions: ['disposition-notification'],
      },
      'message/external-body': {
        source: 'iana',
      },
      'message/feedback-report': {
        source: 'iana',
      },
      'message/global': {
        source: 'iana',
        extensions: ['u8msg'],
      },
      'message/global-delivery-status': {
        source: 'iana',
        extensions: ['u8dsn'],
      },
      'message/global-disposition-notification': {
        source: 'iana',
        extensions: ['u8mdn'],
      },
      'message/global-headers': {
        source: 'iana',
        extensions: ['u8hdr'],
      },
      'message/http': {
        source: 'iana',
        compressible: false,
      },
      'message/imdn+xml': {
        source: 'iana',
        compressible: true,
      },
      'message/news': {
        source: 'iana',
      },
      'message/partial': {
        source: 'iana',
        compressible: false,
      },
      'message/rfc822': {
        source: 'iana',
        compressible: true,
        extensions: ['eml', 'mime'],
      },
      'message/s-http': {
        source: 'iana',
      },
      'message/sip': {
        source: 'iana',
      },
      'message/sipfrag': {
        source: 'iana',
      },
      'message/tracking-status': {
        source: 'iana',
      },
      'message/vnd.si.simp': {
        source: 'iana',
      },
      'message/vnd.wfa.wsc': {
        source: 'iana',
        extensions: ['wsc'],
      },
      'model/3mf': {
        source: 'iana',
        extensions: ['3mf'],
      },
      'model/e57': {
        source: 'iana',
      },
      'model/gltf+json': {
        source: 'iana',
        compressible: true,
        extensions: ['gltf'],
      },
      'model/gltf-binary': {
        source: 'iana',
        compressible: true,
        extensions: ['glb'],
      },
      'model/iges': {
        source: 'iana',
        compressible: false,
        extensions: ['igs', 'iges'],
      },
      'model/mesh': {
        source: 'iana',
        compressible: false,
        extensions: ['msh', 'mesh', 'silo'],
      },
      'model/mtl': {
        source: 'iana',
        extensions: ['mtl'],
      },
      'model/obj': {
        source: 'iana',
        extensions: ['obj'],
      },
      'model/step': {
        source: 'iana',
      },
      'model/step+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['stpx'],
      },
      'model/step+zip': {
        source: 'iana',
        compressible: false,
        extensions: ['stpz'],
      },
      'model/step-xml+zip': {
        source: 'iana',
        compressible: false,
        extensions: ['stpxz'],
      },
      'model/stl': {
        source: 'iana',
        extensions: ['stl'],
      },
      'model/vnd.collada+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['dae'],
      },
      'model/vnd.dwf': {
        source: 'iana',
        extensions: ['dwf'],
      },
      'model/vnd.flatland.3dml': {
        source: 'iana',
      },
      'model/vnd.gdl': {
        source: 'iana',
        extensions: ['gdl'],
      },
      'model/vnd.gs-gdl': {
        source: 'apache',
      },
      'model/vnd.gs.gdl': {
        source: 'iana',
      },
      'model/vnd.gtw': {
        source: 'iana',
        extensions: ['gtw'],
      },
      'model/vnd.moml+xml': {
        source: 'iana',
        compressible: true,
      },
      'model/vnd.mts': {
        source: 'iana',
        extensions: ['mts'],
      },
      'model/vnd.opengex': {
        source: 'iana',
        extensions: ['ogex'],
      },
      'model/vnd.parasolid.transmit.binary': {
        source: 'iana',
        extensions: ['x_b'],
      },
      'model/vnd.parasolid.transmit.text': {
        source: 'iana',
        extensions: ['x_t'],
      },
      'model/vnd.pytha.pyox': {
        source: 'iana',
      },
      'model/vnd.rosette.annotated-data-model': {
        source: 'iana',
      },
      'model/vnd.sap.vds': {
        source: 'iana',
        extensions: ['vds'],
      },
      'model/vnd.usdz+zip': {
        source: 'iana',
        compressible: false,
        extensions: ['usdz'],
      },
      'model/vnd.valve.source.compiled-map': {
        source: 'iana',
        extensions: ['bsp'],
      },
      'model/vnd.vtu': {
        source: 'iana',
        extensions: ['vtu'],
      },
      'model/vrml': {
        source: 'iana',
        compressible: false,
        extensions: ['wrl', 'vrml'],
      },
      'model/x3d+binary': {
        source: 'apache',
        compressible: false,
        extensions: ['x3db', 'x3dbz'],
      },
      'model/x3d+fastinfoset': {
        source: 'iana',
        extensions: ['x3db'],
      },
      'model/x3d+vrml': {
        source: 'apache',
        compressible: false,
        extensions: ['x3dv', 'x3dvz'],
      },
      'model/x3d+xml': {
        source: 'iana',
        compressible: true,
        extensions: ['x3d', 'x3dz'],
      },
      'model/x3d-vrml': {
        source: 'iana',
        extensions: ['x3dv'],
      },
      'multipart/alternative': {
        source: 'iana',
        compressible: false,
      },
      'multipart/appledouble': {
        source: 'iana',
      },
      'multipart/byteranges': {
        source: 'iana',
      },
      'multipart/digest': {
        source: 'iana',
      },
      'multipart/encrypted': {
        source: 'iana',
        compressible: false,
      },
      'multipart/form-data': {
        source: 'iana',
        compressible: false,
      },
      'multipart/header-set': {
        source: 'iana',
      },
      'multipart/mixed': {
        source: 'iana',
      },
      'multipart/multilingual': {
        source: 'iana',
      },
      'multipart/parallel': {
        source: 'iana',
      },
      'multipart/related': {
        source: 'iana',
        compressible: false,
      },
      'multipart/report': {
        source: 'iana',
      },
      'multipart/signed': {
        source: 'iana',
        compressible: false,
      },
      'multipart/vnd.bint.med-plus': {
        source: 'iana',
      },
      'multipart/voice-message': {
        source: 'iana',
      },
      'multipart/x-mixed-replace': {
        source: 'iana',
      },
      'text/1d-interleaved-parityfec': {
        source: 'iana',
      },
      'text/cache-manifest': {
        source: 'iana',
        compressible: true,
        extensions: ['appcache', 'manifest'],
      },
      'text/calendar': {
        source: 'iana',
        extensions: ['ics', 'ifb'],
      },
      'text/calender': {
        compressible: true,
      },
      'text/cmd': {
        compressible: true,
      },
      'text/coffeescript': {
        extensions: ['coffee', 'litcoffee'],
      },
      'text/cql': {
        source: 'iana',
      },
      'text/cql-expression': {
        source: 'iana',
      },
      'text/cql-identifier': {
        source: 'iana',
      },
      'text/css': {
        source: 'iana',
        charset: 'UTF-8',
        compressible: true,
        extensions: ['css'],
      },
      'text/csv': {
        source: 'iana',
        compressible: true,
        extensions: ['csv'],
      },
      'text/csv-schema': {
        source: 'iana',
      },
      'text/directory': {
        source: 'iana',
      },
      'text/dns': {
        source: 'iana',
      },
      'text/ecmascript': {
        source: 'iana',
      },
      'text/encaprtp': {
        source: 'iana',
      },
      'text/enriched': {
        source: 'iana',
      },
      'text/fhirpath': {
        source: 'iana',
      },
      'text/flexfec': {
        source: 'iana',
      },
      'text/fwdred': {
        source: 'iana',
      },
      'text/gff3': {
        source: 'iana',
      },
      'text/grammar-ref-list': {
        source: 'iana',
      },
      'text/html': {
        source: 'iana',
        compressible: true,
        extensions: ['html', 'htm', 'shtml'],
      },
      'text/jade': {
        extensions: ['jade'],
      },
      'text/javascript': {
        source: 'iana',
        compressible: true,
      },
      'text/jcr-cnd': {
        source: 'iana',
      },
      'text/jsx': {
        compressible: true,
        extensions: ['jsx'],
      },
      'text/less': {
        compressible: true,
        extensions: ['less'],
      },
      'text/markdown': {
        source: 'iana',
        compressible: true,
        extensions: ['markdown', 'md'],
      },
      'text/mathml': {
        source: 'nginx',
        extensions: ['mml'],
      },
      'text/mdx': {
        compressible: true,
        extensions: ['mdx'],
      },
      'text/mizar': {
        source: 'iana',
      },
      'text/n3': {
        source: 'iana',
        charset: 'UTF-8',
        compressible: true,
        extensions: ['n3'],
      },
      'text/parameters': {
        source: 'iana',
        charset: 'UTF-8',
      },
      'text/parityfec': {
        source: 'iana',
      },
      'text/plain': {
        source: 'iana',
        compressible: true,
        extensions: ['txt', 'text', 'conf', 'def', 'list', 'log', 'in', 'ini'],
      },
      'text/provenance-notation': {
        source: 'iana',
        charset: 'UTF-8',
      },
      'text/prs.fallenstein.rst': {
        source: 'iana',
      },
      'text/prs.lines.tag': {
        source: 'iana',
        extensions: ['dsc'],
      },
      'text/prs.prop.logic': {
        source: 'iana',
      },
      'text/raptorfec': {
        source: 'iana',
      },
      'text/red': {
        source: 'iana',
      },
      'text/rfc822-headers': {
        source: 'iana',
      },
      'text/richtext': {
        source: 'iana',
        compressible: true,
        extensions: ['rtx'],
      },
      'text/rtf': {
        source: 'iana',
        compressible: true,
        extensions: ['rtf'],
      },
      'text/rtp-enc-aescm128': {
        source: 'iana',
      },
      'text/rtploopback': {
        source: 'iana',
      },
      'text/rtx': {
        source: 'iana',
      },
      'text/sgml': {
        source: 'iana',
        extensions: ['sgml', 'sgm'],
      },
      'text/shaclc': {
        source: 'iana',
      },
      'text/shex': {
        source: 'iana',
        extensions: ['shex'],
      },
      'text/slim': {
        extensions: ['slim', 'slm'],
      },
      'text/spdx': {
        source: 'iana',
        extensions: ['spdx'],
      },
      'text/strings': {
        source: 'iana',
      },
      'text/stylus': {
        extensions: ['stylus', 'styl'],
      },
      'text/t140': {
        source: 'iana',
      },
      'text/tab-separated-values': {
        source: 'iana',
        compressible: true,
        extensions: ['tsv'],
      },
      'text/troff': {
        source: 'iana',
        extensions: ['t', 'tr', 'roff', 'man', 'me', 'ms'],
      },
      'text/turtle': {
        source: 'iana',
        charset: 'UTF-8',
        extensions: ['ttl'],
      },
      'text/ulpfec': {
        source: 'iana',
      },
      'text/uri-list': {
        source: 'iana',
        compressible: true,
        extensions: ['uri', 'uris', 'urls'],
      },
      'text/vcard': {
        source: 'iana',
        compressible: true,
        extensions: ['vcard'],
      },
      'text/vnd.a': {
        source: 'iana',
      },
      'text/vnd.abc': {
        source: 'iana',
      },
      'text/vnd.ascii-art': {
        source: 'iana',
      },
      'text/vnd.curl': {
        source: 'iana',
        extensions: ['curl'],
      },
      'text/vnd.curl.dcurl': {
        source: 'apache',
        extensions: ['dcurl'],
      },
      'text/vnd.curl.mcurl': {
        source: 'apache',
        extensions: ['mcurl'],
      },
      'text/vnd.curl.scurl': {
        source: 'apache',
        extensions: ['scurl'],
      },
      'text/vnd.debian.copyright': {
        source: 'iana',
        charset: 'UTF-8',
      },
      'text/vnd.dmclientscript': {
        source: 'iana',
      },
      'text/vnd.dvb.subtitle': {
        source: 'iana',
        extensions: ['sub'],
      },
      'text/vnd.esmertec.theme-descriptor': {
        source: 'iana',
        charset: 'UTF-8',
      },
      'text/vnd.familysearch.gedcom': {
        source: 'iana',
        extensions: ['ged'],
      },
      'text/vnd.ficlab.flt': {
        source: 'iana',
      },
      'text/vnd.fly': {
        source: 'iana',
        extensions: ['fly'],
      },
      'text/vnd.fmi.flexstor': {
        source: 'iana',
        extensions: ['flx'],
      },
      'text/vnd.gml': {
        source: 'iana',
      },
      'text/vnd.graphviz': {
        source: 'iana',
        extensions: ['gv'],
      },
      'text/vnd.hans': {
        source: 'iana',
      },
      'text/vnd.hgl': {
        source: 'iana',
      },
      'text/vnd.in3d.3dml': {
        source: 'iana',
        extensions: ['3dml'],
      },
      'text/vnd.in3d.spot': {
        source: 'iana',
        extensions: ['spot'],
      },
      'text/vnd.iptc.newsml': {
        source: 'iana',
      },
      'text/vnd.iptc.nitf': {
        source: 'iana',
      },
      'text/vnd.latex-z': {
        source: 'iana',
      },
      'text/vnd.motorola.reflex': {
        source: 'iana',
      },
      'text/vnd.ms-mediapackage': {
        source: 'iana',
      },
      'text/vnd.net2phone.commcenter.command': {
        source: 'iana',
      },
      'text/vnd.radisys.msml-basic-layout': {
        source: 'iana',
      },
      'text/vnd.senx.warpscript': {
        source: 'iana',
      },
      'text/vnd.si.uricatalogue': {
        source: 'iana',
      },
      'text/vnd.sosi': {
        source: 'iana',
      },
      'text/vnd.sun.j2me.app-descriptor': {
        source: 'iana',
        charset: 'UTF-8',
        extensions: ['jad'],
      },
      'text/vnd.trolltech.linguist': {
        source: 'iana',
        charset: 'UTF-8',
      },
      'text/vnd.wap.si': {
        source: 'iana',
      },
      'text/vnd.wap.sl': {
        source: 'iana',
      },
      'text/vnd.wap.wml': {
        source: 'iana',
        extensions: ['wml'],
      },
      'text/vnd.wap.wmlscript': {
        source: 'iana',
        extensions: ['wmls'],
      },
      'text/vtt': {
        source: 'iana',
        charset: 'UTF-8',
        compressible: true,
        extensions: ['vtt'],
      },
      'text/x-asm': {
        source: 'apache',
        extensions: ['s', 'asm'],
      },
      'text/x-c': {
        source: 'apache',
        extensions: ['c', 'cc', 'cxx', 'cpp', 'h', 'hh', 'dic'],
      },
      'text/x-component': {
        source: 'nginx',
        extensions: ['htc'],
      },
      'text/x-fortran': {
        source: 'apache',
        extensions: ['f', 'for', 'f77', 'f90'],
      },
      'text/x-gwt-rpc': {
        compressible: true,
      },
      'text/x-handlebars-template': {
        extensions: ['hbs'],
      },
      'text/x-java-source': {
        source: 'apache',
        extensions: ['java'],
      },
      'text/x-jquery-tmpl': {
        compressible: true,
      },
      'text/x-lua': {
        extensions: ['lua'],
      },
      'text/x-markdown': {
        compressible: true,
        extensions: ['mkd'],
      },
      'text/x-nfo': {
        source: 'apache',
        extensions: ['nfo'],
      },
      'text/x-opml': {
        source: 'apache',
        extensions: ['opml'],
      },
      'text/x-org': {
        compressible: true,
        extensions: ['org'],
      },
      'text/x-pascal': {
        source: 'apache',
        extensions: ['p', 'pas'],
      },
      'text/x-processing': {
        compressible: true,
        extensions: ['pde'],
      },
      'text/x-sass': {
        extensions: ['sass'],
      },
      'text/x-scss': {
        extensions: ['scss'],
      },
      'text/x-setext': {
        source: 'apache',
        extensions: ['etx'],
      },
      'text/x-sfv': {
        source: 'apache',
        extensions: ['sfv'],
      },
      'text/x-suse-ymp': {
        compressible: true,
        extensions: ['ymp'],
      },
      'text/x-uuencode': {
        source: 'apache',
        extensions: ['uu'],
      },
      'text/x-vcalendar': {
        source: 'apache',
        extensions: ['vcs'],
      },
      'text/x-vcard': {
        source: 'apache',
        extensions: ['vcf'],
      },
      'text/xml': {
        source: 'iana',
        compressible: true,
        extensions: ['xml'],
      },
      'text/xml-external-parsed-entity': {
        source: 'iana',
      },
      'text/yaml': {
        compressible: true,
        extensions: ['yaml', 'yml'],
      },
      'video/1d-interleaved-parityfec': {
        source: 'iana',
      },
      'video/3gpp': {
        source: 'iana',
        extensions: ['3gp', '3gpp'],
      },
      'video/3gpp-tt': {
        source: 'iana',
      },
      'video/3gpp2': {
        source: 'iana',
        extensions: ['3g2'],
      },
      'video/av1': {
        source: 'iana',
      },
      'video/bmpeg': {
        source: 'iana',
      },
      'video/bt656': {
        source: 'iana',
      },
      'video/celb': {
        source: 'iana',
      },
      'video/dv': {
        source: 'iana',
      },
      'video/encaprtp': {
        source: 'iana',
      },
      'video/ffv1': {
        source: 'iana',
      },
      'video/flexfec': {
        source: 'iana',
      },
      'video/h261': {
        source: 'iana',
        extensions: ['h261'],
      },
      'video/h263': {
        source: 'iana',
        extensions: ['h263'],
      },
      'video/h263-1998': {
        source: 'iana',
      },
      'video/h263-2000': {
        source: 'iana',
      },
      'video/h264': {
        source: 'iana',
        extensions: ['h264'],
      },
      'video/h264-rcdo': {
        source: 'iana',
      },
      'video/h264-svc': {
        source: 'iana',
      },
      'video/h265': {
        source: 'iana',
      },
      'video/iso.segment': {
        source: 'iana',
        extensions: ['m4s'],
      },
      'video/jpeg': {
        source: 'iana',
        extensions: ['jpgv'],
      },
      'video/jpeg2000': {
        source: 'iana',
      },
      'video/jpm': {
        source: 'apache',
        extensions: ['jpm', 'jpgm'],
      },
      'video/jxsv': {
        source: 'iana',
      },
      'video/mj2': {
        source: 'iana',
        extensions: ['mj2', 'mjp2'],
      },
      'video/mp1s': {
        source: 'iana',
      },
      'video/mp2p': {
        source: 'iana',
      },
      'video/mp2t': {
        source: 'iana',
        extensions: ['ts'],
      },
      'video/mp4': {
        source: 'iana',
        compressible: false,
        extensions: ['mp4', 'mp4v', 'mpg4'],
      },
      'video/mp4v-es': {
        source: 'iana',
      },
      'video/mpeg': {
        source: 'iana',
        compressible: false,
        extensions: ['mpeg', 'mpg', 'mpe', 'm1v', 'm2v'],
      },
      'video/mpeg4-generic': {
        source: 'iana',
      },
      'video/mpv': {
        source: 'iana',
      },
      'video/nv': {
        source: 'iana',
      },
      'video/ogg': {
        source: 'iana',
        compressible: false,
        extensions: ['ogv'],
      },
      'video/parityfec': {
        source: 'iana',
      },
      'video/pointer': {
        source: 'iana',
      },
      'video/quicktime': {
        source: 'iana',
        compressible: false,
        extensions: ['qt', 'mov'],
      },
      'video/raptorfec': {
        source: 'iana',
      },
      'video/raw': {
        source: 'iana',
      },
      'video/rtp-enc-aescm128': {
        source: 'iana',
      },
      'video/rtploopback': {
        source: 'iana',
      },
      'video/rtx': {
        source: 'iana',
      },
      'video/scip': {
        source: 'iana',
      },
      'video/smpte291': {
        source: 'iana',
      },
      'video/smpte292m': {
        source: 'iana',
      },
      'video/ulpfec': {
        source: 'iana',
      },
      'video/vc1': {
        source: 'iana',
      },
      'video/vc2': {
        source: 'iana',
      },
      'video/vnd.cctv': {
        source: 'iana',
      },
      'video/vnd.dece.hd': {
        source: 'iana',
        extensions: ['uvh', 'uvvh'],
      },
      'video/vnd.dece.mobile': {
        source: 'iana',
        extensions: ['uvm', 'uvvm'],
      },
      'video/vnd.dece.mp4': {
        source: 'iana',
      },
      'video/vnd.dece.pd': {
        source: 'iana',
        extensions: ['uvp', 'uvvp'],
      },
      'video/vnd.dece.sd': {
        source: 'iana',
        extensions: ['uvs', 'uvvs'],
      },
      'video/vnd.dece.video': {
        source: 'iana',
        extensions: ['uvv', 'uvvv'],
      },
      'video/vnd.directv.mpeg': {
        source: 'iana',
      },
      'video/vnd.directv.mpeg-tts': {
        source: 'iana',
      },
      'video/vnd.dlna.mpeg-tts': {
        source: 'iana',
      },
      'video/vnd.dvb.file': {
        source: 'iana',
        extensions: ['dvb'],
      },
      'video/vnd.fvt': {
        source: 'iana',
        extensions: ['fvt'],
      },
      'video/vnd.hns.video': {
        source: 'iana',
      },
      'video/vnd.iptvforum.1dparityfec-1010': {
        source: 'iana',
      },
      'video/vnd.iptvforum.1dparityfec-2005': {
        source: 'iana',
      },
      'video/vnd.iptvforum.2dparityfec-1010': {
        source: 'iana',
      },
      'video/vnd.iptvforum.2dparityfec-2005': {
        source: 'iana',
      },
      'video/vnd.iptvforum.ttsavc': {
        source: 'iana',
      },
      'video/vnd.iptvforum.ttsmpeg2': {
        source: 'iana',
      },
      'video/vnd.motorola.video': {
        source: 'iana',
      },
      'video/vnd.motorola.videop': {
        source: 'iana',
      },
      'video/vnd.mpegurl': {
        source: 'iana',
        extensions: ['mxu', 'm4u'],
      },
      'video/vnd.ms-playready.media.pyv': {
        source: 'iana',
        extensions: ['pyv'],
      },
      'video/vnd.nokia.interleaved-multimedia': {
        source: 'iana',
      },
      'video/vnd.nokia.mp4vr': {
        source: 'iana',
      },
      'video/vnd.nokia.videovoip': {
        source: 'iana',
      },
      'video/vnd.objectvideo': {
        source: 'iana',
      },
      'video/vnd.radgamettools.bink': {
        source: 'iana',
      },
      'video/vnd.radgamettools.smacker': {
        source: 'iana',
      },
      'video/vnd.sealed.mpeg1': {
        source: 'iana',
      },
      'video/vnd.sealed.mpeg4': {
        source: 'iana',
      },
      'video/vnd.sealed.swf': {
        source: 'iana',
      },
      'video/vnd.sealedmedia.softseal.mov': {
        source: 'iana',
      },
      'video/vnd.uvvu.mp4': {
        source: 'iana',
        extensions: ['uvu', 'uvvu'],
      },
      'video/vnd.vivo': {
        source: 'iana',
        extensions: ['viv'],
      },
      'video/vnd.youtube.yt': {
        source: 'iana',
      },
      'video/vp8': {
        source: 'iana',
      },
      'video/vp9': {
        source: 'iana',
      },
      'video/webm': {
        source: 'apache',
        compressible: false,
        extensions: ['webm'],
      },
      'video/x-f4v': {
        source: 'apache',
        extensions: ['f4v'],
      },
      'video/x-fli': {
        source: 'apache',
        extensions: ['fli'],
      },
      'video/x-flv': {
        source: 'apache',
        compressible: false,
        extensions: ['flv'],
      },
      'video/x-m4v': {
        source: 'apache',
        extensions: ['m4v'],
      },
      'video/x-matroska': {
        source: 'apache',
        compressible: false,
        extensions: ['mkv', 'mk3d', 'mks'],
      },
      'video/x-mng': {
        source: 'apache',
        extensions: ['mng'],
      },
      'video/x-ms-asf': {
        source: 'apache',
        extensions: ['asf', 'asx'],
      },
      'video/x-ms-vob': {
        source: 'apache',
        extensions: ['vob'],
      },
      'video/x-ms-wm': {
        source: 'apache',
        extensions: ['wm'],
      },
      'video/x-ms-wmv': {
        source: 'apache',
        compressible: false,
        extensions: ['wmv'],
      },
      'video/x-ms-wmx': {
        source: 'apache',
        extensions: ['wmx'],
      },
      'video/x-ms-wvx': {
        source: 'apache',
        extensions: ['wvx'],
      },
      'video/x-msvideo': {
        source: 'apache',
        extensions: ['avi'],
      },
      'video/x-sgi-movie': {
        source: 'apache',
        extensions: ['movie'],
      },
      'video/x-smv': {
        source: 'apache',
        extensions: ['smv'],
      },
      'x-conference/x-cooltalk': {
        source: 'apache',
        extensions: ['ice'],
      },
      'x-shader/x-fragment': {
        compressible: true,
      },
      'x-shader/x-vertex': {
        compressible: true,
      },
    };
  },
});

// node_modules/mime-db/index.js
var require_mime_db = __commonJS({
  'node_modules/mime-db/index.js'(exports2, module2) {
    module2.exports = require_db();
  },
});

// node_modules/mime-types/index.js
var require_mime_types = __commonJS({
  'node_modules/mime-types/index.js'(exports2) {
    'use strict';
    var db = require_mime_db();
    var extname = require('path').extname;
    var EXTRACT_TYPE_REGEXP = /^\s*([^;\s]*)(?:;|\s|$)/;
    var TEXT_TYPE_REGEXP = /^text\//i;
    exports2.charset = charset;
    exports2.charsets = { lookup: charset };
    exports2.contentType = contentType;
    exports2.extension = extension;
    exports2.extensions = /* @__PURE__ */ Object.create(null);
    exports2.lookup = lookup;
    exports2.types = /* @__PURE__ */ Object.create(null);
    populateMaps(exports2.extensions, exports2.types);
    function charset(type) {
      if (!type || typeof type !== 'string') {
        return false;
      }
      var match = EXTRACT_TYPE_REGEXP.exec(type);
      var mime = match && db[match[1].toLowerCase()];
      if (mime && mime.charset) {
        return mime.charset;
      }
      if (match && TEXT_TYPE_REGEXP.test(match[1])) {
        return 'UTF-8';
      }
      return false;
    }
    function contentType(str) {
      if (!str || typeof str !== 'string') {
        return false;
      }
      var mime = str.indexOf('/') === -1 ? exports2.lookup(str) : str;
      if (!mime) {
        return false;
      }
      if (mime.indexOf('charset') === -1) {
        var charset2 = exports2.charset(mime);
        if (charset2) mime += '; charset=' + charset2.toLowerCase();
      }
      return mime;
    }
    function extension(type) {
      if (!type || typeof type !== 'string') {
        return false;
      }
      var match = EXTRACT_TYPE_REGEXP.exec(type);
      var exts = match && exports2.extensions[match[1].toLowerCase()];
      if (!exts || !exts.length) {
        return false;
      }
      return exts[0];
    }
    function lookup(path) {
      if (!path || typeof path !== 'string') {
        return false;
      }
      var extension2 = extname('x.' + path)
        .toLowerCase()
        .substr(1);
      if (!extension2) {
        return false;
      }
      return exports2.types[extension2] || false;
    }
    function populateMaps(extensions, types) {
      var preference = ['nginx', 'apache', void 0, 'iana'];
      Object.keys(db).forEach(function forEachMimeType(type) {
        var mime = db[type];
        var exts = mime.extensions;
        if (!exts || !exts.length) {
          return;
        }
        extensions[type] = exts;
        for (var i = 0; i < exts.length; i++) {
          var extension2 = exts[i];
          if (types[extension2]) {
            var from = preference.indexOf(db[types[extension2]].source);
            var to = preference.indexOf(mime.source);
            if (
              types[extension2] !== 'application/octet-stream' &&
              (from > to ||
                (from === to &&
                  types[extension2].substr(0, 12) === 'application/'))
            ) {
              continue;
            }
          }
          types[extension2] = type;
        }
      });
    }
  },
});

// node_modules/asynckit/lib/defer.js
var require_defer = __commonJS({
  'node_modules/asynckit/lib/defer.js'(exports2, module2) {
    module2.exports = defer;
    function defer(fn) {
      var nextTick =
        typeof setImmediate == 'function'
          ? setImmediate
          : typeof process == 'object' && typeof process.nextTick == 'function'
            ? process.nextTick
            : null;
      if (nextTick) {
        nextTick(fn);
      } else {
        setTimeout(fn, 0);
      }
    }
  },
});

// node_modules/asynckit/lib/async.js
var require_async = __commonJS({
  'node_modules/asynckit/lib/async.js'(exports2, module2) {
    var defer = require_defer();
    module2.exports = async;
    function async(callback) {
      var isAsync = false;
      defer(function () {
        isAsync = true;
      });
      return function async_callback(err, result) {
        if (isAsync) {
          callback(err, result);
        } else {
          defer(function nextTick_callback() {
            callback(err, result);
          });
        }
      };
    }
  },
});

// node_modules/asynckit/lib/abort.js
var require_abort = __commonJS({
  'node_modules/asynckit/lib/abort.js'(exports2, module2) {
    module2.exports = abort;
    function abort(state) {
      Object.keys(state.jobs).forEach(clean.bind(state));
      state.jobs = {};
    }
    function clean(key) {
      if (typeof this.jobs[key] == 'function') {
        this.jobs[key]();
      }
    }
  },
});

// node_modules/asynckit/lib/iterate.js
var require_iterate = __commonJS({
  'node_modules/asynckit/lib/iterate.js'(exports2, module2) {
    var async = require_async();
    var abort = require_abort();
    module2.exports = iterate;
    function iterate(list, iterator, state, callback) {
      var key = state['keyedList']
        ? state['keyedList'][state.index]
        : state.index;
      state.jobs[key] = runJob(
        iterator,
        key,
        list[key],
        function (error, output) {
          if (!(key in state.jobs)) {
            return;
          }
          delete state.jobs[key];
          if (error) {
            abort(state);
          } else {
            state.results[key] = output;
          }
          callback(error, state.results);
        },
      );
    }
    function runJob(iterator, key, item, callback) {
      var aborter;
      if (iterator.length == 2) {
        aborter = iterator(item, async(callback));
      } else {
        aborter = iterator(item, key, async(callback));
      }
      return aborter;
    }
  },
});

// node_modules/asynckit/lib/state.js
var require_state = __commonJS({
  'node_modules/asynckit/lib/state.js'(exports2, module2) {
    module2.exports = state;
    function state(list, sortMethod) {
      var isNamedList = !Array.isArray(list),
        initState = {
          index: 0,
          keyedList: isNamedList || sortMethod ? Object.keys(list) : null,
          jobs: {},
          results: isNamedList ? {} : [],
          size: isNamedList ? Object.keys(list).length : list.length,
        };
      if (sortMethod) {
        initState.keyedList.sort(
          isNamedList
            ? sortMethod
            : function (a, b) {
                return sortMethod(list[a], list[b]);
              },
        );
      }
      return initState;
    }
  },
});

// node_modules/asynckit/lib/terminator.js
var require_terminator = __commonJS({
  'node_modules/asynckit/lib/terminator.js'(exports2, module2) {
    var abort = require_abort();
    var async = require_async();
    module2.exports = terminator;
    function terminator(callback) {
      if (!Object.keys(this.jobs).length) {
        return;
      }
      this.index = this.size;
      abort(this);
      async(callback)(null, this.results);
    }
  },
});

// node_modules/asynckit/parallel.js
var require_parallel = __commonJS({
  'node_modules/asynckit/parallel.js'(exports2, module2) {
    var iterate = require_iterate();
    var initState = require_state();
    var terminator = require_terminator();
    module2.exports = parallel;
    function parallel(list, iterator, callback) {
      var state = initState(list);
      while (state.index < (state['keyedList'] || list).length) {
        iterate(list, iterator, state, function (error, result) {
          if (error) {
            callback(error, result);
            return;
          }
          if (Object.keys(state.jobs).length === 0) {
            callback(null, state.results);
            return;
          }
        });
        state.index++;
      }
      return terminator.bind(state, callback);
    }
  },
});

// node_modules/asynckit/serialOrdered.js
var require_serialOrdered = __commonJS({
  'node_modules/asynckit/serialOrdered.js'(exports2, module2) {
    var iterate = require_iterate();
    var initState = require_state();
    var terminator = require_terminator();
    module2.exports = serialOrdered;
    module2.exports.ascending = ascending;
    module2.exports.descending = descending;
    function serialOrdered(list, iterator, sortMethod, callback) {
      var state = initState(list, sortMethod);
      iterate(list, iterator, state, function iteratorHandler(error, result) {
        if (error) {
          callback(error, result);
          return;
        }
        state.index++;
        if (state.index < (state['keyedList'] || list).length) {
          iterate(list, iterator, state, iteratorHandler);
          return;
        }
        callback(null, state.results);
      });
      return terminator.bind(state, callback);
    }
    function ascending(a, b) {
      return a < b ? -1 : a > b ? 1 : 0;
    }
    function descending(a, b) {
      return -1 * ascending(a, b);
    }
  },
});

// node_modules/asynckit/serial.js
var require_serial = __commonJS({
  'node_modules/asynckit/serial.js'(exports2, module2) {
    var serialOrdered = require_serialOrdered();
    module2.exports = serial;
    function serial(list, iterator, callback) {
      return serialOrdered(list, iterator, null, callback);
    }
  },
});

// node_modules/asynckit/index.js
var require_asynckit = __commonJS({
  'node_modules/asynckit/index.js'(exports2, module2) {
    module2.exports = {
      parallel: require_parallel(),
      serial: require_serial(),
      serialOrdered: require_serialOrdered(),
    };
  },
});

// node_modules/es-object-atoms/index.js
var require_es_object_atoms = __commonJS({
  'node_modules/es-object-atoms/index.js'(exports2, module2) {
    'use strict';
    module2.exports = Object;
  },
});

// node_modules/es-errors/index.js
var require_es_errors = __commonJS({
  'node_modules/es-errors/index.js'(exports2, module2) {
    'use strict';
    module2.exports = Error;
  },
});

// node_modules/es-errors/eval.js
var require_eval = __commonJS({
  'node_modules/es-errors/eval.js'(exports2, module2) {
    'use strict';
    module2.exports = EvalError;
  },
});

// node_modules/es-errors/range.js
var require_range = __commonJS({
  'node_modules/es-errors/range.js'(exports2, module2) {
    'use strict';
    module2.exports = RangeError;
  },
});

// node_modules/es-errors/ref.js
var require_ref = __commonJS({
  'node_modules/es-errors/ref.js'(exports2, module2) {
    'use strict';
    module2.exports = ReferenceError;
  },
});

// node_modules/es-errors/syntax.js
var require_syntax = __commonJS({
  'node_modules/es-errors/syntax.js'(exports2, module2) {
    'use strict';
    module2.exports = SyntaxError;
  },
});

// node_modules/es-errors/type.js
var require_type = __commonJS({
  'node_modules/es-errors/type.js'(exports2, module2) {
    'use strict';
    module2.exports = TypeError;
  },
});

// node_modules/es-errors/uri.js
var require_uri = __commonJS({
  'node_modules/es-errors/uri.js'(exports2, module2) {
    'use strict';
    module2.exports = URIError;
  },
});

// node_modules/math-intrinsics/abs.js
var require_abs = __commonJS({
  'node_modules/math-intrinsics/abs.js'(exports2, module2) {
    'use strict';
    module2.exports = Math.abs;
  },
});

// node_modules/math-intrinsics/floor.js
var require_floor = __commonJS({
  'node_modules/math-intrinsics/floor.js'(exports2, module2) {
    'use strict';
    module2.exports = Math.floor;
  },
});

// node_modules/math-intrinsics/max.js
var require_max = __commonJS({
  'node_modules/math-intrinsics/max.js'(exports2, module2) {
    'use strict';
    module2.exports = Math.max;
  },
});

// node_modules/math-intrinsics/min.js
var require_min = __commonJS({
  'node_modules/math-intrinsics/min.js'(exports2, module2) {
    'use strict';
    module2.exports = Math.min;
  },
});

// node_modules/math-intrinsics/pow.js
var require_pow = __commonJS({
  'node_modules/math-intrinsics/pow.js'(exports2, module2) {
    'use strict';
    module2.exports = Math.pow;
  },
});

// node_modules/math-intrinsics/round.js
var require_round = __commonJS({
  'node_modules/math-intrinsics/round.js'(exports2, module2) {
    'use strict';
    module2.exports = Math.round;
  },
});

// node_modules/math-intrinsics/isNaN.js
var require_isNaN = __commonJS({
  'node_modules/math-intrinsics/isNaN.js'(exports2, module2) {
    'use strict';
    module2.exports =
      Number.isNaN ||
      function isNaN2(a) {
        return a !== a;
      };
  },
});

// node_modules/math-intrinsics/sign.js
var require_sign = __commonJS({
  'node_modules/math-intrinsics/sign.js'(exports2, module2) {
    'use strict';
    var $isNaN = require_isNaN();
    module2.exports = function sign(number) {
      if ($isNaN(number) || number === 0) {
        return number;
      }
      return number < 0 ? -1 : 1;
    };
  },
});

// node_modules/gopd/gOPD.js
var require_gOPD = __commonJS({
  'node_modules/gopd/gOPD.js'(exports2, module2) {
    'use strict';
    module2.exports = Object.getOwnPropertyDescriptor;
  },
});

// node_modules/gopd/index.js
var require_gopd = __commonJS({
  'node_modules/gopd/index.js'(exports2, module2) {
    'use strict';
    var $gOPD = require_gOPD();
    if ($gOPD) {
      try {
        $gOPD([], 'length');
      } catch (e) {
        $gOPD = null;
      }
    }
    module2.exports = $gOPD;
  },
});

// node_modules/es-define-property/index.js
var require_es_define_property = __commonJS({
  'node_modules/es-define-property/index.js'(exports2, module2) {
    'use strict';
    var $defineProperty = Object.defineProperty || false;
    if ($defineProperty) {
      try {
        $defineProperty({}, 'a', { value: 1 });
      } catch (e) {
        $defineProperty = false;
      }
    }
    module2.exports = $defineProperty;
  },
});

// node_modules/has-symbols/shams.js
var require_shams = __commonJS({
  'node_modules/has-symbols/shams.js'(exports2, module2) {
    'use strict';
    module2.exports = function hasSymbols() {
      if (
        typeof Symbol !== 'function' ||
        typeof Object.getOwnPropertySymbols !== 'function'
      ) {
        return false;
      }
      if (typeof Symbol.iterator === 'symbol') {
        return true;
      }
      var obj = {};
      var sym = /* @__PURE__ */ Symbol('test');
      var symObj = Object(sym);
      if (typeof sym === 'string') {
        return false;
      }
      if (Object.prototype.toString.call(sym) !== '[object Symbol]') {
        return false;
      }
      if (Object.prototype.toString.call(symObj) !== '[object Symbol]') {
        return false;
      }
      var symVal = 42;
      obj[sym] = symVal;
      for (var _ in obj) {
        return false;
      }
      if (typeof Object.keys === 'function' && Object.keys(obj).length !== 0) {
        return false;
      }
      if (
        typeof Object.getOwnPropertyNames === 'function' &&
        Object.getOwnPropertyNames(obj).length !== 0
      ) {
        return false;
      }
      var syms = Object.getOwnPropertySymbols(obj);
      if (syms.length !== 1 || syms[0] !== sym) {
        return false;
      }
      if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) {
        return false;
      }
      if (typeof Object.getOwnPropertyDescriptor === 'function') {
        var descriptor =
          /** @type {PropertyDescriptor} */
          Object.getOwnPropertyDescriptor(obj, sym);
        if (descriptor.value !== symVal || descriptor.enumerable !== true) {
          return false;
        }
      }
      return true;
    };
  },
});

// node_modules/has-symbols/index.js
var require_has_symbols = __commonJS({
  'node_modules/has-symbols/index.js'(exports2, module2) {
    'use strict';
    var origSymbol = typeof Symbol !== 'undefined' && Symbol;
    var hasSymbolSham = require_shams();
    module2.exports = function hasNativeSymbols() {
      if (typeof origSymbol !== 'function') {
        return false;
      }
      if (typeof Symbol !== 'function') {
        return false;
      }
      if (typeof origSymbol('foo') !== 'symbol') {
        return false;
      }
      if (typeof (/* @__PURE__ */ Symbol('bar')) !== 'symbol') {
        return false;
      }
      return hasSymbolSham();
    };
  },
});

// node_modules/get-proto/Reflect.getPrototypeOf.js
var require_Reflect_getPrototypeOf = __commonJS({
  'node_modules/get-proto/Reflect.getPrototypeOf.js'(exports2, module2) {
    'use strict';
    module2.exports =
      (typeof Reflect !== 'undefined' && Reflect.getPrototypeOf) || null;
  },
});

// node_modules/get-proto/Object.getPrototypeOf.js
var require_Object_getPrototypeOf = __commonJS({
  'node_modules/get-proto/Object.getPrototypeOf.js'(exports2, module2) {
    'use strict';
    var $Object = require_es_object_atoms();
    module2.exports = $Object.getPrototypeOf || null;
  },
});

// node_modules/function-bind/implementation.js
var require_implementation = __commonJS({
  'node_modules/function-bind/implementation.js'(exports2, module2) {
    'use strict';
    var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
    var toStr = Object.prototype.toString;
    var max = Math.max;
    var funcType = '[object Function]';
    var concatty = function concatty2(a, b) {
      var arr = [];
      for (var i = 0; i < a.length; i += 1) {
        arr[i] = a[i];
      }
      for (var j = 0; j < b.length; j += 1) {
        arr[j + a.length] = b[j];
      }
      return arr;
    };
    var slicy = function slicy2(arrLike, offset) {
      var arr = [];
      for (var i = offset || 0, j = 0; i < arrLike.length; i += 1, j += 1) {
        arr[j] = arrLike[i];
      }
      return arr;
    };
    var joiny = function (arr, joiner) {
      var str = '';
      for (var i = 0; i < arr.length; i += 1) {
        str += arr[i];
        if (i + 1 < arr.length) {
          str += joiner;
        }
      }
      return str;
    };
    module2.exports = function bind(that) {
      var target = this;
      if (typeof target !== 'function' || toStr.apply(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
      }
      var args = slicy(arguments, 1);
      var bound;
      var binder = function () {
        if (this instanceof bound) {
          var result = target.apply(this, concatty(args, arguments));
          if (Object(result) === result) {
            return result;
          }
          return this;
        }
        return target.apply(that, concatty(args, arguments));
      };
      var boundLength = max(0, target.length - args.length);
      var boundArgs = [];
      for (var i = 0; i < boundLength; i++) {
        boundArgs[i] = '$' + i;
      }
      bound = Function(
        'binder',
        'return function (' +
          joiny(boundArgs, ',') +
          '){ return binder.apply(this,arguments); }',
      )(binder);
      if (target.prototype) {
        var Empty = function Empty2() {};
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
      }
      return bound;
    };
  },
});

// node_modules/function-bind/index.js
var require_function_bind = __commonJS({
  'node_modules/function-bind/index.js'(exports2, module2) {
    'use strict';
    var implementation = require_implementation();
    module2.exports = Function.prototype.bind || implementation;
  },
});

// node_modules/call-bind-apply-helpers/functionCall.js
var require_functionCall = __commonJS({
  'node_modules/call-bind-apply-helpers/functionCall.js'(exports2, module2) {
    'use strict';
    module2.exports = Function.prototype.call;
  },
});

// node_modules/call-bind-apply-helpers/functionApply.js
var require_functionApply = __commonJS({
  'node_modules/call-bind-apply-helpers/functionApply.js'(exports2, module2) {
    'use strict';
    module2.exports = Function.prototype.apply;
  },
});

// node_modules/call-bind-apply-helpers/reflectApply.js
var require_reflectApply = __commonJS({
  'node_modules/call-bind-apply-helpers/reflectApply.js'(exports2, module2) {
    'use strict';
    module2.exports =
      typeof Reflect !== 'undefined' && Reflect && Reflect.apply;
  },
});

// node_modules/call-bind-apply-helpers/actualApply.js
var require_actualApply = __commonJS({
  'node_modules/call-bind-apply-helpers/actualApply.js'(exports2, module2) {
    'use strict';
    var bind = require_function_bind();
    var $apply = require_functionApply();
    var $call = require_functionCall();
    var $reflectApply = require_reflectApply();
    module2.exports = $reflectApply || bind.call($call, $apply);
  },
});

// node_modules/call-bind-apply-helpers/index.js
var require_call_bind_apply_helpers = __commonJS({
  'node_modules/call-bind-apply-helpers/index.js'(exports2, module2) {
    'use strict';
    var bind = require_function_bind();
    var $TypeError = require_type();
    var $call = require_functionCall();
    var $actualApply = require_actualApply();
    module2.exports = function callBindBasic(args) {
      if (args.length < 1 || typeof args[0] !== 'function') {
        throw new $TypeError('a function is required');
      }
      return $actualApply(bind, $call, args);
    };
  },
});

// node_modules/dunder-proto/get.js
var require_get = __commonJS({
  'node_modules/dunder-proto/get.js'(exports2, module2) {
    'use strict';
    var callBind = require_call_bind_apply_helpers();
    var gOPD = require_gopd();
    var hasProtoAccessor;
    try {
      hasProtoAccessor =
        /** @type {{ __proto__?: typeof Array.prototype }} */
        [].__proto__ === Array.prototype;
    } catch (e) {
      if (
        !e ||
        typeof e !== 'object' ||
        !('code' in e) ||
        e.code !== 'ERR_PROTO_ACCESS'
      ) {
        throw e;
      }
    }
    var desc =
      !!hasProtoAccessor &&
      gOPD &&
      gOPD(
        Object.prototype,
        /** @type {keyof typeof Object.prototype} */
        '__proto__',
      );
    var $Object = Object;
    var $getPrototypeOf = $Object.getPrototypeOf;
    module2.exports =
      desc && typeof desc.get === 'function'
        ? callBind([desc.get])
        : typeof $getPrototypeOf === 'function'
          ? /** @type {import('./get')} */
            function getDunder(value) {
              return $getPrototypeOf(value == null ? value : $Object(value));
            }
          : false;
  },
});

// node_modules/get-proto/index.js
var require_get_proto = __commonJS({
  'node_modules/get-proto/index.js'(exports2, module2) {
    'use strict';
    var reflectGetProto = require_Reflect_getPrototypeOf();
    var originalGetProto = require_Object_getPrototypeOf();
    var getDunderProto = require_get();
    module2.exports = reflectGetProto
      ? function getProto(O) {
          return reflectGetProto(O);
        }
      : originalGetProto
        ? function getProto(O) {
            if (!O || (typeof O !== 'object' && typeof O !== 'function')) {
              throw new TypeError('getProto: not an object');
            }
            return originalGetProto(O);
          }
        : getDunderProto
          ? function getProto(O) {
              return getDunderProto(O);
            }
          : null;
  },
});

// node_modules/hasown/index.js
var require_hasown = __commonJS({
  'node_modules/hasown/index.js'(exports2, module2) {
    'use strict';
    var call = Function.prototype.call;
    var $hasOwn = Object.prototype.hasOwnProperty;
    var bind = require_function_bind();
    module2.exports = bind.call(call, $hasOwn);
  },
});

// node_modules/get-intrinsic/index.js
var require_get_intrinsic = __commonJS({
  'node_modules/get-intrinsic/index.js'(exports2, module2) {
    'use strict';
    var undefined2;
    var $Object = require_es_object_atoms();
    var $Error = require_es_errors();
    var $EvalError = require_eval();
    var $RangeError = require_range();
    var $ReferenceError = require_ref();
    var $SyntaxError = require_syntax();
    var $TypeError = require_type();
    var $URIError = require_uri();
    var abs = require_abs();
    var floor = require_floor();
    var max = require_max();
    var min = require_min();
    var pow = require_pow();
    var round = require_round();
    var sign = require_sign();
    var $Function = Function;
    var getEvalledConstructor = function (expressionSyntax) {
      try {
        return $Function(
          '"use strict"; return (' + expressionSyntax + ').constructor;',
        )();
      } catch (e) {}
    };
    var $gOPD = require_gopd();
    var $defineProperty = require_es_define_property();
    var throwTypeError = function () {
      throw new $TypeError();
    };
    var ThrowTypeError = $gOPD
      ? (function () {
          try {
            arguments.callee;
            return throwTypeError;
          } catch (calleeThrows) {
            try {
              return $gOPD(arguments, 'callee').get;
            } catch (gOPDthrows) {
              return throwTypeError;
            }
          }
        })()
      : throwTypeError;
    var hasSymbols = require_has_symbols()();
    var getProto = require_get_proto();
    var $ObjectGPO = require_Object_getPrototypeOf();
    var $ReflectGPO = require_Reflect_getPrototypeOf();
    var $apply = require_functionApply();
    var $call = require_functionCall();
    var needsEval = {};
    var TypedArray =
      typeof Uint8Array === 'undefined' || !getProto
        ? undefined2
        : getProto(Uint8Array);
    var INTRINSICS = {
      __proto__: null,
      '%AggregateError%':
        typeof AggregateError === 'undefined' ? undefined2 : AggregateError,
      '%Array%': Array,
      '%ArrayBuffer%':
        typeof ArrayBuffer === 'undefined' ? undefined2 : ArrayBuffer,
      '%ArrayIteratorPrototype%':
        hasSymbols && getProto ? getProto([][Symbol.iterator]()) : undefined2,
      '%AsyncFromSyncIteratorPrototype%': undefined2,
      '%AsyncFunction%': needsEval,
      '%AsyncGenerator%': needsEval,
      '%AsyncGeneratorFunction%': needsEval,
      '%AsyncIteratorPrototype%': needsEval,
      '%Atomics%': typeof Atomics === 'undefined' ? undefined2 : Atomics,
      '%BigInt%': typeof BigInt === 'undefined' ? undefined2 : BigInt,
      '%BigInt64Array%':
        typeof BigInt64Array === 'undefined' ? undefined2 : BigInt64Array,
      '%BigUint64Array%':
        typeof BigUint64Array === 'undefined' ? undefined2 : BigUint64Array,
      '%Boolean%': Boolean,
      '%DataView%': typeof DataView === 'undefined' ? undefined2 : DataView,
      '%Date%': Date,
      '%decodeURI%': decodeURI,
      '%decodeURIComponent%': decodeURIComponent,
      '%encodeURI%': encodeURI,
      '%encodeURIComponent%': encodeURIComponent,
      '%Error%': $Error,
      '%eval%': eval,
      // eslint-disable-line no-eval
      '%EvalError%': $EvalError,
      '%Float16Array%':
        typeof Float16Array === 'undefined' ? undefined2 : Float16Array,
      '%Float32Array%':
        typeof Float32Array === 'undefined' ? undefined2 : Float32Array,
      '%Float64Array%':
        typeof Float64Array === 'undefined' ? undefined2 : Float64Array,
      '%FinalizationRegistry%':
        typeof FinalizationRegistry === 'undefined'
          ? undefined2
          : FinalizationRegistry,
      '%Function%': $Function,
      '%GeneratorFunction%': needsEval,
      '%Int8Array%': typeof Int8Array === 'undefined' ? undefined2 : Int8Array,
      '%Int16Array%':
        typeof Int16Array === 'undefined' ? undefined2 : Int16Array,
      '%Int32Array%':
        typeof Int32Array === 'undefined' ? undefined2 : Int32Array,
      '%isFinite%': isFinite,
      '%isNaN%': isNaN,
      '%IteratorPrototype%':
        hasSymbols && getProto
          ? getProto(getProto([][Symbol.iterator]()))
          : undefined2,
      '%JSON%': typeof JSON === 'object' ? JSON : undefined2,
      '%Map%': typeof Map === 'undefined' ? undefined2 : Map,
      '%MapIteratorPrototype%':
        typeof Map === 'undefined' || !hasSymbols || !getProto
          ? undefined2
          : getProto(/* @__PURE__ */ new Map()[Symbol.iterator]()),
      '%Math%': Math,
      '%Number%': Number,
      '%Object%': $Object,
      '%Object.getOwnPropertyDescriptor%': $gOPD,
      '%parseFloat%': parseFloat,
      '%parseInt%': parseInt,
      '%Promise%': typeof Promise === 'undefined' ? undefined2 : Promise,
      '%Proxy%': typeof Proxy === 'undefined' ? undefined2 : Proxy,
      '%RangeError%': $RangeError,
      '%ReferenceError%': $ReferenceError,
      '%Reflect%': typeof Reflect === 'undefined' ? undefined2 : Reflect,
      '%RegExp%': RegExp,
      '%Set%': typeof Set === 'undefined' ? undefined2 : Set,
      '%SetIteratorPrototype%':
        typeof Set === 'undefined' || !hasSymbols || !getProto
          ? undefined2
          : getProto(/* @__PURE__ */ new Set()[Symbol.iterator]()),
      '%SharedArrayBuffer%':
        typeof SharedArrayBuffer === 'undefined'
          ? undefined2
          : SharedArrayBuffer,
      '%String%': String,
      '%StringIteratorPrototype%':
        hasSymbols && getProto ? getProto(''[Symbol.iterator]()) : undefined2,
      '%Symbol%': hasSymbols ? Symbol : undefined2,
      '%SyntaxError%': $SyntaxError,
      '%ThrowTypeError%': ThrowTypeError,
      '%TypedArray%': TypedArray,
      '%TypeError%': $TypeError,
      '%Uint8Array%':
        typeof Uint8Array === 'undefined' ? undefined2 : Uint8Array,
      '%Uint8ClampedArray%':
        typeof Uint8ClampedArray === 'undefined'
          ? undefined2
          : Uint8ClampedArray,
      '%Uint16Array%':
        typeof Uint16Array === 'undefined' ? undefined2 : Uint16Array,
      '%Uint32Array%':
        typeof Uint32Array === 'undefined' ? undefined2 : Uint32Array,
      '%URIError%': $URIError,
      '%WeakMap%': typeof WeakMap === 'undefined' ? undefined2 : WeakMap,
      '%WeakRef%': typeof WeakRef === 'undefined' ? undefined2 : WeakRef,
      '%WeakSet%': typeof WeakSet === 'undefined' ? undefined2 : WeakSet,
      '%Function.prototype.call%': $call,
      '%Function.prototype.apply%': $apply,
      '%Object.defineProperty%': $defineProperty,
      '%Object.getPrototypeOf%': $ObjectGPO,
      '%Math.abs%': abs,
      '%Math.floor%': floor,
      '%Math.max%': max,
      '%Math.min%': min,
      '%Math.pow%': pow,
      '%Math.round%': round,
      '%Math.sign%': sign,
      '%Reflect.getPrototypeOf%': $ReflectGPO,
    };
    if (getProto) {
      try {
        null.error;
      } catch (e) {
        errorProto = getProto(getProto(e));
        INTRINSICS['%Error.prototype%'] = errorProto;
      }
    }
    var errorProto;
    var doEval = function doEval2(name) {
      var value;
      if (name === '%AsyncFunction%') {
        value = getEvalledConstructor('async function () {}');
      } else if (name === '%GeneratorFunction%') {
        value = getEvalledConstructor('function* () {}');
      } else if (name === '%AsyncGeneratorFunction%') {
        value = getEvalledConstructor('async function* () {}');
      } else if (name === '%AsyncGenerator%') {
        var fn = doEval2('%AsyncGeneratorFunction%');
        if (fn) {
          value = fn.prototype;
        }
      } else if (name === '%AsyncIteratorPrototype%') {
        var gen = doEval2('%AsyncGenerator%');
        if (gen && getProto) {
          value = getProto(gen.prototype);
        }
      }
      INTRINSICS[name] = value;
      return value;
    };
    var LEGACY_ALIASES = {
      __proto__: null,
      '%ArrayBufferPrototype%': ['ArrayBuffer', 'prototype'],
      '%ArrayPrototype%': ['Array', 'prototype'],
      '%ArrayProto_entries%': ['Array', 'prototype', 'entries'],
      '%ArrayProto_forEach%': ['Array', 'prototype', 'forEach'],
      '%ArrayProto_keys%': ['Array', 'prototype', 'keys'],
      '%ArrayProto_values%': ['Array', 'prototype', 'values'],
      '%AsyncFunctionPrototype%': ['AsyncFunction', 'prototype'],
      '%AsyncGenerator%': ['AsyncGeneratorFunction', 'prototype'],
      '%AsyncGeneratorPrototype%': [
        'AsyncGeneratorFunction',
        'prototype',
        'prototype',
      ],
      '%BooleanPrototype%': ['Boolean', 'prototype'],
      '%DataViewPrototype%': ['DataView', 'prototype'],
      '%DatePrototype%': ['Date', 'prototype'],
      '%ErrorPrototype%': ['Error', 'prototype'],
      '%EvalErrorPrototype%': ['EvalError', 'prototype'],
      '%Float32ArrayPrototype%': ['Float32Array', 'prototype'],
      '%Float64ArrayPrototype%': ['Float64Array', 'prototype'],
      '%FunctionPrototype%': ['Function', 'prototype'],
      '%Generator%': ['GeneratorFunction', 'prototype'],
      '%GeneratorPrototype%': ['GeneratorFunction', 'prototype', 'prototype'],
      '%Int8ArrayPrototype%': ['Int8Array', 'prototype'],
      '%Int16ArrayPrototype%': ['Int16Array', 'prototype'],
      '%Int32ArrayPrototype%': ['Int32Array', 'prototype'],
      '%JSONParse%': ['JSON', 'parse'],
      '%JSONStringify%': ['JSON', 'stringify'],
      '%MapPrototype%': ['Map', 'prototype'],
      '%NumberPrototype%': ['Number', 'prototype'],
      '%ObjectPrototype%': ['Object', 'prototype'],
      '%ObjProto_toString%': ['Object', 'prototype', 'toString'],
      '%ObjProto_valueOf%': ['Object', 'prototype', 'valueOf'],
      '%PromisePrototype%': ['Promise', 'prototype'],
      '%PromiseProto_then%': ['Promise', 'prototype', 'then'],
      '%Promise_all%': ['Promise', 'all'],
      '%Promise_reject%': ['Promise', 'reject'],
      '%Promise_resolve%': ['Promise', 'resolve'],
      '%RangeErrorPrototype%': ['RangeError', 'prototype'],
      '%ReferenceErrorPrototype%': ['ReferenceError', 'prototype'],
      '%RegExpPrototype%': ['RegExp', 'prototype'],
      '%SetPrototype%': ['Set', 'prototype'],
      '%SharedArrayBufferPrototype%': ['SharedArrayBuffer', 'prototype'],
      '%StringPrototype%': ['String', 'prototype'],
      '%SymbolPrototype%': ['Symbol', 'prototype'],
      '%SyntaxErrorPrototype%': ['SyntaxError', 'prototype'],
      '%TypedArrayPrototype%': ['TypedArray', 'prototype'],
      '%TypeErrorPrototype%': ['TypeError', 'prototype'],
      '%Uint8ArrayPrototype%': ['Uint8Array', 'prototype'],
      '%Uint8ClampedArrayPrototype%': ['Uint8ClampedArray', 'prototype'],
      '%Uint16ArrayPrototype%': ['Uint16Array', 'prototype'],
      '%Uint32ArrayPrototype%': ['Uint32Array', 'prototype'],
      '%URIErrorPrototype%': ['URIError', 'prototype'],
      '%WeakMapPrototype%': ['WeakMap', 'prototype'],
      '%WeakSetPrototype%': ['WeakSet', 'prototype'],
    };
    var bind = require_function_bind();
    var hasOwn = require_hasown();
    var $concat = bind.call($call, Array.prototype.concat);
    var $spliceApply = bind.call($apply, Array.prototype.splice);
    var $replace = bind.call($call, String.prototype.replace);
    var $strSlice = bind.call($call, String.prototype.slice);
    var $exec = bind.call($call, RegExp.prototype.exec);
    var rePropName =
      /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
    var reEscapeChar = /\\(\\)?/g;
    var stringToPath = function stringToPath2(string) {
      var first = $strSlice(string, 0, 1);
      var last = $strSlice(string, -1);
      if (first === '%' && last !== '%') {
        throw new $SyntaxError(
          'invalid intrinsic syntax, expected closing `%`',
        );
      } else if (last === '%' && first !== '%') {
        throw new $SyntaxError(
          'invalid intrinsic syntax, expected opening `%`',
        );
      }
      var result = [];
      $replace(string, rePropName, function (match, number, quote, subString) {
        result[result.length] = quote
          ? $replace(subString, reEscapeChar, '$1')
          : number || match;
      });
      return result;
    };
    var getBaseIntrinsic = function getBaseIntrinsic2(name, allowMissing) {
      var intrinsicName = name;
      var alias;
      if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
        alias = LEGACY_ALIASES[intrinsicName];
        intrinsicName = '%' + alias[0] + '%';
      }
      if (hasOwn(INTRINSICS, intrinsicName)) {
        var value = INTRINSICS[intrinsicName];
        if (value === needsEval) {
          value = doEval(intrinsicName);
        }
        if (typeof value === 'undefined' && !allowMissing) {
          throw new $TypeError(
            'intrinsic ' +
              name +
              ' exists, but is not available. Please file an issue!',
          );
        }
        return {
          alias,
          name: intrinsicName,
          value,
        };
      }
      throw new $SyntaxError('intrinsic ' + name + ' does not exist!');
    };
    module2.exports = function GetIntrinsic(name, allowMissing) {
      if (typeof name !== 'string' || name.length === 0) {
        throw new $TypeError('intrinsic name must be a non-empty string');
      }
      if (arguments.length > 1 && typeof allowMissing !== 'boolean') {
        throw new $TypeError('"allowMissing" argument must be a boolean');
      }
      if ($exec(/^%?[^%]*%?$/, name) === null) {
        throw new $SyntaxError(
          '`%` may not be present anywhere but at the beginning and end of the intrinsic name',
        );
      }
      var parts = stringToPath(name);
      var intrinsicBaseName = parts.length > 0 ? parts[0] : '';
      var intrinsic = getBaseIntrinsic(
        '%' + intrinsicBaseName + '%',
        allowMissing,
      );
      var intrinsicRealName = intrinsic.name;
      var value = intrinsic.value;
      var skipFurtherCaching = false;
      var alias = intrinsic.alias;
      if (alias) {
        intrinsicBaseName = alias[0];
        $spliceApply(parts, $concat([0, 1], alias));
      }
      for (var i = 1, isOwn = true; i < parts.length; i += 1) {
        var part = parts[i];
        var first = $strSlice(part, 0, 1);
        var last = $strSlice(part, -1);
        if (
          (first === '"' ||
            first === "'" ||
            first === '`' ||
            last === '"' ||
            last === "'" ||
            last === '`') &&
          first !== last
        ) {
          throw new $SyntaxError(
            'property names with quotes must have matching quotes',
          );
        }
        if (part === 'constructor' || !isOwn) {
          skipFurtherCaching = true;
        }
        intrinsicBaseName += '.' + part;
        intrinsicRealName = '%' + intrinsicBaseName + '%';
        if (hasOwn(INTRINSICS, intrinsicRealName)) {
          value = INTRINSICS[intrinsicRealName];
        } else if (value != null) {
          if (!(part in value)) {
            if (!allowMissing) {
              throw new $TypeError(
                'base intrinsic for ' +
                  name +
                  ' exists, but the property is not available.',
              );
            }
            return void undefined2;
          }
          if ($gOPD && i + 1 >= parts.length) {
            var desc = $gOPD(value, part);
            isOwn = !!desc;
            if (isOwn && 'get' in desc && !('originalValue' in desc.get)) {
              value = desc.get;
            } else {
              value = value[part];
            }
          } else {
            isOwn = hasOwn(value, part);
            value = value[part];
          }
          if (isOwn && !skipFurtherCaching) {
            INTRINSICS[intrinsicRealName] = value;
          }
        }
      }
      return value;
    };
  },
});

// node_modules/has-tostringtag/shams.js
var require_shams2 = __commonJS({
  'node_modules/has-tostringtag/shams.js'(exports2, module2) {
    'use strict';
    var hasSymbols = require_shams();
    module2.exports = function hasToStringTagShams() {
      return hasSymbols() && !!Symbol.toStringTag;
    };
  },
});

// node_modules/es-set-tostringtag/index.js
var require_es_set_tostringtag = __commonJS({
  'node_modules/es-set-tostringtag/index.js'(exports2, module2) {
    'use strict';
    var GetIntrinsic = require_get_intrinsic();
    var $defineProperty = GetIntrinsic('%Object.defineProperty%', true);
    var hasToStringTag = require_shams2()();
    var hasOwn = require_hasown();
    var $TypeError = require_type();
    var toStringTag = hasToStringTag ? Symbol.toStringTag : null;
    module2.exports = function setToStringTag(object, value) {
      var overrideIfSet =
        arguments.length > 2 && !!arguments[2] && arguments[2].force;
      var nonConfigurable =
        arguments.length > 2 && !!arguments[2] && arguments[2].nonConfigurable;
      if (
        (typeof overrideIfSet !== 'undefined' &&
          typeof overrideIfSet !== 'boolean') ||
        (typeof nonConfigurable !== 'undefined' &&
          typeof nonConfigurable !== 'boolean')
      ) {
        throw new $TypeError(
          'if provided, the `overrideIfSet` and `nonConfigurable` options must be booleans',
        );
      }
      if (toStringTag && (overrideIfSet || !hasOwn(object, toStringTag))) {
        if ($defineProperty) {
          $defineProperty(object, toStringTag, {
            configurable: !nonConfigurable,
            enumerable: false,
            value,
            writable: false,
          });
        } else {
          object[toStringTag] = value;
        }
      }
    };
  },
});

// node_modules/form-data/lib/populate.js
var require_populate = __commonJS({
  'node_modules/form-data/lib/populate.js'(exports2, module2) {
    'use strict';
    module2.exports = function (dst, src) {
      Object.keys(src).forEach(function (prop) {
        dst[prop] = dst[prop] || src[prop];
      });
      return dst;
    };
  },
});

// node_modules/form-data/lib/form_data.js
var require_form_data = __commonJS({
  'node_modules/form-data/lib/form_data.js'(exports2, module2) {
    'use strict';
    var CombinedStream = require_combined_stream();
    var util2 = require('util');
    var path = require('path');
    var http3 = require('http');
    var https2 = require('https');
    var parseUrl = require('url').parse;
    var fs2 = require('fs');
    var Stream = require('stream').Stream;
    var crypto = require('crypto');
    var mime = require_mime_types();
    var asynckit = require_asynckit();
    var setToStringTag = require_es_set_tostringtag();
    var hasOwn = require_hasown();
    var populate = require_populate();
    function escapeHeaderParam(str) {
      return String(str)
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/"/g, '%22');
    }
    function FormData2(options) {
      if (!(this instanceof FormData2)) {
        return new FormData2(options);
      }
      this._overheadLength = 0;
      this._valueLength = 0;
      this._valuesToMeasure = [];
      CombinedStream.call(this);
      options = options || {};
      for (var option in options) {
        this[option] = options[option];
      }
    }
    util2.inherits(FormData2, CombinedStream);
    FormData2.LINE_BREAK = '\r\n';
    FormData2.DEFAULT_CONTENT_TYPE = 'application/octet-stream';
    FormData2.prototype.append = function (field, value, options) {
      options = options || {};
      if (typeof options === 'string') {
        options = { filename: options };
      }
      var append = CombinedStream.prototype.append.bind(this);
      if (typeof value === 'number' || value == null) {
        value = String(value);
      }
      if (Array.isArray(value)) {
        this._error(new Error('Arrays are not supported.'));
        return;
      }
      var header = this._multiPartHeader(field, value, options);
      var footer = this._multiPartFooter();
      append(header);
      append(value);
      append(footer);
      this._trackLength(header, value, options);
    };
    FormData2.prototype._trackLength = function (header, value, options) {
      var valueLength = 0;
      if (options.knownLength != null) {
        valueLength += Number(options.knownLength);
      } else if (Buffer.isBuffer(value)) {
        valueLength = value.length;
      } else if (typeof value === 'string') {
        valueLength = Buffer.byteLength(value);
      }
      this._valueLength += valueLength;
      this._overheadLength +=
        Buffer.byteLength(header) + FormData2.LINE_BREAK.length;
      if (
        !value ||
        (!value.path &&
          !(value.readable && hasOwn(value, 'httpVersion')) &&
          !(value instanceof Stream))
      ) {
        return;
      }
      if (!options.knownLength) {
        this._valuesToMeasure.push(value);
      }
    };
    FormData2.prototype._lengthRetriever = function (value, callback) {
      if (hasOwn(value, 'fd')) {
        if (
          value.end != void 0 &&
          value.end != Infinity &&
          value.start != void 0
        ) {
          callback(null, value.end + 1 - (value.start ? value.start : 0));
        } else {
          fs2.stat(value.path, function (err, stat) {
            if (err) {
              callback(err);
              return;
            }
            var fileSize = stat.size - (value.start ? value.start : 0);
            callback(null, fileSize);
          });
        }
      } else if (hasOwn(value, 'httpVersion')) {
        callback(null, Number(value.headers['content-length']));
      } else if (hasOwn(value, 'httpModule')) {
        value.on('response', function (response) {
          value.pause();
          callback(null, Number(response.headers['content-length']));
        });
        value.resume();
      } else {
        callback('Unknown stream');
      }
    };
    FormData2.prototype._multiPartHeader = function (field, value, options) {
      if (typeof options.header === 'string') {
        return options.header;
      }
      var contentDisposition = this._getContentDisposition(value, options);
      var contentType = this._getContentType(value, options);
      var contents = '';
      var headers = {
        // add custom disposition as third element or keep it two elements if not
        'Content-Disposition': [
          'form-data',
          'name="' + escapeHeaderParam(field) + '"',
        ].concat(contentDisposition || []),
        // if no content type. allow it to be empty array
        'Content-Type': [].concat(contentType || []),
      };
      if (typeof options.header === 'object') {
        populate(headers, options.header);
      }
      var header;
      for (var prop in headers) {
        if (hasOwn(headers, prop)) {
          header = headers[prop];
          if (header == null) {
            continue;
          }
          if (!Array.isArray(header)) {
            header = [header];
          }
          if (header.length) {
            contents += prop + ': ' + header.join('; ') + FormData2.LINE_BREAK;
          }
        }
      }
      return (
        '--' +
        this.getBoundary() +
        FormData2.LINE_BREAK +
        contents +
        FormData2.LINE_BREAK
      );
    };
    FormData2.prototype._getContentDisposition = function (value, options) {
      var filename;
      if (typeof options.filepath === 'string') {
        filename = path.normalize(options.filepath).replace(/\\/g, '/');
      } else if (options.filename || (value && (value.name || value.path))) {
        filename = path.basename(
          options.filename || (value && (value.name || value.path)),
        );
      } else if (value && value.readable && hasOwn(value, 'httpVersion')) {
        filename = path.basename(value.client._httpMessage.path || '');
      }
      if (filename) {
        return 'filename="' + escapeHeaderParam(filename) + '"';
      }
    };
    FormData2.prototype._getContentType = function (value, options) {
      var contentType = options.contentType;
      if (!contentType && value && value.name) {
        contentType = mime.lookup(value.name);
      }
      if (!contentType && value && value.path) {
        contentType = mime.lookup(value.path);
      }
      if (
        !contentType &&
        value &&
        value.readable &&
        hasOwn(value, 'httpVersion')
      ) {
        contentType = value.headers['content-type'];
      }
      if (!contentType && (options.filepath || options.filename)) {
        contentType = mime.lookup(options.filepath || options.filename);
      }
      if (!contentType && value && typeof value === 'object') {
        contentType = FormData2.DEFAULT_CONTENT_TYPE;
      }
      return contentType;
    };
    FormData2.prototype._multiPartFooter = function () {
      return function (next) {
        var footer = FormData2.LINE_BREAK;
        var lastPart = this._streams.length === 0;
        if (lastPart) {
          footer += this._lastBoundary();
        }
        next(footer);
      }.bind(this);
    };
    FormData2.prototype._lastBoundary = function () {
      return '--' + this.getBoundary() + '--' + FormData2.LINE_BREAK;
    };
    FormData2.prototype.getHeaders = function (userHeaders) {
      var header;
      var formHeaders = {
        'content-type': 'multipart/form-data; boundary=' + this.getBoundary(),
      };
      for (header in userHeaders) {
        if (hasOwn(userHeaders, header)) {
          formHeaders[header.toLowerCase()] = userHeaders[header];
        }
      }
      return formHeaders;
    };
    FormData2.prototype.setBoundary = function (boundary) {
      if (typeof boundary !== 'string') {
        throw new TypeError('FormData boundary must be a string');
      }
      this._boundary = boundary;
    };
    FormData2.prototype.getBoundary = function () {
      if (!this._boundary) {
        this._generateBoundary();
      }
      return this._boundary;
    };
    FormData2.prototype.getBuffer = function () {
      var dataBuffer = new Buffer.alloc(0);
      var boundary = this.getBoundary();
      for (var i = 0, len = this._streams.length; i < len; i++) {
        if (typeof this._streams[i] !== 'function') {
          if (Buffer.isBuffer(this._streams[i])) {
            dataBuffer = Buffer.concat([dataBuffer, this._streams[i]]);
          } else {
            dataBuffer = Buffer.concat([
              dataBuffer,
              Buffer.from(this._streams[i]),
            ]);
          }
          if (
            typeof this._streams[i] !== 'string' ||
            this._streams[i].substring(2, boundary.length + 2) !== boundary
          ) {
            dataBuffer = Buffer.concat([
              dataBuffer,
              Buffer.from(FormData2.LINE_BREAK),
            ]);
          }
        }
      }
      return Buffer.concat([dataBuffer, Buffer.from(this._lastBoundary())]);
    };
    FormData2.prototype._generateBoundary = function () {
      this._boundary =
        '--------------------------' + crypto.randomBytes(12).toString('hex');
    };
    FormData2.prototype.getLengthSync = function () {
      var knownLength = this._overheadLength + this._valueLength;
      if (this._streams.length) {
        knownLength += this._lastBoundary().length;
      }
      if (!this.hasKnownLength()) {
        this._error(
          new Error('Cannot calculate proper length in synchronous way.'),
        );
      }
      return knownLength;
    };
    FormData2.prototype.hasKnownLength = function () {
      var hasKnownLength = true;
      if (this._valuesToMeasure.length) {
        hasKnownLength = false;
      }
      return hasKnownLength;
    };
    FormData2.prototype.getLength = function (cb) {
      var knownLength = this._overheadLength + this._valueLength;
      if (this._streams.length) {
        knownLength += this._lastBoundary().length;
      }
      if (!this._valuesToMeasure.length) {
        process.nextTick(cb.bind(this, null, knownLength));
        return;
      }
      asynckit.parallel(
        this._valuesToMeasure,
        this._lengthRetriever,
        function (err, values) {
          if (err) {
            cb(err);
            return;
          }
          values.forEach(function (length) {
            knownLength += length;
          });
          cb(null, knownLength);
        },
      );
    };
    FormData2.prototype.submit = function (params, cb) {
      var request;
      var options;
      var defaults = { method: 'post' };
      if (typeof params === 'string') {
        params = parseUrl(params);
        options = populate(
          {
            port: params.port,
            path: params.pathname,
            host: params.hostname,
            protocol: params.protocol,
          },
          defaults,
        );
      } else {
        options = populate(params, defaults);
        if (!options.port) {
          options.port = options.protocol === 'https:' ? 443 : 80;
        }
      }
      options.headers = this.getHeaders(params.headers);
      if (options.protocol === 'https:') {
        request = https2.request(options);
      } else {
        request = http3.request(options);
      }
      this.getLength(
        function (err, length) {
          if (err && err !== 'Unknown stream') {
            this._error(err);
            return;
          }
          if (length) {
            request.setHeader('Content-Length', length);
          }
          this.pipe(request);
          if (cb) {
            var onResponse;
            var callback = function (error, responce) {
              request.removeListener('error', callback);
              request.removeListener('response', onResponse);
              return cb.call(this, error, responce);
            };
            onResponse = callback.bind(this, null);
            request.on('error', callback);
            request.on('response', onResponse);
          }
        }.bind(this),
      );
      return request;
    };
    FormData2.prototype._error = function (err) {
      if (!this.error) {
        this.error = err;
        this.pause();
        this.emit('error', err);
      }
    };
    FormData2.prototype.toString = function () {
      return '[object FormData]';
    };
    setToStringTag(FormData2.prototype, 'FormData');
    module2.exports = FormData2;
  },
});

// node_modules/axios/lib/defaults/env/FormData.js
var require_FormData = __commonJS({
  'node_modules/axios/lib/defaults/env/FormData.js'(exports2, module2) {
    module2.exports = require_form_data();
  },
});

// node_modules/axios/lib/defaults/index.js
var require_defaults = __commonJS({
  'node_modules/axios/lib/defaults/index.js'(exports2, module2) {
    'use strict';
    var utils = require_utils3();
    var normalizeHeaderName = require_normalizeHeaderName();
    var AxiosError = require_AxiosError();
    var transitionalDefaults = require_transitional();
    var toFormData = require_toFormData();
    var DEFAULT_CONTENT_TYPE = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    function setContentTypeIfUnset(headers, value) {
      if (
        !utils.isUndefined(headers) &&
        utils.isUndefined(headers['Content-Type'])
      ) {
        headers['Content-Type'] = value;
      }
    }
    function getDefaultAdapter() {
      var adapter;
      if (typeof XMLHttpRequest !== 'undefined') {
        adapter = require_xhr();
      } else if (
        typeof process !== 'undefined' &&
        Object.prototype.toString.call(process) === '[object process]'
      ) {
        adapter = require_http();
      }
      return adapter;
    }
    function stringifySafely(rawValue, parser, encoder) {
      if (utils.isString(rawValue)) {
        try {
          (parser || JSON.parse)(rawValue);
          return utils.trim(rawValue);
        } catch (e) {
          if (e.name !== 'SyntaxError') {
            throw e;
          }
        }
      }
      return (encoder || JSON.stringify)(rawValue);
    }
    var defaults = {
      transitional: transitionalDefaults,
      adapter: getDefaultAdapter(),
      transformRequest: [
        function transformRequest(data, headers) {
          normalizeHeaderName(headers, 'Accept');
          normalizeHeaderName(headers, 'Content-Type');
          if (
            utils.isFormData(data) ||
            utils.isArrayBuffer(data) ||
            utils.isBuffer(data) ||
            utils.isStream(data) ||
            utils.isFile(data) ||
            utils.isBlob(data)
          ) {
            return data;
          }
          if (utils.isArrayBufferView(data)) {
            return data.buffer;
          }
          if (utils.isURLSearchParams(data)) {
            setContentTypeIfUnset(
              headers,
              'application/x-www-form-urlencoded;charset=utf-8',
            );
            return data.toString();
          }
          var isObjectPayload = utils.isObject(data);
          var contentType = headers && headers['Content-Type'];
          var isFileList;
          if (
            (isFileList = utils.isFileList(data)) ||
            (isObjectPayload && contentType === 'multipart/form-data')
          ) {
            var _FormData = this.env && this.env.FormData;
            return toFormData(
              isFileList ? { 'files[]': data } : data,
              _FormData && new _FormData(),
            );
          } else if (isObjectPayload || contentType === 'application/json') {
            setContentTypeIfUnset(headers, 'application/json');
            return stringifySafely(data);
          }
          return data;
        },
      ],
      transformResponse: [
        function transformResponse(data) {
          var transitional = this.transitional || defaults.transitional;
          var silentJSONParsing =
            transitional && transitional.silentJSONParsing;
          var forcedJSONParsing =
            transitional && transitional.forcedJSONParsing;
          var strictJSONParsing =
            !silentJSONParsing && this.responseType === 'json';
          if (
            strictJSONParsing ||
            (forcedJSONParsing && utils.isString(data) && data.length)
          ) {
            try {
              return JSON.parse(data);
            } catch (e) {
              if (strictJSONParsing) {
                if (e.name === 'SyntaxError') {
                  throw AxiosError.from(
                    e,
                    AxiosError.ERR_BAD_RESPONSE,
                    this,
                    null,
                    this.response,
                  );
                }
                throw e;
              }
            }
          }
          return data;
        },
      ],
      /**
       * A timeout in milliseconds to abort a request. If set to 0 (default) a
       * timeout is not created.
       */
      timeout: 0,
      xsrfCookieName: 'XSRF-TOKEN',
      xsrfHeaderName: 'X-XSRF-TOKEN',
      maxContentLength: -1,
      maxBodyLength: -1,
      env: {
        FormData: require_FormData(),
      },
      validateStatus: function validateStatus(status) {
        return status >= 200 && status < 300;
      },
      headers: {
        common: {
          Accept: 'application/json, text/plain, */*',
        },
      },
    };
    utils.forEach(
      ['delete', 'get', 'head'],
      function forEachMethodNoData(method) {
        defaults.headers[method] = {};
      },
    );
    utils.forEach(
      ['post', 'put', 'patch'],
      function forEachMethodWithData(method) {
        defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
      },
    );
    module2.exports = defaults;
  },
});

// node_modules/axios/lib/core/transformData.js
var require_transformData = __commonJS({
  'node_modules/axios/lib/core/transformData.js'(exports2, module2) {
    'use strict';
    var utils = require_utils3();
    var defaults = require_defaults();
    module2.exports = function transformData(data, headers, fns) {
      var context = this || defaults;
      utils.forEach(fns, function transform(fn) {
        data = fn.call(context, data, headers);
      });
      return data;
    };
  },
});

// node_modules/axios/lib/cancel/isCancel.js
var require_isCancel = __commonJS({
  'node_modules/axios/lib/cancel/isCancel.js'(exports2, module2) {
    'use strict';
    module2.exports = function isCancel(value) {
      return !!(value && value.__CANCEL__);
    };
  },
});

// node_modules/axios/lib/core/dispatchRequest.js
var require_dispatchRequest = __commonJS({
  'node_modules/axios/lib/core/dispatchRequest.js'(exports2, module2) {
    'use strict';
    var utils = require_utils3();
    var transformData = require_transformData();
    var isCancel = require_isCancel();
    var defaults = require_defaults();
    var CanceledError = require_CanceledError();
    function throwIfCancellationRequested(config) {
      if (config.cancelToken) {
        config.cancelToken.throwIfRequested();
      }
      if (config.signal && config.signal.aborted) {
        throw new CanceledError();
      }
    }
    module2.exports = function dispatchRequest(config) {
      throwIfCancellationRequested(config);
      config.headers = config.headers || {};
      config.data = transformData.call(
        config,
        config.data,
        config.headers,
        config.transformRequest,
      );
      config.headers = utils.merge(
        config.headers.common || {},
        config.headers[config.method] || {},
        config.headers,
      );
      utils.forEach(
        ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
        function cleanHeaderConfig(method) {
          delete config.headers[method];
        },
      );
      var adapter = config.adapter || defaults.adapter;
      return adapter(config).then(
        function onAdapterResolution(response) {
          throwIfCancellationRequested(config);
          response.data = transformData.call(
            config,
            response.data,
            response.headers,
            config.transformResponse,
          );
          return response;
        },
        function onAdapterRejection(reason) {
          if (!isCancel(reason)) {
            throwIfCancellationRequested(config);
            if (reason && reason.response) {
              reason.response.data = transformData.call(
                config,
                reason.response.data,
                reason.response.headers,
                config.transformResponse,
              );
            }
          }
          return Promise.reject(reason);
        },
      );
    };
  },
});

// node_modules/axios/lib/core/mergeConfig.js
var require_mergeConfig = __commonJS({
  'node_modules/axios/lib/core/mergeConfig.js'(exports2, module2) {
    'use strict';
    var utils = require_utils3();
    module2.exports = function mergeConfig(config1, config2) {
      config2 = config2 || {};
      var config = {};
      function getMergedValue(target, source) {
        if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
          return utils.merge(target, source);
        } else if (utils.isPlainObject(source)) {
          return utils.merge({}, source);
        } else if (utils.isArray(source)) {
          return source.slice();
        }
        return source;
      }
      function mergeDeepProperties(prop) {
        if (!utils.isUndefined(config2[prop])) {
          return getMergedValue(config1[prop], config2[prop]);
        } else if (!utils.isUndefined(config1[prop])) {
          return getMergedValue(void 0, config1[prop]);
        }
      }
      function valueFromConfig2(prop) {
        if (!utils.isUndefined(config2[prop])) {
          return getMergedValue(void 0, config2[prop]);
        }
      }
      function defaultToConfig2(prop) {
        if (!utils.isUndefined(config2[prop])) {
          return getMergedValue(void 0, config2[prop]);
        } else if (!utils.isUndefined(config1[prop])) {
          return getMergedValue(void 0, config1[prop]);
        }
      }
      function mergeDirectKeys(prop) {
        if (prop in config2) {
          return getMergedValue(config1[prop], config2[prop]);
        } else if (prop in config1) {
          return getMergedValue(void 0, config1[prop]);
        }
      }
      var mergeMap = {
        url: valueFromConfig2,
        method: valueFromConfig2,
        data: valueFromConfig2,
        baseURL: defaultToConfig2,
        transformRequest: defaultToConfig2,
        transformResponse: defaultToConfig2,
        paramsSerializer: defaultToConfig2,
        timeout: defaultToConfig2,
        timeoutMessage: defaultToConfig2,
        withCredentials: defaultToConfig2,
        adapter: defaultToConfig2,
        responseType: defaultToConfig2,
        xsrfCookieName: defaultToConfig2,
        xsrfHeaderName: defaultToConfig2,
        onUploadProgress: defaultToConfig2,
        onDownloadProgress: defaultToConfig2,
        decompress: defaultToConfig2,
        maxContentLength: defaultToConfig2,
        maxBodyLength: defaultToConfig2,
        beforeRedirect: defaultToConfig2,
        transport: defaultToConfig2,
        httpAgent: defaultToConfig2,
        httpsAgent: defaultToConfig2,
        cancelToken: defaultToConfig2,
        socketPath: defaultToConfig2,
        responseEncoding: defaultToConfig2,
        validateStatus: mergeDirectKeys,
      };
      utils.forEach(
        Object.keys(config1).concat(Object.keys(config2)),
        function computeConfigValue(prop) {
          var merge = mergeMap[prop] || mergeDeepProperties;
          var configValue = merge(prop);
          (utils.isUndefined(configValue) && merge !== mergeDirectKeys) ||
            (config[prop] = configValue);
        },
      );
      return config;
    };
  },
});

// node_modules/axios/lib/helpers/validator.js
var require_validator = __commonJS({
  'node_modules/axios/lib/helpers/validator.js'(exports2, module2) {
    'use strict';
    var VERSION = require_data().version;
    var AxiosError = require_AxiosError();
    var validators = {};
    ['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach(
      function (type, i) {
        validators[type] = function validator(thing) {
          return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
        };
      },
    );
    var deprecatedWarnings = {};
    validators.transitional = function transitional(
      validator,
      version,
      message,
    ) {
      function formatMessage(opt, desc) {
        return (
          '[Axios v' +
          VERSION +
          "] Transitional option '" +
          opt +
          "'" +
          desc +
          (message ? '. ' + message : '')
        );
      }
      return function (value, opt, opts) {
        if (validator === false) {
          throw new AxiosError(
            formatMessage(
              opt,
              ' has been removed' + (version ? ' in ' + version : ''),
            ),
            AxiosError.ERR_DEPRECATED,
          );
        }
        if (version && !deprecatedWarnings[opt]) {
          deprecatedWarnings[opt] = true;
          console.warn(
            formatMessage(
              opt,
              ' has been deprecated since v' +
                version +
                ' and will be removed in the near future',
            ),
          );
        }
        return validator ? validator(value, opt, opts) : true;
      };
    };
    function assertOptions(options, schema, allowUnknown) {
      if (typeof options !== 'object') {
        throw new AxiosError(
          'options must be an object',
          AxiosError.ERR_BAD_OPTION_VALUE,
        );
      }
      var keys = Object.keys(options);
      var i = keys.length;
      while (i-- > 0) {
        var opt = keys[i];
        var validator = schema[opt];
        if (validator) {
          var value = options[opt];
          var result = value === void 0 || validator(value, opt, options);
          if (result !== true) {
            throw new AxiosError(
              'option ' + opt + ' must be ' + result,
              AxiosError.ERR_BAD_OPTION_VALUE,
            );
          }
          continue;
        }
        if (allowUnknown !== true) {
          throw new AxiosError(
            'Unknown option ' + opt,
            AxiosError.ERR_BAD_OPTION,
          );
        }
      }
    }
    module2.exports = {
      assertOptions,
      validators,
    };
  },
});

// node_modules/axios/lib/core/Axios.js
var require_Axios = __commonJS({
  'node_modules/axios/lib/core/Axios.js'(exports2, module2) {
    'use strict';
    var utils = require_utils3();
    var buildURL = require_buildURL();
    var InterceptorManager = require_InterceptorManager();
    var dispatchRequest = require_dispatchRequest();
    var mergeConfig = require_mergeConfig();
    var buildFullPath = require_buildFullPath();
    var validator = require_validator();
    var validators = validator.validators;
    function Axios(instanceConfig) {
      this.defaults = instanceConfig;
      this.interceptors = {
        request: new InterceptorManager(),
        response: new InterceptorManager(),
      };
    }
    Axios.prototype.request = function request(configOrUrl, config) {
      if (typeof configOrUrl === 'string') {
        config = config || {};
        config.url = configOrUrl;
      } else {
        config = configOrUrl || {};
      }
      config = mergeConfig(this.defaults, config);
      if (config.method) {
        config.method = config.method.toLowerCase();
      } else if (this.defaults.method) {
        config.method = this.defaults.method.toLowerCase();
      } else {
        config.method = 'get';
      }
      var transitional = config.transitional;
      if (transitional !== void 0) {
        validator.assertOptions(
          transitional,
          {
            silentJSONParsing: validators.transitional(validators.boolean),
            forcedJSONParsing: validators.transitional(validators.boolean),
            clarifyTimeoutError: validators.transitional(validators.boolean),
          },
          false,
        );
      }
      var requestInterceptorChain = [];
      var synchronousRequestInterceptors = true;
      this.interceptors.request.forEach(
        function unshiftRequestInterceptors(interceptor) {
          if (
            typeof interceptor.runWhen === 'function' &&
            interceptor.runWhen(config) === false
          ) {
            return;
          }
          synchronousRequestInterceptors =
            synchronousRequestInterceptors && interceptor.synchronous;
          requestInterceptorChain.unshift(
            interceptor.fulfilled,
            interceptor.rejected,
          );
        },
      );
      var responseInterceptorChain = [];
      this.interceptors.response.forEach(
        function pushResponseInterceptors(interceptor) {
          responseInterceptorChain.push(
            interceptor.fulfilled,
            interceptor.rejected,
          );
        },
      );
      var promise;
      if (!synchronousRequestInterceptors) {
        var chain = [dispatchRequest, void 0];
        Array.prototype.unshift.apply(chain, requestInterceptorChain);
        chain = chain.concat(responseInterceptorChain);
        promise = Promise.resolve(config);
        while (chain.length) {
          promise = promise.then(chain.shift(), chain.shift());
        }
        return promise;
      }
      var newConfig = config;
      while (requestInterceptorChain.length) {
        var onFulfilled = requestInterceptorChain.shift();
        var onRejected = requestInterceptorChain.shift();
        try {
          newConfig = onFulfilled(newConfig);
        } catch (error) {
          onRejected(error);
          break;
        }
      }
      try {
        promise = dispatchRequest(newConfig);
      } catch (error) {
        return Promise.reject(error);
      }
      while (responseInterceptorChain.length) {
        promise = promise.then(
          responseInterceptorChain.shift(),
          responseInterceptorChain.shift(),
        );
      }
      return promise;
    };
    Axios.prototype.getUri = function getUri(config) {
      config = mergeConfig(this.defaults, config);
      var fullPath = buildFullPath(config.baseURL, config.url);
      return buildURL(fullPath, config.params, config.paramsSerializer);
    };
    utils.forEach(
      ['delete', 'get', 'head', 'options'],
      function forEachMethodNoData(method) {
        Axios.prototype[method] = function (url, config) {
          return this.request(
            mergeConfig(config || {}, {
              method,
              url,
              data: (config || {}).data,
            }),
          );
        };
      },
    );
    utils.forEach(
      ['post', 'put', 'patch'],
      function forEachMethodWithData(method) {
        function generateHTTPMethod(isForm) {
          return function httpMethod(url, data, config) {
            return this.request(
              mergeConfig(config || {}, {
                method,
                headers: isForm
                  ? {
                      'Content-Type': 'multipart/form-data',
                    }
                  : {},
                url,
                data,
              }),
            );
          };
        }
        Axios.prototype[method] = generateHTTPMethod();
        Axios.prototype[method + 'Form'] = generateHTTPMethod(true);
      },
    );
    module2.exports = Axios;
  },
});

// node_modules/axios/lib/cancel/CancelToken.js
var require_CancelToken = __commonJS({
  'node_modules/axios/lib/cancel/CancelToken.js'(exports2, module2) {
    'use strict';
    var CanceledError = require_CanceledError();
    function CancelToken(executor) {
      if (typeof executor !== 'function') {
        throw new TypeError('executor must be a function.');
      }
      var resolvePromise;
      this.promise = new Promise(function promiseExecutor(resolve) {
        resolvePromise = resolve;
      });
      var token = this;
      this.promise.then(function (cancel) {
        if (!token._listeners) return;
        var i;
        var l = token._listeners.length;
        for (i = 0; i < l; i++) {
          token._listeners[i](cancel);
        }
        token._listeners = null;
      });
      this.promise.then = function (onfulfilled) {
        var _resolve;
        var promise = new Promise(function (resolve) {
          token.subscribe(resolve);
          _resolve = resolve;
        }).then(onfulfilled);
        promise.cancel = function reject() {
          token.unsubscribe(_resolve);
        };
        return promise;
      };
      executor(function cancel(message) {
        if (token.reason) {
          return;
        }
        token.reason = new CanceledError(message);
        resolvePromise(token.reason);
      });
    }
    CancelToken.prototype.throwIfRequested = function throwIfRequested() {
      if (this.reason) {
        throw this.reason;
      }
    };
    CancelToken.prototype.subscribe = function subscribe(listener) {
      if (this.reason) {
        listener(this.reason);
        return;
      }
      if (this._listeners) {
        this._listeners.push(listener);
      } else {
        this._listeners = [listener];
      }
    };
    CancelToken.prototype.unsubscribe = function unsubscribe(listener) {
      if (!this._listeners) {
        return;
      }
      var index = this._listeners.indexOf(listener);
      if (index !== -1) {
        this._listeners.splice(index, 1);
      }
    };
    CancelToken.source = function source() {
      var cancel;
      var token = new CancelToken(function executor(c) {
        cancel = c;
      });
      return {
        token,
        cancel,
      };
    };
    module2.exports = CancelToken;
  },
});

// node_modules/axios/lib/helpers/spread.js
var require_spread = __commonJS({
  'node_modules/axios/lib/helpers/spread.js'(exports2, module2) {
    'use strict';
    module2.exports = function spread(callback) {
      return function wrap(arr) {
        return callback.apply(null, arr);
      };
    };
  },
});

// node_modules/axios/lib/helpers/isAxiosError.js
var require_isAxiosError = __commonJS({
  'node_modules/axios/lib/helpers/isAxiosError.js'(exports2, module2) {
    'use strict';
    var utils = require_utils3();
    module2.exports = function isAxiosError(payload) {
      return utils.isObject(payload) && payload.isAxiosError === true;
    };
  },
});

// node_modules/axios/lib/axios.js
var require_axios = __commonJS({
  'node_modules/axios/lib/axios.js'(exports2, module2) {
    'use strict';
    var utils = require_utils3();
    var bind = require_bind();
    var Axios = require_Axios();
    var mergeConfig = require_mergeConfig();
    var defaults = require_defaults();
    function createInstance(defaultConfig) {
      var context = new Axios(defaultConfig);
      var instance = bind(Axios.prototype.request, context);
      utils.extend(instance, Axios.prototype, context);
      utils.extend(instance, context);
      instance.create = function create(instanceConfig) {
        return createInstance(mergeConfig(defaultConfig, instanceConfig));
      };
      return instance;
    }
    var axios = createInstance(defaults);
    axios.Axios = Axios;
    axios.CanceledError = require_CanceledError();
    axios.CancelToken = require_CancelToken();
    axios.isCancel = require_isCancel();
    axios.VERSION = require_data().version;
    axios.toFormData = require_toFormData();
    axios.AxiosError = require_AxiosError();
    axios.Cancel = axios.CanceledError;
    axios.all = function all(promises2) {
      return Promise.all(promises2);
    };
    axios.spread = require_spread();
    axios.isAxiosError = require_isAxiosError();
    module2.exports = axios;
    module2.exports.default = axios;
  },
});

// node_modules/axios/index.js
var require_axios2 = __commonJS({
  'node_modules/axios/index.js'(exports2, module2) {
    module2.exports = require_axios();
  },
});

// node_modules/http-cookie-agent/dist/utils/create_cookie_header_value.js
var require_create_cookie_header_value = __commonJS({
  'node_modules/http-cookie-agent/dist/utils/create_cookie_header_value.js'(
    exports2,
  ) {
    'use strict';
    Object.defineProperty(exports2, '__esModule', {
      value: true,
    });
    exports2.createCookieHeaderValue = createCookieHeaderValue;
    var _toughCookie = require_cookie2();
    function createCookieHeaderValue({
      cookieOptions,
      passedValues,
      requestUrl,
    }) {
      const { jar } = cookieOptions;
      const cookies = jar.getCookiesSync(requestUrl);
      const cookiesMap = new Map(cookies.map(cookie => [cookie.key, cookie]));
      for (const passedValue of passedValues) {
        if (typeof passedValue !== 'string') {
          continue;
        }
        for (const str of passedValue.split(';')) {
          const cookie = _toughCookie.Cookie.parse(str.trim());
          if (cookie != null) {
            cookiesMap.set(cookie.key, cookie);
          }
        }
      }
      const cookieHeaderValue = Array.from(cookiesMap.values())
        .map(cookie => cookie.cookieString())
        .join('; ');
      return cookieHeaderValue;
    }
  },
});

// node_modules/http-cookie-agent/dist/utils/save_cookies_from_header.js
var require_save_cookies_from_header = __commonJS({
  'node_modules/http-cookie-agent/dist/utils/save_cookies_from_header.js'(
    exports2,
  ) {
    'use strict';
    Object.defineProperty(exports2, '__esModule', {
      value: true,
    });
    exports2.saveCookiesFromHeader = saveCookiesFromHeader;
    function saveCookiesFromHeader({ cookieOptions, cookies, requestUrl }) {
      const { jar } = cookieOptions;
      for (const cookie of [cookies].flat()) {
        if (cookie == null) {
          continue;
        }
        jar.setCookieSync(String(cookie), requestUrl, {
          ignoreError: true,
        });
      }
    }
  },
});

// node_modules/http-cookie-agent/dist/utils/validate_cookie_options.js
var require_validate_cookie_options = __commonJS({
  'node_modules/http-cookie-agent/dist/utils/validate_cookie_options.js'(
    exports2,
  ) {
    'use strict';
    Object.defineProperty(exports2, '__esModule', {
      value: true,
    });
    exports2.validateCookieOptions = validateCookieOptions;
    function validateCookieOptions(opts) {
      if (!('jar' in opts)) {
        throw new TypeError('invalid cookies.jar');
      }
      if (!opts.jar.store.synchronous) {
        throw new TypeError('an asynchronous cookie store is not supported.');
      }
    }
  },
});

// node_modules/http-cookie-agent/dist/http/create_cookie_agent.js
var require_create_cookie_agent = __commonJS({
  'node_modules/http-cookie-agent/dist/http/create_cookie_agent.js'(exports2) {
    'use strict';
    Object.defineProperty(exports2, '__esModule', {
      value: true,
    });
    exports2.createCookieAgent = createCookieAgent;
    var _nodeUrl = _interopRequireDefault(require('node:url'));
    var _create_cookie_header_value = require_create_cookie_header_value();
    var _save_cookies_from_header = require_save_cookies_from_header();
    var _validate_cookie_options = require_validate_cookie_options();
    function _interopRequireDefault(e) {
      return e && e.__esModule ? e : { default: e };
    }
    var kCookieOptions = /* @__PURE__ */ Symbol('cookieOptions');
    var kReimplicitHeader = /* @__PURE__ */ Symbol('reimplicitHeader');
    var kRecreateFirstChunk = /* @__PURE__ */ Symbol('recreateFirstChunk');
    var kOverrideRequest = /* @__PURE__ */ Symbol('overrideRequest');
    function createCookieAgent(BaseAgentClass) {
      class CookieAgent extends BaseAgentClass {
        constructor(...params) {
          const { cookies: cookieOptions } =
            params.find(opt => {
              return opt != null && typeof opt === 'object' && 'cookies' in opt;
            }) ?? {};
          super(...params);
          if (cookieOptions) {
            (0, _validate_cookie_options.validateCookieOptions)(cookieOptions);
          }
          this[kCookieOptions] = cookieOptions;
        }
        [kReimplicitHeader](req2) {
          const _headerSent = req2._headerSent;
          req2._header = null;
          req2._implicitHeader();
          req2._headerSent = _headerSent;
        }
        [kRecreateFirstChunk](req2) {
          const firstChunk = req2.outputData[0];
          if (req2._header == null || firstChunk == null) {
            return;
          }
          const prevData = firstChunk.data;
          const prevHeaderLength = prevData.indexOf('\r\n\r\n');
          if (prevHeaderLength === -1) {
            firstChunk.data = req2._header;
          } else {
            firstChunk.data = `${req2._header}${prevData.slice(prevHeaderLength + 4)}`;
          }
          const diffSize = firstChunk.data.length - prevData.length;
          req2.outputSize += diffSize;
          req2._onPendingData(diffSize);
        }
        [kOverrideRequest](req2, requestUrl, cookieOptions) {
          const _implicitHeader = req2._implicitHeader.bind(req2);
          req2._implicitHeader = () => {
            try {
              const cookieHeader = (0,
              _create_cookie_header_value.createCookieHeaderValue)({
                cookieOptions,
                passedValues: [req2.getHeader('Cookie')].flat(),
                requestUrl,
              });
              if (cookieHeader) {
                req2.setHeader('Cookie', cookieHeader);
              }
            } catch (err) {
              req2.destroy(err);
              return;
            }
            _implicitHeader();
          };
          const emit = req2.emit.bind(req2);
          req2.emit = (event, ...args) => {
            if (event === 'response') {
              try {
                const res = args[0];
                (0, _save_cookies_from_header.saveCookiesFromHeader)({
                  cookieOptions,
                  cookies: res.headers['set-cookie'],
                  requestUrl,
                });
              } catch (err) {
                req2.destroy(err);
                return false;
              }
            }
            return emit(event, ...args);
          };
        }
        addRequest(req2, options) {
          const cookieOptions = this[kCookieOptions];
          if (cookieOptions) {
            try {
              const requestUrl = _nodeUrl.default.format({
                host: req2.host,
                pathname: req2.path,
                protocol: req2.protocol,
              });
              this[kOverrideRequest](req2, requestUrl, cookieOptions);
              if (req2._header != null) {
                this[kReimplicitHeader](req2);
              }
              if (req2._headerSent) {
                this[kRecreateFirstChunk](req2);
              }
            } catch (err) {
              req2.destroy(err);
              return;
            }
          }
          super.addRequest(req2, options);
        }
      }
      return CookieAgent;
    }
  },
});

// node_modules/http-cookie-agent/dist/http/http_cookie_agent.js
var require_http_cookie_agent = __commonJS({
  'node_modules/http-cookie-agent/dist/http/http_cookie_agent.js'(exports2) {
    'use strict';
    Object.defineProperty(exports2, '__esModule', {
      value: true,
    });
    exports2.HttpCookieAgent = void 0;
    var _nodeHttp = _interopRequireDefault(require('node:http'));
    var _create_cookie_agent = require_create_cookie_agent();
    function _interopRequireDefault(e) {
      return e && e.__esModule ? e : { default: e };
    }
    var HttpCookieAgent2 = (exports2.HttpCookieAgent = (0,
    _create_cookie_agent.createCookieAgent)(_nodeHttp.default.Agent));
  },
});

// node_modules/http-cookie-agent/dist/http/https_cookie_agent.js
var require_https_cookie_agent = __commonJS({
  'node_modules/http-cookie-agent/dist/http/https_cookie_agent.js'(exports2) {
    'use strict';
    Object.defineProperty(exports2, '__esModule', {
      value: true,
    });
    exports2.HttpsCookieAgent = void 0;
    var _nodeHttps = _interopRequireDefault(require('node:https'));
    var _create_cookie_agent = require_create_cookie_agent();
    function _interopRequireDefault(e) {
      return e && e.__esModule ? e : { default: e };
    }
    var HttpsCookieAgent2 = (exports2.HttpsCookieAgent = (0,
    _create_cookie_agent.createCookieAgent)(_nodeHttps.default.Agent));
  },
});

// node_modules/agent-base/dist/helpers.js
async function toBuffer(stream) {
  let length = 0;
  const chunks = [];
  for await (const chunk of stream) {
    length += chunk.length;
    chunks.push(chunk);
  }
  return Buffer.concat(chunks, length);
}
async function json(stream) {
  const buf = await toBuffer(stream);
  const str = buf.toString('utf8');
  try {
    return JSON.parse(str);
  } catch (_err) {
    const err = _err;
    err.message += ` (input: ${str})`;
    throw err;
  }
}
function req(url, opts = {}) {
  const href = typeof url === 'string' ? url : url.href;
  const req2 = (href.startsWith('https:') ? https : http).request(url, opts);
  const promise = new Promise((resolve, reject) => {
    req2.once('response', resolve).once('error', reject).end();
  });
  req2.then = promise.then.bind(promise);
  return req2;
}
var http, https;
var init_helpers = __esm({
  'node_modules/agent-base/dist/helpers.js'() {
    http = __toESM(require('http'), 1);
    https = __toESM(require('https'), 1);
  },
});

// node_modules/agent-base/dist/index.js
var dist_exports = {};
__export(dist_exports, {
  Agent: () => Agent2,
  json: () => json,
  req: () => req,
  toBuffer: () => toBuffer,
});
var net, http2, import_https, INTERNAL, Agent2;
var init_dist = __esm({
  'node_modules/agent-base/dist/index.js'() {
    net = __toESM(require('net'), 1);
    http2 = __toESM(require('http'), 1);
    import_https = require('https');
    init_helpers();
    INTERNAL = /* @__PURE__ */ Symbol('AgentBaseInternalState');
    Agent2 = class extends http2.Agent {
      constructor(opts) {
        super(opts);
        this[INTERNAL] = {};
      }
      /**
       * Determine whether this is an `http` or `https` request.
       */
      isSecureEndpoint(options) {
        if (options) {
          if (typeof options.secureEndpoint === 'boolean') {
            return options.secureEndpoint;
          }
          if (typeof options.protocol === 'string') {
            return options.protocol === 'https:';
          }
        }
        const { stack } = new Error();
        if (typeof stack !== 'string') return false;
        return stack
          .split('\n')
          .some(
            l =>
              l.indexOf('(https.js:') !== -1 || l.indexOf('node:https:') !== -1,
          );
      }
      // In order to support async signatures in `connect()` and Node's native
      // connection pooling in `http.Agent`, the array of sockets for each origin
      // has to be updated synchronously. This is so the length of the array is
      // accurate when `addRequest()` is next called. We achieve this by creating a
      // fake socket and adding it to `sockets[origin]` and incrementing
      // `totalSocketCount`.
      incrementSockets(name) {
        if (this.maxSockets === Infinity && this.maxTotalSockets === Infinity) {
          return null;
        }
        if (!this.sockets[name]) {
          this.sockets[name] = [];
        }
        const fakeSocket = new net.Socket({ writable: false });
        this.sockets[name].push(fakeSocket);
        this.totalSocketCount++;
        return fakeSocket;
      }
      decrementSockets(name, socket) {
        if (!this.sockets[name] || socket === null) {
          return;
        }
        const sockets = this.sockets[name];
        const index = sockets.indexOf(socket);
        if (index !== -1) {
          sockets.splice(index, 1);
          this.totalSocketCount--;
          if (sockets.length === 0) {
            delete this.sockets[name];
          }
        }
      }
      // In order to properly update the socket pool, we need to call `getName()` on
      // the core `https.Agent` if it is a secureEndpoint.
      getName(options) {
        const secureEndpoint = this.isSecureEndpoint(options);
        if (secureEndpoint) {
          return import_https.Agent.prototype.getName.call(this, options);
        }
        return super.getName(options);
      }
      createSocket(req2, options, cb) {
        const connectOpts = {
          ...options,
          secureEndpoint: this.isSecureEndpoint(options),
        };
        const name = this.getName(connectOpts);
        const fakeSocket = this.incrementSockets(name);
        Promise.resolve()
          .then(() => this.connect(req2, connectOpts))
          .then(
            socket => {
              this.decrementSockets(name, fakeSocket);
              if (typeof socket.addRequest === 'function') {
                try {
                  return socket.addRequest(req2, connectOpts);
                } catch (err) {
                  return cb(err);
                }
              }
              this[INTERNAL].currentSocket = socket;
              super.createSocket(req2, options, cb);
            },
            err => {
              this.decrementSockets(name, fakeSocket);
              cb(err);
            },
          );
      }
      createConnection() {
        const socket = this[INTERNAL].currentSocket;
        this[INTERNAL].currentSocket = void 0;
        if (!socket) {
          throw new Error('No socket was returned in the `connect()` function');
        }
        return socket;
      }
      get defaultPort() {
        return (
          this[INTERNAL].defaultPort ?? (this.protocol === 'https:' ? 443 : 80)
        );
      }
      set defaultPort(v) {
        if (this[INTERNAL]) {
          this[INTERNAL].defaultPort = v;
        }
      }
      get protocol() {
        return (
          this[INTERNAL].protocol ??
          (this.isSecureEndpoint() ? 'https:' : 'http:')
        );
      }
      set protocol(v) {
        if (this[INTERNAL]) {
          this[INTERNAL].protocol = v;
        }
      }
    };
  },
});

// node_modules/http-cookie-agent/dist/http/mixed_cookie_agent.js
var require_mixed_cookie_agent = __commonJS({
  'node_modules/http-cookie-agent/dist/http/mixed_cookie_agent.js'(exports2) {
    'use strict';
    Object.defineProperty(exports2, '__esModule', {
      value: true,
    });
    exports2.MixedCookieAgent = void 0;
    var _agentBase = (init_dist(), __toCommonJS(dist_exports));
    var _http_cookie_agent = require_http_cookie_agent();
    var _https_cookie_agent = require_https_cookie_agent();
    var MixedCookieAgent = class extends _agentBase.Agent {
      constructor(options) {
        super();
        this._httpAgent = new _http_cookie_agent.HttpCookieAgent(options);
        this._httpsAgent = new _https_cookie_agent.HttpsCookieAgent(options);
      }
      connect(_req, options) {
        return options.secureEndpoint ? this._httpsAgent : this._httpAgent;
      }
    };
    exports2.MixedCookieAgent = MixedCookieAgent;
  },
});

// node_modules/http-cookie-agent/dist/http/index.js
var require_http2 = __commonJS({
  'node_modules/http-cookie-agent/dist/http/index.js'(exports2) {
    'use strict';
    Object.defineProperty(exports2, '__esModule', {
      value: true,
    });
    Object.defineProperty(exports2, 'HttpCookieAgent', {
      enumerable: true,
      get: function () {
        return _http_cookie_agent.HttpCookieAgent;
      },
    });
    Object.defineProperty(exports2, 'HttpsCookieAgent', {
      enumerable: true,
      get: function () {
        return _https_cookie_agent.HttpsCookieAgent;
      },
    });
    Object.defineProperty(exports2, 'MixedCookieAgent', {
      enumerable: true,
      get: function () {
        return _mixed_cookie_agent.MixedCookieAgent;
      },
    });
    Object.defineProperty(exports2, 'createCookieAgent', {
      enumerable: true,
      get: function () {
        return _create_cookie_agent.createCookieAgent;
      },
    });
    var _create_cookie_agent = require_create_cookie_agent();
    var _http_cookie_agent = require_http_cookie_agent();
    var _https_cookie_agent = require_https_cookie_agent();
    var _mixed_cookie_agent = require_mixed_cookie_agent();
  },
});

// node_modules/http-cookie-agent/http/index.js
var require_http3 = __commonJS({
  'node_modules/http-cookie-agent/http/index.js'(exports2, module2) {
    module2.exports = require_http2();
  },
});

// node_modules/axios-cookiejar-support/dist/index.js
var dist_exports2 = {};
__export(dist_exports2, {
  wrapper: () => wrapper,
});
function requestInterceptor(config) {
  if (!config.jar) {
    return config;
  }
  if (config.jar === true) {
    throw new Error(
      'config.jar does not accept boolean since axios-cookiejar-support@2.0.0.',
    );
  }
  if (
    (config.httpAgent != null &&
      config.httpAgent[AGENT_CREATED_BY_AXIOS_COOKIEJAR_SUPPORT] !== true) ||
    (config.httpsAgent != null &&
      config.httpsAgent[AGENT_CREATED_BY_AXIOS_COOKIEJAR_SUPPORT] !== true)
  ) {
    throw new Error(
      'axios-cookiejar-support does not support for use with other http(s).Agent.',
    );
  }
  config.httpAgent = new import_http.HttpCookieAgent({
    cookies: { jar: config.jar },
  });
  Object.defineProperty(
    config.httpAgent,
    AGENT_CREATED_BY_AXIOS_COOKIEJAR_SUPPORT,
    {
      configurable: false,
      enumerable: false,
      value: true,
      writable: false,
    },
  );
  config.httpsAgent = new import_http.HttpsCookieAgent({
    cookies: { jar: config.jar },
  });
  Object.defineProperty(
    config.httpsAgent,
    AGENT_CREATED_BY_AXIOS_COOKIEJAR_SUPPORT,
    {
      configurable: false,
      enumerable: false,
      value: true,
      writable: false,
    },
  );
  return config;
}
function wrapper(axios) {
  const isWrapped = axios.interceptors.request.handlers?.find(
    ({ fulfilled }) => fulfilled === requestInterceptor,
  );
  if (isWrapped) {
    return axios;
  }
  axios.interceptors.request.use(requestInterceptor);
  if ('create' in axios) {
    const create = axios.create.bind(axios);
    axios.create = (...args) => {
      const instance = create.apply(axios, args);
      instance.interceptors.request.use(requestInterceptor);
      return instance;
    };
  }
  return axios;
}
var import_http, AGENT_CREATED_BY_AXIOS_COOKIEJAR_SUPPORT;
var init_dist2 = __esm({
  'node_modules/axios-cookiejar-support/dist/index.js'() {
    import_http = __toESM(require_http3(), 1);
    AGENT_CREATED_BY_AXIOS_COOKIEJAR_SUPPORT = /* @__PURE__ */ Symbol(
      'AGENT_CREATED_BY_AXIOS_COOKIEJAR_SUPPORT',
    );
  },
});

// dist/domain/auth.js
var require_auth = __commonJS({
  'dist/domain/auth.js'(exports2) {
    'use strict';
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.HttpError = exports2.AuthenticationError = void 0;
    exports2.isLoginSuccessful = isLoginSuccessful;
    function isLoginSuccessful(res) {
      var _a;
      return (
        ((_a = res === null || res === void 0 ? void 0 : res.status) === null ||
        _a === void 0
          ? void 0
          : _a.methodStatus) === 'Success'
      );
    }
    var AuthenticationError = class extends Error {
      constructor(message) {
        super(message);
        this.name = 'AuthenticationErrror';
      }
    };
    exports2.AuthenticationError = AuthenticationError;
    var HttpError = class extends Error {
      constructor(status, message) {
        super(message);
        this.status = status;
        this.name = 'HttpError';
      }
    };
    exports2.HttpError = HttpError;
  },
});

// dist/adapters/http-client.js
var require_http_client = __commonJS({
  'dist/adapters/http-client.js'(exports2) {
    'use strict';
    var __importDefault =
      (exports2 && exports2.__importDefault) ||
      function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
      };
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.AxiosHttpClient = void 0;
    var axios_1 = __importDefault(require_axios2());
    var axios_cookiejar_support_1 = (init_dist2(), __toCommonJS(dist_exports2));
    var auth_1 = require_auth();
    var AxiosHttpClient = class {
      constructor(baseURL, cokiesStore) {
        this.api = (0, axios_cookiejar_support_1.wrapper)(
          axios_1.default,
        ).create({
          baseURL,
          jar: cokiesStore.getJar(),
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        });
      }
      async get(url, cfg) {
        return this.call(() => this.api.get(url, cfg));
      }
      async post(url, data, cfg) {
        return this.call(() => this.api.post(url, data, cfg));
      }
      async call(fn) {
        var _a, _b;
        try {
          return (await fn()).data;
        } catch (err) {
          if (axios_1.default.isAxiosError(err)) {
            throw new auth_1.HttpError(
              (_b =
                (_a = err.response) === null || _a === void 0
                  ? void 0
                  : _a.status) !== null && _b !== void 0
                ? _b
                : 0,
              err.message,
            );
          }
          throw err;
        }
      }
    };
    exports2.AxiosHttpClient = AxiosHttpClient;
  },
});

// dist/adapters/console-logger.js
var require_console_logger = __commonJS({
  'dist/adapters/console-logger.js'(exports2) {
    'use strict';
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.ConsoleLogger = void 0;
    var ConsoleLogger = class {
      debug(msg) {
        console.debug(msg);
      }
      info(msg) {
        console.log(msg);
      }
      warn(msg) {
        console.warn(msg);
      }
      error(msg, err) {
        console.error(msg, err !== null && err !== void 0 ? err : '');
      }
    };
    exports2.ConsoleLogger = ConsoleLogger;
  },
});

// dist/domain/session.js
var require_session = __commonJS({
  'dist/domain/session.js'(exports2) {
    'use strict';
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.hasAuthToken = hasAuthToken;
    exports2.hasExpiredCookies = hasExpiredCookies;
    exports2.isValidSession = isValidSession;
    function hasAuthToken(cookies, tokenName) {
      return cookies.some(c => c.key === tokenName);
    }
    function hasExpiredCookies(cookies, now = /* @__PURE__ */ new Date()) {
      return cookies.some(
        c => c.expires && c.expires.getTime() < now.getTime(),
      );
    }
    function isValidSession(
      cookies,
      tokenName,
      now = /* @__PURE__ */ new Date(),
    ) {
      if (cookies.length === 0) return false;
      if (hasExpiredCookies(cookies, now)) return false;
      if (!hasAuthToken(cookies, tokenName)) return false;
      return true;
    }
  },
});

// dist/services/session.service.js
var require_session_service = __commonJS({
  'dist/services/session.service.js'(exports2) {
    'use strict';
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.SessionService = void 0;
    var session_1 = require_session();
    var SessionService = class {
      constructor(store, logger) {
        this.store = store;
        this.logger = logger;
      }
      async isLocallyValid(baseURL, tokenName) {
        if (!this.store.hasFile()) {
          this.logger.debug('\u274C No cookie file \u2014 need to login');
          return false;
        }
        let cookies;
        try {
          cookies = await this.store.getCookies(baseURL);
        } catch (err) {
          this.logger.warn('\u274C Failed to read cookie jar');
          return false;
        }
        const valid = (0, session_1.isValidSession)(cookies, tokenName);
        this.logger.debug(
          valid ? '\u2705 Session locally valid' : '\u274C Session invalid',
        );
        return valid;
      }
    };
    exports2.SessionService = SessionService;
  },
});

// dist/services/auth.service.js
var require_auth_service = __commonJS({
  'dist/services/auth.service.js'(exports2) {
    'use strict';
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.AuthService = void 0;
    var auth_1 = require_auth();
    var AuthService = class {
      constructor(http3, store, session, logger, cfg) {
        this.http = http3;
        this.store = store;
        this.session = session;
        this.logger = logger;
        this.cfg = cfg;
        this.isAuthenticated = false;
        this.authPromise = null;
      }
      async ensureAuthenticated() {
        if (this.isAuthenticated) return;
        if (this.authPromise) return this.authPromise;
        this.authPromise = this.authenticate();
        try {
          await this.authPromise;
        } finally {
          this.authPromise = null;
        }
      }
      async authenticate() {
        if (
          await this.session.isLocallyValid(
            this.cfg.baseURL,
            this.cfg.tokenName,
          )
        ) {
          this.isAuthenticated = true;
          this.logger.info('\u2705 Using stored session');
          return;
        }
        if (this.store.hasFile()) await this.store.clear();
        await this.login();
      }
      async login() {
        const { username, password, loginPath } = this.cfg;
        if (!username || !password) {
          throw new auth_1.AuthenticationError('Misssing credentials');
        }
        this.logger.info('\u{1F510} Logging in...');
        const res = await this.http.post(loginPath, {
          UserName: username,
          Password: password,
        });
        if (!(0, auth_1.isLoginSuccessful)(res)) {
          throw new auth_1.AuthenticationError(
            'Login failed' + JSON.stringify(res),
          );
        }
        this.isAuthenticated = true;
        this.logger.info('\u2705 Authentication successful');
      }
      async reauthenticate() {
        this.isAuthenticated = false;
        this.authPromise = null;
        await this.store.clear();
        await this.ensureAuthenticated();
      }
      async logout() {
        this.isAuthenticated = false;
        this.authPromise = null;
        await this.store.clear();
        this.logger.info('\u{1F513} Logged out');
      }
    };
    exports2.AuthService = AuthService;
  },
});

// dist/services/api.service.js
var require_api_service = __commonJS({
  'dist/services/api.service.js'(exports2) {
    'use strict';
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.ApiService = void 0;
    var auth_1 = require_auth();
    var ApiService = class {
      constructor(http3, auth) {
        this.http = http3;
        this.auth = auth;
      }
      get(url, cfg) {
        return this.withAuth(() => this.http.get(url, cfg));
      }
      post(url, data, cfg) {
        return this.withAuth(() => this.http.post(url, data, cfg));
      }
      async withAuth(requset) {
        await this.auth.ensureAuthenticated();
        try {
          return await requset();
        } catch (err) {
          if (err instanceof auth_1.HttpError && err.status === 403) {
            await this.auth.ensureAuthenticated();
            return requset();
          }
          throw err;
        }
      }
    };
    exports2.ApiService = ApiService;
  },
});

// dist/adapters/company/company-card.mapper.js
var require_company_card_mapper = __commonJS({
  'dist/adapters/company/company-card.mapper.js'(exports2) {
    'use strict';
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.toCompanyCard = toCompanyCard;
    exports2.toCompanyCards = toCompanyCards;
    function toCompanyCard(res) {
      var _a,
        _b,
        _c,
        _d,
        _e,
        _f,
        _g,
        _h,
        _j,
        _k,
        _l,
        _m,
        _o,
        _p,
        _q,
        _r,
        _s,
        _t,
        _u,
        _v,
        _w,
        _x,
        _y,
        _z,
        _0,
        _1,
        _2,
        _3,
        _4,
        _5,
        _6,
        _7,
        _8,
        _9;
      const card = res.company_card;
      if (!card) {
        throw new Error('Company card missing in API response');
      }
      return {
        inn:
          (_b =
            (_a = card.basic) === null || _a === void 0 ? void 0 : _a.inn) !==
            null && _b !== void 0
            ? _b
            : '',
        ogrn:
          (_d =
            (_c = card.basic) === null || _c === void 0 ? void 0 : _c.ogrn) !==
            null && _d !== void 0
            ? _d
            : '',
        kpp: (_e = card.kpp) !== null && _e !== void 0 ? _e : '',
        fullName: (_f = card.FirstName) !== null && _f !== void 0 ? _f : '',
        shortName:
          (_h =
            (_g = card.basic) === null || _g === void 0
              ? void 0
              : _g.shortName) !== null && _h !== void 0
            ? _h
            : '',
        status: toStatus(
          (_k =
            (_j = card.basic) === null || _j === void 0
              ? void 0
              : _j.status) === null || _k === void 0
            ? void 0
            : _k.code,
          (_m =
            (_l = card.basic) === null || _l === void 0
              ? void 0
              : _l.status) === null || _m === void 0
            ? void 0
            : _m.name,
        ),
        registerAt: parseDate(
          (_o = card.registration) === null || _o === void 0 ? void 0 : _o.date,
        ),
        address: (_p = card.address) !== null && _p !== void 0 ? _p : '',
        regionCode: (_q = card.region_code) !== null && _q !== void 0 ? _q : '',
        employees: (_r = card.employeesFNS) !== null && _r !== void 0 ? _r : 0,
        capital: (_s = card.egrulCapital) !== null && _s !== void 0 ? _s : 0,
        isBadSupplier:
          ((_t = card.badSupplier) !== null && _t !== void 0 ? _t : 0) > 0,
        isMassAdress:
          (_u = card.IsMassAddrFNS) !== null && _u !== void 0 ? _u : false,
        companiesAtThisAddress:
          (_v = card.companiesAtThisAdress) !== null && _v !== void 0 ? _v : 0,
        mspType:
          (_x =
            (_w = card.MSP) === null || _w === void 0 ? void 0 : _w.type) !==
            null && _x !== void 0
            ? _x
            : null,
        mainOkved: mainOkved(card.okved_list_2),
        ceo: getCeo(card),
        trustworthiness:
          (_z =
            (_y = card.trustworthinessIndex) === null || _y === void 0
              ? void 0
              : _y.value) !== null && _z !== void 0
            ? _z
            : 0,
        financialStability:
          (_1 =
            (_0 = card.finacialStabilityIndex) === null || _0 === void 0
              ? void 0
              : _0.value) !== null && _1 !== void 0
            ? _1
            : 0,
        creditworthiness:
          (_3 =
            (_2 = card.creditworthinessIndex) === null || _2 === void 0
              ? void 0
              : _2.value) !== null && _3 !== void 0
            ? _3
            : 0,
        phones: ((_5 =
          (_4 = card.contacts) === null || _4 === void 0
            ? void 0
            : _4.phones) !== null && _5 !== void 0
          ? _5
          : []
        ).map(toPhone),
        emails: ((_7 =
          (_6 = card.contacts) === null || _6 === void 0
            ? void 0
            : _6.emails) !== null && _7 !== void 0
          ? _7
          : []
        ).map(e => {
          var _a2;
          return (_a2 = e.email) !== null && _a2 !== void 0 ? _a2 : '';
        }),
        sites: ((_9 =
          (_8 = card.contacts) === null || _8 === void 0
            ? void 0
            : _8.sites) !== null && _9 !== void 0
          ? _9
          : []
        ).map(s => {
          var _a2;
          return (_a2 = s.site) !== null && _a2 !== void 0 ? _a2 : '';
        }),
      };
    }
    function toCompanyCards(responses) {
      return responses.filter(r => r.company_card != null).map(toCompanyCard);
    }
    function parseDate(iso) {
      if (!iso) return null;
      const d = new Date(iso);
      return isNaN(d.getTime()) ? null : d;
    }
    function toStatus(code, name) {
      const label =
        name !== null && name !== void 0
          ? name
          : '\u041D\u0435\u0438\u0437\u0432\u0435\u0442\u0441\u043D\u043E';
      switch (code) {
        case 11:
          return { code: 'active', label };
        case 12:
          return { code: 'liquidating', label };
        case 13:
          return { code: 'liquidated', label };
        case 14:
          return { code: 'reorganizing', label };
        case 15:
          return { code: 'unknown', label };
        default:
          return { code: 'unknown', label };
      }
    }
    function mainOkved(okveds) {
      var _a, _b, _c;
      if (!(okveds === null || okveds === void 0 ? void 0 : okveds.length))
        return null;
      const main2 =
        (_a = okveds.find(o => o.is_main)) !== null && _a !== void 0
          ? _a
          : okveds[0];
      return {
        code: (_b = main2.code) !== null && _b !== void 0 ? _b : '',
        name: (_c = main2.name) !== null && _c !== void 0 ? _c : '',
      };
    }
    function getCeo(card) {
      var _a, _b, _c, _d, _e, _f;
      const entry =
        (_b =
          (_a = card.management) === null || _a === void 0
            ? void 0
            : _a.persons) === null || _b === void 0
          ? void 0
          : _b[0];
      const person = entry === null || entry === void 0 ? void 0 : entry.person;
      if (!person) return null;
      return {
        personId: (_c = person.personId) !== null && _c !== void 0 ? _c : null,
        inn: (_d = person.inn) !== null && _d !== void 0 ? _d : '',
        fullName: (_e = person.fullName) !== null && _e !== void 0 ? _e : '',
        post:
          (_f = entry === null || entry === void 0 ? void 0 : entry.post) !==
            null && _f !== void 0
            ? _f
            : '',
        since: parseDate(
          entry === null || entry === void 0 ? void 0 : entry.recordDate,
        ),
      };
    }
    function toPhone(p) {
      var _a, _b, _c;
      return {
        raw: (_a = p.number) !== null && _a !== void 0 ? _a : '',
        formatted:
          (_c =
            (_b = p.numberFormated) !== null && _b !== void 0
              ? _b
              : p.number) !== null && _c !== void 0
            ? _c
            : '',
      };
    }
  },
});

// dist/services/company.service.js
var require_company_service = __commonJS({
  'dist/services/company.service.js'(exports2) {
    'use strict';
    var __importDefault =
      (exports2 && exports2.__importDefault) ||
      function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
      };
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.CompanyService = void 0;
    var company_card_mapper_1 = require_company_card_mapper();
    var config_1 = __importDefault(require_config());
    var CompanyService = class {
      constructor(http3) {
        this.http = http3;
      }
      async getCard(inn) {
        const dto = await this.http.get(
          config_1.default.endpoints.get_company_card,
          { params: { inn } },
        );
        return (0, company_card_mapper_1.toCompanyCard)(dto);
      }
    };
    exports2.CompanyService = CompanyService;
  },
});

// dist/use-cases/company-overview.usecase.js
var require_company_overview_usecase = __commonJS({
  'dist/use-cases/company-overview.usecase.js'(exports2) {
    'use strict';
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.CompanyOverviewUseCase = void 0;
    var CompanyOverviewUseCase = class {
      constructor(company, logger) {
        this.company = company;
        this.logger = logger;
      }
      async run(inn) {
        this.logger.info(`\u{1F50D} Scoring company ${inn}...`);
        const [card] = await Promise.all([this.company.getCard(inn)]);
        return {
          shortName: card.shortName,
          status: card.status.label,
        };
      }
    };
    exports2.CompanyOverviewUseCase = CompanyOverviewUseCase;
  },
});

// dist/app.js
var require_app = __commonJS({
  'dist/app.js'(exports2) {
    'use strict';
    var __importDefault =
      (exports2 && exports2.__importDefault) ||
      function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
      };
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.createApp = createApp;
    var path_1 = __importDefault(require('path'));
    var config_1 = __importDefault(require_config());
    var cookie_store_1 = require_cookie_store();
    var http_client_1 = require_http_client();
    var console_logger_1 = require_console_logger();
    var session_service_1 = require_session_service();
    var auth_service_1 = require_auth_service();
    var api_service_1 = require_api_service();
    var company_service_1 = require_company_service();
    var company_overview_usecase_1 = require_company_overview_usecase();
    function createApp() {
      const logger = new console_logger_1.ConsoleLogger();
      const cookieFile = path_1.default.join(
        process.cwd(),
        'storage',
        'cookies',
        'session.json',
      );
      const store = new cookie_store_1.ToughCookieStore(cookieFile);
      const http3 = new http_client_1.AxiosHttpClient(
        config_1.default.endpoints.baseURL,
        store,
      );
      const session = new session_service_1.SessionService(store, logger);
      const auth = new auth_service_1.AuthService(
        http3,
        store,
        session,
        logger,
        {
          baseURL: config_1.default.endpoints.baseURL,
          tokenName: config_1.default.auth.tokenName,
          loginPath: config_1.default.endpoints.login,
          username: config_1.default.auth.username,
          password: config_1.default.auth.password,
        },
      );
      const api = new api_service_1.ApiService(http3, auth);
      const company = new company_service_1.CompanyService(http3);
      const companyOverview =
        new company_overview_usecase_1.CompanyOverviewUseCase(company, logger);
      return {
        logger,
        store,
        http: http3,
        session,
        auth,
        api,
        companyOverview,
      };
    }
  },
});

// dist/domain/methods.js
var require_methods = __commonJS({
  'dist/domain/methods.js'(exports2) {
    'use strict';
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.METHODS_WITH_YEAR = exports2.METHODS_WITHOUT_INN = void 0;
    exports2.isValidInn = isValidInn;
    exports2.isValidYear = isValidYear;
    exports2.needsInn = needsInn;
    exports2.needsYear = needsYear;
    exports2.validateArgs = validateArgs;
    exports2.METHODS_WITHOUT_INN = ['check_balance'];
    exports2.METHODS_WITH_YEAR = ['get_company_financial_report'];
    function isValidInn(inn) {
      return /^\d{10}$|^\d{12}$/.test(inn);
    }
    function isValidYear(year) {
      return /^(19\d{2}|20\d{2}|2100)$/.test(year);
    }
    function needsInn(method) {
      return !exports2.METHODS_WITHOUT_INN.includes(method);
    }
    function needsYear(method) {
      return exports2.METHODS_WITH_YEAR.includes(method);
    }
    function validateArgs(args, knownMethods) {
      if (!knownMethods.includes(args.method)) {
        throw new Error(`Unknown method: "${args.method}"
Available: ${knownMethods.join(', \n')}`);
      }
      if (needsInn(args.method) && !isValidInn(args.inn)) {
        throw new Error(
          `Invalid INN: "${args.inn}" \u2014 must be 10 or 12 digits`,
        );
      }
      if (needsYear(args.method) && !isValidYear(args.year)) {
        throw new Error(
          `Invalid Year: "${args.year}" \u2014 must be 4 digits starting with 19 or 20`,
        );
      }
    }
  },
});

// dist/cli/methods.js
var require_methods2 = __commonJS({
  'dist/cli/methods.js'(exports2) {
    'use strict';
    var __importDefault =
      (exports2 && exports2.__importDefault) ||
      function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
      };
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.ALL_METHODS =
      exports2.METHOD_ENDPOINTS =
      exports2.CUSTOM_METHODS =
        void 0;
    var config_1 = __importDefault(require_config());
    var { endpoints } = config_1.default;
    exports2.CUSTOM_METHODS = {
      company_overview: 'company_overview',
    };
    exports2.METHOD_ENDPOINTS = {
      check_balance: endpoints.check_balance,
      get_company_card: endpoints.get_company_card,
      get_company_court_cases: endpoints.get_company_court_cases,
      get_company_bailiffs: endpoints.get_company_bailiffs,
      get_company_owners: endpoints.get_company_owners,
      get_company_financial_report: endpoints.get_company_financial_report,
      get_company_suppliers_blacklist:
        endpoints.get_company_suppliers_blacklist,
      get_entrepreneur_card: endpoints.get_entrepreneur_card,
    };
    exports2.ALL_METHODS = [
      ...Object.keys(exports2.METHOD_ENDPOINTS),
      ...Object.values(exports2.CUSTOM_METHODS),
    ];
  },
});

// dist/cli/cli-parser.js
var require_cli_parser = __commonJS({
  'dist/cli/cli-parser.js'(exports2) {
    'use strict';
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.parseCliArgs = parseCliArgs;
    var methods_1 = require_methods();
    var methods_2 = require_methods2();
    function parseCliArgs(argv) {
      const get = prefix => {
        const found = argv.find(a => a.startsWith(prefix));
        return found ? found.slice(prefix.length) : '';
      };
      const method = get('--method=');
      const inn = get('--inn=');
      const year = get('--year=');
      if (!method) {
        throw new Error(`Missing --method=<name>
Availabe: ${methods_2.ALL_METHODS.join(', \n')}`);
      }
      console.log(methods_2.ALL_METHODS);
      const args = { method, inn, year };
      (0, methods_1.validateArgs)(args, methods_2.ALL_METHODS);
      return args;
    }
  },
});

// dist/cli/cli.js
var require_cli = __commonJS({
  'dist/cli/cli.js'(exports2) {
    'use strict';
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.runCli = runCli;
    var cli_parser_1 = require_cli_parser();
    var methods_1 = require_methods2();
    var handlers = {
      [methods_1.CUSTOM_METHODS.company_overview]: async (app, { inn }) => {
        const result = await app.companyOverview.run(inn);
        app.logger.info(JSON.stringify(result, null, 2));
      },
    };
    var callEndpoints = async (app, { method, inn, year }) => {
      const endpoint = methods_1.METHOD_ENDPOINTS[method];
      app.logger.info(
        `\u{1F50D} Calling ${method}${inn ? ` for INN ${inn}` : ''}...`,
      );
      const result = await app.api.get(endpoint, {
        params: {
          ...(inn && { inn }),
          ...(year && { year }),
        },
      });
      app.logger.info('\u2705 Result: ' + JSON.stringify(result, null, 2));
    };
    async function runCli(argv, app) {
      var _a;
      try {
        const args = (0, cli_parser_1.parseCliArgs)(argv);
        const handler =
          (_a = handlers[args.method]) !== null && _a !== void 0
            ? _a
            : callEndpoints;
        await handler(app, args);
        return 0;
      } catch (err) {
        app.logger.error(
          '\u274C Error',
          err instanceof Error ? err.message : String(err),
        );
        return 1;
      }
    }
  },
});

// dist/main.js
Object.defineProperty(exports, '__esModule', { value: true });
var app_1 = require_app();
var cli_1 = require_cli();
async function main() {
  const app = (0, app_1.createApp)();
  try {
    process.exit(await (0, cli_1.runCli)(process.argv.slice(2), app));
  } catch (err) {
    app.logger.error('\u274C Fatal error', err);
    process.exit(1);
  }
}
main();
/*! Bundled license information:

tough-cookie/dist/cookie/cookie.js:
  (*!
   * Copyright (c) 2015-2020, Salesforce.com, Inc.
   * All rights reserved.
   *
   * Redistribution and use in source and binary forms, with or without
   * modification, are permitted provided that the following conditions are met:
   *
   * 1. Redistributions of source code must retain the above copyright notice,
   * this list of conditions and the following disclaimer.
   *
   * 2. Redistributions in binary form must reproduce the above copyright notice,
   * this list of conditions and the following disclaimer in the documentation
   * and/or other materials provided with the distribution.
   *
   * 3. Neither the name of Salesforce.com nor the names of its contributors may
   * be used to endorse or promote products derived from this software without
   * specific prior written permission.
   *
   * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
   * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
   * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
   * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
   * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
   * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
   * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
   * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
   * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
   * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
   * POSSIBILITY OF SUCH DAMAGE.
   *)

mime-db/index.js:
  (*!
   * mime-db
   * Copyright(c) 2014 Jonathan Ong
   * Copyright(c) 2015-2022 Douglas Christopher Wilson
   * MIT Licensed
   *)

mime-types/index.js:
  (*!
   * mime-types
   * Copyright(c) 2014 Jonathan Ong
   * Copyright(c) 2015 Douglas Christopher Wilson
   * MIT Licensed
   *)
*/
