import rp from 'request-promise'

const headers = {
  'Accept': 'application/json',
  'Accept-Charset': 'utf-8',
  'Keep-Alive': 'true',
  'X-Requested-By': 'hb_android_app',
  'User-Agent': 'Apache-HttpClient/UNAVAILABLE (java 1.4)'
}

// login, set coookies
function login(email, password){
  return rp({
    uri: 'https://www.humblebundle.com/login',
    method: 'POST',
    headers: headers,
    form: {
      username: email,
      password: password
    },
    jar: true,
    json: true
  })
}

// get gamekeys from your library
function gamekeys(){
  return rp({
    uri: 'https://www.humblebundle.com/api/v1/user/order',
    headers: headers,
    jar: true,
    json: true
  })
  .then(body => body.map(g => g.gamekey))
}

// get a single order
function order(id){
  return rp({
    uri: `https://www.humblebundle.com/api/v1/order/${id}?unused_tpkds=true`,
    headers: headers,
    jar: true,
    json: true
  })
}

export default {
  login,
  gamekeys,
  order
}