import axios from "axios";
import jwt_decode from "jwt-decode";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

export async function registerUser(credentials) {
  try {
    const {
      data: { msg },
      status,
    } = await axios.post(`/api/user/register`, credentials);
    console.log(msg);

    let { username, email } = credentials;

    /** send email */
    if (status === 201) {
      await axios.post("/api/user/registerMail", {
        username,
        userEmail: email,
        text: msg,
      });
    }

    return Promise.resolve(msg);
  } catch (error) {
    return Promise.reject({ error });
  }
}

export async function authenticate(username) {
  try {
    return await axios.post("/api/user/authenticate", { username });
  } catch (error) {
    return { error: "Username doesn't exist...!" };
  }
}

export async function getUser({ username }) {
  try {
    const { data } = await axios.get(`/api/user/${username}`);
    return { data };
  } catch (error) {
    return { error: "Password doesn't match...!" };
  }
}

/** update user profile function */
export async function updateUser(response) {
  try {
    const token = await localStorage.getItem("token");
    const data = await axios.put("/api/user/updateuser", response, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return Promise.resolve({ data });
  } catch (error) {
    return Promise.reject({ error: "Couldn't Update Profile...!" });
  }
}

export async function getUsername() {
  const token = localStorage.getItem("token");
  if (!token) return Promise.reject("Cannot find token...!");

  const decode = jwt_decode(token);
  return decode;
}

export async function generateOTP(username) {
  try {
    const {
      data: { code },
      status,
    } = await axios.get("/api/user/generateOTP", { params: { username } });

    // send mail with OTP
    if (status === 201) {
      const {
        data: { email },
      } = await getUser({ username });
      const text = `Your Password Recovery OTP is ${code}. Verify and recovery your password.`;
      await axios.post("/api/user/registerMail", {
        username,
        userEmail: email,
        text,
        subject: "Password Recovery OTP",
      });
    }

    return Promise.resolve();
  } catch (error) {
    return Promise.reject({ error });
  }
}

export async function verityOTP({ username, code }) {
  try {
    const { data, status } = await axios.get("/api/user/verifyOTP", {
      params: { username, code },
    });
    return { data, status };
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function resetPassword({ username, password }) {
  try {
    const { data, status } = await axios.put("/api/user/resetPassword", {
      username,
      password,
    });
    return Promise.resolve({ data, status });
  } catch (error) {
    return Promise.reject({ error });
  }
}

export async function verifyPassword({ username, password }) {
  try {
    const { data } = await axios.post(`/api/user/login`, {
      username,
      password,
    });
    return Promise.resolve({ data });
  } catch (error) {
    return Promise.reject({ error: "Password doesn't match...!" });
  }
}
