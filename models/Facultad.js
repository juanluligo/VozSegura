const mongoose = require('mongoose');

const facultadSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre de la facultad es requerido'],
        trim: true
    },
    institucion_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Institucion',
        required: true
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

facultadSchema.statics.crear = async function (datos) {
    const { nombre, institucion_id } = datos;
    const fac = await this.create({ nombre, institucion_id });
    return { id: fac._id, nombre: fac.nombre, institucion_id: fac.institucion_id };
};

facultadSchema.statics.obtenerTodas = async function () {
    const lista = await this.find({ activa: true })
        .populate('institucion_id', 'nombre ciudad')
        .sort({ nombre: 1 }).lean();
    return lista.map(f => ({
        ...f,
        id: f._id,
        institucion_nombre: f.institucion_id?.nombre,
        ciudad: f.institucion_id?.ciudad
    }));
};

facultadSchema.statics.obtenerPorInstitucion = async function (institucionId) {
    const lista = await this.find({ institucion_id: institucionId, activa: true }).sort({ nombre: 1 }).lean();
    return lista.map(f => ({ ...f, id: f._id }));
};

facultadSchema.statics.buscarPorId = async function (id) {
    const fac = await this.findById(id).populate('institucion_id', 'nombre ciudad').lean();
    if (!fac) return null;
    return {
        ...fac,
        id: fac._id,
        institucion_nombre: fac.institucion_id?.nombre,
        ciudad: fac.institucion_id?.ciudad
    };
};

facultadSchema.statics.obtenerEstadisticas = async function (id) {
    const Denuncia = require('./Denuncia');
    const total = await Denuncia.countDocuments({ facultad_id: id });
    const porEstado = await Denuncia.aggregate([
        { $match: { facultad_id: new mongoose.Types.ObjectId(id) } },
        { $group: { _id: '$estado', cantidad: { $sum: 1 } } }
    ]);
    return { total, porEstado };
};

facultadSchema.statics.actualizar = async function (id, datos) {
    const { nombre, institucion_id, activa } = datos;
    const update = {};
    if (nombre !== undefined) update.nombre = nombre;
    if (institucion_id !== undefined) update.institucion_id = institucion_id;
    if (activa !== undefined) update.activa = activa;
    const fac = await this.findByIdAndUpdate(id, update, { new: true, runValidators: true })
        .populate('institucion_id', 'nombre ciudad').lean();
    return {
        ...fac,
        id: fac._id,
        institucion_nombre: fac.institucion_id?.nombre,
        ciudad: fac.institucion_id?.ciudad
    };
};

module.exports = mongoose.model('Facultad', facultadSchema);
