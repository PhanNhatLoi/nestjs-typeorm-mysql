import { DateTimeUtils } from 'src/shared/utils/date-time.util';
import { FindManyOptionsUtils } from 'src/shared/utils/find-many-options.util';
import { HttpRequestUtil } from 'src/shared/utils/http-request.util';
import { StringUtil } from 'src/shared/utils/string.util';

export class Utils {
  static Request = new HttpRequestUtil();
  static FindManyOptions = new FindManyOptionsUtils();
  static DateTime = new DateTimeUtils();
  static String = new StringUtil();
  static HttpRequest = new HttpRequestUtil();
}
