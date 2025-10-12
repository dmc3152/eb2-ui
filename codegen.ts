import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
    schema: 'http://localhost:4000/graphql',
    documents: './src/**/*.graphql',
    generates: {
        './graphql/generated.ts': {
            config: {
                scalars: {
                    DateTime: 'string'
                }
            },
            plugins: ['typescript', 'typescript-operations', 'typescript-apollo-angular']
        }
    }
}
export default config