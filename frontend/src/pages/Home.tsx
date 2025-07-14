import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {jwtDecode }from "jwt-decode";

export function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp && decoded.exp > currentTime) {
          navigate("/blogs");
        } else {
          // token expired
          navigate("/signin");
        }
      } catch (err) {
        // invalid token format
        navigate("/signin");
      }
    } else {
      navigate("/signin");
    }
  }, [navigate]);

  return null;
}
