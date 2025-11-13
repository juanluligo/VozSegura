#🎯VozSegura-SistemadeDenuncias

Plataformacompletadedenunciascon**React+Express+MySQL**,autenticaciónJWTygestiónadministrativa.


**ElfrontendhasidocompletamentemigradoaReact**manteniendotodalafuncionalidadoriginal.

-🚀**Frontend:**ReactconVite
-🟢**Backend:**Express+Node.js
-🗄️**BasedeDatos:**MySQL

##✅SistemaCompletamenteFuncional

###🚀CaracterísticasPrincipales

✅**RegistroyLogin**deusuariosyadministradores
✅**Sistemadedenuncias**concódigoúnicoautomático
✅**Seguimientocompleto**dedenunciasconhistorial
✅**Atenciones**(psicológica,legal,social)
✅**Recursosdeayuda**asignablesadenuncias
✅**Estadísticas**entiemporeal
✅**Procedimientosalmacenados**yvistasoptimizadas

---

##�InicioRápido

###1.ConfigurarBasedeDatosMySQL

**Actualizatucontraseñaen`.env`:**
```env
DB_PASSWORD=tu_contraseña_mysql
```

**EjecutaelscriptSQL:**
```powershell
#Opción1:Setupautomático
nodedatabase/setup-database.js

#Opción2:Manual
mysql-uroot-p<database/schema.sql
```

###2.ProbarConexión

```powershell
nodedatabase/test-connection.js
```

###3.IniciarServidor

```powershell
npmstart
```

Abre:http://localhost:3000

---

##🔑CredencialesIniciales

**Administrador:**
-Email:`admin@vozsegura.com`
-Password:`Admin123!`


---

##🧪PruebasRápidas(PowerShell)

###1.RegistrarUsuario
```powershell
$body=@{
nombre="JuanPérez"
email="juan@ejemplo.com"
password="123456"
}|ConvertTo-Json

$response=Invoke-RestMethod-Uri"http://localhost:3000/api/auth/registro"-MethodPOST-Body$body-ContentType"application/json"
$token=$response.token
```

###2.CrearDenuncia
```powershell
$headers=@{Authorization="Bearer$token";"Content-Type"="application/json"}
$denuncia=@{
tipo="Acosoverbal"
descripcion="Descripcióndeladenuncia"
fecha="2024-10-14"
gravedad="media"
facultad_id=1
}|ConvertTo-Json

$res=Invoke-RestMethod-Uri"http://localhost:3000/api/denuncias"-MethodPOST-Headers$headers-Body$denuncia
Write-Host"Código:$($res.codigo)"
```

###3.LoginAdmin
```powershell
$body=@{
email="admin@vozsegura.com"
password="Admin123!"
}|ConvertTo-Json

$admin=Invoke-RestMethod-Uri"http://localhost:3000/api/auth/admin/login"-MethodPOST-Body$body-ContentType"application/json"
$adminToken=$admin.token
```

---

##📡APIEndpoints

**Verdocumentacióncompletaen:**`API-DOCS.md`

###PrincipalesEndpoints

**Autenticación:**
-`POST/api/auth/registro`-Registrarusuario
-`POST/api/auth/login`-Loginusuario
-`POST/api/auth/admin/login`-Loginadmin

**Denuncias:**
-`POST/api/denuncias`-Creardenuncia
-`GET/api/denuncias/mis-denuncias`-Misdenuncias
-`GET/api/denuncias/consultar/:codigo`-Consultarporcódigo
-`GET/api/denuncias`-Todas(admin)
-`PUT/api/denuncias/:id/estado`-Actualizarestado(admin)

**Catálogo:**
-`GET/api/catalogo/instituciones`-Listarinstituciones
-`GET/api/catalogo/facultades`-Listarfacultades
-`GET/api/catalogo/recursos`-Recursosdeayuda

---

##📊BasedeDatos

###Tablas(12)
-`usuarios`,`administradores`,`denuncias`,`instituciones`,`facultades`
-`recursos`,`archivos`,`seguimiento_denuncia`,`atenciones`
-`log_accion`,`orientacion`,`denuncia_recurso`

###ProcedimientosAlmacenados(7)
-`sp_crear_denuncia`-Crearconcódigoúnico
-`sp_actualizar_estado_denuncia`-Cambiarestado+seguimiento
-`sp_registrar_atencion`-Registraratención
-`sp_obtener_denuncias_usuario`-Denunciasdeusuario
-`sp_estadisticas_generales`-Dashboard
-Ymás...

###Vistas(6)
-`vista_denuncias_completas`
-`vista_estadisticas_estado`
-`vista_denuncias_recientes`
-Ymás...

---

##📁EstructuradelProyecto

```
VozSegura/
├──client/#⚛️FrontendReact
│├──src/
││├──components/#ComponentesReact
││├──services/#APIservices
││└──App.jsx#Appprincipal
│├──public/assets/#Imágenes
│└──package.json#Dependenciasfrontend
├──config/
│└──database.js#ConexiónMySQL
├──models/#Modelosdedatos
├──controllers/#Lógicadenegocio
├──routes/#RutasAPI
├──middleware/#AutenticaciónJWT
├──database/#ScriptsSQL
├──assets/#Imágenesdelservidor
├──.env#Configuración
├──server.js#ServidorExpress
├──README.md#Estearchivo
├──API-DOCS.md#DocumentaciónAPI
└──ESTRUCTURA-PROYECTO.md#Documentacióncompleta
```



---

##🔧SolucióndeProblemas

**ErrordeconexiónMySQL:**
```powershell
#Verificarservicio
Get-ServiceMySQL*

#Reiniciarsiesnecesario
Restart-ServiceMySQL
```

**Tablasnoexisten:**
```powershell
nodedatabase/setup-database.js
```

**Módulosnoencontrados:**
```powershell
npminstall
```

---

##🎯DatosIniciales

-✅5Institucioneseducativas
-✅9Facultades
-✅6Recursosdeayuda(líneas,sitiosweb)
-✅1Administrador

---

##🔐Seguridad

-✅Passwordshasheados(bcrypt)
-✅JWTconexpiración
-✅Preparedstatements(SQLinjectionprotection)
-✅Middlewaredeautorización
-✅Logsdeauditoría

---

##�Documentación

-**README.md**-Estearchivo(iniciorápido)
-**API-DOCS.md**-DocumentacióncompletadelaAPI

---
