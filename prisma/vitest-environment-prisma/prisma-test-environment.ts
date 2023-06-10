import { Environment } from 'vitest'

// This environment will be executed before each test file
export default <Environment>{
  name: 'prisma',
  async setup() {
    // This code will run before tests run
    console.log('Setup')

    return {
      async teardown() {
        // This code will run after the tests run
        console.log('Teardown')
      },
    }
  },
}
