const sabahAthkar = require('../athkar/adhkar_sabah.json');
const masaaAthkar = require('../athkar/adhkar_masaa.json');

module.exports.renderIndex = (req, res) => {
    res.render('athkar/index');
};

module.exports.renderSabah = (req, res) => {
    res.render('athkar/show', {
        athkar: sabahAthkar.items,
        title: 'أذكار الصباح',
        type: 'sabah'
    });
};

module.exports.renderMasaa = (req, res) => {
    res.render('athkar/show', {
        athkar: masaaAthkar.items,
        title: 'أذكار المساء',
        type: 'masaa'
    });
};