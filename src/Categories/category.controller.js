import { response, request } from "express";
import Category from '../Categories/category.model.js';

export const getCategories = async (req = request, res = response) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = { estado: true };

        const [total, categories] = await Promise.all([
            Category.countDocuments(query),
            Category.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ]);

        res.status(200).json({
            success: true,
            total,
            categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener categorías',
            error
        });
    }
};

export const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        const category = new Category({ name, description });

        await category.save();

        res.status(201).json({
            success: true,
            msg: 'Categoría creada exitosamente',
            category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al crear categoría',
            error
        });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        const category = await Category.findByIdAndUpdate(
            id,
            { name, description },
            { new: true }
        );

        res.status(200).json({
            success: true,
            msg: 'Categoría actualizada',
            category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al actualizar categoría',
            error
        });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await Category.findByIdAndUpdate(
            id,
            { estado: false },
            { new: true }
        );

        res.status(200).json({
            success: true,
            msg: 'Categoría desactivada',
            category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al desactivar categoría',
            error
        });
    }
};