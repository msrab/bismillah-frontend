# Belgium Postcodes Data

## Source des données

Ce fichier contient les codes postaux belges avec leurs localités et coordonnées GPS.

### Origine
- **Source** : Open Data Wallonie-Bruxelles (ODWB)
- **Dataset** : Code postaux belge
- **Landing Page** : https://www.odwb.be/explore/dataset/code-postaux-belge/information/
- **Contact** : Agence du Numérique

### Dates
- **Création du dataset** : 03 December 2024
- **Dernière mise à jour** : 03 December 2024
- **Ajouté à data.europa.eu** : 21 September 2023
- **Mis à jour sur data.europa.eu** : 24 November 2025

### Identifiants
- **URL** : https://www.odwb.be/explore/dataset/code-postaux-belge/
- **URI** : http://data.europa.eu/88u/dataset/https-www-odwb-be-explore-dataset-code-postaux-belge-

### Licence
- **Accès** : Public

## Structure du fichier

Le fichier `belgium-postcodes-2025.json` contient **2761 entrées** avec la structure suivante :

```json
{
  "postalCode": "1020",
  "localityName": "Laeken",
  "longitude": 4.3487134,
  "latitude": 50.883392,
  "municipalityFr": "Bruxelles",
  "arrondissement": "Arrondissement de Bruxelles-Capitale",
  "province": null
}
```

### Champs

| Champ | Description |
|-------|-------------|
| `postalCode` | Code postal (4 chiffres) |
| `localityName` | Nom de la localité/commune |
| `longitude` | Coordonnée GPS longitude |
| `latitude` | Coordonnée GPS latitude |
| `municipalityFr` | Nom de la commune en français (si différent de localityName) |
| `arrondissement` | Arrondissement administratif |
| `province` | Province (null pour Bruxelles-Capitale) |

### Notes
- Pour les communes flamandes, `municipalityFr` peut être `null`
- `localityName` contient le nom dans la langue locale (FR pour Wallonie, NL pour Flandre, bilingue pour Bruxelles)
