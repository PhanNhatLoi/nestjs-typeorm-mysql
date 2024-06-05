export class FindManyOptionsUtils {
  processWhere(metadata, condition) {
    const where = {};
    for (const key in condition) {
      if (metadata.columns.find((column) => column.propertyName === key)) {
        where[key] = condition[key];
      }
    }
    return where;
  }
}
