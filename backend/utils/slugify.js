// Fonction utilitaire pour slugifier un nom 
// (enlever accents, espaces, caractères spéciaux)
function slugify(str) {
  return str
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // enlève les accents
    .replace(/[^a-zA-Z0-9]/g, '-') // espaces et spéciaux → tiret
    .replace(/-+/g, '-') // plusieurs tirets → un seul
    .replace(/^-|-$/g, '') // tirets début/fin supprimés
    .toLowerCase();
}

module.exports = slugify;

