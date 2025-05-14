# Guía de Integración con Supabase

## Introducción

Esta guía te ayudará a integrar tu aplicación Parley con Supabase para almacenar y gestionar datos de equipos, jugadores, partidos y estadísticas.

## Requisitos

1. Una cuenta en [Supabase](https://supabase.com)
2. Un proyecto creado en Supabase
3. Las credenciales de API de tu proyecto (URL y API Key)

## Paso 1: Configuración de Supabase

### Instalar dependencias

\`\`\`bash
npm install @supabase/supabase-js
\`\`\`

### Configurar cliente de Supabase

Crea un archivo `lib/supabase.ts`:

\`\`\`typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
\`\`\`

### Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=tu-url-de-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anon-de-supabase
\`\`\`

## Paso 2: Estructura de la base de datos

### Tablas necesarias

1. **teams** - Equipos
   - id (uuid, primary key)
   - name (text)
   - logo (text, URL)
   - group (text)
   - created_at (timestamp)

2. **players** - Jugadores
   - id (uuid, primary key)
   - name (text)
   - number (integer)
   - position (text)
   - team_id (uuid, foreign key)
   - created_at (timestamp)

3. **matches** - Partidos
   - id (uuid, primary key)
   - home_team_id (uuid, foreign key)
   - away_team_id (uuid, foreign key)
   - date (date)
   - time (text)
   - venue (text)
   - status (text: 'upcoming', 'completed')
   - phase (text: 'group', 'quarterfinal', 'semifinal', 'final')
   - group (text)
   - home_score (integer)
   - away_score (integer)
   - created_at (timestamp)

4. **match_events** - Eventos de partidos
   - id (uuid, primary key)
   - match_id (uuid, foreign key)
   - player_id (uuid, foreign key)
   - assist_player_id (uuid, foreign key, nullable)
   - team_id (uuid, foreign key)
   - type (text: 'goal', 'yellowCard', 'redCard', 'substitution')
   - minute (integer)
   - created_at (timestamp)

5. **player_stats** - Estadísticas de jugadores
   - id (uuid, primary key)
   - player_id (uuid, foreign key)
   - goals (integer)
   - assists (integer)
   - yellow_cards (integer)
   - red_cards (integer)
   - created_at (timestamp)

## Paso 3: Migración de datos

Para migrar los datos actuales de localStorage a Supabase, puedes crear un script de migración:

\`\`\`typescript
import { supabase } from './lib/supabase'
import { exportAllData } from './lib/data-service'

async function migrateToSupabase() {
  // Obtener todos los datos actuales
  const allData = JSON.parse(exportAllData())
  
  // Migrar equipos
  for (const team of allData.teams) {
    await supabase.from('teams').upsert({
      id: team.id,
      name: team.name,
      logo: team.logo,
      group: team.group,
    })
  }
  
  // Migrar jugadores
  for (const player of allData.players) {
    await supabase.from('players').upsert({
      id: player.id,
      name: player.name,
      number: player.number,
      position: player.position,
      team_id: player.teamId,
    })
    
    // Migrar estadísticas de jugadores
    if (player.stats) {
      await supabase.from('player_stats').upsert({
        player_id: player.id,
        goals: player.stats.goals || 0,
        assists: player.stats.assists || 0,
        yellow_cards: player.stats.yellowCards || 0,
        red_cards: player.stats.redCards || 0,
      })
    }
  }
  
  // Migrar partidos
  for (const match of allData.matches) {
    await supabase.from('matches').upsert({
      id: match.id,
      home_team_id: match.homeTeamId,
      away_team_id: match.awayTeamId,
      date: match.date,
      time: match.time,
      venue: match.venue,
      status: match.status,
      phase: match.phase,
      group: match.group,
      home_score: match.score?.home || 0,
      away_score: match.score?.away || 0,
    })
    
    // Migrar eventos de partidos
    if (match.events) {
      for (const event of match.events) {
        await supabase.from('match_events').upsert({
          id: event.id,
          match_id: match.id,
          player_id: event.playerId,
          assist_player_id: event.assistPlayerId,
          team_id: event.teamId,
          type: event.type,
          minute: event.minute,
        })
      }
    }
  }
  
  console.log('Migración completada')
}

migrateToSupabase()
\`\`\`

## Paso 4: Actualizar el servicio de datos

Modifica `lib/data-service.ts` para usar Supabase en lugar de localStorage:

\`\`\`typescript
import { supabase } from './supabase'

// Funciones para equipos
export async function getAllTeams() {
  const { data, error } = await supabase.from('teams').select('*')
  if (error) {
    console.error('Error fetching teams:', error)
    return []
  }
  return data
}

export async function getTeamById(id) {
  const { data, error } = await supabase.from('teams').select('*').eq('id', id).single()
  if (error) {
    console.error(`Error fetching team ${id}:`, error)
    return null
  }
  return data
}

// Implementa el resto de funciones de manera similar
\`\`\`

## Consideraciones sobre el Backend

### Funcionalidades que requieren un backend

1. **Envío de correos electrónicos**: Para enviar invitaciones, notificaciones, etc., necesitarás un backend o un servicio de terceros como SendGrid, Mailchimp, etc.

2. **Autenticación avanzada**: Aunque Supabase proporciona autenticación, para casos más complejos podrías necesitar un backend personalizado.

3. **Procesamiento de imágenes**: Si necesitas manipular imágenes (redimensionar, optimizar), un backend sería útil.

4. **Webhooks y integraciones**: Para integraciones con servicios externos que requieren webhooks.

5. **Tareas programadas**: Para ejecutar tareas periódicas como actualizaciones de clasificaciones, envío de recordatorios, etc.

### Opciones de Backend

1. **Serverless Functions (Vercel/Netlify)**: Ideal para operaciones simples sin necesidad de un servidor completo.

2. **API Routes de Next.js**: Puedes usar las rutas API de Next.js para funciones de backend simples.

3. **Backend dedicado**: Para aplicaciones más complejas, un backend dedicado con Node.js, Express, etc.

4. **Supabase Functions**: Supabase ofrece funciones Edge que pueden servir como backend para muchas operaciones.

## Conclusión

Con Supabase, puedes implementar la mayoría de las funcionalidades de tu aplicación sin necesidad de un backend dedicado. Sin embargo, para ciertas operaciones como el envío de correos electrónicos, es recomendable usar servicios especializados o implementar un backend simple.

Para más información, consulta la [documentación oficial de Supabase](https://supabase.com/docs).
