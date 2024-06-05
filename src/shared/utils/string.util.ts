import { parse } from 'path';
import * as crypto from 'crypto';

export class StringUtil {
  format(source: string, ...args: string[]) {
    let i = 0;
    if (args instanceof Array) {
      for (i = 0; i < args.length; i++) {
        source = source.replace(new RegExp('\\{' + i + '\\}', 'gm'), args[i]);
      }
      return source;
    }
    for (i = 0; i < source.length - 1; i++) {
      source = source.replace(new RegExp('\\{' + i + '\\}', 'gm'), args[i + 1]);
    }
    return source;
  }

  formatStringTemplate(
    template: string,
    data: { [key: string]: string },
  ): string {
    return template.replace(/{(\w+)}/g, (match, key) => '123' || '');
  }

  formatTemplateWithKeywords(
    template: string,
    keywords: Record<string, string>,
    data: Record<string, string | null | undefined | any>,
  ): string {
    return Object.keys(keywords)
      .reduce((_template: string, key: string) => {
        _template = _template.replace(keywords[key], data[key] ?? '');
        return _template;
      }, template)
      .split('<br>')
      .filter((x) => x)
      .join('<br>');
  }

  getFileExtension(fileName?: string | null) {
    const index = fileName?.lastIndexOf('.') || -1;
    return fileName && index >= 0
      ? fileName.substring(fileName.lastIndexOf('.'), fileName.length)
      : '';
  }

  getFileName(filePath?: string | null) {
    return filePath
      ? filePath.substring(filePath.lastIndexOf('/') + 1, filePath.length)
      : '';
  }

  getPathName(fullPath?: string | null) {
    return fullPath ? fullPath.substring(0, fullPath.lastIndexOf('/')) : '';
  }

  snakeCaseToCamelCase(source: string) {
    if (!source) return source;
    return source.replace(/([-_][a-z])/g, (group) =>
      group.toUpperCase().replace('-', '').replace('_', ''),
    );
  }

  camelToSnakeCase(source: string) {
    return source.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  }

  pascalCase(str: string): string {
    return str
      .replace(/([A-Z])/g, (match) => `${match}`)
      .replace(/^./, (match) => match.toUpperCase())
      .trim();
  }

  parseBoolean(str?: string | boolean): boolean {
    if (str === null || str === undefined) return false;
    if (typeof str === 'boolean') return str as boolean;
    return str === '1' || str === 'true';
  }

  parseNumber(
    str?: string | number | null,
    defaultValue: number | null = null,
  ): number | null {
    if (str === null || str === undefined || str === '') return defaultValue;
    if (typeof str === 'number') return str as number;
    try {
      const tryParseNumber = Number(str);
      return isNaN(tryParseNumber) ? defaultValue : tryParseNumber;
    } catch (error) {
      return defaultValue;
    }
  }

  getFileNameFromTempS3KeyWithoutTimestamp(s3TempKey: string) {
    const { name, ext } = parse(decodeURIComponent(s3TempKey));
    return `${name.replace(name.slice(-18), '')}${ext}`;
  }

  parsePath(source: string) {
    return source?.replace(/ /gi, '');
  }

  parseURL(url: string) {
    return url?.replace(/^"+/gi, '')?.replace(/"+$/gi, '');
  }

  parseCSVText(url: string) {
    return url?.replace(/^"+/gi, '')?.replace(/"+$/gi, '');
  }

  parseKey(url: string) {
    return this.parsePath(this.parseURL(url))?.replace(/\./gi, '-');
  }

  parseJSON(source: string) {
    return JSON.parse(source.replace(/\n/gi, '\\n'));
  }

  tryParseJSON(source: string) {
    try {
      if (source.startsWith('"') && source.endsWith('"')) {
        source = source.substring(1, source.length - 1);
      }
      return this.parseJSON(source);
    } catch (error) {
      return null;
    }
  }

  calculateMD5Hash(input: string): string {
    const md5Hash = crypto
      .createHash('md5')
      .update(input, 'utf8')
      .digest('hex');

    return md5Hash.toUpperCase();
  }
}
