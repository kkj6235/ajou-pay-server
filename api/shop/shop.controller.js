const test = (req, res) => {
    res.status(200).json({ test: 'shop입니다!' });
};

module.exports = { test };
