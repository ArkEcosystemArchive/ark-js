const deepmerge = require('deepmerge')

class Config {
  setConfig (config) {
    this.config = {}

    for (const [key, value] of Object.entries(config)) {
      this.config[key] = value
    }

    this.buildConstants()
  }

  all () {
    return this.config
  }

  set (key, value) {
    this.config[key] = value
  }

  get (key) {
    return this.config[key]
  }

  setHeight (value) {
    this.height = value
  }

  getHeight () {
    return this.height
  }

  buildConstants () {
    this.constants = this.config.constants.sort((a, b) => a.height - b.height)
    this.constant = {
      index: 0,
      data: this.constants[0]
    }

    let lastmerged = 0

    while (lastmerged < this.constants.length - 1) {
      this.constants[lastmerged + 1] = deepmerge(this.constants[lastmerged], this.constants[lastmerged + 1])
      lastmerged++
    }
  }

  getConstants (height) {
    if (this.height) {
      height = this.height
    }

    if (!height) {
      height = 1
    }

    while ((this.constant.index < this.constants.length - 1) && height >= this.constants[this.constant.index + 1].height) {
      this.constant.index++
      this.constant.data = this.constants[this.constant.index]
    }
    while (height < this.constants[this.constant.index].height) {
      this.constant.index--
      this.constant.data = this.constants[this.constant.index]
    }

    return this.constant.data
  }
}

export default new Config()
