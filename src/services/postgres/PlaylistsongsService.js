const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaysongsService {
  constructor(collaborationService, cacheService) {
    this._pool = new Pool();
    this._collaborationService = collaborationService;
    this._cacheService = cacheService;
  }

  async addPlaylistsong(playlistId, songId) {
    const id = nanoid(16);

    const query = {
      text: 'INSERT INTO playlistsongs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Lagu gagal ditambahkan ke playlist');
    }

    await this._cacheService.delete(`playlistsongs:${playlistId}`);
    return result.rows[0].id;
  }

  async getPlaylistsongById(playlistId) {
    try {
      const result = await this._cacheService.get(`playlistsongs:${playlistId}`);
      return JSON.parse(result);
    } catch (error) {
      const query = {
        text: `SELECT songs.id,title,performer
          FROM songs
          LEFT JOIN playlistsongs ON playlistsongs.song_id = songs.id 
          WHERE playlistsongs.playlist_id = $1
          GROUP BY songs.id`,
        values: [playlistId],
      };

      const result = await this._pool.query(query);

      if (!result.rowCount) {
        throw new NotFoundError('Lagu tidak ditemukan pada playlist');
      }

      await this._cacheService.set(`playlistsongs:${playlistId}`, JSON.stringify(result));

      return result.rows;
    }
  }

  async deleteSongById(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlistsongs WHERE playlist_id = $1 AND song_id = $2',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Lagu gagal dihapus. Lagu tidak ditemukan');
    }

    await this._cacheService.delete(`playlistsongs:${playlistId}`);
  }
}

module.exports = PlaysongsService;
