class URL {
  constructor(protocol, username, password, host, port, pathname, query, hash) {
    this.protocol = protocol
    this.username = username
    this.password = password
    this.host = host
    this.port = port
    this.pathname = pathname
    this.query = query
    this.hash = hash
  }

  getURL() {
    const {
      protocol,
      username,
      password,
      host,
      port,
      pathname,
      query,
      hash
    } = this
    let URL = ''
    protocol ? URL += protocol + '://' : undefined
    username ? URL += username + ':' : undefined
    password ? URL += password + '@' : undefined
    host ? URL += host : undefined
    port ? URL += `:${port}` : undefined
    pathname ? URL += `/${pathname}` : undefined
    hash ? URL += `#${hash}` : undefined
    return URL
  }
}

class URLBuilder {
  constructor() {
    this._protocol
    this._username
    this._password
    this._host
    this._port
    this._pathname
    this._query
    this._hash
  }

  protocol(protocol) {
    this._protocol = protocol
    return this
  }
  username(username) {
    this._username = username
    return this
  }
  password(password) {
    this._password = password
    return this
  }
  host(host) {
    this._host = host
    return this
  }
  port(port) {
    this._port = port
    return this
  }
  pathname(pathname) {
    this._pathname = pathname
    return this
  }
  query(query) {
    this._query = query
    return this
  }
  hash(hash) {
    this._hash = hash
    return this
  }
  build() {
    return new URL(
      this._protocol,
      this._username,
      this._password,
      this._host,
      this._port,
      this._pathname,
      this._query,
      this._hash
    )
  }
}

module.exports = {
  URLBuilder
}