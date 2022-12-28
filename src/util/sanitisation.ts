export function sanitiseObject(obj: any) {
  const keys = Object.keys(obj);
  keys.forEach((key) => {
    if (!obj[key]) {
      delete obj[key];
    }
  });
  return obj;
}
