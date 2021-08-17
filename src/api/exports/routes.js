const routes = (handler) => [
  {
    method: 'POST',
    path: '/exports/playlists/{playlistId}',
    handler: handler.postExportPlaylistsongsHandler,
    options: {
      auth: 'openmusicsapp_jwt',
    },
  },
];

module.exports = routes;
