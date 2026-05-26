const mongoose = require('mongoose');

const institucionSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre de la institución es requerido'],
        trim: true,
        unique: true
    },
    ciudad: {
        type: String,
        required: [true, 'La ciudad es requerida'],
        trim: true
    },
    activa: {
        type: Boolean,
        default: true
    },
    fecha_creacion: {
        type: Date,
        default: Date.now
    }
});

// Métodos estáticos con la misma interfaz que el modelo MySQL anterior

institucionSchema.statics.crear = async function (datos) {
    const { nombre, ciudad } = datos;
    const inst = await this.create({ nombre, ciudad });
    return { id: inst._id, nombre: inst.nombre, ciudad: inst.ciudad };
};

institucionSchema.statics.obtenerTodas = async function () {
    const lista = await this.find({ activa: true }).sort({ nombre: 1 }).lean();
    return lista.map(i => ({ ...i, id: i._id }));
};

institucionSchema.statics.buscarPorId = async function (id) {
    const inst = await this.findById(id).lean();
    if (!inst) return null;
    return { ...inst, id: inst._id };
};

institucionSchema.statics.obtenerFacultades = async function (id) {
    const Facultad = require('./Facultad');
    return await Facultad.obtenerPorInstitucion(id);
};

institucionSchema.statics.actualizar = async function (id, datos) {
    const { nombre, ciudad } = datos;
    const update = {};
    if (nombre !== undefined) update.nombre = nombre;
    if (ciudad !== undefined) update.ciudad = ciudad;
    const inst = await this.findByIdAndUpdate(id, update, { new: true, runValidators: true }).lean();
    return { ...inst, id: inst._id };
};

module.exports = mongoose.model('Institucion', institucionSchema);
