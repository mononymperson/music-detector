declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: number
            RAPID_API_URL: string
            RAPID_API_HOST: string
            RAPID_API_KEY: string
        }
    }
}

export { }

