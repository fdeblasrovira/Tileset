const formService = require('../services/formService');

// Controller for the creation of a form
exports.handleCreateForm = async function (req, res) {
  try {
    // Check if there's form data
    const { formData } = req.body;
    if (!formData) return res.status(400).json({ code: 400, message: 'Bad request: missing body data' });

    const { userId } = req;
    const result = await formService.handleCreateForm(formData, userId);
    if (result.error) return res.status(result.code).json({ code: result.code, message: result.message });

    res.status(200).json({ code: 200 });
  }
  catch (e) {
    res.status(500).json({ code: 500, message: 'Server error: form creation error' });
  }
};
