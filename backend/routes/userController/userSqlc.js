export default {
  clearRefreshToken(data) {
    const obj = {};

    const { userId } = data;

    obj.queryString = `
      UPDATE public.tbl_users
      SET refresh_token = NULL
      WHERE n_user_id = $1;
    `;
    obj.arr = [userId];

    return obj;
  },
  deleteUser: (data) => {
    const obj = {};

    obj.queryString = 'DELETE FROM tbl_users where n_user_id = $1';
    obj.arr = [parseInt(data.id, 10)];

    return obj;
  },
  getDuplicate: (data) => {
    const obj = {};

    obj.queryString = 'SELECT * FROM tbl_users WHERE s_email = $1;';
    obj.arr = [data.email];

    return obj;
  },
  getUserById(data) {
    const obj = {};

    const { userId } = data;

    obj.queryString = `
      SELECT * FROM public.tbl_users WHERE n_user_id = $1;
    `;
    obj.arr = [userId];

    return obj;
  },
  login: (data) => {
    const obj = {};

    obj.queryString = 'SELECT * FROM tbl_users WHERE s_email = $1;';
    obj.arr = [data.email];

    return obj;
  },

  register: (data) => {
    const obj = {};

    obj.queryString =
      'INSERT INTO tbl_users (s_full_name, s_email, s_password, n_role, n_created_by) VALUES ($1,$2,$3,$4,$5);';
    obj.arr = [data.fullName, data.email, data.password, 'admin', 0];

    return obj;
  },

  updateRefreshToken(data) {
    const obj = {};

    const { userId, refreshToken } = data;

    obj.queryString = `
      UPDATE public.tbl_users
      SET refresh_token = $1
      WHERE n_user_id = $2;
    `;
    obj.arr = [refreshToken, userId];

    return obj;
  },

  updateUser: (data) => {
    const obj = {};

    obj.queryString =
      'UPDATE tbl_users SET username = $1, s_email = $2, s_full_name = $3, n_role = $4 where n_user_id = $5';
    obj.arr = [
      data.username,
      data.email,
      data.full_name,
      data.role,
      parseInt(data.id, 10),
    ];

    return obj;
  },
};
