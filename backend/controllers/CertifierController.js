const { Certifier, Street, City } = require('../models');

/**
 * GET /api/certifiers
 * Liste tous les certificateurs reconnus
 */
exports.getAllCertifiers = async (req, res, next) => {
  try {
    const certifiers = await Certifier.findAll({
      include: [
        {
          model: Street,
          as: 'street',
          include: [{ model: City, as: 'city' }]
        }
      ],
      order: [['name', 'ASC']]
    });

    res.json(certifiers);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/certifiers/:id
 * Détails d'un certificateur
 */
exports.getCertifierById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const certifier = await Certifier.findByPk(id, {
      include: [
        {
          model: Street,
          as: 'street',
          include: [{ model: City, as: 'city' }]
        }
      ]
    });

    if (!certifier) {
      return res.status(404).json({ message: 'Certificateur non trouvé' });
    }

    res.json(certifier);
  } catch (error) {
    next(error);
  }
};
