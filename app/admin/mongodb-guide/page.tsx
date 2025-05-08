"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Server } from "lucide-react"

export default function MongoDBGuidePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Guía de Conexión a MongoDB</h1>
        <p className="text-muted-foreground">Sigue estos pasos para conectar la aplicación a MongoDB</p>
      </div>

      <Tabs defaultValue="setup">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="setup">Configuración</TabsTrigger>
          <TabsTrigger value="connection">Conexión</TabsTrigger>
          <TabsTrigger value="migration">Migración</TabsTrigger>
        </TabsList>

        <TabsContent value="setup" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>1. Configuración de MongoDB Atlas</CardTitle>
              <CardDescription>Crea una cuenta y configura un cluster en MongoDB Atlas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  Ve a{" "}
                  <a
                    href="https://www.mongodb.com/cloud/atlas"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline"
                  >
                    MongoDB Atlas
                  </a>{" "}
                  y crea una cuenta si no tienes una.
                </li>
                <li>Crea un nuevo proyecto y un nuevo cluster (puedes usar el plan gratuito).</li>
                <li>
                  En "Network Access", añade tu dirección IP actual o usa 0.0.0.0/0 para permitir acceso desde cualquier
                  lugar (solo para desarrollo).
                </li>
                <li>En "Database Access", crea un nuevo usuario con permisos de lectura y escritura.</li>
                <li>En la vista del cluster, haz clic en "Connect" y selecciona "Connect your application".</li>
                <li>
                  Copia la cadena de conexión, se verá algo así:{" "}
                  <code className="bg-muted p-1 rounded">
                    mongodb+srv://username:password@cluster0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
                  </code>
                </li>
              </ol>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Importante</AlertTitle>
                <AlertDescription>
                  Guarda la cadena de conexión de forma segura. Nunca la incluyas directamente en el código fuente.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Instalar dependencias</CardTitle>
              <CardDescription>Instala los paquetes necesarios para conectar con MongoDB</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Ejecuta el siguiente comando en la terminal:</p>

              <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                <code>npm install mongodb mongoose</code>
              </pre>

              <p className="mt-4">Esto instalará:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>mongodb</strong>: El driver oficial de MongoDB para Node.js
                </li>
                <li>
                  <strong>mongoose</strong>: Una biblioteca de modelado de objetos MongoDB para Node.js
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="connection" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>3. Configurar variables de entorno</CardTitle>
              <CardDescription>Configura las variables de entorno para la conexión a MongoDB</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Crea un archivo <code className="bg-muted p-1 rounded">.env.local</code> en la raíz del proyecto con el
                siguiente contenido:
              </p>

              <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                <code>MONGODB_URI=tu_cadena_de_conexion_aqui MONGODB_DB=nombre_de_tu_base_de_datos</code>
              </pre>

              <p>
                Reemplaza <code className="bg-muted p-1 rounded">tu_cadena_de_conexion_aqui</code> con la cadena de
                conexión que obtuviste de MongoDB Atlas.
              </p>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Importante</AlertTitle>
                <AlertDescription>
                  Asegúrate de que el archivo .env.local esté incluido en .gitignore para no exponer tus credenciales.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Crear archivo de conexión</CardTitle>
              <CardDescription>Crea un archivo para manejar la conexión a MongoDB</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Crea un archivo <code className="bg-muted p-1 rounded">lib/mongodb.ts</code> con el siguiente contenido:
              </p>

              <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                <code>{`import { MongoClient } from 'mongodb'

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local')
}

const uri = process.env.MONGODB_URI
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise`}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="migration" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>5. Modificar el servicio de datos</CardTitle>
              <CardDescription>Actualiza el servicio de datos para usar MongoDB</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Modifica el archivo <code className="bg-muted p-1 rounded">lib/mongodb-service.ts</code> para usar
                MongoDB en lugar del almacenamiento local:
              </p>

              <p className="mt-4">
                Para cada función en el servicio, reemplaza la implementación actual con llamadas a MongoDB. Por
                ejemplo:
              </p>

              <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                <code>{`import clientPromise from './mongodb'

// Ejemplo de cómo modificar la función getTeams
export const getTeams = async (): Promise<TeamModel[]> => {
  const client = await clientPromise
  const db = client.db(process.env.MONGODB_DB)
  const teams = await db.collection('teams').find({}).toArray()
  return teams as TeamModel[]
}

// Ejemplo de cómo modificar la función createTeam
export const createTeam = async (team: TeamModel): Promise<TeamModel> => {
  const client = await clientPromise
  const db = client.db(process.env.MONGODB_DB)
  const result = await db.collection('teams').insertOne({
    ...team,
    createdAt: new Date(),
    updatedAt: new Date()
  })
  return {
    ...team,
    _id: result.insertedId.toString()
  }
}`}</code>
              </pre>

              <Alert className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Consejo</AlertTitle>
                <AlertDescription>
                  Modifica cada función una por una y prueba la aplicación después de cada cambio para asegurarte de que
                  todo funciona correctamente.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Migrar datos existentes</CardTitle>
              <CardDescription>Migra los datos existentes a MongoDB</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Crea un script para migrar los datos existentes de localStorage a MongoDB:</p>

              <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                <code>{`// scripts/migrate-to-mongodb.js

import clientPromise from '../lib/mongodb'

async function migrateData() {
  try {
    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)

    // Obtener datos de localStorage
    const teams = JSON.parse(localStorage.getItem('football_teams') || '[]')
    const players = JSON.parse(localStorage.getItem('football_players') || '[]')
    const matches = JSON.parse(localStorage.getItem('football_matches') || '[]')
    const events = JSON.parse(localStorage.getItem('football_events') || '[]')
    const media = JSON.parse(localStorage.getItem('football_media') || '[]')

    // Migrar equipos
    if (teams.length > 0) {
      await db.collection('teams').insertMany(teams)
    }

    // Migrar jugadores
    if (players.length > 0) {
      await db.collection('players').insertMany(players)
    }

    // Migrar partidos
    if (matches.length > 0) {
      await db.collection('matches').insertMany(matches)
    }

    // Migrar eventos
    if (events.length > 0) {
      await db.collection('events').insertMany(events)
    }

    // Migrar media
    if (media.length > 0) {
      await db.collection('media').insertMany(media)
    }

    console.log('Migración completada con éxito')
  } catch (error) {
    console.error('Error durante la migración:', error)
  }
}

migrateData()`}</code>
              </pre>

              <p>Ejecuta este script con el siguiente comando:</p>

              <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                <code>node -r dotenv/config scripts/migrate-to-mongodb.js</code>
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Verificar la migración</CardTitle>
              <CardDescription>Verifica que los datos se hayan migrado correctamente</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Para verificar que los datos se han migrado correctamente:</p>

              <ol className="list-decimal pl-5 space-y-2">
                <li>Ve a MongoDB Atlas y navega a tu cluster.</li>
                <li>Haz clic en "Collections" para ver las colecciones de tu base de datos.</li>
                <li>Deberías ver las colecciones: teams, players, matches, events y media.</li>
                <li>Haz clic en cada colección para verificar que los datos están presentes.</li>
              </ol>

              <Alert className="mt-4">
                <Server className="h-4 w-4" />
                <AlertTitle>Siguiente paso</AlertTitle>
                <AlertDescription>
                  Una vez que hayas verificado que los datos se han migrado correctamente, puedes modificar la
                  aplicación para usar MongoDB en producción.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
