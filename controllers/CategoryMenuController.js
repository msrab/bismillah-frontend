'use strict';

const { CategoryMenu, CategoryMenuDescription, Language } = require('../models');
const { createError } = require('../utils/createError');

// Fonction de validation pour descriptions
function validateDescriptions(descriptions) {
  if (!Array.isArray(descriptions)) return 'descriptions doit être un tableau';
  if (descriptions.length === 0) return 'descriptions ne doit pas être vide';
  const ids = new Set();
  for (const desc of descriptions) {
    if (!desc || typeof desc !== 'object') return 'Chaque description doit être un objet';
    if (typeof desc.languageId !== 'number') return 'languageId manquant ou invalide';
    if (ids.has(desc.languageId)) return 'Doublon de languageId';
    ids.add(desc.languageId);
    if (typeof desc.name !== 'string' || !desc.name.trim()) return 'name manquant ou vide';
    if (typeof desc.description !== 'string') return 'description manquant';
  }
  return null;
}

exports.create = async (req, res, next) => {
  try {
    const { icon, isValidated, descriptions } = req.body;
    if (typeof icon !== 'string' || !icon.trim()) {
      return next(createError('icon manquant ou invalide', 400));
    }
    const descError = validateDescriptions(descriptions);
    if (descError) {
      return next(createError(descError, 400));
    }
    const menu = await CategoryMenu.create({ icon, isValidated: !!isValidated });
    for (const desc of descriptions) {
      await CategoryMenuDescription.create({ ...desc, categoryMenuId: menu.id });
    }
    const createdMenu = await CategoryMenu.findByPk(menu.id, {
      include: [
        {
          model: CategoryMenuDescription,
          as: 'descriptions',
          include: [{ model: Language, as: 'language' }]
        }
      ]
    });
    return res.status(201).json({
      id: createdMenu.id,
      icon: createdMenu.icon,
      isValidated: createdMenu.isValidated,
      descriptions: createdMenu.descriptions,
      message: 'Catégorie menu créée'
    });
  } catch (error) {
    next(error);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const { languageId } = req.query;
    const include = [{
      model: CategoryMenuDescription,
      as: 'descriptions',
      include: [{ model: Language, as: 'language' }]
    }];
    if (languageId) {
      include[0].where = { languageId };
    }
    const menus = await CategoryMenu.findAll({ include });
    return res.status(200).json(menus);
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const menu = await CategoryMenu.findByPk(req.params.id, {
      include: [
        {
          model: CategoryMenuDescription,
          as: 'descriptions',
          include: [{ model: Language, as: 'language' }]
        }
      ]
    });
    if (!menu)
      return next(createError('Catégorie menu non trouvée', 404));
    return res.status(200).json(menu);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { icon, isValidated, descriptions } = req.body;
    const menu = await CategoryMenu.findByPk(id);
    if (!menu) return next(createError('Catégorie menu non trouvée', 404));

    if (typeof icon !== 'string' || !icon.trim()) {
      return next(createError('icon manquant ou invalide', 400));
    }
    const descError = validateDescriptions(descriptions);
    if (descError) {
      return next(createError(descError, 400));
    }

    await menu.update({ icon, isValidated: !!isValidated });

    // Supprime les anciennes descriptions et insère les nouvelles
    await CategoryMenuDescription.destroy({ where: { categoryMenuId: id } });
    for (const desc of descriptions) {
      await CategoryMenuDescription.create({ ...desc, categoryMenuId: id });
    }

    const updatedMenu = await CategoryMenu.findByPk(id, {
      include: [
        {
          model: CategoryMenuDescription,
          as: 'descriptions',
          include: [{ model: Language, as: 'language' }]
        }
      ]
    });

    return res.status(200).json({
      id: updatedMenu.id,
      icon: updatedMenu.icon,
      isValidated: updatedMenu.isValidated,
      descriptions: updatedMenu.descriptions,
      message: 'Catégorie menu mise à jour'
    });
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    await CategoryMenuDescription.destroy({ where: { categoryMenuId: id } });
    const deleted = await CategoryMenu.destroy({ where: { id } });
    if (!deleted) return next(createError('Catégorie menu non trouvée', 404));
    return res.status(200).json({ message: 'Catégorie menu supprimée' });
  } catch (error) {
    next(error);
  }
};