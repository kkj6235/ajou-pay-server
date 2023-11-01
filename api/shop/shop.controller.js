const test = (req, res) => {
    res.status(200).json({ test: 'test' });
};

module.exports = { test };
