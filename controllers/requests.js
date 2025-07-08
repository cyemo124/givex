const Request = require('../models/request')
const { cloudinary, storage } = require('../cloudinary')

module.exports.renderRequests = async (req, res) => {
    const requests = await Request.find({});
    res.render('givex/request', { requests });
}

module.exports.showRequest = async (req, res) => {
    const { id } = req.params
    const request = await Request.findById(id)
    if (!request) {
        return res.status(404).send('Request not found');
    }
    res.render('givex/show', { request, currentUser: req.user });
}

module.exports.renderNewRequestForm = (req, res) => {
    res.render('givex/new')
}

module.exports.newRequest = async (req, res) => {
    const request = new Request(req.body.request);
    request.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    request.author = req.user._id;
    request.firstName = req.user.firstName;
    request.lastName = req.user.lastName;
    await request.save();
    req.flash('success', 'Created new request!');
    res.redirect(`/request/${request._id}`);

}

module.exports.renderDonateForm = async (req, res) => {
    const { id } = req.params;
    const request = await Request.findById(id);
    res.render('givex/donate', { request, currentUser: req.user });
}