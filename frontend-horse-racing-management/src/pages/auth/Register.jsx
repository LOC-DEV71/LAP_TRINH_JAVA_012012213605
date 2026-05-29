import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../redux/slices/authSlice";

const Register = () => {
  const [user, setUser] = useState({
    username: "",
    password: "",
    fullName: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const actionResult = await dispatch(registerUser(user));
      if (registerUser.fulfilled.match(actionResult)) {
        alert("Đăng ký thành công!");
        navigate("/login");
      } else {
        alert("Đăng ký thất bại: " + (actionResult.payload || "Vui lòng thử lại."));
      }
    } catch (error) {
      console.error(error);
      alert("Đăng ký thất bại!");
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#003f22",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "#fff",
          padding: "2rem",
          borderRadius: "8px",
          minWidth: "350px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
        }}
      >
        <h2
          style={{ color: "#000", textAlign: "center", marginBottom: "1.5rem" }}
        >
          Đăng Ký
        </h2>

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", fontWeight: "bold" }}>
            Tài khoản:
          </label>
          <input
            type="text"
            name="username"
            value={user.username}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "0.5rem",
              marginTop: "0.5rem",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", fontWeight: "bold" }}>
            Mật khẩu:
          </label>
          <input
            type="password"
            name="password"
            value={user.password}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "0.5rem",
              marginTop: "0.5rem",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", fontWeight: "bold" }}>
            Họ và tên:
          </label>
          <input
            type="text"
            name="fullName"
            value={user.fullName}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "0.5rem",
              marginTop: "0.5rem",
              boxSizing: "border-box",
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "0.75rem",
            backgroundColor: "#e60000",
            color: "#fff",
            border: "none",
            fontWeight: "bold",
            cursor: "pointer",
            borderRadius: "4px",
          }}
        >
          Tạo Tài Khoản
        </button>

        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          Đã có tài khoản?{" "}
          <Link to="/login" style={{ color: "#003f22", fontWeight: "bold" }}>
            Đăng nhập
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
