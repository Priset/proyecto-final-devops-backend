const express = require('express');
const router = express.Router();
const SongRecommendation = require('../models/SongRecommendation');

router.get('/', async (req, res) => {
    try {
        console.log('GET / - Solicitando todas las recomendaciones.');
        const recommendations = await SongRecommendation.find();
        res.status(200).json(recommendations);
    } catch (error) {
        console.error('GET / - Error al obtener las recomendaciones:', error);
        res.status(500).json({ error: 'Error al obtener las recomendaciones.' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`GET /${id} - Solicitando recomendación con ID: ${id}`);
        const recommendation = await SongRecommendation.findById(id);

        if (!recommendation) {
            console.log(`GET /${id} - Recomendación no encontrada.`);
            return res.status(404).json({ error: 'Recomendación no encontrada.' });
        }

        res.status(200).json(recommendation);
    } catch (error) {
        console.error(`GET /${req.params.id} - Error al obtener la recomendación:`, error);
        res.status(500).json({ error: 'Error al obtener la recomendación.' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { artist, song } = req.body;
        console.log('POST / - Datos recibidos:', { artist, song });

        if (!artist || !song) {
            console.log('POST / - Campos faltantes:', {
                artist: !artist ? 'Falta el nombre del artista' : 'Presente',
                song: !song ? 'Falta el nombre de la canción' : 'Presente'
            });
            return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
        }

        const newRecommendation = new SongRecommendation({ artist, song });
        await newRecommendation.save();
        console.log('POST / - Recomendación creada con éxito:', newRecommendation);

        res.status(201).json(newRecommendation);
    } catch (error) {
        console.error('POST / - Error al crear la recomendación:', error);
        res.status(500).json({ error: 'Error interno al crear la recomendación.' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { artist, song } = req.body;

        console.log(`PUT /${id} - Datos recibidos para actualizar:`, { artist, song });

        if (!artist || !song) {
            console.log(`PUT /${id} - Campos faltantes.`);
            return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
        }

        const updatedRecommendation = await SongRecommendation.findByIdAndUpdate(
            id,
            { artist, song },
            { new: true }
        );

        if (!updatedRecommendation) {
            console.log(`PUT /${id} - Recomendación no encontrada.`);
            return res.status(404).json({ error: 'Recomendación no encontrada.' });
        }

        console.log(`PUT /${id} - Recomendación actualizada con éxito:`, updatedRecommendation);
        res.status(200).json(updatedRecommendation);
    } catch (error) {
        console.error(`PUT /${req.params.id} - Error al actualizar la recomendación:`, error);
        res.status(500).json({ error: 'Error al actualizar la recomendación.' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        console.log(`DELETE /${id} - Solicitando eliminación de recomendación.`);
        const deletedRecommendation = await SongRecommendation.findByIdAndDelete(id);

        if (!deletedRecommendation) {
            console.log(`DELETE /${id} - Recomendación no encontrada.`);
            return res.status(404).json({ error: 'Recomendación no encontrada.' });
        }

        console.log(`DELETE /${id} - Recomendación eliminada con éxito.`);
        res.status(200).json({ message: 'Recomendación eliminada correctamente.' });
    } catch (error) {
        console.error(`DELETE /${req.params.id} - Error al eliminar la recomendación:`, error);
        res.status(500).json({ error: 'Error al eliminar la recomendación.' });
    }
});

module.exports = router;
