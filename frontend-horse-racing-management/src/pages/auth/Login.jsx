import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../redux/slices/authSlice";

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Lắng nghe thay đổi từ Redux (useSelector) để gọi navigate() khi đăng nhập thành công
  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === "ROLE_ADMIN" || user?.role === "ADMIN") {
        navigate("/admin/users");
      } else {
        navigate("/");
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const actionResult = await dispatch(loginUser(credentials));
      if (!loginUser.fulfilled.match(actionResult)) {
        alert("Đăng nhập thất bại: Hãy kiểm tra lại thông tin.");
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
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
          Đăng Nhập
        </h2>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", fontWeight: "bold" }}>
            Tài khoản:
          </label>
          <input
            type="text"
            name="username"
            value={credentials.username}
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
            Mật khẩu:
          </label>
          <input
            type="password"
            name="password"
            value={credentials.password}
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
            backgroundColor: "#ffd700",
            color: "#1a1a1a",
            border: "none",
            fontWeight: "bold",
            cursor: "pointer",
            borderRadius: "4px",
          }}
        >
          Vào Hệ Thống
        </button>
      </form>
    </div>
  );
};

export default Login;
