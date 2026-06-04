import dotenv from "dotenv";

dotenv.config();

function normalizeHost(rawHost) {
    const value = (rawHost || "").trim();

    if (!value) {
        return "127.0.0.1";
    }

    // Permite recibir HOST con o sin protocolo y extrae solo el hostname.
    if (value.includes("://")) {
        try {
            return new URL(value).hostname || "127.0.0.1";
        } catch {
            return value.replace(/^https?:\/\//i, "").split("/")[0] || "127.0.0.1";
        }
    }

    return value;
}

export const env = {
    PORT: process.env.PORT || 5001,
    HOST: normalizeHost(process.env.HOST),
    JWT_SECRET: process.env.JWT_SECRET || "some_secret_key",
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "24h",
    MONGO_DB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017",
    MONGO_DB_NAME: process.env.MONGO_DB_NAME || "task_manager",
};
