'use strict';

const { CategoryMenu, CategoryMenuDescription, Language } = require('../models');
const { createError } = require('../utils/createError');

// --- Fonctions utilitaires pour les descriptions ---
async function createDescription({ categoryMenuId, languageId, name, description }) {
  const exists = await CategoryMenuDescription.findOne({ where: { categoryMenuId, languageId } });
  if (exists) throw createError('Description déjà existante pour cette langue', 409);

  return CategoryMenuDescription.create({
    categoryMenuId,
    languageId,
    name,
    description
  });
}

async function updateDescriptionById(categoryMenuId, descriptionId, { languageId, name, description }) {
  const desc = await CategoryMenuDescription.findOne({
    where: { id: descriptionId, categoryMenuId }
  });
  if (!desc) throw createError('Description non trouvée', 404);

  await desc.update({ languageId, name, description });
  return desc;
}

async function deleteDescriptionById(categoryMenuId, descriptionId) {
  const deleted = await CategoryMenuDescription.destroy({
    where: { id: descriptionId, categoryMenuId }
  });
  if (!deleted) throw createError('Description non trouvée', 404);
  return deleted;
}

// --- CRUD CategoryMenu ---

exports.create = async (req, res, next) => {
  try {
    const { icon, isValidated, descriptions } = req.body;
    const menu = await CategoryMenu.create({ icon, isValidated: !!isValidated });
    for (const desc of descriptions) {
      await createDescription({ ...desc, categoryMenuId: menu.id });
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

    await menu.update({ icon, isValidated: !!isValidated });

    // Supprime les anciennes descriptions et insère les nouvelles avec la fonction utilitaire
    await CategoryMenuDescription.destroy({ where: { categoryMenuId: id } });
    for (const desc of descriptions) {
      await createDescription({ ...desc, categoryMenuId: id });
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

// --- MÉTHODES POUR LES DESCRIPTIONS ---

exports.addDescription = async (req, res, next) => {
  try {
    const { categoryMenuId } = req.params;
    const { languageId, name, description } = req.body;

    // Vérifie que la catégorie existe
    const menu = await CategoryMenu.findByPk(categoryMenuId);
    if (!menu) return next(createError('Catégorie menu non trouvée', 404));

    const desc = await createDescription({
      categoryMenuId,
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
    const { categoryMenuId, descriptionId } = req.params;
    const { languageId, name, description } = req.body;

    const desc = await updateDescriptionById(categoryMenuId, descriptionId, { languageId, name, description });

    return res.status(200).json(desc);
  } catch (error) {
    next(error);
  }
};

exports.deleteDescription = async (req, res, next) => {
  try {
    const { categoryMenuId, descriptionId } = req.params;
    await deleteDescriptionById(categoryMenuId, descriptionId);
    return res.status(200).json({ message: 'Description supprimée' });
  } catch (error) {
    next(error);
  }
};