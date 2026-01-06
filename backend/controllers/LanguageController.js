const { Language } = require('../models');

module.exports = {
  // GET /api/languages
  async getAll(req, res, next) {
    try {
      const languages = await Language.findAll();
      res.json(languages);
    } catch (err) {
      next(err);
    }
  },

  // GET /api/languages/:id
  async getOne(req, res, next) {
    try {
      const language = await Language.findByPk(req.params.id);
      if (!language) {
        return res.status(404).json({ error: 'Langue non trouvée.' });
      }
      res.json(language);
    } catch (err) {
      next(err);
    }
  },

  // POST /api/languages
  async create(req, res, next) {
    try {
      const { name, icon } = req.body;
      if (!name) {
        return res.status(400).json({ error: 'Le nom est requis.' });
      }
      const language = await Language.create({ name, icon });
      res.status(201).json(language);
    } catch (err) {
      next(err);
    }
  },

  // PUT /api/languages/:id
  async update(req, res, next) {
    try {
      const { name, icon } = req.body;
      const language = await Language.findByPk(req.params.id);
      if (!language) {
        return res.status(404).json({ error: 'Langue non trouvée.' });
      }
      if (name) language.name = name;
      if (icon !== undefined) language.icon = icon;
      await language.save();
      res.json(language);
    } catch (err) {
      next(err);
    }
  },
};