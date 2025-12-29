import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

import userSqlc from './userSqlc.js';
import pool from '../../config/config.js';
import dbqueryexecute from '../../utils/dbqueryexecute.js';

dotenv.config();

const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET || process.env.SECRET_KEY || 'sahil_1234';

const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || 'refresh-secret';

// Helper to sign tokens
const signAccess = (payload) =>
  jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });

const signRefresh = (payload) =>
  jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

export default {
  deleteUser(req, res) {
    dbqueryexecute
      .executeSelectObj(userSqlc.deleteUser(req.body), pool)
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },

  async login(req, res) {
    try {
      const result = await dbqueryexecute.executeSelectObj(
        userSqlc.login(req.body),
        pool,
      );

      if (result.length === 0) {
        
        
        return res.status(404).json({ Mess: 'Email/Password not matched' });
      }
      const userRow = result[0];

      const isPasswordValid = await bcrypt.compare(
        req.body.password,
        userRow.s_password,
      );

      if (isPasswordValid) {
        const payload = {
          id: userRow.n_user_id,
          role: userRow.n_role,
        };

        const accessToken = signAccess(payload);

        const refreshToken = signRefresh(payload);

        await dbqueryexecute.executeSelectObj(
          userSqlc.updateRefreshToken({ refreshToken, userId: payload.id }),
          pool,
        );
        res.cookie('jid', refreshToken, {
          httpOnly: true,
          maxAge: 7 * 24 * 60 * 60 * 1000,
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
          secure: process.env.NODE_ENV === 'production',
        });

        return res.status(200).json({
          accessToken,
          email: userRow.s_email,
          empID: userRow.n_user_id,
          fullName: userRow.s_full_name,
          role: userRow.n_role,
        });
      }

      return res.status(404).json({ Mess: 'Email/Password not matched' });
    } catch (error) {
      console.log(err);
      
      return res.status(500).json(error);
    }
  },

  // NEW: logout - clear cookie and DB token
  async logout(req, res) {
    try {
      const token = req.cookies.jid;

      if (token) {
        try {
          const decoded = jwt.decode(token);

          if (decoded?.id) {
            await dbqueryexecute.executeSelectObj(
              userSqlc.clearRefreshToken({ userId: Number(decoded.id) }),
              pool,
            );
          }
        } catch  {
          // Ignore
        }
      }
      res.clearCookie('jid', {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production',
      });

      return res.json({ ok: true });
    } catch {
      return res.status(500).json({ message: 'Logout failed' });
    }
  },

  // NEW: refresh token endpoint
  async refreshToken(req, res) {
    try {
      const token = req.cookies.jid;
      if (!token) {
        return res.status(401).json({ message: 'No refresh token' });
      }
      let decoded;
      try {
        decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);
      } catch (err) {
        return res.status(401).json({ message: 'Invalid refresh token' });
      }
      const userId = decoded.id;
      const q = await dbqueryexecute.executeSelectObj(
        userSqlc.getUserById({ userId }),
        pool,
      );
      const userRow = q[0];
      if (!userRow || userRow.refresh_token !== token) {
        return res.status(401).json({ message: 'Invalid refresh token' });
      }
      const payload = { id: userId, role: userRow.n_role };
      const accessToken = signAccess(payload);
      return res.status(200).json({
        accessToken,
        email: userRow.s_email,
        empID: userRow.n_user_id,
        fullName: userRow.s_full_name,
        role: userRow.n_role,
      });
    } catch (err) {
      return res.status(500).json({ message: 'Refresh failed' });
    }
  },

  async register(req, res) {
    try {
      const result = await dbqueryexecute.executeSelectObj(
        userSqlc.getDuplicate(req.body),
        pool,
      );

      if (result.length > 0) {
        return res.status(409).json({ mess: 'Email Already Exists' });
      }

      const SALT = 10;

      const hashedPassword = await bcrypt.hash(req.body.password, SALT);

      const data = await dbqueryexecute.executeSelectObj(
        userSqlc.register({ ...req.body, password: hashedPassword }),
        pool,
      );

      return res.status(200).json(data);
    } catch {
      return res.status(500).json(err);
    }
  },

  updateUser(req, res) {
    dbqueryexecute
      .executeSelectObj(userSqlc.updateUser(req.body), pool)
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },

  async logout(req, res) {
  try {
    const token = req.cookies.jid;

    if (token) {
      try {
        const decoded = jwt.decode(token);

        if (decoded?.id) {
          await dbqueryexecute.executeSelectObj(
            userSqlc.clearRefreshToken({ userId: Number(decoded.id) }),
            pool
          );
        }
      } catch {
        // ignore decode error
      }
    }

    // Clear cookie
    res.clearCookie("jid", {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Logout failed", err });
  }
}

};
