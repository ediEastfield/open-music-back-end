const ExportPlaylistsongsPayloadSchema = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const ExportsValidator = {
  validateExportPlaylistsongsPayload: (payload) => {
    const validationResult = ExportPlaylistsongsPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = ExportsValidator;
