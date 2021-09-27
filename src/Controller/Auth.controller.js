import { genSalt, hash, compare } from "bcrypt";
import { userModel } from "../Model/User.model";
import { loginTrackerModel } from "../Model/Logintracker.model";

export class AuthController {
  async signup(request, response) {
    const { email, password } = request.body;

    if (!email || !password) {
      return response.status(400).json({ msg: "All fields are required" });
    }
    const salt = await genSalt(18);
    const hashedPassword = await hash(password, salt);

    const newAccount = new userModel({
      email,
      password: hashedPassword,
    });
    try {
      const savedAccount = await newAccount.save();
      return response.status(201).json({ msg: "Account created successfully" });
    } catch (error) {
      return response.status(500).json(error);
    }
  }

  async signin(request, response) {
    const { email, password } = request.body;
    const key = email;

    const is_login_already_in_progress =
      await loginTrackerModel.loginInProgress(key);
    console.log("Login In Process: ", is_login_already_in_progress);
    if (is_login_already_in_progress) {
      return response.status(400).json({ msg: "Login already is progress" });
    }

    const can_start_login_process = await loginTrackerModel.canLogin(key);

    if (!can_start_login_process) {
      return response
        .status(400)
        .json({
          msg: "Temporarily blocked from logining in due to many failed attempts try again later",
        });
    }

    const user = await userModel.findOne({ email: email });

    if (!user) {
      return response
        .status(404)
        .json({ msg: "Account with this email does not exist" });
    }

    const is_password_valid = await compare(password, user.password);

    if (!is_password_valid) {
      console.log("Updating failed attempt:");
      await loginTrackerModel.loginFail(key);
      return response.status(400).json({ msg: "Invalid credentials" });
    }
    await loginTrackerModel.loginSuccess(key);
    const user_data = {
      _id: user._id,
      email: user.email,
    };
    request.session.LOGIN(user_data);
    return response.status(200).json({ msg: "Authenticated" });
  }

  async getUser(request, response) {
    const data = await userModel.find();
    return response.status(200).json(data);
  }
}
