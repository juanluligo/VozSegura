const Denuncia = require('../models/Denuncia');
const Facultad = require('../models/Facultad');

// Crear nueva denuncia
// POST /api/denuncias
// @access  Private
exports.crearDenuncia = async (req, res) => {
    try {
        const { tipo, descripcion, fecha, gravedad, facultad_id } = req.body;

        // Validaciones básicas
        if (!tipo || !descripcion || !fecha || !facultad_id) {
            return res.status(400).json({
                success: false,
                message: 'Por favor proporciona todos los campos requeridos'
            });
        }

        // Verificar que la facultad existe
        const facultad = await Facultad.buscarPorId(facultad_id);
        if (!facultad) {
            return res.status(404).json({
                success: false,
                message: 'Facultad no encontrada'
            });
        }

        // Crear denuncia
        const denuncia = await Denuncia.crear({
            tipo,
            descripcion,
            fecha,
            gravedad: gravedad || 'media',
            usuario_id: req.usuario.id,
            facultad_id
        });

        res.status(201).json({
            success: true,
            message: 'Denuncia creada exitosamente',
            codigo: denuncia.codigo,
            denuncia
        });

    } catch (error) {
        console.error('Error al crear denuncia:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear la denuncia',
            error: error.message
        });
    }
};

// @desc    Consultar denuncia por código
// @route   GET /api/denuncias/consultar/:codigo
// @access  Public
exports.consultarDenuncia = async (req, res) => {
    try {
        const { codigo } = req.params;

        const denuncia = await Denuncia.buscarPorCodigo(codigo);

        if (!denuncia) {
            return res.status(404).json({
                success: false,
                message: 'Denuncia no encontrada'
            });
        }

        res.status(200).json({
            success: true,
            denuncia
        });

    } catch (error) {
        console.error('Error al consultar denuncia:', error);
        res.status(500).json({
            success: false,
            message: 'Error al consultar la denuncia',
            error: error.message
        });
    }
};

// @desc    Obtener denuncias del usuario
// @route   GET /api/denuncias/mis-denuncias
// @access  Private
exports.misDenuncias = async (req, res) => {
    try {
        const denuncias = await Denuncia.obtenerPorUsuario(req.usuario.id);

        res.status(200).json({
            success: true,
            total: denuncias.length,
            denuncias
        });

    } catch (error) {
        console.error('Error al obtener denuncias:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener las denuncias',
            error: error.message
        });
    }
};

// @desc    Obtener todas las denuncias (con filtros)
// @route   GET /api/denuncias
// @access  Private (admin)
exports.obtenerDenuncias = async (req, res) => {
    try {
        const { estado, gravedad, facultad_id, limite } = req.query;

        const filtros = {};
        if (estado) filtros.estado = estado;
        if (gravedad) filtros.gravedad = gravedad;
        if (facultad_id) filtros.facultad_id = facultad_id;
        if (limite) filtros.limite = limite;

        const denuncias = await Denuncia.obtenerTodas(filtros);

        res.status(200).json({
            success: true,
            total: denuncias.length,
            denuncias
        });

    } catch (error) {
        console.error('Error al obtener denuncias:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener las denuncias',
            error: error.message
        });
    }
};

// @desc    Obtener denuncia por ID
// @route   GET /api/denuncias/:id
// @access  Private
exports.obtenerDenuncia = async (req, res) => {
    try {
        const { id } = req.params;

        const denuncia = await Denuncia.buscarPorId(id);

        if (!denuncia) {
            return res.status(404).json({
                success: false,
                message: 'Denuncia no encontrada'
            });
        }

        // Verificar permisos: solo el usuario que creó la denuncia o un admin
        if (req.usuario.tipo !== 'admin' && denuncia.usuario_id !== req.usuario.id) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permiso para ver esta denuncia'
            });
        }

        res.status(200).json({
            success: true,
            denuncia
        });

    } catch (error) {
        console.error('Error al obtener denuncia:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener la denuncia',
            error: error.message
        });
    }
};

// @desc    Actualizar estado de denuncia
// @route   PUT /api/denuncias/:id/estado
// @access  Private (admin)
exports.actualizarEstado = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado, comentario } = req.body;

        if (!estado) {
            return res.status(400).json({
                success: false,
                message: 'Por favor proporciona el nuevo estado'
            });
        }

        const denuncia = await Denuncia.actualizarEstado(
            id,
            req.usuario.id,
            estado,
            comentario || ''
        );

        res.status(200).json({
            success: true,
            message: 'Estado actualizado exitosamente',
            denuncia
        });

    } catch (error) {
        console.error('Error al actualizar estado:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar el estado',
            error: error.message
        });
    }
};

// @desc    Actualizar denuncia
// @route   PUT /api/denuncias/:id
// @access  Private
exports.actualizarDenuncia = async (req, res) => {
    try {
        const { id } = req.params;
        const { tipo, descripcion, fecha, gravedad, facultad_id } = req.body;

        const denunciaExistente = await Denuncia.buscarPorId(id);

        if (!denunciaExistente) {
            return res.status(404).json({
                success: false,
                message: 'Denuncia no encontrada'
            });
        }

        // Verificar permisos
        if (req.usuario.tipo !== 'admin' && denunciaExistente.usuario_id !== req.usuario.id) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permiso para actualizar esta denuncia'
            });
        }

        const denuncia = await Denuncia.actualizar(id, {
            tipo,
            descripcion,
            fecha,
            gravedad,
            facultad_id
        });

        res.status(200).json({
            success: true,
            message: 'Denuncia actualizada exitosamente',
            denuncia
        });

    } catch (error) {
        console.error('Error al actualizar denuncia:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar la denuncia',
            error: error.message
        });
    }
};

// @desc    Registrar atención
// @route   POST /api/denuncias/:id/atencion
// @access  Private (admin)
exports.registrarAtencion = async (req, res) => {
    try {
        const { id } = req.params;
        const { tipo_atencion, modalidad, descripcion } = req.body;

        const denuncia = await Denuncia.buscarPorId(id);

        if (!denuncia) {
            return res.status(404).json({
                success: false,
                message: 'Denuncia no encontrada'
            });
        }

        await Denuncia.registrarAtencion({
            denuncia_id: id,
            usuario_id: denuncia.usuario_id,
            admin_id: req.usuario.id,
            tipo_atencion,
            modalidad: modalidad || 'virtual',
            descripcion
        });

        res.status(200).json({
            success: true,
            message: 'Atención registrada exitosamente'
        });

    } catch (error) {
        console.error('Error al registrar atención:', error);
        res.status(500).json({
            success: false,
            message: 'Error al registrar la atención',
            error: error.message
        });
    }
};

// @desc    Asignar recursos a denuncia
// @route   POST /api/denuncias/:id/recursos
// @access  Private (admin)
exports.asignarRecursos = async (req, res) => {
    try {
        const { id } = req.params;
        const { recursos_ids } = req.body;

        if (!recursos_ids || !Array.isArray(recursos_ids)) {
            return res.status(400).json({
                success: false,
                message: 'Por favor proporciona un arreglo de IDs de recursos'
            });
        }

        await Denuncia.asignarRecursos(id, recursos_ids);

        res.status(200).json({
            success: true,
            message: 'Recursos asignados exitosamente'
        });

    } catch (error) {
        console.error('Error al asignar recursos:', error);
        res.status(500).json({
            success: false,
            message: 'Error al asignar recursos',
            error: error.message
        });
    }
};

// @desc    Obtener estadísticas generales
// @route   GET /api/denuncias/estadisticas/general
// @access  Private (admin)
exports.obtenerEstadisticas = async (req, res) => {
    try {
        const estadisticas = await Denuncia.obtenerEstadisticas();

        res.status(200).json({
            success: true,
            estadisticas
        });

    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener estadísticas',
            error: error.message
        });
    }
};

// @desc    Eliminar denuncia
// @route   DELETE /api/denuncias/:id
// @access  Private (admin)
exports.eliminarDenuncia = async (req, res) => {
    try {
        const { id } = req.params;

        const denuncia = await Denuncia.buscarPorId(id);

        if (!denuncia) {
            return res.status(404).json({
                success: false,
                message: 'Denuncia no encontrada'
            });
        }

        await Denuncia.eliminar(id);

        res.status(200).json({
            success: true,
            message: 'Denuncia eliminada exitosamente'
        });

    } catch (error) {
        console.error('Error al eliminar denuncia:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar la denuncia',
            error: error.message
        });
    }
};
