const sql = require('mssql');
const express = require('express');
const cors = require('cors');
// Configuración de la conexión

const port = process.env.PORT || 8000;
const config = {
    user: 'server_db',
    password: 'servidor-123',
    server: 'local-sopes.database.windows.net',
    database: 'sopes_db',
    port: 1433,
    options: {
        encrypt: true // Usar cifrado para conexiones con Azure
    }
};
const app = express();
app.use(cors({
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
}));
  app.use(express.json());

app.post('/Login', (req, res) => {
        const jsonData = req.body;
        console.log(jsonData);
        const {usuario , contrasena  }= jsonData;
        //castear contraseña a string

        const pool = new sql.ConnectionPool(config);

        pool.connect().then(() => {
            const consult = `SELECT CASE WHEN COUNT(*) > 0 THEN 1 ELSE 0 END AS credcorrectas FROM Usuarios WHERE Nombre = '${usuario}' AND Contraseña = '${contrasena}';`;
            return pool.request().query(consult);
        }).then(result => {
            pool.close();
            return res.json(result.recordset);
        }).catch(err => {
            console.error('Error de conexión', err);
        });
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
})