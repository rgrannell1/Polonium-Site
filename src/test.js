
const {Build, Task} = require('./build_sm/models')

const build = new Build({
  title: 'xasdasdasd',
  tasks: [
    new Task({
      title: 'foobar',
      run: () => { }
    })
  ]
})

build.run()
