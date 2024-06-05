import { BadRequestException } from '@nestjs/common';
import { Between } from 'typeorm';

export class DateTimeUtils {
  UtcNow(): Date {
    return new Date(new Date().toISOString());
  }

  UtcNowString(): string {
    return new Date().toISOString();
  }

  addDays(date: Date, dayInterval: number): Date {
    if (!date) throw new BadRequestException();
    const dest = new Date(date.getTime());
    dest.setDate(date.getDate() + dayInterval);
    return dest;
  }

  getDateInterval(date: Date) {
    return (
      date.getFullYear() +
      ('00' + (date.getMonth() + 1)).slice(-2) +
      ('00' + date.getDate()).slice(-2) +
      ('00' + date.getHours()).slice(-2) +
      ('00' + date.getMinutes()).slice(-2) +
      ('00' + date.getSeconds()).slice(-2)
    );
  }

  getNowInterval() {
    return this.getDateInterval(this.UtcNow());
  }

  formatLocaleStringFromUtc(
    value: string,
    format:
      | 'yyyy/MM/ddThh:mm:ss'
      | 'yyyyMMdd'
      | 'yyyy/MM/ddT00:00:00'
      | 'yyyy/MM/ddT00:00:00.000' = 'yyyy/MM/ddThh:mm:ss',
  ) {
    if (!value) return '';
    const utcDate = new Date(value);
    return this.format(utcDate, format);
  }

  formatLocaleString(
    value?: string | Date | null,
    format:
      | 'yyyy/MM/ddThh:mm:ss'
      | 'yyyyMMdd'
      | 'yyyy/MM/ddT00:00:00'
      | 'yyyy/MM/ddT00:00:00.000' = 'yyyy/MM/ddThh:mm:ss',
  ) {
    if (!value) return '';

    if (typeof value === 'string') {
      if (value.includes('Z'))
        return this.formatLocaleStringFromUtc(value, format);
      else value = new Date(value);
    }
    return this.format(value, format);
  }

  format(
    value: Date,
    format:
      | 'yyyy/MM/ddThh:mm:ss'
      | 'yyyyMMdd'
      | 'yyyyMMddHHmmssms'
      | 'yyyy/MM/ddT00:00:00'
      | 'yyyy/MM/ddT00:00:00.000' = 'yyyy/MM/ddThh:mm:ss',
  ) {
    const [year, month, date, hours, minutes, seconds, milliseconds] = [
      value.getFullYear(),
      ('00' + (value.getMonth() + 1)).slice(-2),
      ('00' + value.getDate()).slice(-2),
      ('00' + value.getHours()).slice(-2),
      ('00' + value.getMinutes()).slice(-2),
      ('00' + value.getSeconds()).slice(-2),
      ('000' + value.getMilliseconds()).slice(-3),
    ];

    switch (format) {
      case 'yyyyMMdd':
        return `${year}${month}${date}`;
      case 'yyyy/MM/ddT00:00:00':
        return `${year}/${month}/${date}T00:00:00`;
      case 'yyyy/MM/ddT00:00:00.000':
        return `${year}/${month}/${date}T00:00:00.000`;
      case 'yyyyMMddHHmmssms':
        return `${year}${month}${date}${hours}${minutes}${seconds}${milliseconds}`;
      default:
        return `${year}/${month}/${date}T${hours}:${minutes}:${seconds}`;
    }
  }

  toDateTime(value?: string | Date | null) {
    if (typeof value === 'string') {
      value = value
        .replace(/^"+/gi, '')
        ?.replace(/"+$/gi, '')
        .replace(/\//gi, '-');

      const date = new Date(value);

      return date ?? undefined;
    }

    if (value instanceof Date) {
      return value;
    }

    return undefined;
  }

  betweenDates(from: string | Date, to: string | Date) {
    if (!from || !to) return undefined;

    const fromDate = this.toDateTime(from);
    const toDate = this.addDays(this.toDateTime(to), 1);

    return Between(fromDate, toDate);
  }

  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
}
