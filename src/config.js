class Config {
  setConfig(config) {
    for (const [key, value] in config) {
      this[key] = value
    }
  }

  get(key) {
    return this[key]
  }
}

export default new Config()
