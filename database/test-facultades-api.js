const fetch = require('node-fetch');

async function probarAPI() {
    console.log(' Probando API de facultades...\n');
    
    try {
        const response = await fetch('http://localhost:3000/api/catalogo/facultades');
        const data = await response.json();
        
        console.log('📡 Respuesta del servidor:');
        console.log(JSON.stringify(data, null, 2));
        console.log('\n');
        
        if (data.success && data.facultades) {
            console.log(` ${data.facultades.length} facultades encontradas:\n`);
            data.facultades.forEach((fac, index) => {
                console.log(`${index + 1}. ${fac.nombre} (ID: ${fac.id})`);
            });
        } else if (Array.isArray(data)) {
            console.log(` ${data.length} facultades encontradas:\n`);
            data.forEach((fac, index) => {
                console.log(`${index + 1}. ${fac.nombre} (ID: ${fac.id})`);
            });
        } else {
            console.log(' Formato de respuesta inesperado');
        }
        
    } catch (error) {
        console.error('Error:', error.message);
        console.log('\n Asegúrate de que el servidor esté corriendo en http://localhost:3000');
    }
}

probarAPI();
