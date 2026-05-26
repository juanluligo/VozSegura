const mongoose = require('mongoose');

const recursoSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: [true, 'El título del recurso es requerido'],
        trim: true
    },
    descripcion: {
        type: String,
        required: [true, 'La descripción del recurso es requerida']
    },
    url: {
        type: String,
        required: [true, 'La URL del recurso es requerida']
    },
    activo: {
        type: Boolean,
        default: true
    },
    fecha_creacion: {
        type: Date,
        default: Date.now
    }
});

// Métodos estáticos con la misma interfaz que el modelo MySQL anterior

recursoSchema.statics.crear = async function (datos) {
    const { titulo, descripcion, url } = datos;
    const rec = await this.create({ titulo, descripcion, url });
    return { id: rec._id, titulo: rec.titulo, descripcion: rec.descripcion, url: rec.url };
};

recursoSchema.statics.obtenerTodos = async function () {
    const lista = await this.find({ activo: true }).sort({ titulo: 1 }).lean();
    return lista.map(r => ({ ...r, id: r._id }));
};

recursoSchema.statics.buscarPorId = async function (id) {
    const rec = await this.findById(id).lean();
    if (!rec) return null;
    return { ...rec, id: rec._id };
};

recursoSchema.statics.actualizar = async function (id, datos) {
    const { titulo, descripcion, url, activo } = datos;
    const update = {};
    if (titulo !== undefined) update.titulo = titulo;
    if (descripcion !== undefined) update.descripcion = descripcion;
    if (url !== undefined) update.url = url;
    if (activo !== undefined) update.activo = activo;
    const rec = await this.findByIdAndUpdate(id, update, { new: true, runValidators: true }).lean();
    return { ...rec, id: rec._id };
};

module.exports = mongoose.model('Recurso', recursoSchema);
