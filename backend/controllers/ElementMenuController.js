'use strict';

const { ElementMenu, ElementMenuDescription, Language, CategoryMenu, Restaurant } = require('../models');
const { createError } = require('../utils/createError');

// --- Fonction utilitaire pour ajouter une description ---
async function createDescription({ elementMenuId, languageId, name, description }) {
  // Vérifie qu'il n'y a pas déjà une description pour cette langue
  const exists = await ElementMenuDescription.findOne({ where: { elementMenuId, languageId } });
  if (exists) throw createError('Description déjà existante pour cette langue', 409);

  return ElementMenuDescription.create({
    elementMenuId,
    languageId,
    name,
    description
  });
}

// --- Fonction utilitaire pour supprimer une description ---
async function deleteDescriptionById(elementMenuId, descriptionId) {
  const deleted = await ElementMenuDescription.destroy({
    where: { id: descriptionId, elementMenuId }
  });
  if (!deleted) throw createError('Description non trouvée', 404);
  return deleted;
}

// --- Fonction utilitaire pour mettre à jour une description ---
async function updateDescriptionById(elementMenuId, descriptionId, { languageId, name, description }) {
  const desc = await ElementMenuDescription.findOne({
    where: { id: descriptionId, elementMenuId }
  });
  if (!desc) throw createError('Description non trouvée', 404);

  await desc.update({ languageId, name, description });
  return desc;
}

// Créer un élément menu avec descriptions
exports.create = async (req, res, next) => {
  try {
    const { image, price, categoryMenuId, restaurantId, descriptions } = req.body;
    const element = await ElementMenu.create({ image, price, categoryMenuId, restaurantId });
    for (const desc of descriptions) {
      await createDescription({ ...desc, elementMenuId: element.id });
    }
    const createdElement = await ElementMenu.findByPk(element.id, {
      include: [
        {
          model: ElementMenuDescription,
          as: 'descriptions',
          include: [{ model: Language, as: 'language' }]
        },
        { model: CategoryMenu, as: 'categoryMenu' },
        { model: Restaurant, as: 'restaurant' }
      ]
    });
    return res.status(201).json(createdElement);
  } catch (error) {
    next(error);
  }
};

// Récupérer tous les éléments menu
exports.findAll = async (req, res, next) => {
  try {
    const elements = await ElementMenu.findAll({
      include: [
        {
          model: ElementMenuDescription,
          as: 'descriptions',
          include: [{ model: Language, as: 'language' }]
        },
        { model: CategoryMenu, as: 'categoryMenu' },
        { model: Restaurant, as: 'restaurant' }
      ]
    });
    return res.status(200).json(elements);
  } catch (error) {
    next(error);
  }
};

// Récupérer un élément menu par id
exports.findById = async (req, res, next) => {
  try {
    const element = await ElementMenu.findByPk(req.params.id, {
      include: [
        {
          model: ElementMenuDescription,
          as: 'descriptions',
          include: [{ model: Language, as: 'language' }]
        },
        { model: CategoryMenu, as: 'categoryMenu' },
        { model: Restaurant, as: 'restaurant' }
      ]
    });
    if (!element) return next(createError('Élément menu non trouvé', 404));
    return res.status(200).json(element);
  } catch (error) {
    next(error);
  }
};

// Mettre à jour un élément menu et ses descriptions
exports.update = async (req, res, next) => {
  try {
    const { image, price, categoryMenuId, restaurantId, descriptions } = req.body;
    const { id } = req.params;
    const element = await ElementMenu.findByPk(id);
    if (!element) return next(createError('Élément menu non trouvé', 404));

    await element.update({ image, price, categoryMenuId, restaurantId });

    // Supprime les anciennes descriptions et insère les nouvelles avec la fonction utilitaire
    await ElementMenuDescription.destroy({ where: { elementMenuId: id } });
    for (const desc of descriptions) {
      await createDescription({ ...desc, elementMenuId: id });
    }

    const updatedElement = await ElementMenu.findByPk(id, {
      include: [
        {
          model: ElementMenuDescription,
          as: 'descriptions',
          include: [{ model: Language, as: 'language' }]
        },
        { model: CategoryMenu, as: 'categoryMenu' },
        { model: Restaurant, as: 'restaurant' }
      ]
    });

    return res.status(200).json(updatedElement);
  } catch (error) {
    next(error);
  }
};

// Supprimer un élément menu et ses descriptions
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    await ElementMenuDescription.destroy({ where: { elementMenuId: id } });
    const deleted = await ElementMenu.destroy({ where: { id } });
    if (!deleted) return next(createError('Élément menu non trouvé', 404));
    return res.status(200).json({ message: 'Élément menu supprimé' });
  } catch (error) {
    next(error);
  }
};

// --- MÉTHODES POUR LES DESCRIPTIONS ---

exports.addDescription = async (req, res, next) => {
  try {
    const { elementMenuId } = req.params;
    const { languageId, name, description } = req.body;

    // Vérifie que l'élément existe
    const element = await ElementMenu.findByPk(elementMenuId);
    if (!element) return next(createError('Élément menu non trouvé', 404));

    const desc = await createDescription({
      elementMenuId,
      languageId,
      name,
      description
    });

    return res.status(201).json(desc);
  } catch (error) {
    next(error);
  }
};

exports.updateDescription = async (req, res, next) => {
  try {
    const { elementMenuId, descriptionId } = req.params;
    const { languageId, name, description } = req.body;

    const desc = await updateDescriptionById(elementMenuId, descriptionId, { languageId, name, description });

    return res.status(200).json(desc);
  } catch (error) {
    next(error);
  }
};

exports.deleteDescription = async (req, res, next) => {
  try {
    const { elementMenuId, descriptionId } = req.params;
    await deleteDescriptionById(elementMenuId, descriptionId);
    return res.status(200).json({ message: 'Description supprimée' });
  } catch (error) {
    next(error);
  }
};