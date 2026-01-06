const { RestaurantCertification, Certifier, Restaurant } = require('../models');

/**
 * GET /api/certifications/my
 * Récupère les certifications du restaurant connecté
 */
exports.getMyCertifications = async (req, res, next) => {
  try {
    const restaurantId = req.user.id;

    const certifications = await RestaurantCertification.findAll({
      where: { restaurantId },
      include: [
        { model: Certifier, as: 'certifier' }
      ]
    });

    res.json(certifications);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/certifications/restaurant/:restaurantId
 * Récupère les certifications d'un restaurant (public)
 */
exports.getCertificationsByRestaurant = async (req, res, next) => {
  try {
    const { restaurantId } = req.params;

    const certifications = await RestaurantCertification.findAll({
      where: { restaurantId },
      include: [
        { model: Certifier, as: 'certifier' }
      ]
    });

    res.json(certifications);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/certifications
 * Ajoute une certification pour le restaurant connecté
 */
exports.addCertification = async (req, res, next) => {
  try {
    const restaurantId = req.user.id;
    const { certifierId, custom_certifier_name, certification_number } = req.body;

    // Validation
    if (!certification_number) {
      return res.status(400).json({ message: 'Le numéro de certification est obligatoire' });
    }

    // Si certifierId fourni, valider le format
    if (certifierId) {
      const certifier = await Certifier.findByPk(certifierId);
      if (!certifier) {
        return res.status(400).json({ message: 'Certificateur non trouvé' });
      }

      // Valider le format du numéro si regex défini
      if (certifier.format_regex) {
        const regex = new RegExp(certifier.format_regex);
        if (!regex.test(certification_number)) {
          return res.status(400).json({ 
            message: `Format de numéro invalide. Format attendu: ${certifier.format_regex}` 
          });
        }
      }
    } else if (!custom_certifier_name) {
      return res.status(400).json({ message: 'Veuillez choisir un certificateur ou entrer un nom personnalisé' });
    }

    const certification = await RestaurantCertification.create({
      restaurantId,
      certifierId: certifierId || null,
      custom_certifier_name: certifierId ? null : custom_certifier_name,
      certification_number,
      is_verified: false
    });

    res.status(201).json({
      message: 'Certification ajoutée avec succès',
      certification
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/certifications/:id
 * Met à jour une certification du restaurant connecté
 */
exports.updateCertification = async (req, res, next) => {
  try {
    const restaurantId = req.user.id;
    const { id } = req.params;
    const { certifierId, custom_certifier_name, certification_number } = req.body;

    const certification = await RestaurantCertification.findOne({
      where: { id, restaurantId }
    });

    if (!certification) {
      return res.status(404).json({ message: 'Certification non trouvée' });
    }

    // Si certifierId fourni, valider le format
    if (certifierId) {
      const certifier = await Certifier.findByPk(certifierId);
      if (!certifier) {
        return res.status(400).json({ message: 'Certificateur non trouvé' });
      }

      if (certifier.format_regex && certification_number) {
        const regex = new RegExp(certifier.format_regex);
        if (!regex.test(certification_number)) {
          return res.status(400).json({ 
            message: `Format de numéro invalide. Format attendu: ${certifier.format_regex}` 
          });
        }
      }
    }

    await certification.update({
      certifierId: certifierId || null,
      custom_certifier_name: certifierId ? null : custom_certifier_name,
      certification_number: certification_number || certification.certification_number,
      is_verified: false, // Reset verification on update
      verified_at: null,
      verified_by: null
    });

    res.json({
      message: 'Certification mise à jour',
      certification
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/certifications/:id
 * Supprime une certification du restaurant connecté
 */
exports.deleteCertification = async (req, res, next) => {
  try {
    const restaurantId = req.user.id;
    const { id } = req.params;

    const certification = await RestaurantCertification.findOne({
      where: { id, restaurantId }
    });

    if (!certification) {
      return res.status(404).json({ message: 'Certification non trouvée' });
    }

    await certification.destroy();

    res.json({ message: 'Certification supprimée' });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/certifications/:id/verify
 * Vérifie une certification (admin uniquement - à protéger)
 */
exports.verifyCertification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { is_verified } = req.body;

    const certification = await RestaurantCertification.findByPk(id);

    if (!certification) {
      return res.status(404).json({ message: 'Certification non trouvée' });
    }

    await certification.update({
      is_verified: is_verified !== false,
      verified_at: is_verified !== false ? new Date() : null,
      verified_by: req.user.id
    });

    res.json({
      message: is_verified !== false ? 'Certification vérifiée' : 'Vérification annulée',
      certification
    });
  } catch (error) {
    next(error);
  }
};
