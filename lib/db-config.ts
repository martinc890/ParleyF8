// Este archivo permite cambiar fácilmente entre localStorage y MongoDB

// Importar servicios
import localStorageService from "./mongodb-service"
import mongoDBService from "./mongodb-service-real"

// Configuración: true para usar MongoDB, false para usar localStorage
const USE_MONGODB = true

// Exportar el servicio correspondiente
export default USE_MONGODB ? mongoDBService : localStorageService
