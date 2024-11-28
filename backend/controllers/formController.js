const formService = require('../services/formService');

// Controller for the creation of a form
exports.handleCreateForm = async function (req, res) {
  try {
    // Check if there's form data
    const { formData } = req.body;
    if (!formData) return res.status(400).json({ code: 400, message: 'Bad request: missing body data' });

    const { userId } = req;
    const result = await formService.handleCreateForm(formData, userId);
    if (result.error) return res.status(400).json({ code: 400, message: result.message });

    res.status(200).json({ code: 200, formImageUpload: result.formImageUpload, resultsImageUpload: result.resultsImageUpload });
  }
  catch (e) {
    console.error(e.message)
    res.status(500).json({ code: 500, message: 'Server error: form creation error' });
  }
};

// Controller for getting one form
exports.handleGetForm = async function (req, res) {
  try {
    // Check if there's form data
    const formId = req.query.id;
    if (!formId) return res.status(400).json({ code: 400, message: 'Bad request: no form id provided' });

    const version = req.query.version;
    const { userId } = req;
    const result = await formService.handleGetForm(formId, userId, version);
    if (result.error) return res.status(500).json({ code: 500, message: result.message });

    res.status(200).json({ code: 200, form: result.form });
  }
  catch (e) {
    console.error(e.message)
    res.status(500).json({ code: 500, message: 'Server error: form creation error' });
  }
};