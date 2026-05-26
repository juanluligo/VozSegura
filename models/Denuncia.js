const mongoose = require('mongoose');

const archivoSchema = new mongoose.Schema({
    nombre: String,
    tipo: String,
    ruta: String,
    tamano_kb: Number,
    fecha: {
        type: Date,
        default: Date.now
    }
});

const seguimientoSchema = new mongoose.Schema({
    admin_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    admin_nombre: String,
    estado: String,
    comentario: String,
    fecha: {
        type: Date,
        default: Date.now
    }
});

const denunciaSchema = new mongoose.Schema({
    codigo: {
        type: String,
        unique: true,
        index: true
    },
    tipo: {
        type: String,
        required: [true, 'El tipo de denuncia es requerido'],
        enum: ['acoso', 'discriminacion', 'violencia_fisica', 'abuso', 'otro']
    },
    descripcion: {
        type: String,
        required: [true, 'La descripción es requerida']
    },
    fecha: {
        type: Date,
        required: true
    },
    gravedad: {
        type: String,
        enum: ['baja', 'media', 'alta', 'critica'],
        default: 'media'
    },
    estado: {
        type: String,
        enum: ['recibida', 'en_proceso', 'resuelta', 'archivada'],
        default: 'recibida'
    },
    usuario_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        default: null
    },
    facultad_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Facultad',
        required: true
    },
    archivos: [archivoSchema],
    seguimiento: [seguimientoSchema],
    recursos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recurso'
    }],
    fecha_creacion: {
        type: Date,
        default: Date.now
    },
    fecha_actualizacion: {
        type: Date,
        default: Date.now
    }
});

// Generar código único antes de guardar
denunciaSchema.pre('save', async function (next) {
    if (!this.codigo) {
        const d = new Date();
        const random = Math.floor(Math.random() * 10000);
        this.codigo = `DEN-${d.getFullYear()}${(d.getMonth() + 1).toString().padStart(2, '0')}${random.toString().padStart(4, '0')}`;
    }
    this.fecha_actualizacion = new Date();
    next();
});

// Helper para poblar denuncia completa
async function poblarDenuncia(denuncia) {
    if (!denuncia) return null;
    const populated = await denuncia.populate([
        { path: 'facultad_id', populate: { path: 'institucion_id', select: 'nombre ciudad' } },
        { path: 'usuario_id', select: 'nombre email' },
        { path: 'recursos' }
    ]);
    const obj = populated.toObject();
    return {
        ...obj,
        id: obj._id,
        usuario_nombre: obj.usuario_id?.nombre || null,
        usuario_email: obj.usuario_id?.email || null,
        facultad_nombre: obj.facultad_id?.nombre || null,
        institucion_nombre: obj.facultad_id?.institucion_id?.nombre || null,
        institucion_ciudad: obj.facultad_id?.institucion_id?.ciudad || null
    };
}

// Métodos estáticos con la misma interfaz que el modelo MySQL anterior

denunciaSchema.statics.crear = async function (datos) {
    const { tipo, descripcion, fecha, gravedad, usuario_id, facultad_id } = datos;
    const den = new this({ tipo, descripcion, fecha, gravedad: gravedad || 'media', usuario_id: usuario_id || null, facultad_id });
    await den.save();
    return {
        id: den._id,
        codigo: den.codigo,
        tipo: den.tipo,
        descripcion: den.descripcion,
        fecha: den.fecha,
        estado: den.estado,
        gravedad: den.gravedad
    };
};

denunciaSchema.statics.obtenerPorUsuario = async function (usuario_id) {
    const lista = await this.find({ usuario_id })
        .populate('facultad_id', 'nombre')
        .sort({ fecha_creacion: -1 }).lean();
    return lista.map(d => ({ ...d, id: d._id, facultad_nombre: d.facultad_id?.nombre }));
};

denunciaSchema.statics.buscarPorId = async function (id) {
    const den = await this.findById(id);
    return await poblarDenuncia(den);
};

denunciaSchema.statics.buscarPorCodigo = async function (codigo) {
    const den = await this.findOne({ codigo });
    return await poblarDenuncia(den);
};

denunciaSchema.statics.obtenerTodas = async function (filtros = {}) {
    const query = {};
    if (filtros.estado) query.estado = filtros.estado;
    if (filtros.gravedad) query.gravedad = filtros.gravedad;
    if (filtros.facultad_id) query.facultad_id = filtros.facultad_id;

    let q = this.find(query)
        .populate('facultad_id', 'nombre')
        .populate('usuario_id', 'nombre email')
        .sort({ fecha_creacion: -1 });

    if (filtros.limite) q = q.limit(parseInt(filtros.limite));

    const lista = await q.lean();
    return lista.map(d => ({
        ...d,
        id: d._id,
        facultad_nombre: d.facultad_id?.nombre,
        usuario_nombre: d.usuario_id?.nombre || null
    }));
};

denunciaSchema.statics.actualizarEstado = async function (id, admin_id, nuevo_estado, comentario) {
    // Obtener nombre del admin
    const Usuario = require('./Usuario');
    const admin = await Usuario.findById(admin_id).lean();
    const admin_nombre = admin ? admin.nombre : 'Administrador';

    const den = await this.findByIdAndUpdate(
        id,
        {
            estado: nuevo_estado,
            fecha_actualizacion: new Date(),
            $push: {
                seguimiento: {
                    admin_id,
                    admin_nombre,
                    estado: nuevo_estado,
                    comentario: comentario || ''
                }
            }
        },
        { new: true }
    );
    return await poblarDenuncia(den);
};

denunciaSchema.statics.actualizar = async function (id, datos) {
    const { tipo, descripcion, fecha, gravedad, facultad_id } = datos;
    const update = { fecha_actualizacion: new Date() };
    if (tipo !== undefined) update.tipo = tipo;
    if (descripcion !== undefined) update.descripcion = descripcion;
    if (fecha !== undefined) update.fecha = fecha;
    if (gravedad !== undefined) update.gravedad = gravedad;
    if (facultad_id !== undefined) update.facultad_id = facultad_id;

    const den = await this.findByIdAndUpdate(id, update, { new: true });
    return await poblarDenuncia(den);
};

denunciaSchema.statics.agregarArchivo = async function (denuncia_id, archivo) {
    const { nombre_original, ruta, tipo, tamaño } = archivo;
    const tamano_kb = tamaño ? Math.round(tamaño / 1024) : 0;

    await this.findByIdAndUpdate(denuncia_id, {
        $push: {
            archivos: { nombre: nombre_original, tipo, ruta, tamano_kb }
        }
    });
    return { nombre: nombre_original, tipo, ruta, tamano_kb };
};

denunciaSchema.statics.obtenerArchivos = async function (denuncia_id) {
    const den = await this.findById(denuncia_id).select('archivos').lean();
    if (!den) return [];
    return den.archivos.map(a => ({
        ...a,
        id: a._id,
        nombre_original: a.nombre,
        fecha_subida: a.fecha
    }));
};

denunciaSchema.statics.asignarRecursos = async function (denuncia_id, recursos_ids) {
    await this.findByIdAndUpdate(denuncia_id, {
        $addToSet: { recursos: { $each: recursos_ids } }
    });
    return { mensaje: 'Recursos asignados exitosamente' };
};

denunciaSchema.statics.registrarAtencion = async function (datos) {
    const { denuncia_id, admin_id, tipo_atencion, modalidad, descripcion } = datos;
    const comentario = `[Atención ${tipo_atencion} - ${modalidad || 'virtual'}] ${descripcion || ''}`;
    const den = await this.findById(denuncia_id);
    if (!den) throw new Error('Denuncia no encontrada');

    const Usuario = require('./Usuario');
    const admin = await Usuario.findById(admin_id).lean();
    const admin_nombre = admin ? admin.nombre : 'Administrador';

    await this.findByIdAndUpdate(denuncia_id, {
        $push: {
            seguimiento: {
                admin_id,
                admin_nombre,
                estado: den.estado,
                comentario
            }
        },
        fecha_actualizacion: new Date()
    });
    return { mensaje: 'Atención registrada exitosamente' };
};

denunciaSchema.statics.obtenerEstadisticas = async function () {
    const [total, porEstado, porGravedad, porTipo] = await Promise.all([
        this.countDocuments(),
        this.aggregate([{ $group: { _id: '$estado', cantidad: { $sum: 1 } } }]),
        this.aggregate([{ $group: { _id: '$gravedad', cantidad: { $sum: 1 } } }]),
        this.aggregate([{ $group: { _id: '$tipo', cantidad: { $sum: 1 } } }])
    ]);

    const estadisticas = { total };
    porEstado.forEach(e => { estadisticas[`estado_${e._id}`] = e.cantidad; });
    porGravedad.forEach(g => { estadisticas[`gravedad_${g._id}`] = g.cantidad; });
    porTipo.forEach(t => { estadisticas[`tipo_${t._id}`] = t.cantidad; });
    return estadisticas;
};

denunciaSchema.statics.eliminar = async function (id) {
    await this.findByIdAndDelete(id);
    return { mensaje: 'Denuncia eliminada exitosamente' };
};

module.exports = mongoose.model('Denuncia', denunciaSchema);
