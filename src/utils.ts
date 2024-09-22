function convertToDataFrame(data: any) {
  const res: any = {};
  if (data.length === 0) {
    return res;
  }

  const keys = Object.keys(data[0]);
  keys.forEach(
    (key: string) => (res[key] = data.map((item: any) => item[key])),
  );
  return res;
}

export { convertToDataFrame };
