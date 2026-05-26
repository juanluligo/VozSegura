const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Institucion = require('./models/Institucion');
const Facultad = require('./models/Facultad');

const seed = async () => {
    try {
        // Conectar a MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✓ Conectado a MongoDB');

        // Crear institución genérica
        let institucion = await Institucion.findOne();
        if (!institucion) {
            institucion = await Institucion.create({
                nombre: 'Institución Educativa',
                ciudad: 'Colombia',
                pais: 'Colombia'
            });
            console.log('✓ Institución genérica creada');
        } else {
            console.log('✓ Institución ya existe');
        }

        // Crear solo facultades
        const facultades = [
            { nombre: 'Facultad de Medicina', institucion_id: institucion._id },
            { nombre: 'Facultad de Ingeniería', institucion_id: institucion._id },
            { nombre: 'Facultad de Derecho', institucion_id: institucion._id },
            { nombre: 'Facultad de Economía', institucion_id: institucion._id },
            { nombre: 'Facultad de Ciencias', institucion_id: institucion._id },
            { nombre: 'Facultad de Humanidades', institucion_id: institucion._id },
            { nombre: 'Facultad de Artes', institucion_id: institucion._id },
            { nombre: 'Facultad de Educación', institucion_id: institucion._id }
        ];

        await Facultad.insertMany(facultades);
        console.log('✓ Facultades creadas:', facultades.length);

        console.log('\n✓ Base de datos poblada con éxito');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

seed();
