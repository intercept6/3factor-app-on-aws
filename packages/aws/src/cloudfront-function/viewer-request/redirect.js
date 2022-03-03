/* eslint-disable no-var */

// eslint-disable-next-line no-unused-vars
function handler(event) {
  console.log(event);
  var request = event.request;

  if (request.uri === '/orders' || request.uri.startsWith('/orders/')) {
    request.uri = '/orders/[id].html';
    return request;
  }

  // スラッシュで終わらず拡張子がない場合はディレクトリとみなして末尾にスラッシュを付ける
  if (!request.uri.match(/\/$/)) {
    var names = request.uri.split('/');
    // ディレクトリ名に「.」が含まれるケースについては考慮外とする
    if (!names[names.length - 1].match(/.+\..+/)) {
      request.uri = request.uri.replace(/$/, '/');
    }
  }

  request.uri = request.uri.replace(/\/$/, '/index.html');

  return request;
}
