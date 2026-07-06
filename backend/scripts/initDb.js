const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function initializeDatabase() {
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    port: parseInt(process.env.DB_PORT) || 3306
  };

  const dbName = process.env.DB_NAME || 'db_emprendecontrol';

  console.log(`🔌 Conectándose al servidor MySQL en ${dbConfig.host}:${dbConfig.port}...`);
  let connection;
  try {
    // 1. Conexión inicial sin seleccionar base de datos
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Conexión inicial al motor MySQL establecida.');

    // 2. Crear la base de datos si no existe
    console.log(`📂 Creando base de datos "${dbName}" si no existe...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    console.log(`✅ Base de datos "${dbName}" lista.`);
    await connection.end();

    // 3. Conexión seleccionando la base de datos creada
    dbConfig.database = dbName;
    connection = await mysql.createConnection(dbConfig);
    console.log(`🔌 Conectado a la base de datos "${dbName}".`);

    // 4. Leer el archivo SQL
    const sqlFilePath = path.join(__dirname, '..', '..', 'database', 'db_emprendecontrol.sql');
    console.log(`📄 Leyendo script SQL desde: ${sqlFilePath}`);
    if (!fs.existsSync(sqlFilePath)) {
      throw new Error(`El archivo SQL no existe en la ruta: ${sqlFilePath}`);
    }
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

    // 5. Separar y ejecutar cada sentencia del script SQL
    // Eliminamos los comentarios SQL y dividimos por el separador ";"
    const sqlStatements = sqlContent
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0 && !statement.startsWith('--'));

    console.log(`⚙️ Ejecutando ${sqlStatements.length} sentencias SQL para crear las tablas...`);
    for (const statement of sqlStatements) {
      // Ignorar líneas vacías o de comentarios que pudieran haberse filtrado
      if (statement) {
        await connection.query(statement);
      }
    }

    console.log('🎉 ¡Base de datos y tablas de EmprendeControl inicializadas con éxito en XAMPP!');
  } catch (error) {
    console.error('❌ Error durante la inicialización de la base de datos:', error.message);
    process.exit(1);
  } finally {
    if (connection && connection.end) {
      await connection.end();
      console.log('🔌 Conexión a la base de datos cerrada.');
    }
  }
}

initializeDatabase();
