const mongoose = require('mongoose');

const evidenciaSchema = new mongoose.Schema({
    denuncia_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Denuncia',
        required: true,
        index: true
    },
    nombre_original: {
        type: String,
        required: true
    },
    nombre_archivo: {
        type: String,
        required: true
    },
    tipo_mime: {
        type: String,
        required: true
    },
    tamaño: {
        type: Number,  // en bytes
        required: true
    },
    ruta: {
        type: String,
        required: true
    },
    descripcion: String,
    fecha_subida: {
        type: Date,
        default: Date.now,
        index: true
    }
});

// Métodos estáticos
evidenciaSchema.statics.crear = async function (datos) {
    const { denuncia_id, nombre_original, nombre_archivo, tipo_mime, tamaño, ruta, descripcion } = datos;
    const evidencia = await this.create({
        denuncia_id,
        nombre_original,
        nombre_archivo,
        tipo_mime,
        tamaño,
        ruta,
        descripcion
    });
    return {
        id: evidencia._id,
        denuncia_id: evidencia.denuncia_id,
        nombre_original: evidencia.nombre_original,
        nombre_archivo: evidencia.nombre_archivo,
        tipo_mime: evidencia.tipo_mime,
        tamaño: evidencia.tamaño,
        ruta: evidencia.ruta,
        fecha_subida: evidencia.fecha_subida
    };
};

evidenciaSchema.statics.obtenerPorDenuncia = async function (denuncia_id) {
    const lista = await this.find({ denuncia_id })
        .sort({ fecha_subida: -1 })
        .lean();
    return lista.map(e => ({
        ...e,
        id: e._id
    }));
};

evidenciaSchema.statics.obtenerPorId = async function (id) {
    const evidencia = await this.findById(id).lean();
    if (!evidencia) return null;
    return {
        ...evidencia,
        id: evidencia._id
    };
};

evidenciaSchema.statics.eliminar = async function (id) {
    await this.findByIdAndDelete(id);
    return { mensaje: 'Evidencia eliminada' };
};

evidenciaSchema.statics.obtenerTodas = async function () {
    const lista = await this.find()
        .populate('denuncia_id', 'codigo tipo')
        .sort({ fecha_subida: -1 })
        .lean();
    return lista.map(e => ({
        ...e,
        id: e._id
    }));
};

module.exports = mongoose.model('Evidencia', evidenciaSchema);
