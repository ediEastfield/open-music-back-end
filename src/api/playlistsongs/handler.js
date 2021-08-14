class playlistsongsHandler {
  constructor(playlistsongsService, playlistsService, validator) {
    this._playlistsongsService = playlistsongsService;
    this._playlistsService = playlistsService;
    this._validator = validator;

    this.postPlaylistsongHandler = this.postPlaylistsongHandler.bind(this);
    this.getPlaylistsongsHandler = this.getPlaylistsongsHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
  }

  async postPlaylistsongHandler(request, h) {
    this._validator.validatePlaylistsongPayload(request.payload);
    const { playlistId } = request.params;
    const { songId } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    const playlistsongId = await this._playlistsongsService.addPlaylistsong(playlistId, songId);

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke playlist',
      data: {
        playlistsongId,
      },

    });
    response.code(201);
    return response;
  }

  async getPlaylistsongsHandler(request) {
    const { playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    const songs = await this._playlistsongsService.getPlaylistsongById(playlistId);
    return {
      status: 'success',
      data: {
        songs,
      },
    };
  }

  async deleteSongByIdHandler(request) {
    const { playlistId } = request.params;
    const { songId } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    await this._playlistsongsService.deleteSongById(playlistId, songId);

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist',
    };
  }
}

module.exports = playlistsongsHandler;
