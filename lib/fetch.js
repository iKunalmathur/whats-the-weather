export const fetchHandler = async (config) => {
  let resData, resStatus, resErrors;
  try {
    const res = await fetch(config.url, {
      ...config.options,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    });
    resData = await res.json();
    resStatus = res.status;
  } catch (err) {
    resErrors = err;
    // console.log(err);
  }
  return { resData, resStatus, resErrors };
};
