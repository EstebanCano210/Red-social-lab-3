import { response, request } from "express";
import Publication from '../Publication/publication.model.js';

export const getPublications = async (req = request, res = response) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = { estado: true };

        const [total, publications] = await Promise.all([
            Publication.countDocuments(query),
            Publication.find(query)
                .populate('category', 'name')
                .populate('author', 'username')
                .skip(Number(desde))
                .limit(Number(limite))
        ]);

        res.status(200).json({
            success: true,
            total,
            publications
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener publicaciones',
            error
        });
    }
};

export const createPublication = async (req, res) => {
    try {
        const { title, category, content } = req.body;
        const author = req.user?.uid;

        if (!author) {
            return res.status(400).json({
                success: false,
                msg: 'El usuario no está autenticado correctamente',
            });
        }

        const publication = new Publication({ title, category, content, author });

        await publication.save();

        res.status(201).json({
            success: true,
            msg: 'Publicación creada exitosamente',
            publication
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: 'Error al crear publicación',
            error
        });
    }
};

export const updatePublication = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, category, content } = req.body;

        const publication = await Publication.findById(id);

        if (!publication) {
            return res.status(404).json({
                success: false,
                msg: "Publicación no encontrada",
            });
        }

        if (publication.author.toString() !== req.user.uid.toString()) {
            return res.status(403).json({
                success: false,
                msg: "No tienes permisos para editar esta publicación",
            });
        }

        publication.title = title || publication.title;
        publication.category = category || publication.category;
        publication.content = content || publication.content;

        await publication.save();

        res.status(200).json({
            success: true,
            msg: "Publicación actualizada",
            publication,
        });
    } catch (error) {
        console.error("❌ Error al actualizar publicación:", error.message);
        res.status(500).json({
            success: false,
            msg: "Error al actualizar publicación",
            error,
        });
    }
};

export const deletePublication = async (req, res) => {
    try {
        const { id } = req.params;

        const publication = await Publication.findById(id);

        if (!publication) {
            return res.status(404).json({
                success: false,
                msg: "Publicación no encontrada",
            });
        }

        if (publication.author.toString() !== req.user.uid.toString()) {
            return res.status(403).json({
                success: false,
                msg: "No tienes permisos para eliminar esta publicación",
            });
        }

        await Publication.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            msg: "Publicación eliminada con exito",
        });
    } catch (error) {
        console.error("Error al eliminar publicación:", error.message);
        res.status(500).json({
            success: false,
            msg: "Error al eliminar publicación",
            error,
        });
    }
};