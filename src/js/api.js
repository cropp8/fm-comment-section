export async function makeRequest(path, method, data) {
  const requestOptions = {};

  requestOptions.method = method || 'GET';

  if (data) {
    requestOptions.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`https://comment-section-new-default-rtdb.europe-west1.firebasedatabase.app/${path}`, requestOptions);

    return response.json();
  } catch (error) {
    console.error(error);
  }
}