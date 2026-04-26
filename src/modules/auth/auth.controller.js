import { loginService, registerService } from "./auth.service.js";

export const register = async (req, res) => {
  try {
    const result = await registerService(req.body);

    res.status(201).json({
      message: "Ro‘yxatdan o‘tildi",
      company: {
        id: result.id,
        name: result.name,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const result = await loginService(req.body);

    res.json({
      message: "Login muvaffaqiyatli",
      ...result,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};