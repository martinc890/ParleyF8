import { MongoClient } from "mongodb"

// Usar las variables de entorno proporcionadas
const MONGODB_URI =
  "mongodb+srv://admin:segura1234@cluster0.mg86qfm.mongodb.net/torneo2025?retryWrites=true&w=majority&appName=Cluster0"
const MONGODB_DB = "torneo2025"

if (!MONGODB_URI) {
  throw new Error("Por favor, añade tu URI de MongoDB a las variables de entorno")
}

if (!MONGODB_DB) {
  throw new Error("Por favor, añade el nombre de tu base de datos MongoDB a las variables de entorno")
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

const options = {}

if (process.env.NODE_ENV === "development") {
  // En modo desarrollo, usamos una variable global para que el valor
  // se conserve entre recargas de módulos causadas por HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(MONGODB_URI, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // En modo producción, es mejor no usar una variable global.
  client = new MongoClient(MONGODB_URI, options)
  clientPromise = client.connect()
}

// Exportamos una promesa de MongoClient con alcance de módulo.
// Al hacer esto en un módulo separado, el cliente puede ser compartido entre funciones.
export default clientPromise
