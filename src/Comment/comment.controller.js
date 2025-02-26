import { response, request } from "express";
import Comment from '../Comment/comment.model.js';

export const getComments = async (req = request, res = response) => {
    try {
        const { publicationId } = req.params;
        const query = { estado: true, publication: publicationId };

        const comments = await Comment.find(query)
            .populate('author', 'username');

        res.status(200).json({
            success: true,
            comments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener comentarios',
            error
        });
    }
};

export const createComment = async (req, res) => {
    try {
        const { content } = req.body;
        const { publicationId } = req.params;
        const author = req.user.uid;

        const comment = new Comment({ content, publication: publicationId, author });

        await comment.save();

        res.status(201).json({
            success: true,
            msg: 'Comentario creado exitosamente',
            comment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al crear comentario',
            error
        });
    }
};

export const updateComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;

        const comment = await Comment.findById(id);

        if (!comment) {
            return res.status(404).json({
                success: false,
                msg: 'Comentario no encontrado',
            });
        }


        if (comment.author.toString() !== req.user.uid.toString()) {
            return res.status(403).json({
                success: false,
                msg: 'No tienes permisos para editar este comentario',
            });
        }

        comment.content = content;
        await comment.save();

        res.status(200).json({
            success: true,
            msg: 'Comentario actualizado',
            comment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al actualizar comentario',
            error
        });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;

        const comment = await Comment.findById(id);

        if (!comment) {
            return res.status(404).json({
                success: false,
                msg: 'Comentario no encontrado',
            });
        }

        if (comment.author.toString() !== req.user.uid.toString()) {
            return res.status(403).json({
                success: false,
                msg: 'No tienes permisos para eliminar este comentario',
            });
        }

        await Comment.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            msg: 'Comentario eliminado correctamente',
        });
    } catch (error) {
        console.error('Error al eliminar el comentario:', error); 
        res.status(500).json({
            success: false,
            msg: 'Error al eliminar comentario',
            error: error.message, 
        });
    }
};
